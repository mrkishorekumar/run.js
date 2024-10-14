/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "runjs.rigial.com",
        port: "",
        pathname: "/",
      },
    ],
  },
};

export default nextConfig;
