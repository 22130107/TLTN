"use client"

import { useState } from "react"

interface UnpairModalProps {
  isOpen: boolean
  partnerName: string
  onClose: () => void
  onConfirm: () => Promise<void>
}

export default function UnpairModal({
  isOpen,
  partnerName,
  onClose,
  onConfirm,
}: UnpairModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (!isOpen) return null

  const handleConfirm = async () => {
    try {
      setIsSubmitting(true)
      await onConfirm()
      onClose()
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#1e1e1e] p-6 shadow-2xl">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-2xl text-red-500">
          💔
        </div>
        <h3 className="text-center text-xl font-bold text-white">Xác nhận hủy ghép đôi?</h3>
        <p className="mt-2 text-center text-sm leading-relaxed text-gray-400">
          Bạn và <strong className="text-white">{partnerName}</strong> sẽ không còn liên kết tài
          khoản cặp đôi. Lịch sử kỷ niệm và phòng chat chung sẽ dừng hoạt động.
        </p>

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="flex-1 rounded-xl border border-white/15 bg-white/5 py-2.5 text-sm font-semibold text-gray-300 transition-colors hover:bg-white/10"
          >
            Giữ lại
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="flex-1 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform hover:opacity-95 active:scale-95 disabled:opacity-50"
          >
            {isSubmitting ? "Đang xử lý..." : "Hủy ghép đôi"}
          </button>
        </div>
      </div>
    </div>
  )
}
