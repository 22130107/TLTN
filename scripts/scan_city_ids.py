import urllib.request
import json
import time
import sys

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest'
}

print("Testing city IDs...", flush=True)

# Test 1 to 100 and 215 to 260
ids_to_test = list(range(215, 250)) + list(range(1, 35))

found = {}

for cid in ids_to_test:
    url = f"https://www.foody.vn/__get/Place/HomeListPlace?page=1&limit=2&type=1&cityId={cid}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=3) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            items = data.get('Items', [])
            if items:
                addr = items[0].get('Address', '')
                name = items[0].get('Name', '')
                print(f"ID {cid} -> {name} | {addr}", flush=True)
                found[cid] = {"name": name, "addr": addr}
            else:
                pass
    except Exception as e:
        # print(f"ID {cid} error: {e}", flush=True)
        pass
    time.sleep(0.08)

print("Finished scanning. Results:", flush=True)
for k, v in found.items():
    print(f"CityId {k}: {v['addr']}", flush=True)
