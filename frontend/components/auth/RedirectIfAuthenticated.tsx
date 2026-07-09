"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type RedirectIfAuthenticatedProps = {
  children: React.ReactNode;
};

export function RedirectIfAuthenticated({
  children,
}: RedirectIfAuthenticatedProps) {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      router.replace("/gerenciamento");
      return;
    }

    setIsChecking(false);
  }, [router]);

  if (isChecking) {
    return null;
  }

  return <>{children}</>;
}
