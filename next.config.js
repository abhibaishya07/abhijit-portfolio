/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true
  },
  experimental: {
    optimizePackageImports: ["three", "@react-three/drei", "@react-three/fiber"]
  }
};

module.exports = nextConfig;
