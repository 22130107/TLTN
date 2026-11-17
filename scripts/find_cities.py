import urllib.request
import re
import json

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
}

cities = ['ho-chi-minh', 'can-tho', 'vung-tau', 'binh-duong', 'dong-nai', 'kien-giang', 'da-nang', 'ha-noi']

for city in cities:
    url = f"https://www.foody.vn/{city}"
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            html = resp.read().decode('utf-8')
            # Search for CityId
            m = re.findall(r'CityId\s*[:=]\s*(\d+)', html, re.IGNORECASE)
            print(f"{city}: {m[:3]}")
    except Exception as e:
        print(f"{city} error: {e}")
