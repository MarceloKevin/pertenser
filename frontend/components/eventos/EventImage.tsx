import Image, { type ImageProps } from "next/image";
import { ImageIcon } from "lucide-react";
import { isLocalEventoImage, normalizeEventoImageUrl } from "@/lib/evento-images";

type EventImageProps = Omit<ImageProps, "src" | "alt"> & {
  src: string;
  alt: string;
};

export function EventImage({ src, alt, className, fill, ...props }: EventImageProps) {
  const normalizedSrc = normalizeEventoImageUrl(src);

  if (!normalizedSrc.trim()) {
    return (
      <div
        className={`flex items-center justify-center bg-mist text-stone/40 ${
          fill ? "absolute inset-0" : ""
        } ${className ?? ""}`}
        aria-label={alt}
      >
        <ImageIcon size={32} aria-hidden />
      </div>
    );
  }

  return (
    <Image
      src={normalizedSrc}
      alt={alt}
      className={className}
      fill={fill}
      unoptimized={isLocalEventoImage(normalizedSrc)}
      {...props}
    />
  );
}
