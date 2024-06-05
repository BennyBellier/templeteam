import {
  Layout,
  LayoutDescription,
  LayoutHeader,
  LayoutSection,
  LayoutTitle,
} from "@/components/layout/layout";
import { Typography } from "@/components/ui/typography";
import PostSkeleton from "./PostSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default async function LoadingPage() {
  return (
    <Layout>
      <LayoutHeader>
        <LayoutTitle>Blog</LayoutTitle>
        <LayoutDescription>
          Obtenez les dernières informations sur l&apos;équipe, les derniers
          articles et bien plus encore.
        </LayoutDescription>
      </LayoutHeader>
      <LayoutSection className="md:items-start">
        <Typography as="h1" variant="h1" className="mb-4">
          Derniers articles
        </Typography>
        <Skeleton className="rounded-full h-16 w-64" />
        {Array.from({ length: 5 }).map((_, i) => (
          <PostSkeleton key={i} />
        ))}
      </LayoutSection>
    </Layout>
  );
}
