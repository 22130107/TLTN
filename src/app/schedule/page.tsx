import type { Metadata } from "next"
import Image from "next/image"
import MainHeader from "@/components/navigation/MainHeader"
import MainFooter from "@/components/navigation/MainFooter"
import ScheduleExplorer from "@/components/schedule/ScheduleExplorer"
import {
  getSchedules,
  getUserProfile,
  getPlacesForSelect,
} from "@/services/schedulesService"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Lịch Trình Ẩm Thực & Bản Đồ Điểm Hẹn | HYUN",
  description:
    "Theo dõi lịch trình ẩm thực, điểm hẹn quán ngon và hành trình food tour cùng bản đồ tương tác HYUN.",
}

export default async function SchedulePage() {
  const [schedules, userProfile, places] = await Promise.all([
    getSchedules(),
    getUserProfile(),
    getPlacesForSelect(),
  ])

  return (
    <div className="relative min-h-screen bg-[#fdefdf] text-[#1E293B] selection:bg-[#FF5C77] selection:text-white flex flex-col justify-between overflow-x-hidden">
      {/* Decorative Background Artwork matching Places & Detail page */}
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
        <MainHeader activeTab="schedule" />

        {/* Main Container */}
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <ScheduleExplorer
            initialSchedules={schedules}
            userProfile={userProfile}
            places={places}
          />
        </main>
      </div>

      <MainFooter />
    </div>
  )
}
