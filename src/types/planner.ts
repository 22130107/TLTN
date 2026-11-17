export type BudgetTierId = "budget-student" | "budget-casual" | "budget-romantic" | "budget-luxury"

export interface BudgetTier {
  id: BudgetTierId
  label: string
  subtitle: string
  rangeText: string
  maxPricePerPerson: number
  minPricePerPerson: number
  icon: string
  color: string
}

export interface PlannerPlaceItem {
  id: string
  name: string
  district?: string | null
  city?: string | null
  address?: string | null
  price_range?: string | null
  category_id?: string | null
  image?: string | null
  rating?: number | null
  latitude?: number | null
  longitude?: number | null
  badge?: string | null
  tags?: string[]
}

export interface DatePlanStop {
  stopOrder: number
  title: string // e.g. "Chặng 1: Bữa tối ấm cúng"
  type: "meal" | "chill" | "snack"
  place: PlannerPlaceItem
  timeSlot: string
  distanceFromPreviousKm?: number
  distanceText?: string
  travelTimeText?: string
  estimatedCostPerPerson: number
  notes?: string
}

export interface DatePlanOption {
  id: string
  title: string
  tagline: string
  themeBadge: string
  themeColor: string
  departurePoint: {
    name: string
    lat: number
    lng: number
  }
  distanceFromDepartureKm: number
  distanceFromDepartureText: string
  travelTimeFromDepartureText: string
  stops: DatePlanStop[]
  totalEstimatedCost: number
  totalCostFormatted: string
  totalDistanceKm: number
  totalDistanceFormatted: string
  totalDurationText: string
}

export interface DatePlanPreferences {
  date: string
  startTimeSlot: string // e.g. "18:30" or "11:30"
  partySize: number
  budgetTierId: BudgetTierId
  selectedDistrict: string
  userLatitude?: number
  userLongitude?: number
  departureName?: string
  includeStop3: boolean
}
