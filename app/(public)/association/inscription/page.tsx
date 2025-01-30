import {
  Layout,
  LayoutDescription,
  LayoutHeader,
  LayoutSection,
  LayoutTitle,
} from "@/components/layout/layout";
import type { Metadata } from "next";
import RegisterForm from "./Form";

export const metadata: Metadata = {
  title: "Inscription | Temple Team",
  description: "Vous souhaitez participez à nos cours, venez vous inscrire !",
  authors: {
    name: "BELLIER Benjamin",
    url: "https://github.com/BennyBellier",
  },
  category: "sports"
};


export default function Register() {
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Inscription</LayoutTitle>
        <LayoutDescription>
          Vous souhaitez participez à nos cours, inscrivez-vous dès maintenant !
        </LayoutDescription>
      </LayoutHeader>
      <LayoutSection className="gap-6">
        <RegisterForm />
      </LayoutSection>
    </Layout>
  );
}
