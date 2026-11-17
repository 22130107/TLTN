const https = require("https")

// Test ShopeeFood / Foody public endpoints
const endpoints = [
  {
    name: "Foody HomeListPlace",
    url: "https://www.foody.vn/__get/Place/HomeListPlace?page=1&limit=10&type=1",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "X-Requested-With": "XMLHttpRequest",
    },
  },
  {
    name: "ShopeeFood browse",
    url: "https://gappapi.deliverynow.vn/api/delivery/get_browse_list?category_group=1&city_id=217&district_id=&page=1&page_size=10",
    headers: {
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "x-foody-api-version": "1",
      "x-foody-app-type": "1004",
      "x-foody-client-id": "",
      "x-foody-client-language": "vi",
      "x-foody-client-type": "1",
      "x-foody-client-version": "3.0.0",
    },
  },
]

async function test(ep) {
  return new Promise((resolve) => {
    console.log(`Testing ${ep.name}...`)
    const req = https.get(
      ep.url,
      { headers: ep.headers, timeout: 8000 },
      (res) => {
        let data = ""
        res.on("data", (chunk) => (data += chunk))
        res.on("end", () => {
          console.log(
            `${ep.name} status: ${res.statusCode}, length: ${data.length}`,
          )
          try {
            const json = JSON.parse(data)
            console.log(
              `${ep.name} SUCCESS parsed JSON! Keys:`,
              Object.keys(json),
            )
            resolve({ success: true, data: json })
          } catch (e) {
            console.log(`${ep.name} Response preview:`, data.slice(0, 150))
            resolve({ success: false })
          }
        })
      },
    )
    req.on("error", (err) => {
      console.log(`${ep.name} error:`, err.message)
      resolve({ success: false })
    })
  })
}

async function run() {
  for (const ep of endpoints) {
    const res = await test(ep)
    if (res.success) {
      console.log("Sample data:", JSON.stringify(res.data).slice(0, 300))
    }
  }
}

run()
