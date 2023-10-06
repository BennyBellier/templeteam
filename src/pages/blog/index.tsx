import Link from "next/link";
import { type } from "os";
import { useState } from "react";
import Layout from "~/components/layout";

const tickets = [
  {
    title: "Nouveau site web",
    date: "12/09/2021",
    description: "Nous sommes heureux de vous présenter notre nouveau site web !",
    type: "informations",
    image: "website.jpg",
  }
]

export function getStaticProps() {
  return {
    props: {
      tickets
    },
  };
}

function Ticket({
  title,
  date,
  description,
  image,
  link
}: {
  title: string;
  date: string;
  description: string;
  image: string;
  link?: string;
}) {
  return (
    <Link href={link ? link : `/blog/${title}`}>
      {title}
    </Link>
  );
}

function TypeSelector({
  types,
  setCurrentType
}: {
  types: string[];
  setCurrentType: (type: string) => void;
}) {

}

export default function Blog({
  tickets,
}: {
  tickets: {
    title: string;
    date: string;
    description: string;
    type: string;
    image: string;
  }[];
}) {
  const [currentType, setCurrentType] = useState("all");
  const types = ["all", "articles", "events", "informations"];

  function typeToText(type: string) {
    switch (type) {
      case "articles":
        return "articles";
      case "events":
        return "événements";
      case "informations":
        return "informations";
      default:
        return "tous";
    }
  }

  const TypeSelector = () => {
    return (
      <div className="flex bg-neutral-100 w-fit rounded-full px-4 py-2 gap-5 font-light">
        {types.map((type, index) => (
          <button
            key={index}
            className={`capitalize px-4 py-2 rounded-full ${
              type === currentType ? "bg-neutral-200/50 font-normal" : ""
            }`}
            onClick={() => setCurrentType(type)}
          >
            {typeToText(type)}
          </button>
        ))}
      </div>
    );
  };

  const Tickets = () => {
    if (tickets === undefined) return <span className="text-lg font-light">Une erreur s'est produite veuillez réessayer.</span>;
    const ticketsFiltered = tickets.filter((ticket) => ticket.type === currentType || currentType === "all");
    // eslint-disable-next-line react/no-unescaped-entities
    if (ticketsFiltered.length === 0) return <span className="text-lg font-light">Aucun tickets trouvé.</span>;
    return ticketsFiltered.map((ticket, index) => (
          ticket.type === currentType || currentType === "all" ? (
            <Ticket
              key={index}
              title={ticket.title}
              date={ticket.date}
              description={ticket.description}
              image={ticket.image}
            />
          ) : null
    ));
  }

  return (
    <Layout
      title="Blog"
      subtitle="Obtenez les dernières informations sur l'équipe, les derniers articles et bien plus encore."
      display={{ ref: true, contact: true }}
    >
      <section className="flex flex-col gap-5 px-5 1050:px-1050">
        <h1 className="1050:text-5xl">Derniers articles</h1>
        <TypeSelector />
      </section>
      <section className="flex flex-wrap justify-center px-5 1050:px-1050">
        <Tickets />
      </section>
    </Layout>
  );
}
