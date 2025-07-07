import type { NextConfig } from "next";

const backendUrl = process.env.API_HOST || 'http://localhost:3001'

const nextConfig: NextConfig = {
    output: "standalone",
};

export default nextConfig;
