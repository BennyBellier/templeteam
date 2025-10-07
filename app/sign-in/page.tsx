import SignIn from "@/components/auth/sign-in";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion",
  authors: {
    name: "BELLIER Benjamin",
    url: "https://github.com/BennyBellier",
  },
  category: "sports",
};

export default function SignInPage() {
  return (
    <div className="container flex h-dvh items-center justify-center">
      <SignIn />
    </div>
  );
}
