"use client" /* Thumbnail */ /* Category badge overlay */ /* Main Details */ /* Header Badges */ /* Place Name */ /* Address */ /* Signature Dish */ /* Notes if available */ /* Footer Actions */ /* Thumbnail */ /* Category badge overlay */ /* Main Details */ /* Header Badges */ /* Place Name */ /* Address */ /* Signature Dish */ /* Notes if available */ /* Footer Actions */ /* Address */ /* Signature Dish */
import Link from "next/link"
import type { ScheduleItem, ScheduleStatus } from "@/types/profile"

export interface ScheduleItemCardProps {
  item: ScheduleItem
  isSelected: boolean
  onSelect: (id: string) => void
}

function formatDate(dateStr: string): string {
  try {
    const parts = dateStr.split("-")
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`
    }
    return dateStr
  } catch {
    return dateStr
  }
}

const statusConfig: Record<ScheduleStatus, {
  label: string
  badgeClass: string
  dotClass: string
}> = {
  upcoming: {
    label: "Sắp tới",
    badgeClass: "bg-rose-50 border border-rose-100 text-[#FF5376]",
    dotClass: "bg-[#FF5376]",
  },
  in_progress: {
    label: "Đang diễn ra",
    badgeClass: "bg-amber-50 border border-amber-200 text-amber-700",
    dotClass: "bg-amber-500 animate-pulse",
  },
  completed: {
    label: "Đã ghé",
    badgeClass: "bg-emerald-50 border border-emerald-200 text-emerald-700",
    dotClass: "bg-emerald-500",
  },
}

export default function ScheduleItemCard({
  item,
  isSelected,
  onSelect,
}: ScheduleItemCardProps) {
  const statusInfo = statusConfig[item.status] || {
    label: item.status,
    badgeClass: "bg-slate-50 border border-slate-200 text-slate-700",
    dotClass: "bg-slate-400",
  }

  return (
    <div
      id={`schedule-item-${item.id}`}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      onClick={() => onSelect(item.id)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault()
          onSelect(item.id)
        }
      }}
      className={`group relative flex flex-col sm:flex-row gap-4 sm:gap-5 rounded-2xl border-2 border-[#1E293B] p-4 sm:p-5 transition-all duration-200 cursor-pointer ${
        isSelected
          ? "bg-[#FFFDFC] shadow-[4px_4px_0px_#FF5376] -translate-y-0.5"
          : "bg-white hover:bg-[#FFFDFC] hover:shadow-[3px_3px_0px_#1E293B] hover:-translate-y-0.5"
      }`}
    >
      {}
      <div className="relative w-full sm:w-44 sm:min-w-[176px] h-40 sm:h-auto rounded-xl border-2 border-[#1E293B] overflow-hidden bg-slate-100 shrink-0 shadow-[2px_2px_0px_#1E293B]">
        <img
          src={item.imageUrl}
          alt={item.placeName}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {}
        <span className="absolute top-2.5 left-2.5 rounded-full bg-[#FF5376] border border-[#1E293B] px-2.5 py-0.5 text-[10.5px] font-bold text-white shadow-[1px_1px_0px_#1E293B]">
          {item.category}
        </span>
      </div>

      {}
      <div className="flex flex-1 flex-col justify-between">
        <div>
          {}
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold border border-[#1E293B] ${statusInfo.badgeClass}`}
            >
              <span
                className={`size-1.5 rounded-full ${statusInfo.dotClass}`}
              />
              {statusInfo.label}
            </span>

            <div className="flex items-center gap-2 text-xs font-bold text-slate-600">
              <span className="flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-lg border border-[#1E293B]/40">
                ⏰ {item.time}
              </span>
              <span>•</span>
              <span>{formatDate(item.date)}</span>
            </div>
          </div>

          {}
          <h4 className="text-base sm:text-lg font-extrabold text-[#1E293B] group-hover:text-[#FF5376] transition-colors leading-snug">
            {item.placeName}
          </h4>

          {}
          <div className="mt-1 flex items-start gap-1 text-xs sm:text-sm text-slate-600 font-medium">
            <svg
              className="size-3.5 text-[#1E293B] shrink-0 mt-0.5"
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
            <span className="line-clamp-1">{item.address}</span>
          </div>

          {}
          <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-slate-800">
            <span>Món đặc sắc:</span>
            <span className="font-extrabold text-[#FF5376]">
              {item.signatureDish}
            </span>
          </div>

          {}
          {item.notes && (
            <p className="mt-2.5 rounded-xl bg-[#FAF5EE] border border-[#1E293B] px-3 py-2 text-xs text-slate-800 font-medium line-clamp-2 leading-relaxed shadow-[1px_1px_0px_#1E293B]">
              💬 {item.notes}
            </p>
          )}
        </div>

        {}
        <div className="mt-4 pt-3 border-t border-[#1E293B]/10 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-500">
            👥 {item.guestsCount} khách đặt hẹn
          </span>

          <Link
            href={`/places/${item.placeId || item.id}`}
            onClick={(e) => e.stopPropagation()}
            className="inline-flex items-center gap-1 rounded-xl border-2 border-[#1E293B] bg-[#FF5376] px-3 py-1 text-xs font-extrabold text-white shadow-[2px_2px_0px_#1E293B] hover:shadow-none hover:translate-x-0.5 hover:translate-y-0.5 transition-all"
          >
            <span>Chi tiết quán</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
