import type { NextConfig } from 'next'
import path from 'path'
const nextConfig: NextConfig = {
    turbopack: {
        root: path.resolve(__dirname, './'),
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'cdn.discordapp.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.unsplash.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
}

export default nextConfig
