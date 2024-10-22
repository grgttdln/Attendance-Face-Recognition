/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'via.placeholder.com',
          port: '', // Leave empty for default port
          pathname: '/**', // Allow all paths under the domain
        },
      ],
    },
  }
  
  export default nextConfig;
  