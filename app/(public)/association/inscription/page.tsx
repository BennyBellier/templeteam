import {
  Layout,
  LayoutDescription,
  LayoutHeader,
  LayoutSection,
  LayoutTitle,
} from "@/components/layout/layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { prisma } from "@/trpc/server";
import { AlertTriangle, Wrench } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inscription | Temple Team",
  description: "Vous souhaitez participez à nos cours, venez vous inscrire !",
  authors: {
    name: "BELLIER Benjamin",
    url: "https://github.com/BennyBellier",
  },
  category: "sports",
};

export default async function Register() {
  // const courses = await prisma.association.getCourses();

  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Inscription</LayoutTitle>
        <LayoutDescription>
          Vous souhaitez participez à nos cours, inscrivez-vous dès maintenant !
        </LayoutDescription>
      </LayoutHeader>
      <LayoutSection className="gap-6">
        <Alert className="border-amber-200 bg-amber-50 max-w-lg">
          <AlertTriangle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">
            Service temporairement indisponible
          </AlertTitle>
          <AlertDescription className="mt-2 text-amber-700">
            Le formulaire d&apos;inscription ne fonctionne pas pour
            l&apos;instant. Notre équipe technique travaille activement à la
            résolution de ce problème.
          </AlertDescription>
        </Alert>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm max-w-md">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-blue-100 p-2">
              <Wrench className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">
                Maintenance en cours
              </h3>
              <p className="text-sm text-slate-600">
                Nous mettons tout en œuvre pour rétablir le service au plus vite
              </p>
            </div>
          </div>
        </div>
        {/* <RegisterForm courses={courses} /> */}
      </LayoutSection>
    </Layout>
  );
}
