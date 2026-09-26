import path from "node:path";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: path.join(__dirname),
  },
  async redirects() {
    return [
      { source: "/work", destination: "/apps", permanent: true },
      { source: "/work/:slug", destination: "/apps/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
