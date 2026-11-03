export interface PlaceDetailData {
  id: string

  city: string

  indexNo: string

  archiveCode: string

  title: string

  image: string

  tags: string[]

  address: string

  time: string

  date: string

  guestsCount: number

  signatureDish: string

  notes: string

  phone: string

  hours: string

  story?: string

  menuItems?: Array<{
    name: string

    price: string

    desc: string

    isSignature?: boolean
  }>
}

export const ARCHIVE_PLACE_DETAILS: Record<string, PlaceDetailData> = {
  "hanoi-bun-cha": {
    id: "hanoi-bun-cha",

    city: "TP. Hà Nội",

    indexNo: "01",

    archiveCode: "archive 016",

    title:
      "Bún Chả Hương Liên | Hương vị bún chả que tre nướng than hoa phố cổ",

    image:
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1000&auto=format&fit=crop&q=80",

    tags: [
      "Chả nướng than",
      "Nước chấm đậm đà",
      "Nem cua bể",
      "Hà Nội xưa",
      "Quán quen phố thị",
    ],

    address: "24 Lê Văn Hưu, Phan Chu Trinh, Hai Bà Trưng, Hà Nội",

    time: "11:30",

    date: "19/10/2026",

    guestsCount: 2,

    signatureDish: "Bún chả que tre nướng than & Nem hải sản đặc biệt",

    notes:
      "Quán bún chả gia truyền nổi tiếng từng vinh dự đón Tổng thống Mỹ Barack Obama năm 2016.",

    phone: "+84 24 3943 4106",

    hours: "08:00 - 20:30 (Mở cửa tất cả các ngày)",

    story:
      "Ra đời từ những năm 1993, Bún Chả Hương Liên giữ trọn vẹn nét văn hóa ẩm thực Thăng Long ngàn năm văn hiến. Từng miếng thịt ba chỉ dọi và thịt băm viên được tẩm ướp hành khô, đường thốt nốt, kẹp vào que tre tươi rồi nướng từ từ trên bếp than hoa rực hồng, mỡ xèo xèo dậy mùi thơm quyến rũ nức cả góc phố Lê Văn Hưu. Bát nước chấm pha chuẩn vị thanh ngọt từ nước hầm xương kết hợp giấm tỏi ớt gia truyền tạo nên hương vị khó quên.",

    menuItems: [
      {
        name: "Combo Bún Chả Đặc Biệt (Combo Obama)",

        price: "120.000 đ",

        desc: "Gồm 1 suất bún chả đầy đặn chả miếng + chả băm, 1 chiếc nem hải sản giòn rụm và 1 chai bia Hà Nội ướp lạnh.",

        isSignature: true,
      },

      {
        name: "Bún Chả Miếng & Chả Băm Than Hoa",

        price: "60.000 đ",

        desc: "Thịt ba chỉ nướng vàng ruộm cùng chả viên đậm đà, ăn kèm bún lá tươi và đĩa rau sống xanh mướt.",

        isSignature: true,
      },

      {
        name: "Nem Cua Bể Hải Phòng",

        price: "30.000 đ/chiếc",

        desc: "Vỏ bánh đa nem giòn tan, nhân đầy ắp thịt cua bể tươi, mộc nhĩ, miến dong thơm lừng.",
      },

      {
        name: "Trà Đá Phố Cổ",

        price: "10.000 đ",

        desc: "Trà xanh Thái Nguyên ủ nóng pha đá thơm chát nhẹ dịu ngọt cuống họng.",
      },
    ],
  },

  "hcm-banh-mi-huynh-hoa": {
    id: "hcm-banh-mi-huynh-hoa",

    city: "TP. Hồ Chí Minh",

    indexNo: "02",

    archiveCode: "archive 015",

    title: "Bánh Mì Huỳnh Hoa | Ổ bánh mì ô môi pate bơ ngập tràn topping",

    image:
      "https://images.unsplash.com/photo-1626804475297-41608ea09aeb?w=1000&auto=format&fit=crop&q=80",

    tags: [
      "Bánh mì Sài Gòn",
      "Pate béo ngậy",
      "Thịt nguội cao cấp",
      "Ăn là no",
      "Hương vị nức tiếng",
    ],

    address: "26 Lê Thị Riêng, Phường Bến Thành, Quận 1, TP. Hồ Chí Minh",

    time: "15:00",

    date: "20/10/2026",

    guestsCount: 2,

    signatureDish: "Bánh mì đặc biệt pate bơ chả lụa thịt nguội thượng hạng",

    notes:
      "Một trong những tiệm bánh mì nổi tiếng và đắt khách bậc nhất trung tâm Sài Gòn.",

    phone: "+84 89 669 8826",

    hours: "13:00 - 23:00 (Nên đến sớm tránh xếp hàng)",

    story:
      "Được mệnh danh là 'ổ bánh mì đắt nhất Sài Gòn' nhưng luôn nườm nượp thực khách xếp hàng, Bánh Mì Huỳnh Hoa tạo nên thương hiệu từ lớp pate gan béo ngậy được phết dày đặc, hòa quyện cùng bơ trứng gà thơm lừng, xếp chồng lên nhau từ 5 đến 7 loại thịt nguội, giò thủ, chả lụa và giăm bông cao cấp. Cắn một miếng bánh mì nóng giòn rụm là bùng nổ hương vị đậm đà không lẫn vào đâu được.",

    menuItems: [
      {
        name: "Bánh Mì Thịt Nguội Đặc Biệt (Full Topping)",

        price: "68.000 đ",

        desc: "Ổ bánh mì nặng gần 400g ngập tràn pate gan béo ngậy, bơ tươi đánh tay, 6 loại thịt nguội, dưa leo và đồ chua giòn ngọt.",

        isSignature: true,
      },

      {
        name: "Bánh Mì Chả Lụa & Jambon",

        price: "55.000 đ",

        desc: "Lựa chọn thanh nhẹ hơn với chả lụa loại 1, jambon nạc và sốt mayonnaise bơ trứng thơm ngon.",
      },

      {
        name: "Hộp Pate Gan Huỳnh Hoa 250g",

        price: "85.000 đ",

        desc: "Pate gan heo và tiêu sọ thơm bùi đóng hộp tiện lợi mang về ăn kèm cơm nóng hoặc bánh mì.",
      },
    ],
  },

  "danang-mi-quang-ba-mua": {
    id: "danang-mi-quang-ba-mua",

    city: "TP. Đà Nẵng",

    indexNo: "03",

    archiveCode: "archive 014",

    title:
      "Mì Quảng Bà Mua | Sợi mì vàng óng tôm thịt trứng cút chuẩn xứ Quảng",

    image:
      "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=1000&auto=format&fit=crop&q=80",

    tags: [
      "Mì Quảng tôm thịt",
      "Bánh tráng nướng",
      "Rau sống tươi",
      "Vị ngon miền Trung",
    ],

    address: "19-21 Trần Bình Trọng, Hải Châu, Đà Nẵng",

    time: "08:00",

    date: "21/10/2026",

    guestsCount: 4,

    signatureDish: "Mì Quảng gà ta tôm thịt & Bánh tráng nướng mè giòn",

    notes:
      "Nước dùng om sánh đậm vị miền Trung, ăn kèm bắp chuối thái mỏng và đậu phộng rang giòn.",

    phone: "+84 98 500 0075",

    hours: "06:30 - 22:00 hàng ngày",
  },

  "hue-bun-bo-ba-tuyet": {
    id: "hue-bun-bo-ba-tuyet",

    city: "Tỉnh Thừa Thiên Huế",

    indexNo: "04",

    archiveCode: "archive 016",

    title:
      "Bún Bò Huế Bà Tuyết | Nước dùng cay nồng hương sả ruốc đậm đà cố đô",

    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80",

    tags: [
      "Bún bò giò heo",
      "Chả cua Huế",
      "Nước dùng cay nồng",
      "Hương vị cố đô",
    ],

    address: "47 Nguyễn Công Trứ, Phú Hội, TP. Huế",

    time: "07:00",

    date: "22/10/2026",

    guestsCount: 3,

    signatureDish: "Bún bò giò heo chả cua huyết mềm mọng nước dùng cay nồng",

    notes:
      "Quán gia truyền hơn 30 năm, chỉ bán buổi sáng đến khoảng 11h là hết sớm.",

    phone: "+84 234 384 5678",

    hours: "06:00 - 11:00 (Nên đến trước 09:30)",
  },

  "dalat-banh-can-le": {
    id: "dalat-banh-can-le",

    city: "TP. Đà Lạt",

    indexNo: "05",

    archiveCode: "archive 013",

    title: "Bánh Căn Lệ Đà Lạt | Vỏ giòn nhân trứng lòng đào xíu mại cay thơm",

    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80",

    tags: [
      "Bánh căn xíu mại",
      "Trứng lòng đào",
      "Nước chấm mỡ hành",
      "Ấm áp phố sương",
    ],

    address: "27/44 Yersin, Phường 10, TP. Đà Lạt, Lâm Đồng",

    time: "16:30",

    date: "23/10/2026",

    guestsCount: 2,

    signatureDish: "Bánh căn trứng cút lòng đào xíu mại cay ấm bụng",

    notes:
      "Nằm trong con dốc nhỏ thơ mộng, không khí se lạnh ăn bánh căn nóng hổi cực hợp.",

    phone: "+84 93 324 5678",

    hours: "07:00 - 17:00 (Đông nhất lúc xế chiều)",
  },

  "nhatrang-nem-nuong-dang-van-quyen": {
    id: "nhatrang-nem-nuong-dang-van-quyen",

    city: "TP. Nha Trang",

    indexNo: "06",

    archiveCode: "archive 012",

    title:
      "Nem Nướng Đặng Văn Quyên | Cuộn tròn vị ngon bánh tráng chấm tương đậu ngọt bùi",

    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1000&auto=format&fit=crop&q=80",

    tags: [
      "Nem nướng than hoa",
      "Nước chấm tương nếp",
      "Bánh tráng chiên giòn",
      "Đặc sản biển",
    ],

    address: "16A Lãn Ông, Xương Huân, TP. Nha Trang, Khánh Hòa",

    time: "18:00",

    date: "24/10/2026",

    guestsCount: 4,

    signatureDish: "Nem nướng than cuộn bánh tráng chiên giòn chấm sốt gan đậu",

    notes:
      "Sốt chấm vàng cam ấm nóng béo bùi bí truyền là linh hồn của món ăn.",

    phone: "+84 258 382 8228",

    hours: "07:30 - 21:30 cả ngày",
  },

  "cantho-banh-cong-co-ut": {
    id: "cantho-banh-cong-co-ut",

    city: "TP. Cần Thơ",

    indexNo: "07",

    archiveCode: "archive 009",

    title:
      "Bánh Cống Cô Út | Vàng ruộm nhân đậu xanh thịt băm tôm tươi sông Hậu",

    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80",

    tags: [
      "Bánh cống giòn tan",
      "Tôm sông tươi rói",
      "Rau rừng miền Tây",
      "Nước mắm chua ngọt",
    ],

    address: "86/38 Lý Tự Trọng, An Cư, Ninh Kiều, Cần Thơ",

    time: "16:00",

    date: "25/10/2026",

    guestsCount: 2,

    signatureDish: "Bánh cống tôm sông đậu xanh giòn tan cuốn rau rừng",

    notes:
      "Bánh chiên ngập dầu nhưng ráo mỡ, ăn kèm đĩa rau rừng miền Tây tươi tốt.",

    phone: "+84 292 383 1234",

    hours: "09:00 - 21:00",
  },

  "phuquoc-bun-quay-kien-xay": {
    id: "phuquoc-bun-quay-kien-xay",

    city: "TP. Phú Quốc",

    indexNo: "08",

    archiveCode: "archive 008",

    title: "Bún Quậy Kiến Xây | Chả tôm cá tươi quậy nóng hổi tự pha nước chấm",

    image:
      "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=1000&auto=format&fit=crop&q=80",

    tags: [
      "Bún quậy tươi sống",
      "Chả mực chả tôm",
      "Nước chấm tự pha",
      "Ẩm thực đảo ngọc",
    ],

    address: "28 Đường Bạch Đằng, Phường Dương Đông, Phú Quốc, Kiên Giang",

    time: "19:00",

    date: "26/10/2026",

    guestsCount: 3,

    signatureDish: "Bún quậy tôm mực cá tươi ép nóng hổi tại quầy",

    notes:
      "Khách tự tay quậy chén nước chấm muối, bột ngọt, ớt tươi và quất theo khẩu vị riêng.",

    phone: "+84 838 718 714",

    hours: "07:00 - 22:30",
  },

  "haiphong-banh-da-cua-ba-cu": {
    id: "haiphong-banh-da-cua-ba-cu",

    city: "TP. Hải Phòng",

    indexNo: "09",

    archiveCode: "archive 007",

    title:
      "Bánh Đa Cua Bà Cụ | Sợi bánh đỏ gạch cua đồng rau muống giòn giòn đất Cảng",

    image:
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1000&auto=format&fit=crop&q=80",

    tags: [
      "Bánh đa đỏ",
      "Chả lá lốt chả cá",
      "Gạch cua béo ngậy",
      "Đặc sản đất Cảng",
    ],

    address: "179 Cầu Đất, Quận Ngô Quyền, TP. Hải Phòng",

    time: "12:00",

    date: "27/10/2026",

    guestsCount: 2,

    signatureDish: "Bánh đa cua bể & cua đồng thập cẩm chả lá lốt giòn rụm",

    notes:
      "Nổi tiếng với sợi bánh đa đỏ dẻo dai sản xuất truyền thống tại làng Dư Hàng Kênh.",

    phone: "+84 90 466 6053",

    hours: "07:00 - 22:00",
  },

  "quangninh-cha-muc-thoan": {
    id: "quangninh-cha-muc-thoan",

    city: "Tỉnh Quảng Ninh",

    indexNo: "10",

    archiveCode: "archive 006",

    title:
      "Chả Mực Thoan Hạ Long | Giã tay giòn sần sật vàng óng thơm lừng phố biển",

    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80",

    tags: [
      "Chả mực giã tay",
      "Hạ Long phố biển",
      "Ăn kèm xôi trắng",
      "Hương vị biển khơi",
    ],

    address: "Kiot 36-37 chợ Hạ Long 1, TP. Hạ Long, Quảng Ninh",

    time: "09:00",

    date: "28/10/2026",

    guestsCount: 2,

    signatureDish:
      "Chả mực nang giã cối tay vàng ruộm ăn kèm xôi trắng thơm dẻo",

    notes: "Thương hiệu chả mực giã tay lừng danh nhất vùng vịnh Hạ Long.",

    phone: "+84 203 362 5888",

    hours: "06:00 - 18:00",
  },

  "ninhbinh-de-nui-chinh-thu": {
    id: "ninhbinh-de-nui-chinh-thu",

    city: "Tỉnh Ninh Bình",

    indexNo: "11",

    archiveCode: "archive 005",

    title:
      "Dê Núi Chính Thư | Thịt dê tái chanh thơm nức ăn cùng cơm cháy giòn rụm",

    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80",

    tags: [
      "Dê núi tái chanh",
      "Cơm cháy Ninh Bình",
      "Tương bần đậm đà",
      "Ẩm thực cố đô xưa",
    ],

    address: "Thôn Khê Thượng, Xã Ninh Xuân, Huyện Hoa Lư, Ninh Bình",

    time: "12:30",

    date: "29/10/2026",

    guestsCount: 4,

    signatureDish:
      "Dê tái chanh, dê nướng tảng ăn cùng cơm cháy nước sốt tim cật",

    notes:
      "Dê chăn thả tự nhiên trên các vách núi đá vôi Tràng An nên thịt rất săn chắc và thơm ngọt.",

    phone: "+84 94 842 0888",

    hours: "08:00 - 22:00",
  },

  "hoian-cao-lau-thanh": {
    id: "hoian-cao-lau-thanh",

    city: "TP. Hội An",

    indexNo: "12",

    archiveCode: "archive 003",

    title:
      "Cao Lầu Thanh | Sợi mì dai giòn thịt xá xíu thơm lừng nước giếng Bá Lễ",

    image:
      "https://images.unsplash.com/photo-1569058242253-92a9c755a0ec?w=1000&auto=format&fit=crop&q=80",

    tags: [
      "Cao lầu thịt xá xíu",
      "Tép mỡ giòn rụm",
      "Rau Trà Quế",
      "Phố cổ Hội An",
    ],

    address: "26 Thái Phiên, Phường Minh An, TP. Hội An, Quảng Nam",

    time: "11:00",

    date: "30/10/2026",

    guestsCount: 2,

    signatureDish: "Cao lầu thịt xá xíu rim nước tương đậm đà rau sống Trà Quế",

    notes:
      "Nước ngâm gạo nấu mì lấy từ giếng cổ Bá Lễ, tro củi Cù Lao Chàm tạo nên sợi mì độc nhất vô nhị.",

    phone: "+84 235 386 2888",

    hours: "07:00 - 19:00",
  },

  "hcm-com-tam": {
    id: "hcm-com-tam",

    city: "TP. Hồ Chí Minh",

    indexNo: "02",

    archiveCode: "archive 015",

    title: "Cơm Tấm Ba Ghiền | Sườn nướng than hồng chuẩn vị Sài Gòn",

    image:
      "https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&auto=format&fit=crop&q=80",

    tags: [
      "Sườn nướng mật ong",
      "Sườn bì chả",
      "Ăn đêm Sài Gòn",
      "Quán quen phố thị",
    ],

    address: "84 Đặng Văn Ngữ, Phường 10, Quận Phú Nhuận, TP. Hồ Chí Minh",

    time: "12:15",

    date: "18/10/2026",

    guestsCount: 4,

    signatureDish: "Cơm tấm sườn cây nướng mật ong than hoa & Canh rong biển",

    notes:
      "Miếng sườn cốt lết to che kín mặt đĩa nướng xèo xèo thơm nức cả góc phố Đặng Văn Ngữ.",

    phone: "+84 28 3846 1073",

    hours: "06:30 - 21:30 (Mở cửa cả ngày)",
  },

  "hanoi-pho-bat-dan": {
    id: "hanoi-pho-bat-dan",

    city: "TP. Hà Nội",

    indexNo: "01",

    archiveCode: "archive 001",

    title: "Phở Bát Đàn | Tinh hoa phở bò phố cổ trăm năm",

    image:
      "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=1000&auto=format&fit=crop&q=80",

    tags: ["Phở bò tái lăn", "Nước dùng thanh", "Phố cổ Hà Nội"],

    address: "49 Bát Đàn, Cửa Đông, Hoàn Kiếm, Hà Nội",

    time: "07:30",

    date: "18/10/2026",

    guestsCount: 2,

    signatureDish: "Phở bò tái nạm gia truyền, quẩy giòn",

    notes:
      "Nước dùng ngọt sâu từ xương bò hầm tự nhiên không mì chính, bánh phở tươi mỏng dẻo.",

    phone: "+84 24 3825 1234",

    hours: "06:00 - 10:30 & 18:00 - 20:30",
  },

  "dalat-lau-ga-la-e": {
    id: "dalat-lau-ga-la-e",

    city: "TP. Đà Lạt",

    indexNo: "05",

    archiveCode: "archive 004",

    title: "Lẩu Gà Lá É Tao Ngộ | Nồi lẩu nóng hổi giữa sương mù phố núi",

    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&auto=format&fit=crop&q=80",

    tags: ["Lẩu gà lá é", "Ẩm thực phố núi", "Ấm lòng ngày đông"],

    address: "Số 5 Đường 3 Tháng 4, Phường 3, TP. Đà Lạt, Lâm Đồng",

    time: "18:30",

    date: "20/10/2026",

    guestsCount: 4,

    signatureDish: "Lẩu gà đồi lá é cay nồng măng tươi và ớt xiêm xanh",

    notes:
      "Nước lẩu ngọt thanh từ thịt gà ta đồi thả vườn và vị cay cay the mát của lá é vùng cao nguyên.",

    phone: "+84 97 714 5678",

    hours: "08:00 - 22:00",
  },

  "danang-banh-xeo-ba-duong": {
    id: "danang-banh-xeo-ba-duong",

    city: "TP. Đà Nẵng",

    indexNo: "03",

    archiveCode: "archive 002",

    title: "Bánh Xèo & Nem Lụi Bà Dưỡng | Đậm đà nước chấm gan heo béo bùi",

    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=1000&auto=format&fit=crop&q=80",

    tags: [
      "Bánh xèo giòn rụm",
      "Nem lụi nướng than",
      "Nước chấm đặc biệt",
      "Món ngon miền Trung",
    ],

    address: "K280/23 Hoàng Diệu, Bình Hiên, Hải Châu, Đà Nẵng",

    time: "17:00",

    date: "21/10/2026",

    guestsCount: 3,

    signatureDish: "Bánh xèo vỏ giòn tôm nhảy & Nem lụi nướng chấm sốt gan nếp",

    notes:
      "Nằm sâu trong con hẻm nhỏ đường Hoàng Diệu nhưng lúc nào cũng tấp nập thực khách sành ăn.",

    phone: "+84 236 387 3168",

    hours: "09:00 - 21:30",
  },
}
