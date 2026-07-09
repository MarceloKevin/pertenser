"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { type EventoRealizado } from "@/lib/events";

type EventsProps = {
  eventos: EventoRealizado[];
};

export function Events({ eventos }: EventsProps) {
  return (
    <section id="eventos" className="py-24 sm:py-32 bg-mist">
      <Container>
        <SectionTitle
          eyebrow="Memórias"
          title="Eventos já realizados"
          description="Cada encontro deixa um rastro. Aqui guardamos alguns deles."
          className="mb-14"
        />

        {eventos.length === 0 ? (
          <p className="text-center text-stone">
            Em breve compartilharemos memórias dos nossos encontros por aqui.
          </p>
        ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {eventos.map((evento, i) => (
            <motion.div
              key={evento.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: "easeOut" }}
            >
              <Card className="h-full flex flex-col overflow-hidden group">
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
            </motion.div>
          ))}
        </div>
        )}

        {eventos.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="flex justify-center mt-12"
        >
          <Button href="/eventos" variant="secondary">
            Ver todos
          </Button>
        </motion.div>
        ) : null}
      </Container>
    </section>
  );
}
