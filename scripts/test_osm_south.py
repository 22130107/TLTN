import urllib.request
import urllib.parse
import json

cities = {
    "Cần Thơ": "10.0452,105.7469,10.0552,105.7569", # Bounding box or area
    "Vũng Tàu": "10.3459,107.0843",
    "Phú Quốc": "10.2899,103.9840",
}

# Let's query by bounding box around city centers (5km radius)
# Can Tho center: 10.033, 105.783
# Vung Tau center: 10.353, 107.084
# Bien Hoa center: 10.957, 106.842
# Thu Dau Mot center: 10.980, 106.651
# Phu Quoc (Duong Dong): 10.216, 103.960

targets = [
    ("Cần Thơ", 10.033, 105.783),
    ("Vũng Tàu", 10.353, 107.084),
    ("Biên Hòa (Đồng Nai)", 10.957, 106.842),
    ("Thủ Dầu Một (Bình Dương)", 10.980, 106.651),
    ("Phú Quốc (Kiên Giang)", 10.216, 103.960)
]

for name, lat, lng in targets:
    # 6km around center
    d = 0.05
    bbox = f"{lat-d},{lng-d},{lat+d},{lng+d}"
    query = f"""
    [out:json][timeout:15];
    (
      node["amenity"~"restaurant|cafe|fast_food"]({bbox});
      way["amenity"~"restaurant|cafe|fast_food"]({bbox});
    );
    out center 15;
    """
    req = urllib.request.Request(
        "https://overpass-api.de/api/interpreter",
        data=urllib.parse.urlencode({"data": query}).encode("utf-8")
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            data = json.loads(resp.read().decode("utf-8"))
            elements = data.get("elements", [])
            print(f"=== {name} (found {len(elements)}) ===")
            for el in elements[:3]:
                tags = el.get("tags", {})
                print(" ", tags.get("name"), "|", tags.get("addr:street"), "|", tags.get("amenity"))
    except Exception as e:
        print(f"Error {name}: {e}")
