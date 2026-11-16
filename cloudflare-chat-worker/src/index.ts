import { roomManager } from "./roomManager"
import { getRecentMessages, saveMessage } from "./db"
import type { Env, WsClientAction, CoupleMessage } from "./types"

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url)

    // Health check endpoint
    if (url.pathname === "/health" || url.pathname === "/") {
      if (request.headers.get("Upgrade") !== "websocket") {
        return new Response(
          JSON.stringify({
            status: "ok",
            service: "HYUN Couple Cloudflare WebSocket Worker",
            timestamp: Date.now(),
          }),
          {
            headers: {
              "Content-Type": "application/json",
              "Access-Control-Allow-Origin": "*",
            },
          }
        )
      }
    }

    // WebSocket Upgrade Handler
    const upgradeHeader = request.headers.get("Upgrade")
    if (upgradeHeader !== "websocket") {
      return new Response("Expected Upgrade: websocket", { status: 426 })
    }

    const coupleId = url.searchParams.get("coupleId")
    const userId = url.searchParams.get("userId")

    if (!coupleId || !userId) {
      return new Response("Missing coupleId or userId query parameter", { status: 400 })
    }

    // Cloudflare WebSocket Pair
    // @ts-ignore WebSocketPair is defined in Cloudflare Workers runtime
    const webSocketPair = new WebSocketPair()
    const [client, server] = Object.values(webSocketPair) as [WebSocket, WebSocket]

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
              })
            )

            // Báo cho user biết đối phương hiện tại có đang online hay không
            const isOnline = roomManager.isPartnerOnline(coupleId, userId)
            server.send(
              JSON.stringify({
                type: "partner_status",
                isOnline,
              })
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
              userId
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
              userId
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
          })
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
