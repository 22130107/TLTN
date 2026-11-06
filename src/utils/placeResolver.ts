import { EXPLORE_PLACES, type ExplorePlace } from "@/data/explorePlacesData"
import { FEATURED_PLACES, type FeaturedPlace } from "@/data/featuredPlacesData"
import {
  ARCHIVE_PLACE_DETAILS,
  type PlaceDetailData,
} from "@/data/archivePlacesData"
import { mockScheduleItems } from "@/data/profileData"
import { ARCHIVE_ITEMS } from "@/constants/archivesData"
import type {
  PlaceDetailModel,
  MenuItem,
  AmenityItem,
  ReviewItem,
} from "@/types/placeDetail"

const DEFAULT_AMENITIES: AmenityItem[] = [
  { icon: "📶", label: "Wifi miễn phí tốc độ cao" },
  { icon: "❄️", label: "Máy lạnh thoáng mát" },
  { icon: "🛵", label: "Chỗ để xe máy & ô tô thuận tiện" },
  { icon: "💳", label: "Thanh toán thẻ & chuyển khoản QR" },
  { icon: "🌿", label: "Không gian sạch sẽ, ấm cúng" },
]

const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    author: "Minh Anh",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    rating: 5,
    date: "2 ngày trước",
    comment:
      "Hương vị đồ ăn rất xuất sắc, gia vị đậm đà chuẩn vị. Không gian thoáng và nhân viên phục vụ cực kỳ chu đáo!",
  },
  {
    author: "Hoàng Long",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    rating: 4.8,
    date: "1 tuần trước",
    comment:
      "Món ăn ra nhanh, nóng hổi. Giá cả rất hợp lý so với chất lượng trải nghiệm. Chắc chắn sẽ quay lại cùng gia đình.",
  },
]

export function getAllPlaceIds(): string[] {
  const ids = new Set<string>()

  EXPLORE_PLACES.forEach((p) => ids.add(p.id))
  FEATURED_PLACES.forEach((p) => ids.add(p.id))
  Object.keys(ARCHIVE_PLACE_DETAILS).forEach((id) => ids.add(id))
  mockScheduleItems.forEach((s) => ids.add(s.id))
  ARCHIVE_ITEMS.forEach((a) => ids.add(a.id))

  return Array.from(ids)
}

