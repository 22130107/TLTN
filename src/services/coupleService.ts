import { supabase } from "@/lib/supabase/client"
import type {
  Couple,
  CoupleRequest,
  CoupleProfile,
} from "@/types/couple"
import type { ProfileRow, CoupleRow, CoupleRequestRow } from "@/lib/supabase/types"

/**
 * Lấy thông tin tóm tắt của một người dùng theo ID
 */
export async function getUserProfileById(userId: string): Promise<CoupleProfile | null> {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, display_name, avatar_url, email")
      .eq("id", userId)
      .maybeSingle()

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
 * Lấy mối quan hệ cặp đôi đang active của một người dùng
 */
export async function getActiveCouple(userId: string): Promise<Couple | null> {
  try {
    const { data, error } = await supabase
      .from("couples")
      .select("*")
      .or(`user_1.eq.${userId},user_2.eq.${userId}`)
      .eq("status", "active")
      .maybeSingle()

    if (error || !data) {
      return null
    }

    const row = data as unknown as CoupleRow
    const partnerId = row.user_1 === userId ? row.user_2 : row.user_1
    const partnerProfile = await getUserProfileById(partnerId)

    return {
      id: row.id,
      user_1: row.user_1,
      user_2: row.user_2,
      anniversary_date: row.anniversary_date,
      nickname_1: row.nickname_1,
      nickname_2: row.nickname_2,
      status: row.status as "active" | "separated",
      created_at: row.created_at,
      updated_at: row.updated_at,
      partner: partnerProfile || {
        id: partnerId,
        display_name: "Người thương",
        avatar_url: "/img/profile-avatar.png",
      },
    }
  } catch (err) {
    console.error("Lỗi khi lấy active couple:", err)
    return null
  }
}

/**
 * Lấy danh sách các lời mời ghép đôi đang chờ gửi đến người dùng
 */
export async function getPendingIncomingRequests(userId: string): Promise<CoupleRequest[]> {
  try {
    const { data, error } = await supabase
      .from("couple_requests")
      .select("*")
      .eq("receiver_id", userId)
      .eq("status", "pending")
      .order("created_at", { ascending: false })

    if (error || !data) {
      return []
    }

    const rows = data as unknown as CoupleRequestRow[]
    const requestsWithSender = await Promise.all(
      rows.map(async (req) => {
        const sender = await getUserProfileById(req.sender_id)
        return {
          id: req.id,
          sender_id: req.sender_id,
          receiver_id: req.receiver_id,
          status: req.status as CoupleRequest["status"],
          created_at: req.created_at,
          updated_at: req.updated_at,
          sender_profile: sender || undefined,
        }
      })
    )

    return requestsWithSender
  } catch (err) {
    console.error("Lỗi khi lấy incoming couple requests:", err)
    return []
  }
}

/**
 * Lấy danh sách các lời mời ghép đôi người dùng đã gửi và đang chờ duyệt
 */
export async function getPendingOutgoingRequests(userId: string): Promise<CoupleRequest[]> {
  try {
    const { data, error } = await supabase
      .from("couple_requests")
      .select("*")
      .eq("sender_id", userId)
      .eq("status", "pending")
      .order("created_at", { ascending: false })

    if (error || !data) {
      return []
    }

    const rows = data as unknown as CoupleRequestRow[]
    const requestsWithReceiver = await Promise.all(
      rows.map(async (req) => {
        const receiver = await getUserProfileById(req.receiver_id)
        return {
          id: req.id,
          sender_id: req.sender_id,
          receiver_id: req.receiver_id,
          status: req.status as CoupleRequest["status"],
          created_at: req.created_at,
          updated_at: req.updated_at,
          receiver_profile: receiver || undefined,
        }
      })
    )

    return requestsWithReceiver
  } catch (err) {
    console.error("Lỗi khi lấy outgoing couple requests:", err)
    return []
  }
}

/**
 * Gửi lời mời ghép đôi qua User ID của đối phương
 */
export async function sendCoupleRequest(
  senderId: string,
  receiverId: string
): Promise<{ success: boolean; error?: string; request?: CoupleRequest }> {
  try {
    const trimmedReceiverId = receiverId.trim()

    // 1. Kiểm tra validation cơ bản
    if (!trimmedReceiverId) {
      return { success: false, error: "Vui lòng nhập User ID của đối phương" }
    }

    if (senderId === trimmedReceiverId) {
      return { success: false, error: "Bạn không thể tự ghép đôi với chính mình" }
    }

    // 2. Kiểm tra xem người nhận có tồn tại không
    const receiverProfile = await getUserProfileById(trimmedReceiverId)
    if (!receiverProfile) {
      return { success: false, error: "Không tìm thấy người dùng với User ID này. Vui lòng kiểm tra lại." }
    }

    // 3. Kiểm tra xem người gửi hoặc người nhận đã có cặp đôi đang active chưa
    const [senderCouple, receiverCouple] = await Promise.all([
      getActiveCouple(senderId),
      getActiveCouple(trimmedReceiverId),
    ])

    if (senderCouple) {
      return { success: false, error: "Bạn hiện đã đang trong một mối quan hệ cặp đôi." }
    }

    if (receiverCouple) {
      return { success: false, error: "Người này hiện đã đang trong một mối quan hệ cặp đôi khác." }
    }

    // 4. Kiểm tra xem đã có lời mời pending giữa 2 người chưa
    const { data: existingReq } = await supabase
      .from("couple_requests")
      .select("id, status")
      .eq("sender_id", senderId)
      .eq("receiver_id", trimmedReceiverId)
      .eq("status", "pending")
      .maybeSingle()

    if (existingReq) {
      return { success: false, error: "Bạn đã gửi lời mời cho người này rồi, vui lòng đợi phản hồi." }
    }

    // 5. Tạo lời mời mới
    const { data: newReq, error: insertError } = await (supabase
      .from("couple_requests") as any)
      .insert({
        sender_id: senderId,
        receiver_id: trimmedReceiverId,
        status: "pending",
      })
      .select()
      .single()

    if (insertError || !newReq) {
      return { success: false, error: insertError?.message || "Không thể gửi lời mời lúc này" }
    }

    const row = newReq as unknown as CoupleRequestRow

    return {
      success: true,
      request: {
        id: row.id,
        sender_id: row.sender_id,
        receiver_id: row.receiver_id,
        status: row.status as CoupleRequest["status"],
        created_at: row.created_at,
        updated_at: row.updated_at,
        receiver_profile: receiverProfile,
      },
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Đã xảy ra lỗi không xác định"
    return { success: false, error: message }
  }
}

/**
 * Chấp nhận lời mời ghép đôi
 */
export async function acceptCoupleRequest(
  requestId: string,
  currentUserId: string
): Promise<{ success: boolean; couple?: Couple; error?: string }> {
  try {
    // 1. Kiểm tra lời mời
    const { data: reqData, error: reqError } = await supabase
      .from("couple_requests")
      .select("*")
      .eq("id", requestId)
      .eq("receiver_id", currentUserId)
      .eq("status", "pending")
      .maybeSingle()

    if (reqError || !reqData) {
      return { success: false, error: "Lời mời không tồn tại hoặc đã được xử lý" }
    }

    const req = reqData as unknown as CoupleRequestRow

    // 2. Đảm bảo cả hai bên chưa ai có cặp đôi active
    const [senderCouple, receiverCouple] = await Promise.all([
      getActiveCouple(req.sender_id),
      getActiveCouple(req.receiver_id),
    ])

    if (senderCouple || receiverCouple) {
      return { success: false, error: "Một trong hai người hiện đã trong một mối quan hệ khác" }
    }

    // 3. Cập nhật request thành accepted
    await (supabase
      .from("couple_requests") as any)
      .update({ status: "accepted", updated_at: new Date().toISOString() })
      .eq("id", requestId)

    // 4. Tạo bản ghi cặp đôi mới
    const { data: newCoupleData, error: coupleError } = await (supabase
      .from("couples") as any)
      .insert({
        user_1: req.sender_id,
        user_2: req.receiver_id,
        status: "active",
        anniversary_date: new Date().toISOString().split("T")[0],
      })
      .select()
      .single()

    if (coupleError || !newCoupleData) {
      return { success: false, error: coupleError?.message || "Không thể tạo mối quan hệ cặp đôi" }
    }

    const newCouple = newCoupleData as unknown as CoupleRow

    // 5. Huỷ các lời mời pending khác liên quan đến 2 người này
    await (supabase
      .from("couple_requests") as any)
      .update({ status: "canceled", updated_at: new Date().toISOString() })
      .or(`sender_id.eq.${req.sender_id},receiver_id.eq.${req.sender_id},sender_id.eq.${req.receiver_id},receiver_id.eq.${req.receiver_id}`)
      .eq("status", "pending")
      .neq("id", requestId)

    const partnerProfile = await getUserProfileById(req.sender_id)

    return {
      success: true,
      couple: {
        id: newCouple.id,
        user_1: newCouple.user_1,
        user_2: newCouple.user_2,
        anniversary_date: newCouple.anniversary_date,
        status: "active",
        created_at: newCouple.created_at,
        updated_at: newCouple.updated_at,
        partner: partnerProfile || undefined,
      },
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Đã xảy ra lỗi khi chấp nhận lời mời"
    return { success: false, error: message }
  }
}

/**
 * Từ chối lời mời ghép đôi
 */
export async function rejectCoupleRequest(
  requestId: string,
  currentUserId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await (supabase
      .from("couple_requests") as any)
      .update({ status: "rejected", updated_at: new Date().toISOString() })
      .eq("id", requestId)
      .eq("receiver_id", currentUserId)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi khi từ chối lời mời"
    return { success: false, error: message }
  }
}

/**
 * Hủy lời mời đã gửi
 */
export async function cancelCoupleRequest(
  requestId: string,
  currentUserId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await (supabase
      .from("couple_requests") as any)
      .update({ status: "canceled", updated_at: new Date().toISOString() })
      .eq("id", requestId)
      .eq("sender_id", currentUserId)

    if (error) {
      return { success: false, error: error.message }
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
  currentUserId: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await (supabase
      .from("couples") as any)
      .update({ status: "separated", updated_at: new Date().toISOString() })
      .eq("id", coupleId)
      .or(`user_1.eq.${currentUserId},user_2.eq.${currentUserId}`)

    if (error) {
      return { success: false, error: error.message }
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
  newDate: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await (supabase
      .from("couples") as any)
      .update({ anniversary_date: newDate, updated_at: new Date().toISOString() })
      .eq("id", coupleId)
      .or(`user_1.eq.${currentUserId},user_2.eq.${currentUserId}`)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Lỗi khi cập nhật ngày kỷ niệm"
    return { success: false, error: message }
  }
}
