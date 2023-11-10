import Navigation from "./navigation";
import Footer from "./Footer";
import ContactBar from "./ContactBar";
import References from "./references";
import Head from "next/head";

/**
 * @description
 * A layout with navigation, (contact, references) and footer
 * for all pages except the home page.
 *
 * @param param.title the title of the page
 * @param param.subtitle the subtitle of the page
 * @param param.display whether to display the references and contact bar
 * @param param.children the content of the page
 *
 * @returns {JSX.Element} a layout with navigation, content and footer
 *
 * @usage
 * ```tsx
 * <Layout title="title" subtitle="subtitle" display={{ref: true, contact: true}}>
 *  <section>content</section>
 * </Layout>
 * ```
 */
export default function Layout({
  title,
  subtitle,
  display,
  children,
}: {
  title: string;
  subtitle?: string;
  display?: { ref: boolean; contact: boolean };
  children: React.ReactNode;
}) {
  return (
    <>
      <Head>
        <title>
          {title
            ?.split(" ")
            .map((word) => word[0]?.toUpperCase() + word.slice(1))
            .join(" ")}{" "}
          | Temple Team
        </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navigation />
      <main
        className={`bgPrimary colorText relative flex min-h-screen w-full flex-col items-stretch justify-center gap-10 ${
          false ? "" : "mainTopNav"
        }`}
      >
        <section
          id="main-head"
          className="flex flex-col items-center gap-10 pt-5 text-center font-light 1050:px-1050"
        >
          <h1 className="text-5xl uppercase 1050:text-6xl">{title}</h1>
          {subtitle ? <h2 className="w-4/5 1050:text-lg">{subtitle}</h2> : null}
        </section>
        <hr />
        {children}
        {display?.contact ? <ContactBar /> : null}
        {display?.ref ? <References /> : null}
      </main>
      <Footer />
    </>
  );
}
