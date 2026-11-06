"use client" /* Ellipsis */ /* Next Button */
export interface ExplorePaginationProps {
  currentPage: number
  totalPages?: number
  onPageChange: (page: number) => void
  className?: string
}

export default function ExplorePagination({
  currentPage = 1,
  totalPages = 5,
  onPageChange,
  className = "",
}: ExplorePaginationProps) {
  const pages = [1, 2, 3, 4, 5]

  return (
    <nav
      aria-label="Phân trang quán ăn"
      className={`flex items-center justify-center gap-2 pt-8 sm:pt-10 ${className}`}
    >
      {pages.map((p) => {
        const isActive = p === currentPage
        return (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={isActive ? "page" : undefined}
            className={`flex size-8.5 items-center justify-center rounded-lg text-xs font-bold transition-all sm:size-9 sm:text-sm border border-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none cursor-pointer ${
              isActive
                ? "bg-[#FF5C77] text-white"
                : "bg-white text-[#1E293B] hover:bg-[#FFF5EF] hover:text-[#FF5C77]"
            }`}
          >
            {p}
          </button>
        )
      })}

      {}
      <span className="px-1 text-xs font-bold text-[#1E293B]">...</span>

      {}
      <button
        type="button"
        onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
        aria-label="Trang tiếp theo"
        className="flex size-8.5 items-center justify-center rounded-lg border border-[#1E293B] bg-white text-xs font-bold text-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B] transition-all hover:bg-[#FFF5EF] hover:text-[#FF5C77] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none sm:size-9 sm:text-sm cursor-pointer"
      >
        →
      </button>
    </nav>
  )
}
