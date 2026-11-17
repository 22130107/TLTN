import assert from "node:assert/strict"
import worker from "../src/index.ts"
import { clearMemoryCache } from "../src/db.ts"

function pass(name) {
  console.log(`  \x1b[32m✔\x1b[0m ${name}`)
}

async function callApi(path, options = {}) {
  const url = `http://localhost${path}`
  const headers = new Headers(options.headers || {})
  if (options.body && typeof options.body === "object" && !(options.body instanceof String)) {
    if (!headers.has("Content-Type")) {
      headers.set("Content-Type", "application/json")
    }
    options.body = JSON.stringify(options.body)
  }
  const req = new Request(url, { ...options, headers })
  return await worker.fetch(req, {})
}

async function runTests() {
  console.log("\n🧪 Running Cloudflare Worker HTTP REST API & CORS Tests\n")

  // -------------------------------------------------------------
  // Test 1: OPTIONS Preflight CORS Headers
  // -------------------------------------------------------------
  console.log("Suite 1: CORS & Preflight Handling")

  const preflightRes = await callApi("/api/couple/request", {
    method: "OPTIONS",
  })
  assert.equal(preflightRes.status, 204)
  assert.equal(preflightRes.headers.get("Access-Control-Allow-Origin"), "*")
  assert.equal(
    preflightRes.headers.get("Access-Control-Allow-Methods"),
    "GET, POST, OPTIONS"
  )
  assert.equal(
    preflightRes.headers.get("Access-Control-Allow-Headers"),
    "Content-Type, Authorization"
  )
  pass("OPTIONS preflight returns 204 with required CORS headers")

  // -------------------------------------------------------------
  // Test 2: Health Check Endpoint
  // -------------------------------------------------------------
  console.log("\nSuite 2: Health Check Endpoint")

  const healthRes = await callApi("/health")
  assert.equal(healthRes.status, 200)
  assert.equal(healthRes.headers.get("Access-Control-Allow-Origin"), "*")
  const healthJson = await healthRes.json()
  assert.equal(healthJson.status, "ok")
  assert.ok(healthJson.timestamp)
  pass("GET /health returns 200 with service status and CORS headers")

  // -------------------------------------------------------------
  // Test 3: GET /api/couple/status
  // -------------------------------------------------------------
  console.log("\nSuite 3: GET /api/couple/status")
  clearMemoryCache()

  // Missing userId param
  const missingUserRes = await callApi("/api/couple/status", { method: "GET" })
  assert.equal(missingUserRes.status, 400)
  const missingUserJson = await missingUserRes.json()
  assert.equal(missingUserJson.success, false)
  assert.ok(missingUserJson.error.includes("userId"))
  pass("Fails when userId parameter is missing")

  // Valid initial status
  const initialStatusRes = await callApi("/api/couple/status?userId=user_alpha", {
    method: "GET",
  })
  assert.equal(initialStatusRes.status, 200)
  assert.equal(initialStatusRes.headers.get("Access-Control-Allow-Origin"), "*")
  const initialStatusJson = await initialStatusRes.json()
  assert.equal(initialStatusJson.success, true)
  assert.equal(initialStatusJson.couple, null)
  assert.deepEqual(initialStatusJson.incomingRequests, [])
  assert.deepEqual(initialStatusJson.outgoingRequests, [])
  pass("GET /api/couple/status returns empty state for fresh user")

  // -------------------------------------------------------------
  // Test 4: POST /api/couple/request
  // -------------------------------------------------------------
  console.log("\nSuite 4: POST /api/couple/request")

  // Invalid JSON body
  const invalidJsonReq = new Request("http://localhost/api/couple/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "invalid-json{",
  })
  const invalidJsonRes = await worker.fetch(invalidJsonReq, {})
  assert.equal(invalidJsonRes.status, 400)
  const invalidJsonData = await invalidJsonRes.json()
  assert.equal(invalidJsonData.success, false)
  pass("Rejects malformed JSON body")

  // Self pairing request
  const selfReqRes = await callApi("/api/couple/request", {
    method: "POST",
    body: { senderId: "user_alpha", receiverId: "user_alpha" },
  })
  assert.equal(selfReqRes.status, 400)
  const selfReqJson = await selfReqRes.json()
  assert.equal(selfReqJson.success, false)
  assert.ok(selfReqJson.error.includes("yourself"))
  pass("Rejects self-pairing attempt")

  // Valid request
  const validReqRes = await callApi("/api/couple/request", {
    method: "POST",
    body: { senderId: "user_alpha", receiverId: "user_beta" },
  })
  assert.equal(validReqRes.status, 200)
  const validReqJson = await validReqRes.json()
  assert.equal(validReqJson.success, true)
  assert.ok(validReqJson.request)
  assert.equal(validReqJson.request.sender_id, "user_alpha")
  assert.equal(validReqJson.request.receiver_id, "user_beta")
  assert.equal(validReqJson.request.status, "pending")
  pass("Successfully creates couple request between user_alpha and user_beta")

  const requestId1 = validReqJson.request.id

  // Verify status reflects request
  const senderStatusRes = await callApi("/api/couple/status?userId=user_alpha")
  const senderStatusJson = await senderStatusRes.json()
  assert.equal(senderStatusJson.outgoingRequests.length, 1)

  const receiverStatusRes = await callApi("/api/couple/status?userId=user_beta")
  const receiverStatusJson = await receiverStatusRes.json()
  assert.equal(receiverStatusJson.incomingRequests.length, 1)
  pass("Status endpoints correctly show outgoing and incoming requests")

  // -------------------------------------------------------------
  // Test 5: POST /api/couple/cancel
  // -------------------------------------------------------------
  console.log("\nSuite 5: POST /api/couple/cancel")

  // Unauthorized cancel attempt by receiver
  const unauthCancelRes = await callApi("/api/couple/cancel", {
    method: "POST",
    body: { requestId: requestId1, userId: "user_beta" },
  })
  assert.equal(unauthCancelRes.status, 400)
  const unauthCancelJson = await unauthCancelRes.json()
  assert.equal(unauthCancelJson.success, false)
  assert.ok(unauthCancelJson.error.includes("Unauthorized"))
  pass("Unauthorized user cannot cancel request")

  // Authorized cancel by sender
  const okCancelRes = await callApi("/api/couple/cancel", {
    method: "POST",
    body: { requestId: requestId1, userId: "user_alpha" },
  })
  assert.equal(okCancelRes.status, 200)
  const okCancelJson = await okCancelRes.json()
  assert.equal(okCancelJson.success, true)
  pass("Sender successfully cancels their couple request")

  const statusAfterCancelRes = await callApi("/api/couple/status?userId=user_alpha")
  const statusAfterCancelJson = await statusAfterCancelRes.json()
  assert.equal(statusAfterCancelJson.outgoingRequests.length, 0)
  pass("Canceled request removed from outgoing requests")

  // -------------------------------------------------------------
  // Test 6: POST /api/couple/reject
  // -------------------------------------------------------------
  console.log("\nSuite 6: POST /api/couple/reject")

  // Create another request
  const req2Res = await callApi("/api/couple/request", {
    method: "POST",
    body: { senderId: "user_m", receiverId: "user_n" },
  })
  const req2Json = await req2Res.json()
  const requestId2 = req2Json.request.id

  // Sender cannot reject
  const unauthRejectRes = await callApi("/api/couple/reject", {
    method: "POST",
    body: { requestId: requestId2, userId: "user_m" },
  })
  assert.equal(unauthRejectRes.status, 400)
  const unauthRejectJson = await unauthRejectRes.json()
  assert.equal(unauthRejectJson.success, false)
  assert.ok(unauthRejectJson.error.includes("Unauthorized"))
  pass("Sender cannot reject their own request")

  // Receiver rejects
  const okRejectRes = await callApi("/api/couple/reject", {
    method: "POST",
    body: { requestId: requestId2, userId: "user_n" },
  })
  assert.equal(okRejectRes.status, 200)
  const okRejectJson = await okRejectRes.json()
  assert.equal(okRejectJson.success, true)
  pass("Receiver successfully rejects the request")

  const statusAfterRejectRes = await callApi("/api/couple/status?userId=user_n")
  const statusAfterRejectJson = await statusAfterRejectRes.json()
  assert.equal(statusAfterRejectJson.incomingRequests.length, 0)
  pass("Rejected request removed from incoming requests")

  // -------------------------------------------------------------
  // Test 7: POST /api/couple/accept
  // -------------------------------------------------------------
  console.log("\nSuite 7: POST /api/couple/accept")

  const req3Res = await callApi("/api/couple/request", {
    method: "POST",
    body: { senderId: "user_romeo", receiverId: "user_juliet" },
  })
  const req3Json = await req3Res.json()
  const requestId3 = req3Json.request.id

  // Sender cannot accept
  const unauthAcceptRes = await callApi("/api/couple/accept", {
    method: "POST",
    body: { requestId: requestId3, userId: "user_romeo" },
  })
  assert.equal(unauthAcceptRes.status, 400)
  const unauthAcceptJson = await unauthAcceptRes.json()
  assert.equal(unauthAcceptJson.success, false)
  assert.ok(unauthAcceptJson.error.includes("Unauthorized"))
  pass("Sender cannot accept their own request")

  // Receiver accepts
  const okAcceptRes = await callApi("/api/couple/accept", {
    method: "POST",
    body: { requestId: requestId3, userId: "user_juliet" },
  })
  assert.equal(okAcceptRes.status, 200)
  const okAcceptJson = await okAcceptRes.json()
  assert.equal(okAcceptJson.success, true)
  assert.ok(okAcceptJson.couple)
  assert.equal(okAcceptJson.couple.status, "active")
  assert.equal(okAcceptJson.couple.user_1, "user_romeo")
  assert.equal(okAcceptJson.couple.user_2, "user_juliet")
  pass("Receiver accepts couple request, forming active couple")

  const coupleId = okAcceptJson.couple.id

  // Both parties see active couple
  const romeoStatus = await (await callApi("/api/couple/status?userId=user_romeo")).json()
  const julietStatus = await (await callApi("/api/couple/status?userId=user_juliet")).json()
  assert.equal(romeoStatus.couple.id, coupleId)
  assert.equal(julietStatus.couple.id, coupleId)
  pass("Both partners see active couple in status endpoint")

  // -------------------------------------------------------------
  // Test 8: POST /api/couple/anniversary
  // -------------------------------------------------------------
  console.log("\nSuite 8: POST /api/couple/anniversary")

  // Stranger cannot update
  const unauthDateRes = await callApi("/api/couple/anniversary", {
    method: "POST",
    body: { coupleId, userId: "stranger", anniversaryDate: "2024-02-14" },
  })
  assert.equal(unauthDateRes.status, 400)
  const unauthDateJson = await unauthDateRes.json()
  assert.equal(unauthDateJson.success, false)
  assert.ok(unauthDateJson.error.includes("Unauthorized"))
  pass("Stranger cannot update couple anniversary date")

  // Empty date rejected
  const emptyDateRes = await callApi("/api/couple/anniversary", {
    method: "POST",
    body: { coupleId, userId: "user_romeo", anniversaryDate: "   " },
  })
  assert.equal(emptyDateRes.status, 400)
  const emptyDateJson = await emptyDateRes.json()
  assert.equal(emptyDateJson.success, false)
  pass("Empty date is rejected")

  // Partner updates anniversary date
  const okDateRes = await callApi("/api/couple/anniversary", {
    method: "POST",
    body: { coupleId, userId: "user_romeo", anniversaryDate: "2023-11-20" },
  })
  assert.equal(okDateRes.status, 200)
  const okDateJson = await okDateRes.json()
  assert.equal(okDateJson.success, true)
  assert.equal(okDateJson.couple.anniversary_date, "2023-11-20")
  pass("Partner updates anniversary date successfully")

  const julietAfterDate = await (await callApi("/api/couple/status?userId=user_juliet")).json()
  assert.equal(julietAfterDate.couple.anniversary_date, "2023-11-20")
  pass("Updated anniversary date is reflected for partner")

  // -------------------------------------------------------------
  // Test 9: POST /api/couple/unpair
  // -------------------------------------------------------------
  console.log("\nSuite 9: POST /api/couple/unpair")

  // Stranger cannot unpair
  const unauthUnpairRes = await callApi("/api/couple/unpair", {
    method: "POST",
    body: { coupleId, userId: "stranger" },
  })
  assert.equal(unauthUnpairRes.status, 400)
  const unauthUnpairJson = await unauthUnpairRes.json()
  assert.equal(unauthUnpairJson.success, false)
  assert.ok(unauthUnpairJson.error.includes("Unauthorized"))
  pass("Stranger cannot unpair couple")

  // Partner unpairs
  const okUnpairRes = await callApi("/api/couple/unpair", {
    method: "POST",
    body: { coupleId, userId: "user_juliet" },
  })
  assert.equal(okUnpairRes.status, 200)
  const okUnpairJson = await okUnpairRes.json()
  assert.equal(okUnpairJson.success, true)
  pass("Partner unpairs couple successfully")

  const julietAfterUnpair = await (await callApi("/api/couple/status?userId=user_juliet")).json()
  const romeoAfterUnpair = await (await callApi("/api/couple/status?userId=user_romeo")).json()
  assert.equal(julietAfterUnpair.couple, null)
  assert.equal(romeoAfterUnpair.couple, null)
  pass("Both partners now have couple: null in status")

  // -------------------------------------------------------------
  // Test 10: Routing errors & non-websocket fallback
  // -------------------------------------------------------------
  console.log("\nSuite 10: Router Fallbacks & Method Not Allowed")

  const wrongMethodRes = await callApi("/api/couple/request", { method: "PUT" })
  assert.equal(wrongMethodRes.status, 405)
  pass("Non-matching method returns 405 Method Not Allowed")

  const notFoundRes = await callApi("/api/couple/unknown_route")
  assert.equal(notFoundRes.status, 404)
  pass("Unknown /api/ route returns 404 Not Found")

  const nonWsRes = await callApi("/ws-something", { method: "GET" })
  assert.equal(nonWsRes.status, 426)
  pass("Non-websocket connection to other paths returns 426 Expected Upgrade: websocket")

  console.log("\n\x1b[32m✨ ALL HTTP REST API TESTS PASSED SUCCESSFULLY! ✨\x1b[0m\n")
}

runTests().catch((err) => {
  console.error("\n\x1b[31m❌ TEST FAILED:\x1b[0m", err)
  process.exit(1)
})
