import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,

  // Turbopack empty config — silences the warning and keeps Turbopack stable
  turbopack: {},

  experimental: {
    workerThreads: false,
    cpus: 1,
  },
};

export default nextConfig;
