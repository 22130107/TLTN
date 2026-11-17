const https = require("https")
const lat = 10.7745397
const lon = 106.694759
const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`
https.get(
  url,
  { headers: { "User-Agent": "MinkuraApp/1.0 (info@minkura.local)" } },
  (res) => {
    let data = ""
    res.on("data", (c) => (data += c))
    res.on("end", () => {
      try {
        const json = JSON.parse(data)
        console.log("Full Address:", json.display_name)
        console.log("Road:", json.address.road)
        console.log("Suburb/Ward:", json.address.suburb)
        console.log("City:", json.address.city)
      } catch (e) {
        console.error("Error:", e.message)
      }
    })
  },
)
