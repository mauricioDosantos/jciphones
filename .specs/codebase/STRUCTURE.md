# Project Structure

**Root:** `/Users/mc/Projects/jciphone`
**Atualizado:** 2026-09-23 (AD-004/AD-005 — catálogo via JSON, 3 páginas, CSS/JS compartilhados)

## Directory Tree

```
jciphone/
├── index.html               # home: hero, #catalogo, #vantagens, #assistencia, #porque, #ofertas, #novidades, #contato
├── produto.html             # ficha do produto (?p=<slug>), conteúdo renderizado via JS
├── bio/index.html           # página link-na-bio (/bio/)
├── pagina_iphone.html       # cópia local do apple.com/br, só referência visual (não servido)
├── README.md                # guia de manutenção do catálogo
├── data/
│   └── catalogo.json        # fonte única do catálogo
├── static/
│   ├── css/site.css         # tokens, nav, botões, seções da home, footer, reveal
│   ├── css/catalogo.css     # selos, cards, grid, toolbar, gaveta de filtros, ficha, vantagens
│   ├── css/bio.css          # página da bio (tema escuro)
│   ├── js/common.js         # window.JC: WhatsApp, GA4, menu, reveal, loadCatalog, renderCard, vantagens
│   ├── js/catalogo-core.js  # window.JCCore / module.exports: regras puras (filtro, ordem, URL, validação)
│   ├── js/catalogo.js       # seção #catalogo da home
│   ├── js/produto.js        # ficha do produto
│   ├── produtos/<slug>/     # fotos dos produtos (hoje: placeholders SVG)
│   ├── bio-banner.jpg       # recorte leve do banner para a bio
│   └── logo.jpg, banner*.jpg
├── tests/
│   ├── catalogo-core.test.js
│   └── catalogo-json.test.js
├── docs/plans/              # estudo do concorrente
└── .specs/                  # planejamento spec-driven
```

## Where Things Live

**Catálogo de produtos:**

- Dados: `data/catalogo.json` + `static/produtos/`
- Regras: `static/js/catalogo-core.js`
- UI home: `#catalogo` em `index.html` + `static/js/catalogo.js`
- UI ficha: `produto.html` + `static/js/produto.js`
- Card compartilhado: `JC.renderCard` em `static/js/common.js`

**Conversão via WhatsApp:**

- Links `[data-wa-text]` (estáticos ou renderizados) → `JC.bindWaLinks()`
- Número: `WA_NUMBER` em `static/js/common.js` (+ links em `<noscript>`)

**Vantagens:** constante `VANTAGENS` + `JC.renderVantagens()` em `common.js`; elementos `[data-vantagens]`

**Analytics:** snippet gtag no `<head>` de cada página; eventos via `JC.track()`
