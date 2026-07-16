"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { CalendarDays, Clock, MapPin, Sparkles } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { type ProximoEvento } from "@/lib/events";
import { isLocalEventoImage, normalizeEventoImageUrl } from "@/lib/evento-images";

type NextEventProps = {
  evento: ProximoEvento;
};

export function NextEvent({ evento }: NextEventProps) {

  return (
    <section id="proximo-evento" className="py-24 sm:py-32">
      <Container className="flex flex-col items-center">
        <SectionTitle
          eyebrow="Próximo encontro"
          title="O próximo passo pode ser hoje."
          align="center"
          className="mb-14"
        />

        {evento ? (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="w-full max-w-4xl"
          >
            <Card className="overflow-hidden" hoverLift={false}>
              <div className="grid md:grid-cols-2">
                <div className="relative h-64 md:h-full">
                  <Image
                    src={normalizeEventoImageUrl(evento.imagem)}
                    alt={evento.nome}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover"
                    unoptimized={isLocalEventoImage(
                      normalizeEventoImageUrl(evento.imagem),
                    )}
                  />
                </div>
                <div className="flex flex-col gap-5 p-8 sm:p-10">
                  <h3 className="text-2xl font-semibold text-ink">
                    {evento.nome}
                  </h3>
                  <p className="text-stone leading-relaxed">
                    {evento.descricao}
                  </p>
                  <div className="flex flex-col gap-3 text-sm text-stone-dark">
                    <span className="flex items-center gap-2">
                      <MapPin size={16} className="text-blush-600 shrink-0" />
                      {evento.local}
                    </span>
                    <span className="flex items-center gap-2">
                      <CalendarDays
                        size={16}
                        className="text-blush-600 shrink-0"
                      />
                      {evento.data}
                    </span>
                    <span className="flex items-center gap-2">
                      <Clock size={16} className="text-blush-600 shrink-0" />
                      {evento.horario}
                    </span>
                  </div>
                  <Button href="#contato" className="mt-2 w-fit">
                    Quero Participar
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col items-center gap-5 text-center max-w-md rounded-xl2 bg-mist py-16 px-8"
          >
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blush-100">
              <Sparkles className="text-blush-600" size={26} />
            </span>
            <p className="text-lg font-medium text-ink">
              Neste momento ainda não há nenhum evento agendado.
            </p>
            <p className="text-sm text-stone">
              Acompanhe nossas redes sociais para ficar por dentro das
              próximas experiências.
            </p>
          </motion.div>
        )}
      </Container>
    </section>
  );
}
