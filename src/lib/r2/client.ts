import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  HeadObjectCommand,
} from "@aws-sdk/client-s3"

const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY

export const R2_BUCKET_NAME =
  process.env.CLOUDFLARE_R2_BUCKET_NAME || "hyuntltn"
export const R2_PUBLIC_DOMAIN = (
  process.env.CLOUDFLARE_R2_PUBLIC_DOMAIN ||
  process.env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN ||
  "https://pub-794ee102186349d0adf4c16162b84a71.r2.dev"
).replace(/\/$/, "")

/**
 * Singleton S3Client configured for Cloudflare R2
 */
export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: accessKeyId || "",
    secretAccessKey: secretAccessKey || "",
  },
})

export interface UploadOptions {
  buffer: Buffer | Uint8Array
  key: string
  contentType: string
  cacheControl?: string
}

/**
 * Upload a file buffer to Cloudflare R2 and return the public URL
 */
export async function uploadToR2({
  buffer,
  key,
  contentType,
  cacheControl = "public, max-age=31536000, immutable",
}: UploadOptions): Promise<string> {
  const cleanKey = key.replace(/^\/+/, "")

  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: cleanKey,
      Body: buffer,
      ContentType: contentType,
      CacheControl: cacheControl,
    }),
  )

  return `${R2_PUBLIC_DOMAIN}/${cleanKey}`
}

/**
 * Delete an object from Cloudflare R2 by key
 */
export async function deleteFromR2(key: string): Promise<boolean> {
  try {
    const cleanKey = key.replace(/^\/+/, "")
    await r2Client.send(
      new DeleteObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: cleanKey,
      }),
    )
    return true
  } catch (error) {
    console.error("Failed to delete object from R2:", error)
    return false
  }
}

/**
 * Check if an object exists in Cloudflare R2
 */
export async function checkObjectExists(key: string): Promise<boolean> {
  try {
    const cleanKey = key.replace(/^\/+/, "")
    await r2Client.send(
      new HeadObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: cleanKey,
      }),
    )
    return true
  } catch {
    return false
  }
}

/**
 * Format a key into a full public CDN URL
 */
export function getR2PublicUrl(key: string): string {
  if (key.startsWith("http://") || key.startsWith("https://")) {
    return key
  }
  return `${R2_PUBLIC_DOMAIN}/${key.replace(/^\/+/, "")}`
}
