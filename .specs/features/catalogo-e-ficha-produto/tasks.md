# Catálogo, Ficha, Vantagens e Bio — Tasks

**Design**: `.specs/features/catalogo-e-ficha-produto/design.md`
**Specs cobertos**: `catalogo-e-ficha-produto` (CAT), `vantagens-jciphones` (VANT), `pagina-inicio-bio` (BIO)
**Status**: Draft

> Um único arquivo de tasks para as 3 features, porque elas dividem a mesma base (T1–T3, T8). Commits seguem o gitmoji já usado no repo: `:emoji: escopo: descrição`.

---

## Execution Plan

### Phase 1: Foundation (Sequential)

Extrai o que já existe sem mudar o comportamento, depois cria os dados de exemplo.

```
T1 → T2 → T3
```

### Phase 2: Núcleo e base de UI

`catalogo-core.js` é um arquivo só, então T4–T7 são sequenciais entre si. T9 (CSS) e T24 (horário) podem rodar em paralelo.

```
T3 ──→ T4 → T5 → T6 → T7
T2 + T5 ──→ T8
T1 ──→ T9 [P]
T1 ──→ T24 [P]
```

### Phase 3: Página do catálogo (Sequential, mesmo arquivo `catalogo.js`)

```
T8 + T9 ──→ T10 → T11 → T12 → T13 → T14
```

### Phase 4: Ficha do produto (Sequential, mesmo arquivo `produto.js`)

Pode começar em paralelo com a Phase 3 (arquivos diferentes).

```
T8 + T9 ──→ T15 → T16 → T17 → T18 → T19
```

### Phase 5: Vantagens e Bio (Parallel OK)

```
T11 + T16 ──→ T20 → T21
T2 ─────────→ T22 → T23 [P]
```

### Phase 6: Fechamento (Sequential)

```
tudo ──→ T25 → T26
```

---

## Task Breakdown

### Phase 1 — Foundation

### T1: Extrair o CSS global para `static/css/site.css`

**What**: Mover todo o conteúdo do `<style>` do `index.html` para `static/css/site.css` e trocar pelo `<link rel="stylesheet">`, sem alterar nenhuma regra.
**Where**: `static/css/site.css` (novo), `index.html` (modificar)
**Depends on**: None
**Reuses**: `<style>` atual do `index.html`
**Requirement**: base de CAT/VANT/BIO (AD-005)

**Done when**:

- [ ] `index.html` não tem mais bloco `<style>`
- [ ] A página renderiza idêntica à versão anterior em 375px e 1280px

**Verify**:
`grep -c "<style" index.html` → `0`. Screenshot antes/depois em 375px e 1280px, sem diferença visual.

**Commit**: `:recycle: estilos: extrai CSS global para static/css/site.css`

---

### T2: Extrair o JS para `static/js/common.js` e expor `window.JC`

**What**: Mover a IIFE do fim do `index.html` para `common.js`, expondo `JC.WA_NUMBER`, `JC.waUrl`, `JC.track`, `JC.bindWaLinks(root)` (idempotente via `data-wa-bound`) e `JC.observeReveal(root)`. Proteger contra elementos ausentes (`#year`, `#nav`, `#navToggle`), já que a bio não tem todos. Corrigir o bug do ícone do menu mobile (trocar o `innerHTML` do toggle em vez do `outerHTML` do ícone).
**Where**: `static/js/common.js` (novo), `index.html` (modificar)
**Depends on**: T1
**Reuses**: script final atual do `index.html`
**Requirement**: base de CAT/VANT/BIO (AD-005)

**Done when**:

- [ ] `index.html` carrega `static/js/common.js` com `defer` e não tem mais JS inline próprio (o snippet do gtag continua no `<head>`)
- [ ] Links `[data-wa-text]` continuam gerando `wa.me/...`
- [ ] O menu mobile abre e fecha com o ícone correto em 3 toques seguidos
- [ ] Nenhum erro no console, na home e em uma página sem `#nav`

