import type {
  Couple,
  CoupleRequest,
  CoupleMessage,
  CoupleStatusResult,
  D1Database,
} from "./types"

// In-memory fallback caches (used when running locally without D1 or during dev/tests)
const messagesCache = new Map<string, CoupleMessage[]>()
const couplesCache = new Map<string, Couple>()
const requestsCache = new Map<string, CoupleRequest>()

/**
 * Reset all in-memory caches (useful for testing)
 */
export function clearMemoryCache(): void {
  messagesCache.clear()
  couplesCache.clear()
  requestsCache.clear()
}

/**
 * Lấy trạng thái couple của user:
 * - Active couple (nếu có)
 * - Danh sách lời mời đang chờ xử lý gửi đến user (incoming)
 * - Danh sách lời mời user đang gửi đi (outgoing)
 */
export async function getCoupleStatus(
  db: D1Database | undefined,
  userId: string
): Promise<CoupleStatusResult> {
  if (db) {
    try {
      const coupleStmt = db.prepare(
        "SELECT * FROM couples WHERE (user_1 = ? OR user_2 = ?) AND status = 'active' ORDER BY updated_at DESC LIMIT 1"
      )
      const couple = await coupleStmt.bind(userId, userId).first<Couple>()

      const incStmt = db.prepare(
        "SELECT * FROM couple_requests WHERE receiver_id = ? AND status = 'pending' ORDER BY created_at DESC"
      )
      const incRes = await incStmt.bind(userId).all<CoupleRequest>()

      const outStmt = db.prepare(
        "SELECT * FROM couple_requests WHERE sender_id = ? AND status = 'pending' ORDER BY created_at DESC"
      )
      const outRes = await outStmt.bind(userId).all<CoupleRequest>()

      return {
        couple: couple || null,
        incomingRequests: incRes.results || [],
        outgoingRequests: outRes.results || [],
      }
    } catch (err) {
      console.error("[D1] Error fetching couple status:", err)
    }
  }

  // Fallback in-memory
  let couple: Couple | null = null
  for (const c of couplesCache.values()) {
    if ((c.user_1 === userId || c.user_2 === userId) && c.status === "active") {
      couple = c
      break
    }
  }

  const incomingRequests: CoupleRequest[] = []
  const outgoingRequests: CoupleRequest[] = []

  for (const r of requestsCache.values()) {
    if (r.status === "pending") {
      if (r.receiver_id === userId) {
        incomingRequests.push(r)
      } else if (r.sender_id === userId) {
        outgoingRequests.push(r)
      }
    }
  }

  incomingRequests.sort((a, b) => b.created_at - a.created_at)
  outgoingRequests.sort((a, b) => b.created_at - a.created_at)

  return {
    couple,
    incomingRequests,
    outgoingRequests,
  }
}

/**
 * Tạo lời mời ghép đôi mới từ senderId tới receiverId
 */
export async function createCoupleRequest(
  db: D1Database | undefined,
  senderId: string,
  receiverId: string
): Promise<{ success: boolean; request?: CoupleRequest; error?: string }> {
  const sId = senderId?.trim()
  const rId = receiverId?.trim()

  if (!sId || !rId) {
    return { success: false, error: "Sender ID and Receiver ID are required" }
  }

  if (sId === rId) {
    return { success: false, error: "Cannot send couple request to yourself" }
  }

  // 1. Kiểm tra sender đã có couple active chưa
  if (db) {
    try {
      const senderActive = await db
        .prepare(
          "SELECT id FROM couples WHERE (user_1 = ? OR user_2 = ?) AND status = 'active' LIMIT 1"
        )
        .bind(sId, sId)
        .first<Couple>()
      if (senderActive) {
        return { success: false, error: "You are already in an active couple" }
      }

      const receiverActive = await db
        .prepare(
          "SELECT id FROM couples WHERE (user_1 = ? OR user_2 = ?) AND status = 'active' LIMIT 1"
        )
        .bind(rId, rId)
        .first<Couple>()
      if (receiverActive) {
        return { success: false, error: "Partner is already in an active couple" }
      }

      const pendingExisting = await db
        .prepare(
          "SELECT id FROM couple_requests WHERE ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)) AND status = 'pending' LIMIT 1"
        )
        .bind(sId, rId, rId, sId)
        .first<CoupleRequest>()
      if (pendingExisting) {
        return { success: false, error: "A pending request already exists between you two" }
      }
    } catch (err) {
      console.error("[D1] Error checking existing request/couple:", err)
    }
  } else {
    // Check in-memory
    for (const c of couplesCache.values()) {
      if (c.status === "active") {
        if (c.user_1 === sId || c.user_2 === sId) {
          return { success: false, error: "You are already in an active couple" }
        }
        if (c.user_1 === rId || c.user_2 === rId) {
          return { success: false, error: "Partner is already in an active couple" }
        }
      }
    }

    for (const r of requestsCache.values()) {
      if (
        r.status === "pending" &&
        ((r.sender_id === sId && r.receiver_id === rId) ||
          (r.sender_id === rId && r.receiver_id === sId))
      ) {
        return { success: false, error: "A pending request already exists between you two" }
      }
    }
  }

  const now = Date.now()
  const requestId = `req-${now}-${Math.random().toString(36).substring(2, 9)}`
  const newRequest: CoupleRequest = {
    id: requestId,
    sender_id: sId,
    receiver_id: rId,
    status: "pending",
    created_at: now,
    updated_at: now,
  }

  // Update in-memory cache
  requestsCache.set(requestId, newRequest)

  // Insert into D1 if available
  if (db) {
    try {
      await db
        .prepare(
          "INSERT INTO couple_requests (id, sender_id, receiver_id, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)"
        )
        .bind(
          newRequest.id,
          newRequest.sender_id,
          newRequest.receiver_id,
          newRequest.status,
          newRequest.created_at,
          newRequest.updated_at
        )
        .run()
    } catch (err) {
      console.error("[D1] Error inserting couple_request:", err)
    }
  }

  return { success: true, request: newRequest }
}

