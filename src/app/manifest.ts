import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LifeHQ",
    short_name: "LifeHQ",
    description: "Justin's personal home base.",
    start_url: "/",
    display: "standalone",
    background_color: "#13201e",
    theme_color: "#13201e",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
