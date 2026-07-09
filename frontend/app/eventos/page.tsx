import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";
import { fetchEventosRealizados } from "@/lib/events";

export const metadata: Metadata = {
  title: "Eventos realizados",
  description:
    "Conheça os encontros que já aconteceram no PertenSer — memórias, histórias e conexões que ficaram.",
};

export default async function EventosPage() {
  const eventos = await fetchEventosRealizados();

  return (
    <>
      <Header />
      <main className="pt-28 pb-24 bg-mist min-h-screen">
        <Container>
          <Link
            href="/#eventos"
            className="inline-flex items-center gap-2 text-sm font-medium text-blush-600 hover:text-blush-700 mb-8"
          >
            <ArrowLeft size={16} />
            Voltar para a home
          </Link>

          <SectionTitle
            eyebrow="Memórias"
            title="Eventos já realizados"
            description="Cada encontro deixa um rastro. Aqui guardamos todos eles."
            className="mb-14"
          />

          {eventos.length === 0 ? (
            <p className="text-center text-stone">
              Em breve compartilharemos memórias dos nossos encontros por aqui.
            </p>
          ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {eventos.map((evento) => (
              <Card
                key={evento.slug}
                className="h-full flex flex-col overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={evento.imagemDestaque}
                    alt={evento.nome}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col gap-3 p-6 flex-1">
                  <span className="text-xs font-medium text-blush-600">
                    {evento.dataFormatada}
                  </span>
                  <h3 className="text-lg font-semibold text-ink">
                    {evento.nome}
                  </h3>
                  <p className="text-sm text-stone leading-relaxed flex-1">
                    {evento.resumo}
                  </p>
                  <Link
                    href={`/eventos/${evento.slug}`}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-blush-600 hover:text-blush-700 mt-2 w-fit"
                  >
                    Ver mais
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
