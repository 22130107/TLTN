const https = require("https")

// Bounding box for Ho Chi Minh City (Q1, Q3, Q5, Q10, Binh Thanh, Phu Nhuan, Thu Duc, etc.)
// bbox: south, west, north, east
const bbox = "10.68,106.60,10.85,106.77"

const query = `
[out:json][timeout:25];
(
  node["amenity"~"^(restaurant|cafe|fast_food)$"]["name"](${bbox});
);
out center 50;
`

const postData = "data=" + encodeURIComponent(query)

const servers = ["overpass.kumi.systems", "maps.mail.ru", "overpass-api.de"]

function tryServer(index) {
  if (index >= servers.length) {
    console.error("All servers failed")
    return
  }
  const host = servers[index]
  console.log(`Trying server: ${host}...`)

  const req = https.request(
    {
      hostname: host,
      path:
        host === "maps.mail.ru"
          ? "/osm/tools/overpass/api/interpreter"
          : "/api/interpreter",
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Content-Length": Buffer.byteLength(postData),
        "User-Agent": "MinkuraApp/1.0",
      },
    },
    (res) => {
      let body = ""
      res.on("data", (chunk) => (body += chunk))
      res.on("end", () => {
        try {
          const data = JSON.parse(body)
          console.log(
            `Success from ${host}! Total elements:`,
            data.elements ? data.elements.length : 0,
          )
          if (data.elements && data.elements.length > 0) {
            data.elements.slice(0, 5).forEach((el) => {
              console.log({
                id: el.id,
                name: el.tags.name,
                amenity: el.tags.amenity,
                cuisine: el.tags.cuisine,
                street: el.tags["addr:street"],
                lat: el.lat,
                lon: el.lon,
              })
            })
          }
        } catch (e) {
          console.error(`Failed on ${host}, status: ${res.statusCode}`)
          tryServer(index + 1)
        }
      })
    },
  )

  req.on("error", (err) => {
    console.error(`Error with ${host}:`, err.message)
    tryServer(index + 1)
  })

  req.write(postData)
  req.end()
}

tryServer(0)
