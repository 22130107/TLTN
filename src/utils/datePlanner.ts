import {
  calculateDistanceKm,
  formatDistanceText,
  getDistrictCoordinates,
} from "./geolocation"
import type {
  BudgetTier,
  BudgetTierId,
  DatePlanOption,
  DatePlanPreferences,
  DatePlanStop,
  PlannerPlaceItem,
} from "@/types/planner"

export const BUDGET_TIERS: BudgetTier[] = [
  {
    id: "budget-student",
    label: "Sinh Viên / Tiết Kiệm",
    subtitle: "Quán vỉa hè, trà chanh, ăn vặt",
    rangeText: "< 150.000đ / người",
    minPricePerPerson: 30000,
    maxPricePerPerson: 150000,
    icon: "🍙",
    color: "bg-emerald-50 text-emerald-800 border-emerald-300",
  },
  {
    id: "budget-casual",
    label: "Hẹn Hò / Vừa Vặn",
    subtitle: "Quán ăn ấm cúng, cafe xinh",
    rangeText: "150.000đ - 350.000đ / người",
    minPricePerPerson: 150000,
    maxPricePerPerson: 350000,
    icon: "🍕",
    color: "bg-amber-50 text-amber-800 border-amber-300",
  },
  {
    id: "budget-romantic",
    label: "Lãng Mạn / Phong Cách",
    subtitle: "Nhà hàng ấm cúng, bar rooftop",
    rangeText: "350.000đ - 700.000đ / người",
    minPricePerPerson: 350000,
    maxPricePerPerson: 700000,
    icon: "🍷",
    color: "bg-rose-50 text-rose-800 border-rose-300",
  },
  {
    id: "budget-luxury",
    label: "Sang Chảnh / Fine Dining",
    subtitle: "Nhà hàng cao cấp, dịch vụ đỉnh cao",
    rangeText: "> 700.000đ / người",
    minPricePerPerson: 700000,
    maxPricePerPerson: 3000000,
    icon: "✨",
    color: "bg-purple-50 text-purple-800 border-purple-300",
  },
]

/**
 * Phân tích chuỗi price_range (ví dụ: "30.000đ - 80.000đ", "150.000đ") thành số tiền trung bình
 */
export function parsePriceRangeToAverage(
  priceRangeStr?: string | null,
): number {
  if (!priceRangeStr) return 120000

  // Tìm tất cả các cụm số
  const cleanStr = priceRangeStr.replace(/\./g, "").replace(/,/g, "")
  const matches = cleanStr.match(/\d+/g)
  if (!matches || matches.length === 0) return 120000

  const numbers = matches
    .map((m) => parseInt(m, 10))
    .filter((n) => !isNaN(n) && n > 0)
  if (numbers.length === 0) return 120000
  if (numbers.length === 1) return numbers[0]

  // Lấy trung bình min và max
  const min = Math.min(...numbers)
  const max = Math.max(...numbers)
  return Math.round((min + max) / 2)
}

export function formatVnd(amount: number): string {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount)
}

export function estimateTravelTime(distKm: number): string {
  if (distKm <= 0.8) {
    const mins = Math.max(3, Math.round(distKm * 9))
    return `~${mins} phút đi bộ`
  }
  const mins = Math.max(4, Math.round(distKm * 2.8))
  return `~${mins} phút xe máy`
}

/**
 * Kiểm tra xem địa điểm có đủ điều kiện phục vụ cho một buổi hẹn/food tour hay không
 * Loại bỏ các quán chỉ bán online, giao hàng hỏa tốc, chuyên sỉ, kho hàng
 */
export function isEligibleForDate(place: PlannerPlaceItem): boolean {
  const nameLower = (place.name || "").toLowerCase()
  const addrLower = (place.address || "").toLowerCase()
  const tagsLower = (place.tags || []).join(" ").toLowerCase()

  const excludeKeywords = [
    "shop online",
    "online",
    "chuyên sỉ",
    "kho sỉ",
    "giao hàng",
    "mang đi",
    "take away",
    "bếp online",
    "cloud kitchen",
  ]

  for (const kw of excludeKeywords) {
    if (
      nameLower.includes(kw) ||
      addrLower.includes(kw) ||
      tagsLower.includes(kw)
    ) {
      return false
    }
  }

  // Phải có tọa độ hợp lệ
  if (!place.latitude || !place.longitude) {
    return false
  }

  return true
}

