"use client" /* Backdrop */ /* Modal Dialog */ /* Header */ /* 1. Địa điểm quán */ /* 2. Trạng thái lịch hẹn */ /* 3. Ngày hẹn & Khung giờ */ /* Quick Time Slot Pills */ /* 4. Số lượng khách */ /* 5. Ghi chú */ /* Actions */
import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import {
  updateScheduleInDb,
  type ScheduleStatusType,
} from "@/services/scheduleClientService"

export interface ScheduleEditTarget {
  id: string
  placeId: string
  placeName?: string
  scheduledDate: string
  timeSlot: string
  partySize: number
  status: ScheduleStatusType | string
  notes?: string
}

export interface EditScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (updatedSchedule: ScheduleEditTarget) => void
  schedule: ScheduleEditTarget | null
  places: Array<{ id: string; name: string }>
}

const COMMON_TIME_SLOTS = [
  "08:00 - 09:30",
  "11:30 - 13:00",
  "14:00 - 15:30",
  "18:30 - 20:00",
  "20:00 - 21:30",
]

export default function EditScheduleModal({
  isOpen,
  onClose,
  onSuccess,
  schedule,
  places,
}: EditScheduleModalProps) {
  const { user, openAuthModal } = useAuth()

  const [placeId, setPlaceId] = useState("")
  const [scheduledDate, setScheduledDate] = useState("")
  const [timeSlot, setTimeSlot] = useState("18:30 - 20:00")
  const [partySize, setPartySize] = useState(2)
  const [status, setStatus] = useState<ScheduleStatusType>("confirmed")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  useEffect(() => {
    if (schedule) {
      setPlaceId(schedule.placeId || "")
      setScheduledDate(schedule.scheduledDate || "")
      setTimeSlot(schedule.timeSlot || "18:30 - 20:00")
      setPartySize(schedule.partySize || 2)
      setStatus(schedule.status as ScheduleStatusType || "confirmed")
      setNotes(schedule.notes || "")
      setErrorMsg("")
    }
  }, [schedule])

  if (!isOpen || !schedule) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    if (!user) {
      openAuthModal("login")
      return
    }

    if (!scheduledDate) {
      setErrorMsg("Vui lòng chọn ngày hẹn.")
      return
    }

    try {
      setIsSubmitting(true)
      const res = await updateScheduleInDb(schedule.id, {
        placeId,
        scheduledDate,
        timeSlot,
        partySize,
        status,
        notes: notes.trim(),
      })

      if (!res.success) {
        throw new Error(res.error || "Không thể cập nhật lịch hẹn")
      }

      const updatedPlace = places.find((p) => p.id === placeId)
      onSuccess({
        id: schedule.id,
        placeId,
        placeName: updatedPlace?.name || schedule.placeName,
        scheduledDate,
        timeSlot,
        partySize,
        status,
        notes: notes.trim(),
      })
      onClose()
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Đã có lỗi xảy ra khi lưu thay đổi.",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {}
      <div
        className="fixed inset-0 bg-[#1E293B]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {}
      <div className="relative w-full max-w-lg rounded-2xl border border-[#1E293B] bg-[#FAF8F5] p-5 sm:p-7 shadow-[2px_2px_0px_#1E293B] z-10 max-h-[92vh] overflow-y-auto overflow-x-hidden">
        {}
        <div className="flex items-center justify-between border-b border-[#1E293B]/15 pb-4 mb-5">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-amber-50 border border-[#1E293B] text-[#1E293B] shadow-[1px_1px_0px_#1E293B]">
              ✏️
            </span>
            <div>
              <h2 className="text-base sm:text-lg font-black text-[#1E293B]">
                Điều Chỉnh Lịch Hẹn
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                Cập nhật ngày giờ, số khách hoặc thay đổi trạng thái
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex size-8 items-center justify-center rounded-full border border-[#1E293B] bg-white text-[#1E293B] font-bold text-xs shadow-[1px_1px_0px_#1E293B] hover:bg-slate-100 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-xl border border-[#1E293B] bg-rose-50 p-3 text-xs font-bold text-rose-800 shadow-[1px_1px_0px_#1E293B]">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {}
          <div>
            <label className="block text-xs font-black text-[#1E293B] uppercase tracking-wider mb-1.5">
              Địa điểm quán ăn
            </label>
            <select
              value={placeId}
              onChange={(e) => setPlaceId(e.target.value)}
              className="w-full rounded-xl border border-[#1E293B] bg-white px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#1E293B] shadow-[1px_1px_0px_#1E293B] focus:border-[#E55067] focus:outline-none"
            >
              {places.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {}
          <div>
            <label className="block text-xs font-black text-[#1E293B] uppercase tracking-wider mb-1.5">
              Trạng thái lịch hẹn
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setStatus("confirmed")}
                className={`rounded-xl border border-[#1E293B] px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                  status === "confirmed" || status === "pending"
                    ? "bg-emerald-100 text-emerald-900 shadow-[1.5px_1.5px_0px_#1E293B]"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                🟢 Sắp tới
              </button>
              <button
                type="button"
                onClick={() => setStatus("completed")}
                className={`rounded-xl border border-[#1E293B] px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                  status === "completed"
                    ? "bg-[#FFE4E8] text-[#E55067] shadow-[1.5px_1.5px_0px_#1E293B]"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                ✅ Đã ghé
              </button>
              <button
                type="button"
                onClick={() => setStatus("cancelled")}
                className={`rounded-xl border border-[#1E293B] px-3 py-2 text-xs font-bold transition-all cursor-pointer ${
                  status === "cancelled"
                    ? "bg-slate-200 text-slate-800 shadow-[1.5px_1.5px_0px_#1E293B]"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                ❌ Hủy hẹn
              </button>
            </div>
          </div>

          {}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-[#1E293B] uppercase tracking-wider mb-1.5">
                Ngày hẹn
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                required
                className="w-full rounded-xl border border-[#1E293B] bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#1E293B] shadow-[1px_1px_0px_#1E293B] focus:border-[#E55067] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#1E293B] uppercase tracking-wider mb-1.5">
                Khung giờ
              </label>
              <input
                type="text"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                placeholder="VD: 18:30 - 20:00"
                required
                className="w-full rounded-xl border border-[#1E293B] bg-white px-3.5 py-2 text-xs sm:text-sm font-semibold text-[#1E293B] shadow-[1px_1px_0px_#1E293B] focus:border-[#E55067] focus:outline-none"
              />
            </div>
          </div>

          {}
          <div>
            <span className="block text-[11px] font-bold text-slate-500 mb-1">
              Gợi ý khung giờ nhanh:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {COMMON_TIME_SLOTS.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setTimeSlot(slot)}
                  className={`rounded-lg border border-[#1E293B] px-2.5 py-1 text-[11px] font-bold transition-all cursor-pointer ${
                    timeSlot === slot
                      ? "bg-[#E55067] text-white shadow-[1px_1px_0px_#1E293B]"
                      : "bg-white text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>

          {}
          <div>
            <label className="block text-xs font-black text-[#1E293B] uppercase tracking-wider mb-1.5">
              Số lượng thực khách
            </label>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPartySize((p) => Math.max(1, p - 1))}
                className="flex size-9 items-center justify-center rounded-xl border border-[#1E293B] bg-white text-base font-black text-[#1E293B] shadow-[1px_1px_0px_#1E293B] hover:bg-slate-50 active:translate-y-0.5 cursor-pointer"
              >
                -
              </button>
              <span className="min-w-16 text-center text-sm font-black text-[#1E293B]">
                👥 {partySize} khách
              </span>
              <button
                type="button"
                onClick={() => setPartySize((p) => Math.min(20, p + 1))}
                className="flex size-9 items-center justify-center rounded-xl border border-[#1E293B] bg-white text-base font-black text-[#1E293B] shadow-[1px_1px_0px_#1E293B] hover:bg-slate-50 active:translate-y-0.5 cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {}
          <div>
            <label className="block text-xs font-black text-[#1E293B] uppercase tracking-wider mb-1.5">
              Ghi chú hẹn
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="VD: Đặt bàn góc cửa sổ, mang theo bánh kem..."
              className="w-full rounded-xl border border-[#1E293B] bg-white p-3 text-xs sm:text-sm font-medium text-[#1E293B] placeholder-slate-400 shadow-[1px_1px_0px_#1E293B] focus:border-[#E55067] focus:outline-none"
            />
          </div>

          {}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#1E293B]/10">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="rounded-full border border-[#1E293B] bg-white px-4 py-2 text-xs font-bold text-[#1E293B] shadow-[1px_1px_0px_#1E293B] hover:bg-slate-50 cursor-pointer disabled:opacity-50"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-full border border-[#1E293B] bg-[#E55067] px-6 py-2 text-xs font-bold text-white shadow-[1.5px_1.5px_0px_#1E293B] hover:bg-[#d64058] active:translate-y-0.5 cursor-pointer transition-all disabled:opacity-50"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
