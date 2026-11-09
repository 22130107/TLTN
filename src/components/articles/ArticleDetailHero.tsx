"use client" /* Breadcrumb Navigation */ /* Category & Read Time Tags */ /* Main Title */ /* Lead Excerpt */ /* Author & Social Interactions Row */ /* Author info */ /* Action Buttons: Like & Share */
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import type { Article } from "@/types/article"

interface ArticleDetailHeroProps {
  article: Article
}

export default function ArticleDetailHero({ article }: ArticleDetailHeroProps) {
  const [likes, setLikes] = useState(article.likes)
  const [hasLiked, setHasLiked] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1)
      setHasLiked(false)
    } else {
      setLikes(likes + 1)
      setHasLiked(true)
    }
  }

  const handleShare = async () => {
    try {
      if (typeof window !== "undefined") {
        await navigator.clipboard.writeText(window.location.href)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
      }
    } catch {}
  }

  return (
    <div className="w-full mb-8">
      {}
      <nav
        aria-label="Breadcrumb"
        className="mb-5 flex items-center gap-2 text-xs font-bold text-slate-600"
      >
        <Link href="/" className="hover:text-[#FF5376] transition-colors">
          Trang chủ
        </Link>
        <span>/</span>
        <Link
          href="/articles"
          className="hover:text-[#FF5376] transition-colors"
        >
          Bài viết
        </Link>
        <span>/</span>
        <span className="text-[#1E293B] font-extrabold line-clamp-1 max-w-[200px] sm:max-w-md">
          {article.title}
        </span>
      </nav>

      {}
      <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
        <span className="rounded-full border-2 border-[#1E293B] bg-[#FF5376] px-3.5 py-1 text-xs font-black text-white shadow-[2px_2px_0px_#1E293B]">
          {article.categoryLabel}
        </span>
        <span className="rounded-full border-2 border-[#1E293B] bg-white px-3 py-1 text-xs font-extrabold text-[#1E293B] shadow-[2px_2px_0px_#1E293B]">
          ⏱ {article.readTime}
        </span>
        <span className="rounded-full border-2 border-[#1E293B] bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-900 shadow-[2px_2px_0px_#1E293B]">
          📅 {article.publishedAt}
        </span>
      </div>

      {}
      <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black text-[#1E293B] tracking-tight leading-tight">
        {article.title}
      </h1>

      {}
      <p className="mt-4 text-sm sm:text-base lg:text-lg font-medium text-slate-700 leading-relaxed max-w-4xl">
        {article.excerpt}
      </p>

      {}
      <div className="mt-6 pt-5 border-t-2 border-[#1E293B]/10 flex flex-wrap items-center justify-between gap-4">
        {}
        <div className="flex items-center gap-3">
          <div className="relative size-11 overflow-hidden rounded-full border-2 border-[#1E293B] shadow-[1px_1px_0px_#1E293B]">
            <Image
              src={article.author.avatar}
              alt={article.author.name}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black text-[#1E293B]">
                {article.author.name}
              </span>
              <span className="rounded-md bg-[#FFF0ED] border border-[#1E293B]/20 px-2 py-0.2 text-[10px] font-bold text-[#FF5376]">
                Tác giả
              </span>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {article.author.role} • {article.views.toLocaleString()} lượt đọc
            </span>
          </div>
        </div>

        {}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleLike}
            className={`flex items-center gap-1.5 rounded-2xl border-2 border-[#1E293B] px-3.5 py-2 text-xs font-black shadow-[2px_2px_0px_#1E293B] transition-all hover:-translate-y-0.5 active:translate-y-0 active:shadow-none ${
              hasLiked
                ? "bg-rose-50 text-rose-600 border-[#FF5376]"
                : "bg-white text-[#1E293B] hover:text-[#FF5376]"
            }`}
          >
            <span>{hasLiked ? "❤️" : "🤍"}</span>
            <span>{likes}</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="flex items-center gap-1.5 rounded-2xl border-2 border-[#1E293B] bg-white px-3.5 py-2 text-xs font-black text-[#1E293B] shadow-[2px_2px_0px_#1E293B] transition-all hover:bg-[#FFF5EF] hover:text-[#FF5376] hover:-translate-y-0.5 active:translate-y-0 active:shadow-none"
          >
            <span>🔗</span>
            <span>{copied ? "Đã chép link!" : "Chia sẻ"}</span>
          </button>
        </div>
      </div>
    </div>
  )
}
