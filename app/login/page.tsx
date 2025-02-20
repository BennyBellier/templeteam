import { use } from "react";
import { Login } from "@/components/features/Form/Login";
import { Layout, LayoutSection } from "@/components/layout/layout";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Connexion",
  authors: {
    name: "BELLIER Benjamin",
    url: "https://github.com/BennyBellier",
  },
  category: "sports"
};

type Params = Promise<{ error: string, callbackUrl: string }>;
type SearchParams = Promise<Record<string, string> | undefined>;

export type SignInProps = Promise<{
  searchParams?: Record<"error", string>;
}>;

export default function SignIn(props: {params: Params, searchParams: SearchParams}) {
  const searchParams = use(props.searchParams)

  return (
      <section className="relative flex h-fit flex-col items-center px-5 py-6 lg:px-1050 self-center">
        <Login
          errorProps={searchParams?.error}
        />
      </section>
  );
}
