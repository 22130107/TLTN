import urllib.request
import xml.etree.ElementTree as ET
import time

url = "https://api.openstreetmap.org/api/0.6/map?bbox=106.69,10.77,106.70,10.78"

print("Requesting map slice from official OpenStreetMap API...")
t0 = time.time()
req = urllib.request.Request(url, headers={"User-Agent": "MinkuraSaigonGuide/1.0 (contact: info@minkura.local)"})

with urllib.request.urlopen(req, timeout=15) as resp:
    xml_data = resp.read()
    print(f"Downloaded {len(xml_data)} bytes in {time.time()-t0:.2f}s!")

root = ET.fromstring(xml_data)

food_amenities = {"restaurant", "cafe", "fast_food", "bar", "ice_cream", "food_court", "pub", "bistro"}
places = []

for node in root.findall("node"):
    tags = {tag.attrib.get("k"): tag.attrib.get("v") for tag in node.findall("tag")}
    amenity = tags.get("amenity")
    name = tags.get("name") or tags.get("name:vi") or tags.get("name:en")
    
    if amenity in food_amenities and name:
        places.append({
            "osm_id": node.attrib.get("id"),
            "name": name,
            "amenity": amenity,
            "cuisine": tags.get("cuisine", ""),
            "street": tags.get("addr:street", ""),
            "housenumber": tags.get("addr:housenumber", ""),
            "district": tags.get("addr:district", ""),
            "opening_hours": tags.get("opening_hours", ""),
            "phone": tags.get("phone") or tags.get("contact:phone", ""),
            "lat": float(node.attrib.get("lat")),
            "lon": float(node.attrib.get("lon")),
        })

print(f"Found {len(places)} real Saigon food places with names in this slice (District 1 core)!")
for p in places[:15]:
    print(f"  • [{p['amenity']}] {p['name']} - {p['cuisine']} (Lat: {p['lat']}, Lon: {p['lon']})")
