import Image from "next/image"
import Link from "next/link"
import type { Article } from "@/types/article"
import { getPlaceDetail } from "@/utils/placeResolver"

interface ArticleDetailContentProps {
  article: Article
}

export default function ArticleDetailContent({
  article,
}: ArticleDetailContentProps) {
  const relatedPlace = article.relatedPlaceId
    ? getPlaceDetail(article.relatedPlaceId)
    : null

  return (
    <article className="space-y-8 max-w-4xl mx-auto">
      {/* 1. Large Main Cover Image */}
      <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full overflow-hidden rounded-3xl border-2 border-[#1E293B] bg-white shadow-[4px_4px_0px_#1E293B]">
        <Image
          src={article.coverImage}
          alt={article.title}
          fill
          priority
          unoptimized={article.coverImage.startsWith("http")}
          sizes="(max-width: 1024px) 100vw, 80vw"
          className="object-cover"
        />

        <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 rounded-xl border border-white/40 bg-black/60 px-3 py-1 text-xs font-semibold text-white backdrop-blur-xs">
          📷 {article.title}
        </div>
      </div>

      {/* 2. Article Body Text */}
      <div className="rounded-3xl border-2 border-[#1E293B] bg-white p-6 sm:p-10 shadow-[4px_4px_0px_#1E293B] space-y-6">
        {article.content.map((paragraph, index) => (
          <p
            key={index}
            className="text-slate-800 text-base sm:text-lg leading-relaxed font-medium"
          >
            {paragraph}
          </p>
        ))}

        {/* 3. Pull Quote Block (if exists) */}
        {article.quote && (
          <div className="my-8 rounded-2xl border-2 border-[#1E293B] bg-[#FFF8F5] p-5 sm:p-7 shadow-[3px_3px_0px_#1E293B] relative">
            <span className="text-4xl text-[#FF5376] absolute -top-4 left-6 select-none">
              “
            </span>
            <blockquote className="pt-2 text-base sm:text-lg font-black italic text-[#1E293B] leading-relaxed">
              {article.quote.text}
            </blockquote>
            {article.quote.author && (
              <p className="mt-3 text-xs sm:text-sm font-extrabold text-[#FF5376] tracking-wide uppercase">
                — {article.quote.author}
              </p>
            )}
          </div>
        )}

        {/* 4. Linked Place Card (Connects to /places/[id]) */}
        {relatedPlace && (
          <div className="my-8 rounded-2xl border-2 border-[#1E293B] bg-[#FFFDFC] p-5 shadow-[3px_3px_0px_#1E293B]">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">📍</span>
              <span className="text-xs font-black uppercase tracking-wider text-[#FF5376]">
                Quán ăn trong bài viết
              </span>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl border-2 border-[#1E293B] shadow-[1px_1px_0px_#1E293B]">
                  <Image
                    src={relatedPlace.image}
                    alt={relatedPlace.name}
                    fill
                    unoptimized={relatedPlace.image.startsWith("http")}
                    className="object-cover"
                  />
                </div>
                <div>
                  <h4 className="font-black text-[#1E293B] text-base leading-snug">
                    {relatedPlace.name}
                  </h4>
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-600 mt-1">
                    <span className="text-amber-500">
                      ★ {relatedPlace.rating.toFixed(1)}
                    </span>
                    <span>•</span>
                    <span className="truncate max-w-[200px] sm:max-w-xs">
                      {relatedPlace.address}
                    </span>
                  </div>
                </div>
              </div>

              <Link
                href={`/places/${relatedPlace.id}`}
                className="inline-flex items-center justify-center gap-1.5 rounded-xl border-2 border-[#1E293B] bg-[#FF5376] px-4 py-2.5 text-xs font-black text-white shadow-[2px_2px_0px_#1E293B] hover:bg-[#ff3b65] transition-all shrink-0"
              >
                <span>Xem quán ăn này</span>
                <span>➔</span>
              </Link>
            </div>
          </div>
        )}

        {/* 5. Article Tags */}
        <div className="pt-6 border-t-2 border-[#1E293B]/10 flex flex-wrap items-center gap-2">
          <span className="text-xs font-black text-[#1E293B] uppercase tracking-wider mr-1">
            Chủ đề:
          </span>
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-xl border-2 border-[#1E293B] bg-[#FFF5EF] px-3 py-1 text-xs font-black text-[#1E293B] shadow-[1px_1px_0px_#1E293B]"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* 6. Author Bio Card */}
      <div className="rounded-3xl border-2 border-[#1E293B] bg-white p-6 shadow-[3px_3px_0px_#1E293B] flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <div className="relative size-16 shrink-0 overflow-hidden rounded-full border-2 border-[#1E293B] shadow-[2px_2px_0px_#1E293B]">
          <Image
            src={article.author.avatar}
            alt={article.author.name}
            fill
            unoptimized
            className="object-cover"
          />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-black text-[#1E293B] text-base sm:text-lg">
              {article.author.name}
            </h3>
            <span className="rounded-md bg-emerald-50 border border-emerald-300 px-2 py-0.5 text-[10px] font-black text-emerald-800">
              Verified Author
            </span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-600 leading-relaxed">
            Biên tập viên đam mê khám phá các góc nhỏ ẩm thực, những câu chuyện
            văn hóa phía sau từng món ăn truyền thống và các điểm hẹn hò thú vị.
          </p>
        </div>
      </div>
    </article>
  )
}
