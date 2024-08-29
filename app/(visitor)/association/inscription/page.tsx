import {
    Layout,
    LayoutDescription,
    LayoutHeader,
    LayoutSection,
    LayoutTitle,
} from "@/components/layout/layout";
import { Typography } from "@/components/ui/typography";
import RegisterForm from "./registerForm";
import { env } from "@/env.mjs";

export const revalidate = env.REVALIDATE_TIME ?? 3600;

export default function Page() {
    return (
        <Layout noContact>
        <LayoutHeader>
            <LayoutTitle>Inscription</LayoutTitle>
            <LayoutDescription>
            Vous souhaitez participez à nos cours, Vous trouverez le dossier d'inscription qu'il vous faut !
            </LayoutDescription>
        </LayoutHeader>
        <LayoutSection>
            <div className="grid w-full gap-4 overflow-hidden drop-shadow-xl lg:gap-0 lg:rounded-lg lg:border lg:border-primary">
            <RegisterForm />
            </div>
        </LayoutSection>
        </Layout>
    );
};
