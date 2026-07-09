export type Historia = {
  titulo: string;
  primeiraParte: string;
  segundaParte: string;
};

export type ObjetivoIcon = "heart-handshake" | "compass" | "sparkles";

export type Objetivo = {
  id: string;
  titulo: string;
  texto: string;
  icon: ObjetivoIcon;
};

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

export const defaultHistoria: Historia = {
  titulo: "Nascemos da vontade simples de reunir pessoas.",
  primeiraParte:
    "O PertenSer começou como uma roda de conversa entre amigos e se tornou um movimento: espaços presenciais dedicados a desenvolvimento humano, escuta ativa e conexões que duram além do encontro em si.",
  segundaParte:
    "Acreditamos que pertencer não é sobre se encaixar — é sobre ser recebido inteiro. Cada evento do PertenSer é desenhado para que ninguém precise deixar partes de si na porta.",
};

function isObjetivoIcon(value: string): value is ObjetivoIcon {
  return value === "heart-handshake" || value === "compass" || value === "sparkles";
}

function mapObjetivo(item: {
  id: string;
  titulo: string;
  texto: string;
  icon: string;
}): Objetivo {
  return {
    id: item.id,
    titulo: item.titulo,
    texto: item.texto,
    icon: isObjetivoIcon(item.icon) ? item.icon : "heart-handshake",
  };
}

export async function fetchHistoria(): Promise<Historia> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/historia`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return defaultHistoria;
    }

    const data = (await response.json()) as Historia | null;

    if (!data) {
      return defaultHistoria;
    }

    return {
      titulo: data.titulo ?? defaultHistoria.titulo,
      primeiraParte: data.primeiraParte ?? defaultHistoria.primeiraParte,
      segundaParte: data.segundaParte ?? defaultHistoria.segundaParte,
    };
  } catch {
    return defaultHistoria;
  }
}

export async function fetchObjetivos(): Promise<Objetivo[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/historia/objetivos`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as Array<{
      id: string;
      titulo: string;
      texto: string;
      icon: string;
    }>;

    if (!Array.isArray(data)) {
      return [];
    }

    return data.map(mapObjetivo);
  } catch {
    return [];
  }
}
