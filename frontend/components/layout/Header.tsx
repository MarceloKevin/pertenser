  "use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter, usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Container } from "./Container";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  href: string;
  action?: "logout";
};

const NAV_ITEMS: NavItem[] = [
  { label: "Início", href: "#inicio" },
  { label: "História", href: "#historia" },
  { label: "Eventos", href: "#eventos" },
  { label: "Próximo Evento", href: "#proximo-evento" },
  { label: "Dúvidas", href: "#duvidas" },
  { label: "Contato", href: "#contato" },
  { label: "Entrar", href: "/login" },
];

const ADMIN_NAV_ITEMS: NavItem[] = [
  { label: "Início", href: "/" },
  { label: "Informações gerais", href: "#informacoes-gerais" },
  { label: "Próximo evento", href: "#proximo-evento" },
  { label: "Eventos realizados", href: "#eventos-realizados" },
  { label: "Dúvidas frequentes", href: "#duvidas-frequentes" },
  { label: "Nossa história", href: "#nossa-historia" },
  { label: "Sair", href: "/login", action: "logout" },
];

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isGerenciamento = pathname === "/gerenciamento";
  const navItems = isGerenciamento ? ADMIN_NAV_ITEMS : NAV_ITEMS;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    action?: "logout"
  ) => {
    setMenuOpen(false);

    if (action === "logout") {
      e.preventDefault();
      localStorage.removeItem("token");
      router.push("/login");
      return;
    }

    if (href.startsWith("/")) {
      e.preventDefault();
      router.push(href);
      return;
    }

    if (isHome || isGerenciamento) {
      e.preventDefault();
      document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
      return;
    }

    // Em páginas internas (ex: /eventos/[slug]), navega de volta para a home e rola até a seção.
    e.preventDefault();
    router.push(`/${href}`);
  };

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white/80 backdrop-blur-md shadow-soft"
          : "bg-transparent"
      )}
    >
      <Container className="flex items-center justify-between py-4">
        <a
          href={isGerenciamento ? "/" : "#inicio"}
          onClick={(e) =>
            handleNavClick(e, isGerenciamento ? "/" : "#inicio")
          }
          className="flex items-center shrink-0"
        >
          <Image
            src="/logo.png"
            alt="Pertenser"
            width={160}
            height={48}
            priority
            className="h-8 w-auto sm:h-9"
          />
        </a>

        <nav
          aria-label="Navegação principal"
          className="hidden lg:flex items-center gap-8"
        >
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href, item.action)}
              className={cn(
                "text-sm font-medium transition-colors",
                item.action === "logout"
                  ? "text-stone-dark hover:text-red-600"
                  : "text-stone-dark hover:text-blush-600"
              )}
            >
              {item.label}
            </a>
          ))}
        </nav>

        {!isGerenciamento ? (
          <div className="hidden lg:block">
            <Button href="#proximo-evento" className="text-sm px-5 py-2.5">
              Próximo Evento
            </Button>
          </div>
        ) : null}

        <button
          className="lg:hidden flex items-center justify-center h-10 w-10 rounded-full text-ink"
          aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </Container>

      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            aria-label="Navegação mobile"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden overflow-hidden bg-white border-t border-cloud"
          >
            <Container className="flex flex-col py-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href, item.action)}
                  className={cn(
                    "py-3 text-base font-medium border-b border-cloud last:border-none",
                    item.action === "logout" ? "text-red-600" : "text-ink"
                  )}
                >
                  {item.label}
                </a>
              ))}
              {!isGerenciamento ? (
                <Button href="#proximo-evento" className="mt-4 w-full">
                  Próximo Evento
                </Button>
              ) : null}
            </Container>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