**Verify**:
Servidor local (`python3 -m http.server`) → abrir `/`, console limpo, `JC.waUrl("oi")` retorna `https://wa.me/5511999999999?text=oi`. Tocar 3x no menu mobile.

**Commit**: `:recycle: js: extrai script para common.js e corrige ícone do menu mobile`

---

### T3: Criar `data/catalogo.json` de exemplo + imagens placeholder

**What**: JSON no formato do design com pelo menos 10 produtos que cubram todos os casos: 6 dispositivos (iPhones de 3 linhas diferentes, 1 notebook, 1 caixa de som), 4 acessórios (fone, capa, Apple Watch, carregador); novos e seminovos; com e sem `precoOriginal`, `parcelamento`, `linha`, `especificacoes`; estoque 0, 1, 2 e sem estoque definido; 1 produto com 3 imagens. Imagens placeholder SVG simples em `static/produtos/<slug>/`.
**Where**: `data/catalogo.json` (novo), `static/produtos/**` (novo)
**Depends on**: T2
**Requirement**: CAT-01

**Done when**:

- [ ] JSON válido e todos os caminhos de `imagens` existem
- [ ] Cada combinação da lista acima aparece em pelo menos um produto

**Verify**:
`python3 -m json.tool data/catalogo.json > /dev/null && echo ok` → `ok` (a validação completa vem em T7).

**Commit**: `:card_file_box: catalogo: adiciona catalogo.json de exemplo e imagens placeholder`

---

### Phase 2 — Núcleo e base de UI

### T4: `catalogo-core.js` — filtragem e ordenação

**What**: Criar o módulo puro (export browser + Node) com `normalize`, `isAvailable`, `normalizePriceRange`, `filterProducts`, `sortProducts` e `linesFor`, junto com os testes.
**Where**: `static/js/catalogo-core.js` (novo), `tests/catalogo-core.test.js` (novo)
**Depends on**: T3
**Requirement**: CAT-04, CAT-08, CAT-09, CAT-10

**Done when**:

- [ ] Busca "IPHONE 13" e "iphone 13" retornam o mesmo resultado; "acessorio" encontra "Acessório"
- [ ] Linhas combinadas com OU; critérios diferentes combinados com E
- [ ] `min > max` é trocado; `min`/`max` vazios são ignorados
- [ ] Produto sem `linha` fica fora quando há filtro de linha ativo
- [ ] `sortProducts` não altera o array original; "recente" desempata por nome
- [ ] `linesFor` ordena "iPhone 9" antes de "iPhone 13"
- [ ] Tests pass: `node --test`

**Verify**: `node --test` → todos `ok`, 0 falhas.

**Commit**: `:sparkles: catalogo: núcleo de filtros e ordenação com testes`

---

### T5: `catalogo-core.js` — exibição e relacionados

**What**: Adicionar `discountPercent`, `urgencyLabel`, `formatPrice` e `relatedProducts`, com testes.
**Where**: `static/js/catalogo-core.js`, `tests/catalogo-core.test.js` (modificar)
**Depends on**: T4
**Requirement**: CAT-03, CAT-07

**Done when**:

- [ ] `discountPercent` retorna `null` sem `precoOriginal` ou quando `precoOriginal <= preco`
- [ ] `urgencyLabel`: 1 → "Última unidade", 2 → "Últimas 2 unidades", outros → `null`
- [ ] `formatPrice(3199)` → `"R$ 3.199,00"` (comparar ignorando o espaço inseparável)
- [ ] `relatedProducts` nunca inclui o produto atual nem estoque 0, prioriza mesmo `tipo` → mesmo `grupo`, respeita `limit` e retorna `[]` com catálogo de 1 item
- [ ] Tests pass: `node --test`

**Verify**: `node --test`

**Commit**: `:sparkles: catalogo: helpers de preço, urgência e relacionados`

