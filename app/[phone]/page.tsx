import { redirect } from "next/navigation";

export default function Page({
  params,
  searchParams,
}: {
  params: { phone: string };
  searchParams?: { text?: string };
}) {
  const phone = params.phone; // ✅ use as-is (NO cleaning)
  const text = searchParams?.text;

  let url = `https://wa.me/${phone}`;

  if (text) {
    url += `?text=${encodeURIComponent(text)}`;
  }

  redirect(url);
}
