"use client"

import Image from "next/image"
import type { PlaceDetailModel } from "@/types/placeDetail"
import PlaceArticlesSection from "./PlaceArticlesSection"

interface ModernPlaceDetailContentProps {
  place: PlaceDetailModel
}

export default function ModernPlaceDetailContent({
  place,
}: ModernPlaceDetailContentProps) {
  return (
    <div className="space-y-6">
      {/* 1. Main Showcase Hero Image */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-2xl border border-[#1E293B] bg-white shadow-[2px_2px_0px_#1E293B]">
        <Image
          src={place.image}
          alt={place.name}
          fill
          priority
          unoptimized={place.image.startsWith("http")}
          sizes="(max-width: 1024px) 100vw, 65vw"
          className="object-cover"
        />

        {/* Floating Category & Tags */}
        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2 z-10 pointer-events-none">
          {place.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[#1E293B]/90 border border-white/30 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-white shadow-[1px_1px_0px_#000000]"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* 2. Story & Description Section */}
      <div className="rounded-2xl border border-[#1E293B] bg-white p-6 sm:p-7 shadow-[2px_2px_0px_#1E293B]">
        <div className="flex items-center gap-3 mb-4">
          <span className="flex size-9 items-center justify-center rounded-xl bg-rose-50 border border-[#1E293B] text-base shadow-[1.5px_1.5px_0px_#1E293B]">
            📖
          </span>
          <h2 className="text-lg sm:text-xl font-black text-[#1E293B]">
            Giới Thiệu & Không Gian
          </h2>
        </div>

        <p className="text-slate-700 leading-relaxed text-sm sm:text-base font-medium">
          {place.story}
        </p>

        <div className="mt-5 pt-4 border-t border-[#1E293B]/10 flex flex-wrap items-center gap-2">
          <span className="text-xs font-extrabold text-[#1E293B] uppercase tracking-wider">
            Phong cách:
          </span>
          {place.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-lg bg-[#FFF5EF] border border-[#1E293B] px-3 py-1 text-xs font-extrabold text-[#FF5376] shadow-[1px_1px_0px_#1E293B]"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* 3. Signature Menu Section */}
      <div className="rounded-2xl border border-[#1E293B] bg-white p-6 sm:p-7 shadow-[2px_2px_0px_#1E293B]">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-xl bg-amber-50 border border-[#1E293B] text-base shadow-[1.5px_1.5px_0px_#1E293B]">
              🥢
            </span>
            <h2 className="text-lg sm:text-xl font-black text-[#1E293B]">
              Thực Đơn Món Ngon Nổi Bật
            </h2>
          </div>
          <span className="text-xs font-extrabold text-[#FF5376] bg-rose-50 border border-[#1E293B] px-3 py-1 rounded-full shadow-[1.5px_1.5px_0px_#1E293B]">
            Đặc sắc
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {place.menuItems.map((item, idx) => (
            <div
              key={idx}
              className="relative flex flex-col justify-between rounded-xl border border-[#1E293B] bg-[#FFFDFC] p-4 shadow-[1.5px_1.5px_0px_#1E293B] hover:shadow-[2.5px_2.5px_0px_#1E293B] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all duration-200"
            >
              <div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-extrabold text-[#1E293B] text-sm sm:text-base leading-snug">
                    {item.name}
                  </h3>
                  {item.isSignature && (
                    <span className="shrink-0 rounded-full bg-[#FF5376] border border-[#1E293B] px-2.5 py-0.5 text-[10px] font-black text-white shadow-[1px_1px_0px_#1E293B]">
                      Best seller
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-slate-600 font-medium line-clamp-2 leading-relaxed">
                  {item.desc}
                </p>
              </div>

              <div className="mt-3.5 pt-2.5 border-t border-[#1E293B]/10 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500">
                  Giá tham khảo
                </span>
                <span className="font-black text-[#FF5376] text-sm sm:text-base">
                  {item.price}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Amenities Section */}
      <div className="rounded-2xl border border-[#1E293B] bg-white p-6 sm:p-7 shadow-[2px_2px_0px_#1E293B]">
        <div className="flex items-center gap-3 mb-5">
          <span className="flex size-9 items-center justify-center rounded-xl bg-emerald-50 border border-[#1E293B] text-base shadow-[1.5px_1.5px_0px_#1E293B]">
            ✨
          </span>
          <h2 className="text-lg sm:text-xl font-black text-[#1E293B]">
            Tiện Ích & Dịch Vụ
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {place.amenities.map((amenity, idx) => (
            <div
              key={idx}
              className="flex items-center gap-3 rounded-xl border border-[#1E293B] bg-[#FFFDFC] p-3 text-sm text-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B]"
            >
              <span className="text-xl">{amenity.icon}</span>
              <span className="font-bold text-xs sm:text-sm">
                {amenity.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Community Articles & Food Experiences Section */}
      <PlaceArticlesSection place={place} />
    </div>
  )
}
