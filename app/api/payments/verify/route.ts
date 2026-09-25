import { NextResponse } from "next/server"
import { verifyTronPayment } from "@/lib/tron-payment"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const reference = typeof body.reference === "string" ? body.reference : ""
    const result = await verifyTronPayment(reference)
    return NextResponse.json(result, { status: result.verified || result.transactionHash ? 200 : 400 })
  } catch (error) {
    console.error("Payment verification error:", error)
    return NextResponse.json({ verified: false, reason: "Payment provider verification is temporarily unavailable." }, { status: 502 })
  }
}
