export interface UserGeoPosition {
  lat: number
  lng: number
  accuracy?: number
  addressName?: string
  city?: string
  isGPS: boolean
}

const STORAGE_KEY = "hyun_user_geolocation"

/**
 * Danh sách tọa độ chuẩn các quận huyện và thành phố phổ biến
 */
export const POPULAR_LOCATION_PRESETS = [
  {
    id: "quan-1",
    name: "Quận 1, TP. Hồ Chí Minh",
    lat: 10.7769,
    lng: 106.7009,
    district: "Quận 1",
  },
  {
    id: "quan-3",
    name: "Quận 3, TP. Hồ Chí Minh",
    lat: 10.7828,
    lng: 106.6853,
    district: "Quận 3",
  },
  {
    id: "binh-thanh",
    name: "Bình Thạnh, TP. Hồ Chí Minh",
    lat: 10.803,
    lng: 106.698,
    district: "Bình Thạnh",
  },
  {
    id: "phu-nhuan",
    name: "Phú Nhuận, TP. Hồ Chí Minh",
    lat: 10.7992,
    lng: 106.6803,
    district: "Phú Nhuận",
  },
  {
    id: "di-an",
    name: "Phường Dĩ An, TP. Dĩ An",
    lat: 10.9067,
    lng: 106.7722,
    district: "Dĩ An",
  },
  {
    id: "thu-duc",
    name: "TP. Thủ Đức, TP. Hồ Chí Minh",
    lat: 10.8494,
    lng: 106.7537,
    district: "Thủ Đức",
  },
  {
    id: "quan-7",
    name: "Quận 7, TP. Hồ Chí Minh",
    lat: 10.734,
    lng: 106.7218,
    district: "Quận 7",
  },
  {
    id: "quan-10",
    name: "Quận 10, TP. Hồ Chí Minh",
    lat: 10.7716,
    lng: 106.6669,
    district: "Quận 10",
  },
  {
    id: "quan-5",
    name: "Quận 5, TP. Hồ Chí Minh",
    lat: 10.754,
    lng: 106.666,
    district: "Quận 5",
  },
  {
    id: "tan-binh",
    name: "Tân Bình, TP. Hồ Chí Minh",
    lat: 10.8015,
    lng: 106.6557,
    district: "Tân Bình",
  },
  {
    id: "ha-noi",
    name: "Hoàn Kiếm, TP. Hà Nội",
    lat: 21.0285,
    lng: 105.8542,
    district: "Hà Nội",
  },
  {
    id: "da-nang",
    name: "Hải Châu, TP. Đà Nẵng",
    lat: 16.0544,
    lng: 108.2022,
    district: "Đà Nẵng",
  },
]

/**
 * Tra cứu tọa độ gần đúng theo tên quận/huyện/địa chỉ
 */
export function getDistrictCoordinates(
  districtOrAddress?: string | null,
): { lat: number; lng: number } {
  if (!districtOrAddress) return { lat: 10.7769, lng: 106.7009 }
  const lower = districtOrAddress.toLowerCase()
  if (
    lower.includes("dĩ an") ||
    lower.includes("di an") ||
    lower.includes("bình dương")
  ) {
    return { lat: 10.9067, lng: 106.7722 }
  }
  if (
    lower.includes("quận 1") ||
    lower.includes("quan 1") ||
    lower.includes("bến nghé") ||
    lower.includes("bùi viện")
  ) {
    return { lat: 10.7769, lng: 106.7009 }
  }
  if (lower.includes("quận 3") || lower.includes("quan 3")) {
    return { lat: 10.7828, lng: 106.6853 }
  }
  if (
    lower.includes("bình thạnh") ||
    lower.includes("binh thanh") ||
    lower.includes("thanh đa")
  ) {
    return { lat: 10.803, lng: 106.698 }
  }
  if (
    lower.includes("phú nhuận") ||
    lower.includes("phu nhuan") ||
    lower.includes("phan xích long")
  ) {
    return { lat: 10.7992, lng: 106.6803 }
  }
  if (
    lower.includes("quận 2") ||
    lower.includes("thảo điền") ||
    lower.includes("thao dien")
  ) {
    return { lat: 10.7872, lng: 106.7497 }
  }
  if (lower.includes("thủ đức") || lower.includes("thu duc")) {
    return { lat: 10.8494, lng: 106.7537 }
  }
  if (
    lower.includes("quận 7") ||
    lower.includes("quan 7") ||
    lower.includes("phú mỹ hưng")
  ) {
    return { lat: 10.734, lng: 106.7218 }
  }
  if (lower.includes("quận 10") || lower.includes("quan 10")) {
    return { lat: 10.7716, lng: 106.6669 }
  }
  if (
    lower.includes("quận 5") ||
    lower.includes("quan 5") ||
    lower.includes("chợ lớn")
  ) {
    return { lat: 10.754, lng: 106.666 }
  }
  if (lower.includes("tân bình") || lower.includes("tan binh")) {
    return { lat: 10.8015, lng: 106.6557 }
  }
  if (lower.includes("gò vấp") || lower.includes("go vap")) {
    return { lat: 10.8388, lng: 106.6653 }
  }
  if (
    lower.includes("hà nội") ||
    lower.includes("ha noi") ||
    lower.includes("hoàn kiếm") ||
    lower.includes("bát đàn")
  ) {
    return { lat: 21.0285, lng: 105.8542 }
  }
  if (
    lower.includes("đà nẵng") ||
    lower.includes("da nang") ||
    lower.includes("hải châu")
  ) {
    return { lat: 16.0544, lng: 108.2022 }
  }

  return { lat: 10.7769, lng: 106.7009 }
}

