"use client"
// Filter out current place and pick 3 recommendations
import Link from "next/link"
import { EXPLORE_PLACES } from "@/data/explorePlacesData"
import ExploreCard from "@/components/places/ExploreCard"

interface ModernRelatedPlacesProps {
  currentId: string
}

export default function ModernRelatedPlaces({
  currentId,
}: ModernRelatedPlacesProps) {
  const relatedList = EXPLORE_PLACES.filter((p) => p.id !== currentId).slice(
    0,
    3,
  )

  if (relatedList.length === 0) return null

  return (
    <section className="mt-14 pt-10 border-t-2 border-[#1E293B]/15">
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs font-semibold text-[#FF5376] uppercase tracking-wider block">
            Gợi ý cùng gu
          </span>
          <h2 className="text-xl sm:text-2xl font-extrabold text-[#1E293B]">
            Địa Điểm Tương Tự Bạn Có Thể Thích
          </h2>
        </div>
        <Link
          href="/places"
          className="text-xs sm:text-sm font-bold text-[#FF5376] hover:underline flex items-center gap-1"
        >
          <span>Xem tất cả</span>
          <span>→</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {relatedList.map((place) => (
          <ExploreCard key={place.id} place={place} />
        ))}
      </div>
    </section>
  )
}
