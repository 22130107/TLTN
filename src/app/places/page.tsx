import type { Metadata } from "next"
import Image from "next/image"
import { Suspense } from "react"
import MainHeader from "@/components/navigation/MainHeader"
import MainFooter from "@/components/navigation/MainFooter"
import PlacesExplorer from "@/components/places/PlacesExplorer"
import { getExplorePlaces } from "@/services/placesService"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Khám Phá Địa Điểm Ẩm Thực | HYUN",
  description:
    "Khám phá danh bạ quán ăn truyền thống, món ngon đặc sản 3 miền và tìm kiếm địa điểm ẩm thực chuẩn vị Việt Nam.",
}

export default async function PlacesPage() {
  const explorePlaces = await getExplorePlaces()

  return (
    <div className="relative min-h-screen bg-[#fdefdf] text-[#1E293B] selection:bg-[#FF5C77] selection:text-white flex flex-col justify-between overflow-x-hidden">
      {/* Decorative Background Artwork: decoratediscover.png */}
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
        <MainHeader activeTab="explore" />
        <main className="mx-auto max-w-7xl px-4 pt-6 pb-16 sm:px-6 sm:pt-8 sm:pb-24 lg:px-8">
          <Suspense
            fallback={
              <div className="py-12 text-center font-bold text-slate-500">
                Đang tải danh sách quán...
              </div>
            }
          >
            <PlacesExplorer initialPlaces={explorePlaces} />
          </Suspense>
        </main>
      </div>
      <MainFooter />
    </div>
  )
}
