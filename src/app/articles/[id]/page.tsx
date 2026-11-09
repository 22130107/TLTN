import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import MainHeader from "@/components/navigation/MainHeader"
import MainFooter from "@/components/navigation/MainFooter"
import ArticleDetailHero from "@/components/articles/ArticleDetailHero"
import ArticleDetailContent from "@/components/articles/ArticleDetailContent"
import RelatedArticles from "@/components/articles/RelatedArticles"
import {
  getArticleById,
  getRelatedArticles,
  getAllArticleIdsFromDb,
} from "@/services/articlesService"

export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  const ids = await getAllArticleIdsFromDb()
  return ids.map((id) => ({ id }))
}

interface ArticleDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const article = await getArticleById(id)

  if (!article) {
    return {
      title: "Không tìm thấy bài viết | HYUN",
    }
  }

  return {
    title: `${article.title} | Tạp Chí Ẩm Thực HYUN`,
    description: article.excerpt,
  }
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { id } = await params
  const article = await getArticleById(id)

  if (!article) {
    notFound()
  }

  const relatedArticles = await getRelatedArticles(
    article.id,
    article.category,
    3,
  )

  return (
    <div className="relative min-h-screen bg-[#fdefdf] text-[#1E293B] selection:bg-[#FF5C77] selection:text-white flex flex-col justify-between overflow-x-hidden">
      {/* Decorative Background Artwork */}
      <div className="pointer-events-none select-none absolute bottom-12 left-2 sm:left-8 lg:left-16 z-0 w-[300px] sm:w-[400px] md:w-[480px] lg:w-[520px] max-w-[85vw] opacity-80 mix-blend-multiply">
        <Image
          src="/img/decoratediscover.png"
          alt=""
          width={586}
          height={426}
          priority={false}
          className="w-full h-auto object-contain"
        />
      </div>

      <div className="relative z-10 w-full">
        {/* Navigation Header */}
        <MainHeader activeTab="articles" />

        {/* Main Content Area */}
        <main className="mx-auto max-w-7xl px-4 pt-6 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8">
          {/* Article Header & Metadata */}
          <ArticleDetailHero article={article} />

          {/* Main Article Body & Linked Place */}
          <ArticleDetailContent article={article} />

          {/* Related Articles Carousel / Grid */}
          <RelatedArticles articles={relatedArticles} />
        </main>
      </div>

      {/* Footer */}
      <MainFooter />
    </div>
  )
}
