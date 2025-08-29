import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SpaceX Explorer - Journey to the Stars",
  description:
    "Explore SpaceX launches, rockets, and missions in an immersive space experience",
  keywords: "SpaceX, rockets, launches, space exploration, mars, starship",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={inter.className}
        data-new-gr-c-s-check-loaded="14.1250.0"
        data-gr-ext-installed=""
      >
        <div className="cosmic-bg"></div>
        <div className="nebula-1"></div>
        <div className="nebula-2"></div>
        <Providers>
          <div className="relative z-10 min-h-screen flex flex-col">
            <Header />
            <main className="flex-1 container mx-auto px-4 py-24">
              {children}
            </main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
