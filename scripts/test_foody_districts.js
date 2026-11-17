const https = require("https")

async function testParam(url) {
  return new Promise((resolve) => {
    https
      .get(
        url,
        {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "X-Requested-With": "XMLHttpRequest",
          },
        },
        (res) => {
          let body = ""
          res.on("data", (c) => (body += c))
          res.on("end", () => {
            try {
              const json = JSON.parse(body)
              resolve(json.Items || [])
            } catch (e) {
              resolve([])
            }
          })
        },
      )
      .on("error", () => resolve([]))
  })
}

async function run() {
  const d1 = await testParam(
    "https://www.foody.vn/__get/Place/HomeListPlace?page=1&limit=12&type=1&districtId=1",
  )
  console.log("districtId=1 count:", d1.length, d1[0] ? d1[0].Address : "none")

  const d5 = await testParam(
    "https://www.foody.vn/__get/Place/HomeListPlace?page=1&limit=12&type=1&districtId=5",
  )
  console.log("districtId=5 count:", d5.length, d5[0] ? d5[0].Address : "none")
}

run()
