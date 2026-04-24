import { redirect } from "next/navigation";

export default function Page(request: any) {
  const url = new URL(request.url);
  const target = url.searchParams.get("url");

  if (target) {
    redirect(target);
  }

  redirect("/");
}
