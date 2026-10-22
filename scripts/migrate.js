// Script to automatically create tables and seed data on Supabase
const https = require("https")
const fs = require("fs")
const path = require("path")

// Load from .env.local if not already in environment
const envLocalPath = path.join(__dirname, "../.env.local")
if (fs.existsSync(envLocalPath)) {
  const envContent = fs.readFileSync(envLocalPath, "utf-8")
  for (const line of envContent.split("\n")) {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
    if (match) {
      const key = match[1]
      let value = match[2] || ""
      value = value.replace(/(^['"]|['"]$)/g, "").trim()
      if (!process.env[key]) {
        process.env[key] = value
      }
    }
  }
}

const projectRef = "txvbusjuxiirlatakkbh"
const accessToken = process.env.SUPABASE_ACCESS_TOKEN

if (!accessToken || !accessToken.startsWith("sbp_")) {
  console.error("Missing valid SUPABASE_ACCESS_TOKEN (must start with sbp_...)")
  process.exit(1)
}

const schemaSql = fs.readFileSync(
  path.join(__dirname, "../supabase/schema.sql"),
  "utf-8",
)
const seedSql = fs.readFileSync(
  path.join(__dirname, "../supabase/seed.sql"),
  "utf-8",
)

async function executeQuery(sql, label) {
  console.log(`Executing ${label}...`)
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({ query: sql })
    const req = https.request(
      `https://api.supabase.com/v1/projects/${projectRef}/database/query`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(postData),
        },
      },
      (res) => {
        let body = ""
        res.on("data", (chunk) => (body += chunk))
        res.on("end", () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            console.log(`✅ ${label} executed successfully!`)
            resolve(body)
          } else {
            console.error(
              `❌ ${label} failed with status ${res.statusCode}:`,
              body,
            )
            reject(new Error(body))
          }
        })
      },
    )

    req.on("error", (err) => reject(err))
    req.write(postData)
    req.end()
  })
}

async function run() {
  try {
    await executeQuery(
      schemaSql,
      "schema.sql (Creating all 7 tables, triggers & RLS)",
    )
    await executeQuery(
      seedSql,
      "seed.sql (Populating mock places, articles & reviews)",
    )
    console.log(
      "🎉 Complete! Database is fully initialized and synced with the UI.",
    )
  } catch (err) {
    console.error("Migration error:", err.message)
    process.exit(1)
  }
}

run()