/**
 * Chấp nhận lời mời ghép đôi
 */
export async function acceptCoupleRequest(
  db: D1Database | undefined,
  requestId: string,
  userId: string
): Promise<{ success: boolean; couple?: Couple; error?: string }> {
  let targetRequest: CoupleRequest | undefined = requestsCache.get(requestId)

  if (db) {
    try {
      const fetched = await db
        .prepare("SELECT * FROM couple_requests WHERE id = ? LIMIT 1")
        .bind(requestId)
        .first<CoupleRequest>()
      if (fetched) {
        targetRequest = fetched
      }
    } catch (err) {
      console.error("[D1] Error fetching request to accept:", err)
    }
  }

  if (!targetRequest) {
    return { success: false, error: "Couple request not found" }
  }

  if (targetRequest.status !== "pending") {
    return { success: false, error: "Request is already processed or canceled" }
  }

  if (targetRequest.receiver_id !== userId) {
    return { success: false, error: "Unauthorized to accept this request" }
  }

  const senderId = targetRequest.sender_id
  const receiverId = targetRequest.receiver_id

  // Check if either user is already paired
  if (db) {
    try {
      const existingCouple = await db
        .prepare(
          "SELECT id FROM couples WHERE (user_1 IN (?, ?) OR user_2 IN (?, ?)) AND status = 'active' LIMIT 1"
        )
        .bind(senderId, receiverId, senderId, receiverId)
        .first<Couple>()
      if (existingCouple) {
        return { success: false, error: "One of the users is already in an active couple" }
      }
    } catch (err) {
      console.error("[D1] Error checking existing couple:", err)
    }
  } else {
    for (const c of couplesCache.values()) {
      if (
        c.status === "active" &&
        (c.user_1 === senderId ||
          c.user_2 === senderId ||
          c.user_1 === receiverId ||
          c.user_2 === receiverId)
      ) {
        return { success: false, error: "One of the users is already in an active couple" }
      }
    }
  }

  const now = Date.now()
  const coupleId = `couple-${now}-${Math.random().toString(36).substring(2, 9)}`
  const today = new Date().toISOString().split("T")[0]

  const newCouple: Couple = {
    id: coupleId,
    user_1: senderId,
    user_2: receiverId,
    anniversary_date: today,
    nickname_1: null,
    nickname_2: null,
    status: "active",
    created_at: now,
    updated_at: now,
  }

  // Update in-memory state
  targetRequest.status = "accepted"
  targetRequest.updated_at = now
  requestsCache.set(targetRequest.id, targetRequest)
  couplesCache.set(coupleId, newCouple)

  // Cancel any other pending requests for both users
  for (const r of requestsCache.values()) {
    if (r.id !== requestId && r.status === "pending") {
      if (
        r.sender_id === senderId ||
        r.receiver_id === senderId ||
        r.sender_id === receiverId ||
        r.receiver_id === receiverId
      ) {
        r.status = "canceled"
        r.updated_at = now
      }
    }
  }

  // Persist to D1
  if (db) {
    try {
      // 1. Mark request accepted
      await db
        .prepare("UPDATE couple_requests SET status = 'accepted', updated_at = ? WHERE id = ?")
        .bind(now, requestId)
        .run()

      // 2. Insert new couple
      await db
        .prepare(
          "INSERT INTO couples (id, user_1, user_2, anniversary_date, nickname_1, nickname_2, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)"
        )
        .bind(
          newCouple.id,
          newCouple.user_1,
          newCouple.user_2,
          newCouple.anniversary_date,
          newCouple.nickname_1,
          newCouple.nickname_2,
          newCouple.status,
          newCouple.created_at,
          newCouple.updated_at
        )
        .run()

      // 3. Cancel other pending requests
      await db
        .prepare(
          "UPDATE couple_requests SET status = 'canceled', updated_at = ? WHERE id != ? AND status = 'pending' AND (sender_id IN (?, ?) OR receiver_id IN (?, ?))"
        )
        .bind(now, requestId, senderId, receiverId, senderId, receiverId)
        .run()
    } catch (err) {
      console.error("[D1] Error accepting couple request:", err)
    }
  }

  return { success: true, couple: newCouple }
}

