import { NextConfig } from "next";
import WasmPackPlugin from "@wasm-tool/wasm-pack-plugin";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  webpack(config, { isServer, dev }) {
    config.experiments = {
      ...config.experiments,
      asyncWebAssembly: true,
      layers: true,
    };
    config.output.webassemblyModuleFilename =
      isServer && !dev
        ? "../static/wasm/[modulehash].wasm"
        : "static/wasm/[modulehash].wasm";

    return config;
  },
};

export default nextConfig;
