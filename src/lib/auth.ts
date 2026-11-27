const SECRET_KEY =
  process.env.ADMIN_SESSION_SECRET ||
  process.env.SUPABASE_SERVICE_ROLE_KEY ||
  "force-fuel-admin-production-secret-hmac-key-2026-secure";

export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@forcefuel.com";
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

async function getKey(): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return await crypto.subtle.importKey(
    "raw",
    enc.encode(SECRET_KEY),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

function base64UrlEncode(str: string): string {
  return Buffer.from(str, "binary")
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  return Buffer.from(base64, "base64").toString("binary");
}

export async function createAdminToken(email: string): Promise<string> {
  const header = base64UrlEncode(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload = base64UrlEncode(
    JSON.stringify({
      email,
      role: "admin",
      exp: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
    })
  );

  const dataToSign = new TextEncoder().encode(`${header}.${payload}`);
  const key = await getKey();
  const signatureBuffer = await crypto.subtle.sign("HMAC", key, dataToSign);

  let binary = "";
  const bytes = new Uint8Array(signatureBuffer);
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  const signature = base64UrlEncode(binary);

  return `${header}.${payload}.${signature}`;
}

export async function verifyAdminToken(token: string | undefined | null): Promise<boolean> {
  if (!token || typeof token !== "string") return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;

  const [header, payload, signature] = parts;
  try {
    const payloadObj = JSON.parse(base64UrlDecode(payload));
    if (!payloadObj.exp || payloadObj.exp < Date.now()) {
      return false;
    }
    if (payloadObj.role !== "admin") {
      return false;
    }

    const key = await getKey();
    const dataToVerify = new TextEncoder().encode(`${header}.${payload}`);

    const sigBinary = base64UrlDecode(signature);
    const sigBytes = new Uint8Array(sigBinary.length);
    for (let i = 0; i < sigBinary.length; i++) {
      sigBytes[i] = sigBinary.charCodeAt(i);
    }

    return await crypto.subtle.verify("HMAC", key, sigBytes, dataToVerify);
  } catch {
    return false;
  }
}

export function checkAdminCredentials(email: string, password: string): boolean {
  if (!email || !password) return false;
  return (
    email.trim().toLowerCase() === ADMIN_EMAIL.trim().toLowerCase() &&
    password === ADMIN_PASSWORD
  );
}
