# Catálogo e Ficha de Produto Tasks

**Design**: `.specs/features/catalogo-e-ficha-produto/design.md`
**Status**: Draft
**Orçamento de referência:** ~4,5h das 7h de desenvolvimento combinadas

---

## Execution Plan

### Phase 1: Fundação (Sequencial)

```
T1 → T2 → T3
```

### Phase 2: Cards do catálogo (Paralelo OK após T3)

```
     ┌→ T4 ─┐
T3 ──┼→ T5 ─┼──→ T7
     └→ T6 ─┘
```

### Phase 3: Ficha de produto / modal (Sequencial, depende da Phase 2)

```
T7 → T8 → T9 → T10 → T11
```

---

## Task Breakdown

### T1: Confirmar número real de WhatsApp com o cliente

**What**: Substituir `WA_NUMBER = "5511999999999"` pelo número real da JC Iphones em `index.html`
**Where**: `index.html` (script final)
**Depends on**: None
**Requirement**: pré-requisito de CAT-05 (bloqueio B-001 em `STATE.md`)

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] `WA_NUMBER` contém o número real fornecido pelo cliente
- [ ] Um clique de teste em qualquer `.btn-whatsapp` abre a conversa correta no WhatsApp Web/app

**Verify**: Abrir `index.html` no navegador, clicar em um CTA de WhatsApp, confirmar que o número na URL `wa.me/` é o correto.

---

### T2: Criar CSS dos selos de condição/urgência/promoção

**What**: Classes `.tag`, `.tag-novo`, `.tag-seminovo`, `.tag-lacrado`, `.tag-promo`, `.tag-urgencia` no `<style>` de `index.html`
**Where**: `index.html` (`<style>`, próximo aos demais componentes como `.btn`)
**Depends on**: None
**Reuses**: `--radius`, `--accent`, paleta existente
**Requirement**: CAT-02, CAT-03, CAT-04

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Cada tag tem cor/contraste distinto e legível em fundo claro e escuro do card
- [ ] Tags funcionam em pílula pequena (`border-radius: 999px` ou similar), sem quebrar o layout do card em telas de 360px de largura

**Verify**: Inspecionar visualmente em DevTools com viewport 360px e 1280px.

---

### T3: Atualizar markup dos cards em `#produtos` com o modelo `data-*`

**What**: Reescrever os cards existentes da seção `#produtos` para incluir os atributos `data-title`, `data-price`, `data-price-original`, `data-installments`, `data-condition`, `data-urgency`, `data-images`, `data-wa-text`, e renderizar preço/tags no HTML
**Where**: `index.html`, seção `<section id="produtos">`
**Depends on**: T2
**Requirement**: CAT-01, CAT-02, CAT-03

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Todo card exibe preço final; cards com desconto exibem preço riscado + percentual
- [ ] Cards com parcelamento exibem o texto "ou Nx de R$Y"
- [ ] Ao menos 1 produto de cada tag (Novo, Seminovo, Lacrado, Promoção, Última unidade) está representado, usando dados reais fornecidos pelo cliente

**Verify**: Abrir `#produtos` no navegador e conferir visualmente cada combinação de tag.

---

### T4: Calcular e exibir percentual de desconto automaticamente [P]

**What**: Função `calcDiscount(original, price)` que retorna o percentual arredondado, usada para preencher o selo "Promoção -X%"
**Where**: `index.html` (script final)
**Depends on**: T3
**Requirement**: CAT-01, CAT-04

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Selo de promoção mostra o percentual correto calculado a partir de `data-price-original` e `data-price`
- [ ] Produtos sem `data-price-original` não exibem selo de promoção nem erro no console

**Verify**: `console.log` manual ou inspeção visual do selo em 2 produtos com desconto diferente.

---

### T5: Aplicar `.reveal`/`IntersectionObserver` aos novos cards [P]

**What**: Garantir que os cards atualizados continuem entrando com a animação `.reveal` já existente
**Where**: `index.html`
**Depends on**: T3
**Reuses**: observer já existente no script final
**Requirement**: n/a (consistência visual, não é requisito funcional novo)

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Cards aparecem com a mesma animação de fade/slide das demais seções ao rolar a página

**Verify**: Rolar até `#produtos` e observar a transição.

---

### T6: Responsividade do grid de cards em mobile [P]

**What**: Ajustar/confirmar `grid-template-columns` do container de `#produtos` para 1 coluna em <480px e 2 colunas em tablet, mantendo texto legível sem zoom
**Where**: `index.html` (`<style>`, media queries de `#produtos`)
**Depends on**: T3
**Requirement**: n/a (requisito geral de responsividade mobile-first)

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Em viewport 360px, cada card ocupa a largura útil sem overflow horizontal
- [ ] Preço, tags e botão continuam legíveis sem cortar texto

**Verify**: DevTools em modo responsivo, 360px e 768px.

---

### T7: Criar markup do modal `#productModal`

