import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase/client"

interface LocalProfile {
  id: string
  display_name: string
  avatar_url: string
  email?: string
}

interface LocalCouple {
  id: string
  user_1: string
  user_2: string
  anniversary_date: string
  nickname_1?: string | null
  nickname_2?: string | null
  status: "active" | "separated"
  created_at: number
  updated_at: number
  partner?: LocalProfile
}

interface LocalRequest {
  id: string
  sender_id: string
  receiver_id: string
  status: "pending" | "accepted" | "rejected" | "canceled"
  created_at: number
  updated_at: number
  sender_profile?: LocalProfile
  receiver_profile?: LocalProfile
}

interface LocalMessage {
  id: string
  couple_id: string
  sender_id: string
  text: string
  type: "text" | "heart" | "image"
  status?: "sent" | "delivered" | "read"
  created_at: number
}

// In-memory store for dev / fallback when CF worker is not running
const memoryCouples = new Map<string, LocalCouple>()
const memoryRequests = new Map<string, LocalRequest>()
const memoryMessages = new Map<string, LocalMessage[]>()

const CF_WORKER_HTTP_URL =
  process.env.CF_CHAT_WORKER_URL ||
  process.env.NEXT_PUBLIC_CF_CHAT_HTTP_URL ||
  "http://127.0.0.1:8787"

/**
 * Fetch profile info from Supabase profiles table
 */
async function getProfile(userIdOrEmail: string): Promise<LocalProfile | null> {
  try {
    const isEmail = userIdOrEmail.includes("@")
    const query = supabase
      .from("profiles")
      .select("id, display_name, avatar_url, email")

    const { data, error } = isEmail
      ? await query.ilike("email", userIdOrEmail.trim()).maybeSingle()
      : await query.eq("id", userIdOrEmail.trim()).maybeSingle()

    if (error || !data) {
      return null
    }

    const row = data as {
      id: string
      display_name: string | null
      avatar_url: string | null
      email: string | null
    }

    return {
      id: row.id,
      display_name: row.display_name || "Thực khách HYUN",
      avatar_url: row.avatar_url || "/img/profile-avatar.png",
      email: row.email || undefined,
    }
  } catch (err) {
    console.warn("[API Couple] Failed to query Supabase profile:", err)
    return null
  }
}

/**
 * Forward request to Cloudflare Worker with timeout
 */
