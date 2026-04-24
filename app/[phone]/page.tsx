import { redirect } from "next/navigation";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ phone: string }>;
  searchParams?: Promise<{ text?: string }>;
}) {
  const { phone } = await params;
  const sp = searchParams ? await searchParams : {};
  const text = sp?.text;

  let url = `https://wa.me/${phone}`;

  if (text) {
    url += `?text=${encodeURIComponent(text)}`;
  }

  redirect(url);
}
