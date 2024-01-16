import type { Metadata } from "next";
import { Manrope, Rubik } from "next/font/google";
import "./globals.css";
import { Providers } from "./Providers";
import { cookies } from "next/headers";
import { TRPCReactProvider } from "@/components/trpc/TrpcProvider";
import { PropsWithChildren, useEffect, useContext } from "react";
import { cn } from "@/lib/utils";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { TailwindIndicator } from "@/components/util/TailwindIndicator";

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
    <html lang="fr" className="h-full" data-scroll="0" suppressHydrationWarning>
      <body
        className={cn(
          "h-full font-sans antialiased",
          fontSans.variable,
        )}
      >
        <TRPCReactProvider cookies={cookies().toString()}>
          <Providers>
            <div className="relative flex h-full w-screen overflow-x-hidden flex-col">
              <Header />
              <div className="flex-1 pt-5 pb-10 grid auto-rows-auto gap-6">{children}</div>
              <Footer />
            </div>
            <TailwindIndicator />
            {modal}
          </Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
