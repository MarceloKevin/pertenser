"use client";

import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Toggle } from "@/components/ui/Toggle";
import { inputClasses } from "./inputStyles";

type ProximoEventoForm = {
  ativo: boolean;
  nome: string;
  descricao: string;
  local: string;
  data: string;
  horario: string;
  imagem: string;
};

const EMPTY_FORM: ProximoEventoForm = {
  ativo: false,
  nome: "",
  descricao: "",
  local: "",
  data: "",
  horario: "",
  imagem: "",
};

type ProximoEventoResponse = ProximoEventoForm & {
  id?: string;
  updatedAt?: string;
  error?: string;
};

function toDateInputValue(value: string): string {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }
  return "";
}

function toTimeInputValue(value: string): string {
  const match = value.match(/^(\d{2}:\d{2})/);
  return match ? match[1] : "";
}

export function NextEventSection() {
  const [form, setForm] = useState<ProximoEventoForm>(EMPTY_FORM);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadProximoEvento() {
      setIsLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        if (!cancelled) {
          setError("Sessão expirada. Faça login novamente.");
          setIsLoading(false);
        }
        return;
      }

      try {
        const response = await fetch("/api/proximo-evento/admin", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = (await response.json()) as ProximoEventoResponse | null;

        if (!response.ok) {
          throw new Error(
            (data as ProximoEventoResponse | null)?.error ??
              "Não foi possível carregar o próximo evento.",
          );
        }

        if (!cancelled && data) {
          setForm({
            ativo: data.ativo ?? false,
            nome: data.nome ?? "",
            descricao: data.descricao ?? "",
            local: data.local ?? "",
            data: toDateInputValue(data.data ?? ""),
            horario: toTimeInputValue(data.horario ?? ""),
            imagem: data.imagem ?? "",
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Não foi possível carregar o próximo evento.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadProximoEvento();

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
      const response = await fetch("/api/proximo-evento", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as ProximoEventoResponse;

      if (!response.ok) {
        throw new Error(
          data.error ?? "Não foi possível salvar o próximo evento.",
        );
      }

      setForm({
        ativo: data.ativo ?? false,
        nome: data.nome ?? "",
        descricao: data.descricao ?? "",
        local: data.local ?? "",
        data: toDateInputValue(data.data ?? ""),
        horario: toTimeInputValue(data.horario ?? ""),
        imagem: data.imagem ?? "",
      });
      setSuccess("Próximo evento salvo com sucesso.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível salvar o próximo evento.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const update = <K extends keyof ProximoEventoForm>(
    field: K,
    value: ProximoEventoForm[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccess("");
  };

  return (
    <section
      id="proximo-evento"
      className="scroll-mt-32"
      aria-labelledby="next-event-title"
    >
      <SectionTitle
        eyebrow="Painel 2"
        title="Próximo evento"
        description="Organize e publique as informações do próximo encontro."
        className="mb-8"
      />

      <Card hoverLift={false} className="p-6 sm:p-8">
        {isLoading ? (
          <p className="text-sm text-stone">Carregando próximo evento...</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Toggle
              id="evento-ativo"
              checked={form.ativo}
              onChange={(value) => update("ativo", value)}
              label="Evento ativo"
              description={
                form.ativo
                  ? "O evento será exibido na página inicial."
                  : "O evento ficará oculto para os visitantes."
              }
            />

            <div className="flex flex-col gap-2">
              <label htmlFor="nome" className="text-sm font-medium text-ink">
                Nome do evento
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                value={form.nome}
                onChange={(e) => update("nome", e.target.value)}
                placeholder="Ex.: Círculo de Escuta: Reencontros"
                className={inputClasses}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="descricao"
                className="text-sm font-medium text-ink"
              >
                Descrição
              </label>
              <textarea
                id="descricao"
                name="descricao"
                value={form.descricao}
                onChange={(e) => update("descricao", e.target.value)}
                placeholder="Descreva o encontro para os visitantes."
                rows={4}
                className={inputClasses}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="endereco" className="text-sm font-medium text-ink">
                Endereço
              </label>
              <input
                id="endereco"
                name="endereco"
                type="text"
                value={form.local}
                onChange={(e) => update("local", e.target.value)}
                placeholder="Local do evento"
                className={inputClasses}
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="data" className="text-sm font-medium text-ink">
                  Data
                </label>
                <input
                  id="data"
                  name="data"
                  type="date"
                  value={form.data}
                  onChange={(e) => update("data", e.target.value)}
                  className={inputClasses}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="horario" className="text-sm font-medium text-ink">
                  Horário de início
                </label>
                <input
                  id="horario"
                  name="horario"
                  type="time"
                  value={form.horario}
                  onChange={(e) => update("horario", e.target.value)}
                  className={inputClasses}
                  required
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="imagem" className="text-sm font-medium text-ink">
                Foto do evento
              </label>
              <input
                id="imagem"
                name="imagem"
                type="url"
                value={form.imagem}
                onChange={(e) => update("imagem", e.target.value)}
                placeholder="https://exemplo.com/foto-do-evento.jpg"
                className={inputClasses}
                required
              />
              <p className="text-xs text-stone">
                Cole a URL da imagem ou o caminho de um arquivo em{" "}
                <code className="rounded bg-mist px-1.5 py-0.5 text-stone-dark">
                  /public
                </code>
                .
              </p>
              {form.imagem.trim() && (
                <div className="relative mt-2 h-48 w-full overflow-hidden rounded-xl2 border border-cloud bg-mist sm:h-56">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={form.imagem}
                    alt="Pré-visualização da foto do evento"
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
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

            <Button type="submit" className="w-fit" disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar próximo evento"}
            </Button>
          </form>
        )}
      </Card>
    </section>
  );
}
