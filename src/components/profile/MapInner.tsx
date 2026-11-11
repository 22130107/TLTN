"use client"

// Khởi tạo bản đồ 1 lần duy nhất
// eslint-disable-next-line react-hooks/exhaustive-deps

// Cập nhật vị trí điểm khởi hành / Vị trí người dùng (Home Marker & Accuracy Circle)

// Vẽ vòng tròn bán kính sai số GPS nếu có

// Nếu vừa cập nhật GPS, bay mượt đến vị trí người dùng và mở popup

// Cập nhật markers cho các điểm dừng ẩm thực

// FlyTo khi chọn lịch trình tương ứng
/* Floating GPS Locate Button on the Map */

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "./map.css"
import type { LocationCoordinate, ScheduleItem } from "@/types/profile"

export interface MapInnerProps {
  homeCoordinate: LocationCoordinate
  userName: string
  items: ScheduleItem[]
  selectedScheduleId: string | null
  onSelectSchedule: (id: string) => void
  isGPSLocation?: boolean
  locationAddress?: string
  accuracy?: number
  onLocateCurrentPosition?: () => void
  isLocating?: boolean
}

export default function MapInner({
  homeCoordinate,
  userName,
  items,
  selectedScheduleId,
  onSelectSchedule,
  isGPSLocation = false,
  locationAddress,
  accuracy,
  onLocateCurrentPosition,
  isLocating = false,
}: MapInnerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<L.Map | null>(null)
  const markersMapRef = useRef<Map<string, L.Marker>>(new Map())
  const homeMarkerRef = useRef<L.Marker | null>(null)
  const accuracyCircleRef = useRef<L.Circle | null>(null)
  const onSelectScheduleRef = useRef(onSelectSchedule)
  onSelectScheduleRef.current = onSelectSchedule
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    if ((container as unknown as { _leaflet_id?: number })._leaflet_id) {
      delete (container as unknown as { _leaflet_id?: number })._leaflet_id
    }

    const mapInstance = L.map(container, {
      center: [homeCoordinate.lat, homeCoordinate.lng],
      zoom: 14,
      zoomControl: true,
      scrollWheelZoom: true,
    })

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(mapInstance)

    setMap(mapInstance)

    const t1 = setTimeout(() => mapInstance.invalidateSize(), 50)
    const t2 = setTimeout(() => mapInstance.invalidateSize(), 200)
    const t3 = setTimeout(() => mapInstance.invalidateSize(), 500)

    let resizeObserver: ResizeObserver | null = null
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        mapInstance.invalidateSize()
      })
      resizeObserver.observe(container)
    }

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
      if (resizeObserver) {
        resizeObserver.disconnect()
      }
      mapInstance.remove()
      setMap(null)
      markersMapRef.current.clear()
      homeMarkerRef.current = null
      accuracyCircleRef.current = null
    }
  }, [])
  useEffect(() => {
    if (!map) return

    if (homeMarkerRef.current) {
      homeMarkerRef.current.remove()
    }
    if (accuracyCircleRef.current) {
      accuracyCircleRef.current.remove()
    }
    if (isGPSLocation && accuracy && accuracy > 0) {
      accuracyCircleRef.current = L.circle(
        [homeCoordinate.lat, homeCoordinate.lng],
        {
          radius: Math.min(accuracy, 800),
          color: "#10B981",
          fillColor: "#10B981",
          fillOpacity: 0.12,
          weight: 1.5,
          dashArray: "3, 5",
        },
      ).addTo(map)
    }

    const homeHtml = `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 38px; height: 38px;">
        <span style="position: absolute; width: 38px; height: 38px; border-radius: 9999px; background-color: #10B981; opacity: 0.35; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
        <div style="position: relative; width: 30px; height: 30px; border-radius: 9999px; background-color: #10B981; border: 2.5px solid #1E293B; box-shadow: 2px 2px 0px #1E293B; display: flex; align-items: center; justify-content: center; color: #ffffff;">
          <svg style="width: 15px; height: 15px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            ${
              isGPSLocation
                ? '<circle cx="12" cy="12" r="3"/><circle cx="12" cy="12" r="8"/><line x1="12" y1="2" x2="12" y2="4"/><line x1="12" y1="20" x2="12" y2="22"/><line x1="2" y1="12" x2="4" y2="12"/><line x1="20" y1="12" x2="22" y2="12"/>'
                : '<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'
            }
          </svg>
        </div>
      </div>
    `

    const homeIcon = L.divIcon({
      html: homeHtml,
      className: "!bg-transparent !border-0",
      iconSize: [38, 38],
      iconAnchor: [19, 19],
      popupAnchor: [0, -19],
    })

    const marker = L.marker([homeCoordinate.lat, homeCoordinate.lng], {
      icon: homeIcon,
      zIndexOffset: 1500,
    }).addTo(map)

    const homePopupContent = `
      <div style="font-family: inherit; padding: 6px 8px; text-align: center; color: #1E293B; min-width: 160px; max-width: 240px;">
        <div style="font-size: 13px; font-weight: 800; color: #1E293B;">${userName}</div>
        <div style="font-size: 11px; color: #059669; font-weight: 700; margin-top: 3px; display: flex; align-items: center; justify-content: center; gap: 4px;">
          <span>📍</span><span>${
            isGPSLocation ? "Vị trí thực tế của bạn" : "Điểm khởi hành"
          }</span>
        </div>
        ${
          locationAddress
            ? `<div style="font-size: 11px; color: #475569; font-weight: 600; margin-top: 4px; border-top: 1px dashed #CBD5E1; padding-top: 4px; line-height: 1.35;">${locationAddress}</div>`
            : ""
        }
        ${
          accuracy && isGPSLocation
            ? `<div style="font-size: 10px; color: #94A3B8; margin-top: 2px;">Sai số GPS: ±${Math.round(accuracy)}m</div>`
            : ""
        }
      </div>
    `

    marker.bindPopup(homePopupContent)
    homeMarkerRef.current = marker
    if (isGPSLocation) {
      map.flyTo([homeCoordinate.lat, homeCoordinate.lng], 15, {
        animate: true,
        duration: 1.2,
      })
      const openTimer = setTimeout(() => {
        marker.openPopup()
      }, 500)
      return () => clearTimeout(openTimer)
    }
  }, [
    map,
    homeCoordinate.lat,
    homeCoordinate.lng,
    userName,
    isGPSLocation,
    locationAddress,
    accuracy,
  ])
  useEffect(() => {
    if (!map) return

    markersMapRef.current.forEach((marker) => marker.remove())
    markersMapRef.current.clear()

    items.forEach((item, index) => {
      const isSelected = item.id === selectedScheduleId

      const pinHtml = `
        <div class="custom-pin-wrapper" style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s ease; ${
          isSelected ? "transform: scale(1.2); z-index: 1000;" : ""
        }">
          <div style="position: relative; width: 32px; height: 32px; border-radius: 9999px; background-color: ${
            isSelected ? "#FF5376" : "#ffffff"
          }; border: 2.5px solid #1E293B; box-shadow: ${
            isSelected ? "2px 2px 0px #1E293B" : "1px 1px 0px #1E293B"
          }; display: flex; align-items: center; justify-content: center; color: ${
            isSelected ? "#ffffff" : "#1E293B"
          }; font-weight: 900; font-size: 13px;">
            ${index + 1}
          </div>
          <div style="width: 7px; height: 7px; transform: rotate(45deg); background-color: ${
            isSelected ? "#FF5376" : "#ffffff"
          }; margin-top: -4px; border-right: 2.5px solid #1E293B; border-bottom: 2.5px solid #1E293B;"></div>
        </div>
      `

      const foodIcon = L.divIcon({
        html: pinHtml,
        className: "!bg-transparent !border-0",
        iconSize: [32, 40],
        iconAnchor: [16, 38],
        popupAnchor: [0, -38],
      })

      const marker = L.marker([item.coordinates.lat, item.coordinates.lng], {
        icon: foodIcon,
      }).addTo(map)

      const popupHtml = `
        <div style="width: 240px; font-family: inherit; overflow: hidden; background: #ffffff; color: #1E293B;">
          <div style="position: relative; width: 100%; height: 115px; border-radius: 12px; border: 2px solid #1E293B; overflow: hidden; margin-bottom: 10px; background-color: #f5f5f5;">
            <img src="${item.imageUrl}" alt="${item.placeName}" style="width: 100%; height: 100%; object-fit: cover; display: block;" />
            <span style="position: absolute; top: 6px; right: 6px; background-color: #FF5376; border: 1.5px solid #1E293B; color: #ffffff; font-size: 10px; font-weight: 800; padding: 2px 8px; border-radius: 9999px; box-shadow: 1px 1px 0px #1E293B;">${item.category}</span>
          </div>
          <h4 style="margin: 0 0 4px; font-size: 14px; font-weight: 800; color: #1E293B; line-height: 1.3;">${item.placeName}</h4>
          <p style="margin: 0 0 8px; font-size: 11.5px; color: #475569; line-height: 1.35; font-weight: 600;">📍 ${item.address}</p>
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: #1E293B; border-top: 1.5px solid #1E293B; padding-top: 8px; font-weight: 700;">
            <span>⏰ ${item.time}</span>
            <span style="background: #FFF1F2; border: 1.5px solid #1E293B; color: #E11D48; padding: 2px 8px; border-radius: 9999px; font-size: 10.5px; font-weight: 800;">${item.guestsCount} khách</span>
          </div>
          <a href="/places/${item.id}" style="display: block; margin-top: 8px; text-align: center; background-color: #FF5376; border: 2px solid #1E293B; box-shadow: 2px 2px 0px #1E293B; color: #ffffff; text-decoration: none; padding: 6px 12px; border-radius: 10px; font-size: 11.5px; font-weight: 800;">Xem chi tiết quán →</a>
        </div>
      `

      marker.bindPopup(popupHtml)

      marker.on("click", () => {
        onSelectScheduleRef.current(item.id)
      })

      markersMapRef.current.set(item.id, marker)
    })
  }, [map, items, selectedScheduleId])
  useEffect(() => {
    if (!map || !selectedScheduleId) return

    const targetItem = items.find((item) => item.id === selectedScheduleId)
    if (!targetItem) return

    map.flyTo([targetItem.coordinates.lat, targetItem.coordinates.lng], 16, {
      animate: true,
      duration: 1.2,
    })

    const marker = markersMapRef.current.get(selectedScheduleId)
    if (marker) {
      const popupTimer = setTimeout(() => {
        marker.openPopup()
      }, 350)
      return () => clearTimeout(popupTimer)
    }
  }, [map, selectedScheduleId, items])

  return (
    <div
      className="relative w-full h-full min-h-[360px] sm:min-h-[420px] lg:min-h-[440px]"
      style={{ width: "100%", height: "100%" }}
    >
      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        .custom-pin-wrapper:hover {
          transform: scale(1.15);
        }
        .leaflet-popup-content-wrapper {
          background: #ffffff !important;
          color: #1E293B !important;
          border: 2px solid #1E293B !important;
          border-radius: 18px !important;
          box-shadow: 4px 4px 0px #1E293B !important;
          padding: 4px !important;
          overflow: hidden !important;
        }
        .leaflet-popup-content {
          margin: 10px !important;
          line-height: 1.4 !important;
        }
        .leaflet-popup-tip {
          background: #ffffff !important;
          border: 2px solid #1E293B !important;
        }
        .leaflet-container {
          font-family: inherit !important;
          background-color: #f8fafc !important;
          border-radius: 16px !important;
        }
      `}</style>
      <div ref={containerRef} className="h-full w-full" />

      {}
      {onLocateCurrentPosition && (
        <div className="absolute bottom-4 right-4 z-[999]">
          <button
            type="button"
            onClick={onLocateCurrentPosition}
            disabled={isLocating}
            className="flex items-center gap-2 rounded-xl border-2 border-[#1E293B] bg-white px-3.5 py-2 text-xs font-black text-[#1E293B] shadow-[3px_3px_0px_#1E293B] hover:bg-[#F0FDF4] hover:text-[#059669] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer disabled:opacity-75 disabled:cursor-wait"
            title="Định vị vị trí hiện tại của bạn"
          >
            {isLocating ? (
              <>
                <svg
                  className="size-4 animate-spin text-[#059669]"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  />
                </svg>
                <span>Đang định vị GPS...</span>
              </>
            ) : (
              <>
                <svg
                  className={`size-4 ${
                    isGPSLocation ? "text-[#10B981]" : "text-[#1E293B]"
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="3" />
                  <circle cx="12" cy="12" r="8" />
                  <line x1="12" y1="2" x2="12" y2="4" />
                  <line x1="12" y1="20" x2="12" y2="22" />
                  <line x1="2" y1="12" x2="4" y2="12" />
                  <line x1="20" y1="12" x2="22" y2="12" />
                </svg>
                <span>
                  {isGPSLocation ? "Cập nhật lại GPS" : "Vị trí của tôi"}
                </span>
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
