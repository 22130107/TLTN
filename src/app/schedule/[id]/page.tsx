import { redirect } from "next/navigation"

import { ARCHIVE_PLACE_DETAILS } from "@/data/archivePlacesData"

import { mockScheduleItems } from "@/data/profileData"

import { ARCHIVE_ITEMS } from "@/constants/archivesData"

export function generateStaticParams() {
  const ids = new Set<string>()

  Object.keys(ARCHIVE_PLACE_DETAILS).forEach((id) => ids.add(id))

  mockScheduleItems.forEach((item) => ids.add(item.id))

  ARCHIVE_ITEMS.forEach((item) => ids.add(item.id))

  return Array.from(ids).map((id) => ({ id }))
}

interface ScheduleRedirectProps {
  params: Promise<{ id: string }>
}

export default async function ScheduleDetailRedirect({
  params,
}: ScheduleRedirectProps) {
  const { id } = await params

  redirect(`/places/${id}`)
}
