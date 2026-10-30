"use client"

// Simulate smart bot response

/* Chat Window Dialog - Styled cohesive with website theme (#1c1c1c / #1e1e1e / #ff4b72) */ /* Header */ /* Left: Message Icon Badge & Assistant Info */ /* Message Icon */ /* Active green status dot */ /* Right: Actions (White/Silver styling cohesive with NavigationMenu) */ /* Phone call button */ /* Minimize button */ /* Close button */ /* Optional Notice Overlay */ /* Messages Body */

// Time divider

// Incoming message (Bot / Assistant)

/* Assistant mini Message Icon */

// Outgoing message (Me / User)

/* Typing Indicator */ /* Quick Prompts Chips */ /* Footer Input Bar */ /* Input Capsule ("Aa") */ /* Heart / Smile icon inside input */ /* Action: Send Plane or Heart Like Button */ /* Floating Trigger Button (Cohesive with NavigationMenu: #1e1e1e + Message Icon) */ /* Main Button with Message Icon */ /* Message Icon */ /* Online Green Indicator Dot */ /* Hover Pill Tooltip */ /* Messages Body */ /* Assistant mini Message Icon */ /* Typing Indicator */

import { useState, useEffect, useRef } from "react"

interface Message {
  id: string

  sender: "bot" | "me"

  text?: string

  isLike?: boolean

  time?: string

  status?: string
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "time-1",

    sender: "bot",

    time: "Hôm nay",
  },

  {
    id: "1",

    sender: "bot",

    text: "Xin chào bạn! Mình là Trợ lý HYUN ❤️",
  },

  {
    id: "2",

    sender: "bot",

    text: "Bạn cần tìm quán ăn ngon chuẩn gu hay gợi ý điểm hẹn ở đâu hôm nay?",
  },

  {
    id: "3",

    sender: "me",

    text: "Gợi ý cho mình vài điểm hẹn ẩm thực ngon nhé!",

    status: "Đã gửi",
  },

  {
    id: "4",

    sender: "bot",

    text: "Tuyệt vời! HYUN có Phở Bát Đàn (Hà Nội), Cơm Tấm Ba Ghiền (Sài Gòn), Lẩu Gà Lá É (Đà Lạt) và Bánh Xèo Bà Dưỡng (Đà Nẵng). Bạn muốn khám phá món nào trước nè?",
  },
]

const BOT_REPLIES: Record<string, string> = {
  phở: "Phở Bát Đàn ở phố cổ Hà Nội là lựa chọn chuẩn gu nhất đó bạn! Nước dùng thanh ngọt hầm xương trăm năm, thịt bò mềm thơm nức mũi.",

  "cơm tấm":
    "Ở Sài Gòn thì nhất định phải ghé Cơm Tấm Ba Ghiền nha! Miếng sườn nướng than hồng to ngập đĩa, bì chả thơm lừng khó cưỡng.",

  "lẩu gà":
    "Đêm Đà Lạt se lạnh mà ngồi quanh nồi Lẩu Gà Lá É Tao Ngộ nghi ngút khói thì ấm áp tuyệt đối luôn ạ!",

  "bánh xèo":
    "Bánh Xèo & Nem Lụi Bà Dưỡng tại Đà Nẵng với lớp vỏ giòn rụm và nước sốt gan đậu gia truyền ngon quên lối về!",

  hẹn: "Bạn có thể mở menu ở góc trên bên phải và chọn mục 'Lịch hẹn' để lên lịch hẹn chuẩn gu cùng người thương nhé ❤️",
}

