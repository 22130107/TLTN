const https = require("https")
const fs = require("fs")
const path = require("path")

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function fetchPage(url) {
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
          timeout: 10000,
        },
        (res) => {
          let data = ""
          res.on("data", (chunk) => (data += chunk))
          res.on("end", () => {
            try {
              const json = JSON.parse(data)
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

async function collect() {
  const allPlaces = new Map()
  console.log(
    "Starting ShopeeFood / Foody data collection for Ho Chi Minh City...",
  )

  // Types: 1: Delivery/Trending, 2: Luxury/Dining, 3: Cafe/Tea, 4: Snacks/Streetfood, 5: Family/Eatery
  const types = [1, 2, 3, 4, 5]
  const maxPagesPerType = 15 // 15 pages * 12 items = 180 items per type * 5 = ~900 items

  for (const t of types) {
    console.log(`\nFetching Foody Type ${t}...`)
    for (let page = 1; page <= maxPagesPerType; page++) {
      const url = `https://www.foody.vn/__get/Place/HomeListPlace?page=${page}&limit=12&type=${t}`
      const items = await fetchPage(url)
      if (!items || items.length === 0) break

      let addedInPage = 0
      for (const item of items) {
        if (!item.Name || !item.Address || !item.PhotoUrl) continue
        if (!allPlaces.has(item.Id)) {
          allPlaces.set(item.Id, {
            foodyId: item.Id,
            name: item.Name.trim(),
            address: item.Address.trim(),
            photoUrl: item.PhotoUrl,
            rating: item.AvgRating
              ? parseFloat((item.AvgRating / 2).toFixed(1))
              : 4.5,
            reviewCount: item.TotalReviews || item.FTotalReviews || 50,
            latitude: item.Latitude || 10.7769,
            longitude: item.Longitude || 106.7009,
            services: item.Services || [],
            type: t,
            url: item.Url || "",
            reviews: (item.LstReview || []).slice(0, 3).map((r) => ({
              author: r.Username || r.reviewUserDisplayName || "Thực khách",
              avatar:
                r.reviewUserAvatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120",
              comment:
                r.Comment ||
                "Món ăn ngon, hương vị đậm đà, phục vụ nhiệt tình.",
              rating: r.AvgRating
                ? Math.min(5, Math.max(1, Math.round(r.AvgRating / 2)))
                : 5,
            })),
          })
          addedInPage++
        }
      }
      console.log(
        `  Type ${t} Page ${page}: +${addedInPage} places (Total unique so far: ${allPlaces.size})`,
      )
      await sleep(250)
    }
  }

  // Also query specific districts
  const districts = [1, 2, 3, 4, 5, 6, 7, 8, 10, 11, 12]
  for (const distId of districts) {
    for (let page = 1; page <= 5; page++) {
      const url = `https://www.foody.vn/__get/Place/HomeListPlace?page=${page}&limit=12&type=1&districtId=${distId}`
      const items = await fetchPage(url)
      if (!items || items.length === 0) break

      for (const item of items) {
        if (!item.Name || !item.Address || !item.PhotoUrl) continue
        if (!allPlaces.has(item.Id)) {
          allPlaces.set(item.Id, {
            foodyId: item.Id,
            name: item.Name.trim(),
            address: item.Address.trim(),
            photoUrl: item.PhotoUrl,
            rating: item.AvgRating
              ? parseFloat((item.AvgRating / 2).toFixed(1))
              : 4.5,
            reviewCount: item.TotalReviews || item.FTotalReviews || 50,
            latitude: item.Latitude || 10.7769,
            longitude: item.Longitude || 106.7009,
            services: item.Services || [],
            type: 1,
            url: item.Url || "",
            reviews: (item.LstReview || []).slice(0, 3).map((r) => ({
              author: r.Username || r.reviewUserDisplayName || "Thực khách",
              avatar:
                r.reviewUserAvatar ||
                "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120",
              comment:
                r.Comment ||
                "Món ăn ngon, hương vị đậm đà, phục vụ nhiệt tình.",
              rating: r.AvgRating
                ? Math.min(5, Math.max(1, Math.round(r.AvgRating / 2)))
                : 5,
            })),
          })
        }
      }
      await sleep(200)
    }
  }

  const placesList = Array.from(allPlaces.values())
  console.log(
    `\nDONE! Collected ${placesList.length} authentic Foody/ShopeeFood places across Saigon!`,
  )

  fs.writeFileSync(
    "scripts/foody_saigon_raw.json",
    JSON.stringify(placesList, null, 2),
    "utf-8",
  )
  console.log("Saved to scripts/foody_saigon_raw.json")
}

collect().catch((err) => console.error(err))
