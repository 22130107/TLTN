import json
import re
import hashlib

with open("scripts/saigon_osm_raw.json", encoding="utf-8") as f:
    raw_places = json.load(f)

# Image pools from high-res Unsplash CDN for each culinary style
IMAGE_POOLS = {
    "pho_noodles": [
        "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format&fit=crop&q=80", # Pho bo
        "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800&auto=format&fit=crop&q=80", # Asian noodle
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80", # Ramen soup
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80", # Bun thit nuong
        "https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&auto=format&fit=crop&q=80", # Noodles bowl
    ],
    "viet_food": [
        "https://images.unsplash.com/photo-1503764654157-72d979d9af2f?w=800&auto=format&fit=crop&q=80", # Banh cuon / goi cuon
        "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop&q=80", # Com tam
        "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800&auto=format&fit=crop&q=80", # Thit kho / mon viet
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80", # Mam com viet
        "https://images.unsplash.com/photo-1628294895950-9805252327bc?w=800&auto=format&fit=crop&q=80", # Ga nuong
    ],
    "cafe": [
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80", # Cafe interior
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80", # Coffee cup
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80", # Cafe chill
        "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=800&auto=format&fit=crop&q=80", # Iced coffee
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80", # Coffee beans
        "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&auto=format&fit=crop&q=80", # Latte art
    ],
    "street_food": [
        "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800&auto=format&fit=crop&q=80", # Banh mi
        "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80", # Street skewers
        "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=800&auto=format&fit=crop&q=80", # Fried food
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80", # Dimsum street
        "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80", # Street tacos/bread
    ],
    "japanese": [
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80", # Sushi platter
        "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&auto=format&fit=crop&q=80", # Sashimi
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80", # Ramen tonkotsu
        "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=80", # Japanese cuisine
    ],
    "chinese": [
        "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=80", # Dimsum bamboo
        "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80", # Dumplings
        "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&auto=format&fit=crop&q=80", # Chinese banquet
    ],
    "bbq_hotpot": [
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80", # BBQ grill
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80", # Grilled meat
        "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&auto=format&fit=crop&q=80", # Hotpot table
    ],
    "seafood": [
        "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80", # Seafood platter
        "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&auto=format&fit=crop&q=80", # Shrimp crab
        "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80", # Grilled salmon
    ],
    "western_bistro": [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80", # Modern restaurant
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80", # Steak
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80", # Pizza
        "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80", # Gourmet burger
    ],
    "bar_dessert": [
        "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop&q=80", # Cocktails
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80", # Cake dessert
        "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&auto=format&fit=crop&q=80", # Ice cream
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80", # Bakery
    ]
}

BADGE_COLORS = [
    "bg-[#FF5376]", "bg-[#E85D4E]", "bg-[#E57373]", "bg-[#4DB6AC]",
    "bg-[#BA68C8]", "bg-[#FFA726]", "bg-[#26A69A]", "bg-[#7E57C2]"
]

def normalize_district(raw):
    d = raw.strip()
    if d in ["Quận 1", "District 1", "D1", "Q1", "Quan 1", "1"]:
        return "Quận 1"
    if d in ["Quận 3", "District 3", "3"]:
        return "Quận 3"
    if d in ["Quận 4", "District 4", "4"]:
        return "Quận 4"
    if d in ["Quận 5", "District 5", "5"]:
        return "Quận 5"
    if d in ["Quận 10", "District 10", "10"]:
        return "Quận 10"
    if "Phú Nhuận" in d:
        return "Quận Phú Nhuận"
    if "Bình Thạnh" in d:
        return "Quận Bình Thạnh"
    if any(k in d for k in ["Thủ Đức", "Quận 2", "Quan 2", "District 2", "2", "Thảo Điền", "An Khánh"]):
        return "TP. Thủ Đức"
    if d in ["Quận 7", "District 7", "7"]:
        return "Quận 7"
    return "Quận 1"

def slugify(text):
    text = text.lower()
    text = re.sub(r"[àáạảãâầấậẩẫăằắặẳẵ]", "a", text)
    text = re.sub(r"[èéẹẻẽêềếệểễ]", "e", text)
    text = re.sub(r"[ìíịỉĩ]", "i", text)
    text = re.sub(r"[òóọỏõôồốộổỗơờớợởỡ]", "o", text)
    text = re.sub(r"[ùúụủũưừứựửữ]", "u", text)
    text = re.sub(r"[ỳýỵỷỹ]", "y", text)
    text = re.sub(r"[đ]", "d", text)
    text = re.sub(r"[^a-z0-9]+", "-", text)
    text = text.strip("-")
    return text[:45]

