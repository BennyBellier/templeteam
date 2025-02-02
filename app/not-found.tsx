import {
  Layout,
  LayoutDescription,
  LayoutHeader,
  LayoutSection,
  LayoutTitle,
} from "@/components/layout/layout";
import Link from "next/link";

export default function NotFound() {
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Erreur 404</LayoutTitle>
        <LayoutDescription>
          Cette page n&apos;existe pas.
        </LayoutDescription>
      </LayoutHeader>
      <LayoutSection>
          <Link href="/">Retourner à l&apos;accueil</Link>
      </LayoutSection>
    </Layout>
  );
}
