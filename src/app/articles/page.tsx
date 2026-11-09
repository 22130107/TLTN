import type { Metadata } from "next"
import Image from "next/image"
import MainHeader from "@/components/navigation/MainHeader"
import MainFooter from "@/components/navigation/MainFooter"
import FeaturedArticleBanner from "@/components/articles/FeaturedArticleBanner"
import ArticlesExplorer from "@/components/articles/ArticlesExplorer"
import { getArticles, getFeaturedArticle } from "@/services/articlesService"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Bài Viết & Ký Sự Ẩm Thực | HYUN",
  description:
    "Tạp chí ẩm thực HYUN - Chia sẻ trải nghiệm quán ngon, văn hóa bàn ăn truyền thống và cẩm nang ẩm thực 3 miền.",
}

export default async function ArticlesPage() {
  const [articles, featuredArticle] = await Promise.all([
    getArticles(),
    getFeaturedArticle(),
  ])

  return (
    <div className="relative min-h-screen bg-[#fdefdf] text-[#1E293B] selection:bg-[#FF5C77] selection:text-white flex flex-col justify-between overflow-x-hidden">
      {/* Decorative Background Artwork */}
      <div className="pointer-events-none select-none absolute bottom-12 left-2 sm:left-8 lg:left-16 z-0 w-[300px] sm:w-[400px] md:w-[480px] lg:w-[520px] max-w-[85vw] opacity-85 mix-blend-multiply">
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
          {/* Header Title Banner */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border-2 border-[#1E293B] bg-white px-3.5 py-1 text-xs font-black text-[#FF5376] shadow-[2px_2px_0px_#1E293B] mb-2.5">
                <span>📖</span>
                <span>Tạp Chí Ẩm Thực HYUN</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1E293B] tracking-tight">
                Ký Sự Ẩm Thực & Trải Nghiệm Bàn Ăn
              </h1>
              <p className="mt-1 text-xs sm:text-sm font-semibold text-slate-600">
                Những góc nhìn chân thật về các quán ăn, hương vị di sản và văn
                hóa gặp gỡ thân thương.
              </p>
            </div>
          </div>

          {/* Featured Editorial Banner */}
          <FeaturedArticleBanner article={featuredArticle} />

          {/* Articles Search & Filter Grid */}
          <ArticlesExplorer initialArticles={articles} />
        </main>
      </div>

      {/* Footer */}
      <MainFooter />
    </div>
  )
}