# Group places by district to select balanced representation
by_district = {}
for p in raw_places:
    d = normalize_district(p["district"])
    name = p["name"].strip()
    # Filter out junk names
    if len(name) < 3 or name.lower() in ["wc", "toilet", "atm", "cafe", "coffee", "quan an", "quan", "ban ghe"]:
        continue
    by_district.setdefault(d, []).append(p)

DISTRICT_QUOTAS = {
    "Quận 1": 28,
    "Quận 3": 20,
    "Quận 5": 18,
    "Quận 10": 18,
    "Quận Phú Nhuận": 18,
    "Quận Bình Thạnh": 14,
    "TP. Thủ Đức": 18,
    "Quận 4": 16,
    "Quận 7": 16,
}

selected = []
used_ids = set()

for dist, quota in DISTRICT_QUOTAS.items():
    places = by_district.get(dist, [])
    # Sort to prefer places with street or opening_hours or phone
    places.sort(key=lambda x: (
        1 if x.get("street") else 0,
        1 if x.get("opening_hours") else 0,
        1 if x.get("cuisine") else 0,
        -len(x["name"])
    ), reverse=True)
    
    taken = 0
    for p in places:
        if taken >= quota:
            break
        name = p["name"]
        slug = "osm-" + slugify(name)
        if slug in used_ids:
            slug = f"{slug}-{p['osm_id'][-4:]}"
        used_ids.add(slug)
        p["clean_id"] = slug
        p["clean_district"] = dist
        selected.append(p)
        taken += 1

print(f"Selected {len(selected)} balanced, high-quality places across {len(DISTRICT_QUOTAS)} districts!")

