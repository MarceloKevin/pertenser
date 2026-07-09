import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, CalendarDays, Target, Sparkles } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/layout/Container";
import { EventGallery } from "@/components/eventos/EventGallery";
import { EventVideos } from "@/components/eventos/EventVideos";
import { fetchEventoBySlug, fetchEventosRealizados } from "@/lib/events";

export async function generateStaticParams() {
  const eventos = await fetchEventosRealizados();
  return eventos.map((evento) => ({ slug: evento.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const evento = await fetchEventoBySlug(slug);
  if (!evento) return {};

  return {
    title: evento.nome,
    description: evento.resumo,
    openGraph: {
      title: evento.nome,
      description: evento.resumo,
      images: [{ url: evento.imagemDestaque }],
    },
  };
}

export default async function EventoPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const evento = await fetchEventoBySlug(slug);

  if (!evento) notFound();

  return (
    <>
      <Header />
      <main className="pt-28 pb-24">
        <Container className="max-w-3xl mx-auto">
          <Link
            href="/#eventos"
            className="inline-flex items-center gap-2 text-sm font-medium text-blush-600 hover:text-blush-700 mb-8"
          >
            <ArrowLeft size={16} />
            Voltar para eventos
          </Link>

          <span className="flex items-center gap-2 text-sm font-medium text-stone mb-3">
            <CalendarDays size={16} className="text-blush-600" />
            {evento.dataFormatada}
          </span>

          <h1 className="text-3xl sm:text-4xl font-bold text-ink mb-6 leading-tight">
            {evento.nome}
          </h1>

          <div className="relative aspect-[16/9] rounded-xl2 overflow-hidden shadow-soft mb-10">
            <Image
              src={evento.imagemDestaque}
              alt={evento.nome}
              fill
              sizes="(min-width: 1024px) 768px, 100vw"
              className="object-cover"
              priority
            />
          </div>

          <div className="prose-none flex flex-col gap-4 text-stone leading-relaxed mb-12">
            <p>{evento.descricaoCompleta}</p>
          </div>

          <div className="flex flex-col gap-3 rounded-xl2 bg-mist p-6 sm:p-8 mb-12">
            <span className="flex items-center gap-2 font-semibold text-ink">
              <Target size={18} className="text-blush-600" />
              Objetivo do evento
            </span>
            <p className="text-stone leading-relaxed">{evento.objetivo}</p>
          </div>

          <div className="mb-12">
            <span className="flex items-center gap-2 font-semibold text-ink mb-4">
              <Sparkles size={18} className="text-blush-600" />
              Momentos marcantes
            </span>
            <ul className="flex flex-col gap-3">
              {evento.momentosMarcantes.map((momento) => (
                <li
                  key={momento}
                  className="flex items-start gap-3 text-stone leading-relaxed"
                >
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-blush-500 shrink-0" />
                  {momento}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-12">
            <span className="font-semibold text-ink mb-4 block">
              Galeria de fotos
            </span>
            <EventGallery fotos={evento.galeria} eventoNome={evento.nome} />
          </div>

          {evento.videos.length > 0 && (
            <div className="mb-12">
              <span className="font-semibold text-ink mb-4 block">Vídeos</span>
              <EventVideos videos={evento.videos} />
            </div>
          )}

          {evento.depoimentos.length > 0 && (
            <div>
              <span className="font-semibold text-ink mb-4 block">
                Depoimentos
              </span>
              <div className="grid sm:grid-cols-2 gap-5">
                {evento.depoimentos.map((depoimento) => (
                  <blockquote
                    key={depoimento.nome}
                    className="rounded-xl2 bg-white border border-cloud shadow-card p-6 flex flex-col gap-3"
                  >
                    <p className="text-stone leading-relaxed italic">
                      &ldquo;{depoimento.texto}&rdquo;
                    </p>
                    <cite className="text-sm font-semibold text-ink not-italic">
                      {depoimento.nome}
                    </cite>
                  </blockquote>
                ))}
              </div>
            </div>
          )}
        </Container>
      </main>
      <Footer />
    </>
  );
}
