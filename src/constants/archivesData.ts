import {
  imgImg1592Jpg1,
  imgImg5097F09F8C9FScaledJpeg,
  imgImg3206ScaledJpg,
  imgLineAlbum22071822800X5331Jpg,
  imgContainer,
  imgContainer1,
  imgContainer2,
  imgContainer3,
  imgContainer4,
  imgContainer5,
  imgContainer6,
  imgContainer7,
  imgContainer8,
} from "@/constants/assets"

export interface HeroSlide {
  id: number

  city: string

  title: string

  image: string

  tags: string[]
}

export const HERO_SLIDES: HeroSlide[] = [
  {
    id: 0,

    city: "TP. Hà Nội",

    title: "Phở Bát Đàn | Tinh hoa phở bò phố cổ trăm năm",

    image: imgImg1592Jpg1,

    tags: ["Phở bò tái lăn", "Nước dùng thanh", "Phố cổ Hà Nội"],
  },

  {
    id: 1,

    city: "TP. Hồ Chí Minh",

    title: "Cơm Tấm Ba Ghiền | Sườn nướng than hồng chuẩn vị Sài Gòn",

    image: imgImg5097F09F8C9FScaledJpeg,

    tags: [
      "Sườn bì chả",

      "Ăn đêm Sài Gòn",

      "Hương vị Nam Bộ",

      "Ngon nức tiếng",

      "Quán quen phố thị",
    ],
  },

  {
    id: 2,

    city: "TP. Đà Lạt",

    title: "Lẩu Gà Lá É Tao Ngộ | Nồi lẩu nóng hổi giữa sương mù phố núi",

    image: imgImg3206ScaledJpg,

    tags: ["Lẩu gà lá é", "Ẩm thực phố núi", "Ấm lòng ngày đông"],
  },

  {
    id: 3,

    city: "TP. Đà Nẵng",

    title: "Bánh Xèo & Nem Lụi Bà Dưỡng | Đậm đà nước chấm gan heo béo bùi",

    image: imgLineAlbum22071822800X5331Jpg,

    tags: [
      "Bánh xèo giòn rụm",

      "Nem lụi nướng than",

      "Nước chấm đặc biệt",

      "Món ngon miền Trung",

      "Chợ Cồn Đà Nẵng",
    ],
  },
]

export interface ArchiveItem {
  id: string

  index: string

  archiveNo: string

  city: string

  title: string

  image: string

  tags: string[]
}

