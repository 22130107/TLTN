import type { Metadata } from "next"
import Image from "next/image"
import { notFound } from "next/navigation"
import MainHeader from "@/components/navigation/MainHeader"
import MainFooter from "@/components/navigation/MainFooter"
import ModernPlaceDetailHero from "@/components/detail/ModernPlaceDetailHero"
import ModernPlaceDetailContent from "@/components/detail/ModernPlaceDetailContent"
import ModernPlaceDetailSidebar from "@/components/detail/ModernPlaceDetailSidebar"
import ModernRelatedPlaces from "@/components/detail/ModernRelatedPlaces"
import {
  getPlaceDetailById,
  getAllPlaceIdsFromDb,
} from "@/services/placesService"

export const revalidate = 60
export const dynamicParams = true

export async function generateStaticParams() {
  const ids = await getAllPlaceIdsFromDb()
  return ids.map((id) => ({ id }))
}

interface PlaceDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: PlaceDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const place = await getPlaceDetailById(id)

  if (!place) {
    return {
      title: "Không tìm thấy địa điểm | HYUN",
      description:
        "Địa điểm ẩm thực bạn tìm kiếm hiện không tồn tại hoặc đã bị xóa.",
    }
  }

  return {
    title: `${place.name} | Chi Tiết Quán Ăn HYUN`,
    description: place.story.slice(0, 160),
  }
}

export default async function PlaceDetailPage({
  params,
}: PlaceDetailPageProps) {
  const { id } = await params
  const place = await getPlaceDetailById(id)

  if (!place) {
    notFound()
  }

  return (
    <div className="relative min-h-screen bg-[#fdefdf] text-[#1E293B] selection:bg-[#FF5C77] selection:text-white flex flex-col justify-between overflow-x-hidden">
      {/* Decorative Background Artwork matching Places Explore page */}
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
        <MainHeader activeTab="explore" />

        {/* Main Content Area */}
        <main className="mx-auto max-w-7xl px-4 pt-6 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8">
          {/* Hero Header Block */}
          <ModernPlaceDetailHero place={place} />

          {/* 2-Column Responsive Layout */}
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            {/* Left Column: Showcase Image, Story, Menu & Amenities */}
            <div className="flex-1 min-w-0 w-full">
              <ModernPlaceDetailContent place={place} />
            </div>

            {/* Right Column: Sticky Quick Contact, Hours & Schedule Booking */}
            <ModernPlaceDetailSidebar place={place} />
          </div>

          {/* Related Recommendations Carousel / Grid */}
          <ModernRelatedPlaces currentId={place.id} />
        </main>
      </div>

      {/* Footer */}
      <MainFooter />
    </div>
  )
}
