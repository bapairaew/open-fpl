const { NEXT_PUBLIC_VERCEL_URL: vercelUrl } = process.env;

export const host = vercelUrl;

export const origin = host ? `https://${host}` : "http://localhost:3000";
