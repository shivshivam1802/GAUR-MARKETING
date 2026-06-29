import crypto from "crypto"

const JWT_SECRET = process.env.JWT_SECRET || "gaur-links-secret-super-key-2026-campaign"

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString("hex")
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")
  return { hash, salt }
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const testHash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")
  return testHash === hash
}

export function signJwt(payload: any): string {
  const header = { alg: "HS256", typ: "JWT" }
  const base64Header = Buffer.from(JSON.stringify(header)).toString("base64url")
  const base64Payload = Buffer.from(JSON.stringify(payload)).toString("base64url")

  const signature = crypto
    .createHmac("sha256", JWT_SECRET)
    .update(`${base64Header}.${base64Payload}`)
    .digest("base64url")

  return `${base64Header}.${base64Payload}.${signature}`
}

export function verifyJwt(token: string): any | null {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    const [header, payload, signature] = parts
    const expectedSignature = crypto
      .createHmac("sha256", JWT_SECRET)
      .update(`${header}.${payload}`)
      .digest("base64url")

    if (signature !== expectedSignature) {
      return null
    }

    return JSON.parse(Buffer.from(payload, "base64url").toString("utf-8"))
  } catch (error) {
    return null
  }
}
