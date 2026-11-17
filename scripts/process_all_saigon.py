import json
import re
import hashlib

with open("scripts/saigon_osm_raw.json", encoding="utf-8") as f:
    raw_places = json.load(f)

print(f"Loaded {len(raw_places)} places from saigon_osm_raw.json")

IMAGE_POOLS = {
    "pho_noodles": [
        "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1617093727343-374698b1b08d?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1552611052-33e04de081de?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80",
    ],
    "viet_food": [
        "https://images.unsplash.com/photo-1503764654157-72d979d9af2f?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1541518763669-27fef04b14ea?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1628294895950-9805252327bc?w=800&auto=format&fit=crop&q=80",
    ],
    "cafe": [
        "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1497636577773-f1231844b336?w=800&auto=format&fit=crop&q=80",
    ],
    "street_food": [
        "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1561651823-34feb02250e4?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&auto=format&fit=crop&q=80",
    ],
    "japanese": [
        "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1611143669185-af224c5e3252?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1547592180-85f173990554?w=800&auto=format&fit=crop&q=80",
    ],
    "chinese": [
        "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1525755662778-989d0524087e?w=800&auto=format&fit=crop&q=80",
    ],
    "bbq_hotpot": [
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=800&auto=format&fit=crop&q=80",
    ],
    "seafood": [
        "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80",
    ],
    "western_bistro": [
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80",
    ],
    "bar_dessert": [
        "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format&fit=crop&q=80",
    ]
}

BADGE_COLORS = [
    "bg-[#FF5376]", "bg-[#E85D4E]", "bg-[#E57373]", "bg-[#4DB6AC]",
    "bg-[#BA68C8]", "bg-[#FFA726]", "bg-[#26A69A]", "bg-[#7E57C2]"
]

def normalize_district(raw):
    d = raw.strip()
    if d in ["Quận 1", "District 1", "D1", "Q1", "Quan 1", "1"]: return "Quận 1"
    if d in ["Quận 3", "District 3", "3"]: return "Quận 3"
    if d in ["Quận 4", "District 4", "4"]: return "Quận 4"
    if d in ["Quận 5", "District 5", "5"]: return "Quận 5"
    if d in ["Quận 6", "District 6", "6"]: return "Quận 6"
    if d in ["Quận 7", "District 7", "7"]: return "Quận 7"
    if d in ["Quận 8", "District 8", "8"]: return "Quận 8"
    if d in ["Quận 10", "District 10", "10"]: return "Quận 10"
    if d in ["Quận 11", "District 11", "11"]: return "Quận 11"
    if d in ["Quận 12", "District 12", "12"]: return "Quận 12"
    if "Tân Bình" in d: return "Quận Tân Bình"
    if "Tân Phú" in d: return "Quận Tân Phú"
    if "Bình Tân" in d: return "Quận Bình Tân"
    if "Gò Vấp" in d: return "Quận Gò Vấp"
    if "Phú Nhuận" in d: return "Quận Phú Nhuận"
    if "Bình Thạnh" in d: return "Quận Bình Thạnh"
    if any(k in d for k in ["Thủ Đức", "Quận 2", "Quận 9", "Quan 2", "District 2", "2", "Thảo Điền", "An Khánh"]):
        return "TP. Thủ Đức"
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

processed_places = []
used_ids = set()

