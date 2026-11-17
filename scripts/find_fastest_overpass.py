import urllib.request
import json
import ssl

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

candidates = [
    "https://overpass.private.coffee/api/interpreter",
    "https://overpass.kumi.systems/api/interpreter",
    "https://overpass.openstreetmap.ru/api/interpreter",
    "https://overpass-api.de/api/interpreter",
    "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
    "https://overpass.osm.ch/api/interpreter",
    "https://overpass.gis-ops.com/api/interpreter"
]

query = """[out:json][timeout:10];node["amenity"="restaurant"]["name"](10.77,106.69,10.78,106.70);out 5;"""

for c in candidates:
    print(f"Testing {c}...")
    try:
        req = urllib.request.Request(
            c,
            data=query.encode("utf-8"),
            headers={
                "User-Agent": "MinkuraSaigonImporter/1.0 (dev@minkura.local)",
                "Content-Type": "text/plain"
            }
        )
        with urllib.request.urlopen(req, timeout=7, context=ctx) as r:
            body = r.read().decode("utf-8")
            if r.status == 200:
                data = json.loads(body)
                count = len(data.get("elements", []))
                print(f"  >>> SUCCESS on {c}! Found {count} items!")
                if count > 0:
                    print("  Sample:", data["elements"][0]["tags"]["name"])
            else:
                print(f"  HTTP {r.status}")
    except Exception as e:
        print(f"  Failed: {e}")
