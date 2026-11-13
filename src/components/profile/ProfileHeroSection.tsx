"use client" /* 1. Desktop & Tablet View (md+): Absolute anchored coordinates matching the scenic sand area */ /* Background Scenic Artwork */ /* 1.1 Profile Identity (Avatar + Details): Shifted down 10px more, right 100px more */ /* Circular Avatar with Camera Badge */ /* Camera Icon Badge */ /* Identity & Details */ /* Name */ /* Handle */ /* Bio */ /* Meta details (Location & Joined Date) */ /* Follow Stats */ /* 1.2 "Chỉnh sửa hồ sơ" Button (shifted left 250px) */ /* 1.3 Food Quote (shifted left 250px - NO ramen-bowl image) */ /* 2. Mobile View (< md): Clean adaptive card layout */ /* Mobile Background Artwork Header */ /* Mobile Floating Card Overlay */ /* Avatar & Edit Button Row */ /* Circular Avatar */ /* Edit Button */ /* Names & Bio */ /* Meta Info */ /* Quote Pill */
import Image from "next/image"
import type { UserProfile } from "@/types/profile"

interface ProfileHeroSectionProps {
  profile: UserProfile
  onEditProfile?: () => void
}

export default function ProfileHeroSection({
  profile,
  onEditProfile,
}: ProfileHeroSectionProps) {
  return (
    <section className="relative w-full overflow-hidden bg-[#fdefdf]">
      {}
      <div className="hidden md:block relative w-full aspect-[2172/724] overflow-hidden select-none">
        {}
        <Image
          src="/img/herosection-profile.webp"
          alt="Hình nền hồ sơ ẩm thực - Núi Phú Sĩ và Hoa anh đào"
          fill
          priority
          sizes="100vw"
          className="w-full h-full object-cover object-center"
        />

        {}
        <div className="absolute left-[calc(9.5%+150px)] top-[calc(33%+40px)] flex items-center gap-4 lg:gap-5 xl:gap-6 z-10 max-w-[48%] xl:max-w-[50%]">
          {}
          <div className="relative shrink-0">
            <div className="relative size-24 lg:size-28 xl:size-32 rounded-full overflow-hidden border-[3.5px] lg:border-4 border-white shadow-md ring-2 ring-[#70A8DB]/70 bg-[#aed4f5]">
              <Image
                src={profile.avatarUrl}
                alt={profile.name}
                fill
                sizes="(max-width: 1024px) 112px, 128px"
                className="object-cover"
              />
            </div>

            {}
            <button
              type="button"
              onClick={onEditProfile}
              className="absolute bottom-0 right-0 size-7 lg:size-8 rounded-full bg-[#1F74BA] hover:bg-[#185d96] text-white flex items-center justify-center border-2 border-white shadow-xs transition-colors cursor-pointer"
              title="Thay đổi ảnh đại diện"
              aria-label="Thay đổi ảnh đại diện"
            >
              <svg
                className="size-3.5 lg:size-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </button>
          </div>

          {}
          <div className="flex flex-col justify-center">
            {}
            <h1 className="text-lg lg:text-2xl xl:text-[27px] font-bold text-[#153B68] tracking-tight leading-tight">
              {profile.name}
            </h1>

            {}
            <p className="text-[11px] lg:text-xs xl:text-sm font-semibold text-[#2D73C2] mt-0.5">
              {profile.handle}
            </p>

            {}
            <p className="mt-1 lg:mt-1.5 text-[11px] lg:text-xs xl:text-[13px] text-[#1E3A5F] font-medium leading-snug line-clamp-1 xl:line-clamp-none">
              {profile.bio}
            </p>

            {}
            <div className="mt-1.5 lg:mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[10px] lg:text-xs xl:text-[13px] text-[#3E5C82]">
              <span className="inline-flex items-center gap-1 font-medium">
                <svg
                  className="size-3 lg:size-3.5 text-[#2E75C4] shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <span>{profile.locationName}</span>
              </span>

              <span className="inline-flex items-center gap-1 font-medium">
                <svg
                  className="size-3 lg:size-3.5 text-[#2E75C4] shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Tham gia từ {profile.joinedYear || "2026"}</span>
              </span>
            </div>

            {}
            <div className="mt-1 flex items-center gap-x-4 text-[10px] lg:text-xs xl:text-[13px] text-[#3E5C82]">
              <span className="inline-flex items-center gap-1 font-medium">
                <svg
                  className="size-3 lg:size-3.5 text-[#2E75C4] shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <strong className="text-[#153B68] font-bold">
                  {profile.followingCount ?? 0}
                </strong>{" "}
                Đang theo dõi
              </span>

              <span className="inline-flex items-center gap-1 font-medium">
                <strong className="text-[#153B68] font-bold">
                  {profile.followersCount ?? 0}
                </strong>{" "}
                Người theo dõi
              </span>
            </div>
          </div>
        </div>

        {}
        <div className="absolute left-[calc(64%-250px)] xl:left-[calc(65%-250px)] top-[72%] -translate-y-1/2 z-10">
          <button
            type="button"
            onClick={onEditProfile}
            className="inline-flex items-center gap-1.5 rounded-full border border-[#D5C2AF] bg-white/90 hover:bg-white text-[#29588C] px-3.5 lg:px-4 py-1.5 text-xs lg:text-[13px] font-semibold shadow-xs hover:shadow transition-all cursor-pointer whitespace-nowrap"
          >
            <svg
              className="size-3.5 text-[#2E75C4]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
              <path d="m15 5 4 4" />
            </svg>
            <span>Chỉnh sửa hồ sơ</span>
          </button>
        </div>

        {}
        <div className="absolute right-[calc(4.5%+250px)] xl:right-[calc(5.5%+250px)] top-[74%] -translate-y-1/2 z-10 max-w-[190px] lg:max-w-[220px] xl:max-w-[250px]">
          <p className="text-right text-[11px] lg:text-xs xl:text-[13.5px] font-semibold text-[#DE4F6C] leading-snug italic select-none">
            &ldquo;Món ngon
            <br />
            là cầu nối của những
            <br />
            khoảnh khắc đẹp&rdquo;
          </p>
        </div>
      </div>

      {}
      <div className="block md:hidden relative w-full overflow-hidden">
        {}
        <div className="relative w-full aspect-[2172/724] min-h-[140px] overflow-hidden">
          <Image
            src="/img/herosection-profile.webp"
            alt="Hình nền hồ sơ ẩm thực"
            fill
            sizes="100vw"
            className="w-full h-full object-cover object-top"
          />
        </div>

        {}
        <div className="relative -mt-12 px-4 pb-4">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-[#edd5c0] p-4 shadow-sm">
            {}
            <div className="flex items-end justify-between -mt-10 mb-3">
              {}
              <div className="relative">
                <div className="relative size-20 rounded-full overflow-hidden border-4 border-white shadow-md ring-2 ring-[#70A8DB]/70 bg-[#aed4f5]">
                  <Image
                    src={profile.avatarUrl}
                    alt={profile.name}
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>
                <button
                  type="button"
                  onClick={onEditProfile}
                  className="absolute bottom-0 right-0 size-6 rounded-full bg-[#1F74BA] text-white flex items-center justify-center border-2 border-white shadow-xs"
                  aria-label="Thay đổi ảnh đại diện"
                >
                  <svg
                    className="size-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                  >
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                  </svg>
                </button>
              </div>

              {}
              <button
                type="button"
                onClick={onEditProfile}
                className="inline-flex items-center gap-1.5 rounded-full border border-[#D5C2AF] bg-white text-[#29588C] px-3 py-1.5 text-xs font-semibold shadow-xs"
              >
                <svg
                  className="size-3 text-[#2E75C4]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                >
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
                <span>Chỉnh sửa hồ sơ</span>
              </button>
            </div>

            {}
            <div>
              <h1 className="text-lg font-bold text-[#153B68] leading-tight">
                {profile.name}
              </h1>
              <p className="text-xs font-semibold text-[#2D73C2]">
                {profile.handle}
              </p>
              <p className="mt-1.5 text-xs text-[#1E3A5F] leading-relaxed">
                {profile.bio}
              </p>
            </div>

            {}
            <div className="mt-3 pt-3 border-t border-[#f0dfd1] flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11px] text-[#3E5C82]">
              <span className="inline-flex items-center gap-1 font-medium">
                <svg
                  className="size-3 text-[#1E293B] shrink-0"
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
                <span>{profile.locationName}</span>
              </span>
              <span className="inline-flex items-center gap-1 font-medium">
                <svg
                  className="size-3 text-[#1E293B] shrink-0"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                <span>Tham gia {profile.joinedYear || "2026"}</span>
              </span>
              <span className="inline-flex items-center gap-1 font-medium">
                <strong className="text-[#153B68] font-bold">
                  {profile.followingCount ?? 0}
                </strong>{" "}
                Đang theo dõi
              </span>
              <span className="inline-flex items-center gap-1 font-medium">
                <strong className="text-[#153B68] font-bold">
                  {profile.followersCount ?? 0}
                </strong>{" "}
                Người theo dõi
              </span>
            </div>

            {}
            <div className="mt-3 bg-[#FFF4F6] rounded-xl px-3.5 py-2 border border-[#FADCE2]">
              <p className="text-center text-[11px] font-semibold text-[#DE4F6C] italic leading-tight">
                &ldquo;Món ngon là cầu nối của những khoảnh khắc đẹp&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
