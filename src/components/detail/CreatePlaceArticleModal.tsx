"use client"

import { useState, useEffect, useMemo } from "react"
import { useAuth } from "@/contexts/AuthContext"
import { createPlaceArticle } from "@/services/articlesService"
import type { PlaceDetailModel } from "@/types/placeDetail"
import type {
  Article,
  ArticleCategory,
  CreatePlaceArticleInput,
} from "@/types/article"

export interface CreatePlaceArticleModalProps {
  isOpen: boolean
  onClose: () => void
  place: PlaceDetailModel
  onArticleCreated: (newArticle: Article) => void
}

interface CategoryOption {
  id: ArticleCategory
  label: string
  icon: string
  description: string
}

interface QuickImageItem {
  url: string
  label: string
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    id: "review",
    label: "Review Quán",
    icon: "🥢",
    description: "Đánh giá chi tiết không gian & món ăn",
  },
  {
    id: "couple",
    label: "Hẹn hò & Tụ họp",
    icon: "🥂",
    description: "Gợi ý không gian cặp đôi, gặp gỡ bạn bè",
  },
  {
    id: "culture",
    label: "Món ngon & Hương vị",
    icon: "🍜",
    description: "Khám phá phong vị, nét đặc sắc ẩm thực",
  },
  {
    id: "guide",
    label: "Cẩm nang ăn uống",
    icon: "💡",
    description: "Kinh nghiệm chọn món, đặt bàn, đi lại",
  },
]

