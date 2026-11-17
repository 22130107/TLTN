const { createClient } = require("@supabase/supabase-js")
const fs = require("fs")
const path = require("path")

const envPath = path.join(__dirname, "../.env.local")
const envContent = fs.readFileSync(envPath, "utf-8")
const envVars = {}
for (const line of envContent.split("\n")) {
  const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
  if (m) envVars[m[1]] = (m[2] || "").replace(/(^['"]|['"]$)/g, "").trim()
}

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = envVars.SUPABASE_SERVICE_ROLE_KEY

console.log("Connecting to Singapore Supabase Project:", supabaseUrl)
const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
})

const places = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "all_southern_places_consolidated.json"),
    "utf-8",
  ),
)

async function checkAndSeed() {
  console.log("1. Checking if public.places table is created in new project...")
  const { error: testErr } = await supabase.from("places").select("id").limit(1)

  if (testErr) {
    if (
      testErr.message &&
      testErr.message.includes("Could not find the table")
    ) {
      console.log("STATUS: PENDING_SCHEMA")
      console.log(
        "Table public.places does not exist yet. Please run supabase/schema.sql in Supabase SQL Editor.",
      )
      return false
    } else {
      console.error("Connection error:", testErr.message)
      return false
    }
  }

  console.log("STATUS: SCHEMA_READY! Found public.places table.")
  console.log(`2. Uploading ${places.length} authentic Southern places...`)

  const batchSize = 100
  let totalUploaded = 0

  for (let i = 0; i < places.length; i += batchSize) {
    const chunk = places.slice(i, i + batchSize)
    const batch = chunk.map((p) => ({
      id: p.id,
      name: p.name,
      image: p.image,
      rating: Number(p.rating),
      review_count: parseInt(
        String(p.reviewCount || "100").replace(/\D/g, "") || "100",
        10,
      ),
      address: p.address || p.district,
      district: p.district,
      city: p.city || "TP. Hồ Chí Minh",
      category_id: p.categoryType,
      badge: p.badge,
      badge_color: p.badgeColor,
      price_range: p.priceText,
      hours: p.hours || "08:00 - 22:30",
      phone: p.phone || "028 38221122",
      story: p.description,
      tags: p.tags,
      latitude: p.latitude,
      longitude: p.longitude,
      is_featured: p.rating >= 4.7,
    }))

    const { error: insertError } = await supabase.from("places").upsert(batch)
    if (insertError) {
      console.error(
        `Error in batch ${i} - ${i + chunk.length}:`,
        insertError.message,
      )
    } else {
      totalUploaded += chunk.length
      console.log(`Uploaded: ${totalUploaded} / ${places.length}`)
    }
  }

  const { count } = await supabase
    .from("places")
    .select("*", { count: "exact", head: true })
  console.log(`\nSUCCESS! Total places in new Singapore Supabase DB: ${count}`)
  return true
}

checkAndSeed().catch((err) => console.error(err))
