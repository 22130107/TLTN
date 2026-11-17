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

const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: { persistSession: false },
  },
)

const places = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, "all_southern_places_consolidated.json"),
    "utf-8",
  ),
)

async function retry() {
  const batch = places.slice(800, 900).map((p) => ({
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

  console.log("Inserting batch 800 - 900 (length: " + batch.length + ")...")
  const { error } = await supabase.from("places").upsert(batch)
  if (error) {
    console.error("Upsert error:", error.message)
  } else {
    console.log("Successfully upserted batch 800 - 900!")
  }

  const { count } = await supabase
    .from("places")
    .select("*", { count: "exact", head: true })
  console.log("Total verified places currently in Supabase DB:", count)
}

retry().catch((err) => console.error(err))
