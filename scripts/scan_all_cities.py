import urllib.request
import json
from concurrent.futures import ThreadPoolExecutor
import sys

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest'
}

cities_found = {}

def check_id(cid):
    url = f"https://www.foody.vn/__get/Place/HomeListPlace?page=1&limit=1&type=1&cityId={cid}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            items = data.get('Items', [])
            if items:
                addr = items[0].get('Address', '')
                name = items[0].get('Name', '')
                return cid, name, addr
    except Exception:
        pass
    return None

with ThreadPoolExecutor(max_workers=25) as executor:
    results = executor.map(check_id, range(1, 350))
    for res in results:
        if res:
            cid, name, addr = res
            cities_found[cid] = (name, addr)
            print(f"CityId {cid:3d} -> {name} | {addr}", flush=True)

with open("scripts/foody_all_city_ids.json", "w", encoding="utf-8") as f:
    json.dump(cities_found, f, ensure_ascii=False, indent=2)

print(f"\nDone! Found {len(cities_found)} cities.", flush=True)
