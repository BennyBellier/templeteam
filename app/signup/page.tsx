import SignUp from "@/components/auth/sign-up";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion",
  authors: {
    name: "BELLIER Benjamin",
    url: "https://github.com/BennyBellier",
  },
  category: "sports",
};

export default function SignUpPage() {
  return <SignUp />;
}
