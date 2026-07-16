"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Copy, Eye, Plus, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { type Depoimento, type EventoRealizado, type VideoEvento } from "@/lib/events";
import { inputClasses } from "./inputStyles";

function truncate(text: string, max = 60) {
  if (text.length <= max) return text;
  return `${text.slice(0, max).trimEnd()}…`;
}

function EventoAddModal({
  onClose,
  onCreate,
}: {
  onClose: () => void;
  onCreate: (data: { nome: string; data: string }) => Promise<void>;
}) {
  const [nome, setNome] = useState("");
  const [data, setData] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!nome.trim() || !data) return;

    setIsSaving(true);
    setError("");

    try {
      await onCreate({ nome: nome.trim(), data });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível criar o evento.",
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
      aria-labelledby="evento-add-modal-title"
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
          id="evento-add-modal-title"
          className="mb-6 pr-10 text-xl font-semibold text-ink"
        >
          Adicionar evento
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label
              htmlFor="novo-evento-nome"
              className="text-sm font-medium text-ink"
            >
              Nome do evento
            </label>
            <input
              id="novo-evento-nome"
              name="nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex.: Círculo de Escuta"
              className={inputClasses}
              required
              autoFocus
            />
          </div>

          <div className="flex flex-col gap-2">
            <label
              htmlFor="novo-evento-data"
              className="text-sm font-medium text-ink"
            >
              Data
            </label>
            <input
              id="novo-evento-data"
              name="data"
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className={inputClasses}
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
              {isSaving ? "Criando..." : "Criar evento"}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function getImageName(url: string) {
  return url.split("/").pop() ?? url;
}

function EventoEditModal({
  evento,
  onClose,
  onSave,
}: {
  evento: EventoRealizado;
  onClose: () => void;
  onSave: (data: EventoRealizado) => Promise<void>;
}) {
  const [form, setForm] = useState<EventoRealizado>({
    ...evento,
    depoimentos: evento.depoimentos ?? [],
    videos: evento.videos ?? [],
  });
  const [momentosText, setMomentosText] = useState(
    evento.momentosMarcantes.join("\n"),
  );
  const [uploading, setUploading] = useState(false);
  const [uploadingGaleria, setUploadingGaleria] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [galeriaUploadError, setGaleriaUploadError] = useState<string | null>(
    null,
  );
  const [copied, setCopied] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const galeriaFileInputRef = useRef<HTMLInputElement>(null);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const update = <K extends keyof EventoRealizado>(
    field: K,
    value: EventoRealizado[K],
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateDepoimento = (
    index: number,
    field: keyof Depoimento,
    value: string,
  ) => {
    setForm((prev) => ({
      ...prev,
      depoimentos: prev.depoimentos.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const addDepoimento = () => {
    setForm((prev) => ({
      ...prev,
      depoimentos: [...prev.depoimentos, { nome: "", texto: "" }],
    }));
  };

  const removeDepoimento = (index: number) => {
    setForm((prev) => ({
      ...prev,
      depoimentos: prev.depoimentos.filter((_, i) => i !== index),
    }));
  };

  const updateVideo = (
    index: number,
    field: keyof VideoEvento,
    value: string | number,
  ) => {
    setForm((prev) => ({
      ...prev,
      videos: prev.videos.map((item, i) =>
        i === index ? { ...item, [field]: value } : item,
      ),
    }));
  };

  const addVideo = () => {
    setForm((prev) => ({
      ...prev,
      videos: [
        ...prev.videos,
        { titulo: "", url: "", ordem: prev.videos.length },
      ],
    }));
  };

  const removeVideo = (index: number) => {
    setForm((prev) => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index),
    }));
  };

  const removeGaleriaImage = (index: number) => {
    setForm((prev) => ({
      ...prev,
      galeria: prev.galeria.filter((_, i) => i !== index),
    }));
  };

  const uploadImageFile = async (file: File, folder?: "galeria") => {
    const body = new FormData();
    body.append("file", file);
    body.append("slug", form.slug.trim());
    if (folder) body.append("folder", folder);

    const response = await fetch("/api/upload", {
      method: "POST",
      body,
    });

    const data = (await response.json()) as { url?: string; error?: string };

    if (!response.ok || !data.url) {
      throw new Error(data.error ?? "Erro ao fazer upload.");
    }

    return data.url;
  };

  const handleCopyPath = async () => {
    if (!form.imagemDestaque.trim()) return;

    try {
      await navigator.clipboard.writeText(form.imagemDestaque);
      setCopied(true);
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
      copyTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
    } catch {
      setUploadError("Não foi possível copiar o caminho.");
    }
  };

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) clearTimeout(copyTimeoutRef.current);
    };
  }, []);

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!form.slug.trim()) {
      setUploadError("Informe o slug do evento antes de enviar a imagem.");
      return;
    }

    setUploading(true);
    setUploadError(null);

    try {
      const url = await uploadImageFile(file);
      update("imagemDestaque", url);
    } catch (error) {
      setUploadError(
        error instanceof Error ? error.message : "Erro ao fazer upload.",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleGaleriaUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!form.slug.trim()) {
      setGaleriaUploadError(
        "Informe o slug do evento antes de enviar a imagem.",
      );
      return;
    }

    setUploadingGaleria(true);
    setGaleriaUploadError(null);

    try {
      const url = await uploadImageFile(file, "galeria");
      setForm((prev) => ({
        ...prev,
        galeria: [...prev.galeria, url],
      }));
    } catch (error) {
      setGaleriaUploadError(
        error instanceof Error ? error.message : "Erro ao fazer upload.",
      );
    } finally {
      setUploadingGaleria(false);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveError("");

    try {
      await onSave({
        ...form,
        momentosMarcantes: momentosText
          .split("\n")
          .map((item) => item.trim())
          .filter(Boolean),
        depoimentos: form.depoimentos.filter(
          (item) => item.nome.trim() && item.texto.trim(),
        ),
        videos: form.videos
          .filter((item) => item.url.trim())
          .map((item, index) => ({
            titulo: item.titulo.trim(),
            url: item.url.trim(),
            ordem: Number.isFinite(item.ordem) ? item.ordem : index,
          })),
      });
    } catch (err) {
      setSaveError(
        err instanceof Error
          ? err.message
          : "Não foi possível salvar o evento.",
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
      aria-labelledby="evento-modal-title"
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
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col rounded-xl2 bg-white shadow-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-cloud px-6 py-5 sm:px-8">
          <h2
            id="evento-modal-title"
            className="text-xl font-semibold text-ink"
          >
            Editar evento
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-stone transition-colors hover:bg-mist hover:text-ink"
            aria-label="Fechar"
          >
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 overflow-y-auto px-6 py-6 sm:px-8">
            <div className="flex flex-col gap-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label htmlFor="nome" className="text-sm font-medium text-ink">
                    Nome do evento
                  </label>
                  <input
                    id="nome"
                    name="nome"
                    type="text"
                    value={form.nome}
                    onChange={(e) => update("nome", e.target.value)}
                    className={inputClasses}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="slug" className="text-sm font-medium text-ink">
                    Slug (URL)
                  </label>
                  <input
                    id="slug"
                    name="slug"
                    type="text"
                    value={form.slug}
                    onChange={(e) => update("slug", e.target.value)}
                    className={inputClasses}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label htmlFor="data" className="text-sm font-medium text-ink">
                    Data (ISO)
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

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label
                    htmlFor="dataFormatada"
                    className="text-sm font-medium text-ink"
                  >
                    Data formatada
                  </label>
                  <input
                    id="dataFormatada"
                    name="dataFormatada"
                    type="text"
                    value={form.dataFormatada}
                    onChange={(e) => update("dataFormatada", e.target.value)}
                    placeholder="Ex.: 12 de abril de 2026"
                    className={inputClasses}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label htmlFor="resumo" className="text-sm font-medium text-ink">
                    Resumo
                  </label>
                  <textarea
                    id="resumo"
                    name="resumo"
                    value={form.resumo}
                    onChange={(e) => update("resumo", e.target.value)}
                    rows={3}
                    className={`${inputClasses} resize-y min-h-[88px]`}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label
                    htmlFor="descricaoCompleta"
                    className="text-sm font-medium text-ink"
                  >
                    Descrição completa
                  </label>
                  <textarea
                    id="descricaoCompleta"
                    name="descricaoCompleta"
                    value={form.descricaoCompleta}
                    onChange={(e) => update("descricaoCompleta", e.target.value)}
                    rows={4}
                    className={`${inputClasses} resize-y min-h-[112px]`}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label
                    htmlFor="objetivo"
                    className="text-sm font-medium text-ink"
                  >
                    Objetivo
                  </label>
                  <textarea
                    id="objetivo"
                    name="objetivo"
                    value={form.objetivo}
                    onChange={(e) => update("objetivo", e.target.value)}
                    rows={3}
                    className={`${inputClasses} resize-y min-h-[88px]`}
                    required
                  />
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <label
                    htmlFor="momentosMarcantes"
                    className="text-sm font-medium text-ink"
                  >
                    Momentos marcantes
                  </label>
                  <textarea
                    id="momentosMarcantes"
                    name="momentosMarcantes"
                    value={momentosText}
                    onChange={(e) => setMomentosText(e.target.value)}
                    rows={4}
                    placeholder="Um momento por linha"
                    className={`${inputClasses} resize-y min-h-[112px]`}
                  />
                </div>

                <div className="flex flex-col gap-2 sm:col-span-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-fit px-4 py-2 text-xs"
                    disabled={uploading}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Upload size={16} />
                    {uploading ? "Enviando…" : "Upload imagem"}
                  </Button>
                  {uploadError && (
                    <p className="text-xs text-red-600">{uploadError}</p>
                  )}
                  {form.imagemDestaque.trim() && (
                    <div className="flex flex-col gap-1.5">
                      <span className="text-xs font-medium text-stone">
                        Caminho relativo
                      </span>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          readOnly
                          value={form.imagemDestaque}
                          onFocus={(e) => e.target.select()}
                          className={`${inputClasses} flex-1 cursor-text bg-mist/50`}
                          aria-label="Caminho relativo da imagem"
                        />
                        <Button
                          type="button"
                          variant="secondary"
                          className="shrink-0 px-3 py-2 text-xs"
                          onClick={handleCopyPath}
                        >
                          <Copy size={14} />
                          {copied ? "Copiado!" : "Copiar"}
                        </Button>
                      </div>
                    </div>
                  )}
                  <label
                    htmlFor="imagemDestaque"
                    className="text-sm font-medium text-ink"
                  >
                    Imagem de destaque
                  </label>
                  <input
                    id="imagemDestaque"
                    name="imagemDestaque"
                    type="text"
                    value={form.imagemDestaque}
                    onChange={(e) => update("imagemDestaque", e.target.value)}
                    className={inputClasses}
                    required
                  />
                </div>

                <div className="flex flex-col gap-3 sm:col-span-2">
                  <input
                    ref={galeriaFileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    className="hidden"
                    onChange={handleGaleriaUpload}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-fit px-4 py-2 text-xs"
                    disabled={uploadingGaleria}
                    onClick={() => galeriaFileInputRef.current?.click()}
                  >
                    <Upload size={16} />
                    {uploadingGaleria
                      ? "Enviando…"
                      : "Upload foto para galeria de fotos"}
                  </Button>
                  {galeriaUploadError && (
                    <p className="text-xs text-red-600">{galeriaUploadError}</p>
                  )}
                  <span className="text-sm font-medium text-ink">
                    Galeria de fotos
                  </span>

                  {form.galeria.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-cloud px-4 py-6 text-center text-sm text-stone">
                      Nenhuma imagem na galeria.
                    </p>
                  ) : (
                    <div className="overflow-x-auto rounded-xl border border-cloud">
                      <table className="w-full min-w-[480px] text-left text-sm">
                        <thead>
                          <tr className="border-b border-cloud bg-mist/60">
                            <th className="px-4 py-3 font-semibold text-ink">
                              Imagem
                            </th>
                            <th className="px-4 py-3 font-semibold text-ink text-right">
                              Ações
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {form.galeria.map((imagem, index) => (
                            <tr
                              key={`${imagem}-${index}`}
                              className="border-b border-cloud/70 last:border-none hover:bg-mist/30 transition-colors"
                            >
                              <td className="px-4 py-3 align-top">
                                <span
                                  className="block font-medium text-ink"
                                  title={imagem}
                                >
                                  {getImageName(imagem)}
                                </span>
                                <span className="mt-0.5 block text-xs text-stone truncate max-w-[280px] sm:max-w-[360px]">
                                  {imagem}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-right align-top">
                                <div className="flex flex-wrap justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => removeGaleriaImage(index)}
                                    className="inline-flex items-center gap-1 rounded-full border border-cloud px-3 py-1.5 text-xs font-medium text-red-600 transition-colors hover:border-red-200 hover:bg-red-50"
                                  >
                                    <Trash2 size={14} />
                                    Excluir
                                  </button>
                                  <a
                                    href={imagem}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1 rounded-full border border-cloud px-3 py-1.5 text-xs font-medium text-ink transition-colors hover:border-blush-300 hover:text-blush-700"
                                  >
                                    <Eye size={14} />
                                    Visualizar
                                  </a>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:col-span-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-ink">
                      Depoimentos
                    </span>
                    <button
                      type="button"
                      onClick={addDepoimento}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-blush-600 hover:text-blush-700"
                    >
                      <Plus size={16} />
                      Adicionar depoimento
                    </button>
                  </div>

                  {form.depoimentos.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-cloud px-4 py-6 text-center text-sm text-stone">
                      Nenhum depoimento cadastrado.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {form.depoimentos.map((depoimento, index) => (
                        <div
                          key={index}
                          className="rounded-xl border border-cloud bg-mist/40 p-4"
                        >
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <span className="text-xs font-semibold uppercase tracking-wide text-stone">
                              Depoimento {index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeDepoimento(index)}
                              className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={14} />
                              Remover
                            </button>
                          </div>
                          <div className="flex flex-col gap-3">
                            <input
                              type="text"
                              value={depoimento.nome}
                              onChange={(e) =>
                                updateDepoimento(index, "nome", e.target.value)
                              }
                              placeholder="Nome"
                              className={inputClasses}
                            />
                            <textarea
                              value={depoimento.texto}
                              onChange={(e) =>
                                updateDepoimento(index, "texto", e.target.value)
                              }
                              placeholder="Texto do depoimento"
                              rows={3}
                              className={`${inputClasses} resize-y min-h-[88px]`}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col gap-3 sm:col-span-2">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-ink">
                      Vídeos do evento
                    </span>
                    <button
                      type="button"
                      onClick={addVideo}
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-blush-600 hover:text-blush-700"
                    >
                      <Plus size={16} />
                      Adicionar vídeo
                    </button>
                  </div>

                  {form.videos.length === 0 ? (
                    <p className="rounded-xl border border-dashed border-cloud px-4 py-6 text-center text-sm text-stone">
                      Nenhum vídeo cadastrado.
                    </p>
                  ) : (
                    <div className="flex flex-col gap-4">
                      {form.videos.map((video, index) => (
                        <div
                          key={index}
                          className="rounded-xl border border-cloud bg-mist/40 p-4"
                        >
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <span className="text-xs font-semibold uppercase tracking-wide text-stone">
                              Vídeo {index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removeVideo(index)}
                              className="inline-flex items-center gap-1 text-xs font-medium text-red-600 hover:text-red-700"
                            >
                              <Trash2 size={14} />
                              Remover
                            </button>
                          </div>
                          <div className="flex flex-col gap-3">
                            <input
                              type="text"
                              value={video.titulo}
                              onChange={(e) =>
                                updateVideo(index, "titulo", e.target.value)
                              }
                              placeholder="Título"
                              className={inputClasses}
                            />
                            <input
                              type="url"
                              value={video.url}
                              onChange={(e) =>
                                updateVideo(index, "url", e.target.value)
                              }
                              placeholder="Link do vídeo (YouTube, Instagram, Vimeo...)"
                              className={inputClasses}
                            />
                            <input
                              type="number"
                              min={0}
                              value={video.ordem}
                              onChange={(e) =>
                                updateVideo(
                                  index,
                                  "ordem",
                                  Number.parseInt(e.target.value, 10) || 0,
                                )
                              }
                              placeholder="Ordem"
                              className={inputClasses}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-t border-cloud px-6 py-5 sm:px-8">
            {saveError ? (
              <p className="text-sm text-red-600" role="alert">
                {saveError}
              </p>
            ) : null}

            <div className="flex flex-wrap justify-end gap-3">
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
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

type EventosResponse = EventoRealizado & { error?: string };

function getAuthToken() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Sessão expirada. Faça login novamente.");
  }
  return token;
}

export function PastEventsSection() {
  const [eventos, setEventos] = useState<EventoRealizado[]>([]);
  const [editingEvento, setEditingEvento] = useState<EventoRealizado | null>(
    null,
  );
  const [showAddModal, setShowAddModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;

    async function loadEventos() {
      setIsLoading(true);
      setError("");

      try {
        const response = await fetch("/api/eventos");
        const data = (await response.json()) as EventosResponse[];

        if (!response.ok) {
          throw new Error(
            (data as unknown as { error?: string })?.error ??
              "Não foi possível carregar os eventos.",
          );
        }

        if (!cancelled) {
          setEventos(
            Array.isArray(data)
              ? data.map((item) => ({
                  ...item,
                  depoimentos: item.depoimentos ?? [],
                  videos: item.videos ?? [],
                }))
              : [],
          );
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Não foi possível carregar os eventos.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadEventos();

    return () => {
      cancelled = true;
    };
  }, []);

  const closeEditModal = useCallback(() => setEditingEvento(null), []);
  const closeAddModal = useCallback(() => setShowAddModal(false), []);

  const handleSave = useCallback(
    async (updated: EventoRealizado) => {
      if (!editingEvento) return;

      const token = getAuthToken();
      const response = await fetch(`/api/eventos/${editingEvento.slug}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...updated, slug: editingEvento.slug }),
      });

      const data = (await response.json()) as EventosResponse;

      if (!response.ok) {
        throw new Error(data.error ?? "Não foi possível salvar o evento.");
      }

      setEventos((prev) =>
        prev.map((item) =>
          item.slug === editingEvento.slug ? data : item,
        ),
      );
      setEditingEvento(null);
    },
    [editingEvento],
  );

  const handleCreate = useCallback(
    async ({ nome, data }: { nome: string; data: string }) => {
      const token = getAuthToken();
      const response = await fetch("/api/eventos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nome, data }),
      });

      const created = (await response.json()) as EventosResponse;

      if (!response.ok) {
        throw new Error(created.error ?? "Não foi possível criar o evento.");
      }

      setEventos((prev) => [...prev, created]);
      setShowAddModal(false);
    },
    [],
  );

  const handleDelete = useCallback(async (evento: EventoRealizado) => {
    if (
      !window.confirm(
        `Deseja excluir o evento "${evento.nome}"? Esta ação não pode ser desfeita.`,
      )
    ) {
      return;
    }

    try {
      const token = getAuthToken();
      const response = await fetch(`/api/eventos/${evento.slug}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = (await response.json()) as EventosResponse;
        throw new Error(data.error ?? "Não foi possível excluir o evento.");
      }

      setEventos((prev) => prev.filter((item) => item.slug !== evento.slug));
      setEditingEvento((current) =>
        current?.slug === evento.slug ? null : current,
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Não foi possível excluir o evento.",
      );
    }
  }, []);

  return (
    <section
      id="eventos-realizados"
      className="scroll-mt-32"
      aria-labelledby="past-events-title"
    >
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <SectionTitle
          eyebrow="Painel 3"
          title="Eventos realizados"
          description="Consulte e gerencie os encontros que já aconteceram."
          className="mb-0"
        />
        <Button
          type="button"
          onClick={() => setShowAddModal(true)}
          className="shrink-0"
        >
          Adicionar evento
        </Button>
      </div>

      {error ? (
        <p className="mb-4 text-sm text-red-600" role="alert">
          {error}
        </p>
      ) : null}

      <Card hoverLift={false} className="overflow-hidden">
        {isLoading ? (
          <p className="px-6 py-8 text-sm text-stone">Carregando eventos...</p>
        ) : eventos.length === 0 ? (
          <p className="px-6 py-8 text-sm text-stone">
            Nenhum evento cadastrado ainda.
          </p>
        ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-cloud bg-mist/60">
                <th className="px-6 py-4 font-semibold text-ink">Evento</th>
                <th className="px-6 py-4 font-semibold text-ink">Data</th>
                <th className="px-6 py-4 font-semibold text-ink">Resumo</th>
                <th className="px-6 py-4 font-semibold text-ink text-right">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody>
              {eventos.map((evento) => (
                <tr
                  key={evento.slug}
                  className="border-b border-cloud/70 last:border-none hover:bg-mist/30 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-ink align-top">
                    {evento.nome}
                  </td>
                  <td className="px-6 py-4 text-stone-dark align-top">
                    {evento.dataFormatada}
                  </td>
                  <td className="px-6 py-4 text-stone-dark align-top">
                    {truncate(evento.resumo)}
                  </td>
                  <td className="px-6 py-4 text-right align-top">
                    <div className="flex flex-wrap justify-end gap-2">
                      <Button
                        type="button"
                        variant="secondary"
                        className="px-4 py-2 text-xs"
                        onClick={() => setEditingEvento(evento)}
                      >
                        Editar
                      </Button>
                      <Button
                        href={`/eventos/${evento.slug}`}
                        variant="secondary"
                        className="px-4 py-2 text-xs"
                      >
                        Visualizar evento
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        className="px-4 py-2 text-xs text-red-600 hover:bg-red-50 hover:text-red-700"
                        onClick={() => handleDelete(evento)}
                      >
                        Excluir evento
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        )}
      </Card>

      <AnimatePresence>
        {showAddModal && (
          <EventoAddModal onClose={closeAddModal} onCreate={handleCreate} />
        )}
        {editingEvento && (
          <EventoEditModal
            evento={editingEvento}
            onClose={closeEditModal}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </section>
  );
}
