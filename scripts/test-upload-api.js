const fs = require("fs")
const path = require("path")

async function testUploadApi() {
  console.log("Testing POST http://localhost:3000/api/upload ...")

  // Read a sample image from public/assets or public/img
  const sampleImagePath = path.join(__dirname, "../public/img/logo.png")
  if (!fs.existsSync(sampleImagePath)) {
    console.error("Sample image not found at", sampleImagePath)
    process.exit(1)
  }

  const fileBytes = fs.readFileSync(sampleImagePath)
  const blob = new Blob([fileBytes], { type: "image/png" })
  const formData = new FormData()
  formData.append("file", blob, "test-logo.png")
  formData.append("folder", "avatars")

  try {
    const res = await fetch("http://localhost:3000/api/upload", {
      method: "POST",
      body: formData,
    })

    const data = await res.json()
    console.log("Status:", res.status)
    console.log("Response:", JSON.stringify(data, null, 2))

    if (data.success && data.url) {
      console.log("\nTesting public access to uploaded URL:")
      console.log("URL:", data.url)
      const cdnRes = await fetch(data.url)
      console.log("CDN Status:", cdnRes.status)
      console.log("Content-Type:", cdnRes.headers.get("content-type"))
      if (cdnRes.status === 200) {
        console.log(
          "🎉 CDN PUBLIC ACCESS CONFIRMED! Image is live on Cloudflare R2!",
        )
      }
    } else {
      console.error("Upload did not return success:", data)
      process.exit(1)
    }
  } catch (err) {
    console.error("Failed to test upload API:", err)
    process.exit(1)
  }
}

testUploadApi()
