import type { NextConfig } from "next";

const backendUrl = process.env.API_HOST || 'http://localhost:8080'

const nextConfig: NextConfig = {
    rewrites: async () => ({
        beforeFiles: [],
        afterFiles: [],
        fallback: [{
           source: '/subscription',
           destination: `${backendUrl}/subscription`
        }, {
            source: '/graphql',
            destination: `${backendUrl}/graphql`
        }]
    }),
    output: "standalone"
};

export default nextConfig;
