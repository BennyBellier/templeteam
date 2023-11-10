import Link from "next/link";
import Layout from "~/components/layout";
import { useState } from "react";
import * as ToggleGroup from "@radix-ui/react-toggle-group";
import { type BlogPostProps } from "~/utils/types";
import Image from "next/image";
import { title } from "process";
// import { getSortedPostsDataByType } from "~/lib/blog_posts";

// temporary data for UI design
const blogData: BlogPostProps[] = [
  {
    id: "1",
    title: "PreRendre",
    thumbnail: "",
    type: "Article",
    publishedAt: "",
    description: "",
    readTime: 3,
    extraLink: "",
  },
  {
    id: "2",
    title: "SSG SSR",
    thumbnail: "",
    type: "Article",
    publishedAt: "",
    description: "",
    readTime: 2,
    extraLink: "",
  },
  {
    id: "3",
    title: "Temple Team : la gym en mode Yamakasi avec l'Étoile de Voiron",
    thumbnail: "",
    type: "Article",
    publishedAt: "12/12/2021",
    description:
      "L'urban gym, mélange d'acrobaties et de parkour, fait un carton. On a assisté à leur entrainement hebdomadaire au gymnase Pierre-de-Coubertin à Voiron.",
    readTime: 2,
    extraLink:
      "https://www.ledauphine.com/sport/2021/11/04/isere-voiron-temple-team-la-gym-en-mode-yamakasi",
  },
];

function Post({
  post,
}: {
  post: BlogPostProps;
}) {

  const ThumbnailOrTitle = () => {
    if (!post.thumbnail || post.thumbnail === "") {
      return post.title
    } else {
      return <Image src={post.thumbnail} alt={"image décrivant " + post.title } />
    }
  }

  return (
    <Link
      href={post.extraLink ? post.extraLink : `/blog/${post.title}`}
      className="bg-neutral-100 rounded-lg w-72"
    >
      <ThumbnailOrTitle />
    </Link>
  );
}

function BlogFilterSelector({
  types,
  onTypeChange,
}: {
  types: string[];
  onTypeChange: (type: string) => void;
}) {
  function typeToText(type: string) {
    switch (type) {
      case "article":
        return "articles";
      case "event":
        return "événements";
      case "information":
        return "informations";
      default:
        return "tous";
    }
  }
  return (
    <ToggleGroup.Root
      className="flex flex-col 1050:flex-row w-fit gap-5 rounded-3xl 1050:rounded-full bg-neutral-100 px-4 py-2 font-light"
      type="single"
      defaultValue="all"
      aria-label="Blog type"
      onValueChange={(value) => {
        if (value) onTypeChange(value);
      }}
    >
      {types.map((type, index) => (
        <ToggleGroup.Item
          key={index}
          value={type}
          className="relative rounded-full px-4 py-2 capitalize hover:text-neutral-600 focus:shadow-border data-[state=on]:bg-neutral-200/50 data-[state=on]:font-normal data-[state=on]:shadow-none"
          aria-label={type + " posts"}
        >
          {typeToText(type)}
        </ToggleGroup.Item>
      ))}
    </ToggleGroup.Root>
  );
}

export default function Blog() {
  const types = ["all", "article", "event", "information"];
  const [blogPosts, setBlogPosts] = useState<[]>(blogData);


  const Posts = () => {
    if (blogPosts === undefined)
      return (
        <span className="text-lg font-light">{`Une erreur s'est produite veuillez réessayer.`}</span>
      );
    // eslint-disable-next-line react/no-unescaped-entities
    if (blogPosts.length === 0)
      return <span className="text-lg font-light">Aucun posts trouvé.</span>;
    return (
      <div className="flex flex-wrap gap-3">
        {blogPosts.map((post: BlogPostProps) => <Post key={post.id} post={post} />)}
      </div>
    );
  };

  function onTypeChange(type: string) {
    console.log(type);
  }

  return (
    <Layout
      title="Blog"
      subtitle="Obtenez les dernières informations sur l'équipe, les derniers articles et bien plus encore."
      display={{ ref: true, contact: true }}
    >
      <section className="flex flex-col items-center 1050:items-start gap-5 px-5 1050:px-1050">
        <h1 className="text-3xl 1050:text-5xl">Derniers articles</h1>
        <BlogFilterSelector types={types} onTypeChange={onTypeChange} />
      </section>
      <section className="flex flex-wrap justify-center px-5 1050:px-1050">
        <Posts />
      </section>
    </Layout>
  );
}
