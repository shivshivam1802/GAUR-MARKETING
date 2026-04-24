import { redirect } from "next/navigation";

export default function Page({
  params,
  searchParams,
}: {
  params: { phone: string };
  searchParams?: { text?: string };
}) {
  if (!params?.phone) {
    return <div>Invalid number</div>;
  }

  const phone = params.phone.replace(/\D/g, "");
  const text = searchParams?.text;

  let url = `https://wa.me/${phone}`;

  if (text) {
    url += `?text=${encodeURIComponent(text)}`;
  }

  redirect(url);
}
