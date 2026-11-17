const { createClient } = require("@supabase/supabase-js")
const fs = require("fs")
const env = fs.readFileSync(".env.local", "utf-8")
const envVars = {}
env.split("\n").forEach((line) => {
  const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
  if (m) envVars[m[1]] = (m[2] || "").replace(/(^['"]|['"]$)/g, "").trim()
})

console.log("SUPABASE_URL:", envVars.NEXT_PUBLIC_SUPABASE_URL)
const supabase = createClient(
  envVars.NEXT_PUBLIC_SUPABASE_URL,
  envVars.NEXT_PUBLIC_SUPABASE_ANON_KEY,
)

async function check() {
  const { data, error } = await supabase
    .from("places")
    .select("id, name")
    .limit(3000)
  if (error) {
    console.error("Supabase query error:", error)
  } else {
    console.log(
      "Total places fetched from Supabase DB:",
      data ? data.length : 0,
    )
    if (data && data.length > 0) {
      console.log(
        "First 5 places:",
        data.slice(0, 5).map((d) => d.name),
      )
      console.log(
        "Last 5 places:",
        data.slice(-5).map((d) => d.name),
      )
    }
  }
}

check()
