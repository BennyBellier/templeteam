import { Layout, LayoutHeader, LayoutTitle, LayoutDescription, LayoutSection } from '@/components/layout/layout'
import Link from 'next/link'
import { Typography } from "@/components/ui/typography";
import ThreeScene from "@/components/three/ThreeScene"

export default function NotFound() {
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>404 - Page introuvable</LayoutTitle>
        <LayoutDescription>
          La page que vous cherchez n'existe pas.
        </LayoutDescription>
      </LayoutHeader>
      <LayoutSection>
          <ThreeScene className="w-full h-80 overflow-hidden" />

        <Typography as="p" variant="base">
          <Link href="/">Retourner à l'accueil</Link>
        </Typography>
      </LayoutSection>
    </Layout>
  )
}