# Página Início (Link-na-Bio) Tasks

**Design**: `.specs/features/pagina-inicio-bio/design.md`
**Status**: Draft
**Orçamento de referência:** ~1,5h das 7h de desenvolvimento combinadas

---

## Execution Plan

### Phase 1: Correção de conteúdo (Sequencial)

```
T1
```

### Phase 2: Bio-view (Sequencial, pequeno demais para paralelizar)

```
T2 → T3 → T4
```

---

## Task Breakdown

### T1: Corrigir horário de atendimento em todo o HTML

**What**: Substituir todas as ocorrências de "7h às 18h" por "8h às 18h" em `index.html`
**Where**: `index.html` (hero trust badge + qualquer outra menção)
**Depends on**: None
**Requirement**: BIO-03

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] `grep -in "7h" index.html` não retorna nenhuma menção de horário de atendimento
- [ ] Todas as menções de horário mostram "8h às 18h"

**Verify**: `grep -in "18h\|atendimento" index.html` e conferência visual no hero.

---

### T2: Markup do bloco `.bio-view`

**What**: Criar o bloco HTML da visão link-na-bio dentro de `<section id="inicio">`: logo/marca, bio curta ("iPhones novos & seminovos — acessórios exclusivos, suporte dedicado"), localização (Cidade - UF), e os 4 botões (WhatsApp, Ver catálogo, Instagram, Ver localização), oculto por padrão via CSS
**Where**: `index.html`, dentro de `<section id="inicio">`, como bloco irmão do `.hero-inner`
**Depends on**: None
**Reuses**: `.btn`, `.btn-whatsapp`, `.btn-ghost`
**Requirement**: BIO-01, BIO-02

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Bloco existe no DOM com os 4 botões na ordem: WhatsApp, Ver catálogo, Instagram, Ver localização
- [ ] Botão WhatsApp usa `data-wa-text` (reaproveita mecanismo existente)
- [ ] Botão Ver catálogo aponta para `#produtos`; Ver localização usa a mesma URL do Maps de `#contato`; Instagram usa placeholder documentado se URL real não foi fornecida

**Verify**: Inspecionar o DOM, confirmar `display:none` por padrão.

---

### T3: CSS de toggle hero ↔ bio-view

**What**: Regras `#inicio.bio-active .hero-inner { display:none }` / `#inicio.bio-active .bio-view { display:flex }` (e o inverso por padrão), estilo empilhado vertical para os botões
**Where**: `index.html` (`<style>`)
**Depends on**: T2
**Requirement**: BIO-01

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Com a classe `.bio-active`, apenas a bio-view é visível; sem a classe, apenas o hero é visível
- [ ] Em mobile (360px), os 4 botões ficam legíveis e sem overflow

**Verify**: Alternar a classe manualmente via DevTools e conferir os dois estados.

---

### T4: JS de toggle (`showBioView`/`hideBioView`) + eventos

**What**: Implementar as funções, ligar o clique em todo link "Início" (nav desktop + mobile) para chamar `showBioView()`, e o clique em "Ver catálogo" dentro da bio-view para chamar `hideBioView()` antes de navegar
**Where**: `index.html` (script final)
**Depends on**: T3
**Reuses**: `track()` para instrumentar cliques
**Requirement**: BIO-01, BIO-02

**Tools**:

- MCP: NONE
- Skill: NONE

**Done when**:

- [ ] Clicar em "Início" (desktop ou mobile) mostra a bio-view e rola suavemente até `#inicio`
- [ ] Clicar em "Ver catálogo" dentro da bio-view esconde a bio-view e rola até `#produtos`
- [ ] Clicar em qualquer botão da bio-view dispara evento de tracking (`nav_click`/`cta_click`/`whatsapp_click`, conforme já implementado)

**Verify**: Fluxo manual completo: Início → bio-view → cada um dos 4 botões → confirmar destino e evento no Network.

**Commit**: `feat(inicio): página link-na-bio no menu Início + correção de horário`

---

## Parallel Execution Map

```
Phase 1:
  T1 (independente, pode rodar antes ou em paralelo com Phase 2)

Phase 2 (Sequencial):
  T2 ──→ T3 ──→ T4
```

---

## Task Granularity Check

| Task                                | Scope           | Status      |
| -------------------------------------- | ----------------- | -------------- |
| T1: Corrigir horário                    | 1 texto/find-replace | ✅ Granular |
| T2: Markup da bio-view                  | 1 bloco HTML       | ✅ Granular |
| T3: CSS de toggle                       | 1 bloco de CSS      | ✅ Granular |
| T4: JS de toggle + eventos               | 2 funções coesas    | ✅ Granular |
