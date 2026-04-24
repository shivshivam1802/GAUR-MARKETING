import { redirect } from "next/navigation";

export default function Page({
  searchParams,
}: {
  searchParams: { url?: string };
}) {
  redirect(searchParams.url || "/");
}
