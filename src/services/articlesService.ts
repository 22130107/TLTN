import { createServerClient } from "@/lib/supabase/server"
import { supabase as clientSupabase } from "@/lib/supabase/client"
import type { SupabaseClient } from "@supabase/supabase-js"
import {
  ARTICLES_DATA,
  getAllArticles as getStaticAllArticles,
  getFeaturedArticle as getStaticFeaturedArticle,
  getArticleById as getStaticArticleById,
  getRelatedArticles as getStaticRelatedArticles,
} from "@/data/articlesData"
import type {
  Article,
  ArticleCategory,
  CreatePlaceArticleInput,
} from "@/types/article"
import type { Database } from "@/lib/supabase/types"

export type { CreatePlaceArticleInput } from "@/types/article"

type ArticleRow = Database["public"]["Tables"]["articles"]["Row"]
type ArticleInsert = Database["public"]["Tables"]["articles"]["Insert"]

const LOCAL_ARTICLES_KEY = "hyun_local_articles"

/**
 * Trả về Supabase client phù hợp với môi trường (client hoặc server)
 */
function getSupabaseClient(): SupabaseClient<Database> {
  if (typeof window !== "undefined") {
    return clientSupabase
  }
  return createServerClient()
}

/**
 * Đọc danh sách bài viết lưu trong localStorage (chỉ chạy ở phía client)
 */
function getLocalArticles(): Article[] {
  if (typeof window === "undefined") {
    return []
  }
  try {
    const raw = window.localStorage.getItem(LOCAL_ARTICLES_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed.filter(
      (item): item is Article =>
        Boolean(item) &&
        typeof item === "object" &&
        typeof item.id === "string",
    )
  } catch (err) {
    console.warn(
      "[articlesService] Failed to read local articles from localStorage:",
      err,
    )
    return []
  }
}

/**
 * Lưu một bài viết vào localStorage (chỉ chạy ở phía client)
 */
function saveLocalArticle(article: Article): void {
  if (typeof window === "undefined") {
    return
  }
  try {
    const current = getLocalArticles()
    const updated = [article, ...current.filter((a) => a.id !== article.id)]
    window.localStorage.setItem(LOCAL_ARTICLES_KEY, JSON.stringify(updated))
  } catch (err) {
    console.warn(
      "[articlesService] Failed to cache article to localStorage:",
      err,
    )
  }
}

/**
 * Chuyển đổi chuỗi tiếng Việt có dấu thành slug không dấu (kebab-case)
 */
function slugifyVietnamese(text: string): string {
  if (!text) return ""
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[đĐ]/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
}

/**
 * Ước tính thời gian đọc bài viết dựa trên số lượng từ (~200 từ/phút)
 */
function calculateReadTime(
  title: string,
  excerpt: string,
  content: string[],
): string {
  const fullText = [
    title,
    excerpt,
    ...(Array.isArray(content) ? content : []),
  ].join(" ")
  const wordCount = fullText.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.max(1, Math.ceil(wordCount / 200))
  return `${minutes} phút đọc`
}

function mapRowToArticle(row: ArticleRow): Article {
  const validCategories: ArticleCategory[] = [
    "all",
    "review",
    "culture",
    "guide",
    "couple",
  ]
  const category = validCategories.includes(row.category as ArticleCategory)
    ? row.category as ArticleCategory
    : "review"

  return {
    id: row.id,
    slug: row.slug || row.id,
    title: row.title,
    excerpt: row.excerpt,
    content: Array.isArray(row.content) ? row.content : [row.content || ""],
    quote: row.quote_text
      ? {
          text: row.quote_text,
          author: row.quote_author || undefined,
        }
      : undefined,
    coverImage: row.cover_image || "/img/card-sakura.png",
    category,
    categoryLabel: row.category_label || "Review Quán",
    tags:
      Array.isArray(row.tags) && row.tags.length > 0 ? row.tags : ["Ẩm thực"],
    author: {
      name: row.author_name || "Ban biên tập HYUN",
      avatar:
        row.author_avatar ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      role: row.author_role || "Biên tập viên ẩm thực",
    },
    publishedAt: row.published_at
      ? new Date(row.published_at).toLocaleDateString("vi-VN")
      : "Gần đây",
    readTime: row.read_time || "5 phút đọc",
    relatedPlaceId: row.related_place_id || undefined,
    views: Number(row.views) || 0,
    likes: Number(row.likes) || 0,
    featured: Boolean(row.is_featured),
    recommendedDish: row.recommended_dish || undefined,
    costPerPerson: row.cost_per_person || undefined,
    userId: row.user_id || undefined,
  }
}

/**
 * Lấy toàn bộ danh sách bài viết từ database (kết hợp local cache trên client)
 */
export async function getArticles(): Promise<Article[]> {
  const localArticles = getLocalArticles()
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("published_at", { ascending: false })

    let remoteArticles: Article[] = []
    if (!error && data && data.length > 0) {
      remoteArticles = (data as ArticleRow[]).map(mapRowToArticle)
    } else {
      remoteArticles = getStaticAllArticles()
    }

    if (localArticles.length === 0) return remoteArticles

    const seenIds = new Set<string>()
    const merged: Article[] = []
    for (const a of localArticles) {
      if (!seenIds.has(a.id)) {
        seenIds.add(a.id)
        merged.push(a)
      }
    }
    for (const a of remoteArticles) {
      if (!seenIds.has(a.id)) {
        seenIds.add(a.id)
        merged.push(a)
      }
    }
    return merged
  } catch (err) {
    console.error("[articlesService] getArticles error:", err)
    const fallback = getStaticAllArticles()
    if (localArticles.length === 0) return fallback
    const seenIds = new Set<string>()
    const merged: Article[] = []
    for (const a of localArticles) {
      if (!seenIds.has(a.id)) {
        seenIds.add(a.id)
        merged.push(a)
      }
    }
    for (const a of fallback) {
      if (!seenIds.has(a.id)) {
        seenIds.add(a.id)
        merged.push(a)
      }
    }
    return merged
  }
}

