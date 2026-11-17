import urllib.request
import json
import time
import re

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "X-Requested-With": "XMLHttpRequest"
}

all_places = {}

def fetch_page(url):
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=6) as resp:
            data = resp.read().decode("utf-8")
            json_data = json.loads(data)
            return json_data.get("Items", [])
    except Exception as e:
        # print(f"Error {url}: {e}")
        return []

print("Starting high-speed ShopeeFood/Foody fetch for Saigon...")

# 1. Fetch by Types (1: Delivery, 2: Luxury, 3: Cafe/Tea, 4: Streetfood/Snacks, 5: Family)
for t in [1, 2, 3, 4, 5]:
    print(f"Fetching Type {t}...")
    for page in range(1, 15):
        url = f"https://www.foody.vn/__get/Place/HomeListPlace?page={page}&limit=12&type={t}"
        items = fetch_page(url)
        if not items:
            break
        for it in items:
            fid = it.get("Id")
            name = it.get("Name", "").strip()
            addr = it.get("Address", "").strip()
            photo = it.get("PhotoUrl", "")
            if fid and name and addr and photo and fid not in all_places:
                all_places[fid] = it
        print(f"  Type {t} Page {page}: Total unique places: {len(all_places)}")
        time.sleep(0.15)

# 2. Fetch by Districts in Saigon
district_ids = [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
for d in district_ids:
    for page in range(1, 8):
        url = f"https://www.foody.vn/__get/Place/HomeListPlace?page={page}&limit=12&type=1&districtId={d}"
        items = fetch_page(url)
        if not items:
            break
        for it in items:
            fid = it.get("Id")
            name = it.get("Name", "").strip()
            addr = it.get("Address", "").strip()
            photo = it.get("PhotoUrl", "")
            if fid and name and addr and photo and fid not in all_places:
                all_places[fid] = it
        time.sleep(0.15)
    print(f"District {d} fetched. Total unique places: {len(all_places)}")

print(f"\nSUCCESS! Total authentic ShopeeFood/Foody places: {len(all_places)}")

# Save raw
with open("scripts/foody_saigon_raw.json", "w", encoding="utf-8") as f:
    json.dump(list(all_places.values()), f, ensure_ascii=False, indent=2)

print("Saved to scripts/foody_saigon_raw.json")
