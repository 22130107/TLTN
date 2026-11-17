const https = require("https")

const url =
  "https://nominatim.openstreetmap.org/search?format=json&q=qu%C3%A1n+%C4%83n+Th%C3%A0nh+ph%E1%BB%91+H%E1%BB%93+Ch%C3%AD+Minh&limit=20&addressdetails=1"

const req = https.get(
  url,
  {
    headers: {
      "User-Agent": "MinkuraCulinaryApp/1.0 (contact: support@minkura.local)",
      Accept: "application/json",
    },
  },
  (res) => {
    let data = ""
    res.on("data", (chunk) => (data += chunk))
    res.on("end", () => {
      console.log("Nominatim status:", res.statusCode)
      try {
        const items = JSON.parse(data)
        console.log("Items count:", items.length)
        if (items.length > 0) {
          items.slice(0, 5).forEach((it) => {
            console.log({
              name: it.name || it.display_name.split(",")[0],
              display_name: it.display_name,
              lat: it.lat,
              lon: it.lon,
              type: it.type,
              class: it.class,
              address: it.address,
            })
          })
        }
      } catch (e) {
        console.log("Raw:", data.slice(0, 200))
      }
    })
  },
)

req.on("error", (err) => console.error("Error:", err.message))
