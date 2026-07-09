import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@pertenser.com.br";
  const adminPassword = process.env.ADMIN_PASSWORD ?? "admin123";

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.user.upsert({
    where: { email: adminEmail },
    create: { email: adminEmail, password: hashedPassword },
    update: { password: hashedPassword },
  });

  await prisma.generalInfo.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      whatsapp: "5500000000000",
      email: "contato@pertenser.com.br",
      instagram: "https://www.instagram.com/pertenser",
      facebook: "https://www.facebook.com/pertenser",
      youtube: "https://www.youtube.com/@pertenser",
    },
    update: {},
  });

  await prisma.proximoEvento.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      ativo: true,
      nome: "Círculo de Escuta: Reencontros",
      descricao:
        "Uma tarde dedicada à escuta ativa e à reconexão — um espaço seguro para compartilhar histórias, ouvir com presença e sair acompanhado.",
      local: "Espaço Raiz, São Paulo — SP",
      data: "23 de agosto de 2026",
      horario: "14h às 18h",
      imagem:
        "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=1600&auto=format&fit=crop",
    },
    update: {},
  });

  await prisma.historia.upsert({
    where: { id: "singleton" },
    create: {
      id: "singleton",
      titulo: "Nascemos da vontade simples de reunir pessoas.",
      primeiraParte:
        "O PertenSer começou como uma roda de conversa entre amigos e se tornou um movimento: espaços presenciais dedicados a desenvolvimento humano, escuta ativa e conexões que duram além do encontro em si.",
      segundaParte:
        "Acreditamos que pertencer não é sobre se encaixar — é sobre ser recebido inteiro. Cada evento do PertenSer é desenhado para que ninguém precise deixar partes de si na porta.",
    },
    update: {},
  });

  const objetivos = [
    {
      titulo: "Acolhimento",
      texto: "Um espaço seguro para chegar como se é, sem precisar explicar.",
      icon: "heart-handshake",
      ordem: 0,
    },
    {
      titulo: "Propósito",
      texto: "Encontros com intenção clara: conectar pessoas de verdade.",
      icon: "compass",
      ordem: 1,
    },
    {
      titulo: "Presença",
      texto: "Experiências que convidam a estar inteiro, aqui e agora.",
      icon: "sparkles",
      ordem: 2,
    },
  ];

  const objetivoCount = await prisma.objetivo.count();
  if (objetivoCount === 0) {
    await prisma.objetivo.createMany({ data: objetivos });
  }

  const duvidas = [
    {
      pergunta: "O evento possui custo?",
      resposta:
        "Alguns encontros são gratuitos e outros possuem um valor simbólico para cobrir espaço e materiais. O valor, quando houver, está sempre indicado na página do evento.",
      ordem: 0,
    },
    {
      pergunta: "Preciso fazer inscrição?",
      resposta:
        "Sim. Como priorizamos grupos pequenos para manter a qualidade da experiência, a inscrição prévia garante sua vaga e nos ajuda a organizar o encontro.",
      ordem: 1,
    },
    {
      pergunta: "Quem pode participar?",
      resposta:
        "Qualquer pessoa que deseje viver uma experiência de conexão e acolhimento genuínos. Não é necessário ter participado de encontros anteriores.",
      ordem: 2,
    },
    {
      pergunta: "Existe limite de idade?",
      resposta:
        "Nossos encontros são voltados para maiores de 18 anos, salvo indicação diferente na descrição do evento.",
      ordem: 3,
    },
    {
      pergunta: "O evento possui certificado?",
      resposta:
        "Sim, emitimos certificado de participação para encontros de desenvolvimento humano que tenham carga horária definida.",
      ordem: 4,
    },
  ];

  const duvidaCount = await prisma.duvida.count();
  if (duvidaCount === 0) {
    await prisma.duvida.createMany({ data: duvidas });
  }

  const eventoCount = await prisma.eventoRealizado.count();
  if (eventoCount === 0) {
    await prisma.eventoRealizado.create({
      data: {
        slug: "encontro-de-recomecos",
        nome: "Encontro de Recomeços",
        data: "2026-04-12",
        dataFormatada: "12 de abril de 2026",
        resumo:
          "Um dia inteiro dedicado a ressignificar recomeços através de rodas de conversa, dinâmicas em grupo e momentos de silêncio guiado.",
        descricaoCompleta:
          "O Encontro de Recomeços reuniu pessoas em diferentes momentos de transição de vida para compartilhar experiências, aprender práticas de autoconhecimento e construir, juntas, um novo olhar sobre o que significa começar de novo.",
        objetivo:
          "Criar um espaço acolhedor para quem atravessa mudanças significativas, oferecendo ferramentas práticas de autoconhecimento e uma rede de apoio genuína.",
        momentosMarcantes: [
          "Roda de abertura com mais de 40 participantes",
          "Dinâmica 'Cartas para o meu recomeço'",
          "Encerramento com troca de abraços e contatos",
        ],
        imagemDestaque: "/eventos/encontro-de-recomecos/destaque.jpg",
        galeria: [],
        depoimentos: {
          create: [
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
        },
        videos: {
          create: [
            {
              titulo: "Abertura do encontro",
              url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              ordem: 0,
            },
          ],
        },
      },
    });

    await prisma.eventoRealizado.create({
      data: {
        slug: "roda-de-conexoes",
        nome: "Roda de Conexões",
        data: "2026-02-08",
        dataFormatada: "08 de fevereiro de 2026",
        resumo:
          "Encontro voltado para fortalecer vínculos autênticos através de práticas de escuta e presença.",
        descricaoCompleta:
          "A Roda de Conexões nasceu do desejo de criar pontes reais entre pessoas que, no dia a dia, raramente têm espaço para se conhecer de verdade.",
        objetivo:
          "Aproximar pessoas através de práticas guiadas de escuta, presença e vulnerabilidade compartilhada.",
        momentosMarcantes: [
          "Dinâmica dos pares silenciosos",
          "Roda de agradecimentos ao final do dia",
        ],
        imagemDestaque: "/eventos/roda-de-conexoes/destaque.jpg",
        galeria: [],
        depoimentos: {
          create: [
            {
              nome: "Camila R.",
              texto: "Um dos encontros mais genuínos que já participei na vida.",
            },
          ],
        },
      },
    });
  }

  const eventosLegados = await prisma.eventoRealizado.findMany();
  for (const evento of eventosLegados) {
    const imagemDestaque = evento.imagemDestaque.startsWith("/uploads/eventos/")
      ? evento.imagemDestaque.replace("/uploads/eventos/", "/eventos/")
      : evento.imagemDestaque;
    const galeria = evento.galeria.map((url) =>
      url.startsWith("/uploads/eventos/")
        ? url.replace("/uploads/eventos/", "/eventos/")
        : url,
    );

    if (
      imagemDestaque !== evento.imagemDestaque ||
      galeria.some((url, index) => url !== evento.galeria[index])
    ) {
      await prisma.eventoRealizado.update({
        where: { id: evento.id },
        data: { imagemDestaque, galeria },
      });
    }
  }

  console.log("Seed concluído com sucesso.");
  console.log(`Admin: ${adminEmail}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
