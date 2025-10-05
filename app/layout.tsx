import "@/styles/globals.css";

import { TailwindIndicator } from "@/components/util/TailwindIndicator";
import { cn } from "@/lib/utils";
import { TRPCReactProvider } from "@/trpc/TrpcProvider";
import type { Metadata } from "next";
import { Manrope, Rubik } from "next/font/google";
import type { PropsWithChildren } from "react";
import Providers from "./Providers";

const fontCaption = Manrope({ subsets: ["latin"], variable: "--font-caption" });
const fontSans = Rubik({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: {
    template: "%s | Temple Team",
    default: "Temple Team | Parkour Freerun Gymnastique",
  },
  description:
    "Découvrez la Temple Team, un collectif de 7 athlètes spécialisés dans le parkour, le freerunning, la gymnastique et le tricking. Animateurs d'événements depuis plusieurs années, ils mettent leur expertise à votre disposition pour émerveiller vos invités.",
  metadataBase: new URL("https://templeteam.fr"),
  authors: {
    name: "BELLIER Benjamin",
    url: "https://github.com/BennyBellier",
  },
  category: "sports",
};

export default function RootLayout({
  children,
  modal,
}: PropsWithChildren<{
  modal?: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className="group/html ltr max-h-dvh"
      data-scroll="0"
      suppressHydrationWarning
    >
      <body
        className={cn(
          " max-h-dvh font-sans antialiased",
          fontSans.variable,
          fontCaption.variable,
        )}
      >
        <TRPCReactProvider>
          <Providers>
            {children}
            <TailwindIndicator />
            {modal}
          </Providers>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
