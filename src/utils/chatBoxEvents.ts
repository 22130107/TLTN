"use client"

export function openChatBox(tab: "couple" | "bot" = "couple") {
  if (typeof window !== "undefined") {
    window.dispatchEvent(
      new CustomEvent("open-chatbox", {
        detail: { tab },
      })
    )
  }
}
