import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns:[
      {hostname: "silent-retriever-83.convex.cloud"},
    ]
  }
};

export default nextConfig;
