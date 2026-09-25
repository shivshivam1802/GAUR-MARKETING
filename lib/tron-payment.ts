const DEFAULT_USDT_CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t"
const DEFAULT_DECIMALS = 6

type TronTransactionResponse = {
  data?: Array<{ ret?: Array<{ contractRet?: string }> }>
}

type TronEventsResponse = {
  data?: Array<{
    event_name?: string
    result?: { from?: string; to?: string; value?: string | number }
    token_info?: { address?: string; symbol?: string; decimals?: number }
  }>
}

export type PaymentVerification = {
  verified: boolean
  reason: string
  transactionHash: string
  amount?: string
  token?: string
  sender?: string
  recipient?: string
}

export function extractTransactionHash(value: string) {
  const match = value.trim().match(/[a-fA-F0-9]{64}/)
  return match?.[0].toLowerCase() || ""
}

function toBaseUnits(amount: string, decimals: number) {
  const [whole, fraction = ""] = amount.split(".")
  const paddedFraction = fraction.padEnd(decimals, "0").slice(0, decimals)
  let multiplier = BigInt(1)
  for (let index = 0; index < decimals; index += 1) multiplier *= BigInt(10)
  return BigInt(whole || "0") * multiplier + BigInt(paddedFraction || "0")
}

export async function verifyTronPayment(input: string): Promise<PaymentVerification> {
  const transactionHash = extractTransactionHash(input)
  if (!transactionHash) {
    return { verified: false, reason: "Enter a valid transaction hash or TronScan URL.", transactionHash: "" }
  }

  const recipient = (process.env.PAYMENT_WALLET_ADDRESS || "").trim()
  const tokenContract = (process.env.PAYMENT_TOKEN_CONTRACT || DEFAULT_USDT_CONTRACT).trim()
  const requiredAmount = process.env.PAYMENT_REQUIRED_USDT || "10"
  const apiUrl = process.env.TRONGRID_API_URL || "https://api.trongrid.io"
  const apiKey = process.env.TRONGRID_API_KEY
  if (!recipient) {
    throw new Error("PAYMENT_WALLET_ADDRESS is not configured")
  }

  const headers: HeadersInit = apiKey ? { "TRON-PRO-API-KEY": apiKey } : {}
  const transactionResponse = await fetch(`${apiUrl}/v1/transactions/${transactionHash}`, { headers, cache: "no-store" })
  if (!transactionResponse.ok) throw new Error("Unable to query the TRON transaction")
  const transaction = (await transactionResponse.json()) as TronTransactionResponse
  const contractResult = transaction.data?.[0]?.ret?.[0]?.contractRet
  if (contractResult !== "SUCCESS") {
    return { verified: false, reason: "The transaction is not confirmed as successful.", transactionHash }
  }

  const eventsResponse = await fetch(`${apiUrl}/v1/transactions/${transactionHash}/events?only_confirmed=true&limit=200`, { headers, cache: "no-store" })
  if (!eventsResponse.ok) throw new Error("Unable to query the TRC20 transfer events")
  const events = (await eventsResponse.json()) as TronEventsResponse
  const expectedAmount = toBaseUnits(requiredAmount, DEFAULT_DECIMALS)
  const transfer = events.data?.find((event) => {
    const tokenMatches = event.token_info?.address?.toLowerCase() === tokenContract.toLowerCase()
    const recipientMatches = event.result?.to?.toLowerCase() === recipient.toLowerCase()
    const amount = BigInt(String(event.result?.value || "0"))
    return event.event_name === "Transfer" && tokenMatches && recipientMatches && amount >= expectedAmount
  })

  if (!transfer) {
    return { verified: false, reason: "No matching USDT transfer to the configured wallet was found.", transactionHash }
  }

  const decimals = transfer.token_info?.decimals ?? DEFAULT_DECIMALS
  const rawAmount = BigInt(String(transfer.result?.value || "0"))
  const amount = Number(rawAmount) / 10 ** decimals
  return {
    verified: true,
    reason: "Confirmed TRC20 payment received.",
    transactionHash,
    amount: amount.toFixed(decimals).replace(/0+$/, "").replace(/\.$/, ""),
    token: transfer.token_info?.symbol || "USDT",
    sender: transfer.result?.from,
    recipient: transfer.result?.to,
  }
}
