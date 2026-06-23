import { redirect } from "next/navigation";

export default async function Page({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  try {
    // Decode from Base64
    const decodedUrl = Buffer.from(code, "base64").toString("utf-8");
    
    // Quick validation check
    if (!decodedUrl.startsWith("http://") && !decodedUrl.startsWith("https://")) {
      throw new Error("Invalid protocol");
    }
    
    new URL(decodedUrl);
    redirect(decodedUrl);
  } catch (error) {
    // Redirect to home if it fails
    redirect("/?error=invalid_url");
  }
}
