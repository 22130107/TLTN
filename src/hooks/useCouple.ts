"use client"

import { useState, useEffect, useCallback } from "react"
import { useAuth } from "@/contexts/AuthContext"
import type { Couple, CoupleRequest } from "@/types/couple"
import {
  getActiveCouple,
  getPendingIncomingRequests,
  getPendingOutgoingRequests,
  sendCoupleRequest,
  acceptCoupleRequest,
  rejectCoupleRequest,
  cancelCoupleRequest,
  unpairCouple,
  updateAnniversaryDate,
} from "@/services/coupleService"

export function useCouple() {
  const { user } = useAuth()
  const [couple, setCouple] = useState<Couple | null>(null)
  const [incomingRequests, setIncomingRequests] = useState<CoupleRequest[]>([])
  const [outgoingRequests, setOutgoingRequests] = useState<CoupleRequest[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (!user?.id) {
      setCouple(null)
      setIncomingRequests([])
      setOutgoingRequests([])
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const [activeCouple, incoming, outgoing] = await Promise.all([
        getActiveCouple(user.id),
        getPendingIncomingRequests(user.id),
        getPendingOutgoingRequests(user.id),
      ])

      setCouple(activeCouple)
      setIncomingRequests(incoming)
      setOutgoingRequests(outgoing)
    } catch (err: unknown) {
      console.error("Lỗi khi tải dữ liệu couple:", err)
      setError(err instanceof Error ? err.message : "Không thể tải dữ liệu cặp đôi")
    } finally {
      setIsLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    refresh()
  }, [refresh])

  const sendRequest = async (targetUserId: string) => {
    if (!user?.id) throw new Error("Vui lòng đăng nhập trước khi ghép đôi")
    const res = await sendCoupleRequest(user.id, targetUserId)
    if (!res.success) {
      throw new Error(res.error || "Gửi lời mời thất bại")
    }
    await refresh()
    return res.request
  }

  const acceptRequest = async (requestId: string) => {
    if (!user?.id) throw new Error("Vui lòng đăng nhập")
    const res = await acceptCoupleRequest(requestId, user.id)
    if (!res.success) {
      throw new Error(res.error || "Chấp nhận lời mời thất bại")
    }
    await refresh()
    return res.couple
  }

  const rejectRequest = async (requestId: string) => {
    if (!user?.id) throw new Error("Vui lòng đăng nhập")
    const res = await rejectCoupleRequest(requestId, user.id)
    if (!res.success) {
      throw new Error(res.error || "Từ chối lời mời thất bại")
    }
    await refresh()
  }

  const cancelRequest = async (requestId: string) => {
    if (!user?.id) throw new Error("Vui lòng đăng nhập")
    const res = await cancelCoupleRequest(requestId, user.id)
    if (!res.success) {
      throw new Error(res.error || "Hủy lời mời thất bại")
    }
    await refresh()
  }

  const unpair = async () => {
    if (!user?.id || !couple?.id) throw new Error("Không có cặp đôi để hủy")
    const res = await unpairCouple(couple.id, user.id)
    if (!res.success) {
      throw new Error(res.error || "Hủy ghép đôi thất bại")
    }
    await refresh()
  }

  const updateAnniversary = async (newDate: string) => {
    if (!user?.id || !couple?.id) throw new Error("Không có cặp đôi hợp lệ")
    const res = await updateAnniversaryDate(couple.id, user.id, newDate)
    if (!res.success) {
      throw new Error(res.error || "Cập nhật ngày kỷ niệm thất bại")
    }
    setCouple((prev) => (prev ? { ...prev, anniversary_date: newDate } : null))
  }

  return {
    user,
    couple,
    isLoading,
    error,
    incomingRequests,
    outgoingRequests,
    refresh,
    sendRequest,
    acceptRequest,
    rejectRequest,
    cancelRequest,
    unpair,
    updateAnniversary,
  }
}
