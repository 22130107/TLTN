import type { WsServerEvent } from "./types"

interface ClientSession {
  ws: WebSocket
  userId: string
  coupleId: string
}

class RoomManager {
  // Map: coupleId -> Map<userId, Set<WebSocket>>
  private rooms = new Map<string, Map<string, Set<WebSocket>>>()

  addClient(coupleId: string, userId: string, ws: WebSocket): void {
    if (!this.rooms.has(coupleId)) {
      this.rooms.set(coupleId, new Map())
    }

    const coupleRoom = this.rooms.get(coupleId)!
    if (!coupleRoom.has(userId)) {
      coupleRoom.set(userId, new Set())
    }

    coupleRoom.get(userId)!.add(ws)

    // Notify other partner that user came online
    this.broadcastToRoom(coupleId, {
      type: "partner_status",
      isOnline: true,
    }, userId)
  }

  removeClient(coupleId: string, userId: string, ws: WebSocket): void {
    const coupleRoom = this.rooms.get(coupleId)
    if (!coupleRoom) return

    const userSockets = coupleRoom.get(userId)
    if (userSockets) {
      userSockets.delete(ws)
      if (userSockets.size === 0) {
        coupleRoom.delete(userId)
        // User has no more active tabs -> notify partner that user is offline
        this.broadcastToRoom(coupleId, {
          type: "partner_status",
          isOnline: false,
        }, userId)
      }
    }

    if (coupleRoom.size === 0) {
      this.rooms.delete(coupleId)
    }
  }

  isPartnerOnline(coupleId: string, currentUserId: string): boolean {
    const coupleRoom = this.rooms.get(coupleId)
    if (!coupleRoom) return false

    for (const [userId, sockets] of coupleRoom.entries()) {
      if (userId !== currentUserId && sockets.size > 0) {
        return true
      }
    }
    return false
  }

  broadcastToRoom(
    coupleId: string,
    event: WsServerEvent,
    excludeUserId?: string
  ): void {
    const coupleRoom = this.rooms.get(coupleId)
    if (!coupleRoom) return

    const serialized = JSON.stringify(event)

    for (const [userId, sockets] of coupleRoom.entries()) {
      if (excludeUserId && userId === excludeUserId) {
        continue
      }

      for (const ws of sockets) {
        try {
          // Cloudflare WebSocket readyState: 1 === OPEN
          if (ws.readyState === 1) {
            ws.send(serialized)
          }
        } catch (err) {
          console.error("Error sending message to ws:", err)
        }
      }
    }
  }

  sendToUser(
    coupleId: string,
    userId: string,
    event: WsServerEvent
  ): void {
    const coupleRoom = this.rooms.get(coupleId)
    if (!coupleRoom) return

    const sockets = coupleRoom.get(userId)
    if (!sockets) return

    const serialized = JSON.stringify(event)
    for (const ws of sockets) {
      try {
        if (ws.readyState === 1) {
          ws.send(serialized)
        }
      } catch (err) {
        console.error("Error sending message to user ws:", err)
      }
    }
  }
}

export const roomManager = new RoomManager()
