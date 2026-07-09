import type { VideoEvento } from "@/lib/events";

type EventVideosProps = {
  videos: VideoEvento[];
};

function getVideoEmbed(url: string): { type: "iframe" | "video"; src: string } {
  const youtubeMatch = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]+)/,
  );
  if (youtubeMatch) {
    return {
      type: "iframe",
      src: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
    };
  }

  const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeoMatch) {
    return {
      type: "iframe",
      src: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
    };
  }

  return { type: "video", src: url };
}

export function EventVideos({ videos }: EventVideosProps) {
  const sortedVideos = [...videos].sort((a, b) => a.ordem - b.ordem);

  return (
    <div className="flex flex-col gap-8">
      {sortedVideos.map((video) => {
        const embed = getVideoEmbed(video.url);

        return (
          <div key={`${video.url}-${video.ordem}`} className="flex flex-col gap-3">
            {video.titulo && (
              <h3 className="font-medium text-ink">{video.titulo}</h3>
            )}
            <div className="relative aspect-video rounded-xl2 overflow-hidden shadow-card bg-ink/5">
              {embed.type === "iframe" ? (
                <iframe
                  src={embed.src}
                  title={video.titulo || "Vídeo do evento"}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <video
                  src={embed.src}
                  controls
                  className="absolute inset-0 h-full w-full object-cover"
                  title={video.titulo || "Vídeo do evento"}
                >
                  Seu navegador não suporta a reprodução de vídeo.
                </video>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
