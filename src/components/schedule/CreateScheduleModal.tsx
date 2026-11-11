"use client" /* Backdrop */ /* Modal Dialog */ /* Header */ /* Not Logged In Alert */ /* Form */ /* Địa điểm quán */ /* Ngày hẹn & Khung giờ */ /* Số lượng khách */ /* Ghi chú */ /* Buttons */
import { useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/contexts/AuthContext"
import type { Database } from "@/lib/supabase/types"

export interface CreateScheduleModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  places: Array<{ id: string; name: string }>
  defaultPlaceId?: string
}

export default function CreateScheduleModal({
  isOpen,
  onClose,
  onSuccess,
  places,
  defaultPlaceId,
}: CreateScheduleModalProps) {
  const { user, openAuthModal } = useAuth()

  const [placeId, setPlaceId] = useState(defaultPlaceId || places[0]?.id || "")
  const [scheduledDate, setScheduledDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split("T")[0]
  })
  const [timeSlot, setTimeSlot] = useState("18:30 - 20:00")
  const [partySize, setPartySize] = useState(2)
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    if (!user) {
      openAuthModal("login")
      return
    }

    if (!placeId) {
      setErrorMsg("Vui lòng chọn địa điểm quán ăn")
      return
    }

    try {
      setIsSubmitting(true)
      const payload: Database["public"]["Tables"]["schedules"]["Insert"] = {
        user_id: user.id,
        place_id: placeId,
        scheduled_date: scheduledDate,
        time_slot: timeSlot,
        party_size: partySize,
        status: "confirmed",
        notes: notes.trim() || null,
      }
      const { error } = await supabase
        .from("schedules")
        .insert(payload as never)

      if (error) {
        throw error
      }

      onSuccess()
      onClose()
    } catch (err: unknown) {
      const error = err as Error
      setErrorMsg(error?.message || "Không thể tạo lịch hẹn, vui lòng thử lại!")
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
      <div className="relative w-full max-w-lg rounded-xl border border-[#1E293B] bg-white p-6 sm:p-7 shadow-[3px_3px_0px_#1E293B] z-10 max-h-[90vh] overflow-y-auto">
        {}
        <div className="flex items-center justify-between border-b border-[#E8DDD1] pb-4 mb-5">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-lg bg-neutral-50 border border-[#1E293B] text-[#1E293B] shadow-[1px_1px_0px_#1E293B]">
              <svg
                className="size-4.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-[#1E293B] tracking-tight">
                Lên Lịch Hẹn Ẩm Thực
              </h3>
              <p className="text-xs font-medium text-slate-500">
                Thêm điểm hẹn mới vào hành trình food tour của bạn
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-full border-2 border-[#1E293B] bg-slate-100 text-[#1E293B] hover:bg-rose-50 hover:text-[#FF5376] transition-colors"
          >
            ✕
          </button>
        </div>

        {}
        {!user && (
          <div className="mb-5 rounded-2xl border-2 border-[#1E293B] bg-amber-50 p-4 shadow-[2px_2px_0px_#1E293B]">
            <p className="text-xs font-bold text-amber-900">
              ⚠️ Bạn chưa đăng nhập. Vui lòng đăng nhập để lưu lịch hẹn vào tài
              khoản cá nhân.
            </p>
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className="mt-2.5 inline-flex items-center gap-1.5 rounded-xl border-2 border-[#1E293B] bg-[#FF5376] px-3.5 py-1.5 text-xs font-black text-white shadow-[2px_2px_0px_#1E293B] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
            >
              Đăng nhập ngay →
            </button>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 rounded-xl border-2 border-rose-500 bg-rose-50 p-3 text-xs font-bold text-rose-700">
            {errorMsg}
          </div>
        )}

        {}
        <form onSubmit={handleSubmit} className="space-y-4">
          {}
          <div>
            <label className="block text-xs font-black text-[#1E293B] uppercase tracking-wider mb-1.5">
              Địa điểm quán ăn <span className="text-rose-500">*</span>
            </label>
            <select
              value={placeId}
              onChange={(e) => setPlaceId(e.target.value)}
              className="w-full rounded-2xl border-2 border-[#1E293B] bg-[#FFFDFC] px-3.5 py-2.5 text-sm font-bold text-[#1E293B] shadow-[2px_2px_0px_#1E293B] focus:outline-none focus:ring-2 focus:ring-[#FF5376]"
              required
            >
              {places.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-black text-[#1E293B] uppercase tracking-wider mb-1.5">
                Ngày hẹn <span className="text-rose-500">*</span>
              </label>
              <input
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full rounded-2xl border-2 border-[#1E293B] bg-[#FFFDFC] px-3.5 py-2 text-sm font-bold text-[#1E293B] shadow-[2px_2px_0px_#1E293B] focus:outline-none focus:ring-2 focus:ring-[#FF5376]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-black text-[#1E293B] uppercase tracking-wider mb-1.5">
                Khung giờ <span className="text-rose-500">*</span>
              </label>
              <select
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                className="w-full rounded-2xl border-2 border-[#1E293B] bg-[#FFFDFC] px-3.5 py-2 text-sm font-bold text-[#1E293B] shadow-[2px_2px_0px_#1E293B] focus:outline-none focus:ring-2 focus:ring-[#FF5376]"
              >
                <option value="07:30 - 09:00">
                  07:30 - 09:00 (Điểm tâm sáng)
                </option>
                <option value="09:30 - 11:30">
                  09:30 - 11:30 (Cà phê / Brunch)
                </option>
                <option value="11:30 - 13:30">11:30 - 13:30 (Bữa trưa)</option>
                <option value="15:00 - 17:00">
                  15:00 - 17:00 (Trà chiều / Ăn vặt)
                </option>
                <option value="18:00 - 20:00">18:00 - 20:00 (Bữa tối)</option>
                <option value="20:00 - 22:30">
                  20:00 - 22:30 (Ăn đêm / Tụ họp)
                </option>
              </select>
            </div>
          </div>

          {}
          <div>
            <label className="block text-xs font-black text-[#1E293B] uppercase tracking-wider mb-1.5">
              Số lượng người (khách) <span className="text-rose-500">*</span>
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 6, 8].map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() => setPartySize(size)}
                  className={`flex-1 rounded-xl border-2 border-[#1E293B] py-1.5 text-xs font-black transition-all ${
                    partySize === size
                      ? "bg-[#FF5376] text-white shadow-[2px_2px_0px_#1E293B]"
                      : "bg-[#FFF5EF] text-[#1E293B] hover:bg-white"
                  }`}
                >
                  {size} {size === 8 ? "+" : ""}
                </button>
              ))}
            </div>
          </div>

          {}
          <div>
            <label className="block text-xs font-black text-[#1E293B] uppercase tracking-wider mb-1.5">
              Ghi chú lịch hẹn
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ví dụ: Bàn gần cửa sổ, ăn mừng sinh nhật, set Nigiri cá hồi..."
              rows={3}
              className="w-full rounded-2xl border-2 border-[#1E293B] bg-[#FFFDFC] p-3 text-xs sm:text-sm font-medium text-[#1E293B] shadow-[2px_2px_0px_#1E293B] focus:outline-none focus:ring-2 focus:ring-[#FF5376]"
            />
          </div>

          {}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border-2 border-[#1E293B] bg-slate-100 px-4 py-2 text-xs sm:text-sm font-black text-[#1E293B] shadow-[2px_2px_0px_#1E293B] hover:bg-slate-200 transition-colors"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#1E293B] bg-[#FF5376] px-5 py-2 text-xs sm:text-sm font-black text-white shadow-[3px_3px_0px_#1E293B] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <span className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Đang tạo...</span>
                </>
              ) : (
                <>
                  <span>✓</span>
                  <span>Xác Nhận Đặt Hẹn</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
