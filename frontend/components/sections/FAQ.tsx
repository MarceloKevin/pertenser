"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Plus } from "lucide-react";
import { Container } from "@/components/layout/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { type Duvida } from "@/lib/duvidas";
import { cn } from "@/lib/utils";

function FAQItem({
  pergunta,
  resposta,
  isOpen,
  onToggle,
}: {
  pergunta: string;
  resposta: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-xl2 bg-white border border-cloud shadow-card overflow-hidden">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="font-medium text-ink">{pergunta}</span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.25 }}
          className={cn(
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
            isOpen ? "bg-blush-600 text-white" : "bg-mist text-blush-600"
          )}
        >
          <Plus size={16} />
        </motion.span>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-6 text-stone leading-relaxed">{resposta}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type FAQProps = {
  duvidas: Duvida[];
};

export function FAQ({ duvidas }: FAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(
    duvidas.length > 0 ? 0 : null,
  );

  return (
    <section id="duvidas" className="py-24 sm:py-32">
      <Container className="max-w-3xl mx-auto">
        <SectionTitle
          eyebrow="Dúvidas frequentes"
          title="Perguntas que sempre chegam"
          align="center"
          className="mb-14"
        />

        <div className="flex flex-col gap-4">
          {duvidas.map((item, i) => (
            <FAQItem
              key={item.id}
              pergunta={item.pergunta}
              resposta={item.resposta}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
