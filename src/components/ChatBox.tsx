"use client"

import { useState, useEffect, useRef } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useCouple } from "@/hooks/useCouple"
import CoupleChatTab from "@/components/chat/CoupleChatTab"
import BotChatTab from "@/components/chat/BotChatTab"

export default function ChatBox() {
  const { user } = useAuth()
  const { couple, incomingRequests } = useCouple()

  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [activeTab, setActiveTab] = useState<"couple" | "bot">("couple")

  const chatRef = useRef<HTMLDivElement>(null)

  // Listen for global open-chatbox event (triggered from navbar, menu or links)
  useEffect(() => {
    const handleOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ tab?: "couple" | "bot" }>
      setIsOpen(true)
      setIsMinimized(false)
      if (customEvent.detail?.tab) {
        setActiveTab(customEvent.detail.tab)
      }
    }

    window.addEventListener("open-chatbox", handleOpen)
    return () => window.removeEventListener("open-chatbox", handleOpen)
  }, [])

  // Check URL query param e.g. ?openChat=couple
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search)
      const openParam = urlParams.get("openChat")
      if (openParam === "couple" || openParam === "bot") {
        setIsOpen(true)
        setIsMinimized(false)
        setActiveTab(openParam)
      }
    }
  }, [])

  const partnerName = couple?.partner?.display_name || "Người thương"
  const hasPendingRequests = incomingRequests.length > 0

  return (
    <div
      ref={chatRef}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-10 z-50 flex flex-col items-end select-none font-['Inter',system-ui,-apple-system,sans-serif]"
    >
      {/* 1. Open Chat Window */}
      {isOpen && !isMinimized && (
        <div className="flex flex-col w-[calc(100vw-32px)] sm:w-[385px] max-w-[395px] h-[540px] max-h-[82vh] sm:max-h-[86vh] rounded-[24px] bg-[#1c1c1c] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.65)] overflow-hidden animate-menu-card">
          {/* Master Chat Header with Dual-Tab Switcher */}
          <div className="relative flex items-center justify-between px-3 py-2.5 bg-[#1e1e1e] border-b border-white/10 text-white">
            {/* Tab Switcher Pills */}
            <div className="flex items-center gap-1 bg-[#141414] p-1 rounded-full border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab("couple")}
                className={`relative px-3 py-1 rounded-full text-[12px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "couple"
                    ? "bg-gradient-to-r from-[#ff4b72] to-[#e63956] text-white shadow-xs"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <span>❤️</span>
                <span className="truncate max-w-[110px]">
                  {couple ? partnerName : "Cặp đôi"}
                </span>
                {hasPendingRequests && (
                  <span className="size-2 rounded-full bg-yellow-400 animate-ping" />
                )}
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("bot")}
                className={`px-3 py-1 rounded-full text-[12px] font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === "bot"
                    ? "bg-gradient-to-r from-[#ff4b72] to-[#e63956] text-white shadow-xs"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <span>🤖</span>
                <span>Trợ lý HYUN</span>
              </button>
            </div>

            {/* Window Controls */}
            <div className="flex items-center gap-1 text-white/70">
              {/* Minimize */}
              <button
                type="button"
                onClick={() => setIsMinimized(true)}
                title="Thu nhỏ"
                className="flex size-7 items-center justify-center rounded-full hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>

              {/* Close */}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Đóng đoạn chat"
                className="flex size-7 items-center justify-center rounded-full hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>

          {/* Active Tab View */}
          {activeTab === "couple" ? <CoupleChatTab /> : <BotChatTab />}
        </div>
      )}

      {/* 2. Floating Trigger Button */}
      {(!isOpen || isMinimized) && (
        <div className="group relative flex items-center">
          <button
            type="button"
            onClick={() => {
              setIsOpen(true)
              setIsMinimized(false)
            }}
            title="Mở đoạn chat hỗ trợ & cặp đôi"
            aria-label="Mở khung trò chuyện"
            className="group relative flex size-[54px] cursor-pointer items-center justify-center rounded-full bg-[#1e1e1e] text-white shadow-xl border border-white/10 transition-all duration-300 hover:scale-105 hover:bg-[#2c2c2c] hover:shadow-2xl active:scale-95"
          >
            {/* Heart icon if paired, else chat bubbles */}
            {couple ? (
              <span className="text-2xl transition-transform duration-200 group-hover:scale-110">
                ❤️
              </span>
            ) : (
              <svg
                className="size-[23px] text-white transition-transform duration-200 group-hover:scale-110"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            )}

            {/* Online Green Indicator Dot */}
            <span className="absolute bottom-1 right-1 size-2.5 rounded-full bg-[#10b981] ring-2 ring-[#1e1e1e]" />

            {/* Notification Badge if incoming request */}
            {hasPendingRequests && (
              <span className="absolute -top-1 -right-1 size-4 rounded-full bg-[#ff4b72] text-[10px] font-bold text-white flex items-center justify-center shadow-xs animate-bounce">
                {incomingRequests.length}
              </span>
            )}
          </button>

          {/* Hover Pill Tooltip */}
          <span className="pointer-events-none absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#1e1e1e] border border-white/10 px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-lg opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:-translate-x-1">
            {couple ? `Chat với ${partnerName} ❤️` : "Trò chuyện & Cặp đôi ❤️"}
          </span>
        </div>
      )}
    </div>
  )
}
