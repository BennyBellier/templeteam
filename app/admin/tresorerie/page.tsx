import type { Metadata } from "next";
import { AdminPageTitle } from "../components/page-title";
import { Suspense } from "react";
import { SubscriptionsList } from "./components/table";

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
      <AdminPageTitle
        title="Gestion des cotisation"
        subtitle="Gérez les cotisations et suivez l'état des paiements"
      />
      <div className="container px-4 py-4 sm:px-6 sm:py-5 lg:py-6">
          <Suspense>
            <SubscriptionsList />
          </Suspense>
      </div>
    </>
  );
}
