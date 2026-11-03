export interface PlaceTag {
  label: string
  highlight?: boolean
}

export interface FeaturedPlace {
  id: string
  name: string
  image: string
  rating: number
  location: string
  badge: string
  tags: PlaceTag[]
  href: string
}

export const FEATURED_PLACES: FeaturedPlace[] = [
  {
    id: "luna-cafe",
    name: "Luna Cafe & Bistro",
    image: "/img/luna-cafe.jpg",
    rating: 4.8,
    location: "Quận 1, TP. Hồ Chí Minh",
    badge: "Dành cho cặp đôi",
    tags: [{ label: "Café" }, { label: "Âu" }, { label: "View đẹp" }],
    href: "/places/luna-cafe",
  },
  {
    id: "sakura-restaurant",
    name: "Sakura Japanese Restaurant",
    image: "/img/sakura-restaurant.jpg",
    rating: 4.7,
    location: "Quận 3, TP. Hồ Chí Minh",
    badge: "Nhà hàng Nhật",
    tags: [{ label: "Sushi" }, { label: "Ramen" }, { label: "Yakiniku" }],
    href: "/places/sakura-restaurant",
  },
  {
    id: "bui-vien",
    name: "Phố Ẩm Thực Bùi Viện",
    image: "/img/bui-vien.jpg",
    rating: 4.5,
    location: "Quận 1, TP. Hồ Chí Minh",
    badge: "Quán ăn đường phố",
    tags: [
      { label: "Đặc sản" },
      { label: "Đường phố" },
      { label: "Giá tốt", highlight: true },
    ],
    href: "/places/bui-vien",
  },
  {
    id: "riverside-garden",
    name: "Riverside Garden",
    image: "/img/riverside-garden.jpg",
    rating: 4.6,
    location: "Thủ Đức, TP. Hồ Chí Minh",
    badge: "View đẹp",
    tags: [{ label: "Việt Nam" }, { label: "Âu" }, { label: "Hải sản" }],
    href: "/places/riverside-garden",
  },
]