/**
 * Kiểm tra xem địa điểm có thuộc quận được chọn hay không (tránh Quận 1 khớp nhầm Quận 10, 11, 12)
 */
export function isDistrictMatch(
  placeDistrict?: string | null,
  placeAddress?: string | null,
  targetDistrict?: string,
): boolean {
  if (!targetDistrict || targetDistrict === "all" || targetDistrict === "gps") {
    return true
  }
  const target = targetDistrict.trim().toLowerCase()
  const d = (placeDistrict || "").trim().toLowerCase()
  const a = (placeAddress || "").trim().toLowerCase()

  if (d === target) return true

  // Word boundary regex: tránh "quận 1" khớp với "quận 10", "quận 11", "quận 12"
  const escaped = target.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const regex = new RegExp(`(^|[\\s,./-])${escaped}([\\s,./-]|$)`, "i")
  return regex.test(d) || regex.test(a)
}

/**
 * Lọc quán theo ngân sách
 */
function isPlaceInBudgetTier(
  place: PlannerPlaceItem,
  tier: BudgetTier,
): boolean {
  const avg = parsePriceRangeToAverage(place.price_range)
  if (tier.id === "budget-student") {
    return avg <= 170000
  }
  if (tier.id === "budget-casual") {
    return avg >= 60000 && avg <= 450000
  }
  if (tier.id === "budget-romantic") {
    return avg >= 150000 && avg <= 950000
  }
  // budget-luxury
  return avg >= 400000
}

/**
 * Tính điểm chất lượng cơ bản dựa trên Bayesian rating & review_count
 */
function getPlaceBaseQuality(place: PlannerPlaceItem): number {
  const rating = place.rating || 4.2
  const reviews =
    typeof (place as { review_count?: number }).review_count === "number"
      ? (place as { review_count?: number }).review_count!
      : 10

  // Logarithmic weight for review count: 10 reviews = 8.5 pts, 100 reviews = 17 pts, 500+ = 22 pts
  const reviewScore = Math.min(22, Math.log10(reviews + 1) * 8.5)
  // Rating score: (rating - 3.5) * 15 (e.g. 4.7 -> 18 pts)
  const ratingScore = Math.max(0, (rating - 3.5) * 15)

  let score = ratingScore + reviewScore

  // Thưởng cho quán có ảnh thực tế sắc nét
  if (
    place.image &&
    !place.image.includes("placeholder") &&
    !place.image.includes("default")
  ) {
    score += 5
  }

  // Thưởng cho các quán có nhãn nổi bật
  const badgeLower = (place.badge || "").toLowerCase()
  if (
    badgeLower.includes("chọn lọc") ||
    badgeLower.includes("yêu thích") ||
    badgeLower.includes("chill")
  ) {
    score += 5
  }

  return score
}

export type PlannerRole = "meal" | "chill" | "snack"

/**
 * Tính điểm phù hợp của quán theo phong cách chủ đề buổi hẹn
 */
