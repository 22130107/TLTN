export interface MenuItem {
  name: string
  price: string
  desc: string
  image?: string
  isSignature?: boolean
}

export interface AmenityItem {
  icon: string
  label: string
}

export interface ReviewItem {
  author: string
  avatar: string
  rating: number
  date: string
  comment: string
}

export interface PlaceDetailModel {
  id: string
  name: string
  categoryBadge: string
  badgeColor?: string
  rating: number
  reviewCount: string
  priceRange: string
  city: string
  district: string
  address: string
  hours: string
  isOpen: boolean
  phone: string
  image: string
  tags: string[]
  story: string
  menuItems: MenuItem[]
  amenities: AmenityItem[]
  reviews: ReviewItem[]
}
