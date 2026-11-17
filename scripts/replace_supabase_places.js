const { createClient } = require("@supabase/supabase-js")
const fs = require("fs")
const path = require("path")

// Load environment variables
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
  fs.readFileSync(path.join(__dirname, "processed_shopeefood.json"), "utf-8"),
)
console.log(
  `Loaded ${places.length} authentic ShopeeFood places to replace old data...`,
)

async function run() {
  console.log("1. Deleting all old places from public.places in Supabase...")
  // Delete all records from places table
  const { error: delError } = await supabase
    .from("places")
    .delete()
    .neq("id", "non-existent-id-dummy")
  if (delError) {
    console.error("Delete error:", delError.message)
  } else {
    console.log("Successfully cleaned old data from public.places!")
  }

  console.log("2. Uploading new authentic ShopeeFood/Foody places...")
  const batchSize = 100
  let totalUploaded = 0

  for (let i = 0; i < places.length; i += batchSize) {
    const batch = places.slice(i, i + batchSize).map((p) => ({
      id: p.id,
      name: p.name,
      image: p.image,
      rating: p.rating,
      review_count: parseInt(p.reviewCount.replace(/\D/g, "") || "100", 10),
      address: p.address,
      district: p.district,
      city: "TP. Hồ Chí Minh",
      category_id: p.categoryType,
      badge: p.badge,
      badge_color: p.badgeColor,
      price_range: p.priceText,
      hours: "08:00 - 22:30",
      phone: p.phone,
      story: p.description,
      tags: p.tags,
      latitude: p.latitude,
      longitude: p.longitude,
      is_featured: p.rating >= 4.7,
    }))

    const { error: insertError } = await supabase.from("places").insert(batch)
    if (insertError) {
      console.error(
        `Error in batch ${i} - ${i + batch.length}:`,
        insertError.message,
      )
    } else {
      totalUploaded += batch.length
      console.log(`Uploaded: ${totalUploaded} / ${places.length}`)
    }
  }

  console.log(
    `\nCOMPLETED! Successfully replaced with ${totalUploaded} real ShopeeFood places in Supabase!`,
  )

  const countRes = await supabase
    .from("places")
    .select("*", { count: "exact", head: true })
  console.log("Total verified places currently in Supabase DB:", countRes.count)
}

run().catch((err) => console.error(err))
