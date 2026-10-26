"use client"

// Dữ liệu mặc định ban đầu cho trải nghiệm

// 1. Khởi tạo từ LocalStorage khi component mount
// Khởi tạo mặc định nếu chưa có

// 2. Đồng bộ với Supabase khi user đăng nhập

// Merge dbFavorites với localFavorites hiện tại

// Lưu state vào LocalStorage helper

// Hiển thị thông báo toast ngắn gọn

// Kiểm tra địa điểm đã được thích chưa

// Toggle thêm hoặc bỏ thích quán ăn
// Xóa khỏi danh sách
// Thêm vào danh sách
// 1. Đảm bảo bản ghi địa điểm tồn tại trong public.places để thỏa mãn Foreign Key

// 2. Thêm vào bảng favorites của user

// Xóa trực tiếp bằng placeId hoặc favoriteId
/* Floating Toast Notification */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/types"

type PlaceRow = Database["public"]["Tables"]["places"]["Row"]

export interface FavoritePlaceData {
  id: string
  name: string
  image: string
  rating?: number
  district?: string
  address?: string
  badge?: string
  tags?: string[]
}

export interface FavoriteItem {
  id: string
  place_id: string
  created_at: string
  place: FavoritePlaceData
}

interface FavoritesContextType {
  favorites: FavoriteItem[]
  favoriteIds: string[]
  favoritesCount: number
  isLoading: boolean
  isFavorite: (placeId: string) => boolean
  toggleFavorite: (place: FavoritePlaceData) => Promise<boolean>
  removeFavorite: (placeId: string) => Promise<void>
}

