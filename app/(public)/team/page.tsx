/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Layout,
  LayoutDescription,
  LayoutHeader,
  LayoutSection,
  LayoutTitle,
} from "@/components/layout/layout";
import { env } from "@/env.mjs";
import { getTeamMembers } from "@/server/get-team";
import Card from "./card";

export const revalidate = env.REVALIDATE_TIME ?? 3600;

export default async function Team() {
  const members = await getTeamMembers();

  const membersComponents = members.map((member) => (
    <LayoutSection key={member.id} className="w-fit justify-self-center">
      <Card member={member} />
    </LayoutSection>
  ));

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
        {membersComponents}
      </div>
    </Layout>
  );
}
