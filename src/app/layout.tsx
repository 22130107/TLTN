import type { Metadata, Viewport } from "next"
import PwaRegister from "@/components/pwa/PwaRegister"
import ChatBoxWrapper from "@/components/chat/ChatBoxWrapper"
import AppProviders from "@/components/providers/AppProviders"
import "./globals.css"

export const metadata: Metadata = {
  title: "HYUN - Điểm Hẹn Ẩm Thực Chuẩn Gu | Món Ngon 3 Miền",
  description:
    "Khám phá những quán ăn ngon, điểm hẹn chuẩn gu và ẩm thực đặc sắc tại Hà Nội, Sài Gòn, Đà Lạt, Đà Nẵng cùng HYUN.",
  applicationName: "HYUN",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "HYUN",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/icons/apple-touch-icon.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: "#000000",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className="antialiased min-h-screen selection:bg-black selection:text-white">
        <AppProviders>
          <PwaRegister />
          {children}
          <ChatBoxWrapper />
        </AppProviders>
      </body>
    </html>
  )
}
