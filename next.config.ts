import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1","lyzrproject-two.vercel.app"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lyzrproject-two.vercel.app",
      },
    ],
  },
};

export default nextConfig;
