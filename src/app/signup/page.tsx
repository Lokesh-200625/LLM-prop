import { AuthPage } from "@/components/AuthPage";
import { getCurrentUser } from "@/lib/serverAuth";
import { redirect } from "next/navigation";

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }

  return <AuthPage mode="signup" />;
}
