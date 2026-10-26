"use client"

// 1. Initial session & Auth Redirect detection (for email confirmation link)

// Detect if user landed via email confirmation link

// Check success confirmation token callback

// 2. Real-time auth state listener
// Also ensure profile row is created
// Auto-confirm was ON: session exists, log in directly
// Email confirmation is REQUIRED: do NOT close the modal!
// Surface prominent notification on the frontend

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react"
import type { User, Session } from "@supabase/supabase-js"
import { supabase } from "@/lib/supabase/client"
import type { ProfileRow } from "@/lib/supabase/types"

export interface AuthNotification {
  id: string
  type: "success" | "info" | "warning" | "error"
  title: string
  message: string
  actionLabel?: string
  actionUrl?: string
}

interface SignUpResult {
  error: Error | null
  needsEmailVerification?: boolean
}

interface AuthContextType {
  user: User | null
  session: Session | null
  profile: ProfileRow | null
  isLoading: boolean
  isAuthModalOpen: boolean
  authModalTab: "login" | "register"
  notification: AuthNotification | null
  openAuthModal: (tab?: "login" | "register") => void
  closeAuthModal: () => void
  showNotification: (notif: Omit<AuthNotification, "id">) => void
  dismissNotification: () => void
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signUp: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<SignUpResult>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  resendVerificationEmail: (email: string) => Promise<{ error: Error | null }>
  updateProfile: (
    data: Partial<Pick<ProfileRow, "display_name" | "bio" | "phone" | "avatar_url" | "location_name" | "latitude" | "longitude">>,
  ) => Promise<{ error: Error | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<ProfileRow | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">(
    "login",
  )
  const [notification, setNotification] = useState<AuthNotification | null>(
    null,
  )

  const showNotification = useCallback(
    (notif: Omit<AuthNotification, "id">) => {
      setNotification({
        ...notif,
        id: Date.now().toString(),
      })
    },
    [],
  )

  const dismissNotification = useCallback(() => {
    setNotification(null)
  }, [])

  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single()

      if (!error && data) {
        setProfile(data as ProfileRow)
      }
    } catch {}
  }, [])
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      setIsLoading(false)
    })
    if (typeof window !== "undefined") {
      const hash = window.location.hash
      const search = window.location.search
      if (hash.includes("type=signup") || search.includes("type=signup")) {
        showNotification({
          type: "success",
          title: "Xác thực email thành công! 🎉",
          message:
            "Tài khoản của bạn đã được kích hoạt thành công. Chúc bạn có những phút giây khám phá ẩm thực tuyệt vời tại HYUN!",
        })
        try {
          window.history.replaceState(null, "", window.location.pathname)
        } catch {}
      } else if (
        hash.includes("error_description=") ||
        search.includes("error_description=")
      ) {
        const rawParams = hash.replace("#", "") || search.replace("?", "")
        const params = new URLSearchParams(rawParams)
        const desc =
          params.get("error_description") ||
          "Liên kết xác thực không hợp lệ hoặc đã hết hạn."
        showNotification({
          type: "error",
          title: "Xác thực không thành công",
          message: decodeURIComponent(desc).replace(/\+/g, " "),
          actionLabel: "Đăng nhập lại",
          actionUrl: "/",
        })
        try {
          window.history.replaceState(null, "", window.location.pathname)
        } catch {}
      }
    }
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        await fetchProfile(session.user.id)
        if (event === "SIGNED_IN") {
          setIsAuthModalOpen(false)
        }
      } else {
        setProfile(null)
      }
      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [fetchProfile, showNotification])

  const openAuthModal = (tab: "login" | "register" = "login") => {
    setAuthModalTab(tab)
    setIsAuthModalOpen(true)
  }

  const closeAuthModal = () => {
    setIsAuthModalOpen(false)
  }

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) return { error }
      if (data.user) {
        await fetchProfile(data.user.id)
        setIsAuthModalOpen(false)
        showNotification({
          type: "success",
          title: "Đăng nhập thành công!",
          message: "Chào mừng bạn đã trở lại với HYUN.",
        })
      }
      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }

  const signUp = async (
    email: string,
    password: string,
    displayName: string,
  ): Promise<SignUpResult> => {
    try {
      const redirectUrl =
        typeof window !== "undefined" ? window.location.origin : undefined

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            display_name: displayName,
          },
          emailRedirectTo: redirectUrl,
        },
      })
      if (error) return { error }

      if (data.user) {
        const newProfile = {
          id: data.user.id,
          display_name: displayName,
          email,
          avatar_url: "/img/profile-avatar.png",
        }
        try {
          await supabase.from("profiles").upsert(newProfile as never)
        } catch {}

        if (data.session) {
          await fetchProfile(data.user.id)
          setIsAuthModalOpen(false)
          showNotification({
            type: "success",
            title: "Đăng ký thành công! 🎉",
            message: `Chào mừng ${displayName} đã gia nhập cộng đồng HYUN!`,
          })
          return { error: null, needsEmailVerification: false }
        } else {
          showNotification({
            type: "info",
            title: "Đăng ký thành công! 📩",
            message: `Chúng tôi đã gửi link kích hoạt đến ${email}. Hãy kiểm tra hòm thư của bạn!`,
            actionLabel: "Mở Gmail",
            actionUrl: "https://mail.google.com",
          })
          return { error: null, needsEmailVerification: true }
        }
      }
      return { error: null, needsEmailVerification: true }
    } catch (err) {
      return { error: err as Error }
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
    setSession(null)
    setProfile(null)
    showNotification({
      type: "info",
      title: "Đã đăng xuất",
      message: "Hẹn gặp lại bạn lần sau!",
    })
  }

  const refreshProfile = async () => {
    if (user) {
      await fetchProfile(user.id)
    }
  }

  const resendVerificationEmail = async (email: string) => {
    try {
      const redirectUrl =
        typeof window !== "undefined" ? window.location.origin : undefined
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
        options: {
          emailRedirectTo: redirectUrl,
        },
      })
      return { error }
    } catch (err) {
      return { error: err as Error }
    }
  }

  const updateProfile = async (
    updateData: Partial<Pick<ProfileRow, "display_name" | "bio" | "phone" | "avatar_url" | "location_name" | "latitude" | "longitude">>,
  ) => {
    if (!user) return { error: new Error("Chưa đăng nhập") }
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          ...updateData,
          updated_at: new Date().toISOString(),
        } as never)
        .eq("id", user.id)

      if (error) return { error }
      await fetchProfile(user.id)
      showNotification({
        type: "success",
        title: "Cập nhật thành công!",
        message: "Thông tin hồ sơ cá nhân của bạn đã được lưu.",
      })
      return { error: null }
    } catch (err) {
      return { error: err as Error }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        isAuthModalOpen,
        authModalTab,
        notification,
        openAuthModal,
        closeAuthModal,
        showNotification,
        dismissNotification,
        signIn,
        signUp,
        signOut,
        refreshProfile,
        resendVerificationEmail,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
