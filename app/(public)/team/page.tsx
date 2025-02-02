import {
  Layout,
  LayoutDescription,
  LayoutHeader,
  LayoutSection,
  LayoutTitle,
} from "@/components/layout/layout";
import { getTeamMembers } from "@/server/get-team";
import Card from "./card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "La Team | Temple Team",
  description:
    "7 athlètes, une seule équipe, des années d'entraînement, il est maintenant l'heure de vous les présenter.",
  authors: {
    name: "BELLIER Benjamin",
    url: "https://github.com/BennyBellier",
  },
  category: "sports",
};

export default async function Team() {
  const members = await getTeamMembers();

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>La Team</LayoutTitle>
        <LayoutDescription>
          7 athlètes, une seule équipe, des années d&apos;entraînement, il est
          maintenant l&apos;heure de vous les présenter.
        </LayoutDescription>
      </LayoutHeader>
      <div className="grid grid-cols-[repeat(auto-fill,_minmax(350px,_1fr))] gap-4 px-5 lg:grid-cols-1">
        {members.map((member) => (
          <LayoutSection key={member.id} className="w-fit justify-self-center">
            <Card member={member} />
          </LayoutSection>
        ))}
      </div>
    </Layout>
  );
}