/**
 * Công thức Haversine tính khoảng cách đường chim bay giữa 2 tọa độ (km)
 */
export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371 // Bán kính trái đất tính bằng km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const d = R * c
  return Math.round(d * 10) / 10
}

/**
 * Định dạng hiển thị khoảng cách thân thiện người dùng
 */
export function formatDistanceText(distKm: number): string {
  if (distKm < 1) {
    const meters = Math.max(50, Math.round(distKm * 1000))
    return `${meters} m`
  }
  return `${distKm.toFixed(1)} km`
}

/**
 * Trích xuất địa chỉ có cấu trúc từ OpenStreetMap Nominatim reverse response
 */
function parseOsmAddress(
  rawAddress: Record<string, string>,
): {
  addressName: string
  city: string
} {
  const road = rawAddress.road || rawAddress.pedestrian || ""
  const ward =
    rawAddress.suburb ||
    rawAddress.quarter ||
    rawAddress.neighbourhood ||
    rawAddress.village ||
    ""
  const district =
    rawAddress.city_district || rawAddress.district || rawAddress.county || ""
  const city =
    rawAddress.city || rawAddress.town || rawAddress.state || "TP. Hồ Chí Minh"

  const parts = [road, ward, district, city].filter(Boolean)
  const addressName = parts.slice(0, 3).join(", ") || city

  return { addressName, city }
}

/**
 * Tra cứu địa chỉ ngược từ tọa độ bằng OpenStreetMap Nominatim (mã nguồn mở, không cần API key)
 */
export async function reverseGeocodeOsm(
  lat: number,
  lng: number,
): Promise<{ addressName: string; city: string }> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 4000)

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=16&addressdetails=1`,
      {
        signal: controller.signal,
        headers: {
          "Accept-Language": "vi,en;q=0.9",
        },
      },
    )
    clearTimeout(timeoutId)

    if (!res.ok) {
      return {
        addressName: `Tọa độ: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
        city: "Việt Nam",
      }
    }

    const data = await res.json()
    if (data && data.address) {
      return parseOsmAddress(data.address)
    }

    return {
      addressName:
        data.display_name?.split(",").slice(0, 3).join(",") ||
        "Vị trí hiện tại",
      city: "Việt Nam",
    }
  } catch {
    return {
      addressName: `Vị trí GPS (${lat.toFixed(4)}, ${lng.toFixed(4)})`,
      city: "Việt Nam",
    }
  }
}

/**
 * Lấy vị trí đã lưu trong bộ nhớ trình duyệt nếu có
 */
export function getSavedUserLocation(): UserGeoPosition | null {
  if (typeof window === "undefined") return null
  try {
    const cached = localStorage.getItem(STORAGE_KEY)
    if (!cached) return null
    return JSON.parse(cached) as UserGeoPosition
  } catch {
    return null
  }
}

/**
 * Lưu vị trí người dùng vào localStorage
 */
export function saveUserLocation(pos: UserGeoPosition): void {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(pos))
  } catch {
    // ignore
  }
}

/**
 * Gọi Geolocation API trình duyệt để lấy tọa độ thực tế từ GPS/Wifi
 */
export function requestCurrentPosition(): Promise<{
  coords: { latitude: number; longitude: number; accuracy: number }
}> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      reject(new Error("Trình duyệt không hỗ trợ định vị Geolocation."))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => resolve(pos),
      (err) => {
        let message = "Không thể lấy vị trí hiện tại."
        if (err.code === 1) {
          message =
            "Bạn đã từ chối quyền truy cập vị trí. Vui lòng cho phép quyền định vị trong cài đặt trình duyệt để cập nhật vị trí hiện tại."
        } else if (err.code === 2) {
          message = "Không thể xác định vị trí của thiết bị."
        } else if (err.code === 3) {
          message = "Quá thời gian chờ lấy vị trí định vị."
        }
        reject(new Error(message))
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      },
    )
  })
}
