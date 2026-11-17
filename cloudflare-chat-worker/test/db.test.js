import assert from "node:assert/strict"
import {
  clearMemoryCache,
  getCoupleStatus,
  createCoupleRequest,
  acceptCoupleRequest,
  rejectCoupleRequest,
  cancelCoupleRequest,
  unpairCouple,
  updateAnniversary,
  getRecentMessages,
  saveMessage,
} from "../src/db.ts"

function pass(name) {
  console.log(`  \x1b[32m✔\x1b[0m ${name}`)
}

async function runTests() {
  console.log("\n🧪 Running Cloudflare D1 & In-Memory DB Helper Tests\n")

  // -------------------------------------------------------------
  // Test 1: Initial state & getCoupleStatus
  // -------------------------------------------------------------
  console.log("Suite 1: Initial Status & In-Memory Fallback")
  clearMemoryCache()

  const initialStatus = await getCoupleStatus(undefined, "user_100")
  assert.equal(initialStatus.couple, null)
  assert.equal(initialStatus.incomingRequests.length, 0)
  assert.equal(initialStatus.outgoingRequests.length, 0)
  pass("Fresh user has no couple and no incoming/outgoing requests")

  // -------------------------------------------------------------
  // Test 2: Couple request validation & creation
  // -------------------------------------------------------------
  console.log("\nSuite 2: Create Couple Request & Validation")

  const emptyReq = await createCoupleRequest(undefined, "", "user_b")
  assert.equal(emptyReq.success, false)
  assert.ok(emptyReq.error.includes("required"))
  pass("Fails when sender or receiver is missing")

  const selfReq = await createCoupleRequest(undefined, "user_a", "user_a")
  assert.equal(selfReq.success, false)
  assert.ok(selfReq.error.includes("yourself"))
  pass("Fails when trying to pair with yourself")

  const validReq = await createCoupleRequest(undefined, "user_a", "user_b")
  assert.equal(validReq.success, true)
  assert.ok(validReq.request)
  assert.equal(validReq.request.sender_id, "user_a")
  assert.equal(validReq.request.receiver_id, "user_b")
  assert.equal(validReq.request.status, "pending")
  pass("Successfully creates pending request between user_a and user_b")

  // Check getCoupleStatus
  const statusA = await getCoupleStatus(undefined, "user_a")
  assert.equal(statusA.outgoingRequests.length, 1)
  assert.equal(statusA.outgoingRequests[0].receiver_id, "user_b")
  assert.equal(statusA.incomingRequests.length, 0)

  const statusB = await getCoupleStatus(undefined, "user_b")
  assert.equal(statusB.incomingRequests.length, 1)
  assert.equal(statusB.incomingRequests[0].sender_id, "user_a")
  assert.equal(statusB.outgoingRequests.length, 0)
  pass("getCoupleStatus correctly reflects incoming and outgoing requests")

  // Prevent duplicate requests
  const dupReq1 = await createCoupleRequest(undefined, "user_a", "user_b")
  assert.equal(dupReq1.success, false)
  assert.ok(dupReq1.error.includes("already exists"))
  pass("Prevents duplicate pending request in same direction")

  const dupReq2 = await createCoupleRequest(undefined, "user_b", "user_a")
  assert.equal(dupReq2.success, false)
  assert.ok(dupReq2.error.includes("already exists"))
  pass("Prevents duplicate pending request in reverse direction")

  // -------------------------------------------------------------
  // Test 3: Cancel request
  // -------------------------------------------------------------
  console.log("\nSuite 3: Cancel Couple Request")

  // user_b cannot cancel user_a's request
  const unauthCancel = await cancelCoupleRequest(undefined, validReq.request.id, "user_b")
  assert.equal(unauthCancel.success, false)
  assert.ok(unauthCancel.error.includes("Unauthorized"))
  pass("Receiver cannot cancel sender's request")

  // user_a cancels
  const okCancel = await cancelCoupleRequest(undefined, validReq.request.id, "user_a")
  assert.equal(okCancel.success, true)
  pass("Sender can cancel their request")

  const statusAfterCancelA = await getCoupleStatus(undefined, "user_a")
  assert.equal(statusAfterCancelA.outgoingRequests.length, 0)
  pass("Canceled request no longer appears in pending requests")

  // -------------------------------------------------------------
  // Test 4: Reject request
  // -------------------------------------------------------------
  console.log("\nSuite 4: Reject Couple Request")

  const req2 = await createCoupleRequest(undefined, "user_x", "user_y")
  assert.equal(req2.success, true)

  // user_x cannot reject their own outgoing request
  const unauthReject = await rejectCoupleRequest(undefined, req2.request.id, "user_x")
  assert.equal(unauthReject.success, false)
  assert.ok(unauthReject.error.includes("Unauthorized"))
  pass("Sender cannot reject their own request")

  // user_y rejects
  const okReject = await rejectCoupleRequest(undefined, req2.request.id, "user_y")
  assert.equal(okReject.success, true)
  pass("Receiver can reject the request")

  const statusAfterRejectY = await getCoupleStatus(undefined, "user_y")
  assert.equal(statusAfterRejectY.incomingRequests.length, 0)
  pass("Rejected request no longer appears in pending requests")

  // -------------------------------------------------------------
  // Test 5: Accept request & Auto-cancellation of other requests
  // -------------------------------------------------------------
  console.log("\nSuite 5: Accept Request & Form Couple")

  // user_1 invites user_2
  const reqPair = await createCoupleRequest(undefined, "user_1", "user_2")
  assert.equal(reqPair.success, true)

  // user_3 also invites user_2
  const reqRival = await createCoupleRequest(undefined, "user_3", "user_2")
  assert.equal(reqRival.success, true)

  // user_1 cannot accept request they sent
  const unauthAccept = await acceptCoupleRequest(undefined, reqPair.request.id, "user_1")
  assert.equal(unauthAccept.success, false)
  assert.ok(unauthAccept.error.includes("Unauthorized"))
  pass("Sender cannot accept request they sent")

  // user_2 accepts user_1's request
  const acceptRes = await acceptCoupleRequest(undefined, reqPair.request.id, "user_2")
  assert.equal(acceptRes.success, true)
  assert.ok(acceptRes.couple)
  assert.equal(acceptRes.couple.status, "active")
  assert.equal(acceptRes.couple.user_1, "user_1")
  assert.equal(acceptRes.couple.user_2, "user_2")
  assert.ok(acceptRes.couple.anniversary_date.match(/^\d{4}-\d{2}-\d{2}$/))
  pass("User accepts request, creating active couple with anniversary date")

  // Check getCoupleStatus for user_1 and user_2
  const status1 = await getCoupleStatus(undefined, "user_1")
  assert.ok(status1.couple)
  assert.equal(status1.couple.id, acceptRes.couple.id)

  const status2 = await getCoupleStatus(undefined, "user_2")
  assert.ok(status2.couple)
  assert.equal(status2.couple.id, acceptRes.couple.id)
  pass("Both partners see active couple in getCoupleStatus")

  // Verify other request from user_3 was automatically canceled
  const status3 = await getCoupleStatus(undefined, "user_3")
  assert.equal(status3.outgoingRequests.length, 0)
  pass("Pending request from user_3 was automatically canceled upon acceptance")

  // Attempting to send request while in active couple
  const blockedReq1 = await createCoupleRequest(undefined, "user_1", "user_4")
  assert.equal(blockedReq1.success, false)
  assert.ok(blockedReq1.error.includes("already in an active couple"))
  pass("Cannot send couple request if sender is already paired")

  const blockedReq2 = await createCoupleRequest(undefined, "user_4", "user_2")
  assert.equal(blockedReq2.success, false)
  assert.ok(blockedReq2.error.includes("already in an active couple"))
  pass("Cannot send couple request if receiver is already paired")

  // -------------------------------------------------------------
  // Test 6: Update Anniversary Date
  // -------------------------------------------------------------
  console.log("\nSuite 6: Update Anniversary Date")

  const coupleId = acceptRes.couple.id

  // Stranger cannot update
  const unauthDate = await updateAnniversary(undefined, coupleId, "stranger", "2024-05-20")
  assert.equal(unauthDate.success, false)
  assert.ok(unauthDate.error.includes("Unauthorized"))
  pass("Stranger cannot update anniversary date")

  // Empty date fails
  const emptyDate = await updateAnniversary(undefined, coupleId, "user_1", "   ")
  assert.equal(emptyDate.success, false)
  pass("Empty anniversary date is rejected")

  // user_1 updates date
  const updatedDateRes = await updateAnniversary(undefined, coupleId, "user_1", "2023-11-20")
  assert.equal(updatedDateRes.success, true)
  assert.equal(updatedDateRes.couple.anniversary_date, "2023-11-20")

  const statusAfterDate = await getCoupleStatus(undefined, "user_2")
  assert.equal(statusAfterDate.couple.anniversary_date, "2023-11-20")
  pass("Partner updates anniversary date and changes reflect for both")

  // -------------------------------------------------------------
  // Test 7: Unpair Couple
  // -------------------------------------------------------------
  console.log("\nSuite 7: Unpair Couple")

  // Stranger cannot unpair
  const unauthUnpair = await unpairCouple(undefined, coupleId, "stranger")
  assert.equal(unauthUnpair.success, false)
  assert.ok(unauthUnpair.error.includes("Unauthorized"))
  pass("Stranger cannot unpair a couple")

  // user_2 unpairs
  const okUnpair = await unpairCouple(undefined, coupleId, "user_2")
  assert.equal(okUnpair.success, true)
  pass("Couple member successfully unpairs")

  const statusAfterUnpair1 = await getCoupleStatus(undefined, "user_1")
  assert.equal(statusAfterUnpair1.couple, null)

  const statusAfterUnpair2 = await getCoupleStatus(undefined, "user_2")
  assert.equal(statusAfterUnpair2.couple, null)
  pass("Both partners now have couple: null")

  // Cannot unpair again
  const secondUnpair = await unpairCouple(undefined, coupleId, "user_1")
  assert.equal(secondUnpair.success, false)
  pass("Cannot unpair an already separated couple")

  // -------------------------------------------------------------
  // Test 8: Chat Messages (saveMessage & getRecentMessages)
  // -------------------------------------------------------------
  console.log("\nSuite 8: Chat Messages")

  const testRoom = "room-abc"
  const emptyMessages = await getRecentMessages(undefined, testRoom)
  assert.deepEqual(emptyMessages, [])
  pass("Initial messages list is empty")

  const now = Date.now()
  await saveMessage(undefined, {
    id: "msg-1",
    couple_id: testRoom,
    sender_id: "user_1",
    text: "Hello my love!",
    type: "text",
    created_at: now,
  })

  await saveMessage(undefined, {
    id: "msg-2",
    couple_id: testRoom,
    sender_id: "user_2",
    text: "❤️",
    type: "heart",
    created_at: now + 100,
  })

  const messages = await getRecentMessages(undefined, testRoom)
  assert.equal(messages.length, 2)
  assert.equal(messages[0].text, "Hello my love!")
  assert.equal(messages[1].type, "heart")
  pass("Messages saved and retrieved in order")

  // Test message trimming with maxLimit = 3
  await saveMessage(undefined, {
    id: "msg-3",
    couple_id: testRoom,
    sender_id: "user_1",
    text: "How was your day?",
    type: "text",
    created_at: now + 200,
  }, 3)

  await saveMessage(undefined, {
    id: "msg-4",
    couple_id: testRoom,
    sender_id: "user_2",
    text: "It was great!",
    type: "text",
    created_at: now + 300,
  }, 3)

  const trimmedMessages = await getRecentMessages(undefined, testRoom, 100)
  assert.equal(trimmedMessages.length, 3)
  assert.equal(trimmedMessages[0].id, "msg-2")
  assert.equal(trimmedMessages[1].id, "msg-3")
  assert.equal(trimmedMessages[2].id, "msg-4")
  pass("Messages cache correctly trimmed at maxLimit")

  // -------------------------------------------------------------
  // Test 9: D1 Database Integration (Mock D1 DB)
  // -------------------------------------------------------------
  console.log("\nSuite 9: Cloudflare D1 Mock DB Interface")

  const executedQueries = []
  const mockD1 = {
    prepare(query) {
      let boundValues = []
      return {
        bind(...vals) {
          boundValues = vals
          return this
        },
        async first() {
          executedQueries.push({ query, boundValues, type: "first" })
          return null
        },
        async all() {
          executedQueries.push({ query, boundValues, type: "all" })
          return { results: [], success: true }
        },
        async run() {
          executedQueries.push({ query, boundValues, type: "run" })
          return { success: true, meta: {} }
        },
      }
    },
    async dump() { return new ArrayBuffer(0) },
    async batch() { return [] },
    async exec(query) { return {} },
  }

  // Execute operations with mock D1 passed
  await getCoupleStatus(mockD1, "user_mock")
  await createCoupleRequest(mockD1, "user_mock1", "user_mock2")
  await getRecentMessages(mockD1, "couple_mock", 50)
  await saveMessage(mockD1, {
    id: "msg-mock",
    couple_id: "couple_mock",
    sender_id: "user_mock1",
    text: "D1 works!",
    type: "text",
    created_at: Date.now(),
  })

  assert.ok(executedQueries.length >= 4)
  assert.ok(executedQueries.some(q => q.query.includes("couple_requests")))
  assert.ok(executedQueries.some(q => q.query.includes("couple_messages")))
  pass("D1 database interface properly prepares, binds, and executes all SQL operations")

  console.log("\n\x1b[32m✨ ALL TESTS PASSED SUCCESSFULLY! ✨\x1b[0m\n")
}

runTests().catch((err) => {
  console.error("\n\x1b[31m❌ TEST FAILED:\x1b[0m", err)
  process.exit(1)
})