export default function CreatePlaceArticleModal({
  isOpen,
  onClose,
  place,
  onArticleCreated,
}: CreatePlaceArticleModalProps) {
  const { user, profile, openAuthModal } = useAuth()

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState<ArticleCategory>("review")
  const [coverImage, setCoverImage] = useState("")
  const [recommendedDish, setRecommendedDish] = useState("")
  const [costPerPerson, setCostPerPerson] = useState("")
  const [content, setContent] = useState("")
  const [quoteText, setQuoteText] = useState("")
  const [quoteAuthor, setQuoteAuthor] = useState("")
  const [tags, setTags] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [imageError, setImageError] = useState(false)

  // Initialize form defaults when modal opens or place changes
  useEffect(() => {
    if (isOpen) {
      setTitle("")
      setCategory("review")
      setCoverImage(place.image || "")
      setRecommendedDish(
        place.menuItems?.find((m) => m.isSignature)?.name ||
          place.menuItems?.[0]?.name ||
          "",
      )
      setCostPerPerson(place.priceRange || "")
      setContent("")
      setQuoteText("")
      setQuoteAuthor("")
      setTags(place.tags?.join(", ") || "")
      setErrorMsg("")
      setImageError(false)
    }
  }, [isOpen, place])

  // Escape key handler with early return
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !isSubmitting) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, isSubmitting, onClose])

  // Body scroll lock
  useEffect(() => {
    if (isOpen) {
      const originalStyle = window.getComputedStyle(document.body).overflow
      document.body.style.overflow = "hidden"
      return () => {
        document.body.style.overflow = originalStyle
      }
    }
  }, [isOpen])

  // Quick selectable images from place & menu
  const quickImages = useMemo(() => {
    const list: QuickImageItem[] = []
    if (place.image) {
      list.push({ url: place.image, label: "Ảnh đại diện quán" })
    }
    if (place.menuItems) {
      for (const item of place.menuItems) {
        if (item.image && !list.some((img) => img.url === item.image)) {
          list.push({ url: item.image, label: item.name })
        }
      }
    }
    return list
  }, [place])

  // Quick selectable dishes from menu
  const availableDishes = useMemo(() => {
    return (place.menuItems || []).map((m) => m.name).filter(Boolean)
  }, [place.menuItems])

  const handleAddDish = (dishName: string) => {
    if (!recommendedDish.trim()) {
      setRecommendedDish(dishName)
    } else if (!recommendedDish.includes(dishName)) {
      setRecommendedDish(`${recommendedDish}, ${dishName}`)
    }
  }

  const handleAddTag = (tag: string) => {
    const currentTags = tags
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean)
    const cleanTag = tag.replace(/^#/, "").trim()
    if (!currentTags.includes(cleanTag)) {
      setTags([...currentTags, cleanTag].join(", "))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")

    const trimmedTitle = title.trim()
    if (trimmedTitle.length < 6) {
      setErrorMsg("Tiêu đề bài viết cần có ít nhất 6 ký tự.")
      return
    }

    const trimmedCover = coverImage.trim()
    if (!trimmedCover) {
      setErrorMsg("Vui lòng chọn hoặc nhập URL ảnh bìa cho bài viết.")
      return
    }

    const trimmedContent = content.trim()
    if (trimmedContent.length < 20) {
      setErrorMsg(
        "Nội dung chia sẻ cần có ít nhất 20 ký tự để người đọc nắm bắt được trải nghiệm.",
      )
      return
    }

    const paragraphs = trimmedContent
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean)
    const finalContent = paragraphs.length > 0 ? paragraphs : [trimmedContent]

    const excerpt =
      finalContent[0].length > 160
        ? `${finalContent[0].slice(0, 157)}...`
        : finalContent[0]

    const categoryItem = CATEGORY_OPTIONS.find((c) => c.id === category)
    const categoryLabel = categoryItem?.label || "Review Quán"

    const parsedTags = tags
      .split(",")
      .map((t) => t.trim().replace(/^#/, ""))
      .filter(Boolean)
    const finalTags =
      parsedTags.length > 0
        ? parsedTags
        : place.tags && place.tags.length > 0
          ? place.tags
          : ["Ẩm thực"]

    const authorName =
      profile?.display_name ||
      (user?.user_metadata?.full_name as string) ||
      (user?.email ? user.email.split("@")[0] : "Thực khách ẩn danh")

    const authorAvatar =
      profile?.avatar_url ||
      (user?.user_metadata?.avatar_url as string) ||
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150"

    const authorRole =
      profile?.bio || (user ? "Thành viên cộng đồng" : "Thực khách trải nghiệm")

    const input: CreatePlaceArticleInput = {
      title: trimmedTitle,
      category,
      categoryLabel,
      coverImage: trimmedCover,
      excerpt,
      content: finalContent,
      quoteText: quoteText.trim() || undefined,
      quoteAuthor: quoteAuthor.trim() || undefined,
      recommendedDish: recommendedDish.trim() || undefined,
      costPerPerson: costPerPerson.trim() || undefined,
      tags: finalTags,
      placeId: place.id,
      authorName,
      authorAvatar,
      authorRole,
      userId: user?.id,
    }

    try {
      setIsSubmitting(true)
      const newArticle = await createPlaceArticle(input)
      onArticleCreated(newArticle)
      onClose()
    } catch (err: unknown) {
      const error = err as Error
      setErrorMsg(
        error?.message || "Đã có lỗi xảy ra khi tạo bài viết, vui lòng thử lại!",
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 md:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#1E293B]/65 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (!isSubmitting) onClose()
        }}
      />

      {/* Modal Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="place-article-modal-title"
        className="relative w-full max-w-3xl rounded-2xl border border-[#1E293B] bg-[#FAF8F5] p-5 sm:p-7 md:p-8 shadow-[3px_3px_0px_#1E293B] z-10 max-h-[92vh] overflow-y-auto my-auto"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-[#1E293B]/15 pb-4 mb-5">
          <div className="pr-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex size-7 items-center justify-center rounded-lg bg-[#FFE4E8] border border-[#1E293B] text-sm shadow-[1px_1px_0px_#1E293B]">
                ✍️
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-[#E55067]">
                Viết Bài Cho Quán Ăn
              </span>
            </div>
            <h2
              id="place-article-modal-title"
              className="text-xl sm:text-2xl font-black text-[#1E293B] leading-tight"
            >
              Chia Sẻ Trải Nghiệm Tại {place.name}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              Viết bài review chân thực, lan tỏa món ngon và trải nghiệm đáng
              nhớ cho cộng đồng thực khách
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Đóng cửa sổ"
            className="flex size-8 shrink-0 items-center justify-center rounded-full border border-[#1E293B] bg-white text-[#1E293B] font-black text-sm shadow-[1.5px_1.5px_0px_#1E293B] hover:bg-slate-100 active:translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* User Status / Guest Notice Banner */}
        {!user ? (
          <div className="mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-[#1E293B] bg-[#FFF5EF] p-3.5 shadow-[1.5px_1.5px_0px_#1E293B]">
            <div className="flex items-center gap-2.5">
              <span className="text-xl">💡</span>
              <p className="text-xs sm:text-sm font-semibold text-[#1E293B]">
                Bạn đang chia sẻ với tư cách{" "}
                <span className="font-black text-[#E55067]">khách ẩn danh</span>
                . Bạn có muốn đăng nhập để lưu bài vào hồ sơ cá nhân?
              </p>
            </div>
            <button
              type="button"
              onClick={() => openAuthModal("login")}
              className="shrink-0 rounded-lg border border-[#1E293B] bg-[#FFE4E8] px-3.5 py-1.5 text-xs font-black text-[#E55067] shadow-[1.5px_1.5px_0px_#1E293B] hover:-translate-y-0.5 active:translate-y-0 transition-transform cursor-pointer"
            >
              Đăng nhập ngay
            </button>
          </div>
        ) : (
          <div className="mb-5 flex items-center justify-between rounded-xl border border-[#1E293B] bg-emerald-50 px-4 py-2.5 shadow-[1.5px_1.5px_0px_#1E293B]">
            <div className="flex items-center gap-2.5">
              <img
                src={
                  profile?.avatar_url ||
                  (user?.user_metadata?.avatar_url as string) ||
                  "/img/profile-avatar.png"
                }
                alt="Avatar tác giả"
                className="size-7 rounded-full border border-[#1E293B] object-cover"
                onError={(e) => {
                  ;(e.target as HTMLImageElement).src =
                    "/img/profile-avatar.png"
                }}
              />
              <span className="text-xs sm:text-sm font-bold text-[#1E293B]">
                Đăng bài với tên:{" "}
                <span className="font-black text-emerald-800">
                  {profile?.display_name ||
                    (user?.user_metadata?.full_name as string) ||
                    user.email}
                </span>
              </span>
            </div>
            <span className="rounded-full border border-emerald-700 bg-white px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-700">
              Đã xác thực
            </span>
          </div>
        )}

        {/* Error Alert Pill */}
        {errorMsg && (
          <div className="mb-5 flex items-center gap-2.5 rounded-xl border border-[#1E293B] bg-rose-100 p-3.5 text-rose-900 shadow-[1.5px_1.5px_0px_#1E293B]">
            <span className="text-lg">⚠️</span>
            <p className="text-xs sm:text-sm font-bold">{errorMsg}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="space-y-6">
          {/* Block 1: Title & Category */}
          <div className="rounded-xl border border-[#1E293B] bg-white p-4 sm:p-5 shadow-[2px_2px_0px_#1E293B]">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex size-6 items-center justify-center rounded-md bg-amber-100 border border-[#1E293B] text-xs font-black">
                1
              </span>
              <h3 className="text-sm sm:text-base font-black text-[#1E293B]">
                Tiêu Đề & Thể Loại Bài Viết
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="article-title"
                  className="block text-xs sm:text-sm font-extrabold text-[#1E293B] mb-1.5"
                >
                  Tiêu đề bài viết <span className="text-[#E55067]">*</span>
                </label>
                <input
                  id="article-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder={`VD: Buổi tối ấm cúng cùng set đặc sản tại ${place.name}...`}
                  maxLength={120}
                  className="w-full rounded-xl border border-[#1E293B] bg-[#FAF8F5] px-3.5 py-2.5 text-sm font-semibold text-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E55067]"
                />
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500 font-medium">
                  <span>Tối thiểu 6 ký tự</span>
                  <span>{title.length}/120 ký tự</span>
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-extrabold text-[#1E293B] mb-2">
                  Thể loại bài viết
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {CATEGORY_OPTIONS.map((cat) => {
                    const isSelected = category === cat.id
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setCategory(cat.id)}
                        className={`flex items-start gap-2.5 p-3 rounded-xl border border-[#1E293B] text-left transition-all ${
                          isSelected
                            ? "bg-[#FFE4E8] shadow-[2px_2px_0px_#1E293B] -translate-y-0.5"
                            : "bg-[#FAF8F5] shadow-[1px_1px_0px_#1E293B] hover:bg-slate-100"
                        }`}
                      >
                        <span className="text-xl shrink-0 mt-0.5">
                          {cat.icon}
                        </span>
                        <div>
                          <div
                            className={`text-xs sm:text-sm font-black ${
                              isSelected ? "text-[#E55067]" : "text-[#1E293B]"
                            }`}
                          >
                            {cat.label}
                          </div>
                          <div className="text-[11px] text-slate-600 font-medium line-clamp-1">
                            {cat.description}
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Block 2: Cover Image */}
          <div className="rounded-xl border border-[#1E293B] bg-white p-4 sm:p-5 shadow-[2px_2px_0px_#1E293B]">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex size-6 items-center justify-center rounded-md bg-blue-100 border border-[#1E293B] text-xs font-black">
                2
              </span>
              <h3 className="text-sm sm:text-base font-black text-[#1E293B]">
                Ảnh Bìa Bài Viết
              </h3>
            </div>

            <div className="space-y-3.5">
              <div>
                <label
                  htmlFor="article-cover"
                  className="block text-xs sm:text-sm font-extrabold text-[#1E293B] mb-1.5"
                >
                  Đường dẫn ảnh bìa (URL){" "}
                  <span className="text-[#E55067]">*</span>
                </label>
                <input
                  id="article-cover"
                  type="text"
                  value={coverImage}
                  onChange={(e) => {
                    setCoverImage(e.target.value)
                    setImageError(false)
                  }}
                  placeholder="https://images.unsplash.com/... hoặc chọn nhanh ảnh quán bên dưới"
                  className="w-full rounded-xl border border-[#1E293B] bg-[#FAF8F5] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E55067]"
                />
              </div>

              {/* Quick Select from place images */}
              {quickImages.length > 0 && (
                <div>
                  <div className="text-xs font-bold text-slate-700 mb-2">
                    Chọn nhanh ảnh sẵn có từ quán ăn:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {quickImages.map((img, idx) => {
                      const isSelected = coverImage === img.url
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setCoverImage(img.url)
                            setImageError(false)
                          }}
                          className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-[#1E293B] text-xs font-bold transition-all cursor-pointer ${
                            isSelected
                              ? "bg-[#FFE4E8] text-[#E55067] shadow-[1.5px_1.5px_0px_#1E293B] -translate-y-0.5"
                              : "bg-[#FAF8F5] text-slate-700 shadow-[1px_1px_0px_#1E293B] hover:bg-slate-100"
                          }`}
                        >
                          <img
                            src={img.url}
                            alt={img.label}
                            className="size-5 rounded object-cover border border-[#1E293B]"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).src =
                                "/img/card-sakura.png"
                            }}
                          />
                          <span className="max-w-[140px] truncate">
                            {img.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Live Image Preview */}
              {coverImage.trim() && (
                <div className="pt-2">
                  <div className="text-xs font-bold text-slate-600 mb-1.5">
                    Xem trước ảnh bìa:
                  </div>
                  <div className="relative h-44 sm:h-52 w-full overflow-hidden rounded-xl border border-[#1E293B] bg-slate-100 shadow-[2px_2px_0px_#1E293B]">
                    {!imageError ? (
                      <img
                        src={coverImage}
                        alt="Ảnh bìa xem trước"
                        onError={() => setImageError(true)}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full flex-col items-center justify-center p-4 text-center">
                        <span className="text-2xl mb-1">🖼️</span>
                        <span className="text-xs font-bold text-slate-600">
                          Không thể tải hình ảnh từ URL này
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5">
                          Vui lòng kiểm tra lại đường dẫn ảnh hoặc chọn ảnh có
                          sẵn ở trên
                        </span>
                      </div>
                    )}
                    <span className="absolute bottom-2 right-2 rounded-lg border border-[#1E293B] bg-white/90 px-2.5 py-1 text-[11px] font-black text-[#1E293B] shadow-[1px_1px_0px_#1E293B] backdrop-blur-xs">
                      Ảnh bìa
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Block 3: Food Recommendation & Cost */}
          <div className="rounded-xl border border-[#1E293B] bg-white p-4 sm:p-5 shadow-[2px_2px_0px_#1E293B]">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex size-6 items-center justify-center rounded-md bg-rose-100 border border-[#1E293B] text-xs font-black">
                3
              </span>
              <h3 className="text-sm sm:text-base font-black text-[#1E293B]">
                Gợi Ý Món Ngon & Chi Phí Thực Tế
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="recommended-dish"
                  className="block text-xs sm:text-sm font-extrabold text-[#1E293B] mb-1.5"
                >
                  Món ngon khuyên thử
                </label>
                <input
                  id="recommended-dish"
                  type="text"
                  value={recommendedDish}
                  onChange={(e) => setRecommendedDish(e.target.value)}
                  placeholder="VD: Cá hồi sốt Teriyaki & Lẩu Sukiyaki"
                  className="w-full rounded-xl border border-[#1E293B] bg-[#FAF8F5] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E55067]"
                />

                {/* Quick Add Pills from Place Menu */}
                {availableDishes.length > 0 && (
                  <div className="mt-2.5">
                    <span className="text-[11px] font-bold text-slate-500 block mb-1">
                      Gợi ý nhanh từ thực đơn quán:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {availableDishes.slice(0, 6).map((dish) => (
                        <button
                          key={dish}
                          type="button"
                          onClick={() => handleAddDish(dish)}
                          className="rounded-lg border border-[#1E293B] bg-[#FFF5EF] px-2 py-0.5 text-[11px] font-bold text-[#E55067] shadow-[1px_1px_0px_#1E293B] hover:bg-[#FFE4E8] active:translate-y-0.5 transition-all cursor-pointer"
                        >
                          + {dish}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label
                  htmlFor="cost-per-person"
                  className="block text-xs sm:text-sm font-extrabold text-[#1E293B] mb-1.5"
                >
                  Chi phí ước tính / người
                </label>
                <input
                  id="cost-per-person"
                  type="text"
                  value={costPerPerson}
                  onChange={(e) => setCostPerPerson(e.target.value)}
                  placeholder="VD: 150.000đ - 250.000đ / người"
                  className="w-full rounded-xl border border-[#1E293B] bg-[#FAF8F5] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E55067]"
                />
                <span className="text-[11px] text-slate-500 font-medium block mt-1.5">
                  Khoảng giá thực tế bạn đã trải nghiệm khi đến quán
                </span>
              </div>
            </div>
          </div>

          {/* Block 4: Detailed Experience & Quote */}
          <div className="rounded-xl border border-[#1E293B] bg-white p-4 sm:p-5 shadow-[2px_2px_0px_#1E293B]">
            <div className="flex items-center gap-2 mb-3">
              <span className="flex size-6 items-center justify-center rounded-md bg-purple-100 border border-[#1E293B] text-xs font-black">
                4
              </span>
              <h3 className="text-sm sm:text-base font-black text-[#1E293B]">
                Cảm Nhận Chi Tiết & Trích Dẫn Ấn Tượng
              </h3>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="article-content"
                  className="block text-xs sm:text-sm font-extrabold text-[#1E293B] mb-1.5"
                >
                  Nội dung bài viết <span className="text-[#E55067]">*</span>
                </label>
                <textarea
                  id="article-content"
                  rows={6}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`Chia sẻ cảm nhận chân thực của bạn về ${place.name}: không gian, thái độ phục vụ, hương vị các món ăn và mẹo đi lại...\n\n(Mẹo: Xuống 2 dòng để tạo đoạn văn mới tách biệt)`}
                  className="w-full rounded-xl border border-[#1E293B] bg-[#FAF8F5] p-3.5 text-xs sm:text-sm font-medium text-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E55067]"
                />
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-500 font-medium">
                  <span>Tối thiểu 20 ký tự</span>
                  <span>{content.trim().length} ký tự</span>
                </div>
              </div>

              {/* Quote Block */}
              <div className="rounded-xl border border-dashed border-[#1E293B]/40 bg-[#FAF8F5] p-3.5 space-y-3">
                <div className="text-xs font-black text-[#1E293B] flex items-center gap-1.5">
                  <span>💬</span>
                  <span>Trích dẫn hoặc câu nói ấn tượng nhất (Tùy chọn)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      value={quoteText}
                      onChange={(e) => setQuoteText(e.target.value)}
                      placeholder='VD: "Một góc bình yên giữa phố thị với hương vị chuẩn vị Nhật."'
                      className="w-full rounded-xl border border-[#1E293B] bg-white px-3 py-2 text-xs font-semibold text-[#1E293B] shadow-[1px_1px_0px_#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E55067]"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={quoteAuthor}
                      onChange={(e) => setQuoteAuthor(e.target.value)}
                      placeholder="Người trích dẫn (VD: Tác giả)"
                      className="w-full rounded-xl border border-[#1E293B] bg-white px-3 py-2 text-xs font-semibold text-[#1E293B] shadow-[1px_1px_0px_#1E293B] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#E55067]"
                    />
                  </div>
                </div>
              </div>

              {/* Tags Input */}
              <div>
                <label
                  htmlFor="article-tags"
                  className="block text-xs sm:text-sm font-extrabold text-[#1E293B] mb-1.5"
                >
                  Hashtags / Từ khóa
                </label>
                <input
                  id="article-tags"
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="VD: AmThuc, HenHo, QuanNgon, CuoiTuan (ngăn cách bằng dấu phẩy)"
                  className="w-full rounded-xl border border-[#1E293B] bg-[#FAF8F5] px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B] placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E55067]"
                />

                {/* Quick Tags from place.tags */}
                {place.tags && place.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] font-bold text-slate-500 mr-1">
                      Thêm thẻ từ quán:
                    </span>
                    {place.tags.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleAddTag(tag)}
                        className="rounded-lg border border-[#1E293B] bg-white px-2 py-0.5 text-[11px] font-bold text-[#1E293B] shadow-[1px_1px_0px_#1E293B] hover:bg-slate-100 active:translate-y-0.5 transition-all cursor-pointer"
                      >
                        #{tag}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div className="flex flex-col-reverse sm:flex-row items-center justify-end gap-3 pt-3 border-t border-[#1E293B]/15">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto rounded-xl border border-[#1E293B] bg-white px-5 py-2.5 text-xs sm:text-sm font-black text-[#1E293B] shadow-[1.5px_1.5px_0px_#1E293B] hover:bg-slate-100 active:translate-y-0.5 transition-all disabled:opacity-50 cursor-pointer"
            >
              Hủy bỏ
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-[#1E293B] bg-[#E55067] px-6 py-2.5 text-xs sm:text-sm font-black text-white shadow-[2px_2px_0px_#1E293B] hover:shadow-[3px_3px_0px_#1E293B] hover:-translate-x-0.5 hover:-translate-y-0.5 active:translate-x-0.5 active:translate-y-0.5 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="size-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                  <span>Đang đăng bài...</span>
                </>
              ) : (
                <>
                  <span>Đăng bài viết ngay</span>
                  <span>🚀</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
