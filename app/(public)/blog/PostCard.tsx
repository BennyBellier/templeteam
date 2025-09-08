"use client";

import { ImageWithLoader } from "@/components/features/withLoader/ImageWithLoader";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Typography } from "@/components/ui/typography";
import { categoryToText, cn } from "@/lib/utils";
import type { BlogPosts } from "@prisma/client";
import { useInView } from "framer-motion";
import { Clock } from "lucide-react";
import Link from "next/link";
import { useRef } from "react";

export default function PostCard({
  post,
  displayCategory,
}: {
  post: BlogPosts;
  displayCategory: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const LinkClass = cn(
    "group ease min-h-32 min-w-52 max-w-80 overflow-hidden rounded-xl duration-500 select-none focus-visible:outline-none"
  );

  const CardClass = cn(
    "group duration-500 hover:scale-95 focus-visible:scale-95 group-hover:scale-95 group-focus-visible:scale-95 outline-primary outline-2 group-focus-visible:outline",
    isInView ? "" : "scale-95 opacity-0 delay-1000",
  );

  const BlogCard = (
    <Card className={CardClass}>
      <CardHeader className="relative h-48 space-y-0 overflow-hidden p-0">
        <ImageWithLoader
          src={`/img/posts/thumbnails/${post.thumbnail}`}
          alt={`Photo de ${post.title}`}
          fill
          sizes="192px"
          className="ease group h-40 w-fit rounded-b-none object-cover duration-700 focus-visible:scale-125 group-hover:scale-125"
        />
      </CardHeader>
      <CardContent className="flex flex-col gap-6 pb-2 pt-2">
        <Typography variant="postCardTitle">{post.title}</Typography>
        <Typography variant="postCardContent">{post.description}</Typography>
        {post.readTime && (
          <Typography variant="postCardReadTime">
            <Clock size={16} className="-translate-y-0.5 stroke-primary" />
            {`${post.readTime} min`}
          </Typography>
        )}
      </CardContent>
      <Separator orientation="horizontal" />
      <CardFooter className="flex flex-row justify-between py-2 font-thin">
        <span>{displayCategory && categoryToText(post.category)}</span>
        <span>{post.published.toLocaleDateString()}</span>
      </CardFooter>
    </Card>
  );

  if (post.extraLink) {
    return (
      <a ref={ref} href={post.extraLink} className={LinkClass}>
        {BlogCard}
      </a>
    );
  }

  return (
    <Link ref={ref} href={`/blog/${post.id}`} className={LinkClass} legacyBehavior>
      {BlogCard}
    </Link>
  );
}
