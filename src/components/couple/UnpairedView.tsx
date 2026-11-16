"use client"

import { useState } from "react"
import type { User } from "@supabase/supabase-js"
import type { CoupleRequest } from "@/types/couple"

interface UnpairedViewProps {
  user: User
  incomingRequests: CoupleRequest[]
  outgoingRequests: CoupleRequest[]
  onSendRequest: (targetUserId: string) => Promise<void>
  onAcceptRequest: (requestId: string) => Promise<void>
  onRejectRequest: (requestId: string) => Promise<void>
  onCancelRequest: (requestId: string) => Promise<void>
}

export default function UnpairedView({
  user,
  incomingRequests,
  outgoingRequests,
  onSendRequest,
  onAcceptRequest,
  onRejectRequest,
  onCancelRequest,
}: UnpairedViewProps) {
  const [partnerIdInput, setPartnerIdInput] = useState("")
  const [isCopied, setIsCopied] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(user.id)
      setIsCopied(true)
      setTimeout(() => setIsCopied(false), 2500)
    } catch (err) {
      console.error("Không thể copy:", err)
    }
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)
    setSuccessMessage(null)

    const trimmed = partnerIdInput.trim()
    if (!trimmed) {
      setErrorMessage("Vui lòng nhập User ID của đối phương")
      return
    }

    try {
      setIsSubmitting(true)
      await onSendRequest(trimmed)
      setPartnerIdInput("")
      setSuccessMessage("Đã gửi lời mời ghép đôi thành công! Vui lòng chờ người thương duyệt.")
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Gửi lời mời thất bại")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 py-4">
      {/* Hero Intro */}
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#2a1b24] via-[#1a1a1a] to-[#161616] p-8 text-center shadow-2xl">
        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-3xl bg-gradient-to-tr from-[#ff4b72] to-[#ff758c] text-4xl shadow-lg shadow-[#ff4b72]/30">
          💍
        </div>
        <h1 className="text-3xl font-extrabold text-white md:text-4xl">
          Kết Nối Cặp Đôi & Trò Chuyện
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-300 md:text-base">
          Chia sẻ mã User ID để kết đôi cùng người thương. Đếm ngày bên nhau, lưu giữ kỉ niệm và trò
          chuyện thời gian thực với Cloudflare WebSocket siêu tốc.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Card 1: Mã ID Của Bạn */}
        <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#1c1c1c] p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-xl text-[#ff4b72]">
                🆔
              </span>
              <div>
                <h3 className="font-bold text-white">Mã ID Của Bạn</h3>
                <p className="text-xs text-gray-400">Gửi mã này cho đối phương để ghép đôi</p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-white/10 bg-black/40 p-4">
              <span className="text-xs uppercase tracking-wider text-gray-400">User ID</span>
              <div className="mt-1 break-all font-mono text-sm font-semibold text-pink-400">
                {user.id}
              </div>
            </div>
          </div>

          <div className="mt-5">
            <button
              type="button"
              onClick={handleCopyId}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#ff4b72]/40 bg-[#ff4b72]/10 py-3 text-sm font-semibold text-[#ff4b72] transition-all hover:bg-[#ff4b72] hover:text-white active:scale-98"
            >
              {isCopied ? (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Đã sao chép vào bộ nhớ tạm!
                </>
              ) : (
                <>
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Sao chép User ID
                </>
              )}
            </button>
          </div>
        </div>

        {/* Card 2: Nhập ID Đối Phương */}
        <div className="flex flex-col justify-between rounded-2xl border border-white/10 bg-[#1c1c1c] p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/10 text-xl text-[#ff4b72]">
                💌
              </span>
              <div>
                <h3 className="font-bold text-white">Gửi Lời Mời Ghép Đôi</h3>
                <p className="text-xs text-gray-400">Dán ID của người thương vào đây</p>
              </div>
            </div>

            <form onSubmit={handleSend} className="mt-5 space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-300">User ID người thương</label>
                <input
                  type="text"
                  value={partnerIdInput}
                  onChange={(e) => setPartnerIdInput(e.target.value)}
                  placeholder="Ví dụ: e3b8f1c2-..."
                  className="mt-1 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 font-mono text-sm text-white placeholder-gray-500 transition-colors focus:border-[#ff4b72] focus:outline-none"
                />
              </div>

              {errorMessage && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                  {errorMessage}
                </div>
              )}

              {successMessage && (
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400">
                  {successMessage}
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#ff4b72] to-[#ff3366] py-3 text-sm font-semibold text-white shadow-lg shadow-[#ff4b72]/20 transition-transform hover:opacity-95 active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? "Đang gửi..." : "Gửi lời mời ghép đôi ❤️"}
              </button>
            </form>
          </div>

          <p className="mt-4 text-center text-xs text-gray-400">
            Cả hai người dùng đều phải có tài khoản trên HYUN.
          </p>
        </div>
      </div>

      {/* Danh sách lời mời nhận được (Incoming) */}
      <div className="rounded-2xl border border-white/10 bg-[#1c1c1c] p-6 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/10 text-lg text-amber-400">
              📥
            </span>
            <div>
              <h3 className="font-bold text-white">Lời Mời Ghép Đôi Đang Chờ</h3>
              <p className="text-xs text-gray-400">Những người muốn ghép đôi cùng bạn</p>
            </div>
          </div>
          <span className="rounded-full bg-pink-500/20 px-3 py-1 text-xs font-semibold text-pink-400">
            {incomingRequests.length} lời mời
          </span>
        </div>

        <div className="mt-4 divide-y divide-white/5">
          {incomingRequests.length === 0 ? (
            <div className="py-8 text-center text-sm text-gray-400">
              Chưa có lời mời ghép đôi nào đến tài khoản của bạn.
            </div>
          ) : (
            incomingRequests.map((req) => (
              <div
                key={req.id}
                className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={req.sender_profile?.avatar_url || "/img/profile-avatar.png"}
                    alt={req.sender_profile?.display_name || "User"}
                    className="h-12 w-12 rounded-full border border-pink-500/40 object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-white">
                      {req.sender_profile?.display_name || "Thực khách HYUN"}
                    </h4>
                    <p className="font-mono text-xs text-gray-400">ID: {req.sender_id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => onAcceptRequest(req.id)}
                    className="rounded-xl bg-gradient-to-r from-[#ff4b72] to-[#ff3366] px-5 py-2 text-xs font-bold text-white shadow-md transition-transform hover:opacity-95 active:scale-95"
                  >
                    Chấp nhận ❤️
                  </button>
                  <button
                    type="button"
                    onClick={() => onRejectRequest(req.id)}
                    className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-gray-300 transition-colors hover:bg-white/10"
                  >
                    Từ chối
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Danh sách lời mời đã gửi (Outgoing) */}
      {outgoingRequests.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#1c1c1c] p-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-500/10 text-lg text-blue-400">
                📤
              </span>
              <div>
                <h3 className="font-bold text-white">Lời Mời Bạn Đã Gửi</h3>
                <p className="text-xs text-gray-400">Đang chờ đối phương xác nhận</p>
              </div>
            </div>
          </div>

          <div className="mt-4 divide-y divide-white/5">
            {outgoingRequests.map((req) => (
              <div
                key={req.id}
                className="flex items-center justify-between py-3 text-sm text-gray-300"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={req.receiver_profile?.avatar_url || "/img/profile-avatar.png"}
                    alt={req.receiver_profile?.display_name || "Partner"}
                    className="h-10 w-10 rounded-full border border-white/10 object-cover"
                  />
                  <div>
                    <span className="font-medium text-white">
                      {req.receiver_profile?.display_name || "Người thương"}
                    </span>
                    <span className="ml-2 rounded-md bg-yellow-500/10 px-2 py-0.5 text-xs text-yellow-400">
                      Đang chờ duyệt
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onCancelRequest(req.id)}
                  className="rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20"
                >
                  Hủy lời mời
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
