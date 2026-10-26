"use client"
// Switch to waiting verification view in the modal
// Auto-login already occurred in AuthContext
/* Dark backdrop */ /* Modal Dialog Card */ /* Close Button */ /* Brand Header */ /* VIEW 1: Awaiting Verification Screen */ /* Error / Success Feedback in Verification Screen */ /* Action CTAs */
/* VIEW 2: Standard Login / Register Form */ /* Tab Switcher */ /* Error Alerts */ /* Success Alerts */ /* Form */ /* Footer Switch Prompt */
import { useState } from "react"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalTab,
    openAuthModal,
    signIn,
    signUp,
    resendVerificationEmail,
  } = useAuth()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isEmailUnconfirmed, setIsEmailUnconfirmed] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [isAwaitingVerification, setIsAwaitingVerification] = useState(false)
  const [registeredEmail, setRegisteredEmail] = useState("")

  if (!isAuthModalOpen) return null

  const isLogin = authModalTab === "login"

  const handleResendEmail = async () => {
    const targetEmail = registeredEmail || email
    if (!targetEmail.trim()) {
      setErrorMsg("Vui lòng nhập địa chỉ email để gửi lại.")
      return
    }
    setIsResending(true)
    setErrorMsg("")
    const { error } = await resendVerificationEmail(targetEmail.trim())
    if (error) {
      setErrorMsg("Không thể gửi lại email: " + error.message)
    } else {
      setSuccessMsg(
        `Đã gửi lại email kích hoạt đến ${targetEmail.trim()}! Vui lòng kiểm tra Hộp thư đến (kể cả mục Thư rác / Spam).`,
      )
    }
    setIsResending(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")
    setIsEmailUnconfirmed(false)
    setIsSubmitting(true)

    if (!email.trim() || !password.trim()) {
      setErrorMsg("Vui lòng nhập đầy đủ email và mật khẩu.")
      setIsSubmitting(false)
      return
    }

    if (!isLogin && !displayName.trim()) {
      setErrorMsg("Vui lòng nhập tên hiển thị của bạn.")
      setIsSubmitting(false)
      return
    }

    if (password.length < 6) {
      setErrorMsg("Mật khẩu phải chứa ít nhất 6 ký tự.")
      setIsSubmitting(false)
      return
    }

    if (isLogin) {
      const { error } = await signIn(email.trim(), password)
      if (error) {
        const msg = error.message.toLowerCase()
        if (msg.includes("email not confirmed")) {
          setIsEmailUnconfirmed(true)
          setErrorMsg(
            "Tài khoản chưa được kích hoạt email. Vui lòng mở hộp thư và nhấn vào liên kết xác nhận để tiếp tục.",
          )
        } else if (msg.includes("invalid login credentials")) {
          setErrorMsg(
            "Email hoặc mật khẩu không chính xác. Vui lòng kiểm tra lại.",
          )
        } else {
          setErrorMsg(error.message)
        }
      } else {
        setEmail("")
        setPassword("")
      }
    } else {
      const result = await signUp(email.trim(), password, displayName.trim())
      if (result.error) {
        if (result.error.message.includes("User already registered")) {
          setErrorMsg(
            "Email này đã được đăng ký tài khoản. Bạn có thể chuyển sang tab Đăng nhập ngay.",
          )
        } else {
          setErrorMsg(result.error.message)
        }
      } else {
        if (result.needsEmailVerification) {
          setRegisteredEmail(email.trim())
          setIsAwaitingVerification(true)
          setEmail(email.trim())
          setPassword("")
          setDisplayName("")
        } else {
          setEmail("")
          setPassword("")
          setDisplayName("")
        }
      }
    }

    setIsSubmitting(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {}
      <div
        className="fixed inset-0 bg-[#1E293B]/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={closeAuthModal}
        aria-hidden="true"
      />

      {}
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-3xl border-2 border-[#1E293B] bg-white p-6 sm:p-8 shadow-[6px_6px_0px_#1E293B] animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        {}
        <button
          type="button"
          onClick={closeAuthModal}
          className="absolute top-4 right-4 flex size-8 items-center justify-center rounded-full border-2 border-[#1E293B] bg-[#FFF5EF] text-sm font-black text-[#1E293B] shadow-[2px_2px_0px_#1E293B] hover:bg-[#FF5376] hover:text-white transition-all cursor-pointer"
          aria-label="Đóng cửa sổ"
        >
          ✕
        </button>

        {}
        <div className="flex flex-col items-center text-center mb-4">
          <Image
            src="/img/logo.png"
            alt="HYUN"
            width={120}
            height={40}
            className="h-10 w-auto object-contain mb-1"
          />
        </div>

        {}
        {isAwaitingVerification ? (
          <div className="text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="mx-auto flex size-16 items-center justify-center rounded-3xl border-2 border-[#1E293B] bg-[#FFF0ED] text-3xl shadow-[3px_3px_0px_#1E293B]">
              📩
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-black text-[#1E293B]">
                Kiểm Tra Hộp Thư Email!
              </h2>
              <p className="mt-1 text-xs text-slate-600 font-medium leading-relaxed">
                Hệ thống vừa gửi liên kết kích hoạt tài khoản tới:
              </p>
            </div>

            <div className="rounded-2xl border-2 border-[#1E293B] bg-[#FFF8F5] p-3 text-xs sm:text-sm font-black text-[#FF5376] shadow-[2px_2px_0px_#1E293B] break-all">
              {registeredEmail}
            </div>

            <div className="rounded-2xl border-2 border-[#1E293B] bg-white p-4 text-left space-y-2.5 shadow-[2px_2px_0px_#1E293B]">
              <p className="text-xs font-black text-[#1E293B] uppercase tracking-wider">
                Hướng dẫn xác thực tài khoản:
              </p>
              <div className="space-y-2 text-xs font-semibold text-slate-700">
                <div className="flex items-start gap-2">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#FF5376] text-white text-[10px] font-black">
                    1
                  </span>
                  <span>
                    Mở hòm thư <strong>Gmail</strong> hoặc ứng dụng email của
                    bạn.
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#FF5376] text-white text-[10px] font-black">
                    2
                  </span>
                  <span>
                    Tìm thư có tiêu đề{" "}
                    <strong className="text-[#1E293B] bg-[#FFF0ED] px-1 py-0.5 rounded border border-[#1E293B]">
                      Confirm your email address
                    </strong>
                    <br />
                    <span className="text-[11px] text-slate-500 font-normal">
                      *(Nếu không thấy trong Hộp thư đến, vui lòng kiểm tra thư
                      mục <strong>Spam / Thư rác</strong> hoặc tab{" "}
                      <strong>Quảng cáo</strong>)*
                    </span>
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#FF5376] text-white text-[10px] font-black">
                    3
                  </span>
                  <span>
                    Nhấn vào nút / liên kết{" "}
                    <strong className="text-[#FF5376]">
                      Confirm email address
                    </strong>{" "}
                    để hoàn tất kích hoạt.
                  </span>
                </div>
              </div>
            </div>

            {}
            {errorMsg && (
              <div className="rounded-xl border-2 border-[#1E293B] bg-rose-50 p-3 text-xs font-bold text-rose-700 shadow-[2px_2px_0px_#1E293B] text-left">
                ⚠️ {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="rounded-xl border-2 border-[#1E293B] bg-emerald-50 p-3 text-xs font-bold text-emerald-800 shadow-[2px_2px_0px_#1E293B] text-left">
                ✅ {successMsg}
              </div>
            )}

            {}
            <div className="space-y-2.5 pt-1">
              <a
                href="https://mail.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-[#1E293B] bg-[#FF5376] py-3 text-xs sm:text-sm font-black text-white shadow-[3px_3px_0px_#1E293B] hover:bg-[#ff3b65] transition-all cursor-pointer"
              >
                <span>Mở Hộp Thư Gmail Ngay</span>
                <span>➔</span>
              </a>

              <button
                type="button"
                onClick={handleResendEmail}
                disabled={isResending}
                className="flex w-full items-center justify-center gap-1.5 rounded-2xl border-2 border-[#1E293B] bg-white py-2.5 text-xs font-black text-[#1E293B] shadow-[2px_2px_0px_#1E293B] hover:bg-[#FFF5EF] transition-all disabled:opacity-50 cursor-pointer"
              >
                <span>🔄</span>
                <span>
                  {isResending ? "Đang gửi lại..." : "Gửi lại email xác thực"}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsAwaitingVerification(false)
                  openAuthModal("login")
                  setErrorMsg("")
                  setSuccessMsg("")
                }}
                className="text-xs font-black text-slate-500 hover:text-[#FF5376] transition-colors underline pt-2 block mx-auto cursor-pointer"
              >
                Đã bấm xác nhận trong email? Bấm vào đây để Đăng nhập
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="text-center mb-4">
              <h2 className="text-xl sm:text-2xl font-black text-[#1E293B]">
                {isLogin ? "Chào Mừng Trở Lại!" : "Tạo Tài Khoản Mới"}
              </h2>
              <p className="mt-1 text-xs text-slate-500 font-medium">
                {isLogin
                  ? "Đăng nhập để lưu địa điểm yêu thích và lịch hẹn ẩm thực"
                  : "Gia nhập cộng đồng sành ăn và khám phá ẩm thực 3 miền"}
              </p>
            </div>

            {}
            <div className="grid grid-cols-2 gap-2 p-1 mb-4 rounded-2xl border-2 border-[#1E293B] bg-[#FFF8F5]">
              <button
                type="button"
                onClick={() => {
                  openAuthModal("login")
                  setErrorMsg("")
                  setSuccessMsg("")
                  setIsEmailUnconfirmed(false)
                }}
                className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  isLogin
                    ? "bg-[#FF5376] text-white border-2 border-[#1E293B] shadow-[2px_2px_0px_#1E293B]"
                    : "text-slate-600 hover:text-[#1E293B]"
                }`}
              >
                Đăng nhập
              </button>
              <button
                type="button"
                onClick={() => {
                  openAuthModal("register")
                  setErrorMsg("")
                  setSuccessMsg("")
                  setIsEmailUnconfirmed(false)
                }}
                className={`py-2 text-xs font-black rounded-xl transition-all cursor-pointer ${
                  !isLogin
                    ? "bg-[#FF5376] text-white border-2 border-[#1E293B] shadow-[2px_2px_0px_#1E293B]"
                    : "text-slate-600 hover:text-[#1E293B]"
                }`}
              >
                Đăng ký
              </button>
            </div>

            {}
            {isEmailUnconfirmed ? (
              <div className="mb-4 rounded-2xl border-2 border-[#1E293B] bg-[#FFF0ED] p-3.5 text-xs font-bold text-[#1E293B] shadow-[2px_2px_0px_#1E293B]">
                <div className="flex items-center gap-1.5 text-rose-600 font-black text-sm mb-1">
                  <span>⚠️</span>
                  <span>Tài khoản chưa được kích hoạt email</span>
                </div>
                <p className="text-slate-600 font-semibold mb-2 leading-relaxed">
                  Email <strong className="text-[#FF5376]">{email}</strong> đã
                  đăng ký nhưng chưa nhấn vào link xác nhận. Vui lòng kiểm tra
                  hộp thư đến (hoặc mục Spam).
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <a
                    href="https://mail.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-xl border-2 border-[#1E293B] bg-white px-3 py-1.5 text-xs font-black shadow-[2px_2px_0px_#1E293B] hover:bg-[#FFF5EF] transition-all cursor-pointer"
                  >
                    <span>Mở Gmail</span>
                    <span>➔</span>
                  </a>
                  <button
                    type="button"
                    onClick={handleResendEmail}
                    disabled={isResending}
                    className="inline-flex items-center gap-1 rounded-xl border-2 border-[#1E293B] bg-[#FF5376] px-3 py-1.5 text-xs font-black text-white shadow-[2px_2px_0px_#1E293B] hover:bg-[#ff3b65] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    <span>🔄</span>
                    <span>
                      {isResending ? "Đang gửi..." : "Gửi lại email xác nhận"}
                    </span>
                  </button>
                </div>
              </div>
            ) : errorMsg ? (
              <div className="mb-4 rounded-xl border-2 border-[#1E293B] bg-rose-50 p-3 text-xs font-bold text-rose-700 shadow-[2px_2px_0px_#1E293B]">
                <p>⚠️ {errorMsg}</p>
              </div>
            ) : null}

            {}
            {successMsg && (
              <div className="mb-4 rounded-xl border-2 border-[#1E293B] bg-emerald-50 p-3 text-xs font-bold text-emerald-800 shadow-[2px_2px_0px_#1E293B]">
                ✅ {successMsg}
              </div>
            )}

            {}
            <form onSubmit={handleSubmit} className="space-y-3.5">
              {!isLogin && (
                <div>
                  <label className="block text-xs font-black text-[#1E293B] mb-1">
                    Tên hiển thị
                  </label>
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ví dụ: Hoàng Nam Foodie"
                    className="w-full rounded-2xl border-2 border-[#1E293B] bg-[#FFFDFC] px-4 py-2.5 text-xs font-bold text-[#1E293B] shadow-[2px_2px_0px_#1E293B] focus:border-[#FF5376] focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-black text-[#1E293B] mb-1">
                  Địa chỉ Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tenban@example.com"
                  required
                  className="w-full rounded-2xl border-2 border-[#1E293B] bg-[#FFFDFC] px-4 py-2.5 text-xs font-bold text-[#1E293B] shadow-[2px_2px_0px_#1E293B] focus:border-[#FF5376] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-[#1E293B] mb-1">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Tối thiểu 6 ký tự"
                  required
                  className="w-full rounded-2xl border-2 border-[#1E293B] bg-[#FFFDFC] px-4 py-2.5 text-xs font-bold text-[#1E293B] shadow-[2px_2px_0px_#1E293B] focus:border-[#FF5376] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full rounded-2xl border-2 border-[#1E293B] bg-[#FF5376] py-3 text-sm font-black text-white shadow-[3px_3px_0px_#1E293B] transition-all hover:bg-[#ff3b65] hover:shadow-[4px_4px_0px_#1E293B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting
                  ? "Đang xử lý..."
                  : isLogin
                    ? "Đăng Nhập Ngay ➔"
                    : "Tạo Tài Khoản ➔"}
              </button>
            </form>

            {}
            <div className="mt-4 text-center text-xs font-bold text-slate-500">
              {isLogin ? (
                <span>
                  Chưa có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      openAuthModal("register")
                      setErrorMsg("")
                      setSuccessMsg("")
                      setIsEmailUnconfirmed(false)
                    }}
                    className="font-black text-[#FF5376] hover:underline cursor-pointer"
                  >
                    Đăng ký miễn phí
                  </button>
                </span>
              ) : (
                <span>
                  Đã có tài khoản?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      openAuthModal("login")
                      setErrorMsg("")
                      setSuccessMsg("")
                      setIsEmailUnconfirmed(false)
                    }}
                    className="font-black text-[#FF5376] hover:underline cursor-pointer"
                  >
                    Đăng nhập tại đây
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
