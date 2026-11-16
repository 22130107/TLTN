"use client"

import { useState } from "react"
import type { Couple } from "@/types/couple"
import UnpairModal from "./UnpairModal"

interface PairedDashboardProps {
  couple: Couple
  currentUserId: string
  partnerOnline: boolean
  onUnpair: () => Promise<void>
  onUpdateAnniversary: (newDate: string) => Promise<void>
}

export default function PairedDashboard({
  couple,
  currentUserId,
  partnerOnline,
  onUnpair,
  onUpdateAnniversary,
}: PairedDashboardProps) {
  const [isUnpairModalOpen, setIsUnpairModalOpen] = useState(false)
  const [isEditingDate, setIsEditingDate] = useState(false)
  const [newDateVal, setNewDateVal] = useState(couple.anniversary_date || "")

  // Calculate days together
  const calculateDays = () => {
    try {
      const start = new Date(couple.anniversary_date).getTime()
      const now = new Date().getTime()
      const diffTime = Math.max(0, now - start)
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1
      return diffDays
    } catch {
      return 1
    }
  }

  const daysTogether = calculateDays()
  const partnerName = couple.partner?.display_name || "Người thương"
  const partnerAvatar = couple.partner?.avatar_url || "/img/profile-avatar.png"

  const handleSaveDate = async () => {
    if (!newDateVal) return
    try {
      await onUpdateAnniversary(newDateVal)
      setIsEditingDate(false)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <>
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-[#21141c] via-[#1a1a1a] to-[#171717] p-6 shadow-2xl">
        {/* Glow decoration */}
        <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-[#ff4b72]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-rose-500/10 blur-3xl" />

        <div className="relative z-10 flex flex-col items-center justify-between gap-6 sm:flex-row">
          {/* Couple Avatars Linked by Heart */}
          <div className="flex items-center gap-4">
            <div className="relative flex items-center">
              {/* Partner Avatar */}
              <div className="relative">
                <img
                  src={partnerAvatar}
                  alt={partnerName}
                  className="h-16 w-16 rounded-full border-2 border-[#ff4b72] object-cover shadow-lg"
                />
                {/* Online Status Dot */}
                <span
                  title={partnerOnline ? "Đang trực tuyến" : "Ngoại tuyến"}
                  className={`absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-[#1c1c1c] ${
                    partnerOnline ? "bg-emerald-500 shadow-md shadow-emerald-500/50" : "bg-gray-500"
                  }`}
                />
              </div>

              {/* Heart Connector */}
              <div className="-mx-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-tr from-[#ff4b72] to-[#ff758c] text-sm text-white shadow-md shadow-[#ff4b72]/40">
                ❤️
              </div>

              {/* My Avatar / Placeholder icon */}
              <div className="flex h-16 w-16 items-center justify-center rounded-full border-2 border-white/20 bg-gradient-to-br from-[#2a2a2a] to-[#1e1e1e] text-2xl font-bold text-white shadow-lg">
                ✨
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">{partnerName}</h2>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    partnerOnline
                      ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                      : "bg-gray-500/10 text-gray-400 border border-white/10"
                  }`}
                >
                  {partnerOnline ? "Đang Online" : "Ngoại tuyến"}
                </span>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Cặp đôi HYUN • ID: {couple.id.substring(0, 8)}...
              </p>
            </div>
          </div>

          {/* Days Together Counter & Actions */}
          <div className="flex flex-wrap items-center gap-4">
            <div className="rounded-2xl border border-[#ff4b72]/20 bg-black/40 px-5 py-3 text-center">
              <span className="block text-xs uppercase tracking-wider text-pink-300">
                Đã bên nhau
              </span>
              <span className="font-mono text-2xl font-black text-white">
                {daysTogether} <span className="text-sm font-semibold text-[#ff4b72]">ngày</span>
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {isEditingDate ? (
                <div className="flex items-center gap-2">
                  <input
                    type="date"
                    value={newDateVal}
                    onChange={(e) => setNewDateVal(e.target.value)}
                    className="rounded-lg border border-white/20 bg-black/60 px-2 py-1 text-xs text-white"
                  />
                  <button
                    type="button"
                    onClick={handleSaveDate}
                    className="rounded-lg bg-pink-600 px-2.5 py-1 text-xs font-semibold text-white hover:bg-pink-500"
                  >
                    Lưu
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditingDate(false)}
                    className="rounded-lg border border-white/10 px-2 py-1 text-xs text-gray-400"
                  >
                    Hủy
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditingDate(true)}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-gray-300 transition-colors hover:bg-white/10"
                >
                  📅 Ngày kỷ niệm: {couple.anniversary_date}
                </button>
              )}

              <button
                type="button"
                onClick={() => setIsUnpairModalOpen(true)}
                className="rounded-xl border border-red-500/20 bg-red-500/5 px-3 py-1.5 text-xs font-medium text-red-400 transition-colors hover:bg-red-500/15"
              >
                Hủy ghép đôi
              </button>
            </div>
          </div>
        </div>
      </div>

      <UnpairModal
        isOpen={isUnpairModalOpen}
        partnerName={partnerName}
        onClose={() => setIsUnpairModalOpen(false)}
        onConfirm={onUnpair}
      />
    </>
  )
}
