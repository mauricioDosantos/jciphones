# Architecture

**Pattern:** site estático multi-página, sem build. Dados em JSON lidos no navegador com `fetch`.
**Atualizado:** 2026-09-23 — ver `features/catalogo-e-ficha-produto/design.md` para o desenho completo.

## High-Level Structure

```
data/catalogo.json ──fetch──▶ JC.loadCatalog (common.js, valida com JCCore.validateProduct)
                                   │
            ┌──────────────────────┴──────────────────────┐
            ▼                                             ▼
   catalogo.js (index.html #catalogo)            produto.js (produto.html?p=slug)
   estado ⇄ URL (?grupo&q&ordem&linha&cond&min&max) ficha, galeria, barra fixa, relacionados
            │                                             │
            └────────── JCCore (catalogo-core.js) ────────┘
                        filtrar, ordenar, relacionados, formatar — sem DOM, testado no Node
```

`bio/index.html` é estática e só usa `site.css`, `bio.css` e `common.js`.

## Identified Patterns

### Núcleo puro + camada de página

`catalogo-core.js` não toca no DOM e exporta para `window.JCCore` ou `module.exports`. As páginas só leem o DOM, chamam o núcleo e renderizam com template strings, sempre passando texto do JSON por `JC.escapeHtml`.

### Links de WhatsApp via `data-wa-text`

`JC.bindWaLinks(root)` resolve `wa.me` e registra `whatsapp_click`. É idempotente (`data-wa-bound`), então pode rodar de novo depois de cada renderização. `data-wa-location` e `data-item-id` enriquecem o evento.

### Estado do catálogo na URL

`history.replaceState` a cada mudança. Voltar da ficha (`history.back()`) restaura filtros e rolagem.

### Reveal-on-scroll

`.reveal` só esconde conteúdo quando `<html>` tem a classe `js` (script inline no topo do `<head>`). Assim, sem JS nada fica invisível. No grid, só a primeira renderização anima.

### Tracking (GA4)

`JC.track()`; eventos listados em `INTEGRATIONS.md`.
