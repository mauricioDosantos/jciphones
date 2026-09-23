# Project Structure

**Root:** `/Users/mc/Projects/jciphone`

## Directory Tree

```
jciphone/
├── index.html              # site publicado (GitHub Pages) — head + body + script único
├── pagina_iphone.html       # cópia local do apple.com/br, só referência visual (não servido)
├── README.md
├── static/
│   ├── logo.jpg
│   ├── banner.jpg
│   ├── banner_instagram_02.jpg
│   └── banner_instagram_03.jpg
└── .specs/                 # documentação de planejamento (este diretório)
```

## Module Organization

### Marketing/Vitrine (`index.html`)

**Purpose:** única "aplicação" do projeto — página de vendas com catálogo, assistência, ofertas e contato
**Location:** `index.html`, seções por `<section id="...">`
**Key files:** `index.html`

### Assets visuais

**Purpose:** imagens usadas em banners/hero/instagram
**Location:** `static/`
**Key files:** `logo.jpg` (marca), `banner*.jpg` (hero/ofertas)

## Where Things Live

**Catálogo de produtos:**

- UI/Interface: seção `#produtos` em `index.html`
- Business Logic: nenhuma (conteúdo estático, sem dados dinâmicos)
- Data Access: nenhuma (sem backend/API)
- Configuration: nenhuma

**Conversão via WhatsApp:**

- UI/Interface: botões `.btn-whatsapp` / links `[data-wa-text]` espalhados pela página
- Business Logic: montagem da URL `wa.me` no script final de `index.html`
- Configuration: constante `WA_NUMBER` no mesmo script

**Analytics/Telemetria:**

- UI/Interface: n/a (invisível ao usuário)
- Business Logic: função `track()` no script final de `index.html`
- Configuration: snippet `gtag.js` no `<head>` (measurement ID `G-FJ1ECSJ4RF`)

## Special Directories

**`static/`:**
**Purpose:** todos os assets de imagem referenciados pela página
**Examples:** `logo.jpg`, `banner.jpg`

**`.specs/`:**
**Purpose:** documentação de planejamento gerada pela metodologia spec-driven (este projeto)
**Examples:** `project/PROJECT.md`, `features/*/spec.md`
