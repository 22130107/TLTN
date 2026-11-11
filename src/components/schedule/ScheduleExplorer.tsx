"use client"

// Quản lý vị trí người dùng (mặc định lấy từ userProfile, cập nhật động bằng vị trí GPS thực tế)

// Khôi phục vị trí GPS đã lưu từ localStorage nếu có

// Xử lý lấy vị trí GPS thực tế của người dùng

// Tra cứu địa chỉ thực tế từ OpenStreetMap Nominatim

// Lưu vào cache để ghi nhớ vị trí người dùng

// Fetch lịch trình của chính user khi auth state thay đổi
/* Page Title & Filter Bar */ /* Action Button & Filter Tabs */ /* Quick Filter Tabs */ /* 2-Column Content Layout: Map on Left (Sticky), Timeline on Right */ /* Cột trái (Sticky trên Desktop): Bản đồ vị trí tương tác */ /* Cột phải: Dòng thời gian lịch trình chi tiết */ /* Modal Tạo Lịch Hẹn */

import { useState, useMemo, useEffect, useCallback } from "react"
import InteractiveMap from "@/components/profile/InteractiveMap"
import ScheduleTimeline from "@/components/profile/ScheduleTimeline"
import CreateScheduleModal from "@/components/schedule/CreateScheduleModal"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase/client"
import {
  requestCurrentPosition,
  reverseGeocodeOsm,
  getSavedUserLocation,
  saveUserLocation,
} from "@/utils/geolocation"
import type {
  ScheduleItem,
  ScheduleStatus,
  UserProfile,
  LocationCoordinate,
} from "@/types/profile"
import type { Database } from "@/lib/supabase/types"

type ScheduleRow = Database["public"]["Tables"]["schedules"]["Row"]
type PlaceRow = Database["public"]["Tables"]["places"]["Row"]

interface ScheduleWithPlaceRow extends ScheduleRow {
  places: PlaceRow | null
}

const filterLabelMap: Record<"all" | "upcoming" | "completed", string> = {
  all: "Tất cả",
  upcoming: "Sắp tới",
  completed: "Đã ghé",
}

interface ScheduleExplorerProps {
  initialSchedules: ScheduleItem[]
  userProfile: UserProfile
  places: Array<{ id: string; name: string }>
}

function mapRowToScheduleItem(row: ScheduleWithPlaceRow): ScheduleItem {
  const place = row.places

  let mappedStatus: ScheduleStatus = "upcoming"
  if (row.status === "completed") {
    mappedStatus = "completed"
  } else if (row.status === "confirmed" || row.status === "pending") {
    mappedStatus = "upcoming"
  }

  let signatureDish = "Món ăn đặc sắc"
  if (place?.menu_items && Array.isArray(place.menu_items)) {
    const items = place.menu_items as Array<{
      isSignature?: boolean
      name?: string
    }>
    const sig = items.find((m) => m?.isSignature)
    if (sig?.name) {
      signatureDish = sig.name
    } else if (items[0]?.name) {
      signatureDish = items[0].name
    }
  }

  return {
    id: row.id,
    placeId: row.place_id,
    userId: row.user_id,
    placeName: place?.name || "Địa điểm ẩm thực",
    category:
      place?.badge || (place?.tags ? place.tags.join(" • ") : "Ẩm thực"),
    address: place?.address || "TP. Hồ Chí Minh",
    date: row.scheduled_date,
    time: row.time_slot,
    status: mappedStatus,
    coordinates: {
      lat: place?.latitude || 10.7769,
      lng: place?.longitude || 106.7009,
    },
    guestsCount: row.party_size || 2,
    signatureDish,
    notes: row.notes || place?.story || "Lịch trình ẩm thực",
    imageUrl: place?.image || "/img/sakura-restaurant.jpg",
  }
}

