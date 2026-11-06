import { createServerClient } from "@/lib/supabase/server"
import { FEATURED_PLACES, type FeaturedPlace } from "@/data/featuredPlacesData"
import { EXPLORE_PLACES, type ExplorePlace } from "@/data/explorePlacesData"
import { getPlaceDetail } from "@/utils/placeResolver"
import type {
  PlaceDetailModel,
  MenuItem,
  AmenityItem,
  ReviewItem,
} from "@/types/placeDetail"
import type { Database } from "@/lib/supabase/types"

type PlaceRow = Database["public"]["Tables"]["places"]["Row"]
type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"]

/**
 * Lấy danh sách địa điểm nổi bật cho Trang chủ
 */
export async function getFeaturedPlaces(): Promise<FeaturedPlace[]> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from("places")
      .select("*")
      .eq("is_featured", true)
      .order("rating", { ascending: false })

    if (error || !data || data.length === 0) {
      // Thử fallback query top rating nếu chưa đánh dấu is_featured
      const fallbackQuery = await supabase
        .from("places")
        .select("*")
        .order("rating", { ascending: false })
        .limit(4)

      if (fallbackQuery.data && fallbackQuery.data.length > 0) {
        return mapPlacesToFeatured(fallbackQuery.data as PlaceRow[])
      }
      return FEATURED_PLACES
    }

    return mapPlacesToFeatured(data as PlaceRow[])
  } catch (err) {
    console.error("[placesService] getFeaturedPlaces error:", err)
    return FEATURED_PLACES
  }
}

function mapPlacesToFeatured(rows: PlaceRow[]): FeaturedPlace[] {
  return rows.map((p) => ({
    id: p.id,
    name: p.name,
    image: p.image || "/img/card-sakura.png",
    rating: Number(p.rating) || 5.0,
    location: `${p.district}, ${p.city}`,
    badge: p.badge || "Nổi bật",
    tags: (p.tags || []).slice(0, 3).map((tag, idx) => ({
      label: tag,
      highlight: idx === 0,
    })),
    href: `/places/${p.id}`,
  }))
}

/**
 * Lấy toàn bộ danh sách địa điểm cho Trang Khám phá
 */
export async function getExplorePlaces(): Promise<ExplorePlace[]> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from("places")
      .select("*")
      .order("rating", { ascending: false })

    if (error || !data || data.length === 0) {
      return EXPLORE_PLACES
    }

    return (data as PlaceRow[]).map((p) => {
      // Map category_id hợp lệ
      const validCategories: ExplorePlace["categoryType"][] = [
        "quan-an",
        "ca-phe",
        "nha-hang",
        "via-he",
        "khac",
      ]
      const categoryType = validCategories.includes(
        p.category_id as ExplorePlace["categoryType"],
      )
        ? p.category_id as ExplorePlace["categoryType"]
        : "quan-an"

      // Phân tích price_range sang enum format
      let priceRangeEnum: ExplorePlace["priceRange"] = "100k-200k"
      const priceText = p.price_range || "100.000₫ - 200.000₫"
      if (priceText.includes("50.000") || priceText.includes("Dưới 100k")) {
        priceRangeEnum = "duoi-100k"
      } else if (
        priceText.includes("200k-300k") ||
        priceText.includes("250.000")
      ) {
        priceRangeEnum = "200k-300k"
      } else if (
        priceText.includes("Trên 300k") ||
        priceText.includes("400.000")
      ) {
        priceRangeEnum = "tren-300k"
      }

      return {
        id: p.id,
        name: p.name,
        badge: p.badge || "Địa điểm ngon",
        badgeColor: p.badge_color || "bg-[#FF5376]",
        rating: Number(p.rating) || 5.0,
        reviewCount: `${p.review_count || 100}+ đánh giá`,
        distance: 1.5,
        distanceText: "1.5 km",
        district: p.district || "TP. Hồ Chí Minh",
        tags: p.tags && p.tags.length > 0 ? p.tags : ["Món ngon"],
        description:
          p.story ||
          "Địa điểm ẩm thực chuẩn vị với không gian ấm cúng và phong cách phục vụ chu đáo.",
        image: p.image || "/img/card-sakura.png",
        categoryType,
        priceRange: priceRangeEnum,
        priceText,
        latitude:
          p.latitude !== null && p.latitude !== undefined
            ? Number(p.latitude)
            : undefined,
        longitude:
          p.longitude !== null && p.longitude !== undefined
            ? Number(p.longitude)
            : undefined,
      }
    })
  } catch (err) {
    console.error("[placesService] getExplorePlaces error:", err)
    return EXPLORE_PLACES
  }
}

