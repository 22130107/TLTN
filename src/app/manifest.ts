import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "HYUN - Điểm Hẹn Ẩm Thực Chuẩn Gu",
    short_name: "HYUN",
    description:
      "Khám phá những quán ăn ngon, điểm hẹn chuẩn gu và ẩm thực đặc sắc tại Hà Nội, Sài Gòn, Đà Lạt, Đà Nẵng.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#000000",
    orientation: "portrait-primary",
    scope: "/",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
      {
        src: "/icons/icon-maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
