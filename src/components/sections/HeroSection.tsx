"use client" /* Desktop & Tablet Banner: Horizontal 21:9 panoramic */ /* Desktop Search Overlay positioned at red rectangle: bottom-left under subtitle */ /* Mobile Banner: Vertical Portrait 9:16 watercolor */ /* Mobile Search Overlay positioned over bottom grass area under the table */
import { useState } from "react"

import Image from "next/image"

import Link from "next/link"

import { useRouter } from "next/navigation"

const QUICK_TAGS = [
  {
    id: "quan-1",

    label: "Quận 1",

    isLocation: true,

    href: "/places?q=Quận%201",
  },

  { id: "bun", label: "Bún", href: "/places?q=Bún" },

  { id: "pho", label: "Phở", href: "/places?q=Phở" },

  { id: "com-tam", label: "Cơm tấm", href: "/places?q=Cơm%20tấm" },

  { id: "tra-sua", label: "Trà sữa", href: "/places?q=Trà%20sữa" },
]

function HeroSearchTab({ isMobile = false }: { isMobile?: boolean }) {
  const router = useRouter()

  const [searchQuery, setSearchQuery] = useState("")

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (searchQuery.trim()) {
      router.push(`/places?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push("/places")
    }
  }

  return (
    <div
      className={`w-full flex flex-col ${
        isMobile ? "items-center" : "items-start"
      }`}
    >
      <form
        onSubmit={handleSearchSubmit}
        className="relative w-full flex items-center bg-white/95 backdrop-blur-xs rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.06)] border border-[#edd5c0] pl-3.5 sm:pl-4 lg:pl-5 pr-1 sm:pr-1.5 py-1 sm:py-1.5 transition-all focus-within:shadow-[0_6px_20px_rgba(242,100,115,0.18)] focus-within:border-[#F26473]/60"
      >
        <svg
          className="size-4 sm:size-4.5 lg:size-5 text-[#1E3A5F]/70 shrink-0 mr-1.5 sm:mr-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2.2}
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Bạn muốn ăn gì hôm nay?"
          className="min-w-0 flex-1 bg-transparent text-[#1E3A5F] placeholder:text-[#8C9AA8] text-xs sm:text-sm lg:text-[15px] font-normal focus:outline-none"
        />

        <button
          type="submit"
          aria-label="Tìm kiếm"
          className="h-8 sm:h-9 lg:h-10 px-3.5 sm:px-4 lg:px-5 rounded-full bg-[#F26473] hover:bg-[#E84E5F] active:scale-95 text-white flex items-center justify-center shrink-0 shadow-xs hover:shadow transition-all duration-200"
        >
          <svg
            className="size-3.5 sm:size-4 text-white stroke-[2.5]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
            />
          </svg>
        </button>
      </form>

      <div
        className={`flex items-center gap-1.5 sm:gap-2 mt-2 sm:mt-2.5 flex-wrap ${
          isMobile ? "justify-center" : "justify-start"
        }`}
      >
        {QUICK_TAGS.map((tag) => (
          <Link
            key={tag.id}
            href={tag.href}
            className="inline-flex items-center gap-1 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-white/85 hover:bg-white text-[11px] sm:text-xs font-medium text-[#1E3A5F] border border-[#edd5c0]/70 shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-xs hover:border-[#D34B5E]/30 transition-all active:scale-95"
          >
            {tag.isLocation && (
              <svg
                className="size-2.5 sm:size-3 text-[#D34B5E] shrink-0"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
              </svg>
            )}
            <span>{tag.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden bg-[#fdefdf]">
      {}
      <div className="hidden md:block relative w-full aspect-[3168/1344] overflow-hidden">
        <Image
          src="/img/herosection.webp"
          alt="Tìm quán ngon ở Sài Gòn - Khám phá hàng ngàn món ăn, quán xá hấp dẫn quanh bạn"
          width={3168}
          height={1344}
          priority
          sizes="100vw"
          className="w-full h-full object-cover object-center"
        />

        {}
        <div className="absolute left-[6.2%] top-[57%] w-[33%] max-w-[480px] z-10">
          <HeroSearchTab />
        </div>
      </div>

      {}
      <div className="block md:hidden relative w-full aspect-[1536/2752] overflow-hidden">
        <Image
          src="/img/herosection-mobile.webp"
          alt="Tìm quán ngon ở Sài Gòn - Khám phá hàng ngàn món ăn, quán xá hấp dẫn quanh bạn"
          width={1536}
          height={2752}
          sizes="100vw"
          className="w-full h-full object-cover object-center"
        />

        {}
        <div className="absolute inset-x-0 mx-auto bottom-[4%] w-[92%] max-w-[350px] z-10">
          <HeroSearchTab isMobile />
        </div>
      </div>
    </section>
  )
}
