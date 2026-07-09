export type Duvida = {
  id: string;
  pergunta: string;
  resposta: string;
};

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

function mapDuvida(item: Partial<Duvida>): Duvida {
  return {
    id: item.id ?? "",
    pergunta: item.pergunta ?? "",
    resposta: item.resposta ?? "",
  };
}

export async function fetchDuvidas(): Promise<Duvida[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/duvidas`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as Partial<Duvida>[];

    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .map(mapDuvida)
      .filter((duvida) => duvida.id && duvida.pergunta);
  } catch {
    return [];
  }
}
