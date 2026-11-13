import { UserProfile, ScheduleItem } from "@/types/profile"

export const mockUserProfile: UserProfile = {
  id: "usr_huynhtrinhhuu_01",
  name: "Khách ẩm thực",
  handle: "@khach",
  title: "Khách tham quan",
  avatarUrl: "/img/profile-avatar.png",
  bio: "Đăng nhập để cập nhật tiểu sử ẩm thực của riêng bạn.",
  email: "",
  phone: "",
  locationName: "TP. Hồ Chí Minh",
  joinedYear: "2026",
  followingCount: 0,
  followersCount: 0,
  homeCoordinate: {
    lat: 10.776889,
    lng: 106.700806,
  },
  stats: {
    visitedPlaces: 0,
    reviewsCount: 0,
    upcomingTrips: 0,
    rewardPoints: 0,
  },
  favoriteTags: [
    "Cơm tấm",
    "Bánh mì",
    "Ẩm thực đường phố",
    "Bún bò",
    "Đặc sản Sài Gòn",
    "Cà phê sữa đá",
  ],
}

export const mockScheduleItems: ScheduleItem[] = [
  {
    id: "sch_01",
    placeName: "Phở Gia Truyền Bát Đàn",
    category: "Món nước & Điểm tâm sáng",
    address: "49 Bát Đàn, Cửa Đông, Hoàn Kiếm, Hà Nội",
    date: "2026-10-18",
    time: "07:30",
    status: "completed",
    coordinates: {
      lat: 21.033785,
      lng: 105.847148,
    },
    guestsCount: 2,
    signatureDish: "Phở bò tái nạm gia truyền, quẩy giòn",
    notes:
      "Quán phở truyền thống nổi tiếng phố cổ, nước dùng ngọt thanh ninh từ xương bò, bánh phở tươi dẻo.",
    imageUrl:
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "sch_02",
    placeName: "Cà phê Giảng",
    category: "Cà phê & Đồ uống truyền thống",
    address: "39 Nguyễn Hữu Huân, Lý Thái Tổ, Hoàn Kiếm, Hà Nội",
    date: "2026-10-18",
    time: "09:30",
    status: "completed",
    coordinates: {
      lat: 21.031853,
      lng: 105.855018,
    },
    guestsCount: 2,
    signatureDish: "Cà phê trứng nóng & Ca cao trứng",
    notes:
      "Khởi nguồn của món cà phê trứng trứ danh Hà Nội từ năm 1946, bọt trứng béo ngậy quyện vị đắng cà phê.",
    imageUrl:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "sch_03",
    placeName: "Bún Chả Hương Liên (Bún Chả Obama)",
    category: "Món trưa truyền thống",
    address: "24 Lê Văn Hưu, Phan Chu Trinh, Hai Bà Trưng, Hà Nội",
    date: "2026-10-18",
    time: "12:15",
    status: "in_progress",
    coordinates: {
      lat: 21.018653,
      lng: 105.852441,
    },
    guestsCount: 4,
    signatureDish: "Combo bún chả đặc biệt & nem cua bể giòn rụm",
    notes:
      "Địa điểm từng đón tiếp Tổng thống Barack Obama và đầu bếp Anthony Bourdain năm 2016.",
    imageUrl:
      "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "sch_04",
    placeName: "Chả Cá Lã Vọng",
    category: "Đặc sản di sản Tràng An",
    address: "14 Chả Cá, Hàng Bồ, Hoàn Kiếm, Hà Nội",
    date: "2026-10-18",
    time: "18:45",
    status: "upcoming",
    coordinates: {
      lat: 21.035773,
      lng: 105.850259,
    },
    guestsCount: 3,
    signatureDish: "Chả cá lăng nướng than hoa rán chảo thì là",
    notes:
      "Món ăn di sản hơn 130 năm tuổi tại phố Chả Cá, ăn kèm bún, đậu phộng rang, thì là và mắm tôm chuẩn vị.",
    imageUrl:
      "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "sch_05",
    placeName: "Lẩu Ếch Dũng Béo Lò Đúc",
    category: "Lẩu & Món nhậu Hà Nội",
    address: "115 Lò Đúc, Đống Mác, Hai Bà Trưng, Hà Nội",
    date: "2026-10-19",
    time: "19:00",
    status: "upcoming",
    coordinates: {
      lat: 21.014298,
      lng: 105.857642,
    },
    guestsCount: 5,
    signatureDish: "Lẩu ếch măng cay chua ngọt & da ếch chiên giòn",
    notes:
      "Quán lẩu ếch nức tiếng với đùi ếch xào tía tô giòn thơm và nước dùng măng cay chua thanh đậm đà.",
    imageUrl:
      "https://images.unsplash.com/photo-1547496502-affa22d38842?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "sch_06",
    placeName: "Ốc Nóng Hà Trang (Ốc Đinh Liệt)",
    category: "Món ăn vặt phố cổ về đêm",
    address: "1A Đinh Liệt, Hàng Bạc, Hoàn Kiếm, Hà Nội",
    date: "2026-10-19",
    time: "21:30",
    status: "upcoming",
    coordinates: {
      lat: 21.032644,
      lng: 105.853316,
    },
    guestsCount: 2,
    signatureDish: "Ốc mít luộc lá bưởi & nem chua rán",
    notes:
      "Nổi tiếng với bát nước chấm ốc gừng sả ớt thần thánh, vị cay nồng chuẩn phong cách ăn vặt phố cổ Hà Nội.",
    imageUrl:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=1000&auto=format&fit=crop",
  },
]