---

### T6: `catalogo-core.js` — estado ⇄ query string

**What**: `stateFromQuery(search)` e `stateToQuery(state)` conforme `CatalogState`, omitindo valores padrão.
**Where**: `static/js/catalogo-core.js`, `tests/catalogo-core.test.js` (modificar)
**Depends on**: T5
**Requirement**: CAT-11

**Done when**:

- [ ] Ida e volta (`stateFromQuery(stateToQuery(s))`) preserva o estado, inclusive linhas com espaço e acento
- [ ] Estado padrão gera string vazia
- [ ] Valores inválidos na URL (`grupo=xyz`, `min=abc`) caem no padrão sem lançar erro
- [ ] Tests pass: `node --test`

**Verify**: `node --test`

**Commit**: `:sparkles: catalogo: serialização do estado do catálogo na URL`

---

### T7: Teste de validação do `catalogo.json` real

**What**: Teste que carrega `data/catalogo.json` e verifica: `produtos` é array, slugs únicos e `[a-z0-9-]`, campos obrigatórios presentes, `grupo`/`condicao` válidos, `preco` numérico > 0, `adicionadoEm` no formato AAAA-MM-DD, e se cada arquivo de `imagens` existe no disco.
**Where**: `tests/catalogo-json.test.js` (novo)
**Depends on**: T3
**Requirement**: CAT-01

**Done when**:

- [ ] Passa com o JSON de exemplo
- [ ] Falha com mensagem citando o slug quando um campo obrigatório é removido ou uma imagem não existe (testar manualmente e reverter)
- [ ] Tests pass: `node --test`

**Verify**: `node --test`

**Commit**: `:white_check_mark: catalogo: valida catalogo.json e imagens`

---

### T8: `common.js` — funções de catálogo compartilhadas

**What**: Adicionar ao `JC`: `escapeHtml`, `loadCatalog(url)` (fetch + validação mínima + descarte com `console.warn` de itens inválidos + cache em memória), `productMessage(p)` e `renderCard(p, listName)` (HTML do design, com `onerror` de imagem → placeholder).
**Where**: `static/js/common.js` (modificar)
**Depends on**: T2, T5
**Reuses**: `JCCore.formatPrice`, `discountPercent`, `urgencyLabel`
**Requirement**: CAT-02, CAT-03, CAT-06, CAT-12

**Done when**:

- [ ] `JC.escapeHtml('<b>"x"</b>')` → `&lt;b&gt;&quot;x&quot;&lt;/b&gt;`
- [ ] `JC.loadCatalog` rejeita com JSON inválido/404 e resolve com os produtos válidos
- [ ] `JC.productMessage` contém nome, "Novo"/"Seminovo" e preço formatado
- [ ] `JC.renderCard` gera um `<a href="produto.html?p=slug">` com os selos condicionais corretos

**Verify**: No console do navegador em `/`: `JC.loadCatalog("data/catalogo.json").then(c => JC.renderCard(c.produtos[0]))` retorna o HTML esperado.

**Commit**: `:sparkles: catalogo: carregamento do JSON e card de produto compartilhados`

---

### T9: `static/css/catalogo.css` — card, selos, grid e estados [P]

**What**: Estilos de `.product-card`, `.product-media` (aspect-ratio 1/1, `object-fit: contain`, fundo `--bg-secondary`), `.tag` e variantes (`novo`, `seminovo`, `promo`, `urgencia`), `.catalog-grid` (2/3/4 colunas), skeleton, estado vazio e estado de erro. Usa só os tokens de `site.css`.
**Where**: `static/css/catalogo.css` (novo)
**Depends on**: T1
**Requirement**: CAT-02, CAT-03, CAT-12

**Tools**: Skill `frontend-design` / `ui-ux-pro-max` (opcional, para acabamento visual)

**Done when**:

