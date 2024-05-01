import {
  Layout,
  LayoutDescription,
  LayoutHeader,
  LayoutSection,
  LayoutTitle,
} from "@/components/layout/layout";
import { Typography } from "@/components/ui/typography";
import ContactForm from "./contactForm";

export const Page = () => {
  return (
    <Layout noContact>
      <LayoutHeader>
        <LayoutTitle>Contact</LayoutTitle>
        <LayoutDescription>
          Pour toute demande, envoyez un message à l&apos;aide de ce formulaire,
          et nous vous répondrons.
        </LayoutDescription>
      </LayoutHeader>
      <LayoutSection className="flex-col items-center justify-around gap-8 lg:flex-row">
        <div className="flex flex-col gap-2">
          <Typography
            as="span"
            className="text-center font-caption text-xl font-extrabold"
          >
            Voiron, France
          </Typography>
          <Typography
            className="text-center font-caption text-lg font-thin"
            as="p"
          >
            6 rue George Sand
            <br />
            38500, Voiron
          </Typography>
        </div>
        <div className="flex flex-col gap-2">
          <Typography
            as="span"
            className="text-center font-caption text-xl font-extrabold"
          >
            Email
          </Typography>
          <Typography
            as="a"
            href="mailto:contact@templeteam.fr"
            className="text-center font-caption text-lg font-thin"
          >
            contact@templeteam.fr
          </Typography>
        </div>
        <div className="flex flex-col gap-2">
          <Typography
            as="span"
            className="text-center font-caption text-xl font-extrabold"
          >
            Instagram
          </Typography>
          <Typography
            as="a"
            href="https://instagram.com/templeteam.off"
            target="_blank"
            rel="noopener noreferrer"
            className="text-center font-caption text-lg font-thin outline-none"
          >
            @templeteam.off
          </Typography>
        </div>
      </LayoutSection>
      <LayoutSection>
        <div className="grid w-full gap-4 overflow-hidden drop-shadow-xl lg:grid-cols-2 lg:gap-0 lg:rounded-lg lg:border lg:border-primary">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4200.003888306448!2d5.58631441125429!3d45.365640921012776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x478ae4377ba14645%3A0x5c31291a3022d350!2sGymnase%20Pierre%20de%20Coubertin!5e0!3m2!1sfr!2sfr!4v1644662728559!5m2!1sfr!2sfr"
            width="600"
            height="600"
            loading="lazy"
            className="w-full rounded-lg border border-primary lg:rounded-r-none lg:border-none"
          ></iframe>
          <ContactForm />
        </div>
      </LayoutSection>
    </Layout>
  );
};

export default Page;