/**
 * Lấy bài viết tiêu điểm (featured)
 */
export async function getFeaturedArticle(): Promise<Article | null> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("is_featured", true)
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error || !data) {
      // Fallback lấy bài viết mới nhất nếu chưa có bài nào được đánh dấu is_featured
      const fallbackQuery = await supabase
        .from("articles")
        .select("*")
        .order("published_at", { ascending: false })
        .limit(1)
        .maybeSingle()

      if (fallbackQuery.data) {
        return mapRowToArticle(fallbackQuery.data as ArticleRow)
      }

      return getStaticFeaturedArticle() || null
    }

    return mapRowToArticle(data as ArticleRow)
  } catch (err) {
    console.error("[articlesService] getFeaturedArticle error:", err)
    return getStaticFeaturedArticle() || null
  }
}

/**
 * Lấy chi tiết bài viết theo ID hoặc slug
 */
export async function getArticleById(
  idOrSlug: string,
): Promise<Article | null> {
  // 1. Kiểm tra cache localStorage trên client
  const localArticles = getLocalArticles()
  const localMatch = localArticles.find(
    (a) => a.id === idOrSlug || a.slug === idOrSlug,
  )
  if (localMatch) {
    return localMatch
  }

  try {
    const supabase = getSupabaseClient()

    // 2. Thử tìm theo id trên Supabase
    let { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("id", idOrSlug)
      .maybeSingle()

    // 3. Nếu không tìm thấy theo id, thử tìm theo slug
    if (!data) {
      const slugQuery = await supabase
        .from("articles")
        .select("*")
        .eq("slug", idOrSlug)
        .maybeSingle()
      data = slugQuery.data
      error = slugQuery.error
    }

    if (error || !data) {
      // Fallback kiểm tra static mock
      const staticItem = getStaticArticleById(idOrSlug)
      return staticItem || null
    }

    return mapRowToArticle(data as ArticleRow)
  } catch (err) {
    console.error("[articlesService] getArticleById error:", err)
    return getStaticArticleById(idOrSlug) || null
  }
}

/**
 * Lấy danh sách bài viết liên quan theo category
 */
export async function getRelatedArticles(
  currentId: string,
  category: string,
  limit: number = 3,
): Promise<Article[]> {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .neq("id", currentId)
      .order("published_at", { ascending: false })
      .limit(limit * 2)

    if (error || !data || data.length === 0) {
      return getStaticRelatedArticles(currentId, category, limit)
    }

    const allMapped = (data as ArticleRow[]).map(mapRowToArticle)

    // Ưu tiên bài cùng category
    const sameCat = allMapped.filter((a) => a.category === category)
    if (sameCat.length >= limit) {
      return sameCat.slice(0, limit)
    }

    // Nếu không đủ, ghép thêm các bài khác
    const otherCat = allMapped.filter((a) => a.category !== category)
    return [...sameCat, ...otherCat].slice(0, limit)
  } catch (err) {
    console.error("[articlesService] getRelatedArticles error:", err)
    return getStaticRelatedArticles(currentId, category, limit)
  }
}

