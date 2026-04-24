import { redirect } from "next/navigation";

export const dynamic = "force-dynamic"; // ✅ IMPORTANT

export default function Page({
  searchParams,
}: {
  searchParams: { url?: string };
}) {
  const target = searchParams?.url;

  if (target) {
    redirect(target);
  }

  redirect("/");
}