/**
 * Từ chối lời mời ghép đôi
 */
export async function rejectCoupleRequest(
  db: D1Database | undefined,
  requestId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  let targetRequest: CoupleRequest | undefined = requestsCache.get(requestId)

  if (db) {
    try {
      const fetched = await db
        .prepare("SELECT * FROM couple_requests WHERE id = ? LIMIT 1")
        .bind(requestId)
        .first<CoupleRequest>()
      if (fetched) {
        targetRequest = fetched
      }
    } catch (err) {
      console.error("[D1] Error fetching request to reject:", err)
    }
  }

  if (!targetRequest) {
    return { success: false, error: "Couple request not found" }
  }

  if (targetRequest.status !== "pending") {
    return { success: false, error: "Request is already processed or canceled" }
  }

  if (targetRequest.receiver_id !== userId) {
    return { success: false, error: "Unauthorized to reject this request" }
  }

  const now = Date.now()
  targetRequest.status = "rejected"
  targetRequest.updated_at = now
  requestsCache.set(targetRequest.id, targetRequest)

  if (db) {
    try {
      await db
        .prepare("UPDATE couple_requests SET status = 'rejected', updated_at = ? WHERE id = ?")
        .bind(now, requestId)
        .run()
    } catch (err) {
      console.error("[D1] Error rejecting request:", err)
    }
  }

  return { success: true }
}

/**
 * Hủy lời mời ghép đôi (bởi chính người gửi)
 */
export async function cancelCoupleRequest(
  db: D1Database | undefined,
  requestId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  let targetRequest: CoupleRequest | undefined = requestsCache.get(requestId)

  if (db) {
    try {
      const fetched = await db
        .prepare("SELECT * FROM couple_requests WHERE id = ? LIMIT 1")
        .bind(requestId)
        .first<CoupleRequest>()
      if (fetched) {
        targetRequest = fetched
      }
    } catch (err) {
      console.error("[D1] Error fetching request to cancel:", err)
    }
  }

  if (!targetRequest) {
    return { success: false, error: "Couple request not found" }
  }

  if (targetRequest.status !== "pending") {
    return { success: false, error: "Request is already processed or canceled" }
  }

  if (targetRequest.sender_id !== userId) {
    return { success: false, error: "Unauthorized to cancel this request" }
  }

  const now = Date.now()
  targetRequest.status = "canceled"
  targetRequest.updated_at = now
  requestsCache.set(targetRequest.id, targetRequest)

  if (db) {
    try {
      await db
        .prepare("UPDATE couple_requests SET status = 'canceled', updated_at = ? WHERE id = ?")
        .bind(now, requestId)
        .run()
    } catch (err) {
      console.error("[D1] Error canceling request:", err)
    }
  }

  return { success: true }
}

/**
 * Hủy ghép đôi (unpair / chia tay)
 */
export async function unpairCouple(
  db: D1Database | undefined,
  coupleId: string,
  userId: string
): Promise<{ success: boolean; error?: string }> {
  let couple: Couple | undefined = couplesCache.get(coupleId)

  if (db) {
    try {
      const fetched = await db
        .prepare("SELECT * FROM couples WHERE id = ? LIMIT 1")
        .bind(coupleId)
        .first<Couple>()
      if (fetched) {
        couple = fetched
      }
    } catch (err) {
      console.error("[D1] Error fetching couple to unpair:", err)
    }
  }

  if (!couple) {
    return { success: false, error: "Couple not found" }
  }

  if (couple.status !== "active") {
    return { success: false, error: "Couple is not active or already separated" }
  }

  if (couple.user_1 !== userId && couple.user_2 !== userId) {
    return { success: false, error: "Unauthorized to unpair this couple" }
  }

  const now = Date.now()
  couple.status = "separated"
  couple.updated_at = now
  couplesCache.set(couple.id, couple)

  if (db) {
    try {
      await db
        .prepare("UPDATE couples SET status = 'separated', updated_at = ? WHERE id = ?")
        .bind(now, coupleId)
        .run()
    } catch (err) {
      console.error("[D1] Error updating couple to separated:", err)
    }
  }

  return { success: true }
}

