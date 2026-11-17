import urllib.request
import xml.etree.ElementTree as ET
import time
import json
import re
import os

# Load existing raw places if available
existing_places = []
seen_names = set()
if os.path.exists("scripts/saigon_osm_raw.json"):
    with open("scripts/saigon_osm_raw.json", encoding="utf-8") as f:
        existing_places = json.load(f)
    for p in existing_places:
        seen_names.add(p["name"].lower().strip())
    print(f"Loaded {len(existing_places)} existing places from saigon_osm_raw.json")

# Additional bounding boxes covering the rest of Saigon / HCMC
ADDITIONAL_SLICES = [
    {"name": "Gò Vấp Cityland & Quang Trung", "district": "Quận Gò Vấp", "bbox": "106.66,10.825,106.685,10.845"},
    {"name": "Gò Vấp Phan Văn Trị & Lê Đức Thọ", "district": "Quận Gò Vấp", "bbox": "106.675,10.835,106.695,10.855"},
    {"name": "Tân Bình K300 & Cộng Hòa", "district": "Quận Tân Bình", "bbox": "106.645,10.795,106.668,10.815"},
    {"name": "Tân Bình Bàu Cát & Đồng Đen", "district": "Quận Tân Bình", "bbox": "106.635,10.785,106.655,10.805"},
    {"name": "Tân Phú Lũy Bán Bích & Tân Sơn Nhì", "district": "Quận Tân Phú", "bbox": "106.62,10.78,106.64,10.80"},
    {"name": "Quận 11 Lữ Gia & Đầm Sen", "district": "Quận 11", "bbox": "106.64,10.76,106.658,10.775"},
    {"name": "Quận 6 Hậu Giang & Bình Phú", "district": "Quận 6", "bbox": "106.63,10.745,106.65,10.76"},
    {"name": "Quận 8 Tạ Quang Bửu & Dương Bá Trạc", "district": "Quận 8", "bbox": "106.67,10.735,106.695,10.755"},
    {"name": "Thủ Đức Võ Văn Ngân & Đặng Văn Bi", "district": "TP. Thủ Đức", "bbox": "106.75,10.84,106.775,10.86"},
    {"name": "Quận 9 Lê Văn Việt & Đỗ Xuân Hợp", "district": "TP. Thủ Đức", "bbox": "106.775,10.835,106.80,10.855"},
    {"name": "Quận 7 Nguyễn Thị Thập & Lotte", "district": "Quận 7", "bbox": "106.70,10.735,106.72,10.75"},
    {"name": "Bình Tân Khu Tên Lửa & Vành Đai", "district": "Quận Bình Tân", "bbox": "106.605,10.75,106.625,10.77"},
    {"name": "Quận 12 Tô Ký & An Phú Đông", "district": "Quận 12", "bbox": "106.67,10.85,106.695,10.87"},
]

FOOD_AMENITIES = {"restaurant", "cafe", "fast_food", "bar", "ice_cream", "food_court", "pub", "bistro"}

all_places = list(existing_places)
new_count = 0

for s in ADDITIONAL_SLICES:
    print(f"Fetching {s['name']} ({s['district']})...")
    url = f"https://api.openstreetmap.org/api/0.6/map?bbox={s['bbox']}"
    req = urllib.request.Request(url, headers={"User-Agent": "MinkuraFullSaigon/1.0 (info@minkura.local)"})
    try:
        t0 = time.time()
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = resp.read()
        print(f"  Downloaded {len(data)} bytes in {time.time()-t0:.2f}s")
        root = ET.fromstring(data)
        slice_count = 0
        for node in root.findall("node"):
            tags = {tag.attrib.get("k"): tag.attrib.get("v") for tag in node.findall("tag")}
            amenity = tags.get("amenity")
            raw_name = tags.get("name") or tags.get("name:vi") or tags.get("name:en")
            if amenity in FOOD_AMENITIES and raw_name:
                name = raw_name.strip()
                if ";" in name:
                    name = name.split(";")[0].strip()
                if len(name) < 3 or re.match(r"^\d+$", name):
                    continue
                name_key = name.lower()
                if name_key in seen_names:
                    continue
                seen_names.add(name_key)
                slice_count += 1
                new_count += 1
                all_places.append({
                    "osm_id": node.attrib.get("id"),
                    "name": name,
                    "amenity": amenity,
                    "cuisine": tags.get("cuisine", ""),
                    "street": tags.get("addr:street", ""),
                    "housenumber": tags.get("addr:housenumber", ""),
                    "district": tags.get("addr:district") or s["district"],
                    "opening_hours": tags.get("opening_hours", ""),
                    "phone": tags.get("phone") or tags.get("contact:phone", ""),
                    "lat": round(float(node.attrib.get("lat")), 6),
                    "lon": round(float(node.attrib.get("lon")), 6),
                })
        print(f"  Extracted {slice_count} new places from {s['name']}")
        time.sleep(1)
    except Exception as e:
        print(f"  Error fetching {s['name']}: {e}")

print(f"\n==========================================")
print(f"TOTAL places across ALL of Saigon: {len(all_places)} (Added {new_count} new places)")
print(f"==========================================")

with open("scripts/saigon_osm_raw.json", "w", encoding="utf-8") as f:
    json.dump(all_places, f, ensure_ascii=False, indent=2)
print("Updated scripts/saigon_osm_raw.json")
