import { HeroBanner } from "@/components/features/Hero-banner/Hero-banner";
import ContactDiv from "@/components/layout/Contact";
import { api } from "@/lib/server";


export default async function Home() {
  const hello = await api.post.hello.query({ text: "Worldy !" });

  return (
    <div>
      <HeroBanner />
      <ContactDiv />
    </div>
  );
}