function calculateThemeScore(
  place: PlannerPlaceItem,
  role: PlannerRole,
  themeId: string,
): number {
  const nameLower = (place.name || "").toLowerCase()
  const tagsLower = (place.tags || []).join(" ").toLowerCase()
  const cat = place.category_id || ""

  let score = getPlaceBaseQuality(place)

  if (role === "meal") {
    if (themeId === "option-romantic") {
      // Option 1: Lãng Mạn & Chill (Bữa tối sang trọng, ấm cúng, chuẩn gu hẹn hò)
      const romanticFoods = [
        "sushi",
        "sashimi",
        "steak",
        "bistro",
        "pizza",
        "pasta",
        "italia",
        "pháp",
        "nhật bản",
        "hàn quốc",
        "bbq",
        "nướng",
        "lẩu",
        "nhà hàng",
        "wine",
        "cocktail",
        "lounge",
        "bò",
        "hải sản",
        "ẩm thực",
        "lãng mạn",
        "ấm cúng",
      ]
      for (const kw of romanticFoods) {
        if (nameLower.includes(kw) || tagsLower.includes(kw)) {
          score += 25
          break
        }
      }
      if (cat === "nha-hang") score += 20
      if (cat === "quan-an") score += 5

      // Trừ điểm nặng các quán vỉa hè / thức ăn nhanh bình dân cho bữa tối hẹn hò lãng mạn
      const cheapFastFoods = [
        "phở",
        "hủ tiếu",
        "cơm tấm",
        "bánh mì",
        "xôi",
        "cháo lòng",
        "gà rán",
        "kebab",
        "hotdog",
        "trà chanh",
        "bình dân",
        "vỉa hè",
        "bún thịt nướng",
      ]
      for (const kw of cheapFastFoods) {
        if (nameLower.includes(kw)) {
          score -= 45
          break
        }
      }
    } else if (themeId === "option-vibrant") {
      // Option 2: Sôi Động & Trải Nghiệm (Lẩu, nướng, ẩm thực phong phú, vui vẻ)
      const vibrantFoods = [
        "lẩu",
        "nướng",
        "bbq",
        "buffet",
        "hải sản",
        "thái",
        "cay",
        "tokbokki",
        "nướng ngói",
        "lẩu bò",
        "lẩu thái",
        "lẩu nấm",
        "dimsum",
        "mì cay",
      ]
      for (const kw of vibrantFoods) {
        if (nameLower.includes(kw) || tagsLower.includes(kw)) {
          score += 35
          break
        }
      }
    } else {
      // Option 3: Khám Phá Đặc Sản Phố (Tinh hoa ẩm thực truyền thống trứ danh)
      const heritageFoods = [
        "đặc sản",
        "gia truyền",
        "nổi tiếng",
        "cơm tấm",
        "bún bò",
        "phở",
        "ốc",
        "bánh xèo",
        "bún chả",
        "mì vịt tiềm",
        "mì quảng",
        "bánh canh",
        "dimsum",
      ]
      for (const kw of heritageFoods) {
        if (nameLower.includes(kw) || tagsLower.includes(kw)) {
          score += 35
          break
        }
      }
    }
  } else if (role === "chill") {
    const isCoffee =
      cat === "ca-phe" ||
      nameLower.includes("coffee") ||
      nameLower.includes("cà phê") ||
      nameLower.includes("tea") ||
      nameLower.includes("trà") ||
      nameLower.includes("rooftop") ||
      nameLower.includes("lounge") ||
      nameLower.includes("bar") ||
      tagsLower.includes("cafe")

    if (isCoffee) score += 25

    if (themeId === "option-romantic") {
      // Ưu tiên rooftop, view đẹp, acoustic, không gian ấm cúng, quán cafe phong cách
      const romanticChillKeywords = [
        "rooftop",
        "lounge",
        "acoustic",
        "view",
        "garden",
        "chill",
        "hoàng hôn",
        "cheese coffee",
        "boutique",
        "tiệm trà",
        "hoa",
        "art",
        "ban công",
      ]
      for (const kw of romanticChillKeywords) {
        if (nameLower.includes(kw) || tagsLower.includes(kw)) {
          score += 30
          break
        }
      }

      // Giảm điểm chuỗi đồ uống công nghiệp nhanh (Highlands, Passio) để ưu tiên quán có vibe chill
      if (nameLower.includes("highlands") || nameLower.includes("passio")) {
        score -= 20
      }
    } else if (themeId === "option-vibrant") {
      // Ưu tiên tráng miệng, trà sữa, kem, bingsu, chè hiện đại
      const dessertKeywords = [
        "trà sữa",
        "kem",
        "gelato",
        "bingsu",
        "dessert",
        "chè",
        "bánh ngọt",
        "trà trái cây",
        "phúc long",
        "koi",
        "gong cha",
      ]
      for (const kw of dessertKeywords) {
        if (nameLower.includes(kw) || tagsLower.includes(kw)) {
          score += 35
          break
        }
      }
    } else {
      // Ưu tiên quán cà phê lâu đời, cà phê vợt, hoài niệm, trà di sản
      const heritageCafeKeywords = [
        "cà phê vợt",
        "cà phê xưa",
        "phố cổ",
        "trà di sản",
        "hoài niệm",
        "truyền thống",
        "trà sen",
        "cà phê trứng",
      ]
      for (const kw of heritageCafeKeywords) {
        if (nameLower.includes(kw) || tagsLower.includes(kw)) {
          score += 35
          break
        }
      }
    }
  } else if (role === "snack") {
    // Chặng 3: Ăn vặt dạo phố
    const snackKeywords = [
      "bánh",
      "chè",
      "kem",
      "ăn vặt",
      "tráng miệng",
      "ốc",
      "trà sữa",
      "bánh tráng",
    ]
    for (const kw of snackKeywords) {
      if (nameLower.includes(kw) || tagsLower.includes(kw)) {
        score += 30
        break
      }
    }
  }

  return score
}

