"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { HeartHandshake, Compass, Sparkles } from "lucide-react";
import {
  type Historia,
  type Objetivo,
  type ObjetivoIcon,
} from "@/lib/historia";

const ICONS: Record<ObjetivoIcon, typeof HeartHandshake> = {
  "heart-handshake": HeartHandshake,
  compass: Compass,
  sparkles: Sparkles,
};

type AboutProps = {
  historia: Historia;
  objetivos: Objetivo[];
};

export function About({ historia, objetivos }: AboutProps) {
  const { titulo, primeiraParte, segundaParte } = historia;

  return (
    <section id="historia" className="py-24 sm:py-32 bg-mist">
      <Container>
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="flex flex-col gap-6"
          >
            <SectionTitle
              eyebrow="Nossa história"
              title={titulo}
              description={primeiraParte}
            />
            <p className="text-base text-stone leading-relaxed max-w-xl">
              {segundaParte}
            </p>

            <div className="grid sm:grid-cols-3 gap-5 pt-4">
              {objetivos.map((objetivo, i) => {
                const Icon = ICONS[objetivo.icon] ?? HeartHandshake;
                return (
                  <motion.div
                    key={objetivo.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="flex flex-col gap-2 rounded-xl2 bg-white p-5 shadow-card"
                  >
                    <Icon className="text-blush-600" size={22} />
                    <span className="font-semibold text-ink text-sm">
                      {objetivo.titulo}
                    </span>
                    <span className="text-sm text-stone leading-snug">
                      {objetivo.texto}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative"
          >
            <div className="absolute -inset-6 -z-10 rounded-blob bg-gradient-to-br from-blush-100 to-blush-50" />
            <div className="relative overflow-hidden rounded-xl2 shadow-soft aspect-[4/5]">
              <Image
                src="https://images.unsplash.com/photo-1543269865-cbf427effbad?q=80&w=1200&auto=format&fit=crop"
                alt="Grupo de pessoas reunidas em um círculo de conversa acolhedor"
                fill
                sizes="(min-width: 1024px) 40vw, 90vw"
                className="object-cover"
              />
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}
