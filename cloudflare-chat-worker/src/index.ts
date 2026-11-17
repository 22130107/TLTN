import { roomManager } from "./roomManager.ts"
import {
  getRecentMessages,
  saveMessage,
  getCoupleStatus,
  createCoupleRequest,
  acceptCoupleRequest,
  rejectCoupleRequest,
  cancelCoupleRequest,
  unpairCouple,
  updateAnniversary,
} from "./db.ts"
import type {
  Env,
  WsClientAction,
  CoupleMessage,
  ExecutionContext,
} from "./types.ts"

const corsHeaders: Record<string, string> = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
}

function jsonResponse(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders,
    },
  })
}

async function parseBody<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T
  } catch {
    return null
  }
}

export default {
  async fetch(
    request: Request,
    env: Env = {},
    ctx: ExecutionContext = {
      waitUntil: () => {},
      passThroughOnException: () => {},
    },
  ): Promise<Response> {
    // CORS Preflight Options
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      })
    }

    const url = new URL(request.url)

    // Health check endpoint
    if (url.pathname === "/health" || url.pathname === "/") {
      if (request.headers.get("Upgrade") !== "websocket") {
        return jsonResponse({
          status: "ok",
          service: "HYUN Couple Cloudflare WebSocket Worker",
          timestamp: Date.now(),
        })
      }
    }

    // -------------------------------------------------------------
    // HTTP REST API Endpoints
    // -------------------------------------------------------------

    // GET /api/couple/status?userId=<id>
    if (url.pathname === "/api/couple/status") {
      if (request.method !== "GET") {
        return jsonResponse(
          { success: false, error: "Method not allowed" },
          405,
        )
      }
      const userId = url.searchParams.get("userId")
      if (!userId) {
        return jsonResponse(
          { success: false, error: "userId parameter is required" },
          400,
        )
      }
      const status = await getCoupleStatus(env.CHAT_DB, userId)
      return jsonResponse({
        success: true,
        ...status,
      })
    }

    // POST /api/couple/request
    if (url.pathname === "/api/couple/request") {
      if (request.method !== "POST") {
        return jsonResponse(
          { success: false, error: "Method not allowed" },
          405,
        )
      }
      const body = await parseBody<{
        senderId?: string
        receiverId?: string
      }>(request)
      if (!body) {
        return jsonResponse({ success: false, error: "Invalid JSON body" }, 400)
      }
      const result = await createCoupleRequest(
        env.CHAT_DB,
        body.senderId || "",
        body.receiverId || "",
      )
      return jsonResponse(result, result.success ? 200 : 400)
    }

    // POST /api/couple/accept
    if (url.pathname === "/api/couple/accept") {
      if (request.method !== "POST") {
        return jsonResponse(
          { success: false, error: "Method not allowed" },
          405,
        )
      }
      const body = await parseBody<{
        requestId?: string
        userId?: string
      }>(request)
      if (!body) {
        return jsonResponse({ success: false, error: "Invalid JSON body" }, 400)
      }
      const result = await acceptCoupleRequest(
        env.CHAT_DB,
        body.requestId || "",
        body.userId || "",
      )
      return jsonResponse(result, result.success ? 200 : 400)
    }

    // POST /api/couple/reject
    if (url.pathname === "/api/couple/reject") {
      if (request.method !== "POST") {
        return jsonResponse(
          { success: false, error: "Method not allowed" },
          405,
        )
      }
      const body = await parseBody<{
        requestId?: string
        userId?: string
      }>(request)
      if (!body) {
        return jsonResponse({ success: false, error: "Invalid JSON body" }, 400)
      }
      const result = await rejectCoupleRequest(
        env.CHAT_DB,
        body.requestId || "",
        body.userId || "",
      )
      return jsonResponse(result, result.success ? 200 : 400)
    }

    // POST /api/couple/cancel
    if (url.pathname === "/api/couple/cancel") {
      if (request.method !== "POST") {
        return jsonResponse(
          { success: false, error: "Method not allowed" },
          405,
        )
      }
      const body = await parseBody<{
        requestId?: string
        userId?: string
      }>(request)
      if (!body) {
        return jsonResponse({ success: false, error: "Invalid JSON body" }, 400)
      }
      const result = await cancelCoupleRequest(
        env.CHAT_DB,
        body.requestId || "",
        body.userId || "",
      )
      return jsonResponse(result, result.success ? 200 : 400)
    }

    // POST /api/couple/unpair
    if (url.pathname === "/api/couple/unpair") {
      if (request.method !== "POST") {
        return jsonResponse(
          { success: false, error: "Method not allowed" },
          405,
        )
      }
      const body = await parseBody<{
        coupleId?: string
        userId?: string
      }>(request)
      if (!body) {
        return jsonResponse({ success: false, error: "Invalid JSON body" }, 400)
      }
      const result = await unpairCouple(
        env.CHAT_DB,
        body.coupleId || "",
        body.userId || "",
      )
      return jsonResponse(result, result.success ? 200 : 400)
    }

    // POST /api/couple/anniversary
    if (url.pathname === "/api/couple/anniversary") {
      if (request.method !== "POST") {
        return jsonResponse(
          { success: false, error: "Method not allowed" },
          405,
        )
      }
      const body = await parseBody<{
        coupleId?: string
        userId?: string
        anniversaryDate?: string
        date?: string
      }>(request)
      if (!body) {
        return jsonResponse({ success: false, error: "Invalid JSON body" }, 400)
      }
      const date = body.anniversaryDate || body.date || ""
      const result = await updateAnniversary(
        env.CHAT_DB,
        body.coupleId || "",
        body.userId || "",
        date,
      )
      return jsonResponse(result, result.success ? 200 : 400)
    }

    // POST /api/couple/message (HTTP fallback for sending messages)
    if (url.pathname === "/api/couple/message") {
      if (request.method !== "POST") {
        return jsonResponse(
          { success: false, error: "Method not allowed" },
          405,
        )
      }
      const body = await parseBody<{
        coupleId?: string
        senderId?: string
        text?: string
        type?: "text" | "heart" | "image"
      }>(request)
      if (!body || !body.coupleId || !body.senderId) {
        return jsonResponse(
          { success: false, error: "Missing required fields" },
          400,
        )
      }
      const msg: CoupleMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        couple_id: body.coupleId,
        sender_id: body.senderId,
        text: (body.text || "").trim(),
        type: body.type || "text",
        status: "sent",
        created_at: Date.now(),
      }
      await saveMessage(env.CHAT_DB, msg)
      // Broadcast to room if connected
      roomManager.broadcastToRoom(
        body.coupleId,
        { type: "new_message", message: msg },
        body.senderId,
      )
      return jsonResponse({ success: true, message: msg }, 200)
    }

    // GET /api/couple/messages?coupleId=<id>&limit=100 (HTTP fallback for history)
    if (url.pathname === "/api/couple/messages") {
      if (request.method !== "GET") {
        return jsonResponse(
          { success: false, error: "Method not allowed" },
          405,
        )
      }
      const coupleId = url.searchParams.get("coupleId")
      if (!coupleId) {
        return jsonResponse(
          { success: false, error: "coupleId parameter is required" },
          400,
        )
      }
      const limit = parseInt(url.searchParams.get("limit") || "100", 10)
      const messages = await getRecentMessages(env.CHAT_DB, coupleId, limit)
      return jsonResponse({ success: true, messages }, 200)
    }

    // Unknown API routes
    if (url.pathname.startsWith("/api/")) {
      return jsonResponse({ success: false, error: "Not found" }, 404)
    }

    // -------------------------------------------------------------
    // WebSocket Upgrade Handler
    // -------------------------------------------------------------
    const upgradeHeader = request.headers.get("Upgrade")
    if (upgradeHeader !== "websocket") {
      return new Response("Expected Upgrade: websocket", {
        status: 426,
        headers: corsHeaders,
      })
    }

    const coupleId = url.searchParams.get("coupleId")
    const userId = url.searchParams.get("userId")

    if (!coupleId || !userId) {
      return new Response("Missing coupleId or userId query parameter", {
        status: 400,
        headers: corsHeaders,
      })
    }

    // Cloudflare WebSocket Pair
    // @ts-ignore WebSocketPair is defined in Cloudflare Workers runtime
    const webSocketPair = new WebSocketPair()
    const [client, server] = Object.values(
      webSocketPair,
    ) as [WebSocket, WebSocket]

    // @ts-ignore accept() method on Cloudflare server WebSocket
    server.accept()

    // Register client in room
    roomManager.addClient(coupleId, userId, server)

    // Handle WebSocket events
    server.addEventListener("message", async (event: MessageEvent) => {
      try {
        const rawData = typeof event.data === "string" ? event.data : ""
        if (!rawData) return

        const action = JSON.parse(rawData) as WsClientAction

        switch (action.type) {
          case "join": {
            // Nạp lịch sử 50-100 tin gần nhất
            const history = await getRecentMessages(env.CHAT_DB, coupleId, 100)
            server.send(
              JSON.stringify({
                type: "history",
                messages: history,
              }),
            )

            // Báo cho user biết đối phương hiện tại có đang online hay không
            const isOnline = roomManager.isPartnerOnline(coupleId, userId)
            server.send(
              JSON.stringify({
                type: "partner_status",
                isOnline,
              }),
            )
            break
          }

          case "message": {
            if (!action.text || !action.text.trim()) return

            const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
            const newMsg: CoupleMessage = {
              id: messageId,
              couple_id: coupleId,
              sender_id: userId,
              text: action.text.trim(),
              type: action.msgType || "text",
              status: "sent",
              created_at: Date.now(),
            }

            // Lưu vào D1 (async ở background nếu có executionCtx)
            ctx.waitUntil(saveMessage(env.CHAT_DB, newMsg))

            // Phát sóng ngay lập tức tới cả 2 người trong phòng
            roomManager.broadcastToRoom(coupleId, {
              type: "new_message",
              message: newMsg,
            })
            break
          }

          case "typing": {
            roomManager.broadcastToRoom(
              coupleId,
              {
                type: "typing",
                userId,
                isTyping: !!action.isTyping,
              },
              userId,
            )
            break
          }

          case "heart_ping": {
            roomManager.broadcastToRoom(
              coupleId,
              {
                type: "heart_received",
                senderId: userId,
              },
              userId,
            )
            break
          }
        }
      } catch (err) {
        console.error("Error processing websocket message:", err)
        server.send(
          JSON.stringify({
            type: "error",
            message: "Malformed JSON payload",
          }),
        )
      }
    })

    server.addEventListener("close", () => {
      roomManager.removeClient(coupleId, userId, server)
    })

    server.addEventListener("error", () => {
      roomManager.removeClient(coupleId, userId, server)
    })

    return new Response(null, {
      status: 101,
      // @ts-ignore webSocket response property in Cloudflare Workers
      webSocket: client,
    })
  },
}
