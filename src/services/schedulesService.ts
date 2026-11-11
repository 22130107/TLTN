import { createServerClient } from "@/lib/supabase/server"
import { mockScheduleItems, mockUserProfile } from "@/data/profileData"
import type { ScheduleItem, ScheduleStatus, UserProfile } from "@/types/profile"
import type { Database } from "@/lib/supabase/types"

type ScheduleRow = Database["public"]["Tables"]["schedules"]["Row"]
type PlaceRow = Database["public"]["Tables"]["places"]["Row"]

export interface ScheduleWithPlaceRow extends ScheduleRow {
  places: PlaceRow | null
}

function mapScheduleRowToItem(row: ScheduleWithPlaceRow): ScheduleItem {
  const place = row.places

  let mappedStatus: ScheduleStatus = "upcoming"
  if (row.status === "completed") {
    mappedStatus = "completed"
  } else if (row.status === "confirmed" || row.status === "pending") {
    mappedStatus = "upcoming"
  } else {
    mappedStatus = "upcoming"
  }

  // Lấy signature dish từ menu_items nếu có
  let signatureDish = "Món ăn đặc sắc"
  if (place?.menu_items && Array.isArray(place.menu_items)) {
    const items = place.menu_items as Array<{
      isSignature?: boolean
      name?: string
    }>
    const sig = items.find((m) => m?.isSignature)
    if (sig?.name) {
      signatureDish = sig.name
    } else if (items[0]?.name) {
      signatureDish = items[0].name
    }
  }

  return {
    id: row.id,
    placeId: row.place_id,
    userId: row.user_id,
    placeName: place?.name || "Địa điểm ẩm thực",
    category:
      place?.badge || (place?.tags ? place.tags.join(" • ") : "Ẩm thực"),
    address: place?.address || "TP. Hồ Chí Minh",
    date: row.scheduled_date,
    time: row.time_slot,
    status: mappedStatus,
    coordinates: {
      lat: place?.latitude || 10.7769,
      lng: place?.longitude || 106.7009,
    },
    guestsCount: row.party_size || 2,
    signatureDish,
    notes: row.notes || place?.story || "Lịch trình ẩm thực",
    imageUrl: place?.image || "/img/sakura-restaurant.jpg",
  }
}

/**
 * Lấy danh sách lịch trình từ DB Supabase (kèm thông tin địa điểm)
 */
export async function getSchedules(userId?: string): Promise<ScheduleItem[]> {
  try {
    if (!userId) {
      return []
    }

    const supabase = createServerClient()
    const { data, error } = await supabase
      .from("schedules")
      .select("*, places(*)")
      .eq("user_id", userId)
      .order("scheduled_date", { ascending: true })

    if (error || !data || data.length === 0) {
      return []
    }

    return (data as unknown as ScheduleWithPlaceRow[]).map(mapScheduleRowToItem)
  } catch (err) {
    console.error("[schedulesService] getSchedules error:", err)
    return []
  }
}

/**
 * Lấy thông tin hồ sơ người dùng từ DB Supabase
 */
export async function getUserProfile(userId?: string): Promise<UserProfile> {
  try {
    const supabase = createServerClient()
    let query = supabase.from("profiles").select("*")

    if (userId) {
      query = query.eq("id", userId)
    }

    const { data, error } = await query.limit(1).maybeSingle()

    if (error || !data) {
      return mockUserProfile
    }

    const profileRow = data as Database["public"]["Tables"]["profiles"]["Row"]

    return {
      id: profileRow.id,
      name: profileRow.display_name,
      handle: `@${profileRow.display_name.toLowerCase().replace(/\s+/g, "")}`,
      title: profileRow.level || "Tín đồ ẩm thực",
      avatarUrl: profileRow.avatar_url || "/img/profile-avatar.png",
      bio:
        profileRow.bio ||
        "Thích ăn ngon, đi nhiều, khám phá những điều mới mẻ 🍜",
      email: profileRow.email || "huynhcuboy0123@gmail.com",
      phone: profileRow.phone || "0799013785",
      locationName: "TP. Hồ Chí Minh",
      joinedYear: profileRow.created_at
        ? new Date(profileRow.created_at).getFullYear().toString()
        : "2026",
      followingCount: 0,
      followersCount: 0,
      homeCoordinate: {
        lat: 10.776889,
        lng: 106.700806,
      },
      stats: {
        visitedPlaces: 48,
        reviewsCount: 36,
        upcomingTrips: 4,
        rewardPoints: profileRow.points || 120,
      },
      favoriteTags: [
        "Cơm tấm",
        "Bánh mì",
        "Ẩm thực đường phố",
        "Bún bò",
        "Đặc sản Sài Gòn",
        "Cà phê sữa đá",
      ],
    }
  } catch (err) {
    console.error("[schedulesService] getUserProfile error:", err)
    return mockUserProfile
  }
}

/**
 * Lấy danh sách tên & id địa điểm phục vụ dropdown tạo lịch hẹn
 */
export async function getPlacesForSelect(): Promise<Array<{
  id: string
  name: string
}>> {
  try {
    const supabase = createServerClient()
    const { data, error } = await supabase
      .from("places")
      .select("id, name")
      .order("name")
    if (error || !data || data.length === 0) {
      return [
        { id: "sakura-restaurant", name: "Sakura Japanese Restaurant" },
        { id: "luna-cafe", name: "Luna Cafe & Bistro" },
        { id: "bui-vien", name: "Phố Ẩm Thực Bùi Viện" },
        { id: "riverside-garden", name: "Riverside Garden" },
      ]
    }
    return data as Array<{ id: string; name: string }>
  } catch {
    return [
      { id: "sakura-restaurant", name: "Sakura Japanese Restaurant" },
      { id: "luna-cafe", name: "Luna Cafe & Bistro" },
      { id: "bui-vien", name: "Phố Ẩm Thực Bùi Viện" },
      { id: "riverside-garden", name: "Riverside Garden" },
    ]
  }
}