for idx, p in enumerate(raw_places):
    name = p["name"].strip()
    if len(name) < 3 or name.lower() in ["wc", "toilet", "atm", "cafe", "coffee", "quan an", "quan", "ban ghe"]:
        continue
    
    clean_dist = normalize_district(p["district"])
    slug = "osm-" + slugify(name)
    if not slug:
        slug = f"osm-place-{p['osm_id']}"
    if slug in used_ids:
        slug = f"{slug}-{p['osm_id'][-4:]}"
    used_ids.add(slug)
    
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
        tags = ["Cà phê", "Không gian chill", clean_dist]
        desc = "Không gian thoáng mát, đồ uống pha chế chuẩn vị, thích hợp làm việc, hẹn hò và thư giãn."
    elif any(k in name_lower or k in cuisine for k in ["sushi", "ramen", "udon", "nhat", "japan", "yakiniku", "sashimi"]):
        cat = "nha-hang"
        badge = "Món Nhật chuẩn vị"
        img_pool = IMAGE_POOLS["japanese"]
        price_range = "200k-300k" if idx % 2 == 0 else "100k-200k"
        price_text = "120.000₫ - 280.000₫"
        tags = ["Món Nhật", "Hải sản tươi", clean_dist]
        desc = "Hương vị ẩm thực xứ sở Phù Tang tinh tế, nguyên liệu tươi ngon được chế biến tỉ mỉ."
    elif any(k in name_lower or k in cuisine for k in ["dimsum", "hoa", "china", "chinese", "tiệm mì", "sủi cảo", "hủ tiếu nam vang", "hủ tiếu"]):
        cat = "quan-an" if "hủ tiếu" in name_lower else "nha-hang"
        badge = "Món Hoa chuẩn vị"
        img_pool = IMAGE_POOLS["chinese"]
        price_range = "100k-200k"
        price_text = "85.000₫ - 180.000₫"
        tags = ["Món Hoa", "Đặc sản", clean_dist]
        desc = "Hương vị ẩm thực Trung Hoa gia truyền, nước dùng ngọt thanh, điểm tâm dimsum hấp dẫn."
    elif any(k in name_lower or k in cuisine for k in ["bbq", "nướng", "lẩu", "korea", "korean", "kingbbq", "gogi", "tokbokki"]):
        cat = "nha-hang"
        badge = "Lẩu nướng thơm nức"
        img_pool = IMAGE_POOLS["bbq_hotpot"]
        price_range = "200k-300k"
        price_text = "180.000₫ - 350.000₫"
        tags = ["Lẩu nướng", "Tụ tập bạn bè", clean_dist]
        desc = "Menu nướng và lẩu phong phú, thịt tẩm ướp đậm đà, nước sốt độc quyền kích thích vị giác."
    elif any(k in name_lower or k in cuisine for k in ["ốc", "hải sản", "seafood", "cua", "tôm"]):
        cat = "quan-an"
        badge = "Hải sản tươi sống"
        img_pool = IMAGE_POOLS["seafood"]
        price_range = "100k-200k"
        price_text = "90.000₫ - 220.000₫"
        tags = ["Hải sản", "Ốc ngon Sài Gòn", clean_dist]
        desc = "Hải sản tươi sống đánh bắt trong ngày, chế biến thơm lừng sốt bơ tỏi, hoàng kim, sốt me đậm đà."
    elif amenity == "fast_food" or any(k in name_lower for k in ["bánh mì", "xôi", "bún đậu", "ăn vặt", "bánh tráng"]):
        cat = "via-he"
        badge = "Ăn vặt hot hit" if idx % 2 == 0 else "Đặc sản đường phố"
        img_pool = IMAGE_POOLS["street_food"]
        price_range = "duoi-100k"
        price_text = f"{25 + (idx % 3)*10}.000₫ - {55 + (idx % 4)*10}.000₫"
        tags = ["Ăn vặt", "Đường phố", clean_dist]
        desc = "Món ăn đường phố đặc trưng Sài Gòn, giá cả bình dân, hương vị đậm đà thơm ngon khó cưỡng."
    elif any(k in name_lower for k in ["phở", "bún", "miến", "bánh canh", "noodle"]):
        cat = "quan-an"
        badge = "Chuẩn vị truyền thống"
        img_pool = IMAGE_POOLS["pho_noodles"]
        price_range = "duoi-100k"
        price_text = "50.000₫ - 95.000₫"
        tags = ["Món Việt", "Món nước truyền thống", clean_dist]
        desc = "Nước dùng ninh từ xương hầm ngọt thanh, thịt tươi mềm, gia vị gia truyền đậm đà."
    elif any(k in name_lower for k in ["nhà hàng", "restaurant", "bistro", "steak", "pizza", "dining"]):
        cat = "nha-hang"
        badge = "Hẹn hò lý tưởng"
        img_pool = IMAGE_POOLS["western_bistro"]
        price_range = "200k-300k" if idx % 2 == 0 else "tren-300k"
        price_text = "180.000₫ - 420.000₫"
        tags = ["Nhà hàng", "Không gian sang trọng", clean_dist]
        desc = "Không gian ẩm thực tinh tế, phục vụ chuyên nghiệp, thực đơn kết hợp hài hòa phong cách Á - Âu."
    elif amenity in ["bar", "pub", "ice_cream"]:
        cat = "khac"
        badge = "Check-in cực chill"
        img_pool = IMAGE_POOLS["bar_dessert"]
        price_range = "100k-200k"
        price_text = "75.000₫ - 180.000₫"
        tags = ["Chill đêm", "Đồ uống đặc biệt", clean_dist]
        desc = "Điểm hẹn thư giãn sôi động về đêm với âm nhạc cuốn hút và thực đơn thức uống sáng tạo."
    else:
        cat = "quan-an"
        badge = "Món Việt ngon"
        img_pool = IMAGE_POOLS["viet_food"]
        price_range = "duoi-100k"
        price_text = "45.000₫ - 95.000₫"
        tags = ["Món Việt", "Quán ngon", clean_dist]
        desc = "Quán ăn phục vụ các món cơm và đặc sản thuần Việt thơm ngon, nguyên liệu tươi mới mỗi ngày."
        
    rating = round(4.2 + (idx % 8) * 0.1, 1)
    if rating > 4.9:
        rating = 4.8
    reviews_count = f"{120 + (idx * 27) % 3200} đánh giá"
    
    img_idx = int(hashlib.md5(name.encode()).hexdigest(), 16) % len(img_pool)
    img_url = img_pool[img_idx]
    badge_color = BADGE_COLORS[idx % len(BADGE_COLORS)]
    dist_val = round(1.0 + (idx % 35) * 0.16, 1)
    
    processed_places.append({
        "id": slug,
        "name": name,
        "badge": badge,
        "badgeColor": badge_color,
        "rating": rating,
        "reviewCount": reviews_count,
        "distance": dist_val,
        "distanceText": f"{dist_val} km",
        "district": clean_dist,
        "tags": tags,
        "description": desc,
        "image": img_url,
        "categoryType": cat,
        "priceRange": price_range,
        "priceText": price_text,
        "latitude": p["lat"],
        "longitude": p["lon"]
    })