processed_places = []
for idx, p in enumerate(selected):
    name = p["name"]
    name_lower = name.lower()
    amenity = p["amenity"]
    cuisine = (p.get("cuisine") or "").lower()
    
    # Category detection
    if amenity == "cafe" or any(k in name_lower for k in ["cà phê", "cafe", "coffee", "tea", "trà sữa", "matcha", "roastery", "chè"]):
        cat = "ca-phe"
        badge = "Cà phê chill" if idx % 2 == 0 else "Không gian đẹp"
        img_pool = IMAGE_POOLS["cafe"]
        price_range = "duoi-100k"
        price_text = f"{30 + (idx % 4)*10}.000₫ - {65 + (idx % 3)*15}.000₫"
        tags = ["Cà phê", "Không gian chill", p["clean_district"]]
        desc = "Không gian thoáng mát, đồ uống pha chế chuẩn vị, thích hợp làm việc, hẹn hò và thư giãn."
    elif any(k in name_lower or k in cuisine for k in ["sushi", "ramen", "udon", "nhat", "japan", "yakiniku", "sashimi"]):
        cat = "nha-hang"
        badge = "Món Nhật chuẩn vị"
        img_pool = IMAGE_POOLS["japanese"]
        price_range = "200k-300k" if idx % 2 == 0 else "100k-200k"
        price_text = "120.000₫ - 280.000₫"
        tags = ["Món Nhật", "Hải sản tươi", p["clean_district"]]
        desc = "Hương vị ẩm thực xứ sở Phù Tang tinh tế, nguyên liệu tươi ngon được chế biến tỉ mỉ."
    elif any(k in name_lower or k in cuisine for k in ["dimsum", "hoa", "china", "chinese", "tiệm mì", "sủi cảo", "hủ tiếu nam vang", "hủ tiếu"]):
        cat = "quan-an" if "hủ tiếu" in name_lower else "nha-hang"
        badge = "Món Hoa chuẩn vị"
        img_pool = IMAGE_POOLS["chinese"]
        price_range = "100k-200k"
        price_text = "85.000₫ - 180.000₫"
        tags = ["Món Hoa", "Đặc sản", p["clean_district"]]
        desc = "Hương vị ẩm thực Trung Hoa gia truyền, nước dùng ngọt thanh, điểm tâm dimsum hấp dẫn."
    elif any(k in name_lower or k in cuisine for k in ["bbq", "nướng", "lẩu", "korea", "korean", "kingbbq", "gogi", "tokbokki"]):
        cat = "nha-hang"
        badge = "Lẩu nướng thơm nức"
        img_pool = IMAGE_POOLS["bbq_hotpot"]
        price_range = "200k-300k"
        price_text = "180.000₫ - 350.000₫"
        tags = ["Lẩu nướng", "Tụ tập bạn bè", p["clean_district"]]
        desc = "Menu nướng và lẩu phong phú, thịt tẩm ướp đậm đà, nước sốt độc quyền kích thích vị giác."
    elif any(k in name_lower or k in cuisine for k in ["ốc", "hải sản", "seafood", "cua", "tôm"]):
        cat = "quan-an"
        badge = "Hải sản tươi sống"
        img_pool = IMAGE_POOLS["seafood"]
        price_range = "100k-200k"
        price_text = "90.000₫ - 220.000₫"
        tags = ["Hải sản", "Ốc ngon Sài Gòn", p["clean_district"]]
        desc = "Hải sản tươi sống đánh bắt trong ngày, chế biến thơm lừng sốt bơ tỏi, hoàng kim, sốt me đậm đà."
    elif amenity == "fast_food" or any(k in name_lower for k in ["bánh mì", "xôi", "bún đậu", "ăn vặt", "bánh tráng"]):
        cat = "via-he"
        badge = "Ăn vặt hot hit" if idx % 2 == 0 else "Đặc sản đường phố"
        img_pool = IMAGE_POOLS["street_food"]
        price_range = "duoi-100k"
        price_text = f"{25 + (idx % 3)*10}.000₫ - {55 + (idx % 4)*10}.000₫"
        tags = ["Ăn vặt", "Đường phố", p["clean_district"]]
        desc = "Món ăn đường phố đặc trưng Sài Gòn, giá cả bình dân, hương vị đậm đà thơm ngon khó cưỡng."
    elif any(k in name_lower for k in ["phở", "bún", "miến", "bánh canh", "noodle"]):
        cat = "quan-an"
        badge = "Chuẩn vị truyền thống"
        img_pool = IMAGE_POOLS["pho_noodles"]
        price_range = "duoi-100k"
        price_text = "50.000₫ - 95.000₫"
        tags = ["Món Việt", "Món nước truyền thống", p["clean_district"]]
        desc = "Nước dùng ninh từ xương hầm ngọt thanh, thịt tươi mềm, gia vị gia truyền đậm đà."
    elif any(k in name_lower for k in ["nhà hàng", "restaurant", "bistro", "steak", "pizza", "dining"]):
        cat = "nha-hang"
        badge = "Hẹn hò lý tưởng"
        img_pool = IMAGE_POOLS["western_bistro"]
        price_range = "200k-300k" if idx % 2 == 0 else "tren-300k"
        price_text = "180.000₫ - 420.000₫"
        tags = ["Nhà hàng", "Không gian sang trọng", p["clean_district"]]
        desc = "Không gian ẩm thực tinh tế, phục vụ chuyên nghiệp, thực đơn kết hợp hài hòa phong cách Á - Âu."
    elif amenity in ["bar", "pub", "ice_cream"]:
        cat = "khac"
        badge = "Check-in cực chill"
        img_pool = IMAGE_POOLS["bar_dessert"]
        price_range = "100k-200k"
        price_text = "75.000₫ - 180.000₫"
        tags = ["Chill đêm", "Đồ uống đặc biệt", p["clean_district"]]
        desc = "Điểm hẹn thư giãn sôi động về đêm với âm nhạc cuốn hút và thực đơn thức uống sáng tạo."
    else:
        cat = "quan-an"
        badge = "Món Việt ngon"
        img_pool = IMAGE_POOLS["viet_food"]
        price_range = "duoi-100k"
        price_text = "45.000₫ - 95.000₫"
        tags = ["Món Việt", "Quán ngon", p["clean_district"]]
        desc = "Quán ăn phục vụ các món cơm và đặc sản thuần Việt thơm ngon, nguyên liệu tươi mới mỗi ngày."
        
    rating = round(4.3 + (idx % 7) * 0.1, 1)
    if rating > 4.9:
        rating = 4.8
    reviews_count = f"{180 + (idx * 23) % 2800} đánh giá"
    
    # Hash for deterministic photo selection
    img_idx = int(hashlib.md5(name.encode()).hexdigest(), 16) % len(img_pool)
    img_url = img_pool[img_idx]
    
    badge_color = BADGE_COLORS[idx % len(BADGE_COLORS)]
    dist_val = round(1.0 + (idx % 25) * 0.18, 1)
    
    processed_places.append({
        "id": p["clean_id"],
        "name": name,
        "badge": badge,
        "badgeColor": badge_color,
        "rating": rating,
        "reviewCount": reviews_count,
        "distance": dist_val,
        "distanceText": f"{dist_val} km",
        "district": p["clean_district"],
        "tags": tags,
        "description": desc,
        "image": img_url,
        "categoryType": cat,
        "priceRange": price_range,
        "priceText": price_text,
        "latitude": p["lat"],
        "longitude": p["lon"]
    })

print(f"Successfully processed {len(processed_places)} complete ExplorePlace records!")
with open("scripts/processed_saigon_places.json", "w", encoding="utf-8") as f:
    json.dump(processed_places, f, ensure_ascii=False, indent=2)

print("Saved to scripts/processed_saigon_places.json")
