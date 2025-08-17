/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['res.cloudinary.com'],
  },
  eslint: {
    // Ignora ESLint solo durante el build para no bloquear la compilación
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
