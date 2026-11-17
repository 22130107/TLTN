import { supabase } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/types"

export type ScheduleStatusType = Database["public"]["Enums"]["schedule_status_enum"]

export interface UpdateScheduleInput {
  placeId?: string
  scheduledDate?: string
  timeSlot?: string
  partySize?: number
  status?: ScheduleStatusType
  notes?: string
}

/**
 * Cập nhật thông tin lịch hẹn trong Supabase DB
 */
export async function updateScheduleInDb(
  id: string,
  input: UpdateScheduleInput,
): Promise<{ success: boolean; error?: string }> {
  try {
    const updatePayload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    }

    if (input.placeId) updatePayload.place_id = input.placeId
    if (input.scheduledDate) updatePayload.scheduled_date = input.scheduledDate
    if (input.timeSlot) updatePayload.time_slot = input.timeSlot
    if (typeof input.partySize === "number")
      updatePayload.party_size = input.partySize
    if (input.status) updatePayload.status = input.status
    if (input.notes !== undefined) updatePayload.notes = input.notes

    const { error } = await supabase
      .from("schedules")
      .update(updatePayload as never)
      .eq("id", id)

    if (error) {
      console.error("[scheduleClientService] update error:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Lỗi không xác định khi cập nhật lịch hẹn",
    }
  }
}

/**
 * Xóa vĩnh viễn lịch hẹn khỏi Supabase DB
 */
export async function deleteScheduleInDb(
  id: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase.from("schedules").delete().eq("id", id)

    if (error) {
      console.error("[scheduleClientService] delete error:", error)
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error
          ? err.message
          : "Lỗi không xác định khi xóa lịch hẹn",
    }
  }
}

export interface CreateScheduleInput {
  userId: string
  placeId: string
  scheduledDate: string
  timeSlot: string
  partySize: number
  status?: ScheduleStatusType | string
  notes?: string
}

/**
 * Tạo hàng loạt nhiều chặng lịch hẹn (ví dụ toàn bộ 2 - 3 chặng của một buổi hẹn)
 */
export async function createBatchSchedulesInDb(
  items: CreateScheduleInput[],
): Promise<{ success: boolean; insertedCount: number; error?: string }> {
  if (!items || items.length === 0) {
    return { success: true, insertedCount: 0 }
  }

  try {
    const payloads = items.map((item) => ({
      user_id: item.userId,
      place_id: item.placeId,
      scheduled_date: item.scheduledDate,
      time_slot: item.timeSlot,
      party_size: item.partySize,
      status: item.status || "confirmed",
      notes: item.notes ? item.notes.trim() : null,
    }))

    const { data, error } = await supabase
      .from("schedules")
      .insert(payloads as never)
      .select("id")

    if (error) {
      console.error("[scheduleClientService] createBatch error:", error)
      return { success: false, insertedCount: 0, error: error.message }
    }

    return { success: true, insertedCount: data ? data.length : items.length }
  } catch (err) {
    return {
      success: false,
      insertedCount: 0,
      error:
        err instanceof Error ? err.message : "Lỗi khi lưu các chặng lịch hẹn",
    }
  }
}

/**
 * Chuyển đổi trạng thái nhanh (Sắp tới <-> Đã ghé)
 */
export async function toggleScheduleStatusInDb(
  id: string,
  currentStatus: ScheduleStatusType | string,
): Promise<{ success: boolean; newStatus: ScheduleStatusType; error?: string }> {
  const newStatus: ScheduleStatusType =
    currentStatus === "completed" ? "confirmed" : "completed"

  const result = await updateScheduleInDb(id, { status: newStatus })

  return { success: result.success, newStatus, error: result.error }
}