print(f"Total processed places for Saigon: {len(processed_places)}")

# Header template
header = """export interface ExplorePlace {
  id: string
  name: string
  badge: string
  badgeColor: string
  rating: number
  reviewCount: string
  distance: number // in km (e.g. 1.2)
  distanceText: string
  district: string
  tags: string[]
  description: string
  image: string
  categoryType: "quan-an" | "ca-phe" | "nha-hang" | "via-he" | "khac"
  priceRange: "duoi-100k" | "100k-200k" | "200k-300k" | "tren-300k"
  priceText: string
  latitude?: number
  longitude?: number
}

export const EXPLORE_PLACES: ExplorePlace[] = [
"""

# Original 13 featured places
orig_13 = """  {
    id: "exp-01",
    name: "Ramen Ichiban",
    badge: "Được yêu thích",
    badgeColor: "bg-[#FF5376]",
    rating: 4.8,
    reviewCount: "3.2k đánh giá",
    distance: 1.2,
    distanceText: "1.2 km",
    district: "Quận 3",
    tags: ["Món Nhật", "Ramen"],
    description:
      "Hương vị Nhật Bản chuẩn vị, nước dùng đậm đà, topping phong phú.",
    image: "/img/ichiran-ramen.png",
    categoryType: "quan-an",
    priceRange: "100k-200k",
    priceText: "120.000₫ - 180.000₫",
  },
  {
    id: "exp-02",
    name: "Bánh Xèo Cô Ba",
    badge: "Món Việt ngon",
    badgeColor: "bg-[#E85D4E]",
    rating: 4.6,
    reviewCount: "892 đánh giá",
    distance: 2.1,
    distanceText: "2.1 km",
    district: "Quận Phú Nhuận",
    tags: ["Món Việt", "Bánh xèo"],
    description: "Bánh xèo giòn rụm, nhân đầy đặn, nước chấm đặc biệt.",
    image: "/img/banh.png",
    categoryType: "quan-an",
    priceRange: "duoi-100k",
    priceText: "45.000₫ - 80.000₫",
  },
  {
    id: "exp-03",
    name: "Là Việt Coffee & Bistro",
    badge: "Không gian đẹp",
    badgeColor: "bg-[#E57373]",
    rating: 4.7,
    reviewCount: "674 đánh giá",
    distance: 1.9,
    distanceText: "1.9 km",
    district: "Quận 1",
    tags: ["Cà phê", "Âu"],
    description:
      "Không gian thoáng mát, view đẹp, thích hợp hẹn hò, thư giãn.",
    image: "/img/cafe.png",
    categoryType: "ca-phe",
    priceRange: "duoi-100k",
    priceText: "40.000₫ - 75.000₫",
  },
  {
    id: "exp-04",
    name: "Pizza 4P's Bến Thành",
    badge: "Hẹn hò lý tưởng",
    badgeColor: "bg-[#4DB6AC]",
    rating: 4.9,
    reviewCount: "4.5k đánh giá",
    distance: 0.8,
    distanceText: "0.8 km",
    district: "Quận 1",
    tags: ["Pizza", "Món Âu", "Phô mai tươi"],
    description: "Thương hiệu pizza nướng củi danh tiếng với phô mai burrata thủ công tươi béo ngậy.",
    image: "/img/card-sakura.png",
    categoryType: "nha-hang",
    priceRange: "200k-300k",
    priceText: "200.000₫ - 350.000₫",
  },
  {
    id: "exp-05",
    name: "Phở Lệ Nguyễn Trãi",
    badge: "Đặc sản Sài Gòn",
    badgeColor: "bg-[#FF5376]",
    rating: 4.7,
    reviewCount: "5.1k đánh giá",
    distance: 2.8,
    distanceText: "2.8 km",
    district: "Quận 5",
    tags: ["Phở bò", "Món Việt", "Gia truyền"],
    description: "Quán phở bò người Hoa nổi tiếng bậc nhất Chợ Lớn với nước dùng béo đậm đà và thịt bò tái nạm mềm tan.",
    image: "/img/card-sakura.png",
    categoryType: "quan-an",
    priceRange: "duoi-100k",
    priceText: "65.000₫ - 95.000₫",
  },
  {
    id: "exp-06",
    name: "Cơm Tấm Ba Ghiền",
    badge: "Được yêu thích",
    badgeColor: "bg-[#E85D4E]",
    rating: 4.6,
    reviewCount: "6.8k đánh giá",
    distance: 3.5,
    distanceText: "3.5 km",
    district: "Quận Phú Nhuận",
    tags: ["Cơm tấm", "Sườn nướng", "Món Việt"],
    description: "Miếng sườn nướng khổng lồ che kín đĩa cơm tấm trứ danh, tẩm ướp đậm vị và nướng than hoa thơm lừng.",
    image: "/img/card-sakura.png",
    categoryType: "quan-an",
    priceRange: "duoi-100k",
    priceText: "85.000₫ - 120.000₫",
  },
  {
    id: "exp-07",
    name: "Bánh Mì Huỳnh Hoa",
    badge: "Đặc sản Sài Gòn",
    badgeColor: "bg-[#FFA726]",
    rating: 4.5,
    reviewCount: "8.2k đánh giá",
    distance: 1.1,
    distanceText: "1.1 km",
    district: "Quận 1",
    tags: ["Bánh mì", "Pate", "Ăn vặt"],
    description: "Ổ bánh mì pate thịt nguội ngập tràn nhân nức tiếng Sài Thành, vỏ giòn rụm và pate béo ngậy đặc trưng.",
    image: "/img/card-sakura.png",
    categoryType: "via-he",
    priceRange: "duoi-100k",
    priceText: "65.000₫ - 80.000₫",
  },
  {
    id: "exp-08",
    name: "Dim Tu Tac Saigon Centre",
    badge: "Món Hoa chuẩn vị",
    badgeColor: "bg-[#BA68C8]",
    rating: 4.8,
    reviewCount: "2.1k đánh giá",
    distance: 0.5,
    distanceText: "0.5 km",
    district: "Quận 1",
    tags: ["Dimsum", "Món Quảng Đông", "Vịt quay"],
    description: "Thiên đường ẩm thực Quảng Đông đương đại với há cảo tôm tươi, bánh bao kim sa và vịt quay giòn da.",
    image: "/img/card-sakura.png",
    categoryType: "nha-hang",
    priceRange: "200k-300k",
    priceText: "180.000₫ - 350.000₫",
  },
  {
    id: "exp-09",
    name: "The Workshop Coffee",
    badge: "Cà phê chill",
    badgeColor: "bg-[#4DB6AC]",
    rating: 4.7,
    reviewCount: "1.8k đánh giá",
    distance: 0.9,
    distanceText: "0.9 km",
    district: "Quận 1",
    tags: ["Specialty Coffee", "Brew Bar", "Không gian đẹp"],
    description: "Quán cà phê specialty tiên phong tại TP.HCM trong không gian gác xép cổ điển giữa lòng Đồng Khởi.",
    image: "/img/card-sakura.png",
    categoryType: "ca-phe",
    priceRange: "duoi-100k",
    priceText: "65.000₫ - 95.000₫",
  },
  {
    id: "exp-10",
    name: "Ốc Oanh Vĩnh Khánh",
    badge: "Được yêu thích",
    badgeColor: "bg-[#E85D4E]",
    rating: 4.6,
    reviewCount: "3.7k đánh giá",
    distance: 2.2,
    distanceText: "2.2 km",
    district: "Quận 4",
    tags: ["Ốc Sài Gòn", "Hải sản", "Nhậu đêm"],
    description: "Quán ốc huyền thoại trên phố ẩm thực Vĩnh Khánh với món càng ghẹ rang muối ớt và ốc hương xào bơ tỏi.",
    image: "/img/card-sakura.png",
    categoryType: "via-he",
    priceRange: "100k-200k",
    priceText: "120.000₫ - 250.000₫",
  },
  {
    id: "exp-11",
    name: "Haidilao Hotpot Bitexco",
    badge: "Lẩu nướng thơm nức",
    badgeColor: "bg-[#FF5376]",
    rating: 4.9,
    reviewCount: "6.2k đánh giá",
    distance: 0.7,
    distanceText: "0.7 km",
    district: "Quận 1",
    tags: ["Lẩu Tứ Xuyên", "Múa mì", "Phục vụ đỉnh cao"],
    description: "Trải nghiệm lẩu nổi tiếng thế giới với dịch vụ chu đáo vô tận, nước lẩu cà chua và nấm bổ dưỡng.",
    image: "/img/card-sakura.png",
    categoryType: "nha-hang",
    priceRange: "tren-300k",
    priceText: "350.000₫ - 600.000₫",
  },
  {
    id: "exp-12",
    name: "Cà Phê Vợt Phan Đình Phùng",
    badge: "Chuẩn vị truyền thống",
    badgeColor: "bg-[#FFA726]",
    rating: 4.6,
    reviewCount: "4.1k đánh giá",
    distance: 2.6,
    distanceText: "2.6 km",
    district: "Quận Phú Nhuận",
    tags: ["Cà phê vợt", "Kỷ niệm xưa", "Mở 24/7"],
    description: "Quán cà phê vợt hơn 60 năm đỏ lửa thâu đêm bên góc phố, lưu giữ nét văn hóa cà phê độc đáo của Sài Gòn xưa.",
    image: "/img/card-sakura.png",
    categoryType: "via-he",
    priceRange: "duoi-100k",
    priceText: "20.000₫ - 35.000₫",
  },
  {
    id: "exp-13",
    name: "Anan Saigon Cuisine",
    badge: "Đẳng cấp Michelin",
    badgeColor: "bg-[#7E57C2]",
    rating: 4.9,
    reviewCount: "1.4k đánh giá",
    distance: 0.6,
    distanceText: "0.6 km",
    district: "Quận 1",
    tags: ["Michelin 1 Star", "Modern Viet", "Fine Dining"],
    description: "Nhà hàng 1 sao Michelin tại chợ Cũ Tôn Thất Đạm, nâng tầm ẩm thực đường phố Việt Nam thành nghệ thuật đương đại.",
    image: "/img/card-sakura.png",
    categoryType: "nha-hang",
    priceRange: "tren-300k",
    priceText: "400.000₫ - 1.200.000₫",
  }"""

