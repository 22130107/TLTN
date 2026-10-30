"use client" /* 1. Left: logofooter.png */ /* 2. Middle: 3 Feature Highlights (hidden on mobile, visible on desktop) */ /* 3. Right: decoratefooter.png */
import Image from "next/image"

export default function MainFooter() {
  const features = [
    {
      id: "places",
      label: "Hàng ngàn địa điểm",
      icon: (
        <svg
          className="size-5 sm:size-6 text-[#E86A7A] shrink-0"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
        </svg>
      ),
    },
    {
      id: "reviews",
      label: "Đánh giá thực tế",
      icon: (
        <svg
          className="size-5 sm:size-6 text-[#E86A7A] shrink-0"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
        </svg>
      ),
    },
    {
      id: "preferences",
      label: "Gợi ý theo sở thích",
      icon: (
        <svg
          className="size-5 sm:size-6 text-[#E86A7A] shrink-0"
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
      ),
    },
  ]

  return (
    <footer className="w-full bg-[#FCE6E6]/80 border-t border-[#F5D5D5] py-3 sm:py-5 transition-colors">
      <div className="mx-auto max-w-7xl px-3 sm:px-6 lg:px-8">
        <div className="flex flex-row items-center justify-between gap-3 sm:gap-4 lg:gap-6">
          {}
          <div className="flex items-center shrink-0">
            <Image
              src="/img/logofooter.png"
              alt="Ăn ngon, Gặp nhau, Thêm yêu"
              width={260}
              height={60}
              priority
              className="h-7 sm:h-9 md:h-11 lg:h-12 w-auto max-w-[45vw] sm:max-w-none object-contain mix-blend-multiply"
            />
          </div>

          {}
          <div className="hidden lg:flex flex-wrap items-center justify-center gap-5 sm:gap-8 lg:gap-10">
            {features.map((feature) => (
              <div
                key={feature.id}
                className="inline-flex items-center gap-2 select-none"
              >
                {feature.icon}
                <span className="text-xs sm:text-sm font-semibold text-[#1E3A5F] tracking-tight">
                  {feature.label}
                </span>
              </div>
            ))}
          </div>

          {}
          <div className="flex items-center shrink-0">
            <Image
              src="/img/decoratefooter.png"
              alt="Cổng Torii, Núi Phú Sĩ và Hoa anh đào"
              width={340}
              height={70}
              priority
              className="h-7 sm:h-9 md:h-11 lg:h-12 w-auto max-w-[45vw] sm:max-w-none object-contain mix-blend-multiply"
            />
          </div>
        </div>
      </div>
    </footer>
  )
}
