import urllib.request
import xml.etree.ElementTree as ET
import time
import json
import re

# Bounding boxes for 9 food hotspots across Saigon
SLICES = [
    {"name": "Quận 1 Trung Tâm", "district": "Quận 1", "bbox": "106.69,10.77,106.705,10.785"},
    {"name": "Quận 3 & Hồ Con Rùa", "district": "Quận 3", "bbox": "106.68,10.775,106.695,10.79"},
    {"name": "Quận 5 Chợ Lớn Ẩm Thực Hoa", "district": "Quận 5", "bbox": "106.655,10.748,106.67,10.762"},
    {"name": "Quận 10 Sư Vạn Hạnh & Hồ Thị Kỷ", "district": "Quận 10", "bbox": "106.662,10.762,106.675,10.773"},
    {"name": "Phan Xích Long Phú Nhuận", "district": "Quận Phú Nhuận", "bbox": "106.682,10.792,106.695,10.803"},
    {"name": "Bình Thạnh & D2 Hàng Xanh", "district": "Quận Bình Thạnh", "bbox": "106.705,10.798,106.718,10.81"},
    {"name": "Thảo Điền Quận 2", "district": "TP. Thủ Đức", "bbox": "106.728,10.80,106.742,10.812"},
    {"name": "Quận 4 Phố Ốc Vĩnh Khánh", "district": "Quận 4", "bbox": "106.698,10.758,106.71,10.768"},
    {"name": "Phú Mỹ Hưng Quận 7", "district": "Quận 7", "bbox": "106.708,10.725,106.722,10.738"},
]

FOOD_AMENITIES = {"restaurant", "cafe", "fast_food", "bar", "ice_cream", "food_court", "pub", "bistro"}

all_places = []
seen_names = set()

for s in SLICES:
    print(f"Fetching {s['name']} (bbox={s['bbox']})...")
    url = f"https://api.openstreetmap.org/api/0.6/map?bbox={s['bbox']}"
    req = urllib.request.Request(url, headers={"User-Agent": "MinkuraSaigonGuide/1.0 (info@minkura.local)"})
    try:
        t0 = time.time()
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = resp.read()
        print(f"  Downloaded {len(data)} bytes in {time.time()-t0:.2f}s")
        root = ET.fromstring(data)
        count = 0
        for node in root.findall("node"):
            tags = {tag.attrib.get("k"): tag.attrib.get("v") for tag in node.findall("tag")}
            amenity = tags.get("amenity")
            raw_name = tags.get("name") or tags.get("name:vi") or tags.get("name:en")
            if amenity in FOOD_AMENITIES and raw_name:
                name = raw_name.strip()
                # Clean up multiple names separated by semicolons
                if ";" in name:
                    name = name.split(";")[0].strip()
                # Filter out pure numbers or very short weird strings
                if len(name) < 3 or re.match(r"^\d+$", name):
                    continue
                name_key = name.lower()
                if name_key in seen_names:
                    continue
                seen_names.add(name_key)
                count += 1
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
        print(f"  Extracted {count} places from {s['name']}")
        time.sleep(1) # Be polite to OSM API
    except Exception as e:
        print(f"  Error fetching {s['name']}: {e}")

print(f"\nTOTAL unique places extracted from OpenStreetMap: {len(all_places)}")
with open("scripts/saigon_osm_raw.json", "w", encoding="utf-8") as f:
    json.dump(all_places, f, ensure_ascii=False, indent=2)
print("Saved to scripts/saigon_osm_raw.json")
