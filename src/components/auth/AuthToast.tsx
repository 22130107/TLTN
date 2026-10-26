"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/AuthContext"

export default function AuthToast() {
  const { notification, dismissNotification } = useAuth()
  const [isClosing, setIsClosing] = useState(false)

  useEffect(() => {
    if (!notification) {
      setIsClosing(false)
      return
    }

    const timer = setTimeout(() => {
      handleClose()
    }, 7000)

    return () => clearTimeout(timer)
  }, [notification])

  if (!notification) return null

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      dismissNotification()
      setIsClosing(false)
    }, 200)
  }

  const getStyle = () => {
    switch (notification.type) {
      case "success":
        return {
          bg: "bg-[#FFF0ED]",
          border: "border-[#FF5376]",
          badge: "bg-[#FF5376] text-white",
          icon: "🎉",
        }
      case "warning":
        return {
          bg: "bg-[#FEFCE8]",
          border: "border-[#EAB308]",
          badge: "bg-[#EAB308] text-white",
          icon: "⚠️",
        }
      case "error":
        return {
          bg: "bg-[#FEF2F2]",
          border: "border-[#EF4444]",
          badge: "bg-[#EF4444] text-white",
          icon: "❌",
        }
      case "info":
      default:
        return {
          bg: "bg-[#F0FDF4]",
          border: "border-[#10B981]",
          badge: "bg-[#10B981] text-white",
          icon: "📩",
        }
    }
  }

  const style = getStyle()

  return (
    <div
      role="alert"
      className={`fixed top-5 right-4 sm:right-6 z-[9999] max-w-sm sm:max-w-md w-[calc(100%-2rem)] rounded-2xl border-2 border-[#1E293B] ${style.bg} p-4 shadow-[5px_5px_0px_#1E293B] transition-all duration-200 ${
        isClosing
          ? "opacity-0 translate-y-[-10px] scale-95"
          : "opacity-100 translate-y-0 scale-100 animate-in fade-in slide-in-from-top-4"
      }`}
    >
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border-2 border-[#1E293B] bg-white text-lg shadow-[2px_2px_0px_#1E293B]">
          {style.icon}
        </div>

        <div className="flex-1 min-w-0 pr-4">
          <h4 className="text-xs sm:text-sm font-black text-[#1E293B]">
            {notification.title}
          </h4>
          <p className="mt-1 text-xs font-semibold text-slate-700 leading-relaxed">
            {notification.message}
          </p>

          {notification.actionLabel && notification.actionUrl && (
            <a
              href={notification.actionUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2.5 inline-flex items-center gap-1.5 rounded-xl border-2 border-[#1E293B] bg-white px-3 py-1 text-xs font-black text-[#1E293B] shadow-[2px_2px_0px_#1E293B] hover:bg-[#FFF5EF] transition-all"
            >
              <span>{notification.actionLabel}</span>
              <span>➔</span>
            </a>
          )}
        </div>

        <button
          type="button"
          onClick={handleClose}
          aria-label="Đóng thông báo"
          className="shrink-0 flex size-6 items-center justify-center rounded-full border-2 border-[#1E293B] bg-white text-xs font-black text-slate-700 hover:bg-[#FF5376] hover:text-white transition-all shadow-[1px_1px_0px_#1E293B]"
        >
          ✕
        </button>
      </div>
    </div>
  )
}
