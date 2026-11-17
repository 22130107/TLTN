const https = require("https")

const query = `[out:json][timeout:15];node["amenity"~"restaurant|cafe"]["name"](10.77,106.69,10.78,106.70);out 10;`

const req = https.request(
  {
    hostname: "overpass.osm.ch",
    path: "/api/interpreter",
    method: "POST",
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
      console.log("overpass.osm.ch status:", res.statusCode)
      try {
        const parsed = JSON.parse(data)
        console.log("Count:", parsed.elements ? parsed.elements.length : 0)
        if (parsed.elements && parsed.elements.length > 0) {
          parsed.elements.forEach((el) => console.log("Place:", el.tags.name))
        }
      } catch (e) {
        console.log("Response:", data.slice(0, 150))
      }
    })
  },
)

req.on("error", (err) => console.log("Error:", err.message))
req.write(query)
req.end()
