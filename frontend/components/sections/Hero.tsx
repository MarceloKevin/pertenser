"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, CalendarHeart } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { Button } from "@/components/ui/Button";

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative overflow-hidden pt-32 pb-24 sm:pt-40 sm:pb-32 min-h-[92vh] flex items-center"
    >
      {/* Formas orgânicas de fundo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute -top-24 -right-32 h-[28rem] w-[28rem] rounded-blob bg-gradient-to-br from-blush-100 to-blush-200 opacity-70 animate-float" />
        <div className="absolute top-1/3 -left-40 h-[24rem] w-[24rem] rounded-blob bg-gradient-to-tr from-cloud to-blush-50 opacity-80 animate-float [animation-delay:-3s]" />
        <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-blob bg-blush-50 opacity-60" />
      </div>

      <Container className="flex flex-col items-center text-center gap-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <Image
            src="/logo.png"
            alt="PertenSer"
            width={220}
            height={120}
            priority
            className="h-auto w-40 sm:w-48 lg:w-52"
          />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
          className="max-w-3xl text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.1] text-ink"
        >
          Um lugar onde você{" "}
          <span className="text-blush-600">realmente pertence</span>.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          className="max-w-xl text-lg sm:text-xl text-stone leading-relaxed"
        >
          Encontros e experiências que acolhem histórias, aproximam pessoas e
          criam espaço para o que há de mais humano em cada um de nós.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row items-center gap-4 pt-2"
        >
          <Button href="#historia">
            Conheça nossa história
            <ArrowRight size={16} />
          </Button>
          <Button href="#proximo-evento" variant="secondary">
            <CalendarHeart size={16} />
            Próximo Evento
          </Button>
        </motion.div>
      </Container>
    </section>
  );
}
