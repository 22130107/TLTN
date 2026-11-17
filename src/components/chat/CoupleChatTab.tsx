"use client"

// WebSocket Chat Client

// Local state

// Scroll to bottom on new message

// Copy User ID

// Send couple invite

// Handle typing indicator

// Send message

// Handle unpair

// Handle update anniversary date

// Format message timestamp

// Calculate days together safely

// 1. STATE: Not Logged In

// 2. STATE: Loading

// 3. STATE: Logged in, but NOT PAIRED (Pairing Dashboard inside ChatBox)
/* Your Connection Code */ /* Send Invite Form */ /* Incoming Requests */ /* Outgoing Requests */

// 4. STATE: PAIRED (Real-time Couple Chat Area)
/* Flying Hearts Animation Overlay */ /* Couple Status Bar */ /* Days Together Pill */ /* Settings Toggle */ /* Settings Overlay Drawer */ /* Unpair Confirmation Dialog */ /* Messages List Area */

// Heart like message

// Normal text message
/* Partner Typing Dots */ /* Couple Chat Input Form */

import { useState, useRef, useEffect } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { useCouple } from "@/hooks/useCouple"
import { useCoupleChat } from "@/hooks/useCoupleChat"
import HeartAnimationOverlay from "@/components/couple/HeartAnimationOverlay"

