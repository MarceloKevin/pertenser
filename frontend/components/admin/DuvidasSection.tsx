"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { type Duvida } from "@/lib/duvidas";
import { inputClasses } from "./inputStyles";

type ModalState =
  | { mode: "add" }
  | { mode: "edit"; duvida: Duvida };

type DuvidaResponse = Duvida & { error?: string };

function getAuthToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Sessão expirada. Faça login novamente.");
  }
  return token;
}

function DuvidaModal({
  state,
  onClose,
  onSave,
}: {
  state: ModalState;
  onClose: () => void;
  onSave: (data: { pergunta: string; resposta: string }) => Promise<void>;
}) {
  const isEdit = state.mode === "edit";
  const [pergunta, setPergunta] = useState(
    isEdit ? state.duvida.pergunta : "",
  );
  const [resposta, setResposta] = useState(
    isEdit ? state.duvida.resposta : "",
  );
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!pergunta.trim() || !resposta.trim()) return;

    setIsSaving(true);
    setError("");

    try {
      await onSave({
        pergunta: pergunta.trim(),
        resposta: resposta.trim(),
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível salvar a dúvida.",
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
      aria-labelledby="duvida-modal-title"
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
          id="duvida-modal-title"
          className="mb-6 pr-10 text-xl font-semibold text-ink"
        >
          {isEdit ? "Editar dúvida" : "Adicionar dúvida"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label htmlFor="pergunta" className="text-sm font-medium text-ink">
              Pergunta
            </label>
            <input
              id="pergunta"
              name="pergunta"
              type="text"
              value={pergunta}
              onChange={(e) => setPergunta(e.target.value)}
              placeholder="Ex.: O evento possui custo?"
              className={inputClasses}
              required
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="resposta" className="text-sm font-medium text-ink">
              Resposta
            </label>
            <textarea
              id="resposta"
              name="resposta"
              value={resposta}
              onChange={(e) => setResposta(e.target.value)}
              placeholder="Escreva a resposta para esta dúvida..."
              rows={5}
              className={`${inputClasses} resize-y min-h-[120px]`}
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
              {isSaving
                ? "Salvando..."
                : isEdit
                  ? "Salvar alterações"
                  : "Adicionar dúvida"}
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

export function DuvidasSection() {
  const [duvidas, setDuvidas] = useState<Duvida[]>([]);
  const [modal, setModal] = useState<ModalState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadDuvidas() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("/api/duvidas");
        const data = (await response.json()) as DuvidaResponse[];

        if (!response.ok) {
          throw new Error(
            (data as unknown as { error?: string })?.error ??
              "Não foi possível carregar as dúvidas.",
          );
        }

        if (!cancelled) {
          setDuvidas(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Não foi possível carregar as dúvidas.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadDuvidas();

    return () => {
      cancelled = true;
    };
  }, []);

  const closeModal = useCallback(() => setModal(null), []);

  const handleSave = useCallback(
    async (data: { pergunta: string; resposta: string }) => {
      const token = getAuthToken();

      if (modal?.mode === "add") {
        const response = await fetch("/api/duvidas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        const created = (await response.json()) as DuvidaResponse;

        if (!response.ok) {
          throw new Error(created.error ?? "Não foi possível criar a dúvida.");
        }

        setDuvidas((prev) => [...prev, created]);
      } else if (modal?.mode === "edit") {
        const response = await fetch(`/api/duvidas/${modal.duvida.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        });

        const updated = (await response.json()) as DuvidaResponse;

        if (!response.ok) {
          throw new Error(
            updated.error ?? "Não foi possível salvar a dúvida.",
          );
        }

        setDuvidas((prev) =>
          prev.map((item) =>
            item.id === modal.duvida.id ? updated : item,
          ),
        );
      }

      setModal(null);
    },
    [modal],
  );

  const handleDelete = useCallback(async (id: string) => {
    if (!window.confirm("Deseja excluir esta dúvida?")) return;

    try {
      const token = getAuthToken();
      const response = await fetch(`/api/duvidas/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = (await response.json()) as DuvidaResponse;
        throw new Error(data.error ?? "Não foi possível excluir a dúvida.");
      }

      setDuvidas((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível excluir a dúvida.",
      );
    }
  }, []);

  return (
    <section
      id="duvidas-frequentes"
      className="scroll-mt-32"
      aria-labelledby="duvidas-admin-title"
    >
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionTitle
          eyebrow="Painel 4"
          title="Dúvidas frequentes"
          description="Gerencie as perguntas e respostas exibidas na seção de dúvidas do site."
          className="mb-0"
        />
        <Button
          type="button"
          onClick={() => setModal({ mode: "add" })}
          className="shrink-0"
        >
          Adicionar dúvida
        </Button>
      </div>

      {error ? (
        <p className="mb-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <Card hoverLift={false} className="overflow-hidden">
        {isLoading ? (
          <p className="px-6 py-8 text-sm text-stone">Carregando dúvidas...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-cloud bg-mist/60">
                  <th className="px-6 py-4 font-semibold text-ink">Pergunta</th>
                  <th className="px-6 py-4 font-semibold text-ink">Resposta</th>
                  <th className="px-6 py-4 font-semibold text-ink text-right">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody>
                {duvidas.length === 0 ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="px-6 py-10 text-center text-stone-dark"
                    >
                      Nenhuma dúvida cadastrada. Clique em &quot;Adicionar
                      dúvida&quot; para começar.
                    </td>
                  </tr>
                ) : (
                  duvidas.map((duvida) => (
                    <tr
                      key={duvida.id}
                      className="border-b border-cloud/70 last:border-none hover:bg-mist/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-ink align-top">
                        {duvida.pergunta}
                      </td>
                      <td className="px-6 py-4 text-stone-dark align-top">
                        {truncate(duvida.resposta)}
                      </td>
                      <td className="px-6 py-4 text-right align-top">
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            className="px-4 py-2 text-xs"
                            onClick={() =>
                              setModal({ mode: "edit", duvida })
                            }
                          >
                            Editar pergunta
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            className="px-4 py-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                            onClick={() => handleDelete(duvida.id)}
                          >
                            Excluir pergunta
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
      </Card>

      <AnimatePresence>
        {modal && (
          <DuvidaModal
            state={modal}
            onClose={closeModal}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
