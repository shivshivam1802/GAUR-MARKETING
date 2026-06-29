import { NextResponse } from "next/server"
import { readDb } from "@/lib/db"
import { verifyJwt } from "@/lib/crypto"

export async function GET(request: Request) {
  try {
    const cookieHeader = request.headers.get("cookie") || ""
    const cookies = Object.fromEntries(
      cookieHeader.split(";").map((c) => c.trim().split("="))
    )
    const token = cookies["gaur_session"]

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const payload = verifyJwt(token)
    if (!payload || payload.role !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const db = readDb()
    const users = db.users
      .filter((u) => u.role === "user")
      .map((u) => ({
        id: u.id,
        fullName: u.fullName,
        email: u.email,
        walletAddress: u.walletAddress,
        transactionHash: u.transactionHash,
        paymentStatus: u.paymentStatus,
        createdAt: u.createdAt,
      }))

    return NextResponse.json({ payments: users })
  } catch (error) {
    console.error("Admin payments list error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