export default function CoupleChatTab() {
  const { user, openAuthModal } = useAuth()
  const {
    couple,
    isLoading: isCoupleLoading,
    incomingRequests,
    outgoingRequests,
    sendRequest,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    unpair,
    updateAnniversary,
  } = useCouple()
  const {
    messages,
    partnerOnline,
    partnerTyping,
    heartReceivedTimestamp,
    sendMessage,
    sendTyping,
    sendHeart,
  } = useCoupleChat(couple?.id, user?.id)
  const [inputText, setInputText] = useState("")
  const [partnerIdInput, setPartnerIdInput] = useState("")
  const [inviteStatus, setInviteStatus] = useState<{
    type: "idle" | "loading" | "success" | "error"
    message?: string
  }>({ type: "idle" })
  const [copiedId, setCopiedId] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [showUnpairConfirm, setShowUnpairConfirm] = useState(false)
  const [isUnpairing, setIsUnpairing] = useState(false)
  const [anniversaryDate, setAnniversaryDate] = useState(
    couple?.anniversary_date ||
      new Date().toISOString().split("T")[0],
  )
  const [isUpdatingDate, setIsUpdatingDate] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (couple?.anniversary_date) {
      setAnniversaryDate(couple.anniversary_date)
    }
  }, [couple?.anniversary_date])
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, partnerTyping])
  const handleCopyId = () => {
    if (!user?.id) return
    navigator.clipboard.writeText(user.id)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }
  const handleSendInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    const targetId = partnerIdInput.trim()
    if (!targetId) return

    try {
      setInviteStatus({ type: "loading" })
      await sendRequest(targetId)
      setInviteStatus({
        type: "success",
        message: "Đã gửi lời mời kết nối thành công! Đang chờ đối phương...",
      })
      setPartnerIdInput("")
      setTimeout(() => setInviteStatus({ type: "idle" }), 4000)
    } catch (err) {
      setInviteStatus({
        type: "error",
        message:
          err instanceof
          Error
            ? err.message
            : "Gửi lời mời thất bại",
      })
      setTimeout(() => setInviteStatus({ type: "idle" }), 4000)
    }
  }
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputText(val)

    sendTyping(true)
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current)
    typingTimerRef.current = setTimeout(() => {
      sendTyping(false)
    }, 2000)
  }
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) return

    sendMessage(inputText.trim())
    setInputText("")
    sendTyping(false)
  }
  const handleConfirmUnpair = async () => {
    try {
      setIsUnpairing(true)
      await unpair()
      setShowUnpairConfirm(false)
      setShowSettings(false)
    } catch (err) {
      console.error("Lỗi khi hủy ghép đôi:", err)
    } finally {
      setIsUnpairing(false)
    }
  }
  const handleSaveAnniversary = async () => {
    if (!anniversaryDate) return
    try {
      setIsUpdatingDate(true)
      await updateAnniversary(anniversaryDate)
      setShowSettings(false)
    } catch (err) {
      console.error("Lỗi khi cập nhật ngày kỷ niệm:", err)
    } finally {
      setIsUpdatingDate(false)
    }
  }
  const formatTime = (ts: number | string) => {
    try {
      const d = new Date(ts)
      return d.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch {
      return ""
    }
  }
  const daysTogether = (() => {
    if (!couple?.anniversary_date) return 1
    const ts = new Date(couple.anniversary_date).getTime()
    if (isNaN(ts)) return 1
    const diff = Math.floor((Date.now() - ts) / (1000 * 60 * 60 * 24))
    return Math.max(1, diff)
  })()
  if (!user) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center bg-[#161616]">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#ff4b72]/20 to-[#ff3366]/10 text-2xl text-[#ff4b72] shadow-inner mb-3">
          ❤️
        </div>
        <h4 className="font-bold text-white text-[15px]">Không gian Cặp đôi</h4>
        <p className="text-[12px] text-white/60 mt-1.5 leading-relaxed max-w-[270px]">
          Đăng nhập tài khoản để nhận mã kết nối, gửi lời mời người thương và
          chat thời gian thực.
        </p>
        <button
          type="button"
          onClick={() => openAuthModal("login")}
          className="mt-4 px-5 py-2 rounded-full bg-gradient-to-r from-[#ff4b72] to-[#e63956] text-white text-[13px] font-bold shadow-md hover:opacity-90 active:scale-95 transition-all cursor-pointer"
        >
          Đăng nhập ngay ❤️
        </button>
      </div>
    )
  }
  if (isCoupleLoading) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center p-6 text-center bg-[#161616]">
        <div className="size-8 animate-spin rounded-full border-2 border-[#ff4b72] border-t-transparent" />
        <span className="text-[12px] text-white/50 mt-3 font-medium">
          Đang kết nối không gian cặp đôi...
        </span>
      </div>
    )
  }
  if (!couple) {
    return (
      <div className="flex flex-1 flex-col overflow-y-auto custom-scrollbar p-3.5 space-y-3.5 bg-[#161616] text-white text-xs">
        {}
        <div className="rounded-xl bg-[#222222] border border-white/10 p-3 shadow-xs">
          <span className="text-[11px] font-semibold text-white/60 uppercase tracking-wider block mb-1">
            Mã kết nối của bạn
          </span>
          <div className="flex items-center gap-1.5 bg-[#181818] border border-white/5 rounded-lg p-1.5">
            <span
              className="font-mono text-[11.5px] text-[#ff4b72] flex-1 truncate px-1"
              title={user.id}
            >
              {user.email ||
                user.id}
            </span>
            <button
              type="button"
              onClick={handleCopyId}
              className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 active:scale-95 text-[11px] font-medium text-white transition-all cursor-pointer shrink-0"
            >
              {copiedId ? "✓ Đã chép" : "Sao chép ID"}
            </button>
          </div>
          <span className="text-[10.5px] text-white/40 block mt-1.5 leading-tight">
            Gửi User ID hoặc Email này cho đối phương để kết nối cùng nhau.
          </span>
        </div>

        {}
        <form
          onSubmit={handleSendInvite}
          className="rounded-xl bg-[#222222] border border-white/10 p-3 shadow-xs"
        >
          <label
            htmlFor="partner-id-input"
            className="text-[11px] font-semibold text-white/60 uppercase tracking-wider block mb-1.5"
          >
            Kết nối người thương
          </label>
          <div className="flex flex-col gap-2">
            <input
              id="partner-id-input"
              type="text"
              value={partnerIdInput}
              onChange={(e) => setPartnerIdInput(e.target.value)}
              placeholder="Nhập User ID hoặc Email của đối phương..."
              className="w-full bg-[#181818] border border-white/10 rounded-lg px-2.5 py-1.5 text-[12px] text-white placeholder:text-white/30 focus:outline-none focus:border-[#ff4b72]/60"
            />
            <button
              type="submit"
              disabled={
                inviteStatus.type ===
                  "loading" ||
                !partnerIdInput.trim()
              }
              className="w-full py-2 rounded-lg bg-gradient-to-r from-[#ff4b72] to-[#e63956] text-white font-bold text-[12px] shadow-sm hover:opacity-90 active:scale-98 transition-all disabled:opacity-50 cursor-pointer"
            >
              {inviteStatus.type ===
              "loading"
                ? "Đang gửi..."
                : "Gửi lời mời kết nối ❤️"}
            </button>
          </div>

          {inviteStatus.message && (
            <div
              className={`mt-2 p-2 rounded-lg text-[11px] leading-tight ${
                inviteStatus.type ===
                "error"
                  ? "bg-red-500/20 text-red-300 border border-red-500/30"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
              }`}
            >
              {inviteStatus.message}
            </div>
          )}
        </form>

        {}
        {incomingRequests.length >
          0 && (
          <div className="rounded-xl bg-[#222222] border border-[#ff4b72]/30 p-3 shadow-xs">
            <span className="text-[11px] font-bold text-[#ff4b72] block mb-2">
              💌 Lời mời nhận được ({incomingRequests.length})
            </span>
            <div className="space-y-2">
              {incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-[#181818] border border-white/5 rounded-lg p-2 flex flex-col gap-1.5"
                >
                  <div className="flex items-center gap-2">
                    <div className="size-6 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px] text-white">
                      {(req.sender_profile?.display_name ||
                        "U")[0].toUpperCase()}
                    </div>
                    <span className="font-semibold text-white text-[12px] truncate">
                      {req.sender_profile?.display_name ||
                        "Người dùng"}
                    </span>
                  </div>
                  <div className="flex gap-1.5 mt-0.5">
                    <button
                      type="button"
                      onClick={() => acceptRequest(req.id)}
                      className="flex-1 py-1 rounded bg-gradient-to-r from-[#ff4b72] to-[#e63956] text-white font-bold text-[11px] shadow-xs hover:opacity-90 cursor-pointer"
                    >
                      Đồng ý ❤️
                    </button>
                    <button
                      type="button"
                      onClick={() => rejectRequest(req.id)}
                      className="flex-1 py-1 rounded bg-white/10 hover:bg-white/15 text-white/70 text-[11px] font-medium cursor-pointer"
                    >
                      Từ chối
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {}
        {outgoingRequests.length >
          0 && (
          <div className="rounded-xl bg-[#222222] border border-white/10 p-3 shadow-xs">
            <span className="text-[11px] font-semibold text-white/60 block mb-2">
              ⏳ Lời mời đã gửi ({outgoingRequests.length})
            </span>
            <div className="space-y-2">
              {outgoingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-[#181818] border border-white/5 rounded-lg p-2 flex items-center justify-between gap-2"
                >
                  <span className="font-mono text-[11px] text-white/60 truncate flex-1">
                    {req.receiver_id}
                  </span>
                  <button
                    type="button"
                    onClick={() => cancelRequest(req.id)}
                    className="px-2 py-0.5 rounded bg-white/10 hover:bg-red-500/20 hover:text-red-300 text-[10.5px] text-white/60 cursor-pointer"
                  >
                    Hủy
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }
  const partnerName =
    couple.partner?.display_name ||
    "Người thương"
  const partnerAvatar =
    couple.partner?.avatar_url ||
    "/img/profile-avatar.png"

  return (
    <div className="flex flex-1 flex-col overflow-hidden relative bg-[#161616]">
      {}
      <HeartAnimationOverlay triggerTimestamp={heartReceivedTimestamp} />

      {}
      <div className="flex items-center justify-between px-3 py-2 bg-[#1e1e1e] border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="relative">
            <img
              src={partnerAvatar}
              alt={partnerName}
              className="size-8 rounded-full border border-pink-500/30 object-cover"
            />
            <span
              className={`absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-[#1e1e1e] ${
                partnerOnline ? "bg-[#10b981]" : "bg-gray-500"
              }`}
              title={partnerOnline ? "Đang trực tuyến" : "Ngoại tuyến"}
            />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-[13px] text-white leading-tight truncate max-w-[120px] sm:max-w-[150px]">
              {partnerName}
            </span>
            <span className="text-[10px] text-white/50 leading-tight">
              {partnerTyping ? (
                <span className="text-[#ff4b72] font-semibold animate-pulse">
                  Đang soạn tin...
                </span>
              ) : partnerOnline ? (
                <span className="text-emerald-400 font-medium">Trực tuyến</span>
              ) : (
                "Ngoại tuyến"
              )}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {}
          <div className="px-2.5 py-0.5 rounded-full bg-[#ff4b72]/15 border border-[#ff4b72]/30 text-[#ff4b72] text-[11px] font-bold flex items-center gap-1 shadow-inner">
            <span>❤️</span>
            <span>{daysTogether} ngày</span>
          </div>

          {}
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            title="Tùy chọn cặp đôi"
            className="flex size-7 items-center justify-center rounded-full hover:bg-white/10 text-white/60 hover:text-white transition-colors cursor-pointer"
          >
            <svg
              className="size-3.5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </button>
        </div>
      </div>

      {}
      {showSettings && (
        <div className="absolute inset-x-0 top-[49px] z-20 bg-[#1c1c1c]/95 backdrop-blur-md border-b border-white/10 p-3.5 shadow-xl text-white text-xs animate-fade-in">
          <div className="flex items-center justify-between mb-2.5">
            <span className="font-bold text-[12.5px] text-white">
              Quản lý cặp đôi
            </span>
            <button
              type="button"
              onClick={() => setShowSettings(false)}
              className="text-white/40 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label
                htmlFor="anniversary-date-input"
                className="text-[11px] text-white/60 block mb-1"
              >
                Ngày bắt đầu yêu / kỷ niệm:
              </label>
              <div className="flex gap-1.5">
                <input
                  id="anniversary-date-input"
                  type="date"
                  value={anniversaryDate}
                  onChange={(e) => setAnniversaryDate(e.target.value)}
                  className="bg-[#282828] border border-white/10 rounded-lg px-2.5 py-1 text-[12px] text-white focus:outline-none flex-1"
                />
                <button
                  type="button"
                  onClick={handleSaveAnniversary}
                  disabled={isUpdatingDate}
                  className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-[11px] font-semibold text-white cursor-pointer disabled:opacity-50"
                >
                  {isUpdatingDate ? "..." : "Lưu"}
                </button>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-between items-center">
              <span className="text-[11px] text-white/50">
                Hủy liên kết tài khoản:
              </span>
              <button
                type="button"
                onClick={() => setShowUnpairConfirm(true)}
                className="px-2.5 py-1 rounded bg-red-500/20 hover:bg-red-500/30 text-red-400 text-[11px] font-semibold cursor-pointer transition-colors"
              >
                Hủy ghép đôi
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      {showUnpairConfirm && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
          <div className="w-full max-w-[280px] rounded-2xl border border-white/15 bg-[#222222] p-4 text-center shadow-2xl">
            <span className="text-2xl block mb-1">💔</span>
            <h5 className="font-bold text-white text-[13px]">
              Xác nhận hủy ghép đôi?
            </h5>
            <p className="text-[11px] text-white/60 mt-1 leading-normal">
              Bạn và <strong className="text-white">{partnerName}</strong> sẽ
              dừng kết nối phòng chat.
            </p>
            <div className="flex gap-2 mt-3.5">
              <button
                type="button"
                onClick={() => setShowUnpairConfirm(false)}
                className="flex-1 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white/70 text-[11px] font-semibold cursor-pointer"
              >
                Giữ lại
              </button>
              <button
                type="button"
                onClick={handleConfirmUnpair}
                disabled={isUnpairing}
                className="flex-1 py-1.5 rounded-lg bg-red-600 hover:bg-red-700 text-white text-[11px] font-semibold shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isUnpairing ? "Đang hủy..." : "Hủy"}
              </button>
            </div>
          </div>
        </div>
      )}

      {}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3.5 space-y-2.5 bg-[#161616]">
        {messages.length ===
        0 ? (
          <div className="flex h-full flex-col items-center justify-center text-center p-4">
            <span className="text-3xl mb-2">💬</span>
            <p className="text-[12px] text-white/50 leading-relaxed">
              Chưa có tin nhắn nào.
              <br />
              Hãy gửi lời nhắn hoặc thả tim đến {partnerName} nhé!
            </p>
          </div>
        ) : (
          messages.map((m) => {
            const isMe =
              m.sender_id ===
              user.id
            if (
              m.type ===
              "heart"
            ) {
              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${
                    isMe ? "items-end" : "items-start"
                  }`}
                >
                  <div className="text-[#ff4b72] p-1 animate-scale-up text-3xl">
                    ❤️
                  </div>
                  <span className="text-[10px] text-white/30 px-1">
                    {formatTime(m.created_at)}
                  </span>
                </div>
              )
            }
            return (
              <div
                key={m.id}
                className={`flex flex-col ${
                  isMe ? "items-end" : "items-start"
                }`}
              >
                <div
                  className={`max-w-[82%] px-3.5 py-2 rounded-[18px] text-[13px] leading-[1.45] shadow-xs break-words ${
                    isMe
                      ? "rounded-tr-[4px] bg-gradient-to-r from-[#ff4b72] to-[#e63956] text-white"
                      : "rounded-tl-[4px] bg-[#282828] border border-white/5 text-[#f3f4f6]"
                  }`}
                >
                  {m.text}
                </div>
                <span className="text-[9.5px] text-white/35 mt-0.5 px-1 font-normal">
                  {formatTime(m.created_at)}
                </span>
              </div>
            )
          })
        )}

        {}
        {partnerTyping && (
          <div className="flex items-center gap-1.5 text-[11px] text-white/40 pt-1">
            <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#282828]">
              <span className="size-1.5 rounded-full bg-[#ff4b72] animate-bounce" />
              <span
                className="size-1.5 rounded-full bg-[#ff4b72] animate-bounce"
                style={{ animationDelay: "0.15s" }}
              />
              <span
                className="size-1.5 rounded-full bg-[#ff4b72] animate-bounce"
                style={{ animationDelay: "0.3s" }}
              />
            </div>
            <span>{partnerName} đang soạn tin...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-1.5 px-3 py-2 bg-[#1e1e1e] border-t border-white/10"
      >
        <div className="flex-1 flex items-center bg-[#282828] border border-white/5 rounded-full px-3 py-1.5 focus-within:ring-1 focus-within:ring-[#ff4b72]/60 transition-all">
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            placeholder="Nhắn gửi yêu thương..."
            className="w-full bg-transparent text-[13px] text-white placeholder:text-white/40 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setInputText((prev) => prev + " ❤️")}
            title="Chèn biểu tượng tim"
            className="text-white/40 hover:text-[#ff4b72] transition-colors shrink-0 ml-1.5 cursor-pointer text-sm"
          >
            ❤️
          </button>
        </div>

        {inputText.trim() ? (
          <button
            type="submit"
            title="Gửi tin nhắn"
            className="flex size-8 items-center justify-center rounded-full bg-gradient-to-r from-[#ff4b72] to-[#e63956] text-white hover:opacity-90 active:scale-95 transition-all cursor-pointer shrink-0 shadow-sm"
          >
            <svg
              className="size-4 rotate-45 -translate-x-0.5"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            onClick={sendHeart}
            title="Thả tim bay"
            className="flex size-8 items-center justify-center rounded-full text-[#ff4b72] hover:bg-white/10 hover:scale-115 active:scale-95 transition-all cursor-pointer shrink-0 text-xl"
          >
            ❤️
          </button>
        )}
      </form>
    </div>
  )
}
