import { redirect } from "next/navigation";

export default function Page({
  params,
}: {
  params: { url: string[] };
}) {
  const target = decodeURIComponent(params.url.join("/"));

  redirect(target);
}
