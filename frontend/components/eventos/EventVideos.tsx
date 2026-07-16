"use client";

import { useEffect, type ReactNode } from "react";
import { ExternalLink, Play } from "lucide-react";
import type { VideoEvento } from "@/lib/events";

type EventVideosProps = {
  videos: VideoEvento[];
};

type ResolvedVideo =
  | { kind: "iframe"; src: string }
  | { kind: "instagram"; permalink: string }
  | { kind: "file"; src: string }
  | { kind: "link"; href: string; label: string };

declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void;
      };
    };
  }
}

function getHostname(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}

function extractYoutubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id || null;
    }

    if (host === "youtube.com" || host === "m.youtube.com" || host === "music.youtube.com") {
      const fromQuery = parsed.searchParams.get("v");
      if (fromQuery) return fromQuery;

      const parts = parsed.pathname.split("/").filter(Boolean);
      if (
        parts[0] &&
        ["embed", "shorts", "live", "v"].includes(parts[0]) &&
        parts[1]
      ) {
        return parts[1];
      }
    }
  } catch {
    // fall through to regex
  }

  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{6,})/i,
  );
  return match?.[1] ?? null;
}

function resolveVideo(url: string): ResolvedVideo {
  const trimmed = url.trim();
  const hostname = getHostname(trimmed);

  const youtubeId = extractYoutubeId(trimmed);
  if (youtubeId) {
    return {
      kind: "iframe",
      src: `https://www.youtube.com/embed/${youtubeId}`,
    };
  }

  const vimeoMatch = trimmed.match(
    /(?:player\.)?vimeo\.com\/(?:video\/)?(\d+)/i,
  );
  if (vimeoMatch) {
    return {
      kind: "iframe",
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  if (
    hostname === "instagram.com" ||
    hostname === "instagr.am" ||
    hostname.endsWith(".instagram.com")
  ) {
    const permalink = trimmed.split("?")[0].replace(/\/$/, "");
    return { kind: "instagram", permalink: `${permalink}/` };
  }

  if (/\.(mp4|webm|ogg)(\?.*)?$/i.test(trimmed)) {
    return { kind: "file", src: trimmed };
  }

  const label =
    hostname === "tiktok.com" || hostname.endsWith(".tiktok.com")
      ? "Assistir no TikTok"
      : hostname === "facebook.com" || hostname.endsWith(".facebook.com")
        ? "Assistir no Facebook"
        : hostname
          ? `Assistir em ${hostname}`
          : "Assistir vídeo";

  return { kind: "link", href: trimmed, label };
}

function ensureInstagramEmbedScript() {
  if (typeof window === "undefined") return;

  const existing = document.getElementById("instagram-embed-js");
  if (existing) {
    window.instgrm?.Embeds.process();
    return;
  }

  const script = document.createElement("script");
  script.id = "instagram-embed-js";
  script.async = true;
  script.src = "https://www.instagram.com/embed.js";
  script.onload = () => window.instgrm?.Embeds.process();
  document.body.appendChild(script);
}

function VideoFrame({
  title,
  children,
}: {
  title?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative aspect-video overflow-hidden rounded-xl2 bg-ink/5 shadow-card">
      {title ? <span className="sr-only">{title}</span> : null}
      {children}
    </div>
  );
}

function ExternalVideoCard({
  title,
  href,
  label,
}: {
  title: string;
  href: string;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex aspect-video flex-col items-center justify-center gap-3 rounded-xl2 bg-mist px-6 text-center shadow-card transition-colors hover:bg-cloud/60"
    >
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-blush-500 text-white shadow-soft transition-transform group-hover:scale-105">
        <Play size={28} fill="currentColor" className="ml-0.5" />
      </span>
      <span className="font-medium text-ink">
        {title || "Vídeo do evento"}
      </span>
      <span className="inline-flex items-center gap-1.5 text-sm text-blush-600">
        {label}
        <ExternalLink size={14} />
      </span>
    </a>
  );
}

export function EventVideos({ videos }: EventVideosProps) {
  const sortedVideos = [...videos].sort((a, b) => a.ordem - b.ordem);
  const hasInstagram = sortedVideos.some(
    (video) => resolveVideo(video.url).kind === "instagram",
  );

  useEffect(() => {
    if (!hasInstagram) return;
    ensureInstagramEmbedScript();
  }, [hasInstagram, videos]);

  return (
    <div className="flex flex-col gap-8">
      {sortedVideos.map((video) => {
        const resolved = resolveVideo(video.url);
        const key = `${video.url}-${video.ordem}-${video.titulo}`;

        return (
          <div key={key} className="flex flex-col gap-3">
            {video.titulo && resolved.kind !== "link" ? (
              <h3 className="font-medium text-ink">{video.titulo}</h3>
            ) : null}

            {resolved.kind === "iframe" ? (
              <VideoFrame title={video.titulo || "Vídeo do evento"}>
                <iframe
                  src={resolved.src}
                  title={video.titulo || "Vídeo do evento"}
                  className="absolute inset-0 h-full w-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              </VideoFrame>
            ) : null}

            {resolved.kind === "file" ? (
              <VideoFrame title={video.titulo || "Vídeo do evento"}>
                <video
                  src={resolved.src}
                  controls
                  className="absolute inset-0 h-full w-full object-cover"
                  title={video.titulo || "Vídeo do evento"}
                >
                  Seu navegador não suporta a reprodução de vídeo.
                </video>
              </VideoFrame>
            ) : null}

            {resolved.kind === "instagram" ? (
              <div className="overflow-hidden rounded-xl2 bg-white shadow-card">
                <blockquote
                  className="instagram-media !m-0 !min-w-0 !max-w-full"
                  data-instgrm-permalink={resolved.permalink}
                  data-instgrm-version="14"
                  style={{
                    background: "#FFF",
                    border: 0,
                    margin: 0,
                    maxWidth: "100%",
                    minWidth: 0,
                    padding: 0,
                    width: "100%",
                  }}
                >
                  <a
                    href={resolved.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block px-4 py-8 text-center text-sm text-blush-600"
                  >
                    Ver no Instagram
                    {video.titulo ? `: ${video.titulo}` : ""}
                  </a>
                </blockquote>
              </div>
            ) : null}

            {resolved.kind === "link" ? (
              <ExternalVideoCard
                title={video.titulo}
                href={resolved.href}
                label={resolved.label}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
