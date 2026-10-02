import path from "node:path";
import type { NextConfig } from "next";

// Static export for GitHub Pages hosting (see macos-release-tools skill's
// "Publishing a release repo on GitHub Pages with a custom domain" pattern).
// Note: `redirects()` is ignored under `output: "export"` (no server to run
// it), the /work legacy aliases below don't apply to this fresh domain
// anyway since they were inherited from snapback-web's config.
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  turbopack: {
    root: path.join(__dirname),
  },
};

export default nextConfig;
