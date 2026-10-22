const {
  S3Client,
  ListObjectsV2Command,
  PutObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3")
const fs = require("fs")
const path = require("path")

// Load .env.local manually if not in Next environment
const envFile = fs.readFileSync(path.join(__dirname, "../.env.local"), "utf8")
const env = {}
envFile.split("\n").forEach((line) => {
  const [key, ...rest] = line.split("=")
  if (key && rest.length) {
    env[key.trim()] = rest.join("=").trim()
  }
})

const accountId = env.CLOUDFLARE_R2_ACCOUNT_ID
const bucketName = env.CLOUDFLARE_R2_BUCKET_NAME
const accessKeyId = env.CLOUDFLARE_R2_ACCESS_KEY_ID
const secretAccessKey = env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
const publicDomain = env.CLOUDFLARE_R2_PUBLIC_DOMAIN

console.log("Connecting to Cloudflare R2 with:")
console.log("- Account ID:", accountId)
console.log("- Bucket Name:", bucketName)
console.log("- Access Key ID:", accessKeyId.substring(0, 8) + "...")
console.log("- Public Domain:", publicDomain)

const s3 = new S3Client({
  region: "auto",
  endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId,
    secretAccessKey,
  },
})

async function runProbe() {
  try {
    console.log("\n1. Testing ListObjectsV2 on bucket:", bucketName)
    const listRes = await s3.send(
      new ListObjectsV2Command({
        Bucket: bucketName,
        MaxKeys: 5,
      }),
    )
    console.log("✓ Bucket connection SUCCESSFUL!")
    console.log("Existing object count:", listRes.KeyCount || 0)

    console.log("\n2. Testing PutObject (probe-test.txt)...")
    const testKey = "test/probe-test.txt"
    await s3.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: testKey,
        Body: "Cloudflare R2 is working perfectly with HYUN Next.js!",
        ContentType: "text/plain",
      }),
    )
    console.log("✓ PutObject SUCCESSFUL!")
    console.log(`Public URL: ${publicDomain}/${testKey}`)

    console.log("\n3. Testing DeleteObject...")
    await s3.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: testKey,
      }),
    )
    console.log("✓ DeleteObject SUCCESSFUL!")

    console.log("\n🎉 ALL R2 PROBES PASSED! Cloudflare R2 is 100% operational.")
  } catch (err) {
    console.error("❌ R2 Probe failed:", err)
    process.exit(1)
  }
}

runProbe()
