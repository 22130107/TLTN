"use client"

import { useState, useEffect } from "react"

interface HeartParticle {
  id: number
  x: number // percentage
  size: number
  duration: number
  emoji: string
}

interface HeartAnimationOverlayProps {
  triggerTimestamp: number | null
}

const HEART_EMOJIS = ["❤️", "💖", "💕", "💓", "💗", "💘"]

export default function HeartAnimationOverlay({ triggerTimestamp }: HeartAnimationOverlayProps) {
  const [particles, setParticles] = useState<HeartParticle[]>([])

  useEffect(() => {
    if (!triggerTimestamp) return

    // Generate 12-16 animated hearts
    const newParticles: HeartParticle[] = Array.from({ length: 14 }).map((_, i) => ({
      id: Date.now() + i,
      x: 15 + Math.random() * 70, // Keep in center 70% of screen
      size: 24 + Math.random() * 28,
      duration: 1.5 + Math.random() * 1.2,
      emoji: HEART_EMOJIS[Math.floor(Math.random() * HEART_EMOJIS.length)],
    }))

    setParticles((prev) => [...prev, ...newParticles])

    const timer = setTimeout(() => {
      setParticles([])
    }, 3000)

    return () => clearTimeout(timer)
  }, [triggerTimestamp])

  if (particles.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute animate-float-heart select-none"
          style={{
            left: `${p.x}%`,
            bottom: "10%",
            fontSize: `${p.size}px`,
            animationDuration: `${p.duration}s`,
          }}
        >
          {p.emoji}
        </span>
      ))}
      <style jsx>{`
        @keyframes floatUp {
          0% {
            transform: translateY(0) scale(0.6);
            opacity: 1;
          }
          50% {
            transform: translateY(-200px) scale(1.2);
            opacity: 0.9;
          }
          100% {
            transform: translateY(-500px) scale(0.9);
            opacity: 0;
          }
        }
        .animate-float-heart {
          animation: floatUp ease-out forwards;
        }
      `}</style>
    </div>
  )
}
