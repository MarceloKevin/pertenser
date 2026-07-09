# PertenSer — Site institucional

Site institucional do PertenSer, construído com Next.js 15 (App Router), React 19, TypeScript, TailwindCSS e Framer Motion.

cp .env.example .env

## Como rodar localmente

```bash
npm install
npm run dev
```

Acesse `http://localhost:3000`.

Para build de produção:

```bash
npm run build
npm run start
```

## Estrutura do projeto

```
app/
  layout.tsx          → layout raiz, fontes, metadata/SEO, JSON-LD
  page.tsx             → home (monta todas as seções)
  globals.css          → estilos base, foco visível, prefers-reduced-motion
  sitemap.ts            → sitemap.xml gerado automaticamente
  robots.ts              → robots.txt gerado automaticamente
  eventos/[slug]/page.tsx → página individual de cada evento realizado

components/
  layout/    → Header, Footer, Container, WhatsappButton
  sections/  → Hero, About, NextEvent, Events, FAQ
  ui/        → Button, Card, SectionTitle

lib/
  events.ts  → dados de eventos (placeholder — ponto único de integração futura com banco de dados)
  utils.ts   → helper `cn` para classes Tailwind
```

## Onde editar o conteúdo

- **Textos gerais** (hero, história, valores): direto nos componentes em `components/sections/`.
- **Próximo evento**: função `getProximoEvento()` em `lib/events.ts`. Retorne `null` para mostrar o estado vazio automaticamente.
- **Eventos realizados**: array `eventosRealizados` em `lib/events.ts`. Cada item já inclui galeria, depoimentos e objetivo — pronto para virar uma consulta a banco de dados no futuro sem alterar os componentes.
- **WhatsApp**: troque o número em `components/layout/WhatsappButton.tsx` e `components/layout/Footer.tsx`.
- **Redes sociais**: links no `Footer.tsx` e no JSON-LD do `layout.tsx`.
- **Imagens**: atualmente usam Unsplash como placeholder. Basta trocar as URLs em `lib/events.ts` e `About.tsx` por imagens reais (locais em `/public` ou de um CMS).

## Identidade visual

| Token | Valor | Uso |
|---|---|---|
| `paper` | `#FFFFFF` | fundo principal |
| `mist` | `#FAF8F9` | fundo alternado de seções |
| `blush-600` | `#B5567F` | CTAs e destaques |
| `ink` | `#2B2730` | texto principal |
| `stone` | `#8B8590` | texto secundário |

Tipografia: **Manrope** (títulos) + **Inter** (corpo), carregadas via `next/font/google`.

Assinatura visual: três círculos sobrepostos (rosa claro → rosa forte) representando "eu, você, nós" — o tema central da marca — usados na logo, no eyebrow das seções e no hero.

## Dark mode

O Tailwind já está configurado com `darkMode: "class"`. Para habilitar, basta adicionar a classe `dark` ao elemento `<html>` (por exemplo, via um toggle de tema) e criar as variantes `dark:` nos componentes.

## SEO

- Metadata completo (title template, description, Open Graph, Twitter Cards, canonical) em `app/layout.tsx`.
- JSON-LD de `Organization`.
- `sitemap.xml` e `robots.txt` gerados automaticamente a partir das rotas e dos eventos cadastrados.
- Lembre-se de adicionar uma imagem real em `/public/og-image.jpg` (1200×630) antes de publicar.

## Notas de implementação

- Todas as animações usam Framer Motion e respeitam `prefers-reduced-motion`.
- Acessibilidade: `aria-label`, `aria-expanded`, contraste AA e foco visível já aplicados nos componentes interativos (menu, accordion, botões).
- A galeria de fotos da página de evento usa layout Masonry via CSS Columns (leve, sem dependência extra).
- Imagens remotas do Unsplash (placeholder) estão liberadas em `next.config.ts` — troque por `remotePatterns` do seu CDN real em produção.