osm_blocks = []
sql_rows = []

for p in processed_places:
    tags_ts = json.dumps(p["tags"], ensure_ascii=False)
    desc_escaped = p["description"].replace('"', '\\"')
    name_escaped = p["name"].replace('"', '\\"')
    
    block = f"""  {{
    id: "{p['id']}",
    name: "{name_escaped}",
    badge: "{p['badge']}",
    badgeColor: "{p['badgeColor']}",
    rating: {p['rating']},
    reviewCount: "{p['reviewCount']}",
    distance: {p['distance']},
    distanceText: "{p['distanceText']}",
    district: "{p['district']}",
    tags: {tags_ts},
    description: "{desc_escaped}",
    image: "{p['image']}",
    categoryType: "{p['categoryType']}",
    priceRange: "{p['priceRange']}",
    priceText: "{p['priceText']}",
    latitude: {p['latitude']},
    longitude: {p['longitude']},
  }}"""
    osm_blocks.append(block)
    
    tags_sql = "ARRAY[" + ", ".join(f"'{t.replace("'", "''")}'" for t in p["tags"]) + "]"
    sql_name = p['name'].replace("'", "''")
    sql_desc = p['description'].replace("'", "''")
    sql_dist = p['district'].replace("'", "''")
    sql_address = f"Khu ẩm thực {p['district']}, TP. Hồ Chí Minh".replace("'", "''")
    
    sql_row = f"""  (
    '{p['id']}',
    '{sql_name}',
    '{p['image']}',
    {p['rating']},
    {int(re.search(r'\d+', p['reviewCount']).group(0)) if re.search(r'\d+', p['reviewCount']) else 150},
    '{sql_address}',
    '{sql_dist}',
    'TP. Hồ Chí Minh',
    '{p['categoryType']}',
    '{p['badge']}',
    '{p['badgeColor']}',
    '{p['priceText']}',
    '08:00 - 22:30',
    '090' || floor(random() * 8999999 + 1000000)::text,
    '{sql_desc}',
    {tags_sql},
    {p['latitude']},
    {p['longitude']},
    {('true' if p['rating'] >= 4.8 else 'false')}
  )"""
    sql_rows.append(sql_row)

