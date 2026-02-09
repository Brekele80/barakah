/* eslint-disable @typescript-eslint/no-explicit-any */
import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig = {
  turbopack: {},
};

export default withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
})(nextConfig as any);
