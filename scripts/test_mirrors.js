const https = require("https")

const query = `[out:json][timeout:15];node["amenity"="restaurant"]["name"](10.76,106.68,10.79,106.71);out 20;`

const req = https.request(
  {
    hostname: "maps.mail.ru",
    path: "/osm/tools/overpass/api/interpreter",
    method: "POST",
    rejectUnauthorized: false,
    headers: {
      "Content-Type": "text/plain",
      "Content-Length": Buffer.byteLength(query),
      "User-Agent": "MinkuraHcm/1.0",
    },
    timeout: 10000,
  },
  (res) => {
    let data = ""
    res.on("data", (chunk) => (data += chunk))
    res.on("end", () => {
      console.log("Status:", res.statusCode)
      try {
        const parsed = JSON.parse(data)
        console.log("Elements:", parsed.elements ? parsed.elements.length : 0)
        if (parsed.elements && parsed.elements.length > 0) {
          console.log("First place:", parsed.elements[0].tags.name)
        }
      } catch (e) {
        console.log("Response preview:", data.slice(0, 200))
      }
    })
  },
)

req.on("error", (err) => console.error("Req error:", err.message))
req.write(query)
req.end()
