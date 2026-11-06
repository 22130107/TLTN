import { ARCHIVE_PLACE_DETAILS } from "@/data/archivePlacesData"
import { ARCHIVE_ITEMS } from "@/constants/archivesData"
import { mockScheduleItems } from "@/data/profileData"
import type { UnifiedPlace } from "@/types/placeExplorer"

const placesMap = new Map<string, UnifiedPlace>()

// 1. Process ARCHIVE_PLACE_DETAILS (highest fidelity editorial details)
Object.values(ARCHIVE_PLACE_DETAILS).forEach((item) => {
  if (!placesMap.has(item.id)) {
    placesMap.set(item.id, {
      id: item.id,
      name: item.title.split("|")[0].trim(),
      city: item.city,
      indexNo: item.indexNo,
      archiveCode: item.archiveCode,
      signatureDish: item.signatureDish,
      address: item.address,
      image: item.image,
      tags: item.tags,
      hours: item.hours,
      phone: item.phone,
    })
  }
})

// 2. Process mockScheduleItems
mockScheduleItems.forEach((item) => {
  if (!placesMap.has(item.id)) {
    placesMap.set(item.id, {
      id: item.id,
      name: item.placeName,
      city: item.address.includes("Hà Nội")
        ? "TP. Hà Nội"
        : item.address.includes("Hồ Chí Minh")
          ? "TP. Hồ Chí Minh"
          : "TP. Đà Nẵng",
      indexNo: item.id.replace("sch_0", "0"),
      archiveCode: `archive 01${item.id.replace("sch_0", "")}`,
      signatureDish: item.signatureDish,
      address: item.address,
      image: item.imageUrl,
      tags: [
        item.category.split("&")[0].trim(),
        item.signatureDish.split(",")[0].trim(),
      ],
      hours: "07:00 - 22:00",
      phone: "+84 24 3825 1234",
    })
  }
})

// 3. Process ARCHIVE_ITEMS (archive cards list)
ARCHIVE_ITEMS.forEach((item) => {
  if (!placesMap.has(item.id)) {
    placesMap.set(item.id, {
      id: item.id,
      name: item.title.split("|")[0].trim(),
      city: item.city,
      indexNo: item.index,
      archiveCode: item.archiveNo,
      signatureDish:
        item.title.split("|")[1]?.trim() ||
        item.tags[0] ||
        "Đặc sản truyền thống",
      address: `${item.city}, Việt Nam`,
      image: item.image,
      tags: item.tags,
      hours: "08:00 - 21:00",
      phone: "+84 28 3822 5678",
    })
  }
})

export const UNIFIED_PLACES: UnifiedPlace[] = Array.from(placesMap.values())

// Compute AVAILABLE_CITIES: starting with "Tất cả", followed by distinct cities sorted in descending order of place count
const cityCounts = new Map<string, number>()
for (const place of UNIFIED_PLACES) {
  if (place.city) {
    cityCounts.set(place.city, (cityCounts.get(place.city) || 0) + 1)
  }
}

const sortedCities = Array.from(cityCounts.entries())
  .sort((a, b) => {
    const countDiff = b[1] - a[1]
    if (countDiff !== 0) return countDiff
    return a[0].localeCompare(b[0], "vi")
  })
  .map(([city]) => city)

export const AVAILABLE_CITIES: string[] = ["Tất cả", ...sortedCities]
