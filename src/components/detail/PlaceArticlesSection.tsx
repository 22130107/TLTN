"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import Link from "next/link"
import type { PlaceDetailModel } from "@/types/placeDetail"
import type { Article } from "@/types/article"
import { getArticlesByPlaceId } from "@/services/articlesService"
import CreatePlaceArticleModal from "./CreatePlaceArticleModal"

export interface PlaceArticlesSectionProps {
  place: PlaceDetailModel
}

interface ToastNotification {
  title: string
  message: string
  articleSlugOrId?: string
}

function formatDate(dateStr?: string): string {
  if (!dateStr) return ""
  if (dateStr.includes("/") || dateStr.includes(" ")) return dateStr
  try {
    const d = new Date(dateStr)
    if (isNaN(d.getTime())) return dateStr
    return d.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
  } catch {
    return dateStr
  }
}

function getCategoryLabel(article: Article): string {
  if (article.categoryLabel) return article.categoryLabel
  switch (article.category) {
    case "review":
      return "Review Quán"
    case "couple":
      return "Hẹn hò & Tụ họp"
    case "culture":
      return "Món ngon & Hương vị"
    case "guide":
      return "Cẩm nang ăn uống"
    default:
      return "Bài viết"
  }
}

export default function PlaceArticlesSection({
  place,
}: PlaceArticlesSectionProps) {
  const [articles, setArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [toast, setToast] = useState<ToastNotification | null>(null)
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({})

  // Fetch articles on mount or place ID change
  useEffect(() => {
    let isMounted = true
    setIsLoading(true)

    getArticlesByPlaceId(place.id)
      .then((data) => {
        if (isMounted) {
          setArticles(data)
          setIsLoading(false)
        }
      })
      .catch((err) => {
        console.error("[PlaceArticlesSection] Failed to load articles:", err)
        if (isMounted) {
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [place.id])

  // Handle auto-dismiss toast after 4s
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => {
      setToast(null)
    }, 4000)
    return () => clearTimeout(timer)
  }, [toast])

  // Handle article creation callback from modal
  const handleArticleCreated = useCallback(
    (newArticle: Article) => {
      setArticles((prev) => [
        newArticle,
        ...prev.filter((a) => a.id !== newArticle.id),
      ])
      setIsModalOpen(false)
      setToast({
        title: "Đã xuất bản bài viết thành công! 🎉",
        message: `Bài viết "${newArticle.title}" đã được chia sẻ và ghim vào trang của ${place.name}.`,
        articleSlugOrId: newArticle.slug || newArticle.id,
      })
    },
    [place.name],
  )

  const handleImageError = (articleId: string) => {
    setFailedImages((prev) => ({ ...prev, [articleId]: true }))
  }

  return (
    <section
      aria-label="Bài viết và góc trải nghiệm"
      className="relative rounded-2xl border border-[#1E293B] bg-white p-5 sm:p-7 shadow-[2px_2px_0px_#1E293B]"
    >
      {/* 1. Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-5 border-b border-[#1E293B]/10">
        <div className="flex items-center gap-3">
          <span className="flex size-9 sm:size-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 border border-[#1E293B] text-base sm:text-lg shadow-[1.5px_1.5px_0px_#1E293B]">
            📝
          </span>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black text-[#1E293B]">
                Bài Viết & Góc Trải Nghiệm
              </h2>
              <span className="inline-flex items-center justify-center rounded-full bg-[#FF5376] border border-[#1E293B] px-2.5 py-0.5 text-xs font-black text-white shadow-[1px_1px_0px_#1E293B]">
                {isLoading ? "..." : articles.length}
              </span>
            </div>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Review thực tế, gợi ý món ngon và trải nghiệm từ cộng đồng
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto flex-wrap">
          {/* Average rating badge */}
          <div className="flex items-center gap-1.5 font-black text-[#1E293B] text-xs sm:text-sm bg-amber-50 border border-[#1E293B] px-3 py-1.5 rounded-full shadow-[1.5px_1.5px_0px_#1E293B]">
            <span className="text-amber-500">★</span>
            <span>
              {typeof place.rating === "number"
                ? place.rating.toFixed(1)
                : "0.0"}
            </span>
            <span className="text-[11px] font-semibold text-slate-500">
              / 5.0
            </span>
          </div>

          {/* Primary Action Button */}
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-[#E55067] text-white font-bold border border-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B] hover:shadow-[2px_2px_0px_#1E293B] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 rounded-full px-4 py-2 text-xs sm:text-sm cursor-pointer transition-all flex items-center gap-1.5 shrink-0"
          >
            <span>+</span>
            <span>Viết bài chia sẻ về quán</span>
          </button>
        </div>
      </div>

      {/* 2. Loading State */}
      {isLoading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-44 rounded-2xl border-2 border-[#1E293B]/20 bg-slate-100" />
          <div className="h-44 rounded-2xl border-2 border-[#1E293B]/20 bg-slate-100" />
        </div>
      )}

      {/* 3. Empty State */}
      {!isLoading && articles.length === 0 && (
        <div className="rounded-xl border border-dashed border-[#1E293B]/40 bg-white p-8 sm:p-10 text-center flex flex-col items-center justify-center">
          <div className="flex size-14 items-center justify-center rounded-xl bg-amber-50 border border-[#1E293B] text-3xl shadow-[2px_2px_0px_#1E293B] mb-4">
            🍜
          </div>
          <h3 className="text-base sm:text-lg font-black text-[#1E293B] mb-2">
            Chưa có bài viết trải nghiệm nào về {place.name}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed font-medium">
            Hãy là thực khách đầu tiên chia sẻ góc nhìn ẩm thực, món ngon nên thử
            và không gian quán đến cộng đồng!
          </p>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-[#E55067] text-white font-bold border border-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B] hover:shadow-[2px_2px_0px_#1E293B] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 rounded-full px-5 py-2.5 text-xs sm:text-sm cursor-pointer transition-all flex items-center gap-2"
          >
            <span>+</span>
            <span>Viết bài chia sẻ đầu tiên</span>
          </button>
        </div>
      )}

      {/* 4. Article Feed / Cards Grid */}
      {!isLoading && articles.length > 0 && (
        <div className="space-y-4 sm:space-y-5">
          {articles.map((article) => {
            const articleUrl = `/articles/${article.slug || article.id}`
            const hasCustomImage =
              Boolean(article.coverImage) && !failedImages[article.id]
            const displayImage = hasCustomImage
              ? article.coverImage
              : place.image || "/img/decoratediscover.png"
            const isUnoptimized =
              displayImage.startsWith("http") ||
              displayImage.startsWith("data:")

            return (
              <article
                key={article.id}
                className="group border border-[#1E293B] rounded-xl bg-[#FAF8F5] p-4 sm:p-5 shadow-[2px_2px_0px_#1E293B] hover:shadow-[3px_3px_0px_#1E293B] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all flex flex-col sm:flex-row gap-4 sm:gap-5"
              >
                {/* Left/Top Cover Image */}
                <div className="relative w-full sm:w-52 md:w-56 lg:w-60 shrink-0 aspect-[16/10] rounded-xl border border-[#1E293B] overflow-hidden bg-slate-100 shadow-[1px_1px_0px_#1E293B]">
                  <Link href={articleUrl} className="block size-full relative">
                    <Image
                      src={displayImage}
                      alt={article.title}
                      fill
                      unoptimized={isUnoptimized}
                      sizes="(max-width: 640px) 100vw, 240px"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={() => handleImageError(article.id)}
                    />
                  </Link>

                  {/* Category Badge */}
                  <span className="absolute top-2 left-2 z-10 rounded-full border border-[#1E293B] bg-white/95 backdrop-blur-xs px-2.5 py-0.5 text-[10px] font-black text-[#1E293B] shadow-[1px_1px_0px_#1E293B]">
                    {getCategoryLabel(article)}
                  </span>

                  {/* Read time pill */}
                  {article.readTime && (
                    <span className="absolute bottom-2 right-2 z-10 rounded-full border border-[#1E293B]/40 bg-[#1E293B]/80 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
                      ⏱ {article.readTime}
                    </span>
                  )}
                </div>

                {/* Right/Body Content */}
                <div className="flex-1 min-w-0 flex flex-col justify-between space-y-2.5">
                  <div className="space-y-2">
                    {/* Author row */}
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600 font-semibold">
                      <div className="relative size-6 rounded-full border border-[#1E293B] overflow-hidden shrink-0 bg-slate-200 shadow-xs">
                        <Image
                          src={
                            article.author?.avatar || "/img/profile-avatar.png"
                          }
                          alt={article.author?.name || "Tác giả"}
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>
                      <span className="font-extrabold text-[#1E293B]">
                        {article.author?.name || "Thực khách ẩn danh"}
                      </span>
                      {article.author?.role && (
                        <span className="rounded-md bg-[#FFF5EF] border border-[#1E293B]/20 px-1.5 py-0.5 text-[10px] font-bold text-[#E55067]">
                          {article.author.role}
                        </span>
                      )}
                      {article.publishedAt && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="text-[11px] text-slate-500 font-medium">
                            {formatDate(article.publishedAt)}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Title */}
                    <Link href={articleUrl} className="group/title block">
                      <h3 className="font-black text-base sm:text-lg text-[#1E293B] group-hover/title:text-[#FF5376] transition-colors leading-snug line-clamp-2">
                        {article.title}
                      </h3>
                    </Link>

                    {/* Excerpt */}
                    <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed line-clamp-2">
                      {article.excerpt}
                    </p>

                    {/* Highlight metadata chips */}
                    {(article.recommendedDish || article.costPerPerson) && (
                      <div className="flex flex-wrap items-center gap-2 pt-0.5">
                        {article.recommendedDish && (
                          <span className="inline-flex items-center gap-1 rounded-lg border border-[#1E293B] bg-amber-50 px-2.5 py-1 text-xs font-bold text-[#1E293B] shadow-[1px_1px_0px_#1E293B]">
                            <span>🍽️ Nên thử:</span>
                            <span className="font-extrabold text-[#E55067]">
                              {article.recommendedDish}
                            </span>
                          </span>
                        )}
                        {article.costPerPerson && (
                          <span className="inline-flex items-center gap-1 rounded-lg border border-[#1E293B] bg-emerald-50 px-2.5 py-1 text-xs font-bold text-[#1E293B] shadow-[1px_1px_0px_#1E293B]">
                            <span>💰 Chi phí:</span>
                            <span className="font-extrabold text-emerald-800">
                              {article.costPerPerson}
                            </span>
                          </span>
                        )}
                      </div>
                    )}

                    {/* Quote callout box */}
                    {article.quote?.text && (
                      <div className="border-l-4 border-[#FF5376] bg-rose-50/60 p-3 rounded-r-xl italic text-xs text-slate-700 font-medium leading-relaxed">
                        <span>"{article.quote.text}"</span>
                        {article.quote.author && (
                          <span className="block mt-1 font-bold text-slate-600 not-italic">
                            — {article.quote.author}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Action footer */}
                  <div className="pt-2 flex items-center justify-between border-t border-[#1E293B]/10">
                    <div className="flex items-center gap-3 text-[11px] text-slate-500 font-bold">
                      {typeof article.views === "number" &&
                        article.views > 0 && (
                          <span className="flex items-center gap-1">
                            <span>👁</span>
                            <span>{article.views.toLocaleString()}</span>
                          </span>
                        )}
                      {typeof article.likes === "number" &&
                        article.likes > 0 && (
                          <span className="flex items-center gap-1">
                            <span>❤️</span>
                            <span>{article.likes.toLocaleString()}</span>
                          </span>
                        )}
                    </div>

                    <Link
                      href={articleUrl}
                      className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black text-[#FF5376] hover:text-[#E55067] group/link transition-all ml-auto"
                    >
                      <span>Đọc toàn bộ bài viết</span>
                      <span className="inline-block transition-transform duration-200 group-hover/link:translate-x-1 font-bold">
                        →
                      </span>
                    </Link>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}

      {/* 5. Create Article Modal */}
      <CreatePlaceArticleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        place={place}
        onArticleCreated={handleArticleCreated}
      />

      {/* 6. Success Toast Notification */}
      {toast && (
        <aside
          aria-label="Thông báo xuất bản"
          className="fixed bottom-6 right-6 z-50 max-w-sm sm:max-w-md w-[calc(100%-3rem)] rounded-xl border border-[#1E293B] bg-[#FFF0ED] p-4 shadow-[2.5px_2.5px_0px_#1E293B] duration-200"
        >
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-[#1E293B] bg-white text-xl shadow-[1px_1px_0px_#1E293B]">
              🎉
            </div>
            <div className="flex-1 min-w-0 pr-2">
              <h4 className="text-xs sm:text-sm font-black text-[#1E293B]">
                {toast.title}
              </h4>
              <p className="mt-1 text-xs font-semibold text-slate-700 leading-relaxed">
                {toast.message}
              </p>
              {toast.articleSlugOrId && (
                <Link
                  href={`/articles/${toast.articleSlugOrId}`}
                  className="mt-2.5 inline-flex items-center gap-1.5 rounded-xl border border-[#1E293B] bg-white px-3 py-1 text-xs font-black text-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B] hover:shadow-[2px_2px_0px_#1E293B] hover:bg-[#FFF5EF] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                >
                  <span>Xem bài viết ngay</span>
                  <span>➔</span>
                </Link>
              )}
            </div>
            <button
              type="button"
              onClick={() => setToast(null)}
              className="flex size-7 items-center justify-center rounded-lg border border-[#1E293B] bg-white text-xs font-black text-[#1E293B] hover:bg-slate-100 cursor-pointer shadow-[1px_1px_0px_#1E293B]"
              aria-label="Đóng thông báo"
            >
              ✕
            </button>
          </div>
        </aside>
      )}
    </section>
  )
}
