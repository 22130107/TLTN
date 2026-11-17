import urllib.request
import urllib.parse
import json

overpass_query = """[out:json][timeout:25];
node["amenity"~"restaurant|cafe"]["name"](10.77,106.69,10.78,106.70);
out 5;
"""

urls = [
    "https://overpass-api.de/api/interpreter",
    "https://lz4.overpass-api.de/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter"
]

for url in urls:
    try:
        print(f"Trying {url}...")
        data = urllib.parse.urlencode({"data": overpass_query}).encode("utf-8")
        req = urllib.request.Request(
            url,
            data=data,
            headers={
                "User-Agent": "MinkuraFoodGuide/1.0 (huynh@minkura.local)",
                "Accept": "application/json",
                "Content-Type": "application/x-www-form-urlencoded"
            }
        )
        with urllib.request.urlopen(req, timeout=15) as resp:
            content = json.loads(resp.read().decode("utf-8"))
            elements = content.get("elements", [])
            print(f"SUCCESS! Got {len(elements)} items from {url}")
            for el in elements:
                print(f"  Name: {el.get('tags', {}).get('name')}, Lat: {el.get('lat')}, Lon: {el.get('lon')}")
            break
    except Exception as e:
        print(f"Error {url}: {e}")
