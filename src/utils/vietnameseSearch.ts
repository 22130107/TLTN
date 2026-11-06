import type { UnifiedPlace } from "@/types/placeExplorer"

export function normalizeVietnamese(str: string): string {
  if (!str) return ""
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .trim()
}

export function matchPlaceSearch(
  place: UnifiedPlace,
  rawQuery: string,
): boolean {
  const query = normalizeVietnamese(rawQuery)
  if (!query) return true

  const nameMatch = normalizeVietnamese(place.name).includes(query)
  const dishMatch = normalizeVietnamese(place.signatureDish).includes(query)
  const addressMatch = normalizeVietnamese(place.address).includes(query)
  const cityMatch = normalizeVietnamese(place.city).includes(query)
  const tagsMatch = (place.tags || []).some((tag) =>
    normalizeVietnamese(tag).includes(query),
  )

  return nameMatch || dishMatch || addressMatch || cityMatch || tagsMatch
}