- [ ] Nome longo corta em 2 linhas
- [ ] Nenhuma cor hardcoded fora dos tokens, exceto as dos selos (definidas como novos tokens em `site.css`)
- [ ] 2 colunas em 360px sem scroll horizontal

**Verify**: Revisão visual junto com T11.

**Commit**: `:lipstick: catalogo: estilos de card, selos e grid`

---

### Phase 3 — Página do catálogo

### T10: Marcação da seção `#catalogo` no `index.html`

**What**: Substituir `<section id="produtos">` pela estrutura do design (abas com `role="tablist"`, toolbar, contador com `aria-live`, grid, gaveta de filtros, `<noscript>`). Renomear "Produtos" → "Catálogo" no menu desktop e mobile e apontar o "Ver produtos" do hero para `#catalogo`. Carregar `catalogo.css`, `catalogo-core.js` e `catalogo.js`.
**Where**: `index.html` (modificar)
**Depends on**: T8, T9
**Requirement**: CAT-02, CAT-04

**Done when**:

- [ ] `#produtos` não existe mais; `grep -c 'href="#produtos"' index.html` → `0`
- [ ] Todos os controles têm `<label>` ou `aria-label`
- [ ] Com JS desativado, o `<noscript>` mostra mensagem + link de WhatsApp

**Verify**: `grep -n 'id="catalogo"' index.html` → 1 ocorrência. Abrir com JS desativado.

**Commit**: `:sparkles: catalogo: estrutura da seção de catálogo na home`

---

### T11: `catalogo.js` — carga e renderização do grid

**What**: `init()` + `render()` básicos: skeletons → `loadCatalog` → grid com produtos disponíveis do grupo padrão, contador de resultados, estados vazio e de erro, `observeReveal`/`bindWaLinks` depois de cada render.
**Where**: `static/js/catalogo.js` (novo)
**Depends on**: T10
**Requirement**: CAT-02, CAT-03, CAT-12

**Done when**:

- [ ] Os cards batem com o JSON (produto com estoque 0 não aparece)
- [ ] Renomear temporariamente o JSON mostra o estado de erro com WhatsApp, e o resto da página continua funcionando
- [ ] Sem scroll horizontal em 360px

**Verify**: Servidor local, comparar cards com o JSON em 360px e 1280px; teste de erro renomeando o arquivo.

**Commit**: `:sparkles: catalogo: renderiza grid de produtos a partir do JSON`

---

### T12: `catalogo.js` — abas, busca, ordenação e URL

**What**: `setState(patch)` + ligação das abas, da busca (a cada tecla) e do select de ordenação; sincronizar com `replaceState` (preservando `#catalogo`); restaurar o estado da URL no `init`; limpar linhas inexistentes ao trocar de grupo.
**Where**: `static/js/catalogo.js` (modificar)
**Depends on**: T11
**Requirement**: CAT-04, CAT-08, CAT-09, CAT-11

**Done when**:

- [ ] Aba "Acessórios" mostra só acessórios e fica ativa (`aria-selected`)
- [ ] Busca sem acento encontra nome com acento
- [ ] As 3 ordenações conferem com o JSON
- [ ] Recarregar a página com `?grupo=acessorio&q=capa&ordem=menor-preco#catalogo` restaura exatamente esse estado

**Verify**: Manual + URL de teste acima.

**Commit**: `:sparkles: catalogo: abas, busca, ordenação e estado na URL`

---

### T13: `catalogo.js` + CSS — gaveta de filtros

**What**: `openFilters`/`closeFilters` (Esc, clique no fundo, "Ver N resultados"), preço mín/máx (`inputmode="numeric"`), checkboxes de linha (gerados por `linesFor` do grupo atual) e de condição, aplicação ao vivo, badge "Filtros (n)", "Limpar filtros". Gaveta de baixo para cima no celular e painel lateral no desktop; foco preso dentro da gaveta enquanto aberta.
**Where**: `static/js/catalogo.js`, `static/css/catalogo.css` (modificar)
**Depends on**: T12
**Requirement**: CAT-10

