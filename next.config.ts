import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    webpack(config, { isServer }) {
        if (isServer) {
            config.externals = [...config.externals, {canvas:'canvas'}];
        }

        return config;
    },
    reactStrictMode: true, // Optional: This enables React Strict Mode for better debugging in development
};

export default nextConfig;