export function getPlaceDetail(id: string): PlaceDetailModel {
  // 1. Check in EXPLORE_PLACES first (primary modern dataset)
  const exploreItem = EXPLORE_PLACES.find((p) => p.id === id)
  if (exploreItem) {
    return {
      id: exploreItem.id,
      name: exploreItem.name,
      categoryBadge: exploreItem.badge || "Món Ngon Chuẩn Gu",
      badgeColor: exploreItem.badgeColor || "bg-[#FF5376]",
      rating: exploreItem.rating || 4.8,
      reviewCount: exploreItem.reviewCount || "1.2k đánh giá",
      priceRange: exploreItem.priceText || "50.000₫ - 150.000₫",
      city: "TP. Hồ Chí Minh",
      district: exploreItem.district || "Quận 1",
      address: `${exploreItem.district || "Quận 1"}, TP. Hồ Chí Minh`,
      hours: "08:00 - 22:30 hàng ngày",
      isOpen: true,
      phone: "+84 28 3822 6868",
      image: exploreItem.image,
      tags: exploreItem.tags || ["Ẩm thực", "Đặc sản"],
      story:
        exploreItem.description ||
        "Điểm hẹn ẩm thực đặc sắc được thực khách yêu thích bởi công thức gia truyền và nguyên liệu tươi ngon được tuyển chọn kỹ lưỡng trong ngày.",
      menuItems: [
        {
          name: `${exploreItem.name} - Món Đặc Trưng`,
          price: exploreItem.priceText.split("-")[0]?.trim() || "85.000₫",
          desc: "Món ăn làm nên thương hiệu của quán, chế biến từ nguyên liệu tươi thượng hạng.",
          isSignature: true,
        },
        {
          name: "Món Ăn Kèm Truyền Thống",
          price: "35.000₫",
          desc: "Được nêm nếm vừa vặn, tôn lên hương vị đặc trưng của món chính.",
        },
        {
          name: "Trà Thảo Mộc / Nước Mát Thanh Nhiệt",
          price: "25.000₫",
          desc: "Thức uống giải khát thanh lọc cơ thể tươi mát dùng kèm bữa ăn.",
        },
      ],
      amenities: DEFAULT_AMENITIES,
      reviews: DEFAULT_REVIEWS,
    }
  }

  // 2. Check in FEATURED_PLACES
  const featuredItem = FEATURED_PLACES.find((p) => p.id === id)
  if (featuredItem) {
    return {
      id: featuredItem.id,
      name: featuredItem.name,
      categoryBadge: featuredItem.badge || "Địa Điểm Nổi Bật",
      badgeColor: "bg-[#FF5376]",
      rating: featuredItem.rating || 4.8,
      reviewCount: "2.4k đánh giá",
      priceRange: "80.000₫ - 250.000₫",
      city: featuredItem.location.includes("Hà Nội")
        ? "TP. Hà Nội"
        : "TP. Hồ Chí Minh",
      district: featuredItem.location.split(",")[0]?.trim() || "Quận 1",
      address: featuredItem.location,
      hours: "09:00 - 23:00 hàng ngày",
      isOpen: true,
      phone: "+84 28 3910 8899",
      image: featuredItem.image,
      tags: featuredItem.tags.map((t) => t.label),
      story:
        "Tọa lạc tại vị trí đắc địa với không gian ẩm thực ấm cúng, tinh tế. Quán mang đến hành trình trải nghiệm hương vị ẩm thực độc đáo kết hợp giữa truyền thống và phong cách đương đại.",
      menuItems: [
        {
          name: `${featuredItem.name} Signature Platter`,
          price: "145.000₫",
          desc: "Phần ăn kết hợp các món đặc trưng được yêu thích nhất của quán.",
          isSignature: true,
        },
        {
          name: "Món Khai Vị Thanh Vị",
          price: "65.000₫",
          desc: "Bắt đầu bữa ăn bằng hương vị tươi ngon nhẹ nhàng đánh thức vị giác.",
        },
        {
          name: "Đồ Uống & Tráng Miệng Theo Mùa",
          price: "45.000₫",
          desc: "Món tráng miệng thủ công ngọt lành kết thúc trọn vẹn bữa tiệc.",
        },
      ],
      amenities: DEFAULT_AMENITIES,
      reviews: DEFAULT_REVIEWS,
    }
  }

  // 3. Check in ARCHIVE_PLACE_DETAILS
  const archiveItem = ARCHIVE_PLACE_DETAILS[id]
  if (archiveItem) {
    const cleanName =
      archiveItem.title.split("|")[0]?.trim() || archiveItem.title
    const mappedMenuItems: MenuItem[] = (archiveItem.menuItems || []).map(
      (m) => ({
        name: m.name,
        price: m.price,
        desc: m.desc,
        isSignature: m.isSignature,
      }),
    )

    return {
      id: archiveItem.id,
      name: cleanName,
      categoryBadge: archiveItem.tags[0] || "Đặc Sản Truyền Thống",
      badgeColor: "bg-[#FF5376]",
      rating: 4.9,
      reviewCount: "1.8k đánh giá",
      priceRange: "50.000₫ - 120.000₫",
      city: archiveItem.city,
      district: archiveItem.address.split(",")[1]?.trim() || archiveItem.city,
      address: archiveItem.address,
      hours: archiveItem.hours || "06:30 - 21:30",
      isOpen: true,
      phone: archiveItem.phone || "+84 28 3822 5678",
      image: archiveItem.image,
      tags: archiveItem.tags,
      story:
        archiveItem.story ||
        archiveItem.notes ||
        "Gìn giữ trọn vẹn tinh hoa ẩm thực truyền thống với công thức nước dùng ninh hầm kỹ lưỡng từ thảo mộc thiên nhiên.",
      menuItems:
        mappedMenuItems.length > 0
          ? mappedMenuItems
          : [
              {
                name: archiveItem.signatureDish || cleanName,
                price: "65.000₫",
                desc: "Hương vị chuẩn gu gia truyền từ bàn tay nghệ nhân.",
                isSignature: true,
              },
            ],
      amenities: DEFAULT_AMENITIES,
      reviews: DEFAULT_REVIEWS,
    }
  }

  // 4. Check in mockScheduleItems
  const scheduleItem = mockScheduleItems.find((s) => s.id === id)
  if (scheduleItem) {
    return {
      id: scheduleItem.id,
      name: scheduleItem.placeName,
      categoryBadge:
        scheduleItem.category.split("&")[0]?.trim() || "Điểm Hẹn Đã Lưu",
      badgeColor: "bg-[#FF5376]",
      rating: 4.7,
      reviewCount: "950 đánh giá",
      priceRange: "60.000₫ - 180.000₫",
      city: scheduleItem.address.includes("Hà Nội")
        ? "TP. Hà Nội"
        : "TP. Hồ Chí Minh",
      district: scheduleItem.address.split(",")[1]?.trim() || "Quận 1",
      address: scheduleItem.address,
      hours: `Hẹn lúc ${scheduleItem.time} - Mở cửa cả ngày`,
      isOpen: true,
      phone: "+84 24 3825 1234",
      image: scheduleItem.imageUrl,
      tags: [scheduleItem.category, scheduleItem.signatureDish],
      story:
        scheduleItem.notes ||
        "Điểm hẹn ẩm thực đặc sắc đã được lưu trong lịch trình trải nghiệm của bạn.",
      menuItems: [
        {
          name: scheduleItem.signatureDish,
          price: "75.000₫",
          desc: "Món ngon tiêu biểu được lựa chọn trong kế hoạch ẩm thực.",
          isSignature: true,
        },
      ],
      amenities: DEFAULT_AMENITIES,
      reviews: DEFAULT_REVIEWS,
    }
  }

  // 5. Check in ARCHIVE_ITEMS
  const archiveSimple = ARCHIVE_ITEMS.find((a) => a.id === id)
  if (archiveSimple) {
    const cleanName =
      archiveSimple.title.split("|")[0]?.trim() || archiveSimple.title
    return {
      id: archiveSimple.id,
      name: cleanName,
      categoryBadge: archiveSimple.tags[0] || "Ẩm Thực 3 Miền",
      badgeColor: "bg-[#FF5376]",
      rating: 4.8,
      reviewCount: "1.1k đánh giá",
      priceRange: "45.000₫ - 110.000₫",
      city: archiveSimple.city,
      district: archiveSimple.city,
      address: `${archiveSimple.city}, Việt Nam`,
      hours: "07:00 - 22:00 hàng ngày",
      isOpen: true,
      phone: "+84 28 3822 5678",
      image: archiveSimple.image,
      tags: archiveSimple.tags,
      story:
        "Hành trình khám phá hương vị tinh hoa ẩm thực ba miền Việt Nam chuẩn gu chọn lọc.",
      menuItems: [
        {
          name: cleanName,
          price: "60.000₫",
          desc: "Hương vị ẩm thực truyền thống đậm đà khó quên.",
          isSignature: true,
        },
      ],
      amenities: DEFAULT_AMENITIES,
      reviews: DEFAULT_REVIEWS,
    }
  }

  // Fallback default
  return getPlaceDetail("exp-01")
}
export default getPlaceDetail
