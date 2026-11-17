import urllib.request
import json
import time

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest'
}

cities = {}

for cid in range(215, 275):
    # Try type=1, then without type
    for url in [
        f"https://www.foody.vn/__get/Place/HomeListPlace?page=1&limit=2&type=1&cityId={cid}",
        f"https://www.foody.vn/__get/Place/HomeListPlace?page=1&limit=2&cityId={cid}"
    ]:
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=3) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                items = data.get('Items', [])
                if items:
                    addr = items[0].get('Address', '')
                    name = items[0].get('Name', '')
                    cities[cid] = {'name': name, 'addr': addr}
                    print(f"FOUND {cid}: {name} -> {addr}", flush=True)
                    break
        except Exception:
            pass
        time.sleep(0.05)

print("\n--- SUMMARY OF DETECTED CITIES ---", flush=True)
for cid, info in sorted(cities.items()):
    print(f"{cid}: {info['addr']}", flush=True)
