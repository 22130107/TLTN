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

async function seedExtras() {
  console.log("Seeding categories into Singapore Supabase...")
  const categories = [
    {
      id: "quan-an",
      name: "Quán ăn",
      icon: "🍙",
      description: "Các quán ăn gia đình, đặc sản truyền thống",
      display_order: 1,
    },
    {
      id: "ca-phe",
      name: "Cà phê & Trà",
      icon: "☕",
      description: "Không gian cà phê chill, làm việc và hẹn hò",
      display_order: 2,
    },
    {
      id: "nha-hang",
      name: "Nhà hàng",
      icon: "🍽️",
      description: "Nhà hàng sang trọng, ẩm thực Nhật, Âu, Á",
      display_order: 3,
    },
    {
      id: "via-he",
      name: "Quán vỉa hè",
      icon: "🏮",
      description: "Ăn vặt đường phố, nhậu đêm bình dân",
      display_order: 4,
    },
    {
      id: "khac",
      name: "Khác",
      icon: "🌸",
      description: "Tiệm bánh, tráng miệng, ẩm thực chay",
      display_order: 5,
    },
  ]
  const { error: catErr } = await supabase.from("categories").upsert(categories)
  if (catErr) console.error("Categories error:", catErr.message)
  else console.log("Categories seeded successfully!")

  const { count: pCount } = await supabase
    .from("places")
    .select("*", { count: "exact", head: true })
  const { count: cCount } = await supabase
    .from("categories")
    .select("*", { count: "exact", head: true })

  console.log("\n--- VERIFICATION STATS ---")
  console.log("Supabase Project URL:", envVars.NEXT_PUBLIC_SUPABASE_URL)
  console.log("Total Places in DB:", pCount)
  console.log("Total Categories in DB:", cCount)

  // Measure latency to Singapore
  const t0 = Date.now()
  await supabase.from("places").select("id, name").limit(10)
  const latency = Date.now() - t0
  console.log(`Measured DB Query Round-trip latency: ${latency}ms`)
}

seedExtras().catch((err) => console.error(err))
