import type { NextConfig } from "next";

// Origem da API (esquema + host + porta) para o connect-src; vazia se a variável não existir
// ou não for uma URL válida. NEXT_PUBLIC_API_URL é lida na build.
function apiOrigin(): string | null {
  const url = process.env.NEXT_PUBLIC_API_URL;
  if (!url) return null;
  try {
    return new URL(url).origin;
  } catch {
    return null;
  }
}

const connectSrc = ["'self'", apiOrigin()].filter(Boolean).join(" ");

// Política inicial em modo report-only: não bloqueia nada, só reporta violações no console.
// Quando for validada (Clerk, YouTube, estilos inline do Editor.js/VexFlow), trocar para
// o header `Content-Security-Policy` e restringir `unsafe-inline`/`unsafe-eval`.
const cspReportOnly = [
  "default-src 'self'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  `connect-src ${connectSrc}`,
  "frame-src https://www.youtube-nocookie.com",
  "img-src 'self' data: https:",
  "style-src 'self' 'unsafe-inline'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Content-Security-Policy-Report-Only", value: cspReportOnly },
];

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
