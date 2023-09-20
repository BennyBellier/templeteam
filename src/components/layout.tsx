import Navigation from "./navigation";
import Footer from "./footer";
import ContactBar from "./contact_bar";
import References from "./references";

/**
 * @description
 * A layout with navigation, (contact, references) and footer
 * for all pages except the home page.
 *
 * @usage
 * ```tsx
 * <Layout title="title" subtitle="subtitle" display={{ref: true, contact: true}}>
 *  <section>content</section>
 * </Layout>
 * ```
 *
 * @param param.title the title of the page
 * @param param.subtitle the subtitle of the page
 * @param param.display whether to display the references and contact bar
 * @param param.children the content of the page
 *
 * @returns {JSX.Element} a layout with navigation, content and footer
 */
export default function Layout({ title, subtitle, display, children }: { title: string, subtitle?: string, display?: {ref: boolean, contact: boolean}, children: React.ReactNode }) {
  return (
    <>
      <Navigation />
      <main className="relative top-[60px] flex min-h-screen w-full flex-col items-stretch justify-center text-neutral-950 dark:bg-neutral-850 dark:text-neutral-50 md:top-[70px] 1050:top-[80px] gap-10">
        <section id="main-head" className="flex flex-col gap-10 text-center font-light items-center 1050:px-1050 pt-5">
          <h1 className="uppercase text-5xl 1050:text-6xl">{title}</h1>
          { subtitle ? <h2 className="w-4/5 1050:text-lg">{subtitle}</h2> : null }
        </section>
        <hr />
        {children}
        { display?.contact ? <ContactBar /> : null }
        {
          display?.ref ? <References /> : null
        }
      </main>
      <Footer />
    </>
  );
}