"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { type Historia, type Objetivo } from "@/lib/historia";
import { inputClasses } from "./inputStyles";

const EMPTY_HISTORIA: Historia = {
  titulo: "",
  primeiraParte: "",
  segundaParte: "",
};

type ModalState = { mode: "edit"; objetivo: Objetivo };

type HistoriaResponse = Historia & { id?: string; updatedAt?: string; error?: string };
type ObjetivoResponse = Objetivo & { error?: string };

function getAuthToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Sessão expirada. Faça login novamente.");
  }
  return token;
}

function ObjetivoModal({
  objetivo,
  onClose,
  onSave,
}: {
  objetivo: Objetivo;
  onClose: () => void;
  onSave: (data: { titulo: string; texto: string }) => Promise<void>;
}) {
  const [titulo, setTitulo] = useState(objetivo.titulo);
  const [texto, setTexto] = useState(objetivo.texto);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!titulo.trim() || !texto.trim()) return;

    setIsSaving(true);
    setError("");

    try {
      await onSave({ titulo: titulo.trim(), texto: texto.trim() });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível salvar o objetivo.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-labelledby="objetivo-modal-title"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-lg rounded-xl2 bg-white p-6 shadow-card sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full text-stone transition-colors hover:bg-mist hover:text-ink"
          aria-label="Fechar"
        >
          <X size={18} />
        </button>

        <h2
          id="objetivo-modal-title"
          className="mb-6 pr-10 text-xl font-semibold text-ink"
        >
          Editar objetivo
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="objetivo-titulo" className="text-sm font-medium text-ink">
              Objetivo
            </label>
            <input
              id="objetivo-titulo"
              name="titulo"
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex.: Acolhimento"
              className={inputClasses}
              required
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="objetivo-texto" className="text-sm font-medium text-ink">
              Texto
            </label>
            <textarea
              id="objetivo-texto"
              name="texto"
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Descreva este objetivo..."
              rows={4}
              className={`${inputClasses} resize-y min-h-[100px]`}
              required
            />
          </div>

          {error ? (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          ) : null}

          <div className="flex flex-wrap justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSaving}>
              {isSaving ? "Salvando..." : "Salvar alterações"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function truncate(text: string, max = 80) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

export function HistoriaSection() {
  const [form, setForm] = useState<Historia>(EMPTY_HISTORIA);
  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [isLoadingHistoria, setIsLoadingHistoria] = useState(true);
  const [isLoadingObjetivos, setIsLoadingObjetivos] = useState(true);
  const [isSavingHistoria, setIsSavingHistoria] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadHistoria() {
      setIsLoadingHistoria(true);
      setError("");

      try {
        const response = await fetch("/api/historia");
        const data = (await response.json()) as HistoriaResponse | null;

        if (!response.ok) {
          throw new Error(
            data?.error ?? "Não foi possível carregar a história.",
          );
        }

        if (!cancelled && data) {
          setForm({
            titulo: data.titulo ?? "",
            primeiraParte: data.primeiraParte ?? "",
            segundaParte: data.segundaParte ?? "",
          });
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Não foi possível carregar a história.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingHistoria(false);
        }
      }
    }

    async function loadObjetivos() {
      setIsLoadingObjetivos(true);

      try {
        const response = await fetch("/api/historia/objetivos");
        const data = (await response.json()) as ObjetivoResponse[];

        if (!response.ok) {
          throw new Error(
            (data as unknown as { error?: string })?.error ??
              "Não foi possível carregar os objetivos.",
          );
        }

        if (!cancelled) {
          setObjetivos(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Não foi possível carregar os objetivos.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoadingObjetivos(false);
        }
      }
    }

    void loadHistoria();
    void loadObjetivos();

    return () => {
      cancelled = true;
    };
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSavingHistoria(true);

    try {
      const token = getAuthToken();
      const response = await fetch("/api/historia", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = (await response.json()) as HistoriaResponse;

      if (!response.ok) {
        throw new Error(data.error ?? "Não foi possível salvar a história.");
      }

      setForm({
        titulo: data.titulo ?? "",
        primeiraParte: data.primeiraParte ?? "",
        segundaParte: data.segundaParte ?? "",
      });
      setSuccess("História salva com sucesso.");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível salvar a história.",
      );
    } finally {
      setIsSavingHistoria(false);
    }
  };

  const update = (field: keyof Historia, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSuccess("");
  };

  const closeModal = useCallback(() => setModal(null), []);

  const handleSaveObjetivo = useCallback(
    async (data: { titulo: string; texto: string }) => {
      if (!modal) return;

      const token = getAuthToken();
      const response = await fetch(
        `/api/historia/objetivos/${modal.objetivo.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...data,
            icon: modal.objetivo.icon,
          }),
        },
      );

      const updated = (await response.json()) as ObjetivoResponse;

      if (!response.ok) {
        throw new Error(updated.error ?? "Não foi possível salvar o objetivo.");
      }

      setObjetivos((prev) =>
        prev.map((item) =>
          item.id === modal.objetivo.id ? updated : item,
        ),
      );
      setModal(null);
    },
    [modal],
  );

  const handleDeleteObjetivo = useCallback(async (id: string) => {
    if (!window.confirm("Deseja excluir este objetivo?")) return;

    try {
      const token = getAuthToken();
      const response = await fetch(`/api/historia/objetivos/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = (await response.json()) as ObjetivoResponse;
        throw new Error(data.error ?? "Não foi possível excluir o objetivo.");
      }

      setObjetivos((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível excluir o objetivo.",
      );
    }
  }, []);

  return (
    <section
      id="nossa-historia"
      className="scroll-mt-32"
      aria-labelledby="historia-admin-title"
    >
      <SectionTitle
        eyebrow="Painel 5"
        title="Nossa história"
        description="Edite o título e os textos exibidos na seção de história da página inicial."
        className="mb-8"
      />

      <Card hoverLift={false} className="p-6 sm:p-8">
        {isLoadingHistoria ? (
          <p className="text-sm text-stone">Carregando história...</p>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label htmlFor="titulo" className="text-sm font-medium text-ink">
                Título
              </label>
              <input
                id="titulo"
                name="titulo"
                type="text"
                value={form.titulo}
                onChange={(e) => update("titulo", e.target.value)}
                placeholder="Título da seção"
                className={inputClasses}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="primeiraParte"
                className="text-sm font-medium text-ink"
              >
                Primeira parte do texto
              </label>
              <textarea
                id="primeiraParte"
                name="primeiraParte"
                value={form.primeiraParte}
                onChange={(e) => update("primeiraParte", e.target.value)}
                placeholder="Primeiro parágrafo da história..."
                rows={4}
                className={`${inputClasses} resize-y min-h-[100px]`}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label
                htmlFor="segundaParte"
                className="text-sm font-medium text-ink"
              >
                Segunda parte do texto
              </label>
              <textarea
                id="segundaParte"
                name="segundaParte"
                value={form.segundaParte}
                onChange={(e) => update("segundaParte", e.target.value)}
                placeholder="Segundo parágrafo da história..."
                rows={4}
                className={`${inputClasses} resize-y min-h-[100px]`}
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

            <Button
              type="submit"
              className="w-fit mt-2"
              disabled={isSavingHistoria}
            >
              {isSavingHistoria ? "Salvando..." : "Salvar informações"}
            </Button>

            <div className="mt-4 overflow-hidden rounded-xl border border-cloud">
              {isLoadingObjetivos ? (
                <p className="px-6 py-8 text-sm text-stone">
                  Carregando objetivos...
                </p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[640px] text-left text-sm">
                    <thead>
                      <tr className="border-b border-cloud bg-mist/60">
                        <th className="px-6 py-4 font-semibold text-ink">
                          Objetivo
                        </th>
                        <th className="px-6 py-4 font-semibold text-ink">
                          Texto
                        </th>
                        <th className="px-6 py-4 font-semibold text-ink text-right">
                          Ações
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {objetivos.length === 0 ? (
                        <tr>
                          <td
                            colSpan={3}
                            className="px-6 py-10 text-center text-stone-dark"
                          >
                            Nenhum objetivo cadastrado.
                          </td>
                        </tr>
                      ) : (
                        objetivos.map((objetivo) => (
                          <tr
                            key={objetivo.id}
                            className="border-b border-cloud/70 last:border-none hover:bg-mist/30 transition-colors"
                          >
                            <td className="px-6 py-4 font-medium text-ink align-top">
                              {objetivo.titulo}
                            </td>
                            <td className="px-6 py-4 text-stone-dark align-top">
                              {truncate(objetivo.texto)}
                            </td>
                            <td className="px-6 py-4 text-right align-top">
                              <div className="flex flex-wrap justify-end gap-2">
                                <Button
                                  type="button"
                                  variant="secondary"
                                  className="px-4 py-2 text-xs"
                                  onClick={() =>
                                    setModal({ mode: "edit", objetivo })
                                  }
                                >
                                  Editar
                                </Button>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  className="px-4 py-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                                  onClick={() =>
                                    handleDeleteObjetivo(objetivo.id)
                                  }
                                >
                                  Excluir
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </form>
        )}
      </Card>

      <AnimatePresence>
        {modal && (
          <ObjetivoModal
            objetivo={modal.objetivo}
            onClose={closeModal}
            onSave={handleSaveObjetivo}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
