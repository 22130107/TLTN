"use client"

// Handle click outside to close menu

/* 3-dots Hamburger Trigger Button */ /* Popup Menu Card */ /* Close button */ /* Menu Items */ /* Active / hover bullet dot */ /* Item Icon */ /* Item Label */ /* Close button */ /* Menu Items */ /* Active / hover bullet dot */ /* Item Icon */ /* Item Label */

import { useState, useEffect, useRef, type ReactNode } from "react"

import Link from "next/link"

interface MenuItem {
  id: string

  label: string

  href: string

  icon: ReactNode
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: "profile",

    label: "Profile",

    href: "/profile",

    icon: (
      <svg
        className="size-[19px] shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },

  {
    id: "schedule",

    label: "Lịch hẹn",

    href: "/schedule",

    icon: (
      <svg
        className="size-[19px] shrink-0"
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
    ),
  },

  {
    id: "search",

    label: "Khám phá địa điểm",

    href: "/places",

    icon: (
      <svg
        className="size-[19px] shrink-0"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
]

export default function NavigationMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const [activeItem, setActiveItem] = useState("profile")

  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside)

      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)

      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  return (
    <div
      className="fixed top-4 right-4 sm:top-6 sm:right-6 md:top-8 md:right-10 z-50"
      ref={menuRef}
    >
      {}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex size-[54px] cursor-pointer items-center justify-center rounded-full bg-[#1e1e1e] shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#2c2c2c] hover:shadow-2xl active:scale-95"
          aria-label="Mở menu"
          aria-expanded={isOpen}
        >
          <span className="flex items-center gap-[4.5px]">
            <span className="size-[4.5px] rounded-full bg-white transition-transform duration-200 group-hover:scale-125" />
            <span className="size-[4.5px] rounded-full bg-white transition-transform duration-200 group-hover:scale-125" />
            <span className="size-[4.5px] rounded-full bg-white transition-transform duration-200 group-hover:scale-125" />
          </span>
        </button>
      )}

      {}
      {isOpen && (
        <div
          className="relative w-[270px] max-w-[calc(100vw-32px)] animate-menu-card rounded-[26px] bg-[#1c1c1c] p-7 text-white shadow-2xl transition-all duration-300 border border-white/10"
          role="dialog"
          aria-label="Menu điều hướng"
        >
          {}
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="absolute top-6 right-6 flex size-7 cursor-pointer items-center justify-center text-white/70 transition-all duration-200 hover:rotate-90 hover:text-white"
            aria-label="Đóng menu"
          >
            <svg
              className="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {}
          <nav className="pt-3 pb-2">
            <ul className="flex flex-col gap-5">
              {MENU_ITEMS.map((item, index) => {
                const isActive = activeItem === item.id

                const pushClass =
                  index === 0
                    ? "animate-menu-push-1"
                    : index === 1
                      ? "animate-menu-push-2"
                      : "animate-menu-push-3"

                return (
                  <li key={item.id} className={pushClass}>
                    <Link
                      href={item.href}
                      onClick={() => {
                        setActiveItem(item.id)

                        setIsOpen(false)
                      }}
                      className="group flex items-center gap-3.5 text-[18px] font-['Inter:Bold','Inter',sans-serif] font-bold tracking-[0.3px] transition-all duration-200 text-white/90 hover:text-white hover:translate-x-2 active:scale-95"
                    >
                      {}
                      <span
                        className={`size-[5px] shrink-0 rounded-full bg-white transition-all duration-200 ${
                          isActive
                            ? "opacity-100 scale-100"
                            : "opacity-0 scale-50 group-hover:opacity-100 group-hover:scale-100"
                        }`}
                      />

                      {}
                      <span className="text-white/80 transition-all duration-200 group-hover:text-white group-hover:scale-110">
                        {item.icon}
                      </span>

                      {}
                      <span className="transition-transform duration-200">
                        {item.label}
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </nav>
        </div>
      )}
    </div>
  )
}
