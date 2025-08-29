import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sxcontent9668.azureedge.us",
      },
      {
        protocol: "https",
        hostname: "www.spacex.com",
      },
      {
        protocol: "https",
        hostname: "sxcontent9668.azureedge.us",
      },
      {
        protocol: "https",
        hostname: "images2.imgbox.com",
      },
    ],
  },
};

export default nextConfig;
