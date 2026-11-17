const https = require("https")

const url =
  "https://www.foody.vn/__get/Place/HomeListPlace?page=1&limit=5&type=1"
const req = https.get(
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
    res.on("data", (chunk) => (body += chunk))
    res.on("end", () => {
      const json = JSON.parse(body)
      console.log("Total available:", json.Total)
      console.log("Returned items count:", json.Items.length)
      if (json.Items.length > 0) {
        console.log(
          "Detailed first item:",
          JSON.stringify(json.Items[0], null, 2),
        )
      }
    })
  },
)
