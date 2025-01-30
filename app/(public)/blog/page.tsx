import {
  Layout,
  LayoutDescription,
  LayoutHeader,
  LayoutSection,
  LayoutTitle,
} from "@/components/layout/layout";
import BlogPostWithSelectors from "./BlogPostWithSelectors";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Temple Team",
  description: "Obtenez les dernières informations sur l'équipe, les derniers articles et bien plus encore.",
  authors: {
    name: "BELLIER Benjamin",
    url: "https://github.com/BennyBellier",
  },
  category: "blog"
};



export default function Blog() {
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Blog</LayoutTitle>
        <LayoutDescription>
          Obtenez les dernières informations sur l&apos;équipe, les derniers
          articles et bien plus encore.
        </LayoutDescription>
      </LayoutHeader>
      <LayoutSection className="flex gap-6 md:items-start">
        <BlogPostWithSelectors />
      </LayoutSection>
    </Layout>
  );
}
