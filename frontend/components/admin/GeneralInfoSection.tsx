"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { inputClasses } from "./inputStyles";

type GeneralInfoForm = {
  whatsapp: string;
  email: string;
  instagram: string;
  facebook: string;
  youtube: string;
};

const EMPTY_FORM: GeneralInfoForm = {
  whatsapp: "",
  email: "",
  instagram: "",
  facebook: "",
  youtube: "",
};

type GeneralInfoResponse = GeneralInfoForm & {
  id?: string;
  updatedAt?: string;
  error?: string;
};

export function GeneralInfoSection() {
  const [form, setForm] = useState<GeneralInfoForm>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadGeneralInfo() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("/api/general-info");
        const data = (await response.json()) as GeneralInfoResponse | null;

        if (!response.ok) {
          throw new Error(
            (data as GeneralInfoResponse | null)?.error ??
              "Não foi possível carregar as informações.",
          );
        }

        if (!cancelled && data) {
          setForm({
            whatsapp: data.whatsapp ?? "",
            email: data.email ?? "",
            instagram: data.instagram ?? "",
            facebook: data.facebook ?? "",
            youtube: data.youtube ?? "",
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Não foi possível carregar as informações.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadGeneralInfo();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSaving(true);

    const token = localStorage.getItem("token");

    if (!token) {
      setError("Sessão expirada. Faça login novamente.");
      setIsSaving(false);
      return;
    }

    try {
      const response = await fetch("/api/general-info", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as GeneralInfoResponse;

      if (!response.ok) {
        throw new Error(
          data.error ?? "Não foi possível salvar as informações.",
        );
      }

      setForm({
        whatsapp: data.whatsapp ?? "",
        email: data.email ?? "",
        instagram: data.instagram ?? "",
        facebook: data.facebook ?? "",
        youtube: data.youtube ?? "",
      });
      setSuccess("Informações salvas com sucesso.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível salvar as informações.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const update = (field: keyof GeneralInfoForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccess("");
  };

  return (
    <section
      id="informacoes-gerais"
      className="scroll-mt-32"
      aria-labelledby="general-info-title"
    >
      <SectionTitle
        eyebrow="Painel 1"
        title="Informações gerais"
        description="Edite os dados de contato e os links das redes sociais exibidos no site."
        className="mb-8"
      />

      <Card hoverLift={false} className="p-6 sm:p-8">
        {isLoading ? (
          <p className="text-sm text-stone">Carregando informações...</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="whatsapp" className="text-sm font-medium text-ink">
                  WhatsApp para contato
                </label>
                <input
                  id="whatsapp"
                  name="whatsapp"
                  type="tel"
                  value={form.whatsapp}
                  onChange={(e) => update("whatsapp", e.target.value)}
                  placeholder="5511999999999"
                  className={inputClasses}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm font-medium text-ink">
                  E-mail para contato
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  placeholder="contato@pertenser.com.br"
                  className={inputClasses}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="instagram" className="text-sm font-medium text-ink">
                Link do perfil do Instagram
              </label>
              <input
                id="instagram"
                name="instagram"
                type="url"
                value={form.instagram}
                onChange={(e) => update("instagram", e.target.value)}
                placeholder="https://www.instagram.com/pertenser"
                className={inputClasses}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="facebook" className="text-sm font-medium text-ink">
                Link do perfil do Facebook
              </label>
              <input
                id="facebook"
                name="facebook"
                type="url"
                value={form.facebook}
                onChange={(e) => update("facebook", e.target.value)}
                placeholder="https://www.facebook.com/pertenser"
                className={inputClasses}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="youtube" className="text-sm font-medium text-ink">
                Link do perfil do YouTube
              </label>
              <input
                id="youtube"
                name="youtube"
                type="url"
                value={form.youtube}
                onChange={(e) => update("youtube", e.target.value)}
                placeholder="https://www.youtube.com/@pertenser"
                className={inputClasses}
                required
              />
            </div>

            {error ? (
              <p className="text-sm text-red-600" role="alert">
                {error}
              </p>
            ) : null}

            {success ? (
              <p className="text-sm text-green-700" role="status">
                {success}
              </p>
            ) : null}

            <Button type="submit" className="w-fit mt-2" disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar informações"}
            </Button>
          </form>
        )}
      </Card>
    </section>
  );
}
