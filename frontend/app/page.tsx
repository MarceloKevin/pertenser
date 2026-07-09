import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/sections/Hero";
import { About } from "@/components/sections/About";
import { NextEvent } from "@/components/sections/NextEvent";
import { Events } from "@/components/sections/Events";
import { FAQ } from "@/components/sections/FAQ";
import { Footer } from "@/components/layout/Footer";
import { fetchDuvidas } from "@/lib/duvidas";
import { fetchEventosRealizados, fetchProximoEvento } from "@/lib/events";
import { fetchHistoria, fetchObjetivos } from "@/lib/historia";

export default async function HomePage() {
  const [historia, objetivos, eventosRealizados, proximoEvento, duvidas] =
    await Promise.all([
      fetchHistoria(),
      fetchObjetivos(),
      fetchEventosRealizados(),
      fetchProximoEvento(),
      fetchDuvidas(),
    ]);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About historia={historia} objetivos={objetivos} />
        <Events eventos={eventosRealizados} />
        <NextEvent evento={proximoEvento} />
        <FAQ duvidas={duvidas} />
      </main>
      <Footer />
    </>
  );
}
