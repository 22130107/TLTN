import Link from "next/link"
import Image from "next/image"
import type { UnifiedPlace } from "@/types/placeExplorer"

export interface PlaceCardProps {
  place: UnifiedPlace
  className?: string
}

export default function PlaceCard({ place, className = "" }: PlaceCardProps) {
  return (
    <Link
      href={`/places/${place.id}`}
      className={`group relative flex flex-col border-2 border-black bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[6px_6px_0px_#000000] ${className}`}
    >
      {/* Image Showcase */}
      <div className="relative aspect-[16/10] w-full overflow-hidden border border-black bg-neutral-100">
        <Image
          src={place.image}
          alt={place.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top-left City Badge */}
        <span className="absolute top-2.5 left-2.5 z-10 border border-white/20 bg-black px-2.5 py-1 text-[10px] sm:text-[11px] font-bold tracking-wider text-white uppercase">
          {place.city}
        </span>

        {/* Top-right Archive Code */}
        <span className="absolute top-2.5 right-2.5 z-10 border border-black bg-white px-2 py-0.5 font-mono text-[10px] sm:text-[11px] font-bold tracking-wider text-black uppercase shadow-[2px_2px_0px_#000000]">
          {place.archiveCode}
        </span>
      </div>

      {/* Content Body */}
      <div className="mt-4 flex flex-1 flex-col justify-between">
        <div>
          {/* Index & Category Row */}
          <div className="flex items-center gap-2 text-xs font-semibold text-zinc-500">
            <span className="border border-black bg-neutral-100 px-1.5 py-0.5 font-mono text-[11px] font-bold text-black">
              #{place.indexNo}
            </span>
            <span aria-hidden="true">•</span>
            <span className="uppercase tracking-wider text-zinc-600 font-semibold text-[11px]">
              {place.tags?.[0] || "Ẩm thực"}
            </span>
          </div>

          {/* Place Title */}
          <h3 className="mt-2 text-base font-black text-black sm:text-lg group-hover:underline line-clamp-1">
            {place.name}
          </h3>

          {/* Signature Dish */}
          {place.signatureDish && (
            <p className="mt-1 text-xs sm:text-sm text-zinc-600 italic line-clamp-1">
              “{place.signatureDish}”
            </p>
          )}

          {/* Address */}
          <div className="mt-2.5 flex items-center gap-1.5 text-xs text-zinc-500">
            <svg
              className="size-3.5 shrink-0 text-black"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="line-clamp-1">{place.address}</span>
          </div>
        </div>

        <div className="mt-4">
          {/* Tags */}
          {place.tags && place.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {place.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="border border-black/20 bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-black"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Bottom Action Hint */}
          <div className="mt-3.5 flex items-center justify-between border-t border-black/10 pt-3 text-xs font-bold text-black">
            <span>Khám phá chi tiết</span>
            <span
              className="transition-transform duration-200 group-hover:translate-x-1"
              aria-hidden="true"
            >
              →
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
