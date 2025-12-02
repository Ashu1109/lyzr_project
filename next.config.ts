import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["localhost", "127.0.0.1","seagull-amusing-optionally.ngrok-free.app"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "seagull-amusing-optionally.ngrok-free.app",
      },
    ],
  },
};

export default nextConfig;
