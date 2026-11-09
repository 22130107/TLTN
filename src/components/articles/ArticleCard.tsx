import Image from "next/image"
import Link from "next/link"
import type { Article } from "@/types/article"

interface ArticleCardProps {
  article: Article
  className?: string
}

export default function ArticleCard({
  article,
  className = "",
}: ArticleCardProps) {
  return (
    <article
      className={`group relative flex flex-col justify-between rounded-3xl border-2 border-[#1E293B] bg-white p-4 shadow-[3px_3px_0px_#1E293B] transition-all duration-300 hover:-translate-y-1 hover:shadow-[5px_5px_0px_#1E293B] ${className}`}
    >
      <div>
        {/* Cover Image Container */}
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl border-2 border-[#1E293B] bg-[#FFF5EF] shadow-[1px_1px_0px_#1E293B]">
          <Link href={`/articles/${article.id}`} className="block size-full">
            <Image
              src={article.coverImage}
              alt={article.title}
              fill
              unoptimized={article.coverImage.startsWith("http")}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </Link>

          {/* Category Badge */}
          <span className="absolute top-2.5 left-2.5 z-10 rounded-full border-1.5 border-[#1E293B] bg-[#FFF0ED] px-3 py-0.5 text-[11px] font-black text-[#1E293B] shadow-[1px_1px_0px_#1E293B]">
            {article.categoryLabel}
          </span>

          {/* Reading Time */}
          <span className="absolute bottom-2.5 right-2.5 z-10 rounded-full border border-[#1E293B]/40 bg-[#1E293B]/80 px-2.5 py-0.5 text-[10px] font-bold text-white backdrop-blur-xs">
            ⏱ {article.readTime}
          </span>
        </div>

        {/* Content Section */}
        <div className="mt-3.5">
          {/* Metadata Row */}
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-1.5">
            <span>{article.publishedAt}</span>
            <span className="flex items-center gap-1">
              <span>👁</span>
              <span>{article.views.toLocaleString()}</span>
            </span>
          </div>

          {/* Title */}
          <Link href={`/articles/${article.id}`}>
            <h3 className="text-base font-black text-[#1E293B] leading-snug transition-colors group-hover:text-[#FF5376] line-clamp-2">
              {article.title}
            </h3>
          </Link>

          {/* Excerpt */}
          <p className="mt-2 text-xs font-medium text-slate-600 leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>

          {/* Tag Pills */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            {article.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-lg border border-[#1E293B]/15 bg-[#FFF8F5] px-2 py-0.5 text-[10px] font-bold text-slate-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Author & Read More Footer */}
      <div className="mt-4 pt-3 border-t-2 border-[#1E293B]/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative size-7 overflow-hidden rounded-full border border-[#1E293B] shadow-xs">
            <Image
              src={article.author.avatar}
              alt={article.author.name}
              fill
              unoptimized
              className="object-cover"
            />
          </div>
          <span className="text-xs font-bold text-[#1E293B] truncate max-w-[110px]">
            {article.author.name}
          </span>
        </div>

        <Link
          href={`/articles/${article.id}`}
          className="inline-flex items-center gap-1 text-xs font-black text-[#FF5376] hover:underline"
        >
          <span>Đọc tiếp</span>
          <span>→</span>
        </Link>
      </div>
    </article>
  )
}
