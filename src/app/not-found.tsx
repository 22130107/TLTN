import Link from "next/link"
import MainHeader from "@/components/navigation/MainHeader"
import MainFooter from "@/components/navigation/MainFooter"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#fdefdf] text-[#1E293B] flex flex-col justify-between">
      <MainHeader />
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 text-center">
        <span className="text-8xl font-black text-[#FF5C77]/20 select-none">
          404
        </span>
        <h1 className="mt-4 text-3xl sm:text-4xl font-black tracking-tight text-[#1E293B]">
          Không tìm thấy trang
        </h1>
        <p className="mt-2 text-base text-[#64748B] max-w-md">
          Địa điểm hoặc bài viết bạn đang tìm kiếm không tồn tại hoặc đã được
          chuyển sang đường dẫn khác.
        </p>
        <Link
          href="/"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#FF5C77] text-white font-medium shadow-md shadow-[#FF5C77]/25 hover:bg-[#e04f68] transition-colors"
        >
          Về trang chủ
        </Link>
      </main>
      <MainFooter />
    </div>
  )
}