**Done when**:

- [ ] Combinação aba + busca + preço + linha + condição confere com o JSON filtrado à mão
- [ ] Badge mostra a quantidade de grupos de filtro ativos; "Limpar filtros" zera os filtros e mantém aba e busca
- [ ] Esc fecha e devolve o foco ao botão "Filtros"
- [ ] O estado vazio aparece quando nada casa e o "Limpar filtros" dele funciona

**Verify**: Manual em 360px e 1280px.

**Commit**: `:sparkles: catalogo: gaveta de filtros por preço, linha e condição`

---

### T14: `catalogo.js` — eventos GA4 do catálogo

**What**: `catalog_group`, `catalog_search` (debounce 1s, ≥2 caracteres), `catalog_sort`, `catalog_filter` (ao fechar a gaveta com filtros alterados) e `select_item` (clique em card, `item_list_name: "catalogo"`).
**Where**: `static/js/catalogo.js` (modificar)
**Depends on**: T13
**Requirement**: CAT (design → Eventos GA4)

**Done when**:

- [ ] Cada evento aparece uma única vez por ação no GA4 DebugView (ou em `dataLayer` no console)
- [ ] Digitar "iphone" rápido gera 1 `catalog_search`, não 6

**Verify**: Console: `dataLayer.filter(e => e[0] === "event").map(e => e[1])` depois de cada ação.

**Commit**: `:chart_with_upwards_trend: catalogo: eventos GA4 de busca, filtros e seleção`

---

### Phase 4 — Ficha do produto

### T15: Estrutura do `produto.html`

**What**: Página com o mesmo `<head>` (gtag, fontes, `site.css`, `catalogo.css`), nav e footer da home (links para `./#...`), `<main id="produto">` com skeleton, `<noscript>` e scripts (`common.js`, `catalogo-core.js`, `produto.js`).
**Where**: `produto.html` (novo)
**Depends on**: T8, T9
**Requirement**: CAT-05

**Done when**:

- [ ] Nav, menu mobile e footer funcionam igual à home; links do menu levam às seções da home
- [ ] Console limpo

**Verify**: Abrir `/produto.html` no servidor local.

**Commit**: `:sparkles: ficha: estrutura da página de produto`

---

### T16: `produto.js` — conteúdo da ficha e CTA

**What**: `init()` lê `?p=`, `renderProduct(p)` (nome, selos, preço riscado/desconto/parcelamento, especificações quando houver, botão "Garantir sua unidade" `.btn-whatsapp .btn-lg` com `productMessage`), `updateMeta(p)`, estado "não encontrado ou já vendido" e `view_item` + `whatsapp_click` com `link_location: "ficha"`. Layout de uma coluna no celular e duas no desktop.
**Where**: `static/js/produto.js` (novo), `static/css/catalogo.css` (modificar)
**Depends on**: T15
**Requirement**: CAT-05, CAT-06, CAT-12

**Done when**:

- [ ] 3 produtos diferentes conferem com o JSON; aba mostra "{nome} | JC Iphones"
- [ ] O botão "Garantir sua unidade" abre `wa.me` com nome, condição e preço
- [ ] Produto sem `especificacoes` não mostra a seção vazia
- [ ] `?p=` ausente, slug inexistente ou estoque 0 mostram o estado "não encontrado" com links

**Verify**: `/produto.html?p=<slug>` para cada caso acima.

**Commit**: `:sparkles: ficha: detalhes do produto e botão Garantir sua unidade`

---

### T17: `produto.js` — galeria

**What**: `renderGallery(imagens)`: imagem principal + miniaturas clicáveis (`<button aria-label>`); no celular, faixa com `scroll-snap` para swipe e indicador de posição. Com 1 imagem, sem miniaturas.
**Where**: `static/js/produto.js`, `static/css/catalogo.css` (modificar)
**Depends on**: T16
**Requirement**: CAT-05 (critério 6)

