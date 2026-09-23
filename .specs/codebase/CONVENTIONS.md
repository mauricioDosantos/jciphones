# Code Conventions

**Atualizado:** 2026-09-23 (AD-005: CSS/JS saíram do `index.html`)

## Naming Conventions

**Files:** minúsculo, kebab-case. Páginas na raiz (`index.html`, `produto.html`) ou em pasta para URL limpa (`bio/index.html`). CSS/JS em `static/css` e `static/js`. Fotos de produto em `static/produtos/<slug>/`.

**CSS classes:** kebab-case com prefixo de bloco (BEM-like sem `__`/`--`).
Ex.: `.product-card`, `.catalog-toolbar`, `.filter-drawer`, `.pd-gallery` (`pd-` = ficha), `.bio-link`. Estados como classe: `.is-active`, `.is-visible`, `.is-broken`, `.open`.

**Variáveis CSS:** kebab-case no `:root` de `site.css` (`--accent`, `--tag-promo`…). Variáveis exclusivas da bio ficam em `.bio`.

**IDs de seção:** minúsculo, em português (`#catalogo`, `#vantagens`, `#contato`).

**JavaScript:** ES5-style (`var`, funções, IIFE), sem módulos nem build. camelCase; `UPPER_SNAKE_CASE` para constantes (`WA_NUMBER`, `CATALOG_URL`, `VANTAGENS`). APIs compartilhadas em `window.JC` e `window.JCCore`.

**Dados (JSON):** chaves em português, camelCase (`precoOriginal`, `adicionadoEm`).

## Code Organization

Cada página carrega, nesta ordem: `catalogo-core.js` (se usa catálogo) → `common.js` → script da página, no fim do `<body>`. Caminhos sempre **relativos** (funciona em domínio próprio e em `usuario.github.io/repo/`).

## Error Handling

Defensivo e visível para o usuário: falha de `fetch` ou JSON inválido mostra um bloco `.catalog-state` com CTA de WhatsApp. Produto inválido no JSON é descartado com `console.warn` citando o slug. Imagem quebrada vira placeholder (`.is-broken`).

## Comments

Comentários curtos explicando o **porquê** (ex.: por que só a primeira renderização anima). Comentários HTML delimitam seções (`<!-- CATÁLOGO -->`).

## Commits

Gitmoji + escopo: `:sparkles: catalogo: ...`, `:lipstick: ...`, `:recycle: ...`.
