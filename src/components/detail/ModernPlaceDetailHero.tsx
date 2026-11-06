"use client" /* Breadcrumb Navigation */ /* Main Header Info Row */ /* Rating Stars */ /* Location */ /* Action Buttons: Favorite & Share */ /* Action Buttons: Favorite & Share */
import { useState } from "react"
import Link from "next/link"
import { useFavorites } from "@/contexts/FavoritesContext"
import type { PlaceDetailModel } from "@/types/placeDetail"

interface ModernPlaceDetailHeroProps {
  place: PlaceDetailModel
}

export default function ModernPlaceDetailHero({
  place,
}: ModernPlaceDetailHeroProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const isFaved = isFavorite(place.id)
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {}
  }

  return (
    <div className="w-full mb-6">
      {}
      <nav
        aria-label="Breadcrumb"
        className="mb-4 flex items-center gap-2 text-xs font-bold text-slate-600"
      >
        <Link href="/" className="hover:text-[#FF5376] transition-colors">
          Trang chủ
        </Link>
        <span>/</span>
        <Link href="/places" className="hover:text-[#FF5376] transition-colors">
          Khám phá
        </Link>
        <span>/</span>
        <span className="text-[#1E293B] font-extrabold line-clamp-1">
          {place.name}
        </span>
      </nav>

      {}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2.5">
            <span
              className={`rounded-full border border-[#1E293B] px-3 py-0.5 text-xs font-bold text-white shadow-[1px_1px_0px_#1E293B] ${
                place.badgeColor || "bg-[#FF5376]"
              }`}
            >
              {place.categoryBadge}
            </span>
            <span className="rounded-full bg-emerald-50 border border-[#1E293B] px-3 py-0.5 text-xs font-bold text-emerald-800 shadow-[1px_1px_0px_#1E293B]">
              🟢 Đang mở cửa
            </span>
            <span className="rounded-full bg-amber-50 border border-[#1E293B] px-3 py-0.5 text-xs font-bold text-amber-900 shadow-[1px_1px_0px_#1E293B]">
              {place.priceRange}
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1E293B] tracking-tight">
            {place.name}
          </h1>

          <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-slate-700 font-semibold">
            {}
            <div className="flex items-center gap-1 font-bold text-[#1E293B]">
              <svg
                className="size-4.5 fill-[#FBBF24] text-[#FBBF24] stroke-[#1E293B] stroke-1"
                viewBox="0 0 24 24"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
              <span>{place.rating.toFixed(1)}</span>
              <span className="text-slate-500 font-medium">
                ({place.reviewCount})
              </span>
            </div>

            <span className="text-[#1E293B]/40">•</span>

            {}
            <div className="flex items-center gap-1">
              <svg
                className="size-4.5 text-[#FF5376] shrink-0"
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
              <span>{place.address}</span>
            </div>
          </div>
        </div>

        {}
        <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
          <button
            type="button"
            onClick={() =>
              toggleFavorite({
                id: place.id,
                name: place.name,
                image: place.image,
                rating: place.rating,
                district: place.district,
                address: place.address,
                badge: place.categoryBadge,
                tags: place.tags,
              })
            }
            className={`flex items-center gap-2 rounded-xl border border-[#1E293B] px-4 py-2 text-xs sm:text-sm font-extrabold transition-all duration-200 shadow-[1.5px_1.5px_0px_#1E293B] hover:shadow-[2px_2px_0px_#1E293B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer ${
              isFaved
                ? "bg-[#FFE4E8] text-[#E55067]"
                : "bg-white text-[#1E293B] hover:bg-[#FFF5EF] hover:text-[#FF5376]"
            }`}
          >
            <svg
              className="size-4.5"
              viewBox="0 0 24 24"
              fill={isFaved ? "#FF5376" : "none"}
              stroke={isFaved ? "#FF5376" : "#1E293B"}
              strokeWidth="2.5"
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
            <span>{isFaved ? "Đã thích" : "Yêu thích"}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="relative flex items-center gap-2 rounded-xl border border-[#1E293B] bg-white px-4 py-2 text-xs sm:text-sm font-extrabold text-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B] hover:shadow-[2px_2px_0px_#1E293B] hover:bg-slate-50 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all duration-200 cursor-pointer"
          >
            <svg
              className="size-4.5 text-[#1E293B]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            <span>{copied ? "Đã sao chép!" : "Chia sẻ"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
