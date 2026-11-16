"use client"

import { useState, useRef, useEffect } from "react"

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

export default function BotChatTab() {
  const [inputVal, setInputVal] = useState("")
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES)
  const [isTyping, setIsTyping] = useState(false)
  const [callNotice, setCallNotice] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

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
    <div className="flex flex-1 flex-col overflow-hidden bg-[#161616]">
      {/* Bot Assistant Notice Bar */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-[#1e1e1e] border-b border-white/10 text-white/70 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="size-2 rounded-full bg-[#10b981]" />
          <span className="text-[11.5px] text-white/80 font-medium">Trợ lý AI Ẩm thực 24/7</span>
        </div>
        <button
          type="button"
          onClick={handleCallBack}
          title="Gọi hỗ trợ"
          className="text-[11px] text-[#ff4b72] hover:underline cursor-pointer flex items-center gap-1"
        >
          <span>Tổng đài</span>
          <span>📞</span>
        </button>
      </div>

      {callNotice && (
        <div className="bg-[#282828] text-white text-[11.5px] text-center py-1.5 px-3 border-b border-white/10 animate-fade-in">
          {callNotice}
        </div>
      )}

      {/* Messages Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-3.5 space-y-2.5 bg-[#161616]">
        {messages.map((m) => {
          if (m.time) {
            return (
              <div
                key={m.id}
                className="text-center text-[10.5px] text-white/40 font-medium py-0.5"
              >
                {m.time}
              </div>
            )
          }

          if (m.sender === "bot") {
            return (
              <div key={m.id} className="flex items-end gap-2 max-w-[85%]">
                <div className="flex size-6 items-center justify-center rounded-full bg-white/10 border border-white/15 text-[#ff4b72] shrink-0 mb-0.5 text-xs">
                  🤖
                </div>
                <div className="bg-[#282828] text-[#f3f4f6] border border-white/5 px-3 py-2 rounded-[16px] rounded-tl-[4px] text-[13px] leading-[1.45] shadow-xs break-words">
                  {m.text}
                </div>
              </div>
            )
          }

          return (
            <div key={m.id} className="flex flex-col items-end">
              {m.isLike ? (
                <div className="text-[#ff4b72] p-1 animate-scale-up text-3xl">
                  ❤️
                </div>
              ) : (
                <div className="max-w-[82%] px-3.5 py-2 rounded-[16px] rounded-tr-[4px] bg-gradient-to-r from-[#ff4b72] to-[#e63956] text-white text-[13px] leading-[1.45] shadow-sm break-words">
                  {m.text}
                </div>
              )}
              {m.status && (
                <span className="text-[9.5px] text-white/40 mt-0.5 pr-1 font-normal">
                  {m.status}
                </span>
              )}
            </div>
          )
        })}

        {isTyping && (
          <div className="flex items-end gap-2 max-w-[80px]">
            <div className="flex size-6 items-center justify-center rounded-full bg-white/10 border border-white/15 text-[#ff4b72] shrink-0 mb-0.5 text-xs">
              🤖
            </div>
            <div className="flex items-center gap-1 px-2.5 py-2 rounded-[16px] bg-[#282828] border border-white/5">
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

      {/* Footer Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSend()
        }}
        className="flex items-center gap-1.5 px-3 py-2 bg-[#1e1e1e] border-t border-white/10"
      >
        <div className="flex-1 flex items-center bg-[#282828] border border-white/5 rounded-full px-3.5 py-1.5 focus-within:ring-1 focus-within:ring-[#ff4b72]/60 transition-all">
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            placeholder="Hỏi về món ăn, địa điểm..."
            className="w-full bg-transparent text-[13px] text-white placeholder:text-white/40 focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setInputVal((prev) => prev + " ❤️")}
            title="Chèn biểu tượng tim"
            className="text-white/40 hover:text-[#ff4b72] transition-colors shrink-0 ml-1.5 cursor-pointer text-sm"
          >
            ❤️
          </button>
        </div>

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
            className="flex size-8 items-center justify-center rounded-full text-[#ff4b72] hover:bg-white/10 hover:scale-110 active:scale-95 transition-all cursor-pointer shrink-0 text-xl"
          >
            ❤️
          </button>
        )}
      </form>
    </div>
  )
}
