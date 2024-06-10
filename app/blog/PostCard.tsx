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

  const cardClass = cn(
    "ease group min-h-32 min-w-52 max-w-80 overflow-hidden duration-500 hover:scale-95 focus-visible:scale-95",
    isInView ? "" : "scale-95 opacity-0 delay-1000",
  );

  if (post.extraLink) {
    return (
      <a ref={ref} href={post.extraLink}>
        <Card className={cardClass}>
          <CardHeader className="relative h-48 space-y-0 overflow-hidden">
            <ImageWithLoader
              src={`/img/posts/thumbnails/${post.thumbnail}`}
              alt={`Photo de ${post.title}`}
              fill
              sizes="300px"
              className="group- ease h-40 min-w-52 max-w-80 rounded-b-none object-cover duration-700 focus-visible:scale-125 group-hover:scale-125"
            />
          </CardHeader>
          <CardContent className="flex flex-col gap-6 pb-2 pt-2">
            <Typography variant="postCardTitle">{post.title}</Typography>
            <Typography variant="postCardContent">
              {post.description}
            </Typography>
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
      </a>
    );
  }

  return (
    <Link ref={ref} href={`/blog/${post.id}`}>
      <Card className={cardClass}>
        <CardHeader className="relative h-48 space-y-0 overflow-hidden">
          <ImageWithLoader
            src={`/img/posts/thumbnails/${post.thumbnail}`}
            alt={`Photo de ${post.title}`}
            fill
            sizes="300px"
            className="group- ease h-40 min-w-52 max-w-80 rounded-b-none object-cover duration-700 focus-visible:scale-125 group-hover:scale-125"
          />
        </CardHeader>
        <CardContent className="flex flex-col gap-4 pb-2 pt-2">
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
    </Link>
  );
}
