# Code Conventions

## Naming Conventions

**Files:**
Minúsculo, um único `index.html` na raiz. Assets em `static/` com nome descritivo (`logo.jpg`, `banner.jpg`, `banner_instagram_02.jpg`).

**CSS classes:**
kebab-case, prefixadas por bloco/componente (BEM-like sem `__`/`--` estritos).
Examples: `.nav-brand`, `.btn-whatsapp`, `.hero-cta`, `.mobile-menu`, `.card`, `.assist-item`, `.insta-card`

**Variáveis CSS (custom properties):**
kebab-case dentro de `:root`.
Examples: `--bg`, `--bg-secondary`, `--text-primary`, `--accent`, `--whatsapp`, `--radius-lg`, `--ease`

**IDs (âncoras de seção):**
minúsculo, em português, usados tanto para navegação (`href="#produtos"`) quanto para `IntersectionObserver`.
Examples: `#inicio`, `#produtos`, `#assistencia`, `#ofertas`, `#contato`

**JavaScript:**
camelCase para variáveis e funções; `UPPER_SNAKE_CASE` para uma constante de configuração.
Examples: `waUrl()`, `onScroll()`, `sectionObserver`, `WA_NUMBER`

## Code Organization

**Import/Dependency Declaration:**
Não há imports — scripts externos (GA4, fontes) via `<script>`/`<link>` no `<head>`; lógica própria em um único `<script>` no fim do `<body>`.

**File Structure (dentro de `index.html`):**
`<head>` (meta + GA4 + fontes + `<style>`) → `<body>` (nav → mobile menu → main com seções → footer → `<script>`).

## Type Safety/Documentation

**Approach:** JavaScript sem tipos, sem TypeScript. Nenhum comentário de documentação formal (JSDoc); comentários HTML (`<!-- NAV -->`) marcam blocos de seção.

## Error Handling

**Pattern:** Defensivo simples — checagem de feature (`if ("IntersectionObserver" in window)`) e de disponibilidade de função (`typeof gtag === "function"`) antes de usar. Sem try/catch (não há operações que lancem exceção esperada — tudo é manipulação de DOM síncrona).

## Comments/Documentation

**Style:** Comentários HTML curtos delimitando seções (`<!-- NAV -->`, `<!-- MENU MOBILE -->`, `<!-- Google tag (gtag.js) -->`). Nenhum comentário explicativo de lógica dentro do JS — o código é curto o suficiente para se explicar por nomes.
