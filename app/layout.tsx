import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { TRPCReactProvider } from "@/components/trpc/TrpcProvider";
import { PlaygroundLink } from "@/components/util/PlaygroundLink";
import { TailwindIndicator } from "@/components/util/TailwindIndicator";
import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Manrope, Rubik } from "next/font/google";
import { cookies } from "next/headers";
import { PropsWithChildren } from "react";
import { Providers } from "./Providers";
import "./globals.css";

const fontCaption = Manrope({ subsets: ["latin"], variable: "--font-caption" });
const fontSans = Rubik({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "Temple Team | Parkour Freerun Gymnastique",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
  modal,
}: PropsWithChildren<{
  modal?: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="group/html light h-full" data-scroll="0">
      <body className={cn("h-full font-sans antialiased", fontSans.variable)}>
        <TRPCReactProvider cookies={cookies().toString()}>
          <Providers>
            <div
              id="main-content"
              className="flex h-full flex-col overflow-y-auto overflow-x-hidden"
            >
              <Header />
              <div className="grid grow auto-rows-auto gap-6 pb-10 pt-5">
                {children}
              </div>
              <Footer />
            </div>
            <PlaygroundLink />
            <TailwindIndicator />
            {modal}
          </Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