/**
 * Lấy chi tiết 1 địa điểm kèm theo đánh giá (reviews)
 */
export async function getPlaceDetailById(
  id: string,
): Promise<PlaceDetailModel | null> {
  try {
    const supabase = createServerClient()
    const { data: place, error: placeError } = await supabase
      .from("places")
      .select("*")
      .eq("id", id)
      .maybeSingle()

    if (placeError) {
      console.error("[placesService] placeError:", placeError)
    }

    if (!place) {
      // Fallback kiểm tra dữ liệu static hardcode phòng trường hợp id thuộc bộ cũ
      try {
        const staticPlace = getPlaceDetail(id)
        if (staticPlace) return staticPlace
      } catch {
        return null
      }
      return null
    }

    const p = place as PlaceRow

    // Query reviews tương ứng nếu có
    const { data: reviewsData } = await supabase
      .from("reviews")
      .select("*")
      .eq("place_id", id)
      .order("created_at", { ascending: false })

    const reviews: ReviewItem[] =
      reviewsData && reviewsData.length > 0
        ? (reviewsData as unknown as ReviewRow[]).map((r) => ({
            author: r.author_name,
            avatar:
              r.author_avatar ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
            rating: Number(r.rating) || 5.0,
            date: new Date(r.created_at).toLocaleDateString("vi-VN"),
            comment: r.comment,
          }))
        : [
            {
              author: "Khách hàng HYUN",
              avatar:
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
              rating: Number(p.rating) || 5.0,
              date: "Gần đây",
              comment:
                "Món ăn chuẩn vị, không gian quán rất ấm cúng và phục vụ nhiệt tình!",
            },
          ]

    // Parse JSONB cho menuItems & amenities
    let menuItems: MenuItem[] = []
    if (Array.isArray(p.menu_items)) {
      menuItems = (p.menu_items as unknown as MenuItem[])
    }

    let amenities: AmenityItem[] = []
    if (Array.isArray(p.amenities)) {
      amenities = (p.amenities as unknown as AmenityItem[])
    }
    if (amenities.length === 0) {
      amenities = [
        { icon: "📶", label: "Wi-Fi tốc độ cao" },
        { icon: "❄️", label: "Máy lạnh thoáng mát" },
        { icon: "🅿️", label: "Bãi đỗ xe thuận tiện" },
        { icon: "💳", label: "Thanh toán thẻ & chuyển khoản" },
      ]
    }

    return {
      id: p.id,
      name: p.name,
      categoryBadge: p.badge || "Ẩm thực",
      badgeColor: p.badge_color || "bg-[#FF5376]",
      rating: Number(p.rating) || 5.0,
      reviewCount: `${p.review_count || 100} đánh giá`,
      priceRange: p.price_range || "100.000₫ - 300.000₫",
      city: p.city || "TP. Hồ Chí Minh",
      district: p.district || "Quận 1",
      address: p.address,
      hours: p.hours || "09:00 - 22:00",
      isOpen: true,
      phone: p.phone || "0901 234 567",
      image: p.image || "/img/card-sakura.png",
      tags: p.tags && p.tags.length > 0 ? p.tags : ["Món ngon"],
      story:
        p.story ||
        "Địa điểm ẩm thực mang hương vị truyền thống đậm đà, được chọn lọc kỹ lưỡng bởi đội ngũ HYUN.",
      menuItems,
      amenities,
      reviews,
    }
  } catch (err) {
    console.error("[placesService] getPlaceDetailById error:", err)
    try {
      return getPlaceDetail(id)
    } catch {
      return null
    }
  }
}

/**
 * Lấy tất cả IDs địa điểm từ DB phục vụ generateStaticParams
 */
export async function getAllPlaceIdsFromDb(): Promise<string[]> {
  try {
    const supabase = createServerClient()
    const { data } = await supabase.from("places").select("id")
    if (data && data.length > 0) {
      return (data as unknown as { id: string }[]).map((d) => d.id)
    }
    return ["sakura-restaurant", "luna-cafe", "bui-vien", "riverside-garden"]
  } catch {
    return ["sakura-restaurant", "luna-cafe", "bui-vien", "riverside-garden"]
  }
}
