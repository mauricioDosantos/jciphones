# Página Início (Link-na-Bio) Design

**Spec**: `.specs/features/pagina-inicio-bio/spec.md`
**Status**: Draft

---

## Architecture Overview

A seção `#inicio` (hero atual) ganha uma segunda "vista" — um bloco `.bio-view` que fica oculto por padrão e é exibido quando o menu "Início" é clicado. Não há roteamento real: é um toggle de classe controlado por JS, no mesmo padrão já usado para o menu mobile (`.open`).

```mermaid
graph TD
    A[Clique em "Início" no menu] --> B[showBioView()]
    B --> C[Adiciona classe .bio-active em #inicio]
    C --> D[CSS: .hero-content some, .bio-view aparece]
    D --> E[Scroll suave até #inicio]
    F[Clique em "Ver catálogo" dentro da bio-view] --> G[Remove .bio-active + scroll até #produtos]
```

**Decisão de escopo:** em vez de duas seções distintas competindo por espaço, o hero atual e a bio-view compartilham o mesmo espaço de `#inicio`, alternando visibilidade via CSS. Isso evita duplicar o CTA de WhatsApp e mantém a página com uma única seção "topo".

---

## Code Reuse Analysis

### Existing Components to Leverage

| Component                     | Location            | How to Use                                                        |
| ------------------------------- | ---------------------- | --------------------------------------------------------------------- |
| `[data-wa-text]` + `waUrl()`     | `index.html`           | Botão "Falar no WhatsApp" da bio-view reaproveita o mesmo mecanismo   |
| `track()`                       | `index.html`           | Instrumentar clique em cada botão da bio-view como `cta_click`/`nav_click` (já cobre, sem trabalho extra) |
| `.btn`, `.btn-whatsapp`, `.btn-ghost` | `index.html` `<style>` | Reaproveitar estilos de botão existentes para os 4 botões empilhados  |

### Integration Points

| System            | Integration Method                                     |
| -------------------- | ------------------------------------------------------------ |
| Instagram             | Link direto (`target="_blank"`) — URL a confirmar com cliente |
| Google Maps           | Reaproveita a mesma URL de `#contato` (não duplicar endereço) |

---

## Components

### `.bio-view`

- **Purpose**: tela curta estilo link-na-bio, oculta por padrão
- **Location**: dentro de `<section id="inicio">`, como bloco irmão do `.hero-inner` atual
- **Interfaces**: nenhuma função própria — visibilidade controlada por classe `.bio-active` em `#inicio`
- **Dependencies**: `showBioView()`, `hideBioView()`
- **Reuses**: `.btn` e variantes existentes

### `showBioView()` / `hideBioView()`

- **Purpose**: alternar entre o hero completo e a visão link-na-bio
- **Location**: `index.html` (script final)
- **Interfaces**:
  - `showBioView(): void` — adiciona `.bio-active` em `#inicio`, rola até o topo
  - `hideBioView(): void` — remove `.bio-active` (chamado ao navegar para outra seção a partir da bio-view)
- **Dependencies**: nenhuma nova
- **Reuses**: padrão de toggle de classe já usado no menu mobile

---

## Data Models

Não aplicável — conteúdo estático (4 links fixos).

---

## Error Handling Strategy

| Error Scenario                                | Handling                                             | User Impact                              |
| ------------------------------------------------ | ------------------------------------------------------- | -------------------------------------------- |
| Link do Instagram ainda não fornecido pelo cliente | Usa placeholder `href="#"` com comentário `TODO` visível no HTML | Botão existe mas não navega até ser corrigido antes da publicação |
| JS falha ao carregar                              | `.bio-view` fica sempre com `display:none` via CSS padrão, hero completo continua visível | Menu "Início" comporta-se como âncora normal (rola para o topo), sem quebrar |

---

## Tech Decisions (only non-obvious ones)

| Decision                                    | Choice                                        | Rationale                                                          |
| ---------------------------------------------- | -------------------------------------------------- | -------------------------------------------------------------------- |
| Bio-view como toggle dentro de `#inicio` vs. seção nova | Toggle de visibilidade no mesmo `#inicio`         | Evita duas seções "topo" competindo, menos CSS/HTML novo, cabe no orçamento de horas |
| Rolagem automática ao clicar em "Início"        | `scrollIntoView({behavior:'smooth'})` para `#inicio` | Mesmo comportamento de âncora já usado no resto do menu               |
