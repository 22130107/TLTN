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
const serviceKey =
  envVars.SUPABASE_SERVICE_ROLE_KEY || envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log("Connecting to Supabase at:", supabaseUrl)
const supabase = createClient(supabaseUrl, serviceKey, {
  auth: { persistSession: false },
})

const places = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "all_southern_places_consolidated.json"),
    "utf-8",
  ),
)
console.log(`Loaded ${places.length} places across Southern Vietnam...`)

async function run() {
  console.log("1. Clearing existing places from public.places in Supabase...")
  const { error: delError } = await supabase
    .from("places")
    .delete()
    .neq("id", "non-existent-id-dummy")
  if (delError) {
    console.error("Delete error:", delError.message)
  } else {
    console.log("Cleaned old places successfully!")
  }

  console.log("2. Inserting consolidated 1,086 Southern places...")
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

    const { error: insertError } = await supabase.from("places").insert(batch)
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

  console.log(`\nCOMPLETED! Total places inserted: ${totalUploaded}`)
  const countRes = await supabase
    .from("places")
    .select("*", { count: "exact", head: true })
  console.log("Total verified places currently in Supabase DB:", countRes.count)
}

run().catch((err) => console.error(err))
