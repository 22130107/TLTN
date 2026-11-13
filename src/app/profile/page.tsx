"use client"

import { useState } from "react"
import MainHeader from "@/components/navigation/MainHeader"
import MainFooter from "@/components/navigation/MainFooter"
import ProfileHeroSection from "@/components/profile/ProfileHeroSection"
import ProfileDashboard from "@/components/profile/ProfileDashboard"
import NavigationMenu from "@/components/NavigationMenu"
import EditProfileModal from "@/components/profile/EditProfileModal"
import { mockUserProfile } from "@/data/profileData"
import { useAuth } from "@/contexts/AuthContext"
import type { UserProfile } from "@/types/profile"

export default function ProfilePage() {
  const { user, profile, openAuthModal } = useAuth()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  const activeProfile: UserProfile = {
    ...mockUserProfile,
    name:
      profile?.display_name ||
      user?.email?.split("@")[0] ||
      mockUserProfile.name,
    email: user?.email || mockUserProfile.email,
    avatarUrl: profile?.avatar_url || mockUserProfile.avatarUrl,
    bio: profile?.bio || mockUserProfile.bio,
    phone: profile?.phone || mockUserProfile.phone,
    title: profile?.level || mockUserProfile.title,
    locationName: profile?.location_name || mockUserProfile.locationName,
    homeCoordinate: {
      lat: profile?.latitude
        ? Number(profile.latitude)
        : mockUserProfile.homeCoordinate.lat,
      lng: profile?.longitude
        ? Number(profile.longitude)
        : mockUserProfile.homeCoordinate.lng,
    },
    joinedYear: profile?.created_at
      ? new Date(profile.created_at).getFullYear().toString()
      : "2026",
    followingCount: 0,
    followersCount: 0,
  }

  const handleEditProfile = () => {
    if (!user) {
      openAuthModal("login")
    } else {
      setIsEditModalOpen(true)
    }
  }

  return (
    <div className="min-h-screen bg-[#fdefdf] text-[#111111] selection:bg-[#E55067] selection:text-white flex flex-col justify-between">
      <div className="w-full">
        <NavigationMenu />
        <MainHeader />

        {!user && (
          <div className="bg-[#FFF0ED] border-b border-[#E8DDD1] px-4 py-2.5">
            <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="font-semibold text-[#1E293B]">
                Bạn đang xem hồ sơ trải nghiệm. Đăng nhập để đồng bộ hồ sơ cá
                nhân và lưu quán ăn yêu thích lên Supabase!
              </span>
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className="rounded-full border border-[#1E293B] bg-[#FF5376] px-3.5 py-1 text-xs font-bold text-white shadow-[1.5px_1.5px_0px_#1E293B] hover:bg-[#ff3b65] transition-all cursor-pointer"
              >
                Đăng nhập ngay
              </button>
            </div>
          </div>
        )}

        <ProfileHeroSection
          profile={activeProfile}
          onEditProfile={handleEditProfile}
        />

        <main>
          <ProfileDashboard onOpenEditModal={handleEditProfile} />
        </main>
      </div>

      <MainFooter />

      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  )
}
