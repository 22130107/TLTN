import json

with open("scripts/all_southern_places_consolidated.json", encoding="utf-8") as f:
    places = json.load(f)

print(f"Loaded {len(places)} places to generate src/data/explorePlacesData.ts")

content = """export interface ExplorePlace {
  id: string
  name: string
  badge: string
  badgeColor: string
  rating: number
  reviewCount: string
  distance: number // in km (e.g. 1.2)
  distanceText: string
  district: string
  city?: string
  address?: string
  tags: string[]
  description: string
  image: string
  categoryType: "quan-an" | "ca-phe" | "nha-hang" | "via-he" | "khac"
  priceRange: "duoi-100k" | "100k-200k" | "200k-300k" | "tren-300k"
  priceText: string
  latitude?: number
  longitude?: number
}

export const EXPLORE_PLACES: ExplorePlace[] = """ + json.dumps(places, ensure_ascii=False, indent=2) + "\n"

with open("src/data/explorePlacesData.ts", "w", encoding="utf-8") as f:
    f.write(content)

print("Generated src/data/explorePlacesData.ts successfully!")
