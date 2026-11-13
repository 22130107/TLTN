"use client" /* Backdrop */ /* Modal Card */ /* Avatar Upload Field */
import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { useAuth } from "@/contexts/AuthContext"
import {
  requestCurrentPosition,
  reverseGeocodeOsm,
  saveUserLocation,
} from "@/utils/geolocation"

interface EditProfileModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function EditProfileModal({
  isOpen,
  onClose,
}: EditProfileModalProps) {
  const { profile, user, updateProfile } = useAuth()

  const [displayName, setDisplayName] = useState(profile?.display_name || "")
  const [bio, setBio] = useState(profile?.bio || "")
  const [phone, setPhone] = useState(profile?.phone || "")
  const [locationName, setLocationName] = useState(
    profile?.location_name || "TP. Hồ Chí Minh",
  )
  const [latitude, setLatitude] = useState<number | null>(
    profile?.latitude ? Number(profile.latitude) : null,
  )
  const [longitude, setLongitude] = useState<number | null>(
    profile?.longitude ? Number(profile.longitude) : null,
  )
  const [isLocatingGPS, setIsLocatingGPS] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(
    profile?.avatar_url || "/img/profile-avatar.png",
  )
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadStatus, setUploadStatus] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (profile) {
      setDisplayName(profile.display_name || "")
      setBio(profile.bio || "")
      setPhone(profile.phone || "")
      setLocationName(profile.location_name || "TP. Hồ Chí Minh")
      setLatitude(profile.latitude ? Number(profile.latitude) : null)
      setLongitude(profile.longitude ? Number(profile.longitude) : null)
      setAvatarPreview(profile.avatar_url || "/img/profile-avatar.png")
    }
  }, [profile])

  const handleGetGPS = async () => {
    setIsLocatingGPS(true)
    setErrorMsg("")
    try {
      const pos = await requestCurrentPosition()
      const lat = pos.coords.latitude
      const lng = pos.coords.longitude
      const acc = pos.coords.accuracy
      const geo = await reverseGeocodeOsm(lat, lng)

      setLocationName(geo.addressName)
      setLatitude(lat)
      setLongitude(lng)

      saveUserLocation({
        lat,
        lng,
        accuracy: acc,
        addressName: geo.addressName,
        city: geo.city,
        isGPS: true,
      })
    } catch (err: unknown) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Không thể lấy vị trí hiện tại của thiết bị.",
      )
    } finally {
      setIsLocatingGPS(false)
    }
  }

  const handleSelectImageClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg("Dung lượng ảnh vượt quá 5MB. Vui lòng chọn ảnh nhỏ hơn.")
      return
    }
    if (!file.type.startsWith("image/")) {
      setErrorMsg("Vui lòng chọn file hình ảnh hợp lệ (JPG, PNG, WebP).")
      return
    }

    setErrorMsg("")
    setSelectedFile(file)
    const localPreviewUrl = URL.createObjectURL(file)
    setAvatarPreview(localPreviewUrl)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setErrorMsg("")
    setSuccessMsg("")
    setIsSaving(true)

    if (!displayName.trim()) {
      setErrorMsg("Tên hiển thị không được để trống.")
      setIsSaving(false)
      return
    }

    let finalAvatarUrl = profile?.avatar_url
    if (selectedFile) {
      setUploadStatus("Đang tải ảnh lên Cloudflare R2...")
      try {
        const formData = new FormData()
        formData.append("file", selectedFile)
        formData.append("folder", "avatars")

        const uploadRes = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        const uploadData = await uploadRes.json()

        if (!uploadRes.ok || !uploadData.success) {
          throw new Error(uploadData.error || "Tải ảnh lên R2 thất bại.")
        }

        finalAvatarUrl = uploadData.url
      } catch (uploadErr) {
        setErrorMsg(
          "Lỗi tải ảnh: " +
            (uploadErr instanceof Error ? uploadErr.message : "Thất bại"),
        )
        setIsSaving(false)
        setUploadStatus("")
        return
      }
    }
    setUploadStatus("Đang cập nhật hồ sơ...")
    const { error } = await updateProfile({
      display_name: displayName.trim(),
      bio: bio.trim(),
      phone: phone.trim(),
      location_name: locationName.trim(),
      ...(latitude !== null ? { latitude } : {}),
      ...(longitude !== null ? { longitude } : {}),
      ...(finalAvatarUrl ? { avatar_url: finalAvatarUrl } : {}),
    })

    if (error) {
      setErrorMsg("Không thể cập nhật hồ sơ: " + error.message)
    } else {
      setSuccessMsg("Cập nhật hồ sơ & ảnh đại diện thành công!")
      setTimeout(() => {
        onClose()
      }, 1000)
    }

    setIsSaving(false)
    setUploadStatus("")
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {}
      <div className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl border border-[#1E293B] bg-white p-5 sm:p-6 shadow-[3px_3px_0px_#1E293B] animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#E8DDD1] mb-4">
          <h2 className="text-base sm:text-[17px] font-bold text-[#1E293B]">
            Chỉnh sửa thông tin cá nhân
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="size-7 rounded-md flex items-center justify-center text-gray-500 hover:bg-neutral-100 hover:text-black transition-colors cursor-pointer"
            aria-label="Đóng"
          >
            ✕
          </button>
        </div>

        {errorMsg && (
          <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-xs font-bold text-rose-700 shadow-[1px_1px_0px_#1E293B]">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 p-2.5 text-xs font-bold text-emerald-800 shadow-[1px_1px_0px_#1E293B]">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleSave} className="space-y-4">
          {}
          <div className="flex flex-col sm:flex-row items-center gap-3.5 rounded-lg border border-[#1E293B] bg-[#FAF6F1]/50 p-3.5 shadow-[1px_1px_0px_#1E293B]">
            <div
              onClick={handleSelectImageClick}
              className="relative group size-18 shrink-0 rounded-full border border-[#1E293B] overflow-hidden bg-white shadow-2xs cursor-pointer"
              title="Bấm để thay đổi ảnh đại diện"
            >
              <Image
                src={avatarPreview}
                alt="Avatar"
                width={72}
                height={72}
                unoptimized
                className="size-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[11px] font-semibold transition-opacity">
                Đổi ảnh
              </div>
            </div>

            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <button
                  type="button"
                  onClick={handleSelectImageClick}
                  className="rounded-lg border border-[#1E293B] bg-white px-3 py-1.5 text-xs font-bold text-[#1E293B] shadow-[1px_1px_0px_#1E293B] hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  Chọn ảnh mới
                </button>
                {selectedFile && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-[#1E293B] px-2 py-0.5 rounded-md shadow-[1px_1px_0px_#1E293B]">
                    Đã chọn: {selectedFile.name.substring(0, 15)}...
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11px] text-[#64748B] leading-relaxed">
                Hỗ trợ JPG, PNG, WebP (Tối đa 5MB). Lưu trữ bảo mật trên
                Cloudflare R2.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#64748B] mb-1">
              Email đăng nhập (Không thể thay đổi)
            </label>
            <input
              type="text"
              disabled
              value={user?.email || ""}
              className="w-full rounded-lg border border-[#D8C7B5]/50 bg-neutral-100 px-3 py-2 text-xs font-medium text-[#64748B] cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#64748B] mb-1">
              Họ và tên hiển thị
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="w-full rounded-lg border border-[#1E293B] bg-white px-3 py-2 text-xs font-semibold text-[#1E293B] shadow-[1px_1px_0px_#1E293B] focus:border-[#E55067] focus:outline-none"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-[#64748B]">
                Vị trí / Khu vực của bạn
              </label>
              <button
                type="button"
                onClick={handleGetGPS}
                disabled={isLocatingGPS}
                className="text-[11px] font-bold text-[#0284C7] hover:underline disabled:opacity-50 cursor-pointer"
                title="Lấy vị trí GPS hiện tại từ thiết bị"
              >
                {isLocatingGPS ? "Đang định vị..." : "Lấy vị trí hiện tại"}
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                placeholder="Ví dụ: TP. Hồ Chí Minh"
                className="w-full rounded-lg border border-[#1E293B] bg-white px-3 py-2 text-xs font-semibold text-[#1E293B] shadow-[1px_1px_0px_#1E293B] focus:border-[#E55067] focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#64748B] mb-1">
              Số điện thoại liên hệ
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Ví dụ: 0799 013 785"
              className="w-full rounded-lg border border-[#1E293B] bg-white px-3 py-2 text-xs font-semibold text-[#1E293B] shadow-[1px_1px_0px_#1E293B] focus:border-[#E55067] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#64748B] mb-1">
              Tiểu sử ẩm thực
            </label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Chia sẻ gu ẩm thực, món ăn bạn yêu thích..."
              className="w-full rounded-lg border border-[#1E293B] bg-white px-3 py-2 text-xs font-medium text-[#1E293B] shadow-[1px_1px_0px_#1E293B] focus:border-[#E55067] focus:outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E8DDD1]">
            <span className="text-[11px] font-medium text-[#64748B]">
              {uploadStatus}
            </span>
            <div className="flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-[#1E293B] px-4 py-2 text-xs font-bold text-[#64748B] hover:bg-neutral-100 shadow-[1px_1px_0px_#1E293B] transition-colors cursor-pointer"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="rounded-lg border border-[#1E293B] bg-[#E55067] hover:bg-[#d64058] px-5 py-2 text-xs font-bold text-white shadow-[1.5px_1.5px_0px_#1E293B] transition-colors disabled:opacity-50 cursor-pointer"
              >
                {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