async function forwardToWorker(
  path: string,
  method: "GET" | "POST",
  body?: unknown,
): Promise<{ ok: boolean status: number data: any }> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 1800)

    const url = `${CF_WORKER_HTTP_URL}${path}`
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    })

    clearTimeout(timeoutId)
    const data = await res.json()
    return { ok: res.ok, status: res.status, data }
  } catch {
    return { ok: false, status: 503, data: null }
  }
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ action: string[] }> },
) {
  const { action } = await context.params
  const endpoint = action?.[0]
  const { searchParams } = new URL(req.url)

  // 1. GET /api/couple/status?userId=<id>
  if (endpoint === "status") {
    const userId = searchParams.get("userId")
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "userId query parameter is required" },
        { status: 400 },
      )
    }

    // Attempt forward to Cloudflare Worker
    const workerRes = await forwardToWorker(
      `/api/couple/status?userId=${encodeURIComponent(userId)}`,
      "GET",
    )

    let couple: LocalCouple | null = null
    let incomingRequests: LocalRequest[] = []
    let outgoingRequests: LocalRequest[] = []

    if (workerRes.ok && workerRes.data?.success) {
      couple = workerRes.data.couple || null
      incomingRequests = workerRes.data.incomingRequests || []
      outgoingRequests = workerRes.data.outgoingRequests || []
    } else {
      // In-memory fallback
      for (const c of memoryCouples.values()) {
        if (
          (c.user_1 === userId || c.user_2 === userId) &&
          c.status === "active"
        ) {
          couple = c
          break
        }
      }

      for (const r of memoryRequests.values()) {
        if (r.status === "pending") {
          if (r.receiver_id === userId) incomingRequests.push(r)
          if (r.sender_id === userId) outgoingRequests.push(r)
        }
      }
    }

    // Enrich profiles
    if (couple) {
      const partnerId = couple.user_1 === userId ? couple.user_2 : couple.user_1
      const partnerProfile = await getProfile(partnerId)
      couple.partner = partnerProfile || {
        id: partnerId,
        display_name: "Người thương",
        avatar_url: "/img/profile-avatar.png",
      }
    }

    const [enrichedIncoming, enrichedOutgoing] = await Promise.all([
      Promise.all(
        incomingRequests.map(async (req) => {
          const senderProfile = await getProfile(req.sender_id)
          return {
            ...req,
            sender_profile: senderProfile || {
              id: req.sender_id,
              display_name: "Người dùng",
              avatar_url: "/img/profile-avatar.png",
            },
          }
        }),
      ),
      Promise.all(
        outgoingRequests.map(async (req) => {
          const receiverProfile = await getProfile(req.receiver_id)
          return {
            ...req,
            receiver_profile: receiverProfile || {
              id: req.receiver_id,
              display_name: "Đối phương",
              avatar_url: "/img/profile-avatar.png",
            },
          }
        }),
      ),
    ])

    return NextResponse.json({
      success: true,
      couple,
      incomingRequests: enrichedIncoming,
      outgoingRequests: enrichedOutgoing,
    })
  }

  // 2. GET /api/couple/messages?coupleId=<id>&limit=100
  if (endpoint === "messages") {
    const coupleId = searchParams.get("coupleId")
    if (!coupleId) {
      return NextResponse.json(
        { success: false, error: "coupleId query parameter is required" },
        { status: 400 },
      )
    }

    const workerRes = await forwardToWorker(
      `/api/couple/messages?coupleId=${encodeURIComponent(coupleId)}&limit=${searchParams.get("limit") || "100"}`,
      "GET",
    )

    if (workerRes.ok && workerRes.data?.success) {
      return NextResponse.json(workerRes.data)
    }

    const localMsgs = memoryMessages.get(coupleId) || []
    return NextResponse.json({ success: true, messages: localMsgs })
  }

  return NextResponse.json({ success: false, error: "Endpoint not found" }, {
    status: 404,
  })
}

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ action: string[] }> },
) {
  const { action } = await context.params
  const endpoint = action?.[0]

  let body: any = {}
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON body" }, {
      status: 400,
    })
  }

  // 1. POST /api/couple/request
  if (endpoint === "request") {
    const { senderId, target } = body
    if (!senderId || !target) {
      return NextResponse.json(
        { success: false, error: "senderId và User ID/Email là bắt buộc" },
        { status: 400 },
      )
    }

    // Resolve target to user profile (supports UUID or Email)
    const targetProfile = await getProfile(target)
    if (!targetProfile) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Không tìm thấy tài khoản người dùng với thông tin này. Vui lòng kiểm tra lại ID hoặc Email.",
        },
        { status: 404 },
      )
    }

    const receiverId = targetProfile.id
    if (senderId === receiverId) {
      return NextResponse.json(
        { success: false, error: "Bạn không thể tự kết nối với chính mình" },
        { status: 400 },
      )
    }

    // Forward to worker
    const workerRes = await forwardToWorker("/api/couple/request", "POST", {
      senderId,
      receiverId,
    })

    if (workerRes.ok && workerRes.data?.success) {
      return NextResponse.json({
        ...workerRes.data,
        receiver_profile: targetProfile,
      })
    }

    // In-memory fallback
    const requestId = `req-${Date.now()}`
    const newRequest: LocalRequest = {
      id: requestId,
      sender_id: senderId,
      receiver_id: receiverId,
      status: "pending",
      created_at: Date.now(),
      updated_at: Date.now(),
      receiver_profile: targetProfile,
    }
    memoryRequests.set(requestId, newRequest)

    return NextResponse.json({
      success: true,
      request: newRequest,
    })
  }

  // 2. POST /api/couple/accept
  if (endpoint === "accept") {
    const { requestId, userId } = body
    const workerRes = await forwardToWorker("/api/couple/accept", "POST", {
      requestId,
      userId,
    })

    if (workerRes.ok && workerRes.data?.success) {
      return NextResponse.json(workerRes.data)
    }

    // In-memory fallback
    const reqItem = memoryRequests.get(requestId)
    if (!reqItem || reqItem.receiver_id !== userId) {
      return NextResponse.json(
        { success: false, error: "Lời mời không hợp lệ hoặc đã xử lý" },
        { status: 400 },
      )
    }

    reqItem.status = "accepted"
    reqItem.updated_at = Date.now()

    const coupleId = `cpl-${Date.now()}`
    const newCouple: LocalCouple = {
      id: coupleId,
      user_1: reqItem.sender_id,
      user_2: reqItem.receiver_id,
      anniversary_date: new Date().toISOString().split("T")[0],
      status: "active",
      created_at: Date.now(),
      updated_at: Date.now(),
    }
    memoryCouples.set(coupleId, newCouple)

    const partnerProfile = await getProfile(reqItem.sender_id)
    newCouple.partner = partnerProfile || {
      id: reqItem.sender_id,
      display_name: "Người thương",
      avatar_url: "/img/profile-avatar.png",
    }

    return NextResponse.json({
      success: true,
      couple: newCouple,
    })
  }

  // 3. POST /api/couple/reject
  if (endpoint === "reject") {
    const { requestId, userId } = body
    const workerRes = await forwardToWorker("/api/couple/reject", "POST", {
      requestId,
      userId,
    })

    if (workerRes.ok && workerRes.data?.success) {
      return NextResponse.json(workerRes.data)
    }

    const reqItem = memoryRequests.get(requestId)
    if (reqItem) {
      reqItem.status = "rejected"
      reqItem.updated_at = Date.now()
    }
    return NextResponse.json({ success: true })
  }

  // 4. POST /api/couple/cancel
  if (endpoint === "cancel") {
    const { requestId, userId } = body
    const workerRes = await forwardToWorker("/api/couple/cancel", "POST", {
      requestId,
      userId,
    })

    if (workerRes.ok && workerRes.data?.success) {
      return NextResponse.json(workerRes.data)
    }

    const reqItem = memoryRequests.get(requestId)
    if (reqItem) {
      reqItem.status = "canceled"
      reqItem.updated_at = Date.now()
    }
    return NextResponse.json({ success: true })
  }

  // 5. POST /api/couple/unpair
  if (endpoint === "unpair") {
    const { coupleId, userId } = body
    const workerRes = await forwardToWorker("/api/couple/unpair", "POST", {
      coupleId,
      userId,
    })

    if (workerRes.ok && workerRes.data?.success) {
      return NextResponse.json(workerRes.data)
    }

    const c = memoryCouples.get(coupleId)
    if (c) {
      c.status = "separated"
      c.updated_at = Date.now()
    }
    return NextResponse.json({ success: true })
  }

  // 6. POST /api/couple/anniversary
  if (endpoint === "anniversary") {
    const { coupleId, userId, date } = body
    const workerRes = await forwardToWorker("/api/couple/anniversary", "POST", {
      coupleId,
      userId,
      date,
    })

    if (workerRes.ok && workerRes.data?.success) {
      return NextResponse.json(workerRes.data)
    }

    const c = memoryCouples.get(coupleId)
    if (c && date) {
      c.anniversary_date = date
      c.updated_at = Date.now()
    }
    return NextResponse.json({ success: true })
  }

  // 7. POST /api/couple/message
  if (endpoint === "message") {
    const { coupleId, senderId, text, type } = body
    const workerRes = await forwardToWorker("/api/couple/message", "POST", {
      coupleId,
      senderId,
      text,
      type,
    })

    if (workerRes.ok && workerRes.data?.success) {
      return NextResponse.json(workerRes.data)
    }

    const msg: LocalMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      couple_id: coupleId,
      sender_id: senderId,
      text: (text || "").trim(),
      type: type || "text",
      status: "sent",
      created_at: Date.now(),
    }

    const list = memoryMessages.get(coupleId) || []
    list.push(msg)
    memoryMessages.set(coupleId, list)

    return NextResponse.json({ success: true, message: msg })
  }

  return NextResponse.json({ success: false, error: "Endpoint not found" }, {
    status: 404,
  })
}
