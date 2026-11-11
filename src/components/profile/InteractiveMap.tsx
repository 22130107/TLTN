"use client" /* Header & Controls */ /* Legend & Locate Action */ /* Geolocation Error Alert */ /* Real-time Address Banner when GPS is active */ /* Map Frame Container */
import dynamic from "next/dynamic"
import type { LocationCoordinate, ScheduleItem } from "@/types/profile"
import type { MapInnerProps } from "./MapInner"

export interface InteractiveMapProps {
  homeCoordinate: LocationCoordinate
  userName: string
  items: ScheduleItem[]
  selectedScheduleId: string | null
  onSelectSchedule: (id: string) => void
  isGPSLocation?: boolean
  locationAddress?: string
  accuracy?: number
  onLocateCurrentPosition?: () => void
  isLocating?: boolean
  locationError?: string | null
  onDismissError?: () => void
}

function MapSkeleton() {
  return (
    <div className="relative flex h-full w-full min-h-[360px] sm:min-h-[420px] lg:min-h-[440px] flex-col items-center justify-center rounded-2xl bg-[#FFFBF8] border border-[#FFEFEA]">
      <div className="relative z-10 flex flex-col items-center gap-3.5 text-center px-4">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-white border border-[#FFEFEA] shadow-xs text-[#FF5376]">
          <svg
            className="size-7 animate-pulse"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
            <line x1="9" y1="3" x2="9" y2="18" />
            <line x1="15" y1="6" x2="15" y2="21" />
          </svg>
        </div>

        <div>
          <h4 className="text-sm font-bold text-[#1E293B] tracking-wide">
            Đang tải bản đồ điểm hẹn...
          </h4>
          <p className="mt-1 text-xs text-slate-500 font-medium">
            Đang định vị các điểm dừng ẩm thực trên hành trình của bạn
          </p>
        </div>

        <div className="h-1.5 w-36 overflow-hidden rounded-full bg-rose-100">
          <div className="h-full w-1/2 rounded-full bg-[#FF5376] animate-[pulse_1s_infinite]" />
        </div>
      </div>
    </div>
  )
}

const DynamicMapInner = dynamic<MapInnerProps>(() => import("./MapInner"), {
  ssr: false,
  loading: () => <MapSkeleton />,
})

export default function InteractiveMap({
  homeCoordinate,
  userName,
  items,
  selectedScheduleId,
  onSelectSchedule,
  isGPSLocation = false,
  locationAddress,
  accuracy,
  onLocateCurrentPosition,
  isLocating = false,
  locationError,
  onDismissError,
}: InteractiveMapProps) {
  return (
    <div className="rounded-3xl border-2 border-[#1E293B] bg-white p-5 sm:p-6 shadow-[4px_4px_0px_#1E293B]">
      {}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="flex size-9 items-center justify-center rounded-xl bg-rose-50 border-2 border-[#1E293B] text-[#FF5376] shadow-[2px_2px_0px_#1E293B]">
            <svg
              className="size-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21" />
              <line x1="9" y1="3" x2="9" y2="18" />
              <line x1="15" y1="6" x2="15" y2="21" />
            </svg>
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-[#1E293B] tracking-tight">
              Bản Đồ Điểm Hẹn Ẩm Thực
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              {isGPSLocation
                ? "Đã định vị theo vị trí thực tế của thiết bị của bạn"
                : "Nhấp vào marker để xem vị trí & thông tin chi tiết"}
            </p>
          </div>
        </div>

        {}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto text-xs font-bold text-slate-700">
          {onLocateCurrentPosition && (
            <button
              type="button"
              onClick={onLocateCurrentPosition}
              disabled={isLocating}
              className="inline-flex items-center gap-1.5 rounded-full border-2 border-[#1E293B] bg-[#FFF5EF] hover:bg-[#FFE8DE] active:bg-[#FFD6C4] px-3 py-1 text-[11px] font-black text-[#1E293B] shadow-[1px_1px_0px_#1E293B] transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait"
            >
              {isLocating ? (
                <>
                  <svg
                    className="size-3 animate-spin text-[#FF5376]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  <span>Đang dò GPS...</span>
                </>
              ) : (
                <>
                  <svg
                    className="size-3.5 text-[#1E293B]"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>
                    {isGPSLocation ? "Cập nhật GPS" : "Vị trí của tôi"}
                  </span>
                </>
              )}
            </button>
          )}

          <span
            className={`inline-flex items-center gap-1.5 rounded-full border border-[#1E293B] px-3 py-1 text-[11px] font-bold shadow-[1px_1px_0px_#1E293B] ${
              isGPSLocation
                ? "bg-emerald-100 text-emerald-900"
                : "bg-emerald-50 text-emerald-800"
            }`}
          >
            <span
              className={`size-2 rounded-full bg-emerald-500 border border-[#1E293B] ${
                isGPSLocation ? "animate-pulse" : ""
              }`}
            />
            {isGPSLocation ? "Vị trí của bạn (GPS)" : "Khởi hành"}
          </span>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-[#1E293B] px-3 py-1 text-[11px] font-bold text-[#FF5376] shadow-[1px_1px_0px_#1E293B]">
            <span className="size-2 rounded-full bg-[#FF5376] border border-[#1E293B]" />
            {items.length} Điểm dừng
          </span>
        </div>
      </div>

      {}
      {locationError && (
        <div className="mb-3.5 flex items-start justify-between gap-2 rounded-2xl border-2 border-[#1E293B] bg-amber-50 p-3 text-xs font-bold text-amber-900 shadow-[2px_2px_0px_#1E293B]">
          <div className="flex items-start gap-2">
            <span className="text-base leading-none">⚠️</span>
            <div className="space-y-0.5">
              <p className="font-extrabold text-[#1E293B]">
                Không thể truy cập vị trí:
              </p>
              <p className="font-medium text-slate-700">{locationError}</p>
            </div>
          </div>
          {onDismissError && (
            <button
              type="button"
              onClick={onDismissError}
              className="rounded-lg p-1 text-slate-500 hover:bg-amber-100 hover:text-black transition-colors"
              aria-label="Đóng thông báo"
            >
              ✕
            </button>
          )}
        </div>
      )}

      {}
      {isGPSLocation && locationAddress && (
        <div className="mb-3.5 flex items-center justify-between gap-2 rounded-xl border border-[#1E293B] bg-emerald-50 px-3.5 py-2 text-xs shadow-[1.5px_1.5px_0px_#1E293B]">
          <div className="flex items-center gap-2 overflow-hidden">
            <svg
              className="size-3.5 text-[#1E293B] shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="font-bold text-slate-700 shrink-0">
              Vị trí hiện tại:
            </span>
            <span className="truncate font-extrabold text-emerald-900">
              {locationAddress}
            </span>
          </div>
          {accuracy && (
            <span className="shrink-0 text-[10.5px] font-semibold text-emerald-700 bg-white border border-[#1E293B] px-2 py-0.5 rounded-full shadow-[1px_1px_0px_#1E293B]">
              ±{Math.round(accuracy)}m
            </span>
          )}
        </div>
      )}

      {}
      <div className="relative h-[380px] sm:h-[440px] lg:h-[480px] w-full overflow-hidden rounded-xl border border-[#1E293B] shadow-[2px_2px_0px_#1E293B] bg-slate-50">
        <DynamicMapInner
          homeCoordinate={homeCoordinate}
          userName={userName}
          items={items}
          selectedScheduleId={selectedScheduleId}
          onSelectSchedule={onSelectSchedule}
          isGPSLocation={isGPSLocation}
          locationAddress={locationAddress}
          accuracy={accuracy}
          onLocateCurrentPosition={onLocateCurrentPosition}
          isLocating={isLocating}
        />
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-500 font-semibold">
        <span>Cuộn để phóng to/thu nhỏ bản đồ</span>
        <span className="flex items-center gap-1">
          <span>Bản đồ mã nguồn mở</span>
          <span className="font-bold text-[#1E293B]">OpenStreetMap</span>
        </span>
      </div>
    </div>
  )
}
