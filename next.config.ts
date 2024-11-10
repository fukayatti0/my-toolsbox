import { NextConfig } from "next";
import WasmPackPlugin from "@wasm-tool/wasm-pack-plugin";
import path from "path";

const nextConfig: NextConfig = {
  images: {
    domains: ["avatars.githubusercontent.com"],
  },
  webpack: (config, { isServer }) => {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };
    config.output.webassemblyModuleFilename =
      (isServer ? "../" : "") + "static/wasm/webassembly.wasm";
    config.plugins.push(
      new WasmPackPlugin({
        crateDirectory: path.resolve(__dirname, "../rust"),
        outDir: path.resolve(__dirname, "../rust/pkg"),
      })
    );
    return config;
  },
};

export default nextConfig;