export default function ScheduleExplorer({
  initialSchedules,
  userProfile,
  places,
}: ScheduleExplorerProps) {
  const { user, openAuthModal } = useAuth()

  const [schedules, setSchedules] = useState<ScheduleItem[]>(initialSchedules)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [filterStatus, setFilterStatus] =
    useState<"all" | "upcoming" | "completed">("all")
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(
    initialSchedules[0]?.id || null,
  )
  const [currentCoordinate, setCurrentCoordinate] =
    useState<LocationCoordinate>(userProfile.homeCoordinate)
  const [isGPSLocation, setIsGPSLocation] = useState(false)
  const [locationAddress, setLocationAddress] = useState<string | undefined>()
  const [locationAccuracy, setLocationAccuracy] = useState<number | undefined>()
  const [isLocating, setIsLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)
  useEffect(() => {
    const saved = getSavedUserLocation()
    if (saved && saved.isGPS) {
      setCurrentCoordinate({ lat: saved.lat, lng: saved.lng })
      setIsGPSLocation(true)
      setLocationAddress(saved.addressName)
      setLocationAccuracy(saved.accuracy)
    }
  }, [])
  const handleLocateCurrentPosition = async () => {
    setIsLocating(true)
    setLocationError(null)

    try {
      const pos = await requestCurrentPosition()
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude
      const acc = pos.coords.accuracy
      const geo = await reverseGeocodeOsm(lat, lng)

      const newCoord: LocationCoordinate = {
        lat,
        lng,
        accuracy: acc,
        addressName: geo.addressName,
      }

      setCurrentCoordinate(newCoord)
      setIsGPSLocation(true)
      setLocationAddress(geo.addressName)
      setLocationAccuracy(acc)
      saveUserLocation({
        lat,
        lng,
        accuracy: acc,
        addressName: geo.addressName,
        city: geo.city,
        isGPS: true,
      })
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Không thể lấy vị trí hiện tại."
      setLocationError(message)
    } finally {
      setIsLocating(false)
    }
  }
  const fetchUserSchedules = useCallback(async () => {
    if (!user) {
      setSchedules([])
      setSelectedScheduleId(null)
      return
    }

    try {
      const { data, error } = await supabase
        .from("schedules")
        .select("*, places(*)")
        .eq("user_id", user.id)
        .order("scheduled_date", { ascending: true })

      if (!error && data) {
        const mapped = (data as unknown as ScheduleWithPlaceRow[]).map(
          mapRowToScheduleItem,
        )
        setSchedules(mapped)
        if (mapped.length > 0) {
          setSelectedScheduleId((prev) =>
            prev && mapped.some((m) => m.id === prev) ? prev : mapped[0].id,
          )
        } else {
          setSelectedScheduleId(null)
        }
      }
    } catch (err) {
      console.error("[ScheduleExplorer] fetch error:", err)
    }
  }, [user])

  useEffect(() => {
    fetchUserSchedules()
  }, [user, fetchUserSchedules])

  const schedulesCount = useMemo(() => {
    return {
      all: schedules.length,
      upcoming: schedules.filter((item) => item.status === "upcoming").length,
      completed: schedules.filter((item) => item.status === "completed").length,
    }
  }, [schedules])

  const filteredItems = useMemo(() => {
    if (filterStatus === "upcoming") {
      return schedules.filter((item) => item.status === "upcoming")
    }

    if (filterStatus === "completed") {
      return schedules.filter((item) => item.status === "completed")
    }

    return schedules
  }, [filterStatus, schedules])

  const handleFilterChange = (status: "all" | "upcoming" | "completed") => {
    setFilterStatus(status)

    const newItems = schedules.filter((item) => {
      if (status === "all") return true
      return item.status === status
    })

    if (newItems.length > 0) {
      if (!newItems.some((item) => item.id === selectedScheduleId)) {
        setSelectedScheduleId(newItems[0].id)
      }
    } else {
      setSelectedScheduleId(null)
    }
  }

  const handleSelectSchedule = (id: string) => {
    setSelectedScheduleId(id)

    if (typeof document !== "undefined") {
      const element = document.getElementById("schedule-item-" + id)
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "nearest" })
      }
    }
  }

  const handleOpenCreateModal = () => {
    if (!user) {
      openAuthModal("login")
      return
    }
    setIsModalOpen(true)
  }

  const filterTabs: Array<{
    id: "all" | "upcoming" | "completed"
    label: string
    count: number
  }> = [
    { id: "all", label: "Tất cả", count: schedulesCount.all },
    { id: "upcoming", label: "Sắp tới", count: schedulesCount.upcoming },
    { id: "completed", label: "Đã ghé", count: schedulesCount.completed },
  ]

  return (
    <>
      {}
      <div className="mb-8 rounded-3xl border-2 border-[#1E293B] bg-white p-6 sm:p-8 shadow-[4px_4px_0px_#1E293B]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border-2 border-[#1E293B] px-3.5 py-1 text-xs font-bold text-[#FF5376] uppercase tracking-wider mb-2.5 shadow-[2px_2px_0px_#1E293B]">
              <span>🗺️</span>
              <span>Hành Trình Food Tour</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1E293B] tracking-tight">
              Lịch Trình Ẩm Thực & Bản Đồ Điểm Hẹn
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-600 font-semibold">
              {user
                ? `Chào ${userProfile.name}, đây là danh sách điểm hẹn ẩm thực cá nhân của bạn.`
                : "Vui lòng đăng nhập để xem và quản lý danh sách lịch hẹn cá nhân của bạn."}
            </p>
          </div>

          {}
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#1E293B] bg-[#FF5376] px-4 py-2.5 text-xs sm:text-sm font-black text-white shadow-[3px_3px_0px_#1E293B] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all cursor-pointer"
            >
              <span>+</span>
              <span>Tạo Lịch Hẹn Mới</span>
            </button>

            {}
            <div className="inline-flex items-center gap-1 rounded-full border-2 border-[#1E293B] bg-[#FFF5EF] p-1.5 shadow-[2px_2px_0px_#1E293B]">
              {filterTabs.map((tab) => {
                const isActive = filterStatus === tab.id

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => handleFilterChange(tab.id)}
                    className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                      isActive
                        ? "bg-[#FF5376] text-white border-2 border-[#1E293B] shadow-[2px_2px_0px_#1E293B]"
                        : "text-[#1E293B] hover:text-[#FF5376] hover:bg-white"
                    }`}
                  >
                    <span>{tab.label}</span>
                    <span
                      className={`inline-flex items-center justify-center px-2 py-0.2 text-[10.5px] leading-tight font-extrabold rounded-full border border-[#1E293B] ${
                        isActive
                          ? "bg-white text-[#1E293B]"
                          : "bg-white text-[#1E293B]"
                      }`}
                    >
                      {tab.count}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {}
      <div className="grid grid-cols-1 items-start gap-6 sm:gap-8 lg:grid-cols-12">
        {}
        <section className="lg:col-span-6 lg:sticky lg:top-24">
          <InteractiveMap
            homeCoordinate={currentCoordinate}
            userName={userProfile.name}
            items={filteredItems}
            selectedScheduleId={selectedScheduleId}
            onSelectSchedule={handleSelectSchedule}
            isGPSLocation={isGPSLocation}
            locationAddress={locationAddress}
            accuracy={locationAccuracy}
            onLocateCurrentPosition={handleLocateCurrentPosition}
            isLocating={isLocating}
            locationError={locationError}
            onDismissError={() => setLocationError(null)}
          />
        </section>

        {}
        <section className="lg:col-span-6">
          <ScheduleTimeline
            items={filteredItems}
            selectedScheduleId={selectedScheduleId}
            onSelectSchedule={handleSelectSchedule}
            filterLabel={filterLabelMap[filterStatus]}
          />
        </section>
      </div>

      {}
      <CreateScheduleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchUserSchedules}
        places={places}
      />
    </>
  )
}
