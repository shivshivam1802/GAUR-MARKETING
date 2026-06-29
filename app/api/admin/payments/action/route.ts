import { NextResponse } from "next/server"
import { readDb, writeDb } from "@/lib/db"
import { verifyJwt } from "@/lib/crypto"

export async function POST(request: Request) {
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

    const body = await request.json()
    const { userId, action } = body

    if (!userId || !action || (action !== "approve" && action !== "reject")) {
      return NextResponse.json({ error: "Invalid request parameters" }, { status: 400 })
    }

    const db = readDb()
    const userIndex = db.users.findIndex((u) => u.id === userId)

    if (userIndex === -1) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    db.users[userIndex].paymentStatus = action === "approve" ? "verified" : "rejected"
    db.users[userIndex].updatedAt = new Date().toISOString()

    writeDb(db)

    return NextResponse.json({
      success: true,
      message: `User payment was successfully ${action === "approve" ? "approved" : "rejected"}.`,
    })
  } catch (error) {
    console.error("Admin payment action error:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
