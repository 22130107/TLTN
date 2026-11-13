"use client" /* 1. Avatar & Identity Header */ /* Avatar Container with Sharp Border */ /* Verified Badge */ /* Names & Title */ /* Bio text */ /* Divider */ /* 2. Contact & Location Information */ /* Location */ /* Email */ /* Phone */ /* Divider */ /* 3. Stats Grid 2x2 */ /* Quán đã ghé */ /* Bài đánh giá */ /* Lịch trình */ /* Điểm thưởng */ /* Divider */ /* 4. Favorite Taste Tags */ /* Divider */ /* 5. Quick Schedule Link Box */
import Link from "next/link"

import type { UserProfile } from "@/types/profile"

export interface PersonalInfoCardProps {
  profile: UserProfile

  schedulesCount?: {
    all: number

    upcoming: number

    completed: number
  }
}

export default function PersonalInfoCard({
  profile,

  schedulesCount,
}: PersonalInfoCardProps) {
  return (
    <div className="border-2 border-black bg-white p-5 sm:p-6 shadow-[4px_4px_0px_#000000]">
      <div className="flex flex-col gap-6">
        {}
        <div className="flex flex-col items-center text-center sm:items-start sm:text-left">
          <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
            {}
            <div className="relative shrink-0">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="size-20 sm:size-24 border-2 border-black object-cover shadow-[3px_3px_0px_#000000]"
              />
              {}
              <div
                className="absolute -bottom-1 -right-1 flex size-6 sm:size-7 items-center justify-center border-2 border-black bg-black text-white shadow-[2px_2px_0px_#ffffff]"
                title="Thành viên Tinh Hoa Xác Thực"
                aria-label="Thành viên Tinh Hoa Xác Thực"
              >
                <svg
                  className="size-3.5"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2l2.87 5.82 6.43.93-4.65 4.54 1.1 6.4L12 16.67l-5.75 3.02 1.1-6.4-4.65-4.54 6.43-.93L12 2z" />
                </svg>
              </div>
            </div>

            {}
            <div className="flex flex-col items-center sm:items-start">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-black">
                  {profile.name}
                </h2>
                <span className="border border-black bg-black px-2 py-0.5 text-xs font-bold text-white uppercase tracking-wider">
                  VIP Foodie
                </span>
              </div>
              <p className="mt-0.5 text-sm font-semibold text-neutral-600">
                {profile.handle}
              </p>
              <div className="mt-2 inline-flex items-center border border-black bg-neutral-100 px-2.5 py-1 text-xs font-bold text-black">
                {profile.title}
              </div>
            </div>
          </div>

          {}
          <p className="mt-4 text-xs sm:text-sm leading-relaxed text-neutral-700 sm:mt-5 font-medium">
            {profile.bio}
          </p>
        </div>

        {}
        <div className="h-[2px] w-full bg-black/10" aria-hidden="true" />

        {}
        <div className="flex flex-col gap-2.5 text-xs sm:text-sm">
          {}
          <div className="flex items-center gap-3 text-neutral-800 font-medium">
            <span className="flex size-7 shrink-0 items-center justify-center border border-black bg-neutral-100 text-black">
              <svg
                className="size-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </span>
            <span className="truncate">{profile.locationName}</span>
          </div>

          {}
          <a
            href={`mailto:${profile.email}`}
            className="group flex items-center gap-3 text-neutral-800 transition-colors hover:text-black font-medium"
          >
            <span className="flex size-7 shrink-0 items-center justify-center border border-black bg-neutral-100 text-black transition-colors group-hover:bg-black group-hover:text-white">
              <svg
                className="size-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect width="20" height="16" x="2" y="4" rx="0" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </span>
            <span className="truncate group-hover:underline">
              {profile.email}
            </span>
          </a>

          {}
          <a
            href={`tel:${profile.phone.replace(/\s+/g, "")}`}
            className="group flex items-center gap-3 text-neutral-800 transition-colors hover:text-black font-medium"
          >
            <span className="flex size-7 shrink-0 items-center justify-center border border-black bg-neutral-100 text-black transition-colors group-hover:bg-black group-hover:text-white">
              <svg
                className="size-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </span>
            <span className="truncate group-hover:underline">
              {profile.phone}
            </span>
          </a>
        </div>

        {}
        <div className="h-[2px] w-full bg-black/10" aria-hidden="true" />

        {}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-black">
              Thống kê hoạt động
            </span>
            <span className="text-[11px] font-bold text-neutral-600 uppercase">
              Ẩm thực Hà Nội
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {}
            <div className="group border-2 border-black bg-white p-3 shadow-[2px_2px_0px_#000000] transition-all hover:bg-neutral-50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-600">
                  Quán đã ghé
                </span>
                <span className="text-black">
                  <svg
                    className="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
                    <path d="M7 2v20" />
                    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
                  </svg>
                </span>
              </div>
              <p className="mt-1.5 text-xl font-bold text-black">
                {profile.stats.visitedPlaces}
              </p>
            </div>

            {}
            <div className="group border-2 border-black bg-white p-3 shadow-[2px_2px_0px_#000000] transition-all hover:bg-neutral-50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-600">
                  Đánh giá
                </span>
                <span className="text-black">
                  <svg
                    className="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </span>
              </div>
              <p className="mt-1.5 text-xl font-bold text-black">
                {profile.stats.reviewsCount}
              </p>
            </div>

            {}
            <div className="group border-2 border-black bg-white p-3 shadow-[2px_2px_0px_#000000] transition-all hover:bg-neutral-50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-600">
                  Lịch trình
                </span>
                <span className="text-black">
                  <svg
                    className="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <rect width="18" height="18" x="3" y="4" rx="0" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="21" x2="21" y2="10" />
                  </svg>
                </span>
              </div>
              <p className="mt-1.5 text-xl font-bold text-black">
                {profile.stats.upcomingTrips}
              </p>
            </div>

            {}
            <div className="group border-2 border-black bg-white p-3 shadow-[2px_2px_0px_#000000] transition-all hover:bg-neutral-50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-600">
                  Điểm thưởng
                </span>
                <span className="text-black">
                  <svg
                    className="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </span>
              </div>
              <p className="mt-1.5 text-xl font-bold text-black">
                {profile.stats.rewardPoints.toLocaleString("vi-VN")}
              </p>
            </div>
          </div>
        </div>

        {}
        <div className="h-[2px] w-full bg-black/10" aria-hidden="true" />

        {}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-black">
              Gu ẩm thực yêu thích
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {profile.favoriteTags.map((tag) => (
              <span
                key={tag}
                className="cursor-default border border-black bg-white px-2.5 py-1 text-xs font-semibold text-black shadow-[2px_2px_0px_#000000] transition-transform hover:-translate-y-0.5"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {}
        <div className="h-[2px] w-full bg-black/10" aria-hidden="true" />

        {}
        <div className="border-2 border-black bg-neutral-50 p-4 shadow-[2px_2px_0px_#000000]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-black">
              Lịch trình & Bản đồ
            </span>
            <span className="border border-black bg-black text-white px-2 py-0.5 text-[10px] font-bold">
              {schedulesCount?.upcoming ?? 4} điểm hẹn
            </span>
          </div>
          <p className="text-xs text-neutral-600 font-medium mb-3.5 leading-relaxed">
            Theo dõi vị trí các quán ăn chuẩn gu và xem lộ trình trải nghiệm
            trên trang bản đồ riêng biệt.
          </p>
          <Link
            href="/schedule"
            className="flex items-center justify-center gap-2 w-full border-2 border-black bg-black text-white py-2.5 text-xs font-bold transition-all hover:bg-neutral-800 active:translate-x-0.5 active:translate-y-0.5 shadow-[2px_2px_0px_#000000]"
          >
            <span>Mở Lịch trình & Bản đồ</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
