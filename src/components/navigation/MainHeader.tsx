"use client" /* 1. Left: Brand Logo */ /* 2. Middle: Navigation Links (Desktop lg+) */ /* 3. Right: Search Box & Profile Avatar */ /* Search Pill */ /* User Profile Avatar (Menu Trigger) */ /* Dropdown Navigation Menu Card */ /* Header Info */ /* Navigation Menu Items */ /* Mobile Hamburger Menu Toggle */ /* Mobile Drawer Dropdown */ /* Mobile Search input */ /* Mobile Navigation List */ /* User Profile Avatar / Login Button */
import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

export interface MainHeaderProps {
  activeTab?: "home" | "explore" | "places" | "articles" | "schedule"
}

export default function MainHeader({ activeTab = "home" }: MainHeaderProps) {
  const router = useRouter()
  const { user, profile, openAuthModal, signOut } = useAuth()

  const [searchQuery, setSearchQuery] = useState("")
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node)
      ) {
        setProfileMenuOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setProfileMenuOpen(false)
      }
    }

    if (profileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside)

      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)

      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [profileMenuOpen])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (searchQuery.trim()) {
      router.push(`/places?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      router.push("/places")
    }
  }

  const navItems = [
    { id: "home", label: "Trang chủ", href: "/" },
    { id: "explore", label: "Khám phá", href: "/places" },
    { id: "articles", label: "Bài viết", href: "/articles" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full bg-[#fdefdf]/95 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {}
        <Link href="/" className="flex items-center gap-2 shrink-0 py-2">
          <Image
            src="/img/logo.png"
            alt="hyun - Ăn ngon, gặp nhau, thêm yêu"
            width={180}
            height={56}
            priority
            className="h-12 sm:h-14 w-auto object-contain"
          />
        </Link>

        {}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id

            return (
              <Link
                key={item.id}
                href={item.href}
                className={`rounded-full px-5 py-2 text-sm xl:text-[15px] transition-all duration-200 ${
                  isActive
                    ? "bg-[#FDD5D5] font-semibold text-[#D34B5E] shadow-sm"
                    : "font-medium text-[#1E3A5F] hover:bg-white/60 hover:text-[#D34B5E]"
                }`}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        {}
        <div className="flex items-center gap-3 sm:gap-4">
          {}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden sm:flex items-center gap-2 rounded-full border border-[#ebd2bd] bg-white/80 px-4 py-2 transition-all duration-200 focus-within:border-[#1E3A5F] focus-within:bg-white focus-within:shadow-sm w-52 md:w-64 xl:w-72"
          >
            <svg
              className="size-4 shrink-0 text-[#1E3A5F]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm nhà hàng, món ăn, khu vực..."
              className="w-full bg-transparent text-xs xl:text-sm text-[#1E3A5F] placeholder-[#8E9DAE] outline-none"
            />
          </form>

          {}
          {}
          {!user ? (
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#1E293B] bg-[#FF5376] hover:bg-[#d64058] px-4 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-bold text-white shadow-[1.5px_1.5px_0px_#1E293B] transition-all cursor-pointer"
            >
              <span>Đăng nhập</span>
            </button>
          ) : (
            <div className="relative" ref={profileMenuRef}>
              <button
                type="button"
                onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                className="flex size-10 sm:size-11 items-center justify-center rounded-full border border-[#1E293B] bg-white text-[#1E293B] shadow-[1px_1px_0px_#1E293B] hover:border-[#FF5376] transition-all overflow-hidden cursor-pointer focus:outline-none"
                aria-label="Tài khoản cá nhân"
                aria-expanded={profileMenuOpen}
              >
                {profile?.avatar_url ? (
                  <Image
                    src={profile.avatar_url}
                    alt={profile.display_name || "User"}
                    width={44}
                    height={44}
                    unoptimized
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="font-bold text-sm text-[#1E293B]">
                    {(profile?.display_name || user.email || "U")
                      .slice(0, 1)
                      .toUpperCase()}
                  </span>
                )}
              </button>

              {profileMenuOpen && (
                <div
                  className="absolute right-0 top-full mt-2.5 w-64 animate-in fade-in zoom-in-95 duration-200 rounded-xl bg-white p-4 text-[#1E293B] shadow-[2px_2px_0px_#1E293B] border border-[#1E293B] z-50"
                  role="dialog"
                  aria-label="Menu tài khoản"
                >
                  <div className="flex items-center justify-between border-b border-[#E8DDD1] pb-3 mb-2 px-1">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#1E293B] bg-white text-[#1E293B] font-bold text-xs shadow-[1px_1px_0px_#1E293B]">
                        {(profile?.display_name || user.email || "U")
                          .slice(0, 1)
                          .toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#1E293B] truncate">
                          {profile?.display_name || "Thực khách HYUN"}
                        </p>
                        <p className="text-[10px] font-medium text-slate-500 truncate">
                          {user.email}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setProfileMenuOpen(false)}
                      className="text-slate-400 hover:text-[#1E293B] transition-colors p-1 cursor-pointer"
                      aria-label="Đóng menu"
                    >
                      ✕
                    </button>
                  </div>

                  <nav className="flex flex-col gap-1">
                    <Link
                      href="/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="group flex items-center gap-3 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-[#1E293B] hover:bg-neutral-100 hover:text-black transition-colors"
                    >
                      <svg
                        className="size-4 shrink-0 text-[#1E293B] group-hover:text-black transition-colors"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                      <span>Hồ sơ cá nhân</span>
                    </Link>

                    <Link
                      href="/schedule"
                      onClick={() => setProfileMenuOpen(false)}
                      className="group flex items-center gap-3 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-[#1E293B] hover:bg-neutral-100 hover:text-black transition-colors"
                    >
                      <svg
                        className="size-4 shrink-0 text-[#1E293B] group-hover:text-black transition-colors"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          ry="2"
                        />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <span>Lịch hẹn & Kế hoạch</span>
                    </Link>

                    <button
                      type="button"
                      onClick={async () => {
                        setProfileMenuOpen(false)
                        await signOut()
                      }}
                      className="group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-xs sm:text-sm font-semibold text-[#1E293B] hover:bg-neutral-100 hover:text-black transition-colors text-left cursor-pointer"
                    >
                      <svg
                        className="size-4 shrink-0 text-[#1E293B] group-hover:text-black transition-colors"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                      </svg>
                      <span>Đăng xuất</span>
                    </button>
                  </nav>
                </div>
              )}
            </div>
          )}

          {}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex size-10 items-center justify-center rounded-full border border-[#ebd2bd] bg-white text-[#1E3A5F] lg:hidden"
            aria-label="Mở menu điều hướng"
          >
            {mobileMenuOpen ? (
              <svg
                className="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg
                className="size-5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="6" x2="20" y2="6" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="18" x2="20" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {}
      {mobileMenuOpen && (
        <div className="border-t border-[#ebd2bd]/50 bg-[#fdefdf] px-4 py-4 lg:hidden animate-in slide-in-from-top-2 duration-200">
          {}
          <form
            onSubmit={handleSearchSubmit}
            className="mb-4 flex items-center gap-2 rounded-full border border-[#ebd2bd] bg-white px-4 py-2.5 sm:hidden"
          >
            <svg
              className="size-4 shrink-0 text-[#1E3A5F]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm nhà hàng, món ăn, khu vực..."
              className="w-full bg-transparent text-sm text-[#1E3A5F] placeholder-[#8E9DAE] outline-none"
            />
          </form>

          {}
          <nav className="flex flex-col gap-1.5">
            {navItems.map((item) => {
              const isActive = activeTab === item.id

              return (
                <Link
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-base transition-colors ${
                    isActive
                      ? "bg-[#FDD5D5] font-semibold text-[#D34B5E]"
                      : "font-medium text-[#1E3A5F] hover:bg-white/60"
                  }`}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="size-2 rounded-full bg-[#D34B5E]" />
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      )}
    </header>
  )
}
