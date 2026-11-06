"use client"

// 1. Tự động lấy vị trí thực tế qua GPS thiết bị

// 2. Chọn một khu vực phổ biến từ danh sách

// 3. Người dùng tự nhập địa chỉ bất kỳ
/* Khung bản đồ mini Leaflet tương tác thực tế giống Lịch trình */ /* Nút hiển thị & thay đổi vị trí trực quan */ /* Modal / Dialog chọn vị trí linh hoạt */ /* Modal Header */ /* 1. Nút định vị GPS tự động */ /* 2. Chọn nhanh khu vực phổ biến */ /* 3. Tự nhập địa chỉ tùy ý */

import { useState } from "react"
import dynamic from "next/dynamic"
import {
  requestCurrentPosition,
  reverseGeocodeOsm,
  saveUserLocation,
  POPULAR_LOCATION_PRESETS,
  getDistrictCoordinates,
  type UserGeoPosition,
} from "@/utils/geolocation"
import type { MiniExplorePlace, MiniExploreMapProps } from "./MiniExploreMap"

const DynamicMiniMap = dynamic<MiniExploreMapProps>(
  () => import("./MiniExploreMap"),
  {
    ssr: false,
    loading: () => (
      <div className="relative flex aspect-[16/11] w-full flex-col items-center justify-center rounded-lg bg-[#FFF8F5] border border-[#1E293B]">
        <div className="flex flex-col items-center gap-2 text-center p-3">
          <span className="flex size-8 items-center justify-center rounded-full bg-[#FFE4E8] text-[#E55067] border border-[#1E293B] shadow-[1px_1px_0px_#1E293B]">
            <svg
              className="size-4 animate-pulse"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </span>
          <p className="text-xs font-bold text-[#1E293B]">
            Đang tải bản đồ tương tác...
          </p>
        </div>
      </div>
    ),
  },
)

export interface FilterState {
  distance: string
  categories: string[]
  priceRange: string[]
  minRating: number
}

export interface ExploreSidebarProps {
  filter: FilterState
  onFilterChange: (newFilter: FilterState) => void
  userLocation: UserGeoPosition | null
  onLocationChange: (newLoc: UserGeoPosition) => void
  places?: MiniExplorePlace[]
  className?: string
}

