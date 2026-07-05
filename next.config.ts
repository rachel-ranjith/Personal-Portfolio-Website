import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Keep the dev badge out of the constellation legend (dev-only; gone in prod).
  devIndicators: { position: "bottom-right" },
};

export default nextConfig;
