const {
  S3Client,
  PutObjectCommand,
  HeadObjectCommand,
} = require("@aws-sdk/client-s3")
const fs = require("fs")
const path = require("path")

// Load .env.local
const envPath = path.join(__dirname, "../.env.local")
if (!fs.existsSync(envPath)) {
  console.error("❌ .env.local file not found.")
  process.exit(1)
}

const envFile = fs.readFileSync(envPath, "utf8")
const env = {}
envFile.split("\n").forEach((line) => {
  const [k, ...v] = line.split("=")
  if (k && v.length) {
    env[k.trim()] = v.join("=").trim()
  }
})

const accountId = env.CLOUDFLARE_R2_ACCOUNT_ID
const bucketName = env.CLOUDFLARE_R2_BUCKET_NAME
const accessKeyId = env.CLOUDFLARE_R2_ACCESS_KEY_ID
const secretAccessKey = env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
const publicDomain = (
  env.CLOUDFLARE_R2_PUBLIC_DOMAIN ||
  env.NEXT_PUBLIC_R2_PUBLIC_DOMAIN ||
  "https://pub-794ee102186349d0adf4c16162b84a71.r2.dev"
).replace(/\/$/, "")

if (!accountId || !bucketName || !accessKeyId || !secretAccessKey) {
  console.error("❌ Missing Cloudflare R2 credentials in .env.local")
  process.exit(1)
}

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
})

function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase()
  switch (ext) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg"
    case ".png":
      return "image/png"
    case ".webp":
      return "image/webp"
    case ".avif":
      return "image/avif"
    case ".gif":
      return "image/gif"
    case ".svg":
      return "image/svg+xml"
    case ".ico":
      return "image/x-icon"
    default:
      return "application/octet-stream"
  }
}

async function uploadFile(localPath, r2Key) {
  const contentType = getMimeType(localPath)
  const fileBuffer = fs.readFileSync(localPath)

  try {
    // Check if object already exists
    try {
      await s3.send(
        new HeadObjectCommand({
          Bucket: bucketName,
          Key: r2Key,
        }),
      )
      return { skipped: true, url: `${publicDomain}/${r2Key}` }
    } catch {
      // Object doesn't exist, proceed to upload
    }

    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: r2Key,
        Body: fileBuffer,
        ContentType: contentType,
        CacheControl: "public, max-age=31536000, immutable",
      }),
    )

    return { skipped: false, url: `${publicDomain}/${r2Key}` }
  } catch (err) {
    console.error(`Failed to upload ${localPath} -> ${r2Key}:`, err.message)
    return null
  }
}

async function scanAndSync() {
  console.log("==========================================")
  console.log("🚀 CLOUDFLARE R2 ASSETS SYNC")
  console.log("==========================================")
  console.log("Bucket:", bucketName)
  console.log("Public CDN Domain:", publicDomain)

  const targetDirs = [
    { dir: path.join(__dirname, "../public/assets"), prefix: "static/assets" },
    { dir: path.join(__dirname, "../public/images"), prefix: "static/images" },
    { dir: path.join(__dirname, "../public/img"), prefix: "static/img" },
  ]

  const mapping = {}
  let totalFiles = 0
  let uploadedCount = 0
  let skippedCount = 0

  for (const { dir, prefix } of targetDirs) {
    if (!fs.existsSync(dir)) continue

    const files = fs.readdirSync(dir)
    for (const file of files) {
      const fullPath = path.join(dir, file)
      const stat = fs.statSync(fullPath)
      if (stat.isDirectory()) continue

      totalFiles++
      const r2Key = `${prefix}/${file}`
      const relativeLocal = path
        .relative(path.join(__dirname, ".."), fullPath)
        .replace(/\\/g, "/")

      process.stdout.write(`Syncing ${file}... `)
      const result = await uploadFile(fullPath, r2Key)

      if (result) {
        mapping[`/${relativeLocal}`] = result.url
        if (result.skipped) {
          skippedCount++
          console.log(`[EXISTED] -> ${result.url}`)
        } else {
          uploadedCount++
          console.log(`[UPLOADED] -> ${result.url}`)
        }
      }
    }
  }

  // Save mapping file
  const mapPath = path.join(__dirname, "../r2-assets-map.json")
  fs.writeFileSync(mapPath, JSON.stringify(mapping, null, 2), "utf8")

  console.log("\n==========================================")
  console.log(`✓ SYNC COMPLETE!`)
  console.log(`Total scanned: ${totalFiles}`)
  console.log(`Newly uploaded: ${uploadedCount}`)
  console.log(`Already on R2 (skipped): ${skippedCount}`)
  console.log(`Mapping saved to: ${mapPath}`)
  console.log("==========================================")
}

scanAndSync()