export default function ExploreSidebar({
  filter,
  onFilterChange,
  userLocation,
  onLocationChange,
  places = [],
  className = "",
}: ExploreSidebarProps) {
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [locateError, setLocateError] = useState<string | null>(null)
  const [customInput, setCustomInput] = useState("")

  const locationDisplay =
    userLocation?.addressName || userLocation?.city || "Quận 1, TP. Hồ Chí Minh"
  const handleLocateCurrentPosition = async () => {
    setIsLocating(true)
    setLocateError(null)
    try {
      const pos = await requestCurrentPosition()
      const geo = await reverseGeocodeOsm(
        pos.coords.latitude,
        pos.coords.longitude,
      )
      const newLoc: UserGeoPosition = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        addressName: geo.addressName || geo.city,
        city: geo.city,
        isGPS: true,
      }
      onLocationChange(newLoc)
      saveUserLocation(newLoc)
      setIsLocationModalOpen(false)
    } catch (err: any) {
      setLocateError(err.message || "Không thể lấy vị trí GPS từ trình duyệt.")
    } finally {
      setIsLocating(false)
    }
  }
  const handleSelectPreset = (preset: typeof POPULAR_LOCATION_PRESETS[0]) => {
    const newLoc: UserGeoPosition = {
      lat: preset.lat,
      lng: preset.lng,
      addressName: preset.name,
      city: preset.district,
      isGPS: false,
    }
    onLocationChange(newLoc)
    saveUserLocation(newLoc)
    setIsLocationModalOpen(false)
  }
  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!customInput.trim()) return
    const coords = getDistrictCoordinates(customInput)
    const newLoc: UserGeoPosition = {
      lat: coords.lat,
      lng: coords.lng,
      addressName: customInput.trim(),
      city: customInput.trim(),
      isGPS: false,
    }
    onLocationChange(newLoc)
    saveUserLocation(newLoc)
    setCustomInput("")
    setIsLocationModalOpen(false)
  }

  const toggleCategory = (cat: string) => {
    const exists = filter.categories.includes(cat)
    const nextCategories = exists
      ? filter.categories.filter((c) => c !== cat)
      : [...filter.categories, cat]
    onFilterChange({ ...filter, categories: nextCategories })
  }

  const togglePrice = (price: string) => {
    const exists = filter.priceRange.includes(price)
    const nextPrice = exists
      ? filter.priceRange.filter((p) => p !== price)
      : [...filter.priceRange, price]
    onFilterChange({ ...filter, priceRange: nextPrice })
  }

  const setDistance = (dist: string) => {
    onFilterChange({
      ...filter,
      distance: filter.distance === dist ? "all" : dist,
    })
  }

  const setMinRating = (rating: number) => {
    onFilterChange({
      ...filter,
      minRating: filter.minRating === rating ? 0 : rating,
    })
  }

  return (
    <aside
      className={`flex flex-col gap-5 rounded-xl border border-[#1E293B] bg-white p-4 sm:p-5 shadow-[2px_2px_0px_#1E293B] transition-all ${className}`}
    >
      {}
      <div className="flex items-center gap-2 pb-3 border-b border-[#E8DDD1]">
        <h2 className="text-base font-bold text-[#1E293B]">Tìm quanh bạn</h2>
      </div>

      {}
      <div className="relative aspect-[16/11] w-full overflow-hidden rounded-lg border border-[#1E293B] bg-[#FFF8F5] shadow-[1.5px_1.5px_0px_#1E293B]">
        <DynamicMiniMap
          center={{
            lat: userLocation?.lat ?? 10.7769,
            lng: userLocation?.lng ?? 106.7009,
          }}
          locationName={locationDisplay}
          isGPS={userLocation?.isGPS}
          places={places}
        />

        {}
        <div className="absolute inset-x-2.5 bottom-2.5 z-20">
          <div className="flex items-center justify-between gap-1.5 rounded-lg border border-[#1E293B] bg-white/95 px-2.5 py-1.5 shadow-[1.5px_1.5px_0px_#1E293B] backdrop-blur-xs">
            <div className="flex items-center gap-2 min-w-0">
              <span className="relative flex size-2.5 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#E55067] opacity-75"></span>
                <span className="relative inline-flex size-2.5 rounded-full bg-[#E55067]"></span>
              </span>
              <div className="min-w-0">
                <p
                  className="text-[11px] font-bold text-[#1E293B] truncate max-w-[135px]"
                  title={locationDisplay}
                >
                  {locationDisplay}
                </p>
                {userLocation?.isGPS && (
                  <span className="text-[9px] font-bold text-blue-600 block leading-none">
                    GPS vệ tinh
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsLocationModalOpen(true)}
              className="shrink-0 rounded-md border border-[#1E293B] bg-[#FFF0F2] px-2 py-1 text-[10.5px] font-extrabold text-[#E55067] hover:bg-[#FFE4E8] shadow-[1px_1px_0px_#1E293B] transition-colors cursor-pointer"
              title="Đổi hoặc chọn lại vị trí"
            >
              Đổi vị trí
            </button>
          </div>
        </div>
      </div>

      {}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-xl border border-[#1E293B] bg-white p-5 shadow-[3px_3px_0px_#1E293B]">
            {}
            <div className="flex items-center justify-between border-b border-[#E8DDD1] pb-3 mb-4">
              <div className="flex items-center gap-2">
                <span className="flex size-7 items-center justify-center rounded-lg bg-[#FFE4E8] text-[#E55067] border border-[#1E293B] shadow-[1px_1px_0px_#1E293B]">
                  <svg
                    className="size-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <div>
                  <h3 className="text-sm font-bold text-[#1E293B]">
                    Chọn vị trí của bạn
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Khoảng cách các quán ăn sẽ tính từ vị trí này
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(false)}
                className="size-7 rounded-lg border border-[#1E293B] bg-neutral-100 flex items-center justify-center text-xs font-bold text-[#1E293B] hover:bg-neutral-200 shadow-[1px_1px_0px_#1E293B] transition-colors cursor-pointer"
                aria-label="Đóng"
              >
                ✕
              </button>
            </div>

            {}
            <div className="mb-4">
              <button
                type="button"
                onClick={handleLocateCurrentPosition}
                disabled={isLocating}
                className="w-full flex items-center justify-center gap-2 rounded-lg border border-[#1E293B] bg-[#FFF0F2] py-2.5 px-3 text-xs font-bold text-[#E55067] shadow-[1.5px_1.5px_0px_#1E293B] hover:bg-[#FFE4E8] transition-all cursor-pointer disabled:opacity-75"
              >
                <svg
                  className={`size-4 ${isLocating ? "animate-spin" : ""}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M22 12h-4M6 12H2M12 6V2M12 22v-4" />
                </svg>
                <span>
                  {isLocating
                    ? "Đang dò GPS thiết bị..."
                    : "🎯 Định vị GPS tự động (Chính xác)"}
                </span>
              </button>

              {locateError && (
                <p className="mt-1.5 text-[11px] font-medium text-rose-600 bg-rose-50 border border-rose-200 rounded-md p-2">
                  {locateError}
                </p>
              )}
            </div>

            {}
            <div className="mb-4">
              <p className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">
                Khu vực phổ biến
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 max-h-[180px] overflow-y-auto p-0.5">
                {POPULAR_LOCATION_PRESETS.map((preset) => {
                  const isSelected =
                    userLocation?.addressName?.includes(preset.district) ||
                    userLocation?.city === preset.district
                  return (
                    <button
                      type="button"
                      key={preset.id}
                      onClick={() => handleSelectPreset(preset)}
                      className={`rounded-lg border px-2.5 py-1.5 text-left text-[11.5px] font-semibold transition-all cursor-pointer truncate ${
                        isSelected
                          ? "border-[#1E293B] bg-[#E55067] text-white shadow-[1px_1px_0px_#1E293B]"
                          : "border-[#1E293B] bg-neutral-50 text-[#1E293B] hover:bg-[#FFF0F2] shadow-[1px_1px_0px_#1E293B]"
                      }`}
                      title={preset.name}
                    >
                      📍 {preset.name.split(",")[0]}
                    </button>
                  )
                })}
              </div>
            </div>

            {}
            <form
              onSubmit={handleCustomSubmit}
              className="pt-3 border-t border-[#E8DDD1]"
            >
              <label className="block text-xs font-bold text-[#64748B] uppercase tracking-wider mb-1.5">
                Hoặc nhập địa chỉ cụ thể
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customInput}
                  onChange={(e) => setCustomInput(e.target.value)}
                  placeholder="Ví dụ: Dĩ An, Bến Nghé, Phú Nhuận..."
                  className="flex-1 rounded-lg border border-[#1E293B] bg-[#FAF6F1]/50 px-3 py-1.5 text-xs text-[#1E293B] shadow-[1px_1px_0px_#1E293B] focus:border-[#E55067] focus:outline-none"
                />
                <button
                  type="submit"
                  className="rounded-lg border border-[#1E293B] bg-[#E55067] px-3.5 py-1.5 text-xs font-bold text-white shadow-[1px_1px_0px_#1E293B] hover:bg-[#d64058] transition-colors cursor-pointer"
                >
                  Áp dụng
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
          Khoảng cách
        </h3>

        {}
        <button
          type="button"
          onClick={() =>
            setDistance(filter.distance === "under-5" ? "all" : "under-5")
          }
          className={`w-full rounded-lg py-2 text-center text-xs font-semibold border border-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B] transition-all cursor-pointer ${
            filter.distance === "under-5"
              ? "bg-[#E55067] text-white"
              : "bg-neutral-50 text-[#1E293B] hover:bg-neutral-100"
          }`}
        >
          Trong bán kính 5km
        </button>

        {}
        <div className="space-y-2 text-xs font-medium text-[#1E293B]">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="distance"
              checked={filter.distance === "1-3"}
              onChange={() => setDistance("1-3")}
              className="accent-[#E55067]"
            />
            <span>1 - 3km</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="distance"
              checked={filter.distance === "3-5"}
              onChange={() => setDistance("3-5")}
              className="accent-[#E55067]"
            />
            <span>3 - 5km</span>
          </label>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="radio"
              name="distance"
              checked={filter.distance === "above-5"}
              onChange={() => setDistance("above-5")}
              className="accent-[#E55067]"
            />
            <span>Trên 5km</span>
          </label>
        </div>
      </div>

      {}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
          Loại hình
        </h3>
        <div className="space-y-2.5 text-xs font-medium text-[#1E293B]">
          {[
            { id: "quan-an", label: "Quán ăn" },
            { id: "ca-phe", label: "Cà phê" },
            { id: "nha-hang", label: "Nhà hàng" },
            { id: "via-he", label: "Quán vỉa hè" },
            { id: "khac", label: "Khác" },
          ].map((item) => (
            <label
              key={item.id}
              className="flex cursor-pointer items-center justify-between hover:text-[#E55067] transition-colors"
            >
              <span>{item.label}</span>
              <input
                type="checkbox"
                checked={filter.categories.includes(item.id)}
                onChange={() => toggleCategory(item.id)}
                className="size-4 rounded-sm border border-[#D8C7B5] accent-[#E55067]"
              />
            </label>
          ))}
        </div>
      </div>

      {}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
          Mức giá
        </h3>
        <div className="space-y-2.5 text-xs font-medium text-[#1E293B]">
          {[
            { id: "duoi-100k", label: "Dưới 100k" },
            { id: "100k-200k", label: "100k - 200k" },
            { id: "200k-300k", label: "200k - 300k" },
            { id: "tren-300k", label: "Trên 300k" },
          ].map((price) => (
            <label
              key={price.id}
              className="flex cursor-pointer items-center justify-between hover:text-[#E55067] transition-colors"
            >
              <span>{price.label}</span>
              <input
                type="checkbox"
                checked={filter.priceRange.includes(price.id)}
                onChange={() => togglePrice(price.id)}
                className="size-4 rounded-sm border border-[#D8C7B5] accent-[#E55067]"
              />
            </label>
          ))}
        </div>
      </div>

      {}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
          Đánh giá
        </h3>
        <div className="space-y-2 text-xs font-medium text-[#1E293B]">
          {[
            { stars: 5, value: 4.5, label: "Từ 4.5 trở lên" },
            { stars: 4, value: 4.0, label: "Từ 4.0 trở lên" },
            { stars: 3, value: 3.5, label: "Từ 3.5 trở lên" },
          ].map((r) => (
            <button
              type="button"
              key={r.value}
              onClick={() => setMinRating(r.value)}
              className={`flex w-full items-center justify-between rounded-lg px-2.5 py-1.5 border transition-all cursor-pointer ${
                filter.minRating === r.value
                  ? "border-[#F8B4C0] bg-[#FFE4E8] text-[#E55067] font-bold"
                  : "border-transparent hover:border-[#E8DDD1] hover:bg-neutral-50"
              }`}
            >
              <div className="flex items-center gap-1 text-[#FBBF24]">
                {"★".repeat(r.stars)}
                {"☆".repeat(5 - r.stars)}
              </div>
              <span className="text-[11px] font-medium text-[#1E293B]">
                {r.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </aside>
  )
}
