import { redirect } from "next/navigation";

export default function Page({
  params,
  searchParams,
}: {
  params: { phone: string };
  searchParams: { text?: string };
}) {
  const phone = params.phone.replace(/\D/g, ""); // clean number
  const text = searchParams.text || "";

  const url = text
    ? `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
    : `https://wa.me/${phone}`;

  redirect(url);
}