final_ts = header + orig_13 + ",\n" + ",\n".join(osm_blocks) + "\n]\n"

with open("src/data/explorePlacesData.ts", "w", encoding="utf-8") as f:
    f.write(final_ts)

total_places = 13 + len(processed_places)
print(f"Updated src/data/explorePlacesData.ts with ALL {total_places} places!")

# Write SQL seed
sql_content = f"""-- ==============================================================================
-- OpenStreetMap Seed Data: Full Saigon Collection ({len(processed_places)} Places)
-- ==============================================================================

INSERT INTO public.places (
  id, name, image, rating, review_count, address, district, city,
  category_id, badge, badge_color, price_range, hours, phone,
  story, tags, latitude, longitude, is_featured
)
VALUES
{",\n".join(sql_rows)}
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  image = EXCLUDED.image,
  rating = EXCLUDED.rating,
  review_count = EXCLUDED.review_count,
  district = EXCLUDED.district,
  price_range = EXCLUDED.price_range,
  latitude = EXCLUDED.latitude,
  longitude = EXCLUDED.longitude;
"""

with open("supabase/seed_saigon_osm.sql", "w", encoding="utf-8") as f:
    f.write(sql_content)

print(f"Saved complete seed to supabase/seed_saigon_osm.sql ({len(processed_places)} places)!")
