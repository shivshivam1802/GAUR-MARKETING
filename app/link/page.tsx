import { redirect } from "next/navigation";

export default function Page({
  searchParams,
}: {
  searchParams: { url?: string };
}) {
  const url = searchParams.url;

  if (!url) {
    return <div>No URL provided</div>;
  }

  redirect(url);
}
