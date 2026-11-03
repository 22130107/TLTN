"use client"

import Image from "next/image"
import Link from "next/link"
import { useFavorites } from "@/contexts/FavoritesContext"
import {
  FEATURED_PLACES,
  type FeaturedPlace,
  type PlaceTag,
} from "@/data/featuredPlacesData"

export type { FeaturedPlace, PlaceTag }
export { FEATURED_PLACES }

export interface FeaturedPlacesSectionProps {
  initialPlaces?: FeaturedPlace[]
}

export default function FeaturedPlacesSection({
  initialPlaces,
}: FeaturedPlacesSectionProps) {
  const places =
    initialPlaces && initialPlaces.length > 0 ? initialPlaces : FEATURED_PLACES
  const { isFavorite, toggleFavorite } = useFavorites()

  return (
    <section className="w-full bg-[#fdefdf] pt-1 pb-6 sm:pt-2 sm:pb-8 transition-colors">
      <div className="mx-auto max-w-[1360px] px-3 sm:px-5 lg:px-6">
        <div className="flex flex-col lg:flex-row gap-3.5 lg:gap-4 items-stretch">
          <div className="flex-1 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <div className="inline-flex items-center px-3 py-1 sm:px-4 sm:py-1.5 rounded-xl bg-[#f9d5b5] border border-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B] shrink-0">
                <Image
                  src="/img/diadiemnoibat.png"
                  alt="Địa điểm nổi bật"
                  width={884}
                  height={135}
                  priority
                  className="h-6 sm:h-8 lg:h-9 w-auto object-contain"
                />
              </div>

              <Link
                href="/places"
                className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1E293B] hover:text-[#FF5376] transition-colors shrink-0 bg-white px-3.5 py-1.5 rounded-full border border-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B] hover:translate-x-0.5 hover:translate-y-0.5"
              >
                <span>Xem tất cả</span>
                <span
                  className="transition-transform duration-200 group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 items-stretch flex-1">
              {places.map((place) => {
                const isFaved = isFavorite(place.id)
                return (
                  <div
                    key={place.id}
                    className="group relative bg-white rounded-xl overflow-hidden border border-[#1E293B] shadow-[2px_2px_0px_#1E293B] hover:shadow-[3px_3px_0px_#1E293B] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200 flex flex-col justify-between"
                  >
                    <Link
                      href={place.href}
                      className="flex flex-col h-full justify-between focus:outline-none"
                    >
                      <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#faf5f0] border-b border-[#1E293B]">
                        <Image
                          src={place.image}
                          alt={place.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        <button
                          type="button"
                          aria-label={
                            isFaved
                              ? `Bỏ yêu thích ${place.name}`
                              : `Yêu thích ${place.name}`
                          }
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            toggleFavorite({
                              id: place.id,
                              name: place.name,
                              image: place.image,
                              rating: place.rating,
                              district: place.location,
                              badge: place.badge,
                              tags: place.tags.map((t) => t.label),
                            })
                          }}
                          className="absolute top-2.5 right-2.5 size-7 rounded-full bg-white/95 border border-[#1E293B] shadow-[1px_1px_0px_#1E293B] flex items-center justify-center text-xs hover:scale-110 active:scale-95 transition-transform z-10 cursor-pointer"
                        >
                          <svg
                            className={`size-4 transition-colors ${
                              isFaved
                                ? "fill-[#FF5376] text-[#FF5376]"
                                : "fill-none text-[#1E293B]"
                            }`}
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                          </svg>
                        </button>
                      </div>

                      <div className="p-3.5 flex flex-col justify-between flex-1">
                        <div>
                          <div className="flex items-center justify-between gap-1">
                            <h3 className="font-bold text-[#1E293B] text-[13px] sm:text-sm truncate group-hover:text-[#FF5376] transition-colors">
                              {place.name}
                            </h3>
                            <div className="flex items-center gap-1 shrink-0 text-xs font-bold text-[#1E293B]">
                              <span className="text-[#F59E0B]">★</span>
                              <span>{place.rating.toFixed(1)}</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 text-[11px] font-medium text-slate-600 mt-1.5">
                            <svg
                              className="size-3 text-[#FF5376] shrink-0"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              aria-hidden="true"
                            >
                              <path
                                fillRule="evenodd"
                                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                clipRule="evenodd"
                              />
                            </svg>
                            <span className="truncate">{place.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 mt-3 flex-wrap">
                          {place.tags.map((tag) => (
                            <span
                              key={tag.label}
                              className={`text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full font-semibold border border-[#1E293B] shadow-[1px_1px_0px_#1E293B] transition-colors ${
                                tag.highlight
                                  ? "bg-[#EAF7EE] text-[#1e6f24]"
                                  : "bg-[#FFF0F2] text-[#D34B5E]"
                              }`}
                            >
                              {tag.label}
                            </span>
                          ))}
                        </div>
                      </div>
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="w-full max-w-[320px] sm:max-w-[350px] lg:max-w-none lg:w-[26%] xl:w-[25.5%] 2xl:w-[25%] shrink-0 flex flex-col justify-start items-center mx-auto lg:mx-0">
            <div className="relative w-full aspect-[380/441] flex items-center justify-center">
              <Image
                src="/img/preview.png"
                alt="Gợi ý cho cặp đôi hôm nay"
                fill
                sizes="(max-width: 1024px) 100vw, 26vw"
                className="object-contain"
              />

              <Link
                href="/places?tag=couple"
                className="absolute bottom-[calc(5.5%+20px)] left-1/2 -translate-x-1/2 w-[58%] max-w-[150px] py-1.5 sm:py-2 px-3 sm:px-3.5 bg-[#FF5376] hover:bg-[#d64058] text-white text-xs sm:text-[13px] font-bold rounded-full border border-[#1E293B] text-center shadow-[1.5px_1.5px_0px_#1E293B] flex items-center justify-center gap-1 z-10 hover:scale-105 active:scale-95 transition-all"
              >
                <span>Xem ngay</span>
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
