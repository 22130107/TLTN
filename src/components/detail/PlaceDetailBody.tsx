"use client" /* 1. Practical Appointment & Rendezvous Info Card */ /* Thời gian */ /* Số lượng khách */ /* Địa chỉ */ /* Hotline & Giờ mở cửa */ /* Notes */ /* CTA Button to Map */ /* 2. Culinary Story & Heritage */ /* Signature Features */ /* 3. Recommended Signature Menu */ /* 4. Foodie Practical Tips */
import Link from "next/link"

export interface PlaceDetailBodyProps {
  address: string

  time: string

  date: string

  guestsCount: number

  signatureDish: string

  notes?: string

  phone?: string

  hours?: string

  story?: string

  menuItems?: Array<{
    name: string

    price: string

    desc: string

    isSignature?: boolean
  }>
}

export default function PlaceDetailBody({
  address,

  time,

  date,

  guestsCount,

  signatureDish,

  notes,

  phone = "+84 28 3822 5678",

  hours = "06:30 - 22:00 (Mở cửa cả ngày)",

  story,

  menuItems,
}: PlaceDetailBodyProps) {
  const defaultStory =
    story ||
    "Khởi nguồn từ niềm đam mê gìn giữ hương vị ẩm thực đường phố nguyên bản, từng đĩa cơm tấm tại đây là sự kết hợp chuẩn mực giữa hạt gạo tấm dẻo thơm, miếng sườn cốt lết dày thịt được tẩm ướp mật ong rừng cùng gia vị thảo mộc bí truyền nướng xèo xèo trên than hoa đỏ rực. Kèm theo đó là chén nước mắm kẹo sệt chua ngọt thanh tao, mỡ hành óng ả và đồ chua giòn rụm làm bừng tỉnh mọi giác quan của thực khách chuẩn gu."

  const defaultMenu = menuItems || [
    {
      name: "Cơm Tấm Sườn Cây Mật Ong Đặc Biệt",

      price: "75.000 đ",

      desc: "Sườn cây ướp mật ong hoa nhãn nướng than hoa mềm mọng, ăn kèm mỡ hành và tóp mỡ giòn rụm.",

      isSignature: true,
    },

    {
      name: "Cơm Tấm Sườn Bì Chả Trứng Ốp La",

      price: "85.000 đ",

      desc: "Đầy đủ 4 món truyền thống: sườn nướng, chả trứng hấp béo ngậy, bì trộn thính gạo và trứng lòng đào.",

      isSignature: true,
    },

    {
      name: "Canh Rong Biển Thịt Bằm",

      price: "25.000 đ",

      desc: "Nước canh thanh mát nấu từ rong biển tươi và thịt nạc bằm, giải nhiệt tuyệt vời cho bữa trưa.",
    },

    {
      name: "Trà Sâm Dứa Lá Dứa Hạt Chia",

      price: "20.000 đ",

      desc: "Thức uống thảo mộc nấu tươi trong ngày, thơm dịu hương lá nếp mát lành.",
    },
  ]

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6 sm:space-y-8 mt-6 sm:mt-8">
      {}
      <div className="border-2 border-black bg-white p-5 sm:p-7 shadow-[4px_4px_0px_#000000]">
        <div className="mb-4 flex items-center justify-between border-b-2 border-black pb-3">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center border border-black bg-black text-white text-xs">
              📍
            </span>
            <h3 className="text-base sm:text-lg font-black text-black uppercase tracking-tight">
              Thông Tin Điểm Hẹn Trải Nghiệm
            </h3>
          </div>
          <span className="border border-black bg-emerald-100 text-emerald-900 font-bold text-xs px-2.5 py-0.5">
            Điểm Đã Xác Nhận
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
          {}
          <div className="border border-black bg-neutral-50 p-3 shadow-[2px_2px_0px_#000000]">
            <span className="text-neutral-500 font-semibold block text-[11px] uppercase">
              Thời gian hẹn
            </span>
            <p className="mt-1 font-bold text-black text-sm sm:text-base">
              ⏰ {time} • Ngày {date}
            </p>
          </div>

          {}
          <div className="border border-black bg-neutral-50 p-3 shadow-[2px_2px_0px_#000000]">
            <span className="text-neutral-500 font-semibold block text-[11px] uppercase">
              Quy mô bàn hẹn
            </span>
            <p className="mt-1 font-bold text-black text-sm sm:text-base">
              👥 {guestsCount} thực khách
            </p>
          </div>

          {}
          <div className="sm:col-span-2 border border-black bg-neutral-50 p-3 shadow-[2px_2px_0px_#000000]">
            <span className="text-neutral-500 font-semibold block text-[11px] uppercase">
              Địa chỉ cụ thể
            </span>
            <p className="mt-1 font-bold text-black text-xs sm:text-sm leading-relaxed">
              📌 {address}
            </p>
          </div>

          {}
          <div className="border border-black bg-neutral-50 p-3 shadow-[2px_2px_0px_#000000]">
            <span className="text-neutral-500 font-semibold block text-[11px] uppercase">
              Hotline liên hệ
            </span>
            <p className="mt-1 font-bold text-black">📞 {phone}</p>
          </div>

          <div className="border border-black bg-neutral-50 p-3 shadow-[2px_2px_0px_#000000]">
            <span className="text-neutral-500 font-semibold block text-[11px] uppercase">
              Giờ phục vụ
            </span>
            <p className="mt-1 font-bold text-black">🕒 {hours}</p>
          </div>
        </div>

        {}
        {notes && (
          <div className="mt-4 border-l-4 border-black bg-neutral-100 p-3 text-xs text-neutral-800 font-medium italic">
            &ldquo;{notes}&rdquo;
          </div>
        )}

        {}
        <div className="mt-5 pt-4 border-t border-black/15 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-xs text-neutral-600 font-medium">
            Món nổi bật: <strong>{signatureDish}</strong>
          </span>
          <Link
            href="/schedule"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border-2 border-black bg-black text-white px-5 py-2.5 text-xs font-bold transition-all hover:bg-neutral-800 active:translate-x-0.5 active:translate-y-0.5 shadow-[2px_2px_0px_#000000]"
          >
            <span>Xem trên Bản đồ Lịch trình</span>
            <span>→</span>
          </Link>
        </div>
      </div>

      {}
      <div className="border-2 border-black bg-white p-5 sm:p-7 shadow-[4px_4px_0px_#000000]">
        <div className="mb-4 flex items-center justify-between border-b-2 border-black pb-3">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center border border-black bg-black text-white text-xs">
              ✦
            </span>
            <h3 className="text-base sm:text-lg font-black text-black uppercase tracking-tight">
              Câu Chuyện Tinh Hoa Ẩm Thực
            </h3>
          </div>
          <span className="border border-black bg-neutral-100 text-black font-bold text-xs px-2.5 py-0.5">
            HYUN Editorial
          </span>
        </div>

        <p className="text-xs sm:text-sm text-neutral-800 leading-relaxed font-medium text-justify">
          {defaultStory}
        </p>

        {}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-black/10">
          <div className="border border-black bg-neutral-50 p-3 text-center">
            <span className="text-lg">🥩</span>
            <h4 className="font-bold text-xs text-black mt-1">Sườn Mật Ong</h4>
            <p className="text-[11px] text-neutral-600 mt-0.5 font-medium">
              Than hoa thơm lừng
            </p>
          </div>
          <div className="border border-black bg-neutral-50 p-3 text-center">
            <span className="text-lg">🍚</span>
            <h4 className="font-bold text-xs text-black mt-1">Gạo Tấm Thơm</h4>
            <p className="text-[11px] text-neutral-600 mt-0.5 font-medium">
              Hạt dẻo tơi ráo
            </p>
          </div>
          <div className="border border-black bg-neutral-50 p-3 text-center">
            <span className="text-lg">🍶</span>
            <h4 className="font-bold text-xs text-black mt-1">Nước Mắm Kẹo</h4>
            <p className="text-[11px] text-neutral-600 mt-0.5 font-medium">
              Chua ngọt gia truyền
            </p>
          </div>
        </div>
      </div>

      {}
      <div className="border-2 border-black bg-white p-5 sm:p-7 shadow-[4px_4px_0px_#000000]">
        <div className="mb-5 flex items-center justify-between border-b-2 border-black pb-3">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center border border-black bg-black text-white text-xs">
              🍽️
            </span>
            <h3 className="text-base sm:text-lg font-black text-black uppercase tracking-tight">
              Thực Đơn Đề Xuất Phải Thử
            </h3>
          </div>
          <span className="text-xs font-bold text-neutral-500">
            Giá tham khảo
          </span>
        </div>

        <div className="divide-y-2 divide-black/10">
          {defaultMenu.map((item, index) => (
            <div
              key={index}
              className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-4"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-bold text-sm sm:text-base text-black">
                    {item.name}
                  </h4>
                  {item.isSignature && (
                    <span className="border border-black bg-black text-white text-[10px] font-bold px-1.5 py-0.2 uppercase">
                      Signature
                    </span>
                  )}
                </div>
                <p className="mt-1 text-xs text-neutral-600 font-medium leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <span className="font-mono text-sm sm:text-base font-black text-black shrink-0 border border-black bg-neutral-100 px-2 py-1 shadow-[2px_2px_0px_#000000]">
                {item.price}
              </span>
            </div>
          ))}
        </div>
      </div>

      {}
      <div className="border-2 border-black bg-neutral-100 p-5 shadow-[4px_4px_0px_#000000]">
        <h4 className="font-black text-xs sm:text-sm text-black uppercase tracking-wider mb-2 flex items-center gap-2">
          <span>💡</span>
          <span>Mẹo Trải Nghiệm Chuẩn Gu</span>
        </h4>
        <ul className="text-xs text-neutral-700 space-y-1.5 list-disc list-inside font-medium leading-relaxed">
          <li>
            Nên ghé quán trước 11:45 trưa hoặc sau 13:00 để tránh xếp hàng chờ
            bàn vào giờ cao điểm.
          </li>
          <li>
            Quán có sẵn bãi đỗ xe máy miễn phí và hỗ trợ hướng dẫn đỗ ô tô gần
            đó.
          </li>
          <li>
            Đừng quên xin thêm một chén mỡ hành tóp mỡ nóng hổi rưới lên cơm tấm
            để tăng độ béo bùi.
          </li>
        </ul>
      </div>
    </div>
  )
}
