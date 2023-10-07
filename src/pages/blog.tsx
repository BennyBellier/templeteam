import Link from "next/link";
import { useState } from "react";
import Layout from "~/components/layout";
import { type BlogPostProps } from "~/utils/types";

export function getStaticProps() {
  const posts: BlogPostProps[] = [];
  return {
    props: {
      posts,
    },
  };
}

function Post({
  title,
  date,
  description,
  image,
  link,
}: {
  title: string;
  date: string;
  description: string;
  image: string;
  link?: string;
}) {
  return (
    <Link href={link ? link : `/blog/${title}`} className={`bg-yellow-400`}>
      {title}
    </Link>
  );
}

function Filter({
  types,
  currentType,
  setCurrentType,
}: {
  types: string[];
  currentType: string;
  setCurrentType: (type: string) => void;
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
    <div className="flex w-fit gap-5 rounded-full bg-neutral-100 px-4 py-2 font-light">
      {types.map((type, index) => (
        <button
          key={index}
          className={`rounded-full px-4 py-2 capitalize ${
            type === currentType ? "bg-neutral-200/50 font-normal" : ""
          }`}
          onClick={() => setCurrentType(type)}
        >
          {typeToText(type)}
        </button>
      ))}
    </div>
  );
}

export default function Blog({ posts }: { posts: BlogPostProps[] }) {
  const [currentType, setCurrentType] = useState("all");
  const types = ["all", "article", "event", "information"];

  const Posts = () => {
    if (posts === undefined)
      return (
        <span className="text-lg font-light">{`Une erreur s'est produite veuillez réessayer.`}</span>
      );
    const postsFiltered = posts.filter(
      (post) => post.type === currentType || currentType === "all"
    );
    // eslint-disable-next-line react/no-unescaped-entities
    if (postsFiltered.length === 0)
      return <span className="text-lg font-light">Aucun posts trouvé.</span>;
    return postsFiltered.map((post, index) =>
      post.type === currentType || currentType === "all" ? (
        <Post
          key={index}
          title={post.title}
          date={post.date}
          description={post.description}
          image={post.image}
        />
      ) : null
    );
  };

  return (
    <Layout
      title="Blog"
      subtitle="Obtenez les dernières informations sur l'équipe, les derniers articles et bien plus encore."
      display={{ ref: true, contact: true }}
    >
      <section className="flex flex-col gap-5 px-5 1050:px-1050">
        <h1 className="1050:text-5xl">Derniers articles</h1>
        <Filter
          types={types}
          currentType={currentType}
          setCurrentType={setCurrentType}
        />
      </section>
      <section className="flex flex-wrap justify-center px-5 1050:px-1050">
        <Posts />
      </section>
    </Layout>
  );
}
