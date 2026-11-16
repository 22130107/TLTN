"use client"

// Cloudflare WebSocket URL (Local dev fallback to ws://127.0.0.1:8787)

// Clean up existing socket
// ignore
// Gửi lệnh join phòng tới Cloudflare Worker
// 50-100 tin nhắn gần nhất từ Cloudflare D1 / Worker Cache
// Tự động kết nối lại sau 2.5s

// Fetch initial message history via HTTP

/**
 * Gửi tin nhắn qua Cloudflare WebSocket (kèm HTTP fallback)
 */
// Optimistic preview & HTTP fallback

// Send via HTTP fallback

/**
 * Báo trạng thái gõ phím
 */

/**
 * Bắn tim nhanh (Heart Ping kèm HTTP fallback)
 */

import { useState, useEffect, useRef, useCallback } from "react"
import type {
  CoupleMessage,
  WsServerEvent,
  WsClientAction,
} from "@/types/couple"
import {
  fetchCoupleMessages,
  sendCoupleMessageHttp,
} from "@/services/coupleService"

interface UseCoupleChatOptions {
  wsUrl?: string
}

export function useCoupleChat(
  coupleId: string | undefined,
  userId: string | undefined,
  options?: UseCoupleChatOptions,
) {
  const [messages, setMessages] = useState<CoupleMessage[]>([])
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [partnerOnline, setPartnerOnline] = useState<boolean>(false)
  const [partnerTyping, setPartnerTyping] = useState<boolean>(false)
  const [heartReceivedTimestamp, setHeartReceivedTimestamp] =
    useState<number | null>(null)

  const socketRef = useRef<WebSocket | null>(null)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const isMountedRef = useRef<boolean>(true)
  const baseWsUrl =
    options?.wsUrl ||
    process.env.NEXT_PUBLIC_CF_CHAT_WS_URL ||
    (typeof window !==
      "undefined" &&
    window.location.hostname ===
      "localhost"
      ? "ws://127.0.0.1:8787"
      : "wss://chat.minkura.workers.dev")

  const connect = useCallback(() => {
    if (!coupleId || !userId) return
    if (socketRef.current) {
      try {
        socketRef.current.close()
      } catch (e) {}
      socketRef.current = null
    }

    try {
      const urlWithParams = `${baseWsUrl}?coupleId=${encodeURIComponent(coupleId)}&userId=${encodeURIComponent(userId)}`
      const ws = new WebSocket(urlWithParams)
      socketRef.current = ws

      ws.onopen = () => {
        if (!isMountedRef.current) return
        setIsConnected(true)
        const joinAction: WsClientAction = {
          type: "join",
          coupleId,
          userId,
        }
        ws.send(JSON.stringify(joinAction))
      }

      ws.onmessage = (event) => {
        if (!isMountedRef.current) return
        try {
          const data = JSON.parse(event.data) as WsServerEvent
          switch (data.type) {
            case "history": {
              setMessages(
                data.messages ||
                  [],
              )
              break
            }
            case "new_message": {
              setMessages((prev) => {
                if (
                  prev.some(
                    (m) =>
                      m.id ===
                      data.message.id,
                  )
                ) {
                  return prev
                }
                return [...prev, data.message]
              })
              break
            }
            case "typing": {
              if (
                data.userId !==
                userId
              ) {
                setPartnerTyping(data.isTyping)
                if (typingTimeoutRef.current) {
                  clearTimeout(typingTimeoutRef.current)
                }
                if (data.isTyping) {
                  typingTimeoutRef.current = setTimeout(() => {
                    if (isMountedRef.current) {
                      setPartnerTyping(false)
                    }
                  }, 3000)
                }
              }
              break
            }
            case "partner_status": {
              setPartnerOnline(data.isOnline)
              break
            }
            case "heart_received": {
              if (
                data.senderId !==
                userId
              ) {
                setHeartReceivedTimestamp(Date.now())
              }
              break
            }
          }
        } catch (err) {
          console.error("Lỗi khi đọc tin nhắn Cloudflare WS:", err)
        }
      }

      ws.onclose = () => {
        if (!isMountedRef.current) return
        setIsConnected(false)
        setPartnerOnline(false)
        if (reconnectTimeoutRef.current)
          clearTimeout(reconnectTimeoutRef.current)
        reconnectTimeoutRef.current = setTimeout(() => {
          if (isMountedRef.current && coupleId && userId) {
            connect()
          }
        }, 2500)
      }

      ws.onerror = (err) => {
        console.warn("Cloudflare WebSocket cảnh báo kết nối:", err)
      }
    } catch (err) {
      console.warn("Khởi tạo Cloudflare WebSocket gặp lỗi:", err)
    }
  }, [baseWsUrl, coupleId, userId])

  useEffect(() => {
    isMountedRef.current = true
    if (coupleId) {
      fetchCoupleMessages(coupleId).then((history) => {
        if (
          isMountedRef.current &&
          history.length >
            0
        ) {
          setMessages((prev) => {
            const map = new Map<string, CoupleMessage>()
            for (const m of history) map.set(m.id, m)
            for (const m of prev) map.set(m.id, m)
            return Array.from(map.values())
          })
        }
      })
    }

    connect()

    return () => {
      isMountedRef.current = false
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current)
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
      if (socketRef.current) {
        socketRef.current.close()
      }
    }
  }, [connect, coupleId])
  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || !coupleId || !userId) return

      const clientAction: WsClientAction = {
        type: "message",
        coupleId,
        senderId: userId,
        text: trimmed,
        msgType: "text",
      }

      if (
        socketRef.current &&
        socketRef.current.readyState ===
          WebSocket.OPEN
      ) {
        socketRef.current.send(JSON.stringify(clientAction))
      } else {
        const optimisticMsg: CoupleMessage = {
          id: `local-${Date.now()}`,
          couple_id: coupleId,
          sender_id: userId,
          text: trimmed,
          type: "text",
          status: "sent",
          created_at: Date.now(),
        }
        setMessages((prev) => [...prev, optimisticMsg])
        sendCoupleMessageHttp(coupleId, userId, trimmed, "text").catch(
          (err) => {
            console.warn("HTTP message fallback warning:", err)
          },
        )
      }
    },
    [coupleId, userId],
  )
  const sendTyping = useCallback(
    (isTyping: boolean) => {
      if (!coupleId || !userId) return
      if (
        socketRef.current &&
        socketRef.current.readyState === WebSocket.OPEN
      ) {
        const typingAction: WsClientAction = {
          type: "typing",
          coupleId,
          userId,
          isTyping,
        }
        socketRef.current.send(JSON.stringify(typingAction))
      }
    },
    [coupleId, userId],
  )
  const sendHeart = useCallback(() => {
    if (!coupleId || !userId) return

    setHeartReceivedTimestamp(Date.now())

    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      const heartAction: WsClientAction = {
        type: "heart_ping",
        coupleId,
        senderId: userId,
      }
      socketRef.current.send(JSON.stringify(heartAction))
    } else {
      sendCoupleMessageHttp(coupleId, userId, "❤️", "heart").catch((err) => {
        console.warn("HTTP heart fallback warning:", err)
      })
    }
  }, [coupleId, userId])

  return {
    messages,
    isConnected,
    partnerOnline,
    partnerTyping,
    heartReceivedTimestamp,
    sendMessage,
    sendTyping,
    sendHeart,
  }
}
