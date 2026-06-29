import { NextResponse } from "next/server"
import { readDb, writeDb, User } from "@/lib/db"
import { hashPassword } from "@/lib/crypto"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { fullName, email, password, transactionHash, walletAddress } = body

    if (!fullName || !email || !password || !transactionHash) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const db = readDb()

    // 1. Check duplicate email
    const emailExists = db.users.some((u) => u.email.toLowerCase() === email.toLowerCase())
    if (emailExists) {
      return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 })
    }

    // 2. Check duplicate transaction hash
    const hashExists = db.users.some(
      (u) => u.transactionHash && u.transactionHash.toLowerCase() === transactionHash.toLowerCase()
    )
    if (hashExists) {
      return NextResponse.json({ error: "This transaction hash has already been submitted" }, { status: 409 })
    }

    // 3. Hash password
    const { hash, salt } = hashPassword(password)

    // 4. Create user
    const newUser: User = {
      id: crypto.randomUUID(),
      fullName,
      email: email.toLowerCase(),
      passwordHash: hash,
      passwordSalt: salt,
      walletAddress: walletAddress ? walletAddress.trim() : undefined,
      transactionHash: transactionHash.trim(),
      paymentStatus: "pending",
      role: "user",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    db.users.push(newUser)
    writeDb(db)

    return NextResponse.json({
      success: true,
      message: "Account created successfully. Payment submitted for admin review.",
    })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
