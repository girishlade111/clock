import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  allowedDevOrigins: [
    "localhost",
    "127.0.0.1",
    "21.0.5.185",
    "preview-chat-df514e75-0008-4fd8-91a1-cdefd1290672.space-z.ai",
    ".space-z.ai",
  ],
};

export default nextConfig;
