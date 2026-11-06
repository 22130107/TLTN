"use client"
// Search query filter with Vietnamese accent normalization

// Distance filter

// Category filter

// Price filter

// Rating filter
/* Left Sidebar Filter with Mini Map & decoratediscover.png */ /* Right Places Explorer Area */ /* Header Row: Title, Search Bar & Reset/Show All */ /* Styled Search Input Bar */ /* Search Result Feedback Badge (when searching) */ /* Cards Grid: 4 columns on large desktop, responsive */ /* Pagination */ /* Header Row: Title, Search Bar & Reset/Show All */ /* Styled Search Input Bar */ /* Search Result Feedback Badge (when searching) */ /* Cards Grid: 4 columns on large desktop, responsive */

// Vị trí người dùng: Ưu tiên localStorage -> Profile tài khoản -> Mặc định Sài Gòn

// Mặc định

// Đồng bộ khi user click vào một category từ trang chủ hoặc thay đổi url query

// Tính toán khoảng cách thực tế giữa vị trí người dùng và từng quán ăn

// Danh sách quán ăn hiển thị trên bản đồ mini Leaflet
/* Cột trái: Bộ lọc & Bản đồ Leaflet chọn vị trí linh hoạt */
import { useState, useMemo, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { EXPLORE_PLACES, type ExplorePlace } from "@/data/explorePlacesData"
import { normalizeVietnamese } from "@/utils/vietnameseSearch"
import {
  getSavedUserLocation,
  saveUserLocation,
  getDistrictCoordinates,
  calculateDistanceKm,
  formatDistanceText,
  type UserGeoPosition,
} from "@/utils/geolocation"
import ExploreSidebar, { type FilterState } from "./ExploreSidebar"
import ExploreCard from "./ExploreCard"
import ExplorePagination from "./ExplorePagination"

export interface PlacesExplorerProps {
  className?: string
  initialPlaces?: ExplorePlace[]
}

export default function PlacesExplorer({
  className = "",
  initialPlaces,
}: PlacesExplorerProps) {
  const { profile } = useAuth()
  const searchParams = useSearchParams()
  const urlQuery = searchParams.get("q") || ""

  const allPlaces =
    initialPlaces && initialPlaces.length > 0 ? initialPlaces : EXPLORE_PLACES
  const [searchQuery, setSearchQuery] = useState(urlQuery)
  const [filter, setFilter] = useState<FilterState>({
    distance: "all",
    categories: [],
    priceRange: [],
    minRating: 0,
  })
  const [userLocation, setUserLocation] = useState<UserGeoPosition | null>(null)

  useEffect(() => {
    const saved = getSavedUserLocation()
    if (saved) {
      setUserLocation(saved)
      return
    }

    if (profile?.location_name) {
      const coords = getDistrictCoordinates(profile.location_name)
      const loc: UserGeoPosition = {
        lat: profile.latitude ? Number(profile.latitude) : coords.lat,
        lng: profile.longitude ? Number(profile.longitude) : coords.lng,
        addressName: profile.location_name,
        city: profile.location_name,
        isGPS: false,
      }
      setUserLocation(loc)
      saveUserLocation(loc)
      return
    }
    const defaultLoc: UserGeoPosition = {
      lat: 10.7769,
      lng: 106.7009,
      addressName: "Quận 1, TP. Hồ Chí Minh",
      city: "TP. Hồ Chí Minh",
      isGPS: false,
    }
    setUserLocation(defaultLoc)
  }, [profile])
  useEffect(() => {
    if (urlQuery) {
      setSearchQuery(urlQuery)
      setCurrentPage(1)
    }
  }, [urlQuery])

  const [currentPage, setCurrentPage] = useState(1)
  const placesWithCalculatedDistance = useMemo(() => {
    if (!userLocation) return allPlaces

    return allPlaces.map((place: ExplorePlace) => {
      const placeCoords = {
        lat: place.latitude ?? getDistrictCoordinates(place.district).lat,
        lng: place.longitude ?? getDistrictCoordinates(place.district).lng,
      }

      const dist = calculateDistanceKm(
        userLocation.lat,
        userLocation.lng,
        placeCoords.lat,
        placeCoords.lng,
      )

      return {
        ...place,
        distance: dist,
        distanceText: formatDistanceText(dist),
      }
    })
  }, [allPlaces, userLocation])

  const filteredPlaces = useMemo(() => {
    return placesWithCalculatedDistance.filter((place: ExplorePlace) => {
      if (searchQuery.trim() !== "") {
        const query = normalizeVietnamese(searchQuery)
        const nameMatch = normalizeVietnamese(place.name).includes(query)
        const districtMatch = normalizeVietnamese(place.district).includes(
          query,
        )
        const tagsMatch = place.tags.some((tag) =>
          normalizeVietnamese(tag).includes(query),
        )
        const descMatch = normalizeVietnamese(place.description).includes(query)
        const badgeMatch = normalizeVietnamese(place.badge).includes(query)

        if (
          !nameMatch &&
          !districtMatch &&
          !tagsMatch &&
          !descMatch &&
          !badgeMatch
        ) {
          return false
        }
      }
      if (filter.distance === "under-5" && place.distance > 5) return false
      if (
        filter.distance === "1-3" &&
        (place.distance < 1 || place.distance > 3)
      )
        return false
      if (
        filter.distance === "3-5" &&
        (place.distance <= 3 || place.distance > 5)
      )
        return false
      if (filter.distance === "above-5" && place.distance <= 5) return false
      if (
        filter.categories.length > 0 &&
        !filter.categories.includes(place.categoryType)
      ) {
        return false
      }
      if (
        filter.priceRange.length > 0 &&
        !filter.priceRange.includes(place.priceRange)
      ) {
        return false
      }
      if (filter.minRating > 0 && place.rating < filter.minRating) {
        return false
      }

      return true
    })
  }, [placesWithCalculatedDistance, filter, searchQuery])

  const handleResetFilter = () => {
    setSearchQuery("")
    setFilter({
      distance: "all",
      categories: [],
      priceRange: [],
      minRating: 0,
    })
    setCurrentPage(1)
  }
  const miniMapPlaces = useMemo(() => {
    return allPlaces.map((p) => {
      const coords = {
        lat: p.latitude ?? getDistrictCoordinates(p.district).lat,
        lng: p.longitude ?? getDistrictCoordinates(p.district).lng,
      }
      return {
        id: p.id,
        name: p.name,
        lat: coords.lat,
        lng: coords.lng,
        rating: p.rating,
        district: p.district,
        badge: p.badge,
      }
    })
  }, [allPlaces])

  return (
    <div className={`w-full ${className}`}>
      <div className="flex flex-col items-start gap-6 lg:flex-row lg:gap-8">
        {}
        <div className="w-full shrink-0 lg:w-[280px] xl:w-[300px]">
          <ExploreSidebar
            filter={filter}
            onFilterChange={(newF) => {
              setFilter(newF)
              setCurrentPage(1)
            }}
            userLocation={userLocation}
            onLocationChange={(newLoc) => {
              setUserLocation(newLoc)
              setCurrentPage(1)
            }}
            places={miniMapPlaces}
          />
        </div>

        {}
        <div className="w-full min-w-0 flex-1">
          {}
          <div className="mb-6 flex flex-col gap-4 border-b border-[#E8DDD1] pb-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2.5 shrink-0">
              <h1 className="text-2xl font-bold text-[#1E293B] sm:text-3xl tracking-tight">
                Quán ăn nổi bật
              </h1>
            </div>

            {}
            <div className="relative w-full max-w-md">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
                <svg
                  className="size-4.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder="Tìm món ăn, tên quán, khu vực..."
                className="w-full rounded-full border border-[#1E293B] bg-white py-2.5 pl-10 pr-9 text-xs sm:text-sm font-semibold text-[#1E293B] placeholder-slate-400 shadow-[1.5px_1.5px_0px_#1E293B] transition-all focus:border-[#FF5C77] focus:outline-none"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-xs font-bold text-slate-400 hover:text-[#1E293B]"
                  aria-label="Xóa tìm kiếm"
                >
                  ✕
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleResetFilter}
              className="hidden shrink-0 items-center gap-1.5 rounded-full border border-[#1E293B] bg-white px-3.5 py-1.5 text-xs font-bold text-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B] hover:bg-[#FFF5EF] hover:text-[#FF5C77] transition-all sm:flex sm:text-sm cursor-pointer"
            >
              <span>Xem tất cả</span>
              <span>→</span>
            </button>
          </div>

          {}
          {searchQuery.trim() !== "" && (
            <div className="mb-4 flex items-center justify-between rounded-xl border border-[#1E293B] bg-[#FFF0ED] px-4 py-2.5 text-xs font-semibold text-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B]">
              <span>
                Tìm thấy{" "}
                <strong className="text-[#FF5C77] font-bold">
                  {filteredPlaces.length}
                </strong>{" "}
                quán ăn phù hợp cho từ khóa &ldquo;{searchQuery}&rdquo;
              </span>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="font-bold text-[#FF5C77] hover:underline cursor-pointer"
              >
                Xóa tìm kiếm
              </button>
            </div>
          )}

          {}
          {filteredPlaces.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-5">
              {filteredPlaces.map((place) => (
                <ExploreCard key={place.id} place={place} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-[#1E293B] bg-white py-14 text-center shadow-[2px_2px_0px_#1E293B]">
              <p className="text-base font-bold text-[#1E293B]">
                Không tìm thấy quán ăn phù hợp
              </p>
              <p className="mt-1 text-xs text-slate-600 font-medium">
                Hãy thử kiểm tra lại từ khóa hoặc nới lỏng các tiêu chí lọc.
              </p>
              <button
                type="button"
                onClick={handleResetFilter}
                className="mt-4 rounded-full border border-[#1E293B] bg-[#FF5C77] px-4 py-2 text-xs font-bold text-white shadow-[1.5px_1.5px_0px_#1E293B] hover:bg-[#EE4A65] transition-all cursor-pointer"
              >
                Đặt lại bộ lọc
              </button>
            </div>
          )}

          {}
          <ExplorePagination
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  )
}
