"use client"

import { useState, useRef, useEffect } from "react"
import type { CoupleMessage } from "@/types/couple"

interface CoupleChatAreaProps {
  messages: CoupleMessage[]
  currentUserId: string
  partnerName: string
  partnerAvatar?: string
  partnerOnline: boolean
  partnerTyping: boolean
  isConnected: boolean
  onSendMessage: (text: string) => void
  onSendTyping: (isTyping: boolean) => void
  onSendHeart: () => void
}

export default function CoupleChatArea({
  messages,
  currentUserId,
  partnerName,
  partnerAvatar = "/img/profile-avatar.png",
  partnerOnline,
  partnerTyping,
  isConnected,
  onSendMessage,
  onSendTyping,
  onSendHeart,
}: CoupleChatAreaProps) {
  const [inputText, setInputText] = useState("")
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, partnerTyping])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputText(val)

    onSendTyping(true)
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    typingTimerRef.current = setTimeout(() => {
      onSendTyping(false)
    }, 2000)
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    onSendMessage(inputText)
    setInputText("")
    onSendTyping(false)
  }

  const formatMessageTime = (ts: number | string) => {
    try {
      const d = new Date(ts)
      return d.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" })
    } catch {
      return ""
    }
  }

  return (
    <div className="flex h-[600px] flex-col overflow-hidden rounded-3xl border border-white/10 bg-[#161616] shadow-2xl">
      {/* Chat Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-[#1a1a1a]/80 px-6 py-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={partnerAvatar}
              alt={partnerName}
              className="h-10 w-10 rounded-full border border-pink-500/40 object-cover"
            />
            <span
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#1a1a1a] ${
                partnerOnline ? "bg-emerald-500" : "bg-gray-500"
              }`}
            />
          </div>
          <div>
            <h3 className="font-bold text-white">{partnerName}</h3>
            <p className="text-xs text-gray-400">
              {partnerTyping ? (
                <span className="font-medium text-[#ff4b72] animate-pulse">Đang gõ tin nhắn...</span>
              ) : partnerOnline ? (
                <span className="text-emerald-400">Đang hoạt động</span>
              ) : (
                "Ngoại tuyến"
              )}
            </p>
          </div>
        </div>

        {/* Cloudflare WebSocket connection pill */}
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-xs">
          <span
            className={`h-2 w-2 rounded-full ${
              isConnected ? "bg-emerald-400 animate-pulse" : "bg-yellow-400"
            }`}
          />
          <span className="hidden font-mono text-[11px] text-gray-300 sm:inline">
            Cloudflare WS {isConnected ? "Live" : "Connecting"}
          </span>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 space-y-4 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-white/10">
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
            <span className="text-4xl">💌</span>
            <p className="mt-2 text-sm">Chưa có tin nhắn nào. Hãy gửi lời chào đến người thương!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMe = msg.sender_id === currentUserId
            const isHeart = msg.type === "heart"

            return (
              <div
                key={msg.id}
                className={`flex flex-col ${isMe ? "items-end" : "items-start"}`}
              >
                <div
                  className={`group relative max-w-[75%] rounded-2xl px-4 py-2.5 text-sm shadow-md transition-transform ${
                    isMe
                      ? "rounded-br-sm bg-gradient-to-r from-[#ff4b72] to-[#ff3366] text-white"
                      : "rounded-bl-sm border border-white/10 bg-[#262626] text-gray-100"
                  } ${isHeart ? "text-3xl bg-transparent shadow-none" : ""}`}
                >
                  {msg.text}
                </div>
                <span className="mt-1 px-1 font-mono text-[10px] text-gray-500">
                  {formatMessageTime(msg.created_at)}
                </span>
              </div>
            )
          })
        )}

        {/* Partner Typing Indicator */}
        {partnerTyping && (
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <div className="flex h-7 items-center gap-1 rounded-full bg-[#262626] px-3">
              <span className="h-1.5 w-1.5 rounded-full bg-pink-400 animate-bounce" />
              <span className="h-1.5 w-1.5 rounded-full bg-pink-400 animate-bounce [animation-delay:0.2s]" />
              <span className="h-1.5 w-1.5 rounded-full bg-pink-400 animate-bounce [animation-delay:0.4s]" />
            </div>
            <span className="text-[11px]">{partnerName} đang soạn tin...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={handleSend}
        className="flex items-center gap-3 border-t border-white/10 bg-[#1a1a1a]/90 p-4 backdrop-blur-md"
      >
        {/* Heart Ping Button */}
        <button
          type="button"
          onClick={onSendHeart}
          title="Bắn tim nhanh cho người thương"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-pink-500/30 bg-pink-500/10 text-xl text-[#ff4b72] transition-transform hover:scale-110 active:scale-95"
        >
          ❤️
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={inputText}
          onChange={handleInputChange}
          placeholder={`Nhắn gửi yêu thương đến ${partnerName}...`}
          className="flex-1 rounded-2xl border border-white/10 bg-black/40 px-5 py-3 text-sm text-white placeholder-gray-500 transition-colors focus:border-[#ff4b72] focus:outline-none"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#ff4b72] to-[#ff3366] text-white shadow-lg shadow-[#ff4b72]/30 transition-all hover:opacity-95 active:scale-95 disabled:opacity-40"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </button>
      </form>
    </div>
  )
}
