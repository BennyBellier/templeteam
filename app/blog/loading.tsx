import {
  Layout,
  LayoutDescription,
  LayoutHeader,
  LayoutSection,
  LayoutTitle,
} from "@/components/layout/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { Typography } from "@/components/ui/typography";
import PostSkeleton from "./PostSkeleton";

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
      <LayoutSection className="flex gap-6 md:items-start">
        <Typography as="h1" variant="h1" className="mb-4">
          Derniers articles
        </Typography>
        <Skeleton className="h-14 w-92 rounded-xl" />
        <ul className="relative grid h-fit w-full grid-cols-1 justify-around gap-4 pb-16 pt-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <PostSkeleton key={i} />
          ))}
        </ul>
      </LayoutSection>
    </Layout>
  );
}
