export interface UnifiedPlace {
  id: string
  name: string
  city: string
  indexNo: string
  archiveCode: string
  signatureDish: string
  address: string
  image: string
  tags: string[]
  hours?: string
  phone?: string
}

export interface CityTabOption {
  id: string
  label: string
  count: number
}
