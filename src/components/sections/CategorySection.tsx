"use client" /* Section Header: 🌸 Danh mục món ăn image badge on left + "Xem tất cả →" on right */
import Image from "next/image"
import Link from "next/link"

export interface FoodCategory {
  id: string
  name: string
  image: string
  query: string
}

export const FOOD_CATEGORIES: FoodCategory[] = [
  {
    id: "bun-pho",
    name: "Bún - Phở",
    image: "/img/bun-pho.png",
    query: "Phở",
  },
  { id: "com", name: "Cơm", image: "/img/com.png", query: "Cơm" },
  { id: "nuong", name: "Món nướng", image: "/img/nuong.png", query: "Nướng" },
  { id: "haisan", name: "Hải sản", image: "/img/haisan.png", query: "Hải sản" },
  { id: "lau", name: "Lẩu", image: "/img/lau.png", query: "Lẩu" },
  {
    id: "streetfood",
    name: "Street food",
    image: "/img/streetfood.png",
    query: "Đường phố",
  },
  { id: "trasua", name: "Trà sữa", image: "/img/trasua.png", query: "Trà sữa" },
  { id: "banh", name: "Bánh ngọt", image: "/img/banh.png", query: "Bánh" },
  { id: "cafe", name: "Cà phê", image: "/img/cafe.png", query: "Café" },
  { id: "chay", name: "Đồ chay", image: "/img/chay.png", query: "Chay" },
]

export default function CategorySection() {
  return (
    <section className="w-full bg-[#fdefdf] pt-1 pb-2 sm:pt-2 sm:pb-3 transition-colors">
      <div className="mx-auto max-w-[1360px] px-3 sm:px-5 lg:px-6">
        {}
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div className="inline-flex items-center px-2.5 py-1 sm:px-4 sm:py-1.5 rounded-xl sm:rounded-2xl bg-[#f9d5b5] shadow-xs shrink-0">
            <Image
              src="/img/danhmucmonan.png"
              alt="Danh mục món ăn"
              width={885}
              height={133}
              priority
              className="h-6 sm:h-8 lg:h-9 w-auto object-contain"
            />
          </div>

          <Link
            href="/places"
            className="group inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[#1E3A5F] hover:text-[#D34B5E] transition-colors shrink-0"
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

        {}
        <div className="grid grid-cols-5 lg:grid-cols-10 gap-x-2 sm:gap-x-3 lg:gap-x-2 xl:gap-x-3 gap-y-2.5 sm:gap-y-3 items-start justify-items-center w-full">
          {FOOD_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/places?q=${encodeURIComponent(cat.query)}`}
              className="group flex flex-col items-center justify-center w-full focus:outline-none"
            >
              <div className="relative size-16 sm:size-20 md:size-24 lg:size-[92px] xl:size-[102px] 2xl:size-[108px] transition-transform duration-300 ease-out group-hover:scale-105 group-hover:-translate-y-0.5">
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  sizes="(max-width: 640px) 20vw, (max-width: 1024px) 20vw, 10vw"
                  className="object-contain"
                />
              </div>
              <span className="mt-1 text-[11px] sm:text-xs xl:text-[13px] font-semibold text-[#1E3A5F] group-hover:text-[#D34B5E] text-center transition-colors truncate w-full">
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
