"use client"

import { useEffect } from "react"

export default function PwaRegister() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return
    }

    const registerSW = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
        })

        registration.addEventListener("updatefound", () => {
          const installingWorker = registration.installing
          if (installingWorker) {
            installingWorker.addEventListener("statechange", () => {
              if (
                installingWorker.state === "installed" &&
                navigator.serviceWorker.controller
              ) {
                console.log("[HYUN PWA] Nội dung mới đã được cập nhật.")
              }
            })
          }
        })
      } catch (err) {
        console.warn("[HYUN PWA] Service Worker đăng ký thất bại:", err)
      }
    }

    if (document.readyState === "complete") {
      registerSW()
    } else {
      window.addEventListener("load", registerSW, { once: true })
    }
  }, [])

  return null
}