/**
 * Sinh danh sách 3 Option kịch bản buổi hẹn tối ưu quãng đường
 * - Bắt đầu từ Điểm Xuất Phát (GPS hoặc Trung tâm quận)
 * - Chặng 1 gần Điểm Xuất Phát
 * - Chặng 2 gần Chặng 1
 * - Chặng 3 gần Chặng 2 (nếu bật)
 */
export function generateDateOptions(
  allPlaces: PlannerPlaceItem[],
  prefs: DatePlanPreferences,
): DatePlanOption[] {
  if (!allPlaces || allPlaces.length === 0) return []

  // 1. Lọc các địa điểm thực tế hợp lệ (loại bỏ shop online, giao hàng hỏa tốc)
  const eligiblePlaces = allPlaces.filter(isEligibleForDate)
  const workingPool = eligiblePlaces.length >= 10 ? eligiblePlaces : allPlaces

  const tier =
    BUDGET_TIERS.find((t) => t.id === prefs.budgetTierId) || BUDGET_TIERS[1]

  // 2. Xác định Điểm Xuất Phát (Departure Point)
  let depLat = 10.7769
  let depLng = 106.7009
  let departureName = "Trung tâm TP. Hồ Chí Minh (Quận 1)"

  if (prefs.userLatitude && prefs.userLongitude) {
    depLat = prefs.userLatitude
    depLng = prefs.userLongitude
    departureName = prefs.departureName || "Vị trí GPS của bạn"
  } else if (
    prefs.selectedDistrict &&
    prefs.selectedDistrict !== "all" &&
    prefs.selectedDistrict !== "gps"
  ) {
    const coords = getDistrictCoordinates(prefs.selectedDistrict)
    depLat = coords.lat
    depLng = coords.lng
    departureName = `Trung tâm ${prefs.selectedDistrict}`
  }

  const targetDistrict = (prefs.selectedDistrict || "").trim()
  const isDistrictRestricted =
    targetDistrict && targetDistrict !== "all" && targetDistrict !== "gps"

  // 3. Thiết lập khung giờ các chặng
  const isLunch =
    prefs.startTimeSlot.includes("11:") || prefs.startTimeSlot.includes("12:")
  const stop1Time = isLunch ? "11:30 - 13:00" : "18:30 - 20:00"
  const stop2Time = isLunch ? "13:15 - 14:45" : "20:15 - 21:45"
  const stop3Time = isLunch ? "15:00 - 16:00" : "22:00 - 23:00"

  // 4. Định nghĩa 3 Option Kịch bản
  const optionThemes = [
    {
      id: "option-romantic",
      title: "Option 1: Lãng Mạn & Chill",
      tagline: "Bữa tối ấm cúng + Cà phê / Rooftop ngắm phố lung linh",
      themeBadge: "❤️ Lãng Mạn & Riêng Tư",
      themeColor: "from-rose-500 to-pink-500",
    },
    {
      id: "option-vibrant",
      title: "Option 2: Sôi Động & Trải Nghiệm",
      tagline: "Lẩu nướng đậm vị + Tráng miệng ngọt ngào",
      themeBadge: "🔥 Sôi Nổi & Ngon Miệng",
      themeColor: "from-amber-500 to-orange-500",
    },
    {
      id: "option-discovery",
      title: "Option 3: Khám Phá Đặc Sản Phố",
      tagline: "Đặc sản trứ danh + Cà phê trò chuyện thân tình",
      themeBadge: "✨ Tinh Hoa Phố Xá",
      themeColor: "from-emerald-500 to-teal-500",
    },
  ]

  const usedPlaceIds = new Set<string>()
  const options: DatePlanOption[] = []

  for (let i = 0; i < optionThemes.length; i++) {
    const theme = optionThemes[i]

    // --- BƯỚC 1: CHỌN QUÁN CHẶNG 1 (BỮA CHÍNH) ---
    // Tiêu chí: Đúng chủ đề + Thuộc ngân sách + GẦN ĐIỂM XUẤT PHÁT
    const scoredMealCandidates = workingPool
      .filter((p) => !usedPlaceIds.has(p.id))
      .map((p) => {
        const distFromDep = calculateDistanceKm(
          depLat,
          depLng,
          p.latitude || depLat,
          p.longitude || depLng,
        )

        let score = calculateThemeScore(p, "meal", theme.id)

        // Phạt khoảng cách từ điểm xuất phát đến Chặng 1 (3.5 điểm mỗi km)
        score -= distFromDep * 3.5

        // Thưởng lớn nếu cùng quận người dùng chọn
        if (
          isDistrictRestricted &&
          isDistrictMatch(p.district, p.address, targetDistrict)
        ) {
          score += 45
        }

        // Kiểm tra ngân sách
        if (isPlaceInBudgetTier(p, tier)) {
          score += 15
        }

        return { place: p, score, distFromDep }
      })
      .sort((a, b) => b.score - a.score)

    const bestMealMatch = scoredMealCandidates[0]
    const mealPlace = bestMealMatch
      ? bestMealMatch.place
      : workingPool[i % workingPool.length]
    const distDepTo1 = bestMealMatch
      ? bestMealMatch.distFromDep
      : calculateDistanceKm(
          depLat,
          depLng,
          mealPlace.latitude || depLat,
          mealPlace.longitude || depLng,
        )

    usedPlaceIds.add(mealPlace.id)

    // --- BƯỚC 2: CHỌN QUÁN CHẶNG 2 (CÀ PHÊ / CHILL) ---
    // Tiêu chí: Đúng chủ đề Chill + CỰC KỲ GẦN CHẶNG 1 (ưu tiên đi bộ hoặc dưới 1.5km)
    const mealLat = mealPlace.latitude || depLat
    const mealLng = mealPlace.longitude || depLng

    const scoredChillCandidates = workingPool
      .filter((p) => !usedPlaceIds.has(p.id))
      .map((p) => {
        const dist1To2 = calculateDistanceKm(
          mealLat,
          mealLng,
          p.latitude || mealLat,
          p.longitude || mealLng,
        )

        let score = calculateThemeScore(p, "chill", theme.id)

        // Phạt nặng khoảng cách giữa Chặng 1 và Chặng 2 (12 điểm mỗi km)
        score -= dist1To2 * 12

        // Thưởng lớn nếu khoảng cách gần đi bộ được (<= 1.2km)
        if (dist1To2 <= 1.2) {
          score += 25
        } else if (dist1To2 > 3.0) {
          score -= 40
        }

        if (isPlaceInBudgetTier(p, tier)) {
          score += 10
        }

        return { place: p, score, dist1To2 }
      })
      .sort((a, b) => b.score - a.score)

    const bestChillMatch = scoredChillCandidates[0]
    const chillPlace = bestChillMatch
      ? bestChillMatch.place
      : workingPool.find((p) => !usedPlaceIds.has(p.id)) ||
        workingPool[(i + 1) % workingPool.length]
    const dist1To2 = bestChillMatch
      ? bestChillMatch.dist1To2
      : calculateDistanceKm(
          mealLat,
          mealLng,
          chillPlace.latitude || mealLat,
          chillPlace.longitude || mealLng,
        )

    usedPlaceIds.add(chillPlace.id)

    const stop1Cost = parsePriceRangeToAverage(mealPlace.price_range)
    const stop2Cost = parsePriceRangeToAverage(chillPlace.price_range)

    const stops: DatePlanStop[] = [
      {
        stopOrder: 1,
        title: "Chặng 1: Bữa Chính Ngon Miệng",
        type: "meal",
        place: mealPlace,
        timeSlot: stop1Time,
        distanceFromPreviousKm: distDepTo1,
        distanceText: formatDistanceText(distDepTo1),
        travelTimeText: estimateTravelTime(distDepTo1),
        estimatedCostPerPerson: stop1Cost,
        notes: `Thưởng thức ẩm thực đặc sắc tại ${mealPlace.name}`,
      },
      {
        stopOrder: 2,
        title: "Chặng 2: Cà Phê & Trò Chuyện Chill",
        type: "chill",
        place: chillPlace,
        timeSlot: stop2Time,
        distanceFromPreviousKm: dist1To2,
        distanceText: formatDistanceText(dist1To2),
        travelTimeText: estimateTravelTime(dist1To2),
        estimatedCostPerPerson: stop2Cost,
        notes: `Thư giãn, trò chuyện và ngắm cảnh tại ${chillPlace.name}`,
      },
    ]

    let totalDist = distDepTo1 + dist1To2
    let totalCostPerPerson = stop1Cost + stop2Cost

    // --- BƯỚC 3: CHẶNG 3 (NẾU BẬT ĂN VẶT / DẠO PHỐ) ---
    if (prefs.includeStop3) {
      const chillLat = chillPlace.latitude || mealLat
      const chillLng = chillPlace.longitude || mealLng

      const scoredSnackCandidates = workingPool
        .filter((p) => !usedPlaceIds.has(p.id))
        .map((p) => {
          const dist2To3 = calculateDistanceKm(
            chillLat,
            chillLng,
            p.latitude || chillLat,
            p.longitude || chillLng,
          )

          let score = calculateThemeScore(p, "snack", theme.id)
          score -= dist2To3 * 12
          if (dist2To3 <= 1.2) score += 20

          return { place: p, score, dist2To3 }
        })
        .sort((a, b) => b.score - a.score)

      const bestSnackMatch = scoredSnackCandidates[0]
      if (bestSnackMatch) {
        const snackPlace = bestSnackMatch.place
        const dist2To3 = bestSnackMatch.dist2To3
        usedPlaceIds.add(snackPlace.id)
        const stop3Cost = parsePriceRangeToAverage(snackPlace.price_range)

        stops.push({
          stopOrder: 3,
          title: "Chặng 3: Ăn Vặt & Dạo Phố Đêm",
          type: "snack",
          place: snackPlace,
          timeSlot: stop3Time,
          distanceFromPreviousKm: dist2To3,
          distanceText: formatDistanceText(dist2To3),
          travelTimeText: estimateTravelTime(dist2To3),
          estimatedCostPerPerson: stop3Cost,
          notes: `Khép lại buổi hẹn ngọt ngào tại ${snackPlace.name}`,
        })

        totalDist += dist2To3
        totalCostPerPerson += stop3Cost
      }
    }

    const totalEstimatedCost = totalCostPerPerson * prefs.partySize

    options.push({
      id: theme.id,
      title: theme.title,
      tagline: theme.tagline,
      themeBadge: theme.themeBadge,
      themeColor: theme.themeColor,
      departurePoint: {
        name: departureName,
        lat: depLat,
        lng: depLng,
      },
      distanceFromDepartureKm: Math.round(distDepTo1 * 10) / 10,
      distanceFromDepartureText: formatDistanceText(distDepTo1),
      travelTimeFromDepartureText: estimateTravelTime(distDepTo1),
      stops,
      totalEstimatedCost,
      totalCostFormatted: formatVnd(totalEstimatedCost),
      totalDistanceKm: Math.round(totalDist * 10) / 10,
      totalDistanceFormatted: formatDistanceText(totalDist),
      totalDurationText: prefs.includeStop3 ? "~4.5 giờ" : "~3.0 giờ",
    })
  }

  return options
}
