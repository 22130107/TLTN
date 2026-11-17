import { supabase } from "@/lib/supabase/client"
import type {
  Couple,
  CoupleRequest,
  CoupleProfile,
  CoupleMessage,
} from "@/types/couple"
import type { ProfileRow } from "@/lib/supabase/types"

/**
 * Lấy thông tin tóm tắt của một người dùng theo ID hoặc Email từ Supabase
 */
export async function getUserProfileById(
  userIdOrEmail: string,
): Promise<CoupleProfile | null> {
  try {
    const trimmed = userIdOrEmail.trim()
    const isEmail = trimmed.includes("@")

    const query = supabase
      .from("profiles")
      .select("id, display_name, avatar_url, email")

    const { data, error } = isEmail
      ? await query.ilike("email", trimmed).maybeSingle()
      : await query.eq("id", trimmed).maybeSingle()

    if (error || !data) {
      return null
    }

    const row = data as unknown as ProfileRow

    return {
      id: row.id,
      display_name: row.display_name || "Thực khách HYUN",
      avatar_url: row.avatar_url || "/img/profile-avatar.png",
      email: row.email || undefined,
    }
  } catch (err) {
    console.error("Lỗi khi lấy thông tin profile:", err)
    return null
  }
}

/**
 * Lấy toàn bộ trạng thái cặp đôi trong một lần gọi API (Active couple, Incoming, Outgoing)
 */
export async function getCoupleFullStatus(
  userId: string,
): Promise<{
  couple: Couple | null
  incomingRequests: CoupleRequest[]
  outgoingRequests: CoupleRequest[]
}> {
  try {
    const res = await fetch(
      `/api/couple/status?userId=${encodeURIComponent(userId)}`,
      {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
      },
    )

    if (!res.ok) {
      throw new Error(`HTTP error ${res.status}`)
    }

    const data = await res.json()
    if (!data.success) {
      throw new Error(data.error || "Không thể tải trạng thái cặp đôi")
    }

    return {
      couple: data.couple || null,
      incomingRequests: data.incomingRequests || [],
      outgoingRequests: data.outgoingRequests || [],
    }
  } catch (err) {
    console.error("Lỗi khi lấy trạng thái cặp đôi:", err)
    return {
      couple: null,
      incomingRequests: [],
      outgoingRequests: [],
    }
  }
}

/**
 * Lấy mối quan hệ cặp đôi đang active của một người dùng
 */
export async function getActiveCouple(userId: string): Promise<Couple | null> {
  const status = await getCoupleFullStatus(userId)
  return status.couple
}

/**
 * Lấy danh sách các lời mời ghép đôi đang chờ gửi đến người dùng
 */
export async function getPendingIncomingRequests(
  userId: string,
): Promise<CoupleRequest[]> {
  const status = await getCoupleFullStatus(userId)
  return status.incomingRequests
}

/**
 * Lấy danh sách các lời mời ghép đôi người dùng đã gửi và đang chờ duyệt
 */
export async function getPendingOutgoingRequests(
  userId: string,
): Promise<CoupleRequest[]> {
  const status = await getCoupleFullStatus(userId)
  return status.outgoingRequests
}

/**
 * Gửi lời mời ghép đôi qua User ID hoặc Email của đối phương
 */
export async function sendCoupleRequest(
  senderId: string,
  target: string,
): Promise<{ success: boolean; error?: string; request?: CoupleRequest }> {
  try {
    const trimmedTarget = target.trim()
    if (!trimmedTarget) {
      return {
        success: false,
        error: "Vui lòng nhập User ID hoặc Email của đối phương",
      }
    }

    const res = await fetch("/api/couple/request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ senderId, target: trimmedTarget }),
    })

    const data = await res.json()
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Gửi lời mời thất bại" }
    }

    return {
      success: true,
      request: data.request,
    }
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định"
    return { success: false, error: message }
  }
}

/**
 * Chấp nhận lời mời ghép đôi
 */
export async function acceptCoupleRequest(
  requestId: string,
  currentUserId: string,
): Promise<{ success: boolean; couple?: Couple; error?: string }> {
  try {
    const res = await fetch("/api/couple/accept", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, userId: currentUserId }),
    })

    const data = await res.json()
    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || "Chấp nhận lời mời thất bại",
      }
    }

    return {
      success: true,
      couple: data.couple,
    }
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Đã xảy ra lỗi khi chấp nhận lời mời"
    return { success: false, error: message }
  }
}

/**
 * Từ chối lời mời ghép đôi
 */
export async function rejectCoupleRequest(
  requestId: string,
  currentUserId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/couple/reject", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, userId: currentUserId }),
    })

    const data = await res.json()
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Từ chối lời mời thất bại" }
    }

    return { success: true }
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Lỗi khi từ chối lời mời"
    return { success: false, error: message }
  }
}

/**
 * Hủy lời mời đã gửi
 */
export async function cancelCoupleRequest(
  requestId: string,
  currentUserId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/couple/cancel", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ requestId, userId: currentUserId }),
    })

    const data = await res.json()
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Hủy lời mời thất bại" }
    }

    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi khi hủy lời mời"
    return { success: false, error: message }
  }
}

/**
 * Hủy ghép đôi (Unpair)
 */
export async function unpairCouple(
  coupleId: string,
  currentUserId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/couple/unpair", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coupleId, userId: currentUserId }),
    })

    const data = await res.json()
    if (!res.ok || !data.success) {
      return { success: false, error: data.error || "Hủy ghép đôi thất bại" }
    }

    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi khi hủy ghép đôi"
    return { success: false, error: message }
  }
}

/**
 * Cập nhật ngày kỷ niệm
 */
export async function updateAnniversaryDate(
  coupleId: string,
  currentUserId: string,
  newDate: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch("/api/couple/anniversary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coupleId, userId: currentUserId, date: newDate }),
    })

    const data = await res.json()
    if (!res.ok || !data.success) {
      return {
        success: false,
        error: data.error || "Cập nhật ngày kỷ niệm thất bại",
      }
    }

    return { success: true }
  } catch (err: unknown) {
    const message =
      err instanceof Error ? err.message : "Lỗi khi cập nhật ngày kỷ niệm"
    return { success: false, error: message }
  }
}

/**
 * Lấy danh sách tin nhắn gần nhất qua HTTP
 */
export async function fetchCoupleMessages(
  coupleId: string,
  limit = 100,
): Promise<CoupleMessage[]> {
  try {
    const res = await fetch(
      `/api/couple/messages?coupleId=${encodeURIComponent(coupleId)}&limit=${limit}`,
      { cache: "no-store" },
    )
    if (!res.ok) return []
    const data = await res.json()
    return data.messages || []
  } catch (err) {
    console.warn("Lỗi khi tải tin nhắn qua HTTP:", err)
    return []
  }
}

/**
 * Gửi tin nhắn qua HTTP (khi WebSocket gián đoạn)
 */
export async function sendCoupleMessageHttp(
  coupleId: string,
  senderId: string,
  text: string,
  type: "text" | "heart" = "text",
): Promise<{ success: boolean; message?: CoupleMessage; error?: string }> {
  try {
    const res = await fetch("/api/couple/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ coupleId, senderId, text, type }),
    })
    const data = await res.json()
    return data
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : "Không thể gửi tin nhắn qua HTTP",
    }
  }
}
