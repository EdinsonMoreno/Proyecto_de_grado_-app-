/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Habilita el modo estricto de React para detectar problemas potenciales
  env: {
    // URL del backend, puedes cambiarla según el entorno
    NEXT_PUBLIC_BACKEND_URL: "http://localhost:8000", // Cambia esto por la URL de tu backend en producción
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*", // Redirige las solicitudes a /api/ al backend
        destination: "http://localhost:8000/:path*", // Cambia esto si el backend está en otro dominio o puerto
      },
    ];
  },
};

module.exports = nextConfig;