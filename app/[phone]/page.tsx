import { redirect } from "next/navigation";

export default function Page({ params }: { params: { phone: string } }) {
  const phone = params.phone;

  // Optional: clean number (remove spaces, +, etc.)
  const cleanPhone = phone.replace(/\D/g, "");

  redirect(`https://wa.me/${cleanPhone}`);
}
