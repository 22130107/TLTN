export type ArticleCategory = "all" | "review" | "culture" | "guide" | "couple"

export interface ArticleAuthor {
  name: string
  avatar: string
  role: string
}

export interface Article {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string[]
  quote?: {
    text: string
    author?: string
  }
  coverImage: string
  category: ArticleCategory
  categoryLabel: string
  tags: string[]
  author: ArticleAuthor
  publishedAt: string
  readTime: string
  relatedPlaceId?: string
  views: number
  likes: number
  featured?: boolean
  recommendedDish?: string
  costPerPerson?: string
  userId?: string
}

export interface CreatePlaceArticleInput {
  title: string
  category: ArticleCategory
  categoryLabel: string
  coverImage: string
  excerpt: string
  content: string[]
  quoteText?: string
  quoteAuthor?: string
  recommendedDish?: string
  costPerPerson?: string
  tags: string[]
  placeId: string
  authorName: string
  authorAvatar: string
  authorRole?: string
  userId?: string
}
