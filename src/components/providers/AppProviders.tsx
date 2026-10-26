"use client"

import type { ReactNode } from "react"
import { AuthProvider } from "@/contexts/AuthContext"
import { FavoritesProvider } from "@/contexts/FavoritesContext"
import AuthModal from "@/components/auth/AuthModal"
import AuthToast from "@/components/auth/AuthToast"

export default function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <FavoritesProvider>
        {children}
        <AuthModal />
        <AuthToast />
      </FavoritesProvider>
    </AuthProvider>
  )
}
