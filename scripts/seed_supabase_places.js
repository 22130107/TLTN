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

// Read TS file src/data/explorePlacesData.ts to get the exact objects
const tsPath = path.join(__dirname, "../src/data/explorePlacesData.ts")
const tsContent = fs.readFileSync(tsPath, "utf-8")

// Parse items from TS content
const items = []
const itemRegex =
  /\{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*badge:\s*"([^"]+)",\s*badgeColor:\s*"([^"]+)",\s*rating:\s*([0-9.]+),\s*reviewCount:\s*"([^"]+)",\s*distance:\s*([0-9.]+),\s*distanceText:\s*"([^"]+)",\s*district:\s*"([^"]+)",\s*tags:\s*(\[[^\]]*\]),\s*description:\s*"([^"]*)",\s*image:\s*"([^"]+)",\s*categoryType:\s*"([^"]+)",\s*priceRange:\s*"([^"]+)",\s*priceText:\s*"([^"]+)",(?:\s*latitude:\s*([0-9.]+),)?(?:\s*longitude:\s*([0-9.]+),)?/g

let match
while ((match = itemRegex.exec(tsContent)) !== null) {
  let tags = []
  try {
    tags = JSON.parse(match[10])
  } catch (e) {
    tags = ["Món ngon", match[9]]
  }

  items.push({
    id: match[1],
    name: match[2],
    badge: match[3],
    badge_color: match[4],
    rating: parseFloat(match[5]),
    review_count: parseInt(match[6].replace(/\D/g, "") || "120", 10),
    district: match[9],
    city: "TP. Hồ Chí Minh",
    address: `Khu ẩm thực ${match[9]}, TP. Hồ Chí Minh`,
    tags: tags,
    story: match[11],
    image: match[12],
    category_id: match[13],
    price_range: match[15],
    hours: "08:00 - 22:30",
    phone: "090" + Math.floor(1000000 + Math.random() * 9000000),
    latitude: match[16] ? parseFloat(match[16]) : 10.7769,
    longitude: match[17] ? parseFloat(match[17]) : 106.7009,
    is_featured: parseFloat(match[5]) >= 4.8,
  })
}

console.log(
  `Parsed ${items.length} places from explorePlacesData.ts! Starting Supabase upload...`,
)

async function seed() {
  const batchSize = 100
  let totalInserted = 0

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize)

    const { data, error } = await supabase
      .from("places")
      .upsert(batch, { onConflict: "id" })

    if (error) {
      console.error(
        `Error in batch ${i + 1} - ${i + batch.length}:`,
        error.message,
      )
    } else {
      totalInserted += batch.length
      console.log(`Uploaded batch: ${totalInserted} / ${items.length}`)
    }
  }

  console.log(
    `\nCOMPLETED! Total places successfully uploaded to Supabase: ${totalInserted}`,
  )

  const countRes = await supabase
    .from("places")
    .select("*", { count: "exact", head: true })
  console.log("Total verified places in Supabase DB:", countRes.count)
}

seed().catch((err) => console.error("Seed fatal error:", err))
