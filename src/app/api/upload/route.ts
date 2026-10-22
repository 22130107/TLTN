import { NextResponse } from "next/server"
import { uploadToR2 } from "@/lib/r2/client"

// Allowed image MIME types
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "image/gif",
  "image/svg+xml",
])

// Maximum file size: 5MB
const MAX_FILE_SIZE = 5 * 1024 * 1024

// Valid folder names
const VALID_FOLDERS = new Set([
  "avatars",
  "places",
  "articles",
  "reviews",
  "uploads",
  "banners",
])

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File | null
    const rawFolder = formData.get("folder") as string || "uploads"
    const folder = VALID_FOLDERS.has(rawFolder) ? rawFolder : "uploads"

    if (!file) {
      return NextResponse.json(
        { success: false, error: "Vui lòng chọn file hình ảnh để tải lên." },
        { status: 400 },
      )
    }

    // 1. Validate MIME type
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Định dạng file không được hỗ trợ. Chỉ chấp nhận JPG, PNG, WebP, AVIF, GIF, SVG.",
        },
        { status: 400 },
      )
    }

    // 2. Validate File Size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: "Dung lượng ảnh vượt quá giới hạn 5MB.",
        },
        { status: 400 },
      )
    }

    // 3. Create unique sanitized key
    const originalName = file.name || "image"
    const extMatch = originalName.match(/\.([a-zA-Z0-9]+)$/)
    let extension = extMatch ? extMatch[1].toLowerCase() : ""

    if (!extension) {
      if (file.type === "image/jpeg") extension = "jpg"
      else if (file.type === "image/png") extension = "png"
      else if (file.type === "image/webp") extension = "webp"
      else if (file.type === "image/avif") extension = "avif"
      else if (file.type === "image/gif") extension = "gif"
      else if (file.type === "image/svg+xml") extension = "svg"
      else extension = "bin"
    }

    const randomSuffix = Math.random().toString(36).substring(2, 10)
    const key = `${folder}/${Date.now()}-${randomSuffix}.${extension}`

    // 4. Convert to Buffer and upload to Cloudflare R2
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const publicUrl = await uploadToR2({
      buffer,
      key,
      contentType: file.type,
      cacheControl: "public, max-age=31536000, immutable",
    })

    return NextResponse.json({
      success: true,
      url: publicUrl,
      key,
      size: file.size,
      mimeType: file.type,
      name: originalName,
    })
  } catch (error) {
    console.error("API /api/upload error:", error)
    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Lỗi máy chủ khi tải ảnh lên Cloudflare R2.",
      },
      { status: 500 },
    )
  }
}
