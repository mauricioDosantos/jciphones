# State

**Last Updated:** 2026-09-23T00:00:00-03:00
**Current Work:** Catálogo (JSON + filtros), ficha do produto, vantagens e página `/bio/` implementados e verificados no branch `feat/catalogo-json` (T1–T26). Próximo passo: dados reais (produtos, fotos, WhatsApp, Instagram, domínio) e publicação.

---

## Recent Decisions (Last 60 days)

### AD-006: Seção "Por que escolher" mantida com 2 itens (2026-09-23)

**Decision:** "Garantia de verdade" e "Parcelamento" saíram de `#porque` (cobertos pela nova seção `#vantagens`); ficaram "Atendimento próximo" e "Loja física" em 2 colunas. O selo do hero "Garantia de verdade" virou "Garantia de até 1 ano".
**Reason:** VANT-02 — evitar texto duplicado ou contraditório com as vantagens oficiais (garantia 1 ano fábrica / 6 meses loja; pix ou cartão).
**Trade-off:** Nenhum relevante; o conteúdo restante não se repete em outro lugar.
**Impact:** `index.html` (`#porque`, hero).

### AD-005: CSS/JS extraídos para arquivos compartilhados (2026-09-23)

**Decision:** Com 3 páginas (`index.html`, `produto.html`, `bio/index.html`), o CSS e o JS inline do `index.html` passam para `static/css/` e `static/js/`. A lógica do catálogo fica em um núcleo puro (`catalogo-core.js`) testado com `node --test`.
**Reason:** Evitar copiar nav, botões, `waUrl()` e `track()` três vezes; ter pelo menos testes da regra de filtros e da validação do JSON.
**Trade-off:** Quebra a convenção de "arquivo único" de `codebase/CONVENTIONS.md` (atualizar na execução).
**Impact:** Ver `features/catalogo-e-ficha-produto/design.md`.

### AD-004: Catálogo via JSON estático, filtros, ficha em página própria e bio com URL própria (2026-09-23)

**Decision:** O catálogo passa a ser lido de `data/catalogo.json` (imagens em `static/produtos/`), com abas Dispositivos/Acessórios, busca, ordenação e filtros (preço, linha, condição). A ficha vira a página `produto.html?p=slug` com "Garantir sua unidade" e "Você também pode gostar". A bio ganha URL própria (`/bio/`). Entra a seção de vantagens (garantia, pagamento, entrega).
**Reason:** Pedido do responsável pelo projeto, com base em `docs/plans/estudo_concorrente.md`.
**Trade-off:** Reverte itens que estavam como out of scope/deferred (JSON, filtros, URL separada para a bio). O escopo cresce bem além do orçamento de 7h dev + 2h publicação da AD-002.
**Impact:** Specs reescritos; design/tasks antigos movidos para `features/*/_superseded/`. Estimativa de horas precisa ser revista com o cliente (ver Todos).

### AD-001: Referência de design trocada de apple.com/br para iportess.com/catalogo (2026-09-18)

**Decision:** A proposta comercial e o escopo funcional passaram a usar iportess.com/catalogo como referência de padrão, substituindo apple.com/br.
**Reason:** Cliente identificou que o modelo de catálogo com cards de oferta, tags de urgência e conversão direta ao WhatsApp da iPortess se encaixa melhor no negócio (revenda de iPhones novos/seminovos) do que a vitrine institucional da Apple.
**Trade-off:** Perde-se a estética "premium" do carrossel Apple como elemento central; ganha-se foco total em conversão e urgência de compra.
**Impact:** `catalogo-e-ficha-produto` e `pagina-inicio-bio` foram especificados com base no padrão iPortess. O carrossel de destaques (requisito original) foi mantido no topo da página, mas o restante do catálogo segue o modelo de cards de oferta.

### AD-002: Horas mantidas em 7h dev + 2h publicação mesmo com escopo maior (2026-09-18)

