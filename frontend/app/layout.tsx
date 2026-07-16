import type { Metadata } from "next";
import { Inter, Manrope } from "next/font/google";
import "./globals.css";
import { WhatsappButton } from "@/components/layout/WhatsappButton";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const siteUrl = "https://www.pertenser.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "PertenSer — Um lugar onde você realmente pertence",
    template: "%s | PertenSer",
  },
  description:
    "PertenSer promove encontros, eventos e experiências voltadas ao desenvolvimento humano, acolhimento e conexão entre pessoas.",
  keywords: [
    "PertenSer",
    "eventos de desenvolvimento humano",
    "encontros de acolhimento",
    "experiências de conexão",
    "comunidade",
  ],
  authors: [{ name: "PertenSer" }],
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "PertenSer",
    title: "PertenSer — Um lugar onde você realmente pertence",
    description:
      "Encontros e experiências que promovem acolhimento, pertencimento e conexão entre pessoas.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PertenSer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PertenSer — Um lugar onde você realmente pertence",
    description:
      "Encontros e experiências que promovem acolhimento, pertencimento e conexão entre pessoas.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "PertenSer",
  url: siteUrl,
  description:
    "PertenSer promove encontros, eventos e experiências voltadas ao desenvolvimento humano, acolhimento e conexão entre pessoas.",
  sameAs: [
    "https://www.instagram.com/pertenser",
    "https://www.facebook.com/pertenser",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${manrope.variable}`}>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {children}
        <WhatsappButton />
      </body>
    </html>
  );
}