const STORAGE_KEY = "hyun_user_favorites_v1"
const INITIAL_DEFAULT_FAVORITES: FavoriteItem[] = [
  {
    id: "init-fav-1",
    place_id: "sakura-restaurant",
    created_at: new Date().toISOString(),
    place: {
      id: "sakura-restaurant",
      name: "Sakura Japanese Restaurant",
      image: "/img/sakura-restaurant.jpg",
      rating: 4.8,
      district: "Quận 1, TP. Hồ Chí Minh",
      address: "15 Lê Thánh Tôn, Bến Nghé, Quận 1",
      badge: "Nhà hàng Nhật",
      tags: ["Sushi", "Ramen", "Yakiniku"],
    },
  },
  {
    id: "init-fav-2",
    place_id: "riverside-garden",
    created_at: new Date().toISOString(),
    place: {
      id: "riverside-garden",
      name: "Riverside Garden",
      image: "/img/riverside-garden.jpg",
      rating: 4.6,
      district: "Bình Thạnh, TP. Hồ Chí Minh",
      address: "Khu Bờ Sông Thanh Đa, P.27, Bình Thạnh",
      badge: "View đẹp",
      tags: ["Việt Nam", "Âu", "Hải sản"],
    },
  },
  {
    id: "init-fav-3",
    place_id: "luna-cafe",
    created_at: new Date().toISOString(),
    place: {
      id: "luna-cafe",
      name: "Luna Cafe & Bistro",
      image: "/img/luna-cafe.jpg",
      rating: 5.0,
      district: "Quận 1, TP. Hồ Chí Minh",
      address: "88 Hai Bà Trưng, Bến Nghé, Quận 1",
      badge: "Cà phê & Bánh",
      tags: ["Café", "Âu", "View đẹp"],
    },
  },
  {
    id: "init-fav-4",
    place_id: "bui-vien",
    created_at: new Date().toISOString(),
    place: {
      id: "bui-vien",
      name: "Phố Ẩm Thực Bùi Viện",
      image: "/img/bui-vien.jpg",
      rating: 4.5,
      district: "Quận 1, TP. Hồ Chí Minh",
      address: "Đường Bùi Viện, Phạm Ngũ Lão, Quận 1",
      badge: "Đường phố",
      tags: ["Đặc sản", "Đường phố", "Giá tốt"],
    },
  },
]

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined,
)

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [favorites, setFavorites] = useState<FavoriteItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [toastMessage, setToastMessage] = useState<string | null>(null)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFavorites(parsed)
          setIsLoading(false)
          return
        }
      }
      setFavorites(INITIAL_DEFAULT_FAVORITES)
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(INITIAL_DEFAULT_FAVORITES),
      )
    } catch {
      setFavorites(INITIAL_DEFAULT_FAVORITES)
    } finally {
      setIsLoading(false)
    }
  }, [])
  useEffect(() => {
    if (!user?.id) return
    const currentUserId = user.id

    async function syncSupabaseFavorites() {
      try {
        const { data, error } = await supabase
          .from("favorites")
          .select("id, place_id, created_at, places(*)")
          .eq("user_id", currentUserId)

        if (!error && data && data.length > 0) {
          const dbFavorites: FavoriteItem[] = data
            .filter((item: any) => item.places)
            .map((item: any) => ({
              id: item.id,
              place_id: item.place_id,
              created_at: item.created_at,
              place: {
                id: item.places.id,
                name: item.places.name,
                image: item.places.image || "/img/card-sakura.png",
                rating: Number(item.places.rating) || 5.0,
                district: item.places.district || "TP. Hồ Chí Minh",
                address:
                  item.places.address ||
                  item.places.district ||
                  "TP. Hồ Chí Minh",
                badge: item.places.badge || "Món ngon",
                tags: item.places.tags || [],
              },
            }))
          setFavorites((prev) => {
            const mergedMap = new Map<string, FavoriteItem>()
            dbFavorites.forEach((f) => mergedMap.set(f.place_id, f))
            prev.forEach((f) => {
              if (!mergedMap.has(f.place_id)) {
                mergedMap.set(f.place_id, f)
              }
            })
            const result = Array.from(mergedMap.values())
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(result))
            } catch {}
            return result
          })
        }
      } catch (err) {
        console.warn("[FavoritesContext] Sync error:", err)
      }
    }

    syncSupabaseFavorites()
  }, [user])
  const persistFavorites = useCallback((newFavs: FavoriteItem[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newFavs))
    } catch (e) {
      console.warn("Save favorites to localStorage failed", e)
    }
  }, [])
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg)
    const t = setTimeout(() => {
      setToastMessage(null)
    }, 2800)
    return () => clearTimeout(t)
  }, [])
  const isFavorite = useCallback(
    (placeId: string) => {
      return favorites.some((f) => f.place_id === placeId)
    },
    [favorites],
  )
  const toggleFavorite = useCallback(
    async (place: FavoritePlaceData): Promise<boolean> => {
      const placeId = place.id
      const currentlyFav = favorites.some((f) => f.place_id === placeId)

      if (currentlyFav) {
        const updated = favorites.filter((f) => f.place_id !== placeId)
        setFavorites(updated)
        persistFavorites(updated)
        showToast(`Đã xóa "${place.name}" khỏi danh sách yêu thích`)

        if (user) {
          try {
            await supabase
              .from("favorites")
              .delete()
              .eq("user_id", user.id)
              .eq("place_id", placeId)
          } catch (err) {
            console.warn("Delete favorite Supabase error:", err)
          }
        }
        return false
      } else {
        const newItem: FavoriteItem = {
          id: `fav-${placeId}-${Date.now()}`,
          place_id: placeId,
          created_at: new Date().toISOString(),
          place: {
            id: placeId,
            name: place.name,
            image: place.image || "/img/card-sakura.png",
            rating: place.rating || 5.0,
            district: place.district || "TP. Hồ Chí Minh",
            address: place.address || place.district || "TP. Hồ Chí Minh",
            badge: place.badge || "Món ngon",
            tags: place.tags || [],
          },
        }

        const updated = [
          newItem,
          ...favorites.filter((f) => f.place_id !== placeId),
        ]
        setFavorites(updated)
        persistFavorites(updated)
        showToast(`Đã thêm "${place.name}" vào danh sách yêu thích!`)

        if (user) {
          try {
            await supabase.from("places").upsert(
              {
                id: placeId,
                name: place.name,
                image: place.image || "/img/card-sakura.png",
                rating: place.rating || 5.0,
                address: place.address || place.district || "TP. Hồ Chí Minh",
                district: place.district || "TP. Hồ Chí Minh",
                city: "TP. Hồ Chí Minh",
                badge: place.badge || "Món ngon",
                tags: place.tags || [],
              } as any,
              { onConflict: "id" },
            )
            await supabase
              .from("favorites")
              .upsert({ user_id: user.id, place_id: placeId } as any, {
                onConflict: "user_id,place_id",
              })
          } catch (err) {
            console.warn("Insert favorite Supabase error:", err)
          }
        }
        return true
      }
    },
    [favorites, persistFavorites, showToast, user],
  )
  const removeFavorite = useCallback(
    async (idOrPlaceId: string) => {
      const target = favorites.find(
        (f) => f.place_id === idOrPlaceId || f.id === idOrPlaceId,
      )
      const placeId = target ? target.place_id : idOrPlaceId
      const placeName = target?.place.name || "Địa điểm"

      const updated = favorites.filter(
        (f) => f.place_id !== placeId && f.id !== idOrPlaceId,
      )
      setFavorites(updated)
      persistFavorites(updated)
      showToast(`Đã xóa "${placeName}" khỏi danh sách yêu thích`)

      if (user) {
        try {
          await supabase
            .from("favorites")
            .delete()
            .eq("user_id", user.id)
            .eq("place_id", placeId)
        } catch (err) {
          console.warn("Remove favorite Supabase error:", err)
        }
      }
    },
    [favorites, persistFavorites, showToast, user],
  )

  const favoriteIds = favorites.map((f) => f.place_id)

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        favoriteIds,
        favoritesCount: favorites.length,
        isLoading,
        isFavorite,
        toggleFavorite,
        removeFavorite,
      }}
    >
      {children}

      {}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl border border-[#1E293B] bg-white px-4 py-3 text-xs sm:text-sm font-semibold text-[#1E293B] shadow-[3px_3px_0px_#1E293B] animate-in fade-in slide-in-from-bottom-3 duration-200">
          <span className="flex size-6 items-center justify-center rounded-full bg-[#FFE4E8] text-[#E55067] text-xs">
            ♥
          </span>
          <span>{toastMessage}</span>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-black cursor-pointer"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>
      )}
    </FavoritesContext.Provider>
  )
}

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider")
  }
  return context
}