**Decision:** O cliente optou por manter a estimativa original de 7h de desenvolvimento + 2h de publicação, mesmo após o escopo crescer (ficha de produto, página link-na-bio, tags, copy de urgência).
**Reason:** Decisão comercial do cliente — preferiu não recalcular os valores dos planos.
**Trade-off:** O escopo por hora ficou mais apertado; qualquer atraso ou pedido extra durante a execução deve ser tratado como fora do escopo combinado (ver `PROJECT.md` → Constraints).
**Impact:** Tarefas em `catalogo-e-ficha-produto/tasks.md` e `pagina-inicio-bio/tasks.md` foram desenhadas deliberadamente enxutas para caber no orçamento.

### AD-003: Monitoramento (GA4) implementado antes de qualquer outra feature (2026-09-18)

**Decision:** Por pedido explícito do cliente, o snippet do Google Analytics e os eventos customizados de rastreamento foram implementados em `index.html` antes de qualquer código de catálogo/ficha de produto.
**Reason:** Cliente quer poder medir uso da plataforma (cliques, tempo, navegação) desde o início do desenvolvimento das novas features.
**Trade-off:** Nenhum — implementação de baixo risco, feita em arquivo já existente.
**Impact:** Feature `analytics-monitoramento` já nasce com status COMPLETE no roadmap.

---

## Active Blockers

### B-001: Número de WhatsApp é placeholder

**Discovered:** 2026-09-18
**Impact:** Alto — `WA_NUMBER = "5511999999999"` em `index.html`. Se publicado assim, todo CTA de conversão do site falha silenciosamente (abre WhatsApp com número inexistente/errado).
**Workaround:** Nenhum necessário durante desenvolvimento local.
**Resolution:** Cliente precisa fornecer o número real da loja antes da publicação (plano "Na palma da mão" ou "Zero preocupação"). Tratar como pré-requisito de qualquer deploy.

---

## Lessons Learned

- **`node --test tests/` não funciona no Node 24** — usar `node --test` sem argumento (descobre `**/*.test.js`).
- **Estilos globais por tag vazam para componentes**: `footer { ... }` do site pintou o rodapé da gaveta de filtros e da bio. Em componentes novos, preferir `div` + classe ou sobrescrever explicitamente.
- **Normalizar entrada enquanto o usuário digita causa briga entre campos** (mín/máx de preço). Guardar o valor cru no estado e normalizar só ao filtrar.

---

## Quick Tasks Completed

| #   | Description                                                       | Date       | Commit | Status  |
| --- | ------------------------------------------------------------------ | ---------- | ------ | ------- |
| 001 | Integrar snippet Google Analytics (gtag.js) + eventos customizados | 2026-09-18 | fc409cb | ✅ Done |

---

## Deferred Ideas

- [ ] Painel admin para o catálogo (hoje é JSON editado à mão) — Capturado durante: AD-004
- [ ] Páginas estáticas por produto para SEO — Capturado durante: AD-004
- [ ] Remover/mover `pagina_iphone.html` (1.6MB, referência antiga da Apple) do repositório — Capturado durante: brownfield mapping (`CONCERNS.md`)
- [ ] Relatório mensal automatizado a partir dos eventos do GA4 — Capturado durante: planejamento (parte do plano "Zero Preocupação")

---

## Todos

- [ ] Confirmar com o cliente o número real de WhatsApp antes de qualquer publicação (bloqueia B-001)
- [ ] Confirmar com o cliente as fotos reais dos produtos e preços/parcelamentos para popular o catálogo
- [ ] Rever a estimativa de 7h dev + 2h publicação com o cliente após a AD-004 (estimativa em `tasks.md`: ~14h dev)
- [ ] Substituir `data/catalogo.json` de exemplo e os placeholders SVG de `static/produtos/` pelos produtos reais
- [ ] Obter a URL do Instagram da loja (necessária para a página `/bio/`; hoje `href="#"` com TODO em `bio/index.html` e no rodapé)
- [ ] Confirmar o domínio final: as meta tags OG de `bio/index.html` usam `https://mauriciodosantos.github.io/jciphones/` (padrão do GitHub Pages para o remote atual)

---

## Preferences

**Model Guidance Shown:** never
