export interface LocationCoordinate {
  lat: number
  lng: number
  accuracy?: number
  addressName?: string
}

export interface UserStats {
  visitedPlaces: number
  reviewsCount: number
  upcomingTrips: number
  rewardPoints: number
}

export interface UserProfile {
  id: string
  name: string
  handle: string
  title: string
  avatarUrl: string
  bio: string
  email: string
  phone: string
  locationName: string
  joinedYear?: string
  followingCount?: number
  followersCount?: number
  homeCoordinate: LocationCoordinate
  stats: UserStats
  favoriteTags: string[]
}

export type ScheduleStatus = "upcoming" | "completed" | "in_progress"

export interface ScheduleItem {
  id: string
  placeId?: string
  userId?: string | null
  placeName: string
  category: string
  address: string
  date: string
  time: string
  status: ScheduleStatus
  coordinates: LocationCoordinate
  guestsCount: number
  signatureDish: string
  notes?: string
  imageUrl: string
}
