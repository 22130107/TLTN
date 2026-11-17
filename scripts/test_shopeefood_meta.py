import urllib.request
import json

headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'x-foody-client-type': '1',
    'x-foody-api-version': '1',
    'Origin': 'https://shopeefood.vn',
    'Referer': 'https://shopeefood.vn/'
}

for url in [
    'https://gapi.shopeefood.vn/api/meta/get_metadata',
    'https://gapi.shopeefood.vn/langs/vn/cities?app_type=web',
    'https://www.foody.vn/__get/City/GetCities',
    'https://shopeefood.vn/api/meta/get_metadata'
]:
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=5) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            print(f"SUCCESS {url}")
            if 'reply' in data and 'cities' in data['reply']:
                for c in data['reply']['cities']:
                    print(f"  {c.get('id')}: {c.get('name')} ({c.get('slug')})")
            elif isinstance(data, list):
                for c in data[:10]:
                    print(" ", c)
            else:
                print("  data keys:", list(data.keys()))
    except Exception as e:
        print(f"FAIL {url}: {e}")
