import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { GeneralInfoSection } from "@/components/admin/GeneralInfoSection";
import { NextEventSection } from "@/components/admin/NextEventSection";
import { PastEventsSection } from "@/components/admin/PastEventsSection";
import { DuvidasSection } from "@/components/admin/DuvidasSection";
import { HistoriaSection } from "@/components/admin/HistoriaSection";

export const metadata: Metadata = {
  title: "Gerenciamento",
  description: "Painel de gerenciamento das informações do sistema PertenSer.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function GerenciamentoPage() {
  return (
    <>
      <Header />
      <main className="relative min-h-screen pt-28 pb-16 sm:pt-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -top-24 -right-32 h-[22rem] w-[22rem] rounded-blob bg-gradient-to-br from-blush-100 to-blush-200 opacity-50" />
          <div className="absolute bottom-0 -left-32 h-[18rem] w-[18rem] rounded-blob bg-gradient-to-tr from-cloud to-blush-50 opacity-60" />
        </div>

        <Container>
          <div className="mb-12 flex flex-col gap-2">
            <h1 className="text-3xl font-semibold text-ink sm:text-4xl">
              Gerenciamento do sistema
            </h1>
            <p className="text-stone max-w-2xl">
              Edite as informações de contato, organize o próximo evento,
              consulte os encontros já realizados, gerencie as dúvidas
              frequentes e edite a seção Nossa história.
            </p>
          </div>

          <div className="flex flex-col gap-16 sm:gap-20">
            <GeneralInfoSection />
            <NextEventSection />
            <PastEventsSection />
            <DuvidasSection />
            <HistoriaSection />
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