/**
 * Cập nhật ngày kỷ niệm (anniversary_date: YYYY-MM-DD)
 */
export async function updateAnniversary(
  db: D1Database | undefined,
  coupleId: string,
  userId: string,
  date: string
): Promise<{ success: boolean; couple?: Couple; error?: string }> {
  const trimmedDate = date?.trim()
  if (!trimmedDate) {
    return { success: false, error: "Invalid anniversary date" }
  }

  let couple: Couple | undefined = couplesCache.get(coupleId)

  if (db) {
    try {
      const fetched = await db
        .prepare("SELECT * FROM couples WHERE id = ? LIMIT 1")
        .bind(coupleId)
        .first<Couple>()
      if (fetched) {
        couple = fetched
      }
    } catch (err) {
      console.error("[D1] Error fetching couple to update anniversary:", err)
    }
  }

  if (!couple) {
    return { success: false, error: "Couple not found" }
  }

  if (couple.status !== "active") {
    return { success: false, error: "Couple is not active" }
  }

  if (couple.user_1 !== userId && couple.user_2 !== userId) {
    return { success: false, error: "Unauthorized to update this couple" }
  }

  const now = Date.now()
  couple.anniversary_date = trimmedDate
  couple.updated_at = now
  couplesCache.set(couple.id, couple)

  if (db) {
    try {
      await db
        .prepare("UPDATE couples SET anniversary_date = ?, updated_at = ? WHERE id = ?")
        .bind(trimmedDate, now, coupleId)
        .run()
    } catch (err) {
      console.error("[D1] Error updating anniversary date:", err)
    }
  }

  return { success: true, couple }
}

/**
 * Lấy danh sách 50-100 tin nhắn gần nhất của cặp đôi
 */
export async function getRecentMessages(
  db: D1Database | undefined,
  coupleId: string,
  limit = 100
): Promise<CoupleMessage[]> {
  if (db) {
    try {
      const stmt = db.prepare(
        "SELECT id, couple_id, sender_id, text, type, status, created_at FROM couple_messages WHERE couple_id = ? ORDER BY created_at ASC LIMIT ?"
      )
      const { results } = await stmt.bind(coupleId, limit).all<CoupleMessage>()
      if (results && results.length > 0) {
        return results
      }
    } catch (err) {
      console.error("[D1] Error fetching messages:", err)
    }
  }

  // Fallback in-memory
  const cached = messagesCache.get(coupleId) || []
  return cached.slice(-limit)
}

/**
 * Lưu tin nhắn mới vào D1 và tự động giới hạn maxLimit tin gần nhất
 */
export async function saveMessage(
  db: D1Database | undefined,
  message: CoupleMessage,
  maxLimit = 100
): Promise<void> {
  // Update in-memory fallback
  const cached = messagesCache.get(message.couple_id) || []
  cached.push(message)
  if (cached.length > maxLimit) {
    cached.splice(0, cached.length - maxLimit)
  }
  messagesCache.set(message.couple_id, cached)

  if (!db) {
    return
  }

  try {
    // 1. Chèn tin nhắn mới
    const insertStmt = db.prepare(
      "INSERT INTO couple_messages (id, couple_id, sender_id, text, type, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)"
    )
    await insertStmt
      .bind(
        message.id,
        message.couple_id,
        message.sender_id,
        message.text,
        message.type || "text",
        message.status || "sent",
        message.created_at
      )
      .run()

    // 2. Dọn dẹp tin nhắn vượt quá maxLimit
    const cleanupStmt = db.prepare(`
      DELETE FROM couple_messages 
      WHERE couple_id = ? 
        AND id NOT IN (
          SELECT id FROM couple_messages 
          WHERE couple_id = ? 
          ORDER BY created_at DESC 
          LIMIT ?
        )
    `)
    await cleanupStmt.bind(message.couple_id, message.couple_id, maxLimit).run()
  } catch (err) {
    console.error("[D1] Error saving message:", err)
  }
}
