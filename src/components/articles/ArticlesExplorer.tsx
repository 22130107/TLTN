"use client"
// Category filter

// Search keyword filter

// Pagination calculations
/* Search & Category Pills Filter Bar */ /* Category Pills */ /* Search Input Bar */ /* Result Counter (if searching or filtering) */ /* Articles Grid */ /* Pagination Controls */
import { useState, useMemo } from "react"
import type { Article, ArticleCategory } from "@/types/article"
import ArticleCard from "@/components/articles/ArticleCard"

interface ArticlesExplorerProps {
  initialArticles: Article[]
}

interface CategoryItem {
  id: ArticleCategory
  label: string
  icon: string
}

const CATEGORIES: CategoryItem[] = [
  { id: "all", label: "Tất cả bài viết", icon: "📚" },
  { id: "review", label: "Review Quán", icon: "⭐" },
  { id: "culture", label: "Văn Hóa Ẩm Thực", icon: "🏮" },
  { id: "guide", label: "Cẩm Nang Ăn Uống", icon: "🗺️" },
  { id: "couple", label: "Hẹn Hò & Tụ Họp", icon: "💖" },
]

export default function ArticlesExplorer({
  initialArticles,
}: ArticlesExplorerProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<ArticleCategory>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 6

  const filteredArticles = useMemo(() => {
    return initialArticles.filter((article) => {
      if (selectedCategory !== "all" && article.category !== selectedCategory) {
        return false
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim()
        const matchTitle = article.title.toLowerCase().includes(query)
        const matchExcerpt = article.excerpt.toLowerCase().includes(query)
        const matchTag = article.tags.some((t) =>
          t.toLowerCase().includes(query),
        )
        const matchAuthor = article.author.name.toLowerCase().includes(query)
        if (!matchTitle && !matchExcerpt && !matchTag && !matchAuthor) {
          return false
        }
      }

      return true
    })
  }, [initialArticles, selectedCategory, searchQuery])
  const totalPages = Math.ceil(filteredArticles.length / pageSize) || 1
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredArticles.slice(start, start + pageSize)
  }, [filteredArticles, currentPage, pageSize])

  const handleSelectCategory = (cat: ArticleCategory) => {
    setSelectedCategory(cat)
    setCurrentPage(1)
  }

  const handleReset = () => {
    setSelectedCategory("all")
    setSearchQuery("")
    setCurrentPage(1)
  }

  return (
    <div className="w-full space-y-8">
      {}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 rounded-3xl border-2 border-[#1E293B] bg-white p-4 sm:p-5 shadow-[4px_4px_0px_#1E293B]">
        {}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id
            return (
              <button
                type="button"
                key={cat.id}
                onClick={() => handleSelectCategory(cat.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-black transition-all ${
                  isSelected
                    ? "border-2 border-[#1E293B] bg-[#FF5376] text-white shadow-[2px_2px_0px_#1E293B] scale-105"
                    : "border-2 border-transparent bg-[#FFF5EF] text-[#1E293B] hover:border-[#1E293B] hover:bg-white"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>

        {}
        <div className="relative w-full md:w-72 shrink-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setCurrentPage(1)
            }}
            placeholder="Tìm bài viết, món ăn, tác giả..."
            className="w-full rounded-full border-2 border-[#1E293B] bg-white py-2 pl-9 pr-8 text-xs font-bold text-[#1E293B] placeholder-slate-400 shadow-[2px_2px_0px_#1E293B] focus:border-[#FF5376] focus:outline-none"
          />
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">
            🔍
          </span>
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-slate-500 hover:text-[#1E293B]"
              aria-label="Xóa tìm kiếm"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {}
      {(searchQuery.trim() !== "" || selectedCategory !== "all") && (
        <div className="flex items-center justify-between rounded-2xl border-2 border-[#1E293B] bg-[#FFF0ED] px-4 py-2.5 text-xs font-bold text-[#1E293B] shadow-[2px_2px_0px_#1E293B]">
          <span>
            Tìm thấy{" "}
            <strong className="text-[#FF5376] font-black">
              {filteredArticles.length}
            </strong>{" "}
            bài viết phù hợp
          </span>
          <button
            type="button"
            onClick={handleReset}
            className="font-black text-[#FF5376] hover:underline"
          >
            Đặt lại bộ lọc
          </button>
        </div>
      )}

      {}
      {paginatedArticles.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {paginatedArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-[#1E293B] bg-white py-16 text-center shadow-[4px_4px_0px_#1E293B]">
          <span className="text-4xl">📖</span>
          <p className="mt-3 text-base font-black text-[#1E293B]">
            Không tìm thấy bài viết phù hợp
          </p>
          <p className="mt-1 text-xs text-slate-600 font-medium">
            Hãy thử tìm bằng từ khóa khác hoặc chuyển danh mục bài viết.
          </p>
          <button
            type="button"
            onClick={handleReset}
            className="mt-4 rounded-full border-2 border-[#1E293B] bg-[#FF5376] px-4 py-2 text-xs font-black text-white shadow-[2px_2px_0px_#1E293B] hover:bg-[#EE4A65]"
          >
            Xem tất cả bài viết
          </button>
        </div>
      )}

      {}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="rounded-xl border-2 border-[#1E293B] bg-white px-3.5 py-1.5 text-xs font-black text-[#1E293B] shadow-[2px_2px_0px_#1E293B] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FFF5EF] transition-all"
          >
            ← Trước
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              type="button"
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`size-8 rounded-xl border-2 border-[#1E293B] text-xs font-black transition-all ${
                currentPage === page
                  ? "bg-[#FF5376] text-white shadow-[2px_2px_0px_#1E293B] scale-105"
                  : "bg-white text-[#1E293B] shadow-[2px_2px_0px_#1E293B] hover:bg-[#FFF5EF]"
              }`}
            >
              {page}
            </button>
          ))}

          <button
            type="button"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="rounded-xl border-2 border-[#1E293B] bg-white px-3.5 py-1.5 text-xs font-black text-[#1E293B] shadow-[2px_2px_0px_#1E293B] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#FFF5EF] transition-all"
          >
            Sau →
          </button>
        </div>
      )}
    </div>
  )
}
