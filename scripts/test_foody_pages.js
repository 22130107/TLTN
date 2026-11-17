const https = require("https")

async function testFetch(page) {
  return new Promise((resolve) => {
    const url = `https://www.foody.vn/__get/Place/HomeListPlace?page=${page}&limit=50&type=1`
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
              console.log(
                `Page ${page}: got ${json.Items ? json.Items.length : 0} items`,
              )
              resolve(json.Items || [])
            } catch (e) {
              console.error(`Page ${page} error:`, e.message)
              resolve([])
            }
          })
        },
      )
      .on("error", (err) => {
        console.error(`Page ${page} req error:`, err.message)
        resolve([])
      })
  })
}

async function run() {
  const p1 = await testFetch(1)
  const p2 = await testFetch(2)
  console.log(
    "Sample item from page 2:",
    p2[0]
      ? { name: p2[0].Name, address: p2[0].Address, photo: p2[0].PhotoUrl }
      : "none",
  )
}

run()
