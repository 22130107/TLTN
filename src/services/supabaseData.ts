import { supabase } from "@/lib/supabase/client"
import { EXPLORE_PLACES, type ExplorePlace } from "@/data/explorePlacesData"
import { ARTICLES_DATA } from "@/data/articlesData"
import type { Article } from "@/types/article"
import type { PlaceRow, ArticleRow } from "@/lib/supabase/types"

/**
 * Fetch all places with fallback to static mock data
 */
export async function fetchPlaces(): Promise<ExplorePlace[]> {
  try {
    const { data, error } = await supabase
      .from("places")
      .select("*")
      .order("rating", { ascending: false })

    if (error || !data || data.length === 0) {
      return EXPLORE_PLACES
    }

    const rows = data as unknown as PlaceRow[]
    return rows.map((p) => ({
      id: p.id,
      name: p.name,
      badge: p.badge || "Địa điểm hot",
      badgeColor: p.badge_color || "bg-[#FF5376]",
      rating: Number(p.rating),
      reviewCount: `${p.review_count} đánh giá`,
      distance: 1.2,
      distanceText: "1.2 km",
      district: p.district,
      tags: p.tags || [],
      description: p.story || "",
      image: p.image,
      categoryType: p.category_id as ExplorePlace["categoryType"] || "quan-an",
      priceRange: "100k-200k",
      priceText: p.price_range || "100.000₫ - 200.000₫",
    }))
  } catch {
    return EXPLORE_PLACES
  }
}

/**
 * Fetch all articles with fallback to static mock data
 */
export async function fetchArticles(): Promise<Article[]> {
  try {
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .order("published_at", { ascending: false })

    if (error || !data || data.length === 0) {
      return ARTICLES_DATA
    }

    const rows = data as unknown as ArticleRow[]
    return rows.map((a) => ({
      id: a.id,
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      content: a.content,
      quote: a.quote_text
        ? {
            text: a.quote_text,
            author: a.quote_author || undefined,
          }
        : undefined,
      coverImage: a.cover_image,
      category: a.category,
      categoryLabel: a.category_label,
      tags: a.tags,
      author: {
        name: a.author_name,
        avatar: a.author_avatar,
        role: a.author_role,
      },
      publishedAt: new Date(a.published_at).toLocaleDateString("vi-VN"),
      readTime: a.read_time,
      relatedPlaceId: a.related_place_id || undefined,
      views: a.views,
      likes: a.likes,
      featured: a.is_featured,
    }))
  } catch {
    return ARTICLES_DATA
  }
}