**What**: Bloco HTML fixo do modal (fechado por padrão via CSS `display:none`/classe), com estrutura para galeria, título, tags, preço, parcelamento, copy de urgência e botão de WhatsApp
**Where**: `index.html`, próximo ao fim do `<body>`, antes do `<script>` final
**Depends on**: T4, T5, T6 (fase 2 completa)
**Reuses**: ícone SVG de WhatsApp já usado nos outros CTAs
**Requirement**: CAT-05, CAT-07

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Modal existe no DOM, oculto por padrão, sem quebrar o layout da página quando fechado
- [ ] Estrutura inclui contêiner de galeria, título, linha de tags, preço, parcelamento, linha de copy de urgência e botão de WhatsApp

**Verify**: Inspecionar o DOM via DevTools, confirmar `display:none`/classe fechada no load inicial.

---

### T8: Implementar `openProductModal(cardEl)` e `closeProductModal()`

**What**: Funções JS que populam o modal a partir do card clicado e o abrem/fecham
**Where**: `index.html` (script final)
**Depends on**: T7
**Reuses**: `waUrl()`, `track()`
**Requirement**: CAT-04, CAT-06

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Clicar em qualquer `.product-card` abre o modal com os dados corretos daquele produto
- [ ] Botão fechar, tecla Esc e clique fora do modal fecham a ficha
- [ ] Scroll do `body` é travado com o modal aberto e restaurado ao fechar

**Verify**: Clicar em 3 produtos diferentes em sequência, confirmar que os dados nunca "vazam" de um produto para outro; testar Esc e clique fora.

---

### T9: Renderizar galeria de imagens dentro do modal

**What**: A partir de `data-images` (lista separada por vírgula), renderizar miniaturas/imagem principal trocável dentro do modal
**Where**: `index.html` (script final, dentro de `openProductModal`)
**Depends on**: T8
**Requirement**: CAT-05

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Produto com múltiplas imagens permite trocar a imagem principal (clique na miniatura)
- [ ] Produto com apenas 1 imagem (ou sem `data-images`) exibe a imagem do card como fallback, sem erro

**Verify**: Testar com um produto de 3 imagens e um produto sem `data-images`.

---

### T10: Instrumentar eventos de analytics do modal (`product_view`)

**What**: Disparar `track("product_view", { product_title })` dentro de `openProductModal`, e confirmar que o botão de WhatsApp do modal já reaproveita o handler de `whatsapp_click`
**Where**: `index.html` (script final)
**Depends on**: T8
**Reuses**: `track()` já existente
**Requirement**: CAT-04, CAT-05 (rastreabilidade, alinhado com `analytics-monitoramento`)

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Abrir a ficha de qualquer produto dispara `product_view` com o nome do produto no GA4 (checar via Network)
- [ ] Clicar no WhatsApp dentro do modal dispara `whatsapp_click` com `link_location` identificando que veio do modal

**Verify**: DevTools → Network → filtrar `collect`, abrir ficha e clicar em WhatsApp, conferir os dois eventos.

---

### T11: QA final da feature (desktop + mobile)

**What**: Passada de verificação manual cobrindo os critérios de aceite P1/P2/P3 do `spec.md`
**Where**: `index.html` completo
**Depends on**: T9, T10
**Requirement**: CAT-01 a CAT-07 (todos)

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Todos os critérios WHEN/THEN de `spec.md` foram checados manualmente em Chrome desktop e em um viewport mobile (360-390px)
- [ ] Nenhum erro no console do navegador
- [ ] Nenhum card ou botão de WhatsApp aponta para o número placeholder (T1 confirmado)

**Verify**: Checklist manual item a item contra `spec.md`; console limpo.

**Commit**: `feat(catalogo): cards de oferta com tags e ficha de produto em modal`

---

## Parallel Execution Map

```
Phase 1 (Sequencial):
  T1 (bloqueia publicação, mas não bloqueia dev do catálogo em si)
  T2 ──→ T3

Phase 2 (Paralelo após T3):
    ├── T4 [P]
    ├── T5 [P]  } Podem rodar em paralelo
    └── T6 [P]

Phase 3 (Sequencial):
  T4, T5, T6 completos, então:
    T7 ──→ T8 ──→ T9 ──→ T10 ──→ T11
```

---

## Task Granularity Check

| Task                                      | Scope                | Status      |
| -------------------------------------------- | ---------------------- | -------------- |
| T1: Atualizar número de WhatsApp              | 1 constante            | ✅ Granular   |
| T2: CSS dos selos                             | 1 bloco de CSS         | ✅ Granular   |
| T3: Markup dos cards com data-*                | 1 seção HTML           | ✅ Granular   |
| T4: Cálculo de desconto                       | 1 função               | ✅ Granular   |
| T7: Markup do modal                           | 1 componente           | ✅ Granular   |
| T8: open/close do modal                       | 2 funções coesas       | ✅ Granular   |
