"use client" /* Main Info & Booking Card */ /* Opening Hours */ /* Address */ /* Hotline */ /* Action CTAs */ /* Toast alert */ /* Foodie Tip Card */
import { useState } from "react"
import type { PlaceDetailModel } from "@/types/placeDetail"

interface ModernPlaceDetailSidebarProps {
  place: PlaceDetailModel
}

export default function ModernPlaceDetailSidebar({
  place,
}: ModernPlaceDetailSidebarProps) {
  const [isSavedToSchedule, setIsSavedToSchedule] = useState(false)
  const [showToast, setShowToast] = useState(false)

  const handleToggleSchedule = () => {
    setIsSavedToSchedule(!isSavedToSchedule)
    setShowToast(true)
    setTimeout(() => setShowToast(false), 2500)
  }

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${place.name} ${place.address}`,
  )}`

  return (
    <aside className="w-full lg:w-[360px] shrink-0">
      <div className="sticky top-24 space-y-5">
        {/* Main Info Card */}
        <div className="rounded-2xl border border-[#1E293B] bg-white p-6 shadow-[2px_2px_0px_#1E293B]">
          <div className="flex items-center justify-between pb-4 border-b border-[#1E293B]/10">
            <div>
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Thông tin trải nghiệm
              </span>
              <span className="font-black text-[#1E293B] text-base sm:text-lg">
                Liên Hệ & Giờ Phục Vụ
              </span>
            </div>
            <span className="rounded-full bg-emerald-50 border border-[#1E293B] px-3 py-1 text-xs font-black text-emerald-800 shadow-[1px_1px_0px_#1E293B]">
              Xác thực
            </span>
          </div>

          <div className="mt-5 space-y-4">
            {/* Opening Hours */}
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 border border-[#1E293B] text-amber-700 shadow-[1.5px_1.5px_0px_#1E293B]">
                <svg
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 block">
                  Giờ mở cửa
                </span>
                <span className="text-sm font-extrabold text-[#1E293B]">
                  {place.hours}
                </span>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-rose-50 border border-[#1E293B] text-[#FF5376] shadow-[1.5px_1.5px_0px_#1E293B]">
                <svg
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 block">
                  Địa chỉ
                </span>
                <span className="text-sm font-bold text-[#1E293B] leading-snug">
                  {place.address}
                </span>
              </div>
            </div>

            {/* Hotline */}
            <div className="flex items-start gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-sky-50 border border-[#1E293B] text-sky-700 shadow-[1.5px_1.5px_0px_#1E293B]">
                <svg
                  className="size-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
              </div>
              <div>
                <span className="text-xs font-bold text-slate-500 block">
                  Số điện thoại Hotline
                </span>
                <a
                  href={`tel:${place.phone}`}
                  className="text-sm font-black text-[#FF5376] hover:underline"
                >
                  {place.phone}
                </a>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="mt-6 pt-5 border-t border-[#1E293B]/10 space-y-3">
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#1E293B] bg-[#FF5376] py-2.5 sm:py-3 text-xs sm:text-sm font-black text-white shadow-[1.5px_1.5px_0px_#1E293B] hover:shadow-[2px_2px_0px_#1E293B] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <svg
                className="size-4.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              <span>Chỉ Đường (Google Maps)</span>
            </a>

            <button
              type="button"
              onClick={handleToggleSchedule}
              className={`flex w-full items-center justify-center gap-2 rounded-xl border border-[#1E293B] py-2.5 sm:py-3 text-xs sm:text-sm font-black transition-all duration-200 shadow-[1.5px_1.5px_0px_#1E293B] hover:shadow-[2px_2px_0px_#1E293B] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer ${
                isSavedToSchedule
                  ? "bg-emerald-50 text-emerald-800"
                  : "bg-[#FFFDFC] text-[#1E293B] hover:text-[#FF5376]"
              }`}
            >
              <svg
                className="size-4.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span>
                {isSavedToSchedule
                  ? "✓ Đã Lưu Vào Lịch Trình"
                  : "+ Thêm Vào Lịch Trình"}
              </span>
            </button>
          </div>

          {/* Toast Alert */}
          {showToast && (
            <div className="mt-3 rounded-xl border border-[#1E293B] bg-slate-900 text-white px-3 py-2 text-xs text-center font-bold shadow-[1.5px_1.5px_0px_#1E293B] transition-all">
              {isSavedToSchedule
                ? "Đã lưu địa điểm vào lịch trình ẩm thực của bạn!"
                : "Đã gỡ khỏi lịch trình."}
            </div>
          )}
        </div>

        {/* Foodie Tip Card */}
        <div className="rounded-2xl border border-[#1E293B] bg-[#FFFDFC] p-5 text-xs text-slate-800 font-semibold leading-relaxed shadow-[2px_2px_0px_#1E293B]">
          <div className="flex items-center gap-2 font-black text-[#1E293B] mb-2">
            <span>💡</span>
            <span>Mẹo dành cho thực khách</span>
          </div>
          <p>
            Vào khung giờ cao điểm (11:30 - 13:00 và 18:30 - 20:30), quán có thể
            khá đông. Bạn nên liên hệ đặt bàn trước hoặc ghé sớm 15 phút để có
            trải nghiệm tốt nhất!
          </p>
        </div>
      </div>
    </aside>
  )
}
