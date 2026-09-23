# Monitoramento (Google Analytics) Specification

**Status:** ✅ COMPLETE (implementado em 2026-09-18, antes das demais features — pedido explícito do cliente)

## Problem Statement

O dono da loja não tinha nenhuma visibilidade de como visitantes usam o site: quantas pessoas acessam, o que clicam, se chegam a considerar o WhatsApp. Sem esses dados, não é possível montar o relatório mensal de acessos prometido no plano "Zero Preocupação" nem validar se as mudanças de catálogo/ficha de produto aumentam conversão.

## Goals

- [x] Rastrear visitas e navegação básica (page_view automático via GA4)
- [x] Rastrear todo clique que leva ao WhatsApp, com contexto de onde veio
- [x] Rastrear engajamento (scroll, tempo na página, seções vistas) para embasar relatórios de uso

## Out of Scope

| Feature                          | Reason                                                              |
| --------------------------------- | --------------------------------------------------------------------- |
| Rastreamento de login              | Site não tem autenticação/conta de usuário — não existe "login" a rastrear |
| Dashboard customizado no site      | Relatórios são consumidos diretamente no painel do GA4, fora do site |
| Consentimento de cookies (LGPD banner) | Não foi pedido pelo cliente nesta rodada; registrado como ideia futura |

---

## User Stories

### P1: Ver page views e cliques no WhatsApp ⭐ MVP

**User Story**: Como dono da JC Iphones, eu quero saber quantas pessoas visitam o site e quantas clicam para falar no WhatsApp, para entender se o site está gerando contato.

**Why P1**: É o dado mínimo para validar se o site converte.

**Acceptance Criteria**:

1. WHEN um visitante abre o site THEN o GA4 SHALL registrar um evento `page_view`
2. WHEN um visitante clica em qualquer link de WhatsApp THEN o GA4 SHALL registrar `whatsapp_click` com o texto do link e a seção de origem
3. WHEN o `gtag` não estiver disponível (bloqueador de anúncios, script não carregou) THEN o site SHALL continuar funcionando normalmente (evento apenas não é enviado, sem erro no console)

**Independent Test**: Abrir o site com o DevTools → Network filtrando `google-analytics`/`collect`, navegar e clicar em um botão de WhatsApp, confirmar que as requisições de evento são disparadas.

---

### P2: Ver engajamento (scroll, tempo, seções vistas)

**User Story**: Como dono da loja, eu quero saber até onde as pessoas rolam a página e quanto tempo ficam, para saber se o conteúdo prende atenção.

**Why P2**: Ajuda a priorizar o que melhorar no catálogo/ficha de produto, mas não bloqueia o MVP de conversão.

**Acceptance Criteria**:

1. WHEN o visitante rola a página e atinge 25/50/75/100% da altura THEN o GA4 SHALL registrar `scroll_depth` com o percentual atingido (uma vez por marco)
2. WHEN uma seção com `id` entra 40% na viewport THEN o GA4 SHALL registrar `section_view` com o `section_id` (uma vez por seção)
3. WHEN a aba permanece visível por 30s ou mais THEN o GA4 SHALL registrar `time_on_page` a cada 30s com o tempo acumulado

**Independent Test**: Rolar a página até o fim e aguardar 60s com a aba em foco; conferir no Network os eventos `scroll_depth` (25/50/75/100), `section_view` (um por seção) e ao menos 2 disparos de `time_on_page`.

---

## Edge Cases

- WHEN o usuário troca de aba (aba fica oculta) THEN `time_on_page` SHALL pausar de contar até a aba voltar a ficar visível
- WHEN a página tem menos conteúdo que a altura da tela (nada a rolar) THEN o cálculo de `scroll_depth` SHALL ser ignorado sem gerar erro (divisão por zero evitada)

---

## Requirement Traceability

| Requirement ID | Story                          | Phase  | Status   |
| --------------- | ------------------------------- | ------ | -------- |
| GA-01           | P1: page_view + whatsapp_click  | Done   | Verified |
| GA-02           | P2: scroll_depth                | Done   | Verified |
| GA-03           | P2: section_view                | Done   | Verified |
| GA-04           | P2: time_on_page                | Done   | Verified |
| GA-05           | P1/P2: nav_click e cta_click (extra, não pedido explicitamente mas cobre "todo clique") | Done | Verified |

**Coverage:** 5 total, 5 verificados, 0 unmapped

---

## Success Criteria

- [x] Snippet `gtag.js` presente no `<head>` de `index.html` com o ID `G-FJ1ECSJ4RF`
- [x] Todo clique de WhatsApp gera evento com contexto (texto + seção)
- [x] Métricas de engajamento (scroll, tempo, seção) disponíveis no GA4 sem exigir configuração extra no painel
