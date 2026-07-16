export type GeneralInfo = {
  whatsapp: string;
  email: string;
  instagram: string;
  facebook: string;
  youtube: string;
};

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

export const defaultGeneralInfo: GeneralInfo = {
  whatsapp: "5500000000000",
  email: "contato@pertenser.com.br",
  instagram: "https://www.instagram.com/pertenser",
  facebook: "https://www.facebook.com/pertenser",
  youtube: "https://www.youtube.com/@pertenser",
};

export function whatsappMeUrl(whatsapp: string): string {
  const digits = whatsapp.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits}` : `https://wa.me/${defaultGeneralInfo.whatsapp}`;
}

export async function fetchGeneralInfo(): Promise<GeneralInfo> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/general-info`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return defaultGeneralInfo;
    }

    const data = (await response.json()) as Partial<GeneralInfo> | null;

    if (!data) {
      return defaultGeneralInfo;
    }

    return {
      whatsapp: data.whatsapp?.trim() || defaultGeneralInfo.whatsapp,
      email: data.email?.trim() || defaultGeneralInfo.email,
      instagram: data.instagram?.trim() || defaultGeneralInfo.instagram,
      facebook: data.facebook?.trim() || defaultGeneralInfo.facebook,
      youtube: data.youtube?.trim() || defaultGeneralInfo.youtube,
    };
  } catch {
    return defaultGeneralInfo;
  }
}
