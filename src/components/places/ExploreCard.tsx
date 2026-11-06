"use client" /* Top Image & Floating Badges */ /* Top-Left Category Badge */ /* Top-Right Favorite Heart Button */ /* Card Info Section */ /* Place Name */ /* Star Rating & Reviews */ /* Distance & District */ /* Category Tag Pills */ /* Short Description */ /* Category Tag Pills */
import Image from "next/image"
import Link from "next/link"
import { useFavorites } from "@/contexts/FavoritesContext"
import type { ExplorePlace } from "@/data/explorePlacesData"

export interface ExploreCardProps {
  place: ExplorePlace
  className?: string
}

export default function ExploreCard({
  place,
  className = "",
}: ExploreCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const isFaved = isFavorite(place.id)

  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite({
      id: place.id,
      name: place.name,
      image: place.image,
      rating: place.rating,
      district: place.district,
      badge: place.badge,
      tags: place.tags,
    })
  }

  return (
    <div
      className={`group relative flex flex-col justify-between rounded-xl border border-[#1E293B] bg-white p-3.5 shadow-[2px_2px_0px_#1E293B] hover:shadow-[3px_3px_0px_#1E293B] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 ${className}`}
    >
      {}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-[#1E293B] bg-[#FFF5EF]">
        <Link href={`/places/${place.id}`} className="block size-full">
          <Image
            src={place.image}
            alt={place.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </Link>

        {}
        <span
          className={`absolute top-2.5 left-2.5 z-10 rounded-md border border-[#1E293B] px-2.5 py-0.5 text-[10px] font-bold text-white shadow-[1px_1px_0px_#1E293B] ${place.badgeColor}`}
        >
          {place.badge}
        </span>

        {}
        <button
          type="button"
          onClick={handleFavoriteToggle}
          aria-label={isFaved ? "Bỏ yêu thích" : "Thêm vào yêu thích"}
          className="absolute top-2.5 right-2.5 z-10 flex size-7 items-center justify-center rounded-full border border-[#1E293B] bg-white/95 text-rose-500 shadow-[1px_1px_0px_#1E293B] transition-transform hover:scale-110 active:scale-95 cursor-pointer"
        >
          <svg
            className="size-4"
            viewBox="0 0 24 24"
            fill={isFaved ? "#FF5376" : "none"}
            stroke={isFaved ? "#FF5376" : "#1E293B"}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>
      </div>

      {}
      <div className="mt-3 flex flex-1 flex-col justify-between">
        <div>
          {}
          <Link href={`/places/${place.id}`}>
            <h3 className="text-[15px] font-bold text-[#1E293B] transition-colors group-hover:text-[#FF5376] line-clamp-1">
              {place.name}
            </h3>
          </Link>

          {}
          <div className="mt-1.5 flex items-center gap-1.5 text-xs text-slate-700">
            <svg
              className="size-3.5 fill-[#FBBF24] text-[#FBBF24]"
              viewBox="0 0 24 24"
            >
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            <span className="font-bold text-[#1E293B]">
              {place.rating.toFixed(1)}
            </span>
            <span className="text-slate-500 font-normal">
              ({place.reviewCount})
            </span>
          </div>

          {}
          <div className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-600">
            <svg
              className="size-3.5 text-[#2563EB]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span>
              {place.distanceText} · {place.district}
            </span>
          </div>

          {}
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {place.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md border border-[#1E293B] bg-[#FFF0F0] px-2 py-0.5 text-[10.5px] font-semibold text-[#1E293B] shadow-[1px_1px_0px_#1E293B]"
              >
                {tag}
              </span>
            ))}
          </div>

          {}
          <p className="mt-2.5 text-xs font-normal leading-relaxed text-slate-600 line-clamp-2">
            {place.description}
          </p>
        </div>
      </div>
    </div>
  )
}