export default function ChatBox() {
  const [isOpen, setIsOpen] = useState(false)

  const [isMinimized, setIsMinimized] = useState(false)

  const [inputVal, setInputVal] = useState("")

  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)

  const [isTyping, setIsTyping] = useState(false)

  const [callNotice, setCallNotice] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const chatRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom()
    }
  }, [messages, isOpen, isMinimized, isTyping])

  const handleSend = (textToSend?: string) => {
    const text = (textToSend ?? inputVal).trim()

    if (!text) return

    const now = new Date()

    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now

      .getMinutes()

      .toString()

      .padStart(2, "0")}`

    const newMsg: Message = {
      id: String(Date.now()),

      sender: "me",

      text,

      status: `Đã gửi lúc ${timeStr}`,
    }

    setMessages((prev) => [...prev, newMsg])

    if (!textToSend) setInputVal("")

    setIsTyping(true)

    setTimeout(() => {
      const lower = text.toLowerCase()

      let replyText =
        "Cảm ơn bạn! HYUN luôn sẵn sàng đồng hành cùng bạn trên mọi hành trình ẩm thực chuẩn gu ❤️ Bạn cần mình hỗ trợ thêm gì không ạ?"

      for (const [key, reply] of Object.entries(BOT_REPLIES)) {
        if (lower.includes(key)) {
          replyText = reply

          break
        }
      }

      const botMsg: Message = {
        id: String(Date.now() + 1),

        sender: "bot",

        text: replyText,
      }

      setMessages((prev) => [...prev, botMsg])

      setIsTyping(false)
    }, 900)
  }

  const handleSendLike = () => {
    const now = new Date()

    const timeStr = `${now.getHours().toString().padStart(2, "0")}:${now

      .getMinutes()

      .toString()

      .padStart(2, "0")}`

    const likeMsg: Message = {
      id: String(Date.now()),

      sender: "me",

      isLike: true,

      status: `Đã gửi lúc ${timeStr}`,
    }

    setMessages((prev) => [...prev, likeMsg])

    setIsTyping(true)

    setTimeout(() => {
      const botMsg: Message = {
        id: String(Date.now() + 1),

        sender: "bot",

        text: "HYUN cảm ơn bạn đã thả tim! Chúc bạn có những buổi hẹn thật tuyệt vời ❤️",
      }

      setMessages((prev) => [...prev, botMsg])

      setIsTyping(false)
    }, 800)
  }

  const handleCallBack = () => {
    setCallNotice("Đang kết nối tổng đài tư vấn HYUN...")

    setTimeout(() => {
      setCallNotice(null)
    }, 2400)
  }

  return (
    <div
      ref={chatRef}
      className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 md:bottom-8 md:right-10 z-50 flex flex-col items-end select-none font-['Inter',system-ui,-apple-system,sans-serif]"
    >
      {}
      {isOpen && !isMinimized && (
        <div className="flex flex-col w-[calc(100vw-32px)] sm:w-[365px] max-w-[365px] h-[500px] max-h-[80vh] sm:max-h-[85vh] rounded-[22px] bg-[#1c1c1c] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.6)] overflow-hidden animate-menu-card">
          {}
          <div className="relative flex items-center justify-between px-4 py-3 bg-[#1e1e1e] border-b border-white/10 text-white">
            {}
            <div className="flex items-center gap-2.5">
              <div className="relative flex size-[38px] items-center justify-center rounded-full bg-white/10 border border-white/15 text-[#ff4b72] shadow-inner shrink-0">
                {}
                <svg
                  className="size-[19px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                </svg>
                {}
                <span className="absolute bottom-0 right-0 size-2.5 rounded-full bg-[#10b981] ring-2 ring-[#1e1e1e]" />
              </div>

              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-['Inter:Bold','Inter',sans-serif] font-bold text-[14.5px] leading-tight text-white">
                    HYUN Assistant
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#ff4b72]/20 text-[#ff4b72] font-semibold border border-[#ff4b72]/30">
                    24/7
                  </span>
                </div>
                <span className="text-[11.5px] text-white/60 font-normal leading-tight mt-0.5">
                  Điểm hẹn ẩm thực chuẩn gu ❤️
                </span>
              </div>
            </div>

            {}
            <div className="flex items-center gap-1 text-white/70">
              {}
              <button
                type="button"
                onClick={handleCallBack}
                title="Gọi hỗ trợ"
                className="flex size-7 items-center justify-center rounded-full hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <svg
                  className="size-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
              </button>

              {}
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

              {}
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

          {}
          {callNotice && (
            <div className="bg-[#282828] text-white text-[12px] text-center py-1.5 px-3 border-b border-white/10 animate-fade-in">
              {callNotice}
            </div>
          )}

          {}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3.5 space-y-2.5 bg-[#161616]">
            {messages.map((m) => {
              if (m.time) {
                return (
                  <div
                    key={m.id}
                    className="text-center text-[11px] text-white/40 font-medium py-1"
                  >
                    {m.time}
                  </div>
                )
              }

              if (m.sender === "bot") {
                return (
                  <div key={m.id} className="flex items-end gap-2 max-w-[85%]">
                    {}
                    <div className="flex size-7 items-center justify-center rounded-full bg-white/10 border border-white/15 text-[#ff4b72] shrink-0 mb-0.5">
                      <svg
                        className="size-3.5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                      </svg>
                    </div>
                    <div className="bg-[#282828] text-[#f3f4f6] border border-white/5 px-3.5 py-2.5 rounded-[18px] rounded-tl-[4px] text-[13.5px] leading-[1.45] shadow-xs break-words">
                      {m.text}
                    </div>
                  </div>
                )
              }

              return (
                <div key={m.id} className="flex flex-col items-end">
                  {m.isLike ? (
                    <div className="text-[#ff4b72] p-1 animate-scale-up">
                      <svg
                        className="size-9"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                      </svg>
                    </div>
                  ) : (
                    <div className="max-w-[82%] px-3.5 py-2.5 rounded-[18px] rounded-tr-[4px] bg-gradient-to-r from-[#ff4b72] to-[#e63956] text-white text-[13.5px] leading-[1.45] shadow-sm break-words">
                      {m.text}
                    </div>
                  )}
                  {m.status && (
                    <span className="text-[10px] text-white/40 mt-1 pr-1 font-normal">
                      {m.status}
                    </span>
                  )}
                </div>
              )
            })}

            {}
            {isTyping && (
              <div className="flex items-end gap-2 max-w-[80px]">
                <div className="flex size-7 items-center justify-center rounded-full bg-white/10 border border-white/15 text-[#ff4b72] shrink-0 mb-0.5">
                  <svg
                    className="size-3.5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                  </svg>
                </div>
                <div className="flex items-center gap-1 px-3 py-2.5 rounded-[18px] bg-[#282828] border border-white/5">
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
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {}
          <form
            onSubmit={(e) => {
              e.preventDefault()

              handleSend()
            }}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#1e1e1e] border-t border-white/10"
          >
            {}
            <div className="flex-1 flex items-center bg-[#282828] border border-white/5 rounded-full px-3.5 py-1.5 focus-within:ring-1 focus-within:ring-[#ff4b72]/60 transition-all">
              <input
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Aa..."
                className="w-full bg-transparent text-[13.5px] text-white placeholder:text-white/40 focus:outline-none"
              />
              {}
              <button
                type="button"
                onClick={() => setInputVal((prev) => prev + " ❤️")}
                title="Chèn biểu tượng tim"
                className="text-white/50 hover:text-[#ff4b72] transition-colors shrink-0 ml-1.5 cursor-pointer"
              >
                <svg
                  className="size-[17px]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>
            </div>

            {}
            {inputVal.trim() ? (
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
                onClick={handleSendLike}
                title="Gửi tim yêu thích"
                className="flex size-8 items-center justify-center rounded-full text-[#ff4b72] hover:bg-white/10 hover:scale-110 active:scale-95 transition-all cursor-pointer shrink-0"
              >
                <svg
                  className="size-[20px]"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </button>
            )}
          </form>
        </div>
      )}

      {}
      {(!isOpen || isMinimized) && (
        <div className="group relative flex items-center">
          {}
          <button
            type="button"
            onClick={() => {
              setIsOpen(true)

              setIsMinimized(false)
            }}
            title="Mở đoạn chat hỗ trợ"
            aria-label="Mở khung trò chuyện"
            className="group relative flex size-[54px] cursor-pointer items-center justify-center rounded-full bg-[#1e1e1e] text-white shadow-lg border border-white/10 transition-all duration-300 hover:scale-105 hover:bg-[#2c2c2c] hover:shadow-2xl active:scale-95"
          >
            {}
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

            {}
            <span className="absolute bottom-1 right-1 size-2.5 rounded-full bg-[#10b981] ring-2 ring-[#1e1e1e]" />
          </button>

          {}
          <span className="pointer-events-none absolute right-[calc(100%+12px)] top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#1e1e1e] border border-white/10 px-3.5 py-1.5 text-[12px] font-semibold text-white shadow-lg opacity-0 transition-all duration-200 group-hover:opacity-100 group-hover:-translate-x-1">
            Nhắn tin hỗ trợ ❤️
          </span>
        </div>
      )}
    </div>
  )
}
