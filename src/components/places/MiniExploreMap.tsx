"use client"

// 1. Khởi tạo bản đồ Leaflet

// Tránh lỗi tái khởi tạo trên cùng DOM node

// Sử dụng OpenStreetMap tiles

// Thêm nút zoom ở góc trên bên phải gọn gàng

// Invalidate size sau khi mount để tránh xé hình
// eslint-disable-next-line react-hooks/exhaustive-deps

// 2. Cập nhật vị trí người dùng (User Pin với radar pulse)

// Bay mượt tới vị trí mới

// 3. Cập nhật các điểm quán ăn lân cận trên bản đồ

// Xóa markers cũ

// Vẽ markers quán ăn mới

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
import "@/components/profile/map.css"

export interface MiniExplorePlace {
  id: string
  name: string
  lat: number
  lng: number
  rating?: number
  district?: string
  badge?: string
}

export interface MiniExploreMapProps {
  center: { lat: number; lng: number }
  locationName: string
  isGPS?: boolean
  places?: MiniExplorePlace[]
}

export default function MiniExploreMap({
  center,
  locationName,
  isGPS = false,
  places = [],
}: MiniExploreMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const userMarkerRef = useRef<L.Marker | null>(null)
  const placeMarkersRef = useRef<Map<string, L.Marker>>(new Map())
  const [isMapReady, setIsMapReady] = useState(false)
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    if ((container as unknown as { _leaflet_id?: number })._leaflet_id) {
      delete (container as unknown as { _leaflet_id?: number })._leaflet_id
    }

    const mapInstance = L.map(container, {
      center: [center.lat, center.lng],
      zoom: 14,
      zoomControl: false,
      scrollWheelZoom: true,
      attributionControl: false,
    })
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(mapInstance)
    L.control.zoom({ position: "topright" }).addTo(mapInstance)

    mapRef.current = mapInstance
    setIsMapReady(true)
    const t1 = setTimeout(() => mapInstance.invalidateSize(), 100)
    const t2 = setTimeout(() => mapInstance.invalidateSize(), 300)

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
      if (resizeObserver) resizeObserver.disconnect()
      mapInstance.remove()
      mapRef.current = null
      userMarkerRef.current = null
      placeMarkersRef.current.clear()
      setIsMapReady(false)
    }
  }, [])
  useEffect(() => {
    const map = mapRef.current
    if (!map || !isMapReady) return

    if (userMarkerRef.current) {
      userMarkerRef.current.remove()
    }

    const pinHtml = `
      <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 34px; height: 34px;">
        <span style="position: absolute; width: 34px; height: 34px; border-radius: 9999px; background-color: #E55067; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
        <div style="position: relative; width: 26px; height: 26px; border-radius: 9999px; background-color: #E55067; border: 2px solid #1E293B; box-shadow: 2px 2px 0px #1E293B; display: flex; align-items: center; justify-content: center; color: #ffffff;">
          <svg style="width: 14px; height: 14px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        </div>
      </div>
    `

    const userIcon = L.divIcon({
      html: pinHtml,
      className: "!bg-transparent !border-0",
      iconSize: [34, 34],
      iconAnchor: [17, 17],
      popupAnchor: [0, -17],
    })

    const marker = L.marker([center.lat, center.lng], {
      icon: userIcon,
      zIndexOffset: 2000,
    }).addTo(map)

    const popupHtml = `
      <div style="font-family: inherit; padding: 4px 6px; text-align: center; color: #1E293B; min-width: 140px;">
        <div style="font-size: 11px; font-weight: 800; color: #E55067; text-transform: uppercase; letter-spacing: 0.5px;">
          ${isGPS ? "📍 Vị trí GPS của bạn" : "📍 Vị trí đã chọn"}
        </div>
        <div style="font-size: 12px; font-weight: 700; color: #1E293B; margin-top: 2px; line-height: 1.3;">
          ${locationName}
        </div>
      </div>
    `
    marker.bindPopup(popupHtml)
    userMarkerRef.current = marker
    map.flyTo([center.lat, center.lng], 14, {
      animate: true,
      duration: 1.0,
    })
  }, [center.lat, center.lng, locationName, isGPS, isMapReady])
  useEffect(() => {
    const map = mapRef.current
    if (!map || !isMapReady) return
    placeMarkersRef.current.forEach((marker) => marker.remove())
    placeMarkersRef.current.clear()
    places.forEach((place) => {
      if (!place.lat || !place.lng) return

      const placeHtml = `
        <div style="position: relative; width: 22px; height: 22px; border-radius: 9999px; background-color: #ffffff; border: 1.5px solid #1E293B; box-shadow: 1.5px 1.5px 0px #1E293B; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform 0.2s;">
          <span style="font-size: 11px; font-weight: 900; color: #E55067;">★</span>
        </div>
      `

      const placeIcon = L.divIcon({
        html: placeHtml,
        className: "!bg-transparent !border-0",
        iconSize: [22, 22],
        iconAnchor: [11, 11],
        popupAnchor: [0, -11],
      })

      const marker = L.marker([place.lat, place.lng], {
        icon: placeIcon,
        zIndexOffset: 1000,
      }).addTo(map)

      const popupContent = `
        <div style="font-family: inherit; padding: 4px 6px; text-align: left; color: #1E293B; min-width: 150px;">
          <div style="font-size: 12px; font-weight: 800; color: #1E293B; line-clamp: 1;">
            ${place.name}
          </div>
          <div style="font-size: 10px; color: #64748B; margin-top: 2px;">
            ${place.district || "TP. Hồ Chí Minh"} ${
              place.rating ? `• ${place.rating} ★` : ""
            }
          </div>
          <a href="/places/${place.id}" style="display: inline-block; margin-top: 5px; font-size: 10.5px; font-weight: 700; color: #E55067; text-decoration: underline;">
            Xem chi tiết quán →
          </a>
        </div>
      `
      marker.bindPopup(popupContent)
      placeMarkersRef.current.set(place.id, marker)
    })
  }, [places, isMapReady])

  return (
    <div className="relative size-full min-h-[160px] sm:min-h-[180px]">
      <div ref={containerRef} className="size-full z-0" />
    </div>
  )
}
