import fs from "fs"
import path from "path"
import crypto from "crypto"

const DB_DIR = path.join(process.cwd(), "data")
const DB_FILE = path.join(DB_DIR, "db.json")

export interface User {
  id: string
  fullName: string
  email: string
  passwordHash: string
  passwordSalt: string
  walletAddress?: string
  transactionHash?: string
  paymentStatus: "pending" | "verified" | "rejected"
  role: "user" | "admin"
  createdAt: string
  updatedAt: string
}

interface DatabaseSchema {
  users: User[]
}

function initializeDb() {
  if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true })
  }

  if (!fs.existsSync(DB_FILE)) {
    const defaultDb: DatabaseSchema = { users: [] }
    fs.writeFileSync(DB_FILE, JSON.stringify(defaultDb, null, 2), "utf-8")
  }

  seedAdmin()
}

function seedAdmin() {
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8")
    const db: DatabaseSchema = JSON.parse(data)
    const adminEmail = "admin@gaurlinks.com"
    const adminExists = db.users.some((u) => u.email === adminEmail)

    if (!adminExists) {
      const password = "AdminPass123!"
      const salt = crypto.randomBytes(16).toString("hex")
      const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex")

      const adminUser: User = {
        id: "admin-id-1",
        fullName: "Platform Administrator",
        email: adminEmail,
        passwordHash: hash,
        passwordSalt: salt,
        paymentStatus: "verified",
        role: "admin",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      db.users.push(adminUser)
      fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8")
      console.log("Database seeded with default admin account: admin@gaurlinks.com")
    }
  } catch (error) {
    console.error("Failed to seed admin:", error)
  }
}

export function readDb(): DatabaseSchema {
  initializeDb()
  try {
    const data = fs.readFileSync(DB_FILE, "utf-8")
    return JSON.parse(data)
  } catch (error) {
    console.error("Failed to read database:", error)
    return { users: [] }
  }
}

export function writeDb(data: DatabaseSchema) {
  initializeDb()
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8")
  } catch (error) {
    console.error("Failed to write to database:", error)
  }
}
