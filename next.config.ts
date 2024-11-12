import { NextConfig } from "next";
import WasmPackPlugin from "@wasm-tool/wasm-pack-plugin";
import path from "path";
import withPWA from 'next-pwa';
const { execSync } = require("child_process");

const nextConfig: NextConfig = {
  // images: {
  //   remotePatterns: [
  //     {
  //       protocol: 'https',
  //       hostname: 'avatars.githubusercontent.com',
  //       port: '',
  //       pathname: '/u/**',
  //     },
  //   ],
  // },
  webpack: (config, { isServer }) => {
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    };
    config.output.webassemblyModuleFilename =
      (isServer ? "../" : "") + "static/wasm/webassembly.wasm";
    
    // Run Rust build command
    execSync("wasm-pack build", {
      cwd: path.resolve(__dirname, "../rust"),
      stdio: "inherit"
    });

    config.plugins.push(
      new WasmPackPlugin({
        crateDirectory: path.resolve(__dirname, "../rust"),
        outDir: path.resolve(__dirname, "../rust/pkg"),
      })
    );
    return config;
  }
};

const finalConfig = withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
});

export default finalConfig;