"use client" /* Header Section */ /* Content Section: Timeline or Empty State */ /* Timeline Track (Pastel Vertical Line) */ /* Timeline Circular Node */ /* Schedule Item Card */ /* Header Section */ /* Content Section: Timeline or Empty State */ /* Timeline Track (High-contrast line) */ /* Timeline Circular Node */
import type { ScheduleItem } from "@/types/profile"
import ScheduleItemCard from "./ScheduleItemCard"

export interface ScheduleTimelineProps {
  items: ScheduleItem[]
  selectedScheduleId: string | null
  onSelectSchedule: (id: string) => void
  filterLabel?: string
}

export default function ScheduleTimeline({
  items,
  selectedScheduleId,
  onSelectSchedule,
  filterLabel,
}: ScheduleTimelineProps) {
  const hasItems = items.length > 0

  return (
    <div className="rounded-3xl border-2 border-[#1E293B] bg-white p-5 sm:p-7 shadow-[4px_4px_0px_#1E293B]">
      {}
      <div className="mb-6 flex flex-col gap-3.5 border-b-2 border-[#1E293B]/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
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
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </span>
          <div>
            <h3 className="text-base sm:text-lg font-extrabold text-[#1E293B] tracking-tight">
              Lịch Trình Food Tour & Điểm Dừng
            </h3>
            <p className="mt-0.5 text-xs text-slate-600 font-medium">
              Hành trình trải nghiệm ẩm thực chuẩn gu theo thứ tự thời gian
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {filterLabel && (
            <span className="inline-flex items-center rounded-full bg-[#FFF5EF] px-3 py-1 text-xs font-bold text-[#FF5376] border-2 border-[#1E293B] shadow-[1px_1px_0px_#1E293B]">
              Bộ lọc: <span className="ml-1 underline">{filterLabel}</span>
            </span>
          )}
          <span className="inline-flex items-center rounded-full bg-[#FF5376] px-3 py-1 text-xs font-extrabold text-white border-2 border-[#1E293B] shadow-[2px_2px_0px_#1E293B]">
            {items.length} điểm đến
          </span>
        </div>
      </div>

      {}
      {!hasItems ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#1E293B] bg-[#FFFDFB] p-8 text-center sm:p-12">
          <div className="mb-3 flex size-12 items-center justify-center rounded-2xl bg-rose-50 border-2 border-[#1E293B] text-[#FF5376] shadow-[2px_2px_0px_#1E293B]">
            <svg
              className="size-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect width="18" height="18" x="3" y="4" rx="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>
          <h4 className="text-base font-bold text-[#1E293B]">
            Chưa có lịch trình nào trong mục này
          </h4>
          <p className="mt-1.5 max-w-sm text-xs leading-relaxed text-slate-500 sm:text-sm font-medium">
            {filterLabel
              ? `Không tìm thấy điểm đến nào phù hợp với bộ lọc "${filterLabel}". Bạn hãy thử chọn tab bộ lọc khác.`
              : "Hiện tại chưa có lịch trình ẩm thực nào được ghi nhận."}
          </p>
        </div>
      ) : (
        <div className="relative pl-7 sm:pl-9 space-y-5 sm:space-y-6">
          {}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute left-3.5 sm:left-4 top-6 bottom-6 w-1 bg-[#1E293B]/25 rounded-full"
          />

          {items.map((item, index) => {
            const isSelected = item.id === selectedScheduleId

            return (
              <div key={item.id} className="relative group/timeline">
                {}
                <div
                  className={`absolute -left-7 sm:-left-9 top-4 flex size-7 items-center justify-center rounded-full transition-all duration-200 z-10 border-2 border-[#1E293B] ${
                    isSelected
                      ? "bg-[#FF5376] text-white shadow-[2px_2px_0px_#1E293B] scale-110 font-black"
                      : "bg-white text-[#1E293B] hover:bg-[#FF5376] hover:text-white"
                  }`}
                  title={`Điểm dừng #${index + 1}`}
                >
                  <span className="text-[11px] font-black leading-none">
                    {index + 1}
                  </span>
                </div>

                <ScheduleItemCard
                  item={item}
                  isSelected={isSelected}
                  onSelect={onSelectSchedule}
                />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
