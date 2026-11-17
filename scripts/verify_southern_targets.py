import urllib.request
import json
import time

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest'
}

target_cities = {
    217: 'TP. Hồ Chí Minh',
    221: 'Cần Thơ',
    222: 'Đồng Nai',
    223: 'Bà Rịa - Vũng Tàu',
    224: 'An Giang',
    229: 'Bến Tre',
    230: 'Bình Dương',
    234: 'Cà Mau',
    245: 'Hậu Giang',
    249: 'Kiên Giang (Phú Quốc)',
    255: 'Long An',
    267: 'Sóc Trăng',
    269: 'Tây Ninh',
    274: 'Tiền Giang'
}

print("Verifying target Southern cities...", flush=True)

for cid, name in target_cities.items():
    found = False
    for t in [1, 2, 3, 4, 5]:
        url = f"https://www.foody.vn/__get/Place/HomeListPlace?page=1&limit=2&type={t}&cityId={cid}"
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req, timeout=3) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                items = data.get('Items', [])
                if items:
                    pname = items[0].get('Name')
                    paddr = items[0].get('Address')
                    print(f"✓ {cid} {name} (t={t}): {pname} | {paddr}", flush=True)
                    found = True
                    break
        except Exception:
            pass
        time.sleep(0.05)
    if not found:
        print(f"✗ {cid} {name} -> No items found with types 1-5", flush=True)

print("Verification complete!", flush=True)
