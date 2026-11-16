import type { CoupleMessage, D1Database } from "./types"

// In-memory fallback cache (used when running locally without D1 or during dev)
const memoryCache = new Map<string, CoupleMessage[]>()

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
  const cached = memoryCache.get(coupleId) || []
  return cached.slice(-limit)
}

/**
 * Lưu tin nhắn mới vào D1 và tự động giới hạn 100 tin gần nhất
 */
export async function saveMessage(
  db: D1Database | undefined,
  message: CoupleMessage,
  maxLimit = 100
): Promise<void> {
  // Update in-memory fallback
  const cached = memoryCache.get(message.couple_id) || []
  cached.push(message)
  if (cached.length > maxLimit) {
    cached.splice(0, cached.length - maxLimit)
  }
  memoryCache.set(message.couple_id, cached)

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

    // 2. Định kỳ dọn dẹp tin nhắn vượt quá 100 tin của phòng này
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
