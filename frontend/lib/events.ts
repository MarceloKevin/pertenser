export type Depoimento = {
  nome: string;
  texto: string;
};

export type VideoEvento = {
  titulo: string;
  url: string;
  ordem: number;
};

export type EventoRealizado = {
  slug: string;
  nome: string;
  data: string; // ISO date
  dataFormatada: string;
  resumo: string;
  descricaoCompleta: string;
  objetivo: string;
  momentosMarcantes: string[];
  imagemDestaque: string;
  galeria: string[];
  depoimentos: Depoimento[];
  videos: VideoEvento[];
};

export type ProximoEvento = {
  nome: string;
  descricao: string;
  local: string;
  data: string;
  horario: string;
  imagem: string;
} | null;

const BACKEND_URL = process.env.BACKEND_URL ?? "http://localhost:4000";

function mapEventoRealizado(item: Partial<EventoRealizado>): EventoRealizado {
  return {
    slug: item.slug ?? "",
    nome: item.nome ?? "",
    data: item.data ?? "",
    dataFormatada: item.dataFormatada ?? "",
    resumo: item.resumo ?? "",
    descricaoCompleta: item.descricaoCompleta ?? "",
    objetivo: item.objetivo ?? "",
    momentosMarcantes: item.momentosMarcantes ?? [],
    imagemDestaque: item.imagemDestaque ?? "",
    galeria: item.galeria ?? [],
    depoimentos: item.depoimentos ?? [],
    videos: item.videos ?? [],
  };
}

export async function fetchEventosRealizados(): Promise<EventoRealizado[]> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/eventos`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return [];
    }

    const data = (await response.json()) as Partial<EventoRealizado>[];

    if (!Array.isArray(data)) {
      return [];
    }

    return data
      .map(mapEventoRealizado)
      .filter((evento) => evento.slug)
      .sort((a, b) => b.data.localeCompare(a.data));
  } catch {
    return [];
  }
}

export async function fetchEventoBySlug(
  slug: string,
): Promise<EventoRealizado | null> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/eventos/${slug}`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as Partial<EventoRealizado>;
    const evento = mapEventoRealizado(data);

    return evento.slug ? evento : null;
  } catch {
    return null;
  }
}

function formatProximoEventoData(value: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return value;
  }

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);

  return date.toLocaleDateString("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatProximoEventoHorario(value: string): string {
  const match = value.match(/^(\d{2}):(\d{2})$/);
  if (!match) {
    return value;
  }

  const hours = Number.parseInt(match[1], 10);
  const minutes = match[2];

  return minutes === "00" ? `${hours}h` : `${hours}h${minutes}`;
}

function mapProximoEvento(
  item: Partial<NonNullable<ProximoEvento>>,
): ProximoEvento {
  if (!item.nome?.trim()) {
    return null;
  }

  return {
    nome: item.nome,
    descricao: item.descricao ?? "",
    local: item.local ?? "",
    data: formatProximoEventoData(item.data ?? ""),
    horario: formatProximoEventoHorario(item.horario ?? ""),
    imagem: item.imagem ?? "",
  };
}

export async function fetchProximoEvento(): Promise<ProximoEvento> {
  try {
    const response = await fetch(`${BACKEND_URL}/api/proximo-evento`, {
      cache: "no-store",
    });

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as Partial<NonNullable<ProximoEvento>> | null;

    if (!data) {
      return null;
    }

    return mapProximoEvento(data);
  } catch {
    return null;
  }
}

/**
 * Imagens dos eventos realizados ficam em public/eventos/{slug}/:
 *   destaque.jpg       → imagem de capa
 *   galeria/01.jpg …   → fotos da galeria
 * O array estático abaixo é usado como fallback em rotas que ainda
 * não foram migradas para fetchEventosRealizados().
 */

export const eventosRealizados: EventoRealizado[] = [
  {
    slug: "encontro-de-recomecos",
    nome: "Encontro de Recomeços",
    data: "2026-04-12",
    dataFormatada: "12 de abril de 2026",
    resumo:
      "Um dia inteiro dedicado a ressignificar recomeços através de rodas de conversa, dinâmicas em grupo e momentos de silêncio guiado.",
    descricaoCompleta:
      "O Encontro de Recomeços reuniu pessoas em diferentes momentos de transição de vida para compartilhar experiências, aprender práticas de autoconhecimento e construir, juntas, um novo olhar sobre o que significa começar de novo. Ao longo do dia, alternamos entre vivências em grupo, momentos de reflexão individual e uma roda final de encerramento.",
    objetivo:
      "Criar um espaço acolhedor para quem atravessa mudanças significativas, oferecendo ferramentas práticas de autoconhecimento e uma rede de apoio genuína.",
    momentosMarcantes: [
      "Roda de abertura com mais de 40 participantes",
      "Dinâmica 'Cartas para o meu recomeço'",
      "Encerramento com troca de abraços e contatos",
    ],
    imagemDestaque: "/eventos/encontro-de-recomecos/destaque.jpg",
    galeria: [
      "/eventos/encontro-de-recomecos/galeria/01.jpg",
      "/eventos/encontro-de-recomecos/galeria/02.jpg",
      "/eventos/encontro-de-recomecos/galeria/03.jpg",
      "/eventos/encontro-de-recomecos/galeria/04.jpg",
      "/eventos/encontro-de-recomecos/galeria/05.jpg",
      "/eventos/encontro-de-recomecos/galeria/06.jpg",
    ],
    depoimentos: [
      {
        nome: "Marina S.",
        texto:
          "Cheguei sem saber o que esperar e saí com um sentimento raro de pertencimento. Foi transformador.",
      },
      {
        nome: "Rafael T.",
        texto:
          "A escuta ali foi diferente de tudo que já vivi. Me senti visto de verdade.",
      },
    ],
    videos: [],
  },
  {
    slug: "roda-de-conexoes",
    nome: "Roda de Conexões",
    data: "2026-02-08",
    dataFormatada: "08 de fevereiro de 2026",
    resumo:
      "Encontro voltado para fortalecer vínculos autênticos através de práticas de escuta e presença.",
    descricaoCompleta:
      "A Roda de Conexões nasceu do desejo de criar pontes reais entre pessoas que, no dia a dia, raramente têm espaço para se conhecer de verdade. Foi um encontro leve, guiado por dinâmicas simples que revelaram histórias profundas.",
    objetivo:
      "Aproximar pessoas através de práticas guiadas de escuta, presença e vulnerabilidade compartilhada.",
    momentosMarcantes: [
      "Dinâmica dos pares silenciosos",
      "Roda de agradecimentos ao final do dia",
    ],
    imagemDestaque: "/eventos/roda-de-conexoes/destaque.jpg",
    galeria: [
      "/eventos/roda-de-conexoes/galeria/01.jpg",
      "/eventos/roda-de-conexoes/galeria/02.jpg",
      "/eventos/roda-de-conexoes/galeria/03.jpg",
    ],
    depoimentos: [
      {
        nome: "Camila R.",
        texto: "Um dos encontros mais genuínos que já participei na vida.",
      },
    ],
    videos: [],
  },
];

export function getEventoBySlug(slug: string): EventoRealizado | undefined {
  return eventosRealizados.find((evento) => evento.slug === slug);
}