**Done when**:

- [ ] Produto com 3 imagens: miniaturas trocam a principal no desktop; swipe funciona no celular
- [ ] Produto com 1 imagem não mostra miniaturas

**Verify**: Manual em 375px (emulação touch) e 1280px.

**Commit**: `:sparkles: ficha: galeria de imagens com miniaturas e swipe`

---

### T18: `produto.js` — barra fixa de CTA no celular

**What**: Barra fixa no rodapé (< 768px) com preço + "Garantir sua unidade", visível só enquanto o botão principal está fora da tela (`IntersectionObserver`), respeitando `env(safe-area-inset-bottom)`.
**Where**: `static/js/produto.js`, `static/css/catalogo.css` (modificar)
**Depends on**: T17
**Requirement**: CAT-06 (critério 3)

**Done when**:

- [ ] Em 375×667 o botão "Garantir sua unidade" está sempre visível (o original ou o da barra)
- [ ] A barra não aparece no desktop e não cobre o footer no fim da página (padding inferior no `main`)

**Verify**: Rolar a ficha em 375×667.

**Commit**: `:sparkles: ficha: barra fixa de CTA no mobile`

---

### T19: `produto.js` — "Você também pode gostar" e voltar

**What**: Seção com `relatedProducts(…, 4)` renderizada via `JC.renderCard(p, "relacionados")` (omitida se vazia) + `select_item`; link "← Voltar ao catálogo" (`history.back()` se o referrer for a home do mesmo site, senão `./#catalogo`).
**Where**: `static/js/produto.js` (modificar)
**Depends on**: T18
**Requirement**: CAT-07, CAT-05 (critério 5), CAT-11

**Done when**:

- [ ] Até 4 relacionados, sem o produto atual e sem estoque 0; priorizam o mesmo tipo
- [ ] Clique em um relacionado abre a ficha dele
- [ ] Vindo do catálogo filtrado, "Voltar" restaura filtros e posição; abrindo a ficha direto, "Voltar" leva para `./#catalogo`

**Verify**: Fluxo manual catálogo filtrado → ficha → voltar; e link da ficha aberto em aba nova → voltar.

**Commit**: `:sparkles: ficha: produtos relacionados e voltar ao catálogo`

---

### Phase 5 — Vantagens e Bio

### T20: `JC.renderVantagens` + seção `#vantagens` + versão compacta na ficha

**What**: Constante `VANTAGENS` (textos do spec) + `renderVantagens(el, "full" | "compact")` com ícones SVG; nova `<section id="vantagens">` logo após `#catalogo`; versão compacta na ficha, abaixo do CTA; "Entrega ou retirada" com `data-wa-text` sobre entrega/retirada.
**Where**: `static/js/common.js`, `static/css/catalogo.css`, `index.html`, `static/js/produto.js` (modificar)
**Depends on**: T11, T16
**Requirement**: VANT-01, VANT-03, VANT-04

**Done when**:

- [ ] Os 3 textos aparecem idênticos na home e na ficha
- [ ] "Entrega ou retirada" abre o WhatsApp com a mensagem de entrega
- [ ] Sem scroll horizontal em 360px

**Verify**: `grep -rn "6 meses da loja" index.html produto.html static/js` → só 1 ocorrência (em `common.js`).

**Commit**: `:sparkles: vantagens: garantia, pagamento e entrega na home e na ficha`

---

### T21: Reconciliar a seção `#porque`

**What**: Remover "Garantia de verdade" e "Parcelamento" de `#porque` (cobertos por `#vantagens`). Decidir visualmente entre manter "Atendimento próximo" + "Loja física" ou remover a seção.
**Where**: `index.html` (modificar)
**Depends on**: T20
**Requirement**: VANT-02

**Done when**:

- [ ] Nenhum texto do site contradiz "Pix ou cartão" ou a política de garantia
- [ ] A decisão tomada está registrada em `STATE.md`

**Verify**: `grep -n -i "parcelamento\|garantia de verdade" index.html` → sem ocorrência em `#porque`.

**Commit**: `:lipstick: vantagens: remove duplicidade com a seção Por que escolher`

---

### T22: `bio/index.html` — página link-na-bio [P]

**What**: Página no layout da referência (`image.png`): banner (`../static/banner.jpg`), logo circular sobreposto, "Bem-vindo à JC Iphones", bio curta, 4 botões com ícone/título/subtítulo (WhatsApp via `data-wa-text`, `../#catalogo`, Instagram em nova aba, Google Maps), rodapé com © e "Seg a dom, 8h às 18h". Usa `../static/css/site.css` + `../static/js/common.js`; CSS próprio da bio inline ou em `static/css/bio.css`. Evento `bio_click` com `destino`.
**Where**: `bio/index.html` (novo), `static/css/bio.css` (novo, opcional)
**Depends on**: T2
**Requirement**: BIO-01, BIO-02, BIO-03

**Tools**: Skill `frontend-design` (opcional)

**Done when**:

- [ ] Em 375×667, logo, título e os 4 botões aparecem sem scroll horizontal; alvos de toque ≥ 44px
- [ ] Cada botão leva ao destino correto; `bio_click` é disparado
- [ ] Sem banner, o topo cai para cor sólida sem quebrar
- [ ] O link do Instagram é placeholder com `TODO` enquanto a URL não for fornecida (Todo em `STATE.md`)

**Verify**: Abrir `/bio/` no servidor local em 375px e clicar nos 4 botões.

**Commit**: `:sparkles: bio: página link-na-bio para o Instagram`

---

### T23: Meta tags Open Graph da bio [P]

**What**: `<title>`, `description`, `og:title`, `og:description`, `og:image` (URL absoluta quando o domínio estiver definido) e `og:url` em `bio/index.html`.
**Where**: `bio/index.html` (modificar)
**Depends on**: T22
**Requirement**: BIO-05

**Done when**:

- [ ] Meta tags presentes; após o deploy, o preview aparece ao colar o link no WhatsApp

**Verify**: `grep -c 'property="og:' bio/index.html` → ≥ 4.

**Commit**: `:mag: bio: meta tags de compartilhamento`

---

### T24: Horário 8h às 18h em todo o site [P]

**What**: Trocar "7h às 18h" por "8h às 18h" em todas as ocorrências.
**Where**: `index.html` (modificar)
**Depends on**: T1
**Requirement**: BIO-04

**Done when**:

- [ ] `grep -rn "7h às 18h" --include=*.html .` não retorna nada

**Verify**: comando acima.

**Commit**: `:pencil2: conteúdo: corrige horário para 8h às 18h`

---

### Phase 6 — Fechamento

### T25: Documentação de manutenção

**What**: README com: como adicionar/editar/remover um produto (campos do JSON, onde pôr as fotos, tamanho recomendado ~1000px/150KB), rodar localmente (`python3 -m http.server`), rodar os testes (`node --test`), link da bio. Atualizar `.specs/codebase/STRUCTURE.md`, `ARCHITECTURE.md`, `CONVENTIONS.md` e `CONCERNS.md` (bug do menu resolvido; catálogo não é mais hardcoded).
**Where**: `README.md`, `.specs/codebase/*.md` (modificar)
**Depends on**: T1–T24
**Requirement**: CAT-01 (goal "só editar o JSON")

**Done when**:

- [ ] Uma pessoa sem contexto consegue adicionar um produto seguindo só o README

**Commit**: `:memo: docs: guia de manutenção do catálogo`

---

### T26: UAT de ponta a ponta

