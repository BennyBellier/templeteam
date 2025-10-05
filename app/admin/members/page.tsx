import type { Metadata } from "next";
import { MembersTable } from "./components/members-tables";
import { AdminPageTitle } from "../components/page-title";

export const metadata: Metadata = {
  title: "Administration | Temple Team",
  description: "Gestion de l'association.",
  authors: {
    name: "BELLIER Benjamin",
    url: "https://github.com/BennyBellier",
  },
  category: "sports",
};

export default async function AdminMembersList() {
  return (
    <>
      <AdminPageTitle title="Liste des adhérents" />
      <div className="container flex flex-1 flex-col gap-4 px-4 py-4 sm:px-6 sm:py-5 lg:py-6">
        <MembersTable />
      </div>
    </>
  );
}
