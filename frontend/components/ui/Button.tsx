import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-blush-600 text-white hover:bg-blush-700 shadow-soft hover:shadow-card",
  secondary:
    "bg-white text-ink border border-cloud hover:border-blush-300 hover:text-blush-700",
  ghost: "bg-transparent text-ink hover:bg-mist",
};

const baseClasses =
  "inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition-all duration-300 ease-out focus-visible:outline-2 focus-visible:outline-blush-600";

export function Button({
  children,
  variant = "primary",
  href,
  className,
  ...props
}: {
  children: ReactNode;
  variant?: Variant;
  href?: string;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const classes = cn(baseClasses, variantClasses[variant], className);

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
