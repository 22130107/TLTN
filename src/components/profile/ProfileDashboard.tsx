"use client"

// Dữ liệu trải nghiệm mẫu cho người dùng khách hoặc tài khoản mới

// State dữ liệu đánh giá & lịch hẹn từ Supabase

// Settings form states

// Search filter trong danh sách yêu thích
// Lọc lịch hẹn

// Hỗ trợ mở trực tiếp tab từ query param (ví dụ: /profile?tab=favorites)

// Fetch dữ liệu người dùng khi đã đăng nhập

// 1. Lấy đánh giá của user

// 2. Lấy lịch hẹn của user

// Đồng bộ thông tin vào Settings tab

// Dữ liệu hiển thị kết hợp từ FavoritesContext và Supabase

// Xóa khỏi danh sách yêu thích trực tiếp qua FavoritesContext

// Định vị GPS trong tab cài đặt

// Lưu cài đặt hồ sơ trong tab Settings

// Tính toán điểm thưởng & thành tích

// Lọc favorites theo ô tìm kiếm

// Lọc schedules theo tab trạng thái
/* ========================================================= */ /* CỘT 1: Navigation Menu Điều Hướng Tab (Bo nhẹ, bóng tương phản gọn) */ /* ========================================================= */ /* Cute Sticker Banner Minkura */ /* ========================================================= */ /* NỘI DUNG CHÍNH: Thay đổi linh hoạt theo activeTab         */ /* ========================================================= */ /* TAB 1: TRANG CÁ NHÂN (TỔNG QUAN) */ /* Cột trái: Thông tin cá nhân & 3 Thẻ thống kê */ /* 3 Thẻ thống kê */ /* Cột giữa: Địa điểm yêu thích gần đây & Đánh giá gần đây */ /* Yêu thích thu nhỏ */ /* Đánh giá thu nhỏ */ /* Cột phải: Thành tích & Phím tắt Lịch trình */ /* TAB 2: TOÀN BỘ DANH SÁCH YÊU THÍCH */ /* Grid các quán yêu thích */ /* TAB 3: TOÀN BỘ ĐÁNH GIÁ CỦA TÔI */ /* TAB 4: TOÀN BỘ LỊCH HẸN CỦA TÔI */ /* TAB 5: CÀI ĐẶT HỒ SƠ TẠI CHỖ */ /* Tên hiển thị */ /* Email (Readonly) */ /* Số điện thoại */ /* Vị trí địa lý + Nút GPS */ /* Tiểu sử */

import { useState, useEffect, useCallback } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useFavorites } from "@/contexts/FavoritesContext"
import { supabase } from "@/lib/supabase/client"
import { getUserArticles } from "@/services/articlesService"
import type { Article } from "@/types/article"
import {
  requestCurrentPosition,
  reverseGeocodeOsm,
  saveUserLocation,
} from "@/utils/geolocation"
import type { Database } from "@/lib/supabase/types"

type PlaceRow = Database["public"]["Tables"]["places"]["Row"]
type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"]

interface FavoriteItem {
  id: string
  place: PlaceRow | null
}

interface ReviewWithPlace extends ReviewRow {
  place?: PlaceRow | null
}

type ArticleWithPlace = Article & {
  place?: PlaceRow | null
}

type FeedItem =
  | {
      type: "article"
      id: string
      date: string
      data: ArticleWithPlace
    }
  | {
      type: "review"
      id: string
      date: string
      data: ReviewWithPlace
    }

interface ScheduleWithPlace {
  id: string
  user_id?: string | null
  place_id: string
  scheduled_date: string
  time_slot: string
  party_size: number
  status: string
  notes?: string | null
  places: PlaceRow | null
}

interface ProfileDashboardProps {
  onOpenEditModal: () => void
}
const DEMO_FAVORITES: FavoriteItem[] = [
  {
    id: "demo-fav-1",
    place: {
      id: "sakura-restaurant",
      name: "Sakura Japanese Restaurant",
      image: "/img/sakura-restaurant.jpg",
      rating: 4.8,
      district: "Quận 1, TP. Hồ Chí Minh",
      badge: "Nhà hàng Nhật",
      address: "15 Lê Thánh Tôn, Bến Nghé, Quận 1",
    } as PlaceRow,
  },
  {
    id: "demo-fav-2",
    place: {
      id: "riverside-garden",
      name: "Riverside Garden",
      image: "/img/riverside-garden.jpg",
      rating: 4.6,
      district: "Bình Thạnh, TP. Hồ Chí Minh",
      badge: "View đẹp",
      address: "Khu Bờ Sông Thanh Đa, P.27, Bình Thạnh",
    } as PlaceRow,
  },
  {
    id: "demo-fav-3",
    place: {
      id: "luna-cafe",
      name: "Luna Cafe & Bistro",
      image: "/img/luna-cafe.jpg",
      rating: 5.0,
      district: "Quận 1, TP. Hồ Chí Minh",
      badge: "Cà phê & Bánh",
      address: "88 Hai Bà Trưng, Bến Nghé, Quận 1",
    } as PlaceRow,
  },
  {
    id: "demo-fav-4",
    place: {
      id: "bui-vien",
      name: "Phố Ẩm Thực Bùi Viện",
      image: "/img/bui-vien.jpg",
      rating: 4.5,
      district: "Quận 1, TP. Hồ Chí Minh",
      badge: "Đường phố",
      address: "Đường Bùi Viện, Phạm Ngũ Lão, Quận 1",
    } as PlaceRow,
  },
]

const DEMO_SCHEDULES: ScheduleWithPlace[] = [
  {
    id: "demo-sch-1",
    user_id: "demo",
    place_id: "sakura-restaurant",
    scheduled_date: "2026-11-20",
    time_slot: "18:30 - 20:00",
    party_size: 4,
    status: "confirmed",
    notes:
      "Bữa tối họp mặt bạn bè cuối tuần, thưởng thức set sushi cá hồi đặc biệt.",
    places: {
      id: "sakura-restaurant",
      name: "Sakura Japanese Restaurant",
      image: "/img/sakura-restaurant.jpg",
      address: "15 Lê Thánh Tôn, Bến Nghé, Quận 1",
      district: "Quận 1",
      badge: "Nhà hàng Nhật",
    } as PlaceRow,
  },
  {
    id: "demo-sch-2",
    user_id: "demo",
    place_id: "riverside-garden",
    scheduled_date: "2026-11-10",
    time_slot: "17:30 - 19:30",
    party_size: 2,
    status: "completed",
    notes:
      "Ngắm hoàng hôn ven sông Thanh Đa và thưởng thức tôm càng nướng mọi.",
    places: {
      id: "riverside-garden",
      name: "Riverside Garden",
      image: "/img/riverside-garden.jpg",
      address: "Khu Bờ Sông Thanh Đa, P.27, Bình Thạnh",
      district: "Bình Thạnh",
      badge: "View đẹp",
    } as PlaceRow,
  },
]

