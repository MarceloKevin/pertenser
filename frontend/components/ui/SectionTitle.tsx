import { cn } from "@/lib/utils";

/**
 * Marca de assinatura do PertenSer: três círculos sobrepostos,
 * representando "eu, você, nós" — o tema central da marca.
 * Aparece como eyebrow discreto antes de cada título de seção.
 */
function BelongingMark() {
  return (
    <span className="inline-flex items-center" aria-hidden="true">
      <span className="h-2.5 w-2.5 rounded-full bg-blush-300" />
      <span className="-ml-1 h-2.5 w-2.5 rounded-full bg-blush-500" />
      <span className="-ml-1 h-2.5 w-2.5 rounded-full bg-blush-600" />
    </span>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" && "items-center text-center",
        className
      )}
    >
      {eyebrow && (
        <div className="flex items-center gap-3">
          <BelongingMark />
          <span className="text-sm font-medium tracking-wide text-blush-600">
            {eyebrow}
          </span>
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-[2.75rem] font-semibold leading-tight text-ink">
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "text-base sm:text-lg text-stone leading-relaxed",
            align === "center" ? "max-w-2xl" : "max-w-xl"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