**What**: Percorrer todos os critérios de aceitação dos 3 specs em 360px, 375×667 e 1280px (Playwright/Chrome), registrar o resultado e atualizar a tabela de rastreabilidade para `Verified`.
**Where**: `.specs/features/*/spec.md` (status), `STATE.md`
**Depends on**: T25
**Requirement**: todos

**Tools**: Skill `webapp-testing` (Playwright) ou `claude-in-chrome`

**Done when**:

- [ ] Todos os critérios P1 passam; falhas de P2/P3 viram tasks ou Todos em `STATE.md`
- [ ] `node --test` passa
- [ ] Console sem erros nas 3 páginas

**Commit**: `:white_check_mark: uat: valida catálogo, ficha, vantagens e bio`

---

## Parallel Execution Map

```
Phase 1:  T1 ──→ T2 ──→ T3

Phase 2:  T3 ──→ T4 → T5 → T6 → T7
          T1 ──→ T9  [P]
          T1 ──→ T24 [P]
          T2+T5 ──→ T8

Phase 3 e 4 (em paralelo entre si):
          T8+T9 ──→ T10 → T11 → T12 → T13 → T14      (catalogo.js)
          T8+T9 ──→ T15 → T16 → T17 → T18 → T19      (produto.js)

Phase 5:  T11+T16 ──→ T20 → T21
          T2 ──────→ T22 → T23 [P]

Phase 6:  tudo ──→ T25 → T26
```

**Atenção:** T13, T16–T18 e T20 editam `catalogo.css`. Se rodarem em paralelo, separar as regras por comentário de bloco (`/* ---------- Ficha ---------- */`) para evitar conflito.

---

## Estimativa (grosseira, para rever o orçamento com o cliente)

| Phase | Tasks | Horas |
| --- | --- | --- |
| 1 Foundation | T1–T3 | 1,5 |
| 2 Núcleo + testes + CSS base | T4–T9, T24 | 3 |
| 3 Catálogo | T10–T14 | 3 |
| 4 Ficha | T15–T19 | 3 |
| 5 Vantagens + Bio | T20–T23 | 2 |
| 6 Docs + UAT | T25–T26 | 1,5 |
| **Total dev** | | **~14h** (+ 2h publicação) |

Comparação: o combinado original (AD-002) era 7h dev + 2h publicação.

---

## Task Granularity Check

| Task | Scope | Status |
| --- | --- | --- |
| T1, T2 | 1 extração cada, sem mudança de comportamento | ✅ |
| T3 | 1 arquivo de dados + placeholders | ✅ |
| T4–T6 | grupo coeso de funções puras no mesmo arquivo + testes | ⚠️ OK (coeso) |
| T8 | 4 helpers no mesmo arquivo, todos de catálogo | ⚠️ OK (coeso) |
| T13 | gaveta (JS + CSS do mesmo componente) | ⚠️ OK (1 componente) |
| T20 | 1 componente usado em 2 páginas | ⚠️ OK (1 componente) |
| Demais | 1 arquivo / 1 comportamento | ✅ |

---

## Requirement → Task

| Req | Tasks |
| --- | --- |
| CAT-01 | T3, T7, T25 |
| CAT-02 | T8, T9, T10, T11 |
| CAT-03 | T5, T8, T9, T11 |
| CAT-04 | T4, T10, T12 |
| CAT-05 | T15, T16, T17, T19 |
| CAT-06 | T8, T16, T18 |
| CAT-07 | T5, T19 |
| CAT-08 | T4, T12 |
| CAT-09 | T4, T12 |
| CAT-10 | T4, T13 |
| CAT-11 | T6, T12, T19 |
| CAT-12 | T8, T9, T11, T16 |
| VANT-01, 03, 04 | T20 |
| VANT-02 | T21 |
| BIO-01, 02, 03 | T22 |
| BIO-04 | T24 |
| BIO-05 | T23 |

**Coverage:** 21/21 requisitos mapeados, 0 unmapped.