export default function ProfileDashboard({
  onOpenEditModal,
}: ProfileDashboardProps) {
  const { user, profile, updateProfile } = useAuth()
  const { favorites, removeFavorite } = useFavorites()
  const [activeTab, setActiveTab] =
    useState<"profile" | "favorites" | "reviews" | "schedules" | "settings">(
      "profile",
    )
  const [articlesList, setArticlesList] = useState<ArticleWithPlace[]>([])
  const [reviewsList, setReviewsList] = useState<ReviewWithPlace[]>([])
  const [schedulesList, setSchedulesList] = useState<ScheduleWithPlace[]>([])
  const [feedFilterType, setFeedFilterType] = useState<
    "all" | "articles" | "reviews"
  >("all")
  const [isLoading, setIsLoading] = useState(false)
  const [settingsName, setSettingsName] = useState("")
  const [settingsBio, setSettingsBio] = useState("")
  const [settingsPhone, setSettingsPhone] = useState("")
  const [settingsLocation, setSettingsLocation] = useState("")
  const [isLocatingGPS, setIsLocatingGPS] = useState(false)
  const [isSavingSettings, setIsSavingSettings] = useState(false)
  const [settingsFeedback, setSettingsFeedback] = useState("")
  const [favSearchQuery, setFavSearchQuery] = useState("")
  const [scheduleFilterStatus, setScheduleFilterStatus] =
    useState<"all" | "upcoming" | "completed">("all")
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search)
      const tabParam = params.get("tab")
      if (
        tabParam === "favorites" ||
        tabParam === "reviews" ||
        tabParam === "schedules" ||
        tabParam === "settings" ||
        tabParam === "profile"
      ) {
        setActiveTab(tabParam)
      }
    }
  }, [])
  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true)
      if (user) {
        // 1. Fetch user articles from Supabase DB & local cache
        const arts = await getUserArticles(
          user.id,
          profile?.display_name || undefined,
        )
        setArticlesList(arts)

        // 2. Fetch user reviews from Supabase DB
        const authorMatch = profile?.display_name || user.email || ""
        const { data: revs } = await supabase
          .from("reviews")
          .select("*, places(*)")
          .or(`user_id.eq.${user.id},author_name.eq."${authorMatch}"`)
          .order("created_at", { ascending: false })

        if (revs) {
          setReviewsList(
            revs.map((r: any) => ({
              ...r,
              place: r.places as PlaceRow,
            })),
          )
        }

        // 3. Fetch user schedules from Supabase DB
        const { data: schs } = await supabase
          .from("schedules")
          .select("*, places(*)")
          .eq("user_id", user.id)
          .order("scheduled_date", { ascending: false })

        if (schs) {
          setSchedulesList(
            schs.map((s: any) => ({
              ...s,
              places: s.places as PlaceRow,
            })),
          )
        }
      } else {
        // Guest user: fetch real public articles & reviews directly from Supabase DB
        const arts = await getUserArticles()
        setArticlesList(arts)

        const { data: revs } = await supabase
          .from("reviews")
          .select("*, places(*)")
          .order("created_at", { ascending: false })
          .limit(6)

        if (revs) {
          setReviewsList(
            revs.map((r: any) => ({
              ...r,
              place: r.places as PlaceRow,
            })),
          )
        }

        setSchedulesList([])
      }
    } catch (err) {
      console.error("[ProfileDashboard] fetch error:", err)
    } finally {
      setIsLoading(false)
    }
  }, [user, profile?.display_name])

  useEffect(() => {
    fetchDashboardData()
  }, [fetchDashboardData])
  useEffect(() => {
    if (profile) {
      setSettingsName(profile.display_name || "")
      setSettingsBio(profile.bio || "")
      setSettingsPhone(profile.phone || "")
      setSettingsLocation(profile.location_name || "TP. Hồ Chí Minh")
    }
  }, [profile])
  const isUsingDemoSchedules = user ? schedulesList.length === 0 : true

  const displayFavorites = favorites
  const displaySchedules = isUsingDemoSchedules ? DEMO_SCHEDULES : schedulesList
  const handleRemoveFavorite = async (favIdOrPlaceId: string) => {
    await removeFavorite(favIdOrPlaceId)
  }
  const handleGetGPS = async () => {
    setIsLocatingGPS(true)
    try {
      const pos = await requestCurrentPosition()
      const geo = await reverseGeocodeOsm(
        pos.coords.latitude,
        pos.coords.longitude,
      )
      setSettingsLocation(geo.addressName)
      saveUserLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
        accuracy: pos.coords.accuracy,
        addressName: geo.addressName,
        city: geo.city,
        isGPS: true,
      })
    } catch {
      setSettingsLocation("TP. Hồ Chí Minh")
    } finally {
      setIsLocatingGPS(false)
    }
  }
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSavingSettings(true)
    setSettingsFeedback("")

    const { error } = await updateProfile({
      display_name: settingsName.trim(),
      bio: settingsBio.trim(),
      phone: settingsPhone.trim(),
      location_name: settingsLocation.trim(),
    })

    if (error) {
      setSettingsFeedback("Lỗi: " + error.message)
    } else {
      setSettingsFeedback("Đã lưu thông tin cài đặt hồ sơ thành công.")
      setTimeout(() => setSettingsFeedback(""), 3500)
    }
    setIsSavingSettings(false)
  }
  const totalArticles = articlesList.length
  const totalReviews = reviewsList.length
  const totalFeed = totalArticles + totalReviews
  const totalFavorites = displayFavorites.length
  const totalSchedules = displaySchedules.length
  const calculatedPoints =
    totalArticles * 30 + totalReviews * 20 + totalFavorites * 10 + totalSchedules * 15

  // Danh sách feed tổng hợp bài viết và đánh giá được sắp xếp thời gian thực
  const allFeedItems: FeedItem[] = [
    ...articlesList.map((a) => ({
      type: "article" as const,
      id: a.id,
      date: a.publishedAt || "",
      data: a,
    })),
    ...reviewsList.map((r) => ({
      type: "review" as const,
      id: r.id,
      date: r.created_at || "",
      data: r,
    })),
  ]

  const filteredFeedItems = allFeedItems.filter((item) => {
    if (feedFilterType === "articles") return item.type === "article"
    if (feedFilterType === "reviews") return item.type === "review"
    return true
  })

  const achievementsList = [
    {
      level: "CẤP 3",
      title: "Foodie Chính hiệu",
      desc: `Đã lưu ${totalFavorites} quán ăn`,
      tagBg: "bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]",
    },
    {
      level: "CẤP 2",
      title: "Cây Bút Ẩm Thực",
      desc: `Đã đóng góp ${totalArticles} bài viết & ${totalReviews} đánh giá`,
      tagBg: "bg-[#E0F2FE] text-[#0369A1] border-[#BAE6FD]",
    },
    {
      level: "ĐẶC SẮC",
      title: "Trải Nghiệm Đa Dạng",
      desc: "Tích cực khám phá và kết nối ẩm thực",
      tagBg: "bg-[#FFE4E8] text-[#E55067] border-[#F8B4C0]",
    },
  ]
  const filteredFavorites = displayFavorites.filter((f) => {
    if (!favSearchQuery.trim()) return true
    const q = favSearchQuery.toLowerCase()
    return (
      f.place?.name?.toLowerCase().includes(q) ||
      f.place?.district?.toLowerCase().includes(q) ||
      f.place?.address?.toLowerCase().includes(q)
    )
  })
  const filteredSchedules = displaySchedules.filter((s) => {
    if (scheduleFilterStatus === "all") return true
    if (scheduleFilterStatus === "upcoming") {
      return s.status === "confirmed" || s.status === "pending"
    }
    if (scheduleFilterStatus === "completed") {
      return s.status === "completed"
    }
    return true
  })

  return (
    <section className="relative w-full bg-[#fdefdf] px-3 py-6 sm:px-6 lg:px-8">
      <div className="relative mx-auto flex max-w-[1460px] flex-col gap-4.5 lg:flex-row lg:items-start">
        {}
        {}
        {}
        <aside className="w-full lg:w-[250px] xl:w-[270px] lg:shrink-0 flex flex-col justify-between rounded-xl border border-[#1E293B] bg-white p-3.5 sm:p-4 shadow-[2px_2px_0px_#1E293B] lg:sticky lg:top-24">
          <div>
            <div className="border-b border-[#E8DDD1] pb-2.5 mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                Quản lý hồ sơ
              </h3>
            </div>

            <nav className="flex flex-wrap gap-1.5 sm:gap-2 lg:flex-col">
              <button
                type="button"
                onClick={() => setActiveTab("profile")}
                className={`w-full flex-1 sm:flex-initial lg:w-full rounded-lg px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-150 text-left border flex items-center justify-between cursor-pointer ${
                  activeTab === "profile"
                    ? "bg-[#FFE4E8] text-[#E55067] border-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B] font-bold"
                    : "bg-neutral-50/70 text-[#475569] border-[#D8C7B5] hover:border-[#1E293B] hover:text-black"
                }`}
              >
                <span>Trang cá nhân</span>
                <span className="text-xs text-[#94A3B8]">→</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("favorites")}
                className={`w-full flex-1 sm:flex-initial lg:w-full rounded-lg px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-150 text-left border flex items-center justify-between cursor-pointer ${
                  activeTab === "favorites"
                    ? "bg-[#FFE4E8] text-[#E55067] border-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B] font-bold"
                    : "bg-neutral-50/70 text-[#475569] border-[#D8C7B5] hover:border-[#1E293B] hover:text-black"
                }`}
              >
                <span>Danh sách yêu thích</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold border ${
                    activeTab === "favorites"
                      ? "bg-white text-[#E55067] border-[#1E293B]"
                      : "bg-white text-[#64748B] border-[#D8C7B5]"
                  }`}
                >
                  {displayFavorites.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("reviews")}
                className={`w-full flex-1 sm:flex-initial lg:w-full rounded-lg px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-150 text-left border flex items-center justify-between cursor-pointer ${
                  activeTab === "reviews"
                    ? "bg-[#FFE4E8] text-[#E55067] border-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B] font-bold"
                    : "bg-neutral-50/70 text-[#475569] border-[#D8C7B5] hover:border-[#1E293B] hover:text-black"
                }`}
              >
                <span>Bài viết & Đánh giá</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold border ${
                    activeTab === "reviews"
                      ? "bg-white text-[#E55067] border-[#1E293B]"
                      : "bg-white text-[#64748B] border-[#D8C7B5]"
                  }`}
                >
                  {totalFeed}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("schedules")}
                className={`w-full flex-1 sm:flex-initial lg:w-full rounded-lg px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-150 text-left border flex items-center justify-between cursor-pointer ${
                  activeTab === "schedules"
                    ? "bg-[#FFE4E8] text-[#E55067] border-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B] font-bold"
                    : "bg-neutral-50/70 text-[#475569] border-[#D8C7B5] hover:border-[#1E293B] hover:text-black"
                }`}
              >
                <span>Lịch hẹn của tôi</span>
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-bold border ${
                    activeTab === "schedules"
                      ? "bg-white text-[#E55067] border-[#1E293B]"
                      : "bg-white text-[#64748B] border-[#D8C7B5]"
                  }`}
                >
                  {displaySchedules.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("settings")}
                className={`w-full flex-1 sm:flex-initial lg:w-full rounded-lg px-3.5 py-2.5 text-xs sm:text-sm font-semibold transition-all duration-150 text-left border flex items-center justify-between cursor-pointer ${
                  activeTab === "settings"
                    ? "bg-[#FFE4E8] text-[#E55067] border-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B] font-bold"
                    : "bg-neutral-50/70 text-[#475569] border-[#D8C7B5] hover:border-[#1E293B] hover:text-black"
                }`}
              >
                <span>Cài đặt hồ sơ</span>
                <span className="text-xs text-[#94A3B8]">→</span>
              </button>
            </nav>
          </div>

          {}
          <div className="mt-5 hidden lg:block">
            <div className="overflow-hidden rounded-lg border border-[#EADBCE] bg-[#FAF5EE] p-1 shadow-2xs">
              <img
                loading="lazy"
                decoding="async"
                src="/img/profile-bottom-left-decor.png"
                alt="Ăn ngon, Khám phá nhiều hơn cùng nhau!"
                className="w-full object-contain pointer-events-none select-none"
              />
            </div>
          </div>
        </aside>

        {}
        {}
        {}
        <div className="min-w-0 flex-1">
          {}
          {activeTab === "profile" && (
            <div className="grid grid-cols-1 gap-4.5 lg:grid-cols-2 2xl:grid-cols-12">
              {}
              <div className="flex flex-col gap-4.5 lg:col-span-1 2xl:col-span-5">
                <div className="rounded-xl border border-[#1E293B] bg-white p-5 shadow-[2px_2px_0px_#1E293B]">
                  <div className="mb-4 flex items-center justify-between border-b border-[#E8DDD1] pb-3">
                    <h3 className="font-bold text-[#1E293B] text-base">
                      Thông tin cá nhân
                    </h3>
                    <button
                      type="button"
                      onClick={onOpenEditModal}
                      className="rounded-lg border border-[#1E293B] bg-neutral-50 px-3 py-1 text-xs font-semibold text-[#1E293B] shadow-[1px_1px_0px_#1E293B] hover:bg-neutral-100 transition-colors cursor-pointer"
                    >
                      Chỉnh sửa
                    </button>
                  </div>

                  <div className="divide-y divide-[#E8DDD1] text-xs sm:text-sm">
                    <div className="flex items-center justify-between gap-2 py-2.5 first:pt-0">
                      <span className="font-medium text-[#64748B] shrink-0">
                        Họ và tên
                      </span>
                      <span className="font-semibold text-[#1E293B] text-right">
                        {profile?.display_name ||
                          user?.email?.split("@")[0] ||
                          "Trịnh Hữu Huynh"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 py-2.5">
                      <span className="font-medium text-[#64748B] shrink-0">
                        Email
                      </span>
                      <span className="font-medium text-[#334155] text-right truncate max-w-[65%]">
                        {user?.email ||
                          profile?.email ||
                          "huynhcuboy0123@gmail.com"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 py-2.5">
                      <span className="font-medium text-[#64748B] shrink-0">
                        Số điện thoại
                      </span>
                      <span className="font-medium text-[#334155] text-right">
                        {profile?.phone || "0799 013 785"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 py-2.5">
                      <span className="font-medium text-[#64748B] shrink-0">
                        Vị trí
                      </span>
                      <span className="font-semibold text-[#1E293B] text-right truncate max-w-[65%]">
                        {profile?.location_name || "TP. Hồ Chí Minh"}
                      </span>
                    </div>

                    <div className="flex items-center justify-between gap-2 py-2.5">
                      <span className="font-medium text-[#64748B] shrink-0">
                        Cấp độ ẩm thực
                      </span>
                      <span className="font-semibold text-[#E55067] text-right">
                        {profile?.level || "Thực thần tập sự"}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-2 py-2.5 last:pb-0">
                      <span className="font-medium text-[#64748B] shrink-0 pt-0.5">
                        Tiểu sử
                      </span>
                      <span className="font-medium text-[#334155] text-right leading-relaxed max-w-[68%]">
                        {profile?.bio ||
                          "Tín đồ ẩm thực, thích khám phá các quán ăn ngon và chia sẻ trải nghiệm."}
                      </span>
                    </div>
                  </div>
                </div>

                {}
                <div className="rounded-xl border border-[#1E293B] bg-white p-3.5 sm:p-4 shadow-[2px_2px_0px_#1E293B]">
                  <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveTab("favorites")}
                      className="flex flex-col items-center justify-center rounded-lg border border-[#1E293B] bg-[#FFF5F7] px-2 py-3 text-center shadow-[1px_1px_0px_#1E293B] transition-colors hover:bg-[#FFEBF0] cursor-pointer"
                    >
                      <span className="font-bold text-xl sm:text-2xl text-[#E55067] leading-none">
                        {displayFavorites.length}
                      </span>
                      <span className="mt-1.5 text-[10px] sm:text-[11px] font-semibold text-[#475569] leading-tight">
                        Địa điểm đã lưu
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("reviews")}
                      className="flex flex-col items-center justify-center rounded-lg border border-[#1E293B] bg-[#F2F8FD] px-2 py-3 text-center shadow-[1px_1px_0px_#1E293B] transition-colors hover:bg-[#E4F1FA] cursor-pointer"
                    >
                      <span className="font-bold text-xl sm:text-2xl text-[#0284C7] leading-none">
                        {totalFeed}
                      </span>
                      <span className="mt-1.5 text-[10px] sm:text-[11px] font-semibold text-[#475569] leading-tight">
                        Bài viết & Đánh giá
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab("schedules")}
                      className="flex flex-col items-center justify-center rounded-lg border border-[#1E293B] bg-[#FFF7F5] px-2 py-3 text-center shadow-[1px_1px_0px_#1E293B] transition-colors hover:bg-[#FFECE8] cursor-pointer"
                    >
                      <span className="font-bold text-xl sm:text-2xl text-[#E05238] leading-none">
                        {displaySchedules.length}
                      </span>
                      <span className="mt-1.5 text-[10px] sm:text-[11px] font-semibold text-[#475569] leading-tight">
                        Lịch hẹn ẩm thực
                      </span>
                    </button>
                  </div>
                </div>
              </div>

              {}
              <div className="flex flex-col gap-4.5 lg:col-span-1 2xl:col-span-4">
                {}
                <div className="rounded-xl border border-[#1E293B] bg-white p-4 sm:p-5 shadow-[2px_2px_0px_#1E293B]">
                  <div className="mb-3.5 flex items-center justify-between border-b border-[#E8DDD1] pb-2.5">
                    <h3 className="font-bold text-[#1E293B] text-base">
                      Địa điểm yêu thích
                    </h3>
                    <button
                      type="button"
                      onClick={() => setActiveTab("favorites")}
                      className="text-xs font-semibold text-[#E55067] hover:underline cursor-pointer"
                    >
                      Xem tất cả ({displayFavorites.length}) →
                    </button>
                  </div>

                  {displayFavorites.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-[#1E293B] p-4 text-center text-xs text-[#64748B]">
                      Chưa lưu địa điểm nào.
                      <Link
                        href="/places"
                        className="ml-1 font-bold text-[#E55067] hover:underline"
                      >
                        Khám phá ngay →
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
                      {displayFavorites.slice(0, 2).map((item) => {
                        const place = item.place
                        if (!place) return null
                        return (
                          <div
                            key={item.id}
                            className="flex flex-col justify-between rounded-lg border border-[#1E293B] bg-[#FAF6F1]/50 p-2.5 shadow-[1px_1px_0px_#1E293B] transition-all hover:border-black"
                          >
                            <div>
                              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md border border-[#1E293B] bg-neutral-100">
                                <img
                                  src={place.image || "/img/card-sakura.png"}
                                  alt={place.name}
                                  className="size-full object-cover"
                                />
                                <span className="absolute left-1.5 top-1.5 rounded-md border border-[#1E293B] bg-[#FFF0F2] px-1.5 py-0.5 text-[10px] font-bold text-[#E55067]">
                                  {place.badge || "Món ngon"}
                                </span>
                              </div>
                              <Link href={`/places/${place.id}`}>
                                <h4 className="mt-2 text-xs font-bold text-[#1E293B] truncate hover:text-[#E55067]">
                                  {place.name}
                                </h4>
                              </Link>
                              <p className="text-[10px] sm:text-[11px] text-[#64748B] truncate mt-0.5">
                                {place.district || "TP. Hồ Chí Minh"}
                              </p>
                              <div className="mt-1 text-[11px] font-bold text-amber-700">
                                {place.rating || 5.0} ★
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>

                {/* Bài viết & Đánh giá gần đây (Cập nhật trực tiếp từ Database) */}
                <div className="rounded-xl border border-[#1E293B] bg-white p-4 sm:p-5 shadow-[2px_2px_0px_#1E293B]">
                  <div className="mb-3.5 flex items-center justify-between border-b border-[#E8DDD1] pb-2.5">
                    <div>
                      <h3 className="font-bold text-[#1E293B] text-base">
                        Bài viết & Đánh giá gần đây
                      </h3>
                      <p className="text-[11px] text-[#64748B]">
                        Đồng bộ dữ liệu trực tiếp từ hệ thống
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setActiveTab("reviews")}
                      className="text-xs font-semibold text-[#0284C7] hover:underline cursor-pointer shrink-0"
                    >
                      Xem tất cả ({allFeedItems.length}) →
                    </button>
                  </div>

                  {allFeedItems.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-[#1E293B] p-4 text-center text-xs text-[#64748B] bg-[#FAF6F1]/30">
                      Chưa có bài viết hoặc đánh giá nào từ dữ liệu của bạn.
                      <Link
                        href="/places"
                        className="ml-1 font-bold text-[#E55067] hover:underline block mt-1"
                      >
                        Khám phá quán ăn & viết bài ngay →
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-2.5">
                      {allFeedItems.slice(0, 3).map((item) => {
                        if (item.type === "article") {
                          const art = item.data
                          return (
                            <div
                              key={`feed-art-${art.id}`}
                              className="rounded-lg border border-[#1E293B] bg-[#FFF5F7]/60 p-3 shadow-[1px_1px_0px_#1E293B] transition-all hover:border-black"
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span className="shrink-0 rounded-md bg-[#FFE4E8] border border-[#1E293B] px-1.5 py-0.5 text-[9px] font-bold text-[#E55067]">
                                    Bài viết quán ăn
                                  </span>
                                  {art.place?.name && (
                                    <Link
                                      href={`/places/${art.relatedPlaceId || ""}`}
                                      className="font-bold text-xs text-[#1E293B] truncate hover:text-[#E55067]"
                                    >
                                      {art.place.name}
                                    </Link>
                                  )}
                                </div>
                                <span className="text-[10px] text-[#64748B] shrink-0 font-medium">
                                  {art.publishedAt}
                                </span>
                              </div>
                              <Link href={`/articles/${art.slug}`}>
                                <h4 className="mt-1 text-xs font-bold text-[#1E293B] hover:text-[#E55067] line-clamp-1">
                                  {art.title}
                                </h4>
                              </Link>
                              <p className="mt-1 text-xs text-[#64748B] font-normal line-clamp-2">
                                {art.excerpt}
                              </p>
                              {art.recommendedDish && (
                                <div className="mt-1.5 inline-flex items-center gap-1 rounded bg-[#FEF3C7] border border-[#FDE68A] px-1.5 py-0.5 text-[10px] font-semibold text-[#92400E]">
                                  <span>⭐ Món gợi ý: {art.recommendedDish}</span>
                                </div>
                              )}
                            </div>
                          )
                        }

                        const rev = item.data
                        return (
                          <div
                            key={`feed-rev-${rev.id}`}
                            className="rounded-lg border border-[#1E293B] bg-[#FAF6F1]/40 p-3 shadow-[1px_1px_0px_#1E293B] transition-all hover:border-black"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <Link
                                href={`/places/${rev.place_id}`}
                                className="font-bold text-xs text-[#1E293B] truncate hover:text-[#E55067]"
                              >
                                {rev.place?.name || "Quán ăn ngon"}
                              </Link>
                              <span className="text-amber-700 text-xs font-bold shrink-0">
                                {rev.rating}.0 ★
                              </span>
                            </div>
                            <p className="mt-1 text-xs text-[#64748B] font-normal line-clamp-2">
                              &ldquo;{rev.comment}&rdquo;
                            </p>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {}
              <div className="flex flex-col gap-4.5 lg:col-span-2 2xl:col-span-3">
                <div className="rounded-xl border border-[#1E293B] bg-white p-4 sm:p-5 shadow-[2px_2px_0px_#1E293B]">
                  <div className="mb-3 flex items-center justify-between border-b border-[#E8DDD1] pb-2.5">
                    <h3 className="font-bold text-[#1E293B] text-base">
                      Thành tích
                    </h3>
                    <span className="rounded-md bg-[#FFF0F2] border border-[#1E293B] px-2 py-0.5 text-[11px] font-semibold text-[#E55067] shadow-[1px_1px_0px_#1E293B]">
                      {calculatedPoints} điểm
                    </span>
                  </div>

                  <div className="space-y-2">
                    {achievementsList.map((item, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-2.5 rounded-lg border border-[#1E293B] bg-[#FAF6F1]/50 p-2.5 shadow-[1px_1px_0px_#1E293B]"
                      >
                        <span
                          className={`rounded-md border px-2 py-0.5 text-[10px] font-bold shrink-0 ${item.tagBg}`}
                        >
                          {item.level}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-[#1E293B] truncate">
                            {item.title}
                          </h4>
                          <p className="text-[10px] text-[#64748B]">
                            {item.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-xl border border-[#1E293B] bg-[#FAF5EE] p-4 sm:p-5 shadow-[2px_2px_0px_#1E293B]">
                  <h3 className="font-bold text-[#1E293B] text-base mb-1.5">
                    Lịch trình Food Tour
                  </h3>
                  <p className="text-xs text-[#64748B] leading-relaxed mb-3">
                    Khám phá bản đồ tương tác và các điểm dừng ẩm thực đã lên kế
                    hoạch.
                  </p>
                  <Link
                    href="/schedule"
                    className="block w-full rounded-lg border border-[#1E293B] bg-[#E55067] hover:bg-[#d64058] py-2 text-center text-xs font-bold text-white shadow-[1.5px_1.5px_0px_#1E293B] transition-colors"
                  >
                    Mở bản đồ lịch hẹn →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {}
          {activeTab === "favorites" && (
            <div className="rounded-xl border border-[#1E293B] bg-white p-5 sm:p-6 shadow-[2px_2px_0px_#1E293B]">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#E8DDD1] pb-4">
                <div>
                  <div className="inline-block rounded-md bg-[#FFF0F2] border border-[#1E293B] px-2.5 py-0.5 text-xs font-bold text-[#E55067] mb-1.5 shadow-[1px_1px_0px_#1E293B]">
                    Bộ sưu tập quán lưu
                  </div>
                  <h2 className="text-xl font-bold text-[#1E293B]">
                    Danh sách quán ăn yêu thích ({filteredFavorites.length})
                  </h2>
                  <p className="mt-0.5 text-xs text-[#64748B]">
                    Các địa điểm ẩm thực lưu lại để ghé thăm và thưởng thức cùng
                    bạn bè.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <input
                    type="text"
                    value={favSearchQuery}
                    onChange={(e) => setFavSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm quán ăn..."
                    className="rounded-lg border border-[#1E293B] bg-[#FAF6F1]/40 px-3 py-1.5 text-xs text-[#1E293B] shadow-[1px_1px_0px_#1E293B] focus:border-[#E55067] focus:outline-none"
                  />

                  <Link
                    href="/places"
                    className="rounded-lg border border-[#1E293B] bg-[#E55067] hover:bg-[#d64058] px-3.5 py-1.5 text-xs font-bold text-white shadow-[1.5px_1.5px_0px_#1E293B] transition-colors"
                  >
                    + Khám phá thêm
                  </Link>
                </div>
              </div>

              {}
              {filteredFavorites.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#1E293B] p-8 text-center bg-[#FAF6F1]/30 shadow-[1px_1px_0px_#1E293B]">
                  <h4 className="text-sm font-bold text-[#1E293B]">
                    Không tìm thấy quán ăn nào phù hợp
                  </h4>
                  <p className="mt-1 text-xs text-[#64748B]">
                    Hãy thử tìm kiếm với từ khóa khác hoặc khám phá kho quán ăn
                    HYUN.
                  </p>
                  <Link
                    href="/places"
                    className="mt-3 inline-block rounded-lg border border-[#1E293B] bg-[#E55067] px-4 py-1.5 text-xs font-bold text-white shadow-[1.5px_1.5px_0px_#1E293B] hover:bg-[#d64058] transition-colors"
                  >
                    Xem tất cả quán ăn →
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredFavorites.map((item) => {
                    const place = item.place
                    if (!place) return null
                    return (
                      <div
                        key={item.id}
                        className="group flex flex-col justify-between overflow-hidden rounded-xl border border-[#1E293B] bg-white shadow-[2px_2px_0px_#1E293B] hover:shadow-[3px_3px_0px_#1E293B] hover:-translate-x-0.5 hover:-translate-y-0.5 transition-all"
                      >
                        <div>
                          <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-[#1E293B] bg-neutral-100">
                            <img
                              src={place.image || "/img/card-sakura.png"}
                              alt={place.name}
                              className="size-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <span className="absolute left-2.5 top-2.5 rounded-md bg-white/95 border border-[#1E293B] px-2 py-0.5 text-[10px] font-bold text-[#E55067] shadow-[1px_1px_0px_#1E293B]">
                              {place.badge || "Món ngon"}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                handleRemoveFavorite(item.place_id || item.id)
                              }
                              className="absolute right-2.5 top-2.5 flex size-6 items-center justify-center rounded-md border border-[#1E293B] bg-white/90 text-xs font-bold text-rose-500 hover:bg-white shadow-[1px_1px_0px_#1E293B] transition-colors cursor-pointer"
                              title="Bỏ khỏi yêu thích"
                            >
                              ♥
                            </button>
                          </div>

                          <div className="p-3.5">
                            <div className="flex items-center justify-between gap-2">
                              <h3 className="text-sm font-bold text-[#1E293B] truncate">
                                {place.name}
                              </h3>
                              <span className="text-xs font-bold text-amber-700 shrink-0">
                                {place.rating || 5.0} ★
                              </span>
                            </div>

                            <p className="mt-1 text-xs text-[#64748B] truncate">
                              {place.address ||
                                place.district ||
                                "TP. Hồ Chí Minh"}
                            </p>
                          </div>
                        </div>

                        <div className="border-t border-[#1E293B] p-3 flex items-center gap-2 bg-[#FAF6F1]/30">
                          <Link
                            href={`/places/${place.id}`}
                            className="flex-1 rounded-lg border border-[#1E293B] bg-white py-1.5 text-center text-xs font-bold text-[#475569] shadow-[1px_1px_0px_#1E293B] hover:bg-neutral-100 transition-colors"
                          >
                            Xem chi tiết
                          </Link>
                          <Link
                            href="/schedule"
                            className="flex-1 rounded-lg border border-[#1E293B] bg-[#E55067] hover:bg-[#d64058] py-1.5 text-center text-xs font-bold text-white shadow-[1px_1px_0px_#1E293B] transition-colors"
                          >
                            Lên lịch hẹn
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: TOÀN BỘ BÀI VIẾT & ĐÁNH GIÁ CỦA TÔI */}
          {activeTab === "reviews" && (
            <div className="rounded-xl border border-[#1E293B] bg-white p-5 sm:p-6 shadow-[2px_2px_0px_#1E293B]">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#E8DDD1] pb-4">
                <div>
                  <div className="inline-block rounded-md bg-[#FFE4E8] border border-[#1E293B] px-2.5 py-0.5 text-xs font-bold text-[#E55067] mb-1.5 shadow-[1px_1px_0px_#1E293B]">
                    Nhật ký & Trải nghiệm ẩm thực
                  </div>
                  <h2 className="text-xl font-bold text-[#1E293B]">
                    Bài viết & Đánh giá của bạn ({totalFeed})
                  </h2>
                  <p className="mt-0.5 text-xs text-[#64748B]">
                    Cập nhật thời gian thực từ cơ sở dữ liệu: bài viết chia sẻ về quán ăn và các nhận xét đã đóng góp.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex rounded-lg border border-[#1E293B] bg-neutral-50 p-0.5 shadow-[1px_1px_0px_#1E293B]">
                    <button
                      type="button"
                      onClick={() => setFeedFilterType("all")}
                      className={`rounded-md px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                        feedFilterType === "all"
                          ? "bg-[#E55067] text-white shadow-[1px_1px_0px_#1E293B]"
                          : "text-[#475569] hover:bg-white"
                      }`}
                    >
                      Tất cả ({totalFeed})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeedFilterType("articles")}
                      className={`rounded-md px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                        feedFilterType === "articles"
                          ? "bg-[#E55067] text-white shadow-[1px_1px_0px_#1E293B]"
                          : "text-[#475569] hover:bg-white"
                      }`}
                    >
                      Bài viết ({totalArticles})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFeedFilterType("reviews")}
                      className={`rounded-md px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                        feedFilterType === "reviews"
                          ? "bg-[#E55067] text-white shadow-[1px_1px_0px_#1E293B]"
                          : "text-[#475569] hover:bg-white"
                      }`}
                    >
                      Đánh giá ({totalReviews})
                    </button>
                  </div>

                  <Link
                    href="/places"
                    className="rounded-lg border border-[#1E293B] bg-[#E55067] hover:bg-[#d64058] px-3.5 py-1.5 text-xs font-bold text-white shadow-[1.5px_1.5px_0px_#1E293B] transition-colors"
                  >
                    + Viết bài viết mới
                  </Link>
                </div>
              </div>

              {filteredFeedItems.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#1E293B] p-8 text-center bg-[#FAF6F1]/30 shadow-[1px_1px_0px_#1E293B]">
                  <h4 className="text-sm font-bold text-[#1E293B]">
                    Chưa có dữ liệu bài viết hoặc đánh giá nào
                  </h4>
                  <p className="mt-1 text-xs text-[#64748B]">
                    Hãy ghé thăm các quán ăn yêu thích để chia sẻ câu chuyện và trải nghiệm ẩm thực đầu tiên của bạn.
                  </p>
                  <Link
                    href="/places"
                    className="mt-3.5 inline-block rounded-lg border border-[#1E293B] bg-[#E55067] hover:bg-[#d64058] px-4 py-2 text-xs font-bold text-white shadow-[1.5px_1.5px_0px_#1E293B] transition-colors"
                  >
                    Khám phá quán ăn & viết bài ngay →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredFeedItems.map((item) => {
                    if (item.type === "article") {
                      const art = item.data
                      return (
                        <div
                          key={`tab-art-${art.id}`}
                          className="rounded-xl border border-[#1E293B] bg-white p-4 shadow-[1.5px_1.5px_0px_#1E293B] hover:border-black transition-all"
                        >
                          <div className="flex flex-col sm:flex-row gap-4 items-start">
                            <div className="relative w-full sm:w-44 aspect-[16/10] sm:aspect-square shrink-0 overflow-hidden rounded-lg border border-[#1E293B] bg-neutral-100">
                              <img
                                src={art.coverImage || "/img/card-sakura.png"}
                                alt={art.title}
                                className="size-full object-cover"
                              />
                              <span className="absolute top-2 left-2 rounded-md border border-[#1E293B] bg-[#FFE4E8] px-2 py-0.5 text-[10px] font-bold text-[#E55067]">
                                {art.categoryLabel || "Bài viết ẩm thực"}
                              </span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex flex-wrap items-center justify-between gap-2">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {art.place?.name && (
                                    <Link
                                      href={`/places/${art.relatedPlaceId || ""}`}
                                      className="rounded-md bg-[#FAF5EE] border border-[#1E293B] px-2 py-0.5 text-[11px] font-bold text-[#1E293B] hover:text-[#E55067]"
                                    >
                                      📍 {art.place.name}
                                    </Link>
                                  )}
                                  <span className="text-[11px] text-[#64748B]">
                                    {art.publishedAt} • {art.readTime}
                                  </span>
                                </div>
                              </div>

                              <Link href={`/articles/${art.slug}`}>
                                <h3 className="mt-2 text-base font-bold text-[#1E293B] hover:text-[#E55067] transition-colors leading-snug">
                                  {art.title}
                                </h3>
                              </Link>

                              <p className="mt-1.5 text-xs text-[#64748B] leading-relaxed line-clamp-2">
                                {art.excerpt}
                              </p>

                              <div className="mt-3 flex flex-wrap items-center gap-2">
                                {art.recommendedDish && (
                                  <span className="rounded-md bg-[#FEF3C7] border border-[#1E293B] px-2 py-0.5 text-[11px] font-bold text-[#92400E]">
                                    ⭐ Món ngon: {art.recommendedDish}
                                  </span>
                                )}
                                {art.costPerPerson && (
                                  <span className="rounded-md bg-[#F1F5F9] border border-[#1E293B] px-2 py-0.5 text-[11px] font-bold text-[#475569]">
                                    💵 {art.costPerPerson}
                                  </span>
                                )}
                              </div>

                              <div className="mt-3 flex items-center justify-between border-t border-[#E8DDD1] pt-2.5 text-xs">
                                <span className="text-[#15803D] font-semibold text-[11px]">
                                  ✓ Bài viết chính thức từ DB
                                </span>
                                <Link
                                  href={`/articles/${art.slug}`}
                                  className="font-bold text-[#E55067] hover:underline"
                                >
                                  Đọc toàn bộ bài viết →
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    }

                    const rev = item.data
                    return (
                      <div
                        key={`tab-rev-${rev.id}`}
                        className="rounded-xl border border-[#1E293B] bg-white p-4 shadow-[1.5px_1.5px_0px_#1E293B]"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-[#1E293B] bg-neutral-100">
                              <img
                                src={
                                  rev.place?.image || "/img/sakura-restaurant.jpg"
                                }
                                alt={rev.place?.name || "Quán ăn"}
                                className="size-full object-cover"
                              />
                            </div>

                            <div>
                              <Link href={`/places/${rev.place_id}`}>
                                <h3 className="text-sm font-bold text-[#1E293B] hover:text-[#E55067]">
                                  {rev.place?.name || "Địa điểm ẩm thực"}
                                </h3>
                              </Link>
                              <p className="text-xs text-[#64748B]">
                                {rev.place?.district || "TP. Hồ Chí Minh"}
                              </p>
                              <div className="mt-1 flex items-center gap-1.5">
                                <span className="rounded-md bg-[#FEF3C7] border border-[#1E293B] px-1.5 py-0.2 text-[10px] font-bold text-[#92400E]">
                                  {rev.rating}.0 / 5.0
                                </span>
                                <span className="text-amber-700 text-xs font-bold">
                                  {"★".repeat(Math.round(rev.rating || 5))}
                                </span>
                              </div>
                            </div>
                          </div>

                          <span className="text-xs text-[#94A3B8]">
                            {new Date(rev.created_at).toLocaleDateString("vi-VN")}
                          </span>
                        </div>

                        <div className="mt-3 rounded-lg bg-[#FAF6F1]/50 border border-[#1E293B] p-3 text-xs sm:text-sm text-[#334155] leading-relaxed">
                          &ldquo;{rev.comment}&rdquo;
                        </div>

                        <div className="mt-2.5 flex items-center justify-between text-xs">
                          <span className="text-[#15803D] font-medium">
                            Đã xác thực thực khách từ DB
                          </span>
                          <Link
                            href={`/places/${rev.place_id}`}
                            className="font-bold text-[#E55067] hover:underline"
                          >
                            Xem chi tiết quán ăn →
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {}
          {activeTab === "schedules" && (
            <div className="rounded-xl border border-[#1E293B] bg-white p-5 sm:p-6 shadow-[2px_2px_0px_#1E293B]">
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-[#E8DDD1] pb-4">
                <div>
                  <div className="inline-block rounded-md bg-[#DCFCE7] border border-[#1E293B] px-2.5 py-0.5 text-xs font-bold text-[#15803D] mb-1.5 shadow-[1px_1px_0px_#1E293B]">
                    Lịch trình food tour
                  </div>
                  <h2 className="text-xl font-bold text-[#1E293B]">
                    Điểm hẹn ẩm thực của bạn ({filteredSchedules.length})
                  </h2>
                  <p className="mt-0.5 text-xs text-[#64748B]">
                    Theo dõi mốc thời gian, số lượng bạn bè và ghi chú của từng
                    điểm hẹn.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <div className="inline-flex rounded-lg border border-[#1E293B] bg-neutral-50 p-0.5 shadow-[1px_1px_0px_#1E293B]">
                    <button
                      type="button"
                      onClick={() => setScheduleFilterStatus("all")}
                      className={`rounded-md px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                        scheduleFilterStatus === "all"
                          ? "bg-[#E55067] text-white shadow-[1px_1px_0px_#1E293B]"
                          : "text-[#475569] hover:bg-white"
                      }`}
                    >
                      Tất cả
                    </button>
                    <button
                      type="button"
                      onClick={() => setScheduleFilterStatus("upcoming")}
                      className={`rounded-md px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                        scheduleFilterStatus === "upcoming"
                          ? "bg-[#E55067] text-white shadow-[1px_1px_0px_#1E293B]"
                          : "text-[#475569] hover:bg-white"
                      }`}
                    >
                      Sắp tới
                    </button>
                    <button
                      type="button"
                      onClick={() => setScheduleFilterStatus("completed")}
                      className={`rounded-md px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                        scheduleFilterStatus === "completed"
                          ? "bg-[#E55067] text-white shadow-[1px_1px_0px_#1E293B]"
                          : "text-[#475569] hover:bg-white"
                      }`}
                    >
                      Đã ghé
                    </button>
                  </div>

                  <Link
                    href="/schedule"
                    className="rounded-lg border border-[#1E293B] bg-white hover:bg-neutral-50 px-3 py-1.5 text-xs font-bold text-[#1E293B] shadow-[1px_1px_0px_#1E293B] transition-colors"
                  >
                    Bản đồ tour
                  </Link>
                </div>
              </div>

              {filteredSchedules.length === 0 ? (
                <div className="rounded-xl border border-dashed border-[#1E293B] p-8 text-center bg-[#FAF6F1]/30 shadow-[1px_1px_0px_#1E293B]">
                  <h4 className="text-sm font-bold text-[#1E293B]">
                    Chưa có lịch hẹn nào trong mục này
                  </h4>
                  <p className="mt-1 text-xs text-[#64748B]">
                    Hãy lên kế hoạch điểm hẹn ẩm thực cùng bạn bè ngay hôm nay.
                  </p>
                  <Link
                    href="/schedule"
                    className="mt-3 inline-block rounded-lg border border-[#1E293B] bg-[#E55067] px-4 py-1.5 text-xs font-bold text-white shadow-[1.5px_1.5px_0px_#1E293B] hover:bg-[#d64058] transition-colors"
                  >
                    + Tạo lịch hẹn mới →
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {filteredSchedules.map((sch) => {
                    const isUpcoming =
                      sch.status === "confirmed" || sch.status === "pending"
                    return (
                      <div
                        key={sch.id}
                        className="flex flex-col justify-between rounded-xl border border-[#1E293B] bg-white p-4 shadow-[1.5px_1.5px_0px_#1E293B]"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-2.5">
                            <span
                              className={`rounded-md border border-[#1E293B] px-2 py-0.5 text-[11px] font-bold shadow-[1px_1px_0px_#1E293B] ${
                                isUpcoming
                                  ? "bg-emerald-50 text-emerald-800"
                                  : "bg-neutral-100 text-neutral-600"
                              }`}
                            >
                              {isUpcoming ? "Sắp tới" : "Đã ghé qua"}
                            </span>
                            <span className="text-xs font-semibold text-[#64748B]">
                              {sch.time_slot} • {sch.scheduled_date}
                            </span>
                          </div>

                          <div className="flex items-start gap-3">
                            <div className="relative size-14 shrink-0 overflow-hidden rounded-lg border border-[#1E293B] bg-neutral-100">
                              <img
                                src={
                                  sch.places?.image ||
                                  "/img/sakura-restaurant.jpg"
                                }
                                alt={sch.places?.name || "Quán"}
                                className="size-full object-cover"
                              />
                            </div>

                            <div className="min-w-0 flex-1">
                              <h3 className="text-sm font-bold text-[#1E293B] truncate">
                                {sch.places?.name || "Địa điểm ẩm thực"}
                              </h3>
                              <p className="text-xs text-[#64748B] truncate mt-0.5">
                                {sch.places?.address || "TP. Hồ Chí Minh"}
                              </p>
                              <p className="mt-1 text-xs font-bold text-[#E55067]">
                                {sch.party_size} khách đặt hẹn
                              </p>
                            </div>
                          </div>

                          {sch.notes && (
                            <div className="mt-2.5 rounded-lg bg-[#FAF6F1]/60 border border-[#1E293B] p-2.5 text-xs text-[#475569]">
                              Ghi chú: {sch.notes}
                            </div>
                          )}
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-[#1E293B] flex items-center justify-between">
                          <Link
                            href="/schedule"
                            className="text-xs font-bold text-[#E55067] hover:underline"
                          >
                            Xem trên bản đồ →
                          </Link>
                          <Link
                            href={`/places/${sch.place_id}`}
                            className="rounded-lg border border-[#1E293B] bg-neutral-50 hover:bg-neutral-100 px-2.5 py-1 text-xs font-bold text-[#475569] shadow-[1px_1px_0px_#1E293B] transition-colors"
                          >
                            Chi tiết quán
                          </Link>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {}
          {activeTab === "settings" && (
            <div className="rounded-xl border border-[#1E293B] bg-white p-5 sm:p-6 shadow-[2px_2px_0px_#1E293B]">
              <div className="mb-5 border-b border-[#E8DDD1] pb-4">
                <div className="inline-block rounded-md bg-[#FEF3C7] border border-[#1E293B] px-2.5 py-0.5 text-xs font-bold text-[#92400E] mb-1.5 shadow-[1px_1px_0px_#1E293B]">
                  Tùy chỉnh tài khoản
                </div>
                <h2 className="text-xl font-bold text-[#1E293B]">
                  Cài đặt hồ sơ cá nhân
                </h2>
                <p className="mt-0.5 text-xs text-[#64748B]">
                  Quản lý họ tên, số điện thoại, vị trí địa lý và tiểu sử ẩm
                  thực của bạn.
                </p>
              </div>

              {settingsFeedback && (
                <div className="mb-4 rounded-lg border border-emerald-300 bg-emerald-50 p-3 text-xs font-bold text-emerald-900 shadow-[1px_1px_0px_#1E293B]">
                  {settingsFeedback}
                </div>
              )}

              <form
                onSubmit={handleSaveSettings}
                className="space-y-4 max-w-xl"
              >
                {}
                <div>
                  <label className="block text-xs font-bold text-[#64748B] mb-1">
                    Họ và tên hiển thị
                  </label>
                  <input
                    type="text"
                    value={settingsName}
                    onChange={(e) => setSettingsName(e.target.value)}
                    required
                    className="w-full rounded-lg border border-[#1E293B] bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-[#1E293B] shadow-[1px_1px_0px_#1E293B] focus:border-[#E55067] focus:outline-none"
                  />
                </div>

                {}
                <div>
                  <label className="block text-xs font-bold text-[#64748B] mb-1">
                    Email tài khoản (Không thể thay đổi)
                  </label>
                  <input
                    type="text"
                    disabled
                    value={user?.email || "huynhcuboy0123@gmail.com"}
                    className="w-full rounded-lg border border-[#D8C7B5] bg-neutral-100 px-3 py-2 text-xs font-medium text-slate-500 cursor-not-allowed"
                  />
                </div>

                {}
                <div>
                  <label className="block text-xs font-bold text-[#64748B] mb-1">
                    Số điện thoại liên hệ
                  </label>
                  <input
                    type="tel"
                    value={settingsPhone}
                    onChange={(e) => setSettingsPhone(e.target.value)}
                    placeholder="Ví dụ: 0799 013 785"
                    className="w-full rounded-lg border border-[#1E293B] bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-[#1E293B] shadow-[1px_1px_0px_#1E293B] focus:border-[#E55067] focus:outline-none"
                  />
                </div>

                {}
                <div>
                  <label className="block text-xs font-bold text-[#64748B] mb-1">
                    Vị trí hiện tại
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={settingsLocation}
                      onChange={(e) => setSettingsLocation(e.target.value)}
                      placeholder="Ví dụ: TP. Hồ Chí Minh"
                      className="flex-1 rounded-lg border border-[#1E293B] bg-white px-3 py-2 text-xs sm:text-sm font-semibold text-[#1E293B] shadow-[1px_1px_0px_#1E293B] focus:border-[#E55067] focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleGetGPS}
                      disabled={isLocatingGPS}
                      className="rounded-lg border border-[#1E293B] bg-sky-50 hover:bg-sky-100 px-3 py-2 text-xs font-bold text-[#0284C7] shadow-[1px_1px_0px_#1E293B] transition-colors disabled:opacity-50 cursor-pointer shrink-0"
                    >
                      {isLocatingGPS
                        ? "Đang định vị..."
                        : "Lấy vị trí hiện tại"}
                    </button>
                  </div>
                </div>

                {}
                <div>
                  <label className="block text-xs font-bold text-[#64748B] mb-1">
                    Tiểu sử ẩm thực
                  </label>
                  <textarea
                    rows={3}
                    value={settingsBio}
                    onChange={(e) => setSettingsBio(e.target.value)}
                    placeholder="Giới thiệu đôi nét về sở thích ẩm thực của bạn..."
                    className="w-full rounded-lg border border-[#1E293B] bg-white px-3 py-2 text-xs sm:text-sm font-medium text-[#1E293B] shadow-[1px_1px_0px_#1E293B] focus:border-[#E55067] focus:outline-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSavingSettings}
                    className="rounded-lg border border-[#1E293B] bg-[#E55067] hover:bg-[#d64058] px-5 py-2 text-xs sm:text-sm font-bold text-white shadow-[1.5px_1.5px_0px_#1E293B] transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isSavingSettings
                      ? "Đang lưu thay đổi..."
                      : "Lưu cài đặt hồ sơ"}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
