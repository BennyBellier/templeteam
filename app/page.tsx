import { Description } from "@/components/features/Home/description/Description";
import { HeroBanner } from "@/components/features/Home/hero-banner/Hero-banner";
import { ContactBar as Contact } from "@/components/layout/Contact";
import { References } from "@/components/references/References";
import { api } from "@/lib/server";

export default async function Home() {
  const hello = await api.post.hello.query({ text: "Worldy !" });

  return (
    <>
      <HeroBanner />
      <Contact />
      <Description />
      <References />
    </>
  );
}
