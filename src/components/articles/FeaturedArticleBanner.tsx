import Image from "next/image"
import Link from "next/link"
import type { Article } from "@/types/article"

interface FeaturedArticleBannerProps {
  article: Article | null
}

export default function FeaturedArticleBanner({
  article,
}: FeaturedArticleBannerProps) {
  if (!article) return null

  return (
    <div className="relative mb-10 overflow-hidden rounded-3xl border-2 border-[#1E293B] bg-white p-5 sm:p-8 shadow-[4px_4px_0px_#1E293B] transition-all">
      <div className="flex flex-col lg:flex-row items-stretch gap-6 lg:gap-8">
        {/* Left/Main Column: Badges, Title, Excerpt, Author & CTA */}
        <div className="flex flex-1 flex-col justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2.5 mb-3">
              <span className="inline-flex items-center gap-1 rounded-full border-2 border-[#1E293B] bg-[#FF5376] px-3.5 py-1 text-xs font-black text-white shadow-[2px_2px_0px_#1E293B]">
                <span>🔥</span>
                <span>Tiêu điểm tuần này</span>
              </span>
              <span className="rounded-full border-2 border-[#1E293B] bg-[#FFF0ED] px-3 py-1 text-xs font-extrabold text-[#1E293B] shadow-[2px_2px_0px_#1E293B]">
                {article.categoryLabel}
              </span>
              <span className="rounded-full border-2 border-[#1E293B] bg-amber-50 px-3 py-1 text-xs font-extrabold text-[#1E293B] shadow-[2px_2px_0px_#1E293B]">
                ⏱ {article.readTime}
              </span>
            </div>

            <Link href={`/articles/${article.id}`}>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#1E293B] tracking-tight leading-tight transition-colors hover:text-[#FF5376]">
                {article.title}
              </h2>
            </Link>

            <p className="mt-3 text-sm sm:text-base font-medium text-slate-700 leading-relaxed line-clamp-3">
              {article.excerpt}
            </p>
          </div>

          <div className="mt-6 pt-5 border-t-2 border-[#1E293B]/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="relative size-10 overflow-hidden rounded-full border-2 border-[#1E293B] shadow-[1px_1px_0px_#1E293B]">
                <Image
                  src={article.author.avatar}
                  alt={article.author.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              </div>
              <div>
                <span className="block text-xs font-black text-[#1E293B]">
                  {article.author.name}
                </span>
                <span className="block text-[11px] font-semibold text-slate-500">
                  {article.publishedAt} • {article.author.role}
                </span>
              </div>
            </div>

            <Link
              href={`/articles/${article.id}`}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#1E293B] bg-[#FF5376] px-5 py-2.5 text-xs sm:text-sm font-black text-white shadow-[3px_3px_0px_#1E293B] transition-all hover:bg-[#ff3b65] hover:shadow-[4px_4px_0px_#1E293B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              <span>Đọc bài viết</span>
              <span>➔</span>
            </Link>
          </div>
        </div>

        {/* Right Column: Featured Cover Image */}
        <div className="relative w-full lg:w-[45%] aspect-[16/10] lg:aspect-auto min-h-[220px] sm:min-h-[260px] lg:min-h-[300px] overflow-hidden rounded-2xl border-2 border-[#1E293B] bg-[#FFF5EF] shadow-[2px_2px_0px_#1E293B]">
          <Link href={`/articles/${article.id}`} className="block size-full">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              priority
              unoptimized={article.coverImage.startsWith("http")}
              className="object-cover transition-transform duration-500 hover:scale-105"
            />
          </Link>
        </div>
      </div>
    </div>
  )
}
