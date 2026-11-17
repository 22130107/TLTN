import json
import re

with open("scripts/processed_saigon_places.json", encoding="utf-8") as f:
    osm_places = json.load(f)

# Read existing explorePlacesData.ts
with open("src/data/explorePlacesData.ts", encoding="utf-8") as f:
    orig_content = f.read()

# Extract original 13 places by slicing up to the closing array bracket
# We know original file ends with ];
# Let's read the original 13 places
pattern = r"export const EXPLORE_PLACES: ExplorePlace\[\] = (\[[\s\S]*?\])\s*$"
match = re.search(pattern, orig_content)
if not match:
    print("Could not find EXPLORE_PLACES array in file!")
    exit(1)

# Format the TS file
header = """export interface ExplorePlace {
  id: string
  name: string
  badge: string
  badgeColor: string
  rating: number
  reviewCount: string
  distance: number // in km (e.g. 1.2)
  distanceText: string
  district: string
  tags: string[]
  description: string
  image: string
  categoryType: "quan-an" | "ca-phe" | "nha-hang" | "via-he" | "khac"
  priceRange: "duoi-100k" | "100k-200k" | "200k-300k" | "tren-300k"
  priceText: string
  latitude?: number
  longitude?: number
}

export const EXPLORE_PLACES: ExplorePlace[] = [
"""

# Read original 13 places text
orig_array_text = match.group(1).strip()
# remove outer [ and ]
inner_orig = orig_array_text[1:-1].strip()
inner_orig = re.sub(r",\s*$", "", inner_orig)

# Format each OSM place into TS object
osm_ts_blocks = []
sql_rows = []

for p in osm_places:
    tags_ts = json.dumps(p["tags"], ensure_ascii=False)
    desc_escaped = p["description"].replace('"', '\\"')
    name_escaped = p["name"].replace('"', '\\"')
    
    block = f"""  {{
    id: "{p['id']}",
    name: "{name_escaped}",
    badge: "{p['badge']}",
    badgeColor: "{p['badgeColor']}",
    rating: {p['rating']},
    reviewCount: "{p['reviewCount']}",
    distance: {p['distance']},
    distanceText: "{p['distanceText']}",
    district: "{p['district']}",
    tags: {tags_ts},
    description: "{desc_escaped}",
    image: "{p['image']}",
    categoryType: "{p['categoryType']}",
    priceRange: "{p['priceRange']}",
    priceText: "{p['priceText']}",
    latitude: {p['latitude']},
    longitude: {p['longitude']},
  }}"""
    osm_ts_blocks.append(block)
    
    # SQL row for Supabase
    tags_sql = "ARRAY[" + ", ".join(f"'{t.replace("'", "''")}'" for t in p["tags"]) + "]"
    sql_name = p['name'].replace("'", "''")
    sql_desc = p['description'].replace("'", "''")
    sql_dist = p['district'].replace("'", "''")
    sql_address = f"Khu ẩm thực {p['district']}, TP. Hồ Chí Minh".replace("'", "''")
    
    sql_row = f"""  (
    '{p['id']}',
    '{sql_name}',
    '{p['image']}',
    {p['rating']},
    {int(re.search(r'\d+', p['reviewCount']).group(0)) if re.search(r'\d+', p['reviewCount']) else 150},
    '{sql_address}',
    '{sql_dist}',
    'TP. Hồ Chí Minh',
    '{p['categoryType']}',
    '{p['badge']}',
    '{p['badgeColor']}',
    '{p['priceText']}',
    '08:00 - 22:30',
    '090' || floor(random() * 8999999 + 1000000)::text,
    '{sql_desc}',
    {tags_sql},
    {p['latitude']},
    {p['longitude']},
    {('true' if p['rating'] >= 4.8 else 'false')}
  )"""
    sql_rows.append(sql_row)

inner_orig = inner_orig.rstrip().rstrip(",")
final_ts_content = header + inner_orig + ",\n" + ",\n".join(osm_ts_blocks) + "\n]\n"

with open("src/data/explorePlacesData.ts", "w", encoding="utf-8") as f:
    f.write(final_ts_content)

print(f"Updated src/data/explorePlacesData.ts with {len(osm_places)} new places (Total: {13 + len(osm_places)})")

# Write SQL seed file
sql_content = f"""-- ==============================================================================
-- OpenStreetMap Seed Data: 166 Real Restaurants & Cafes across Ho Chi Minh City
-- ==============================================================================

INSERT INTO public.places (
  id, name, image, rating, review_count, address, district, city,
  category_id, badge, badge_color, price_range, hours, phone,
  story, tags, latitude, longitude, is_featured
)
VALUES
{",\n".join(sql_rows)}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image = EXCLUDED.image,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  district = EXCLUDED.district,
  price_range = EXCLUDED.price_range,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude;
"""

with open("supabase/seed_saigon_osm.sql", "w", encoding="utf-8") as f:
    f.write(sql_content)

print("Generated supabase/seed_saigon_osm.sql successfully!")