/**
 * Lấy toàn bộ ID bài viết phục vụ generateStaticParams
 */
export async function getAllArticleIdsFromDb(): Promise<string[]> {
  try {
    const supabase = getSupabaseClient()
    const { data } = await supabase.from("articles").select("id, slug")
    const ids = new Set<string>()

    if (data && data.length > 0) {
      const rows = data as Array<{ id: string; slug: string }>
      rows.forEach((item) => {
        if (item.id) ids.add(item.id)
        if (item.slug) ids.add(item.slug)
      })
    } else {
      ARTICLES_DATA.forEach((a) => {
        if (a.id) ids.add(a.id)
        if (a.slug) ids.add(a.slug)
      })
    }

    // Thêm các bài viết tạo cục bộ nếu ở môi trường client
    const local = getLocalArticles()
    local.forEach((a) => {
      if (a.id) ids.add(a.id)
      if (a.slug) ids.add(a.slug)
    })

    return Array.from(ids)
  } catch {
    return ARTICLES_DATA.map((a) => a.id)
  }
}

/**
 * Lấy danh sách bài viết liên quan đến một địa điểm cụ thể
 */
export async function getArticlesByPlaceId(
  placeId: string,
): Promise<Article[]> {
  const localArticles = getLocalArticles().filter(
    (a) => a.relatedPlaceId === placeId,
  )

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("related_place_id", placeId)
      .order("published_at", { ascending: false })

    let remoteArticles: Article[] = []
    if (!error && data && data.length > 0) {
      remoteArticles = (data as ArticleRow[]).map(mapRowToArticle)
    } else {
      remoteArticles = ARTICLES_DATA.filter((a) => a.relatedPlaceId === placeId)
    }

    // Kết hợp bài viết cục bộ (được ưu tiên hiển thị trước) và bài viết remote
    const seenIds = new Set<string>()
    const merged: Article[] = []

    for (const a of localArticles) {
      if (!seenIds.has(a.id)) {
        seenIds.add(a.id)
        merged.push(a)
      }
    }

    for (const a of remoteArticles) {
      if (!seenIds.has(a.id)) {
        seenIds.add(a.id)
        merged.push(a)
      }
    }

    return merged
  } catch (err) {
    console.error("[articlesService] getArticlesByPlaceId error:", err)
    const fallback = ARTICLES_DATA.filter((a) => a.relatedPlaceId === placeId)
    const seenIds = new Set<string>()
    const merged: Article[] = []

    for (const a of localArticles) {
      if (!seenIds.has(a.id)) {
        seenIds.add(a.id)
        merged.push(a)
      }
    }

    for (const a of fallback) {
      if (!seenIds.has(a.id)) {
        seenIds.add(a.id)
        merged.push(a)
      }
    }

    return merged
  }
}

/**
 * Tạo bài viết mới liên kết với một địa điểm (hỗ trợ cả Supabase và local cache)
 */
