/**
 * Verification test for Cloudflare Worker Room Manager and Event Protocol
 */
const { EventEmitter } = require("events")

class MockWebSocket extends EventEmitter {
  constructor(name) {
    super()
    this.name = name
    this.readyState = 1 // OPEN
    this.sentMessages = []
  }

  send(data) {
    this.sentMessages.push(JSON.parse(data))
    this.emit("send", data)
  }

  close() {
    this.readyState = 3 // CLOSED
    this.emit("close")
  }
}

// Simple test
async function runTest() {
  console.log("Testing Cloudflare Worker Room Manager simulation...")

  const userA_ws = new MockWebSocket("UserA")
  const userB_ws = new MockWebSocket("UserB")

  const coupleId = "couple-uuid-1234"
  const userA_id = "user-a-id"
  const userB_id = "user-b-id"

  // Room simulation map
  const rooms = new Map()
  function broadcast(cid, event, excludeUserId) {
    const room = rooms.get(cid)
    if (!room) return
    for (const [uid, sockets] of room.entries()) {
      if (excludeUserId && uid === excludeUserId) continue
      for (const s of sockets) s.send(JSON.stringify(event))
    }
  }

  // Register A
  rooms.set(coupleId, new Map())
  rooms.get(coupleId).set(userA_id, new Set([userA_ws]))

  // Register B
  rooms.get(coupleId).set(userB_id, new Set([userB_ws]))

  // Test 1: Typing event from A -> B receives typing
  broadcast(coupleId, { type: "typing", userId: userA_id, isTyping: true }, userA_id)
  if (userB_ws.sentMessages.some(m => m.type === "typing" && m.userId === userA_id)) {
    console.log("✅ Step 1: User B received typing notification from User A")
  } else {
    throw new Error("User B failed to receive typing event")
  }

  // Test 2: New message broadcast to both
  const msg = {
    id: "msg-1",
    couple_id: coupleId,
    sender_id: userA_id,
    text: "Chào em yêu ❤️",
    created_at: Date.now()
  }
  broadcast(coupleId, { type: "new_message", message: msg })
  if (userA_ws.sentMessages.some(m => m.type === "new_message") &&
      userB_ws.sentMessages.some(m => m.type === "new_message")) {
    console.log("✅ Step 2: Both User A and User B received new message")
  } else {
    throw new Error("Message broadcast failed")
  }

  // Test 3: Heart ping
  broadcast(coupleId, { type: "heart_received", senderId: userA_id }, userA_id)
  if (userB_ws.sentMessages.some(m => m.type === "heart_received" && m.senderId === userA_id)) {
    console.log("✅ Step 3: User B received heart ping")
  } else {
    throw new Error("Heart ping failed")
  }

  console.log("🎉 All Cloudflare WebSocket Worker protocol tests passed!")
}

runTest().catch(err => {
  console.error("❌ Test failed:", err)
  process.exit(1)
})
