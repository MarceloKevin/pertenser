import type { Metadata } from "next";
import Image from "next/image";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { LoginForm } from "@/components/auth/LoginForm";
import { RedirectIfAuthenticated } from "@/components/auth/RedirectIfAuthenticated";

export const metadata: Metadata = {
  title: "Entrar",
  description: "Acesse sua conta PertenSer.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <RedirectIfAuthenticated>
      <Header />
      <main className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-28 pb-16 sm:pt-32">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
        >
          <div className="absolute -top-24 -right-32 h-[22rem] w-[22rem] rounded-blob bg-gradient-to-br from-blush-100 to-blush-200 opacity-60" />
          <div className="absolute bottom-0 -left-32 h-[18rem] w-[18rem] rounded-blob bg-gradient-to-tr from-cloud to-blush-50 opacity-70" />
        </div>

        <div className="flex w-full max-w-md flex-col items-center gap-8">
          <Image
            src="/logo.png"
            alt="PertenSer"
            width={200}
            height={80}
            priority
            className="h-auto w-36 sm:w-40"
          />

          <div className="flex flex-col items-center gap-2 text-center">
            <h1 className="text-2xl font-semibold text-ink sm:text-3xl">
              Bem-vindo de volta
            </h1>
            <p className="text-sm text-stone sm:text-base">
              Entre com suas credenciais para continuar.
            </p>
          </div>

          <LoginForm />
        </div>
      </main>
      <Footer />
    </RedirectIfAuthenticated>
  );
}