export async function createPlaceArticle(
  input: CreatePlaceArticleInput,
): Promise<Article> {
  const timestamp = Date.now()
  const randomSuffix = Math.random().toString(36).substring(2, 7)
  const id = `place-art-${timestamp}-${randomSuffix}`

  const baseSlug = slugifyVietnamese(input.title) || "bai-viet"
  const slug = `${baseSlug}-${randomSuffix}`

  const readTime = calculateReadTime(input.title, input.excerpt, input.content)
  const publishedAt = new Date().toLocaleDateString("vi-VN")

  const dbCategory: Database["public"]["Tables"]["articles"]["Insert"]["category"] =
    (
      ["review", "culture", "guide", "couple"].includes(input.category)
        ? input.category
        : "review"
    ) as "review" | "culture" | "guide" | "couple"

  const newArticle: Article = {
    id,
    slug,
    title: input.title,
    excerpt: input.excerpt,
    content: input.content,
    quote: input.quoteText
      ? {
          text: input.quoteText,
          author: input.quoteAuthor || undefined,
        }
      : undefined,
    coverImage: input.coverImage || "/img/card-sakura.png",
    category: input.category,
    categoryLabel: input.categoryLabel || "Review Quán",
    tags: input.tags && input.tags.length > 0 ? input.tags : ["Cộng đồng"],
    author: {
      name: input.authorName || "Ẩn danh",
      avatar:
        input.authorAvatar ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
      role: input.authorRole || "Thành viên cộng đồng",
    },
    publishedAt,
    readTime,
    relatedPlaceId: input.placeId,
    views: 0,
    likes: 0,
    featured: false,
    recommendedDish: input.recommendedDish || undefined,
    costPerPerson: input.costPerPerson || undefined,
    userId: input.userId,
  }

  // Cố gắng insert vào Supabase nếu có kết nối
  try {
    const supabase = getSupabaseClient()
    const rowToInsert: ArticleInsert = {
      id,
      slug,
      title: newArticle.title,
      excerpt: newArticle.excerpt,
      content: newArticle.content,
      quote_text: input.quoteText || null,
      quote_author: input.quoteAuthor || null,
      cover_image: newArticle.coverImage,
      category: dbCategory,
      category_label: newArticle.categoryLabel,
      tags: newArticle.tags,
      author_name: newArticle.author.name,
      author_avatar: newArticle.author.avatar,
      author_role: newArticle.author.role,
      published_at: new Date().toISOString(),
      read_time: newArticle.readTime,
      related_place_id: input.placeId,
      views: 0,
      likes: 0,
      is_featured: false,
      recommended_dish: input.recommendedDish || null,
      cost_per_person: input.costPerPerson || null,
      user_id: input.userId || null,
    }

    const { error } = await supabase.from("articles").insert(rowToInsert as any)

    if (error) {
      console.warn(
        "[articlesService] createPlaceArticle Supabase insert warning:",
        error.message,
      )
    }
  } catch (err) {
    console.warn(
      "[articlesService] createPlaceArticle Supabase insert failed (continuing with local cache):",
      err,
    )
  }

  // Lưu vào localStorage cache để hiển thị tức thì trên client
  saveLocalArticle(newArticle)

  return newArticle
}

/**
 * Lấy danh sách bài viết của một người dùng (theo userId hoặc authorName), kết hợp database và local cache
 */
export async function getUserArticles(
  userId?: string,
  authorName?: string,
): Promise<(Article & { place?: Database["public"]["Tables"]["places"]["Row"] | null })[]> {
  const localArticles = getLocalArticles().filter((a) => {
    if (userId && a.userId === userId) return true
    if (authorName && a.author?.name === authorName) return true
    return false
  })

  try {
    const supabase = getSupabaseClient()
    let query = supabase
      .from("articles")
      .select("*, places:related_place_id(*)")
      .order("created_at", { ascending: false })

    if (userId && authorName) {
      query = query.or(`user_id.eq.${userId},author_name.eq."${authorName}"`)
    } else if (userId) {
      query = query.eq("user_id", userId)
    } else if (authorName) {
      query = query.eq("author_name", authorName)
    } else {
      query = query.limit(6)
    }

    const { data, error } = await query

    if (error) {
      console.warn(
        "[articlesService] getUserArticles Supabase query warning:",
        error.message,
      )
      return localArticles
    }

    if (data && data.length > 0) {
      const dbArticles = data.map((row: any) => ({
        ...mapRowToArticle(row),
        place: row.places || null,
      }))
      const dbIds = new Set(dbArticles.map((a) => a.id))
      const extraLocal = localArticles.filter((a) => !dbIds.has(a.id))
      return [...extraLocal, ...dbArticles]
    }
  } catch (err) {
    console.warn("[articlesService] getUserArticles error:", err)
  }

  return localArticles
}
