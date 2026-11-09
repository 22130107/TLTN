import Link from "next/link"
import type { Article } from "@/types/article"
import ArticleCard from "@/components/articles/ArticleCard"

interface RelatedArticlesProps {
  articles: Article[]
}

export default function RelatedArticles({ articles }: RelatedArticlesProps) {
  if (!articles || articles.length === 0) return null

  return (
    <section className="mt-16 pt-10 border-t-2 border-[#1E293B]/15">
      <div className="flex items-center justify-between mb-8">
        <div>
          <span className="text-xs font-black uppercase tracking-wider text-[#FF5376] block">
            Ký sự ẩm thực khác
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#1E293B]">
            Bài Viết Liên Quan Có Thể Bạn Thích
          </h2>
        </div>
        <Link
          href="/articles"
          className="text-xs sm:text-sm font-black text-[#FF5376] hover:underline flex items-center gap-1"
        >
          <span>Xem tất cả bài viết</span>
          <span>→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  )
}
