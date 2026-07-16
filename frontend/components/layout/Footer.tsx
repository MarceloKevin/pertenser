import { Instagram, Facebook, MessageCircle, Mail } from "lucide-react";
import { Container } from "./Container";
import { fetchGeneralInfo, whatsappMeUrl } from "@/lib/general-info";

const LINKS_RAPIDOS = [
  { label: "Início", href: "#inicio" },
  { label: "História", href: "#historia" },
  { label: "Próximo Evento", href: "#proximo-evento" },
  { label: "Eventos", href: "#eventos" },
  { label: "Dúvidas", href: "#duvidas" },
];

export async function Footer() {
  const ano = new Date().getFullYear();
  const info = await fetchGeneralInfo();
  const whatsappHref = whatsappMeUrl(info.whatsapp);

  return (
    <footer id="contato" className="bg-ink text-white">
      <Container className="py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="flex flex-col gap-4 lg:col-span-2">
            <div className="flex items-center gap-2 font-display text-lg font-bold">
              <span className="flex items-center" aria-hidden="true">
                <span className="h-3.5 w-3.5 rounded-full bg-blush-300" />
                <span className="-ml-1.5 h-3.5 w-3.5 rounded-full bg-blush-400" />
                <span className="-ml-1.5 h-3.5 w-3.5 rounded-full bg-blush-500" />
              </span>
              PertenSer
            </div>
            <p className="text-sm text-white/70 leading-relaxed max-w-sm">
              Encontros e experiências voltadas ao desenvolvimento humano, ao
              acolhimento e à conexão real entre pessoas.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-white/90">
              Links rápidos
            </span>
            {LINKS_RAPIDOS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-white/70 hover:text-blush-300 transition-colors w-fit"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <span className="text-sm font-semibold text-white/90">
              Contato
            </span>
            <a
              href={`mailto:${info.email}`}
              className="flex items-center gap-2 text-sm text-white/70 hover:text-blush-300 transition-colors w-fit"
            >
              <Mail size={16} />
              {info.email}
            </a>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-white/70 hover:text-blush-300 transition-colors w-fit"
              aria-label="Falar no WhatsApp"
            >
              <MessageCircle size={16} />
              WhatsApp
            </a>
            <div className="flex items-center gap-4 pt-2">
              <a
                href={info.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram do PertenSer"
                className="text-white/70 hover:text-blush-300 transition-colors"
              >
                <Instagram size={20} />
              </a>
              <a
                href={info.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook do PertenSer"
                className="text-white/70 hover:text-blush-300 transition-colors"
              >
                <Facebook size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-8 border-t border-white/10 text-xs text-white/50">
          © {ano} PertenSer. Todos os direitos reservados.
        </div>
      </Container>
    </footer>
  );
}
