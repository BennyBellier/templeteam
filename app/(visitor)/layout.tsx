import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { PropsWithChildren } from "react";

export default function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Header />
      <main className="grid grow auto-rows-auto gap-6 pb-10 pt-5">
        {children}
      </main>
      <Footer />
    </>
  );
}
