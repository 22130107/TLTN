import urllib.request
import json
import time

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'X-Requested-With': 'XMLHttpRequest'
}

cities = [
    (221, 'Cần Thơ'),
    (223, 'Vũng Tàu'),
    (230, 'Bình Dương'),
    (222, 'Đồng Nai'),
    (249, 'Kiên Giang (Phú Quốc)'),
    (224, 'An Giang'),
    (274, 'Tiền Giang')
]

for cid, name in cities:
    for t in [1, 2, 3]:
        url = f"https://www.foody.vn/__get/Place/HomeListPlace?page=1&limit=5&type={t}&cityId={cid}"
        req = urllib.request.Request(url, headers=headers)
        try:
            with urllib.request.urlopen(req, timeout=5) as resp:
                data = json.loads(resp.read().decode('utf-8'))
                items = data.get('Items', [])
                if items:
                    print(f"SUCCESS {cid} ({name}, type={t}): {len(items)} places")
                    for it in items[:2]:
                        print(f"   - {it.get('Name')} | {it.get('Address')} | photo: {it.get('PhotoUrl')[:50]}...")
                    break
        except Exception as e:
            # print(f"Error {cid} ({name}): {e}")
            pass
        time.sleep(0.15)
