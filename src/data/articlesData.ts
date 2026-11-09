import type { Article } from "@/types/article"

export const ARTICLES_DATA: Article[] = [
  {
    id: "tinh-hoa-sushi-sakura",
    slug: "tinh-hoa-sushi-sakura",
    title: "Nghệ Thuật Ẩm Thực Omakase & Hương Vị Cá Hồi Tươi Sống Tại Sakura",
    excerpt:
      "Khám phá hành trình tạo nên từng miếng Nigiri hoàn hảo với kỹ thuật dùng dao điêu luyện của các đầu bếp xứ Phù Tang ngay giữa lòng Sài Gòn.",
    content: [
      "Ẩm thực Nhật Bản từ lâu đã nổi tiếng với triết lý tôn trọng vị nguyên bản của nguyên liệu tươi ngon nhất. Tại Sakura Japanese Restaurant, mỗi lát sashimi cá hồi Na Uy hay cá ngừ đại dương đều được xử lý ở nhiệt độ chuẩn xác để giữ trọn vẹn từng thớ mỡ béo ngậy tan chảy trên đầu lưỡi.",
      "Không gian quán mang đậm phong cách truyền thống với vách gỗ Shoji ấm cúng và ánh đèn vàng dịu nhẹ. Ngồi tại quầy sushi bar, thực khách có thể tận mắt chiêm ngưỡng bàn tay tài hoa của bếp trưởng khi thoăn thoắt nặn từng viên cơm giấm Akasu dẻo thơm kết hợp cùng hải sản tươi rói vừa cập bến mỗi sáng.",
      "Đặc biệt, món lẩu Sukiyaki bò Wagyu thượng hạng với nước dùng ngọt thanh từ đậu nành lên men và rau củ hữu cơ chắc chắn sẽ làm xiêu lòng bất kỳ tín đồ mê đồ Nhật nào trong những ngày mưa lất phất của thành phố.",
    ],
    quote: {
      text: "Ẩm thực Nhật Bản không chỉ là món ăn để lấp đầy dạ dày, mà là một bức tranh tĩnh lặng tôn vinh sự tinh khiết của tự nhiên.",
      author: "Bếp trưởng Kenji - Sakura Restaurant",
    },
    coverImage: "/img/sakura-restaurant.jpg",
    category: "review",
    categoryLabel: "Review Quán",
    tags: ["Sushi", "Ẩm thực Nhật", "Omakase", "Sashimi"],
    author: {
      name: "Minh Thư (Foodie)",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      role: "Biên tập viên ẩm thực",
    },
    publishedAt: "12/11/2026",
    readTime: "5 phút đọc",
    relatedPlaceId: "sakura-restaurant",
    views: 1840,
    likes: 142,
    featured: true,
  },
  {
    id: "goc-hen-ho-luna-cafe",
    slug: "goc-hen-ho-luna-cafe",
    title: "Buổi Chiều Hoàng Hôn Lãng Mạn Tại Luna Cafe & Bistro Quận 1",
    excerpt:
      "Tọa lạc trên con phố rợp bóng mát, Luna Cafe đem đến góc hẹn hò lý tưởng cho các cặp đôi với tách Cold Brew hoa hồng và món Steak sốt tiêu đen tuyệt hảo.",
    content: [
      "Nếu bạn đang tìm kiếm một địa điểm hẹn hò vừa riêng tư vừa tinh tế cho dịp cuối tuần, Luna Cafe & Bistro chính là câu trả lời xứng đáng nhất. Bước qua cánh cửa vòm phong cách Paris cổ điển, hương cà phê rang mộc quyện cùng hương bánh sừng bò nướng bơ ngào ngạt sẽ lập tức xua tan đi sự ồn ào của phố thị.",
      "Góc bàn cạnh cửa sổ kính lớn hướng ra ban công hoa giấy là vị trí đắc địa nhất. Khi ánh hoàng hôn buông xuống, những ngọn nến lung linh được thắp lên, biến bữa tối của bạn và người thương thành khoảnh khắc điện ảnh khó quên.",
      "Thực đơn của quán kết hợp hài hòa giữa các dòng cà phê thủ công Pour-over và ẩm thực Bistro Âu hiện đại. Đừng quên thử món Mỳ Ý sốt kem Truffle và bánh Tart trứng béo ngậy trứ danh nhé!",
    ],
    quote: {
      text: "Một tách cà phê ngon giữa không gian đầy ánh sáng ấm áp chính là chất xúc tác ngọt ngào nhất cho mọi câu chuyện tình yêu.",
      author: "Luna Bistro Story",
    },
    coverImage: "/img/luna-cafe.jpg",
    category: "couple",
    categoryLabel: "Hẹn Hò & Tụ Họp",
    tags: ["Café", "Hẹn hò", "Bistro Âu", "Quận 1"],
    author: {
      name: "Hoàng Nam",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      role: "Reviewer đời sống",
    },
    publishedAt: "10/11/2026",
    readTime: "4 phút đọc",
    relatedPlaceId: "luna-cafe",
    views: 2420,
    likes: 215,
    featured: false,
  },
  {
    id: "dem-khong-ngu-bui-vien",
    slug: "dem-khong-ngu-bui-vien",
    title: "Khám Phá Thiên Đường Ẩm Thực Đường Phố Không Ngủ Tại Phố Bùi Viện",
    excerpt:
      "Âm nhạc sôi động, khói nướng nghi ngút và những món nhắm dân dã đậm chất hè phố đã tạo nên nhịp sống rực rỡ nhất về đêm của giới trẻ Sài Thành.",
    content: [
      "Khi màn đêm buông xuống và những ánh đèn neon bật sáng rực rỡ, con phố Bùi Viện lại bừng tỉnh với nguồn năng lượng cuồng nhiệt không đâu sánh bằng. Đây không chỉ là nơi gặp gỡ của bạn bè bốn phương mà còn là thiên đường của các món ăn vặt đường phố siêu cuốn.",
      "Từ những que xiên nướng sa tế cay nồng bốc khói, ốc hương sốt trứng muối béo ngậy cho đến món bánh tráng nướng Đà Lạt giòn rụm với trứng cút và mỡ hành, mọi giác quan của bạn sẽ được đánh thức trọn vẹn.",
      "Cảm giác ngồi bên chiếc bàn nhựa con con, nâng ly bia mát lạnh cùng bạn bè và đắm chìm trong tiếng cười nói náo nhiệt chính là trải nghiệm văn hóa đường phố đặc trưng nhất của Sài Gòn.",
    ],
    coverImage: "/img/bui-vien.jpg",
    category: "culture",
    categoryLabel: "Văn Hóa Ẩm Thực",
    tags: ["Đường phố", "Ăn đêm", "Sài Gòn", "Bùi Viện"],
    author: {
      name: "Lê Cường",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      role: "Nhiếp ảnh & Ẩm thực",
    },
    publishedAt: "08/11/2026",
    readTime: "6 phút đọc",
    relatedPlaceId: "bui-vien",
    views: 3100,
    likes: 289,
    featured: false,
  },
  {
    id: "tiec-san-vuon-riverside",
    slug: "tiec-san-vuon-riverside",
    title:
      "Thưởng Thức Hải Sản Tươi Ngon Giữa Khu Vườn Ven Sông Riverside Garden",
    excerpt:
      "Không gian sinh thái xanh mát nép mình bên dòng sông lộng gió, nơi các món hải sản nướng than và ẩm thực đồng quê đưa bạn rời xa khói bụi ngột ngạt.",
    content: [
      "Chỉ cách trung tâm thành phố 20 phút di chuyển, Riverside Garden mang lại bầu không khí trong lành tựa như một góc miệt vườn Nam Bộ thu nhỏ. Khuôn viên rộng mở với những rặng dừa nước và thảm cỏ xanh mướt là chốn dừng chân hoàn hảo cho những bữa tiệc gia đình ấm cúng.",
      "Thực đơn của nhà hàng nổi tiếng với nguồn hải sản tươi sống được chọn lọc trong ngày: tôm càng xanh nướng mọi giữ trọn vị ngọt tự nhiên, cua biển sốt me chua cay đậm đà, và cá lóc đồng nướng trui cuốn bánh tráng rau rừng thơm phức.",
      "Vào buổi chiều tà, vừa thưởng thức món ngon vừa ngắm nhìn những chiếc tàu bè chầm chậm lướt qua trên sông sẽ đem lại cảm giác thư thái vô cùng trọn vẹn.",
    ],
    coverImage: "/img/riverside-garden.jpg",
    category: "guide",
    categoryLabel: "Cẩm Nang Ăn Uống",
    tags: ["Hải sản", "Sân vườn", "View sông", "Gia đình"],
    author: {
      name: "Thảo Vy",
      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
      role: "Blogger du lịch",
    },
    publishedAt: "05/11/2026",
    readTime: "5 phút đọc",
    relatedPlaceId: "riverside-garden",
    views: 1980,
    likes: 176,
    featured: false,
  },
  {
    id: "pho-bat-dan-pho-co",
    slug: "pho-bat-dan-pho-co",
    title: "Phở Bát Đàn: Giữ Trọn Hồn Cốt Bát Phở Bò Tái Lăn Trăm Năm Phố Cổ",
    excerpt:
      "Xếp hàng chờ đợi một bát phở nóng hổi với nước dùng trong veo, thơm nức mùi gừng nướng và hoa hồi là một nét phong vị văn hóa khó phai của người Tràng An.",
    content: [
      "Người Hà Nội ăn phở không chỉ để no, mà còn để thưởng thức cái tinh túy của một nếp sống lâu đời. Giữa hàng trăm quán phở mọc lên khắp nơi, quán phở gia truyền trên phố Bát Đàn vẫn giữ nguyên phong thái giản dị: thực khách tự xếp hàng, tự bưng bát phở bốc khói nghi ngút về bàn.",
      "Điểm làm nên linh hồn của bát phở nơi đây chính là nồi nước dùng ninh từ xương bò suốt hơn mười tiếng đồng hồ mà không hề lạm dụng bột ngọt. Nước phở ngọt sâu, trong vắt, sóng sánh lớp mỡ vàng ươm, dậy lên mùi gừng nướng, thảo quả và hành hoa chẻ nhỏ tươi roi rói.",
      "Thịt bò tái được băm nhanh tay trên thớt gỗ nghiến, đảo lăn qua chảo mỡ sôi sùng sục rồi trút ngay lên lớp bánh phở mềm mướt. Thêm một chút giấm tỏi ớt ớt tươi cay xè cùng chiếc quẩy giòn tan, bữa sáng mùa đông Hà Nội bỗng trở nên ấm áp lạ kỳ.",
    ],
    quote: {
      text: "Bát phở ngon là bát phở gợi nhớ về ký ức. Hương vị ngọt thanh của nước hầm xương sẽ còn đọng mãi nơi cuống họng dù năm tháng có trôi qua.",
      author: "Nghệ nhân Phở Hà Nội",
    },
    coverImage: "/img/pho-thin.png",
    category: "culture",
    categoryLabel: "Văn Hóa Ẩm Thực",
    tags: ["Phở Hà Nội", "Món xưa", "Phố cổ", "Đặc sản"],
    author: {
      name: "Minh Thư (Foodie)",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      role: "Biên tập viên ẩm thực",
    },
    publishedAt: "01/11/2026",
    readTime: "7 phút đọc",
    relatedPlaceId: "hanoi-bun-cha",
    views: 4500,
    likes: 430,
    featured: false,
  },
  {
    id: "ramen-nhat-ban-chuan-vi",
    slug: "ramen-nhat-ban-chuan-vi",
    title: "Bí Mật Của Nồi Nước Dùng Tonkotsu Hầm 18 Tiếng Trong Món Mì Ramen",
    excerpt:
      "Từ sợi mì lúa mạch dai giòn đến quả trứng ngâm tương Ajitama lòng đào dẻo quánh, điều gì làm nên sức hút mãnh liệt của tô mì ramen chuẩn vị?",
    content: [
      "Mì Ramen không đơn thuần là món ăn nhanh, mà là một biểu tượng ẩm thực được tôi luyện qua hàng thập kỷ sáng tạo không ngừng nghỉ của các nghệ nhân Nhật Bản.",
      "Để có được bát nước súp Tonkotsu béo ngậy trắng đục như sữa, xương ống heo phải được ninh liên tục ở nhiệt độ sôi sùng sục trong 18 giờ liền nhằm chiết xuất toàn bộ lượng collagen và tủy xương quý giá.",
      "Khi kết hợp cùng từng sợi mì tự làm đạt độ chín Al Dente, vài lát thịt heo Chashu cuộn tròn nướng xém cạnh thơm phức và rong biển Nori giòn rụm, mỗi muỗng súp đều là một sự bùng nổ hương vị đậm đà khó cưỡng.",
    ],
    coverImage: "/img/ichiran-ramen.png",
    category: "review",
    categoryLabel: "Review Quán",
    tags: ["Ramen", "Tonkotsu", "Ẩm thực Nhật", "Mì Nhật"],
    author: {
      name: "Hoàng Nam",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      role: "Reviewer đời sống",
    },
    publishedAt: "28/10/2026",
    readTime: "5 phút đọc",
    relatedPlaceId: "sakura-restaurant",
    views: 2890,
    likes: 245,
    featured: false,
  },
]

export function getAllArticles(): Article[] {
  return ARTICLES_DATA
}

export function getFeaturedArticle(): Article {
  return ARTICLES_DATA.find((a) => a.featured) || ARTICLES_DATA[0]
}

export function getArticleById(id: string): Article | undefined {
  return ARTICLES_DATA.find((a) => a.id === id || a.slug === id)
}

export function getRelatedArticles(
  currentId: string,
  category?: string,
  limit = 3,
): Article[] {
  const others = ARTICLES_DATA.filter((a) => a.id !== currentId)
  if (category && category !== "all") {
    const sameCat = others.filter((a) => a.category === category)
    if (sameCat.length >= limit) return sameCat.slice(0, limit)
  }
  return others.slice(0, limit)
}
