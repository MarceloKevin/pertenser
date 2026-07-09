"use client";

import { MessageCircle } from "lucide-react";

export function WhatsappButton() {
  return (
    <a
      href="https://wa.me/5500000000000"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar com o PertenSer no WhatsApp"
      className="group fixed bottom-6 right-6 z-50 flex h-14 items-center gap-2 rounded-full bg-[#21c063] px-4 text-white shadow-soft animate-pulseRing hover:bg-[#1da851] transition-colors"
    >
      <MessageCircle size={24} className="shrink-0" />
      <span className="max-w-0 overflow-hidden whitespace-nowrap text-sm font-medium opacity-0 transition-all duration-300 group-hover:max-w-[9rem] group-hover:opacity-100">
        Fale conosco
      </span>
    </a>
  );
}
