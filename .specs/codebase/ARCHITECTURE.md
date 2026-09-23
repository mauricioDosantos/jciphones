# Architecture

**Pattern:** Página única estática (single-page, sem roteamento — navegação por âncoras `#id`)

## High-Level Structure

```
index.html
├── <head>            meta, SEO/OG tags, GA4 (gtag.js), fontes, <style> global
├── <body>
│   ├── header.nav     logo, menu desktop, CTA WhatsApp, toggle mobile
│   ├── .mobile-menu    menu off-canvas (classe .open)
│   ├── <main>
│   │   ├── #inicio      hero
│   │   ├── #produtos    catálogo (grid de cards estático)
│   │   ├── #assistencia  seção de serviço técnico
│   │   ├── #ofertas     seção de ofertas
│   │   └── #contato     mapa + informações
│   ├── <footer>        marca, redes sociais, WhatsApp, endereço
│   └── <script>        IIFE única no fim do body
```

Arquivo `pagina_iphone.html` na raiz é uma cópia estática de referência (site da Apple, salvo localmente) — não faz parte da aplicação servida, é apenas material de inspiração visual (ver `CONCERNS.md`).

## Identified Patterns

### Links de WhatsApp via atributo `data-wa-text`

**Location:** `index.html` (múltiplos `<a data-wa-text="...">`) + script no fim do body
**Purpose:** Centralizar a montagem da URL `wa.me` com mensagem pré-preenchida por contexto, sem hardcodar o link em cada botão
**Implementation:** JS varre `[data-wa-text]`, monta `https://wa.me/{numero}?text={mensagem}` e injeta em `href`
**Example:** `index.html:599` (CTA da nav), `index.html:913` (rodapé)

### Reveal-on-scroll

**Location:** classe `.reveal` em elementos + `IntersectionObserver` no script final
**Purpose:** Animação de entrada suave ao rolar a página
**Implementation:** observer adiciona classe `.in` quando o elemento entra na viewport (threshold 0.12), com fallback síncrono se `IntersectionObserver` não existir
**Example:** `index.html:971-987`

### Tracking de eventos (GA4)

**Location:** função `track(eventName, params)` dentro da IIFE do script final
**Purpose:** Encapsular chamadas a `gtag('event', ...)` com guarda (`typeof gtag === "function"`)
**Implementation:** eventos disparados em cliques de WhatsApp, navegação, CTAs, visualização de seção (`IntersectionObserver` por `<section id>`), profundidade de rolagem (25/50/75/100%) e tempo de permanência (ping a cada 30s enquanto `visibilityState === "visible"`)
**Example:** `index.html` (bloco `<script>` no fim do `<body>`)

## Data Flow

### Conversão (visitante → WhatsApp)

Usuário navega pela página estática → clica em qualquer `.btn-whatsapp`/`[data-wa-text]` → JS já resolveu o `href` para `wa.me/{numero}?text=...` no load da página → clique dispara evento `whatsapp_click` no GA4 → navegador abre WhatsApp com a conversa pré-preenchida.

### Telemetria (uso do site)

Carregamento da página → `gtag('config', ...)` registra `page_view` automático → interações do usuário (clique, scroll, tempo, seção vista) disparam eventos customizados via `track()` → GA4 processa e disponibiliza em relatórios (Realtime, Engajamento, Eventos).

## Code Organization

**Approach:** monólito de arquivo único (HTML+CSS+JS no mesmo `index.html`), sem separação por camadas

**Structure:** seções HTML ordenadas por narrativa de venda (hero → catálogo → assistência → ofertas → contato), CSS global no `<head>`, JS de interação no fim do `<body>`

**Module boundaries:** nenhuma — não há módulos, imports ou build. Toda mudança edita o mesmo arquivo.