export const ARCHIVE_ITEMS: ArchiveItem[] = [
  {
    id: "hanoi-bun-cha",

    index: "01",

    archiveNo: "Archive 016",

    city: "TP. Hà Nội",

    title:
      "Bún Chả Hương Liên | Hương vị bún chả que tre nướng than hoa phố cổ",

    image: imgImg3206ScaledJpg,

    tags: [
      "Chả nướng than",

      "Nước chấm đậm đà",

      "Nem cua bể",

      "Hà Nội xưa",

      "Quán quen phố thị",
    ],
  },

  {
    id: "hcm-banh-mi-huynh-hoa",

    index: "02",

    archiveNo: "Archive 015",

    city: "TP. Hồ Chí Minh",

    title: "Bánh Mì Huỳnh Hoa | Ổ bánh mì ô môi pate bơ ngập tràn topping",

    image: imgContainer,

    tags: [
      "Bánh mì Sài Gòn",

      "Pate béo ngậy",

      "Thịt nguội cao cấp",

      "Ăn là no",

      "Hương vị nức tiếng",
    ],
  },

  {
    id: "danang-mi-quang-ba-mua",

    index: "03",

    archiveNo: "Archive 014",

    city: "TP. Đà Nẵng",

    title:
      "Mì Quảng Bà Mua | Sợi mì vàng óng tôm thịt trứng cút chuẩn xứ Quảng",

    image: imgContainer1,

    tags: [
      "Mì Quảng tôm thịt",

      "Bánh tráng nướng",

      "Rau sống tươi",

      "Vị ngon miền Trung",
    ],
  },

  {
    id: "hue-bun-bo-ba-tuyet",

    index: "04",

    archiveNo: "Archive 016",

    city: "Tỉnh Thừa Thiên Huế",

    title:
      "Bún Bò Huế Bà Tuyết | Nước dùng cay nồng hương sả ruốc đậm đà cố đô",

    image: imgContainer2,

    tags: [
      "Bún bò giò heo",

      "Chả cua Huế",

      "Nước dùng cay nồng",

      "Hương vị cố đô",
    ],
  },

  {
    id: "dalat-banh-can-le",

    index: "05",

    archiveNo: "Archive 013",

    city: "TP. Đà Lạt",

    title: "Bánh Căn Lệ Đà Lạt | Vỏ giòn nhân trứng lòng đào xíu mại cay thơm",

    image: imgContainer3,

    tags: [
      "Bánh căn xíu mại",

      "Trứng lòng đào",

      "Nước chấm mỡ hành",

      "Ấm áp phố sương",
    ],
  },

  {
    id: "nhatrang-nem-nuong-dang-van-quyen",

    index: "06",

    archiveNo: "Archive 012",

    city: "TP. Nha Trang",

    title:
      "Nem Nướng Đặng Văn Quyên | Cuộn tròn vị ngon bánh tráng chấm tương đậu ngọt bùi",

    image: imgContainer4,

    tags: [
      "Nem nướng than hoa",

      "Nước chấm tương nếp",

      "Bánh tráng chiên giòn",

      "Đặc sản biển",
    ],
  },

  {
    id: "cantho-banh-cong-co-ut",

    index: "07",

    archiveNo: "Archive 009",

    city: "TP. Cần Thơ",

    title:
      "Bánh Cống Cô Út | Vàng ruộm nhân đậu xanh thịt băm tôm tươi sông Hậu",

    image: imgContainer5,

    tags: [
      "Bánh cống giòn tan",

      "Tôm sông tươi rói",

      "Rau rừng miền Tây",

      "Nước mắm chua ngọt",
    ],
  },

  {
    id: "phuquoc-bun-quay-kien-xay",

    index: "08",

    archiveNo: "Archive 008",

    city: "TP. Phú Quốc",

    title: "Bún Quậy Kiến Xây | Chả tôm cá tươi quậy nóng hổi tự pha nước chấm",

    image: imgContainer6,

    tags: [
      "Bún quậy tươi sống",

      "Chả mực chả tôm",

      "Nước chấm tự pha",

      "Ẩm thực đảo ngọc",
    ],
  },

  {
    id: "haiphong-banh-da-cua-ba-cu",

    index: "09",

    archiveNo: "Archive 007",

    city: "TP. Hải Phòng",

    title:
      "Bánh Đa Cua Bà Cụ | Sợi bánh đỏ gạch cua đồng rau muống giòn giòn đất Cảng",

    image: imgContainer7,

    tags: [
      "Bánh đa đỏ",

      "Chả lá lốt chả cá",

      "Gạch cua béo ngậy",

      "Đặc sản đất Cảng",
    ],
  },

  {
    id: "quangninh-cha-muc-thoan",

    index: "10",

    archiveNo: "Archive 006",

    city: "Tỉnh Quảng Ninh",

    title:
      "Chả Mực Thoan Hạ Long | Giã tay giòn sần sật vàng óng thơm lừng phố biển",

    image: imgContainer8,

    tags: [
      "Chả mực giã tay",

      "Hạ Long phố biển",

      "Ăn kèm xôi trắng",

      "Hương vị biển khơi",
    ],
  },

  {
    id: "ninhbinh-de-nui-chinh-thu",

    index: "11",

    archiveNo: "Archive 005",

    city: "Tỉnh Ninh Bình",

    title:
      "Dê Núi Chính Thư | Thịt dê tái chanh thơm nức ăn cùng cơm cháy giòn rụm",

    image: imgImg1592Jpg1,

    tags: [
      "Dê núi tái chanh",

      "Cơm cháy Ninh Bình",

      "Tương bần đậm đà",

      "Ẩm thực cố đô xưa",
    ],
  },

  {
    id: "hoian-cao-lau-thanh",

    index: "12",

    archiveNo: "Archive 003",

    city: "TP. Hội An",

    title:
      "Cao Lầu Thanh | Sợi mì dai giòn thịt xá xíu thơm lừng nước giếng Bá Lễ",

    image: imgImg5097F09F8C9FScaledJpeg,

    tags: [
      "Cao lầu thịt xá xíu",

      "Tép mỡ giòn rụm",

      "Rau Trà Quế",

      "Phố cổ Hội An",
    ],
  },
]
