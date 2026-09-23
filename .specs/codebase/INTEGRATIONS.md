# External Integrations

## Analytics

**Service:** Google Analytics 4 (gtag.js)
**Purpose:** rastrear uso da plataforma (visitas, cliques, navegação, rolagem, tempo de permanência) para relatórios de conversão e engajamento
**Implementation:** snippet oficial no `<head>` de `index.html` + eventos customizados disparados na IIFE do script final
**Configuration:** measurement ID `G-FJ1ECSJ4RF`, hardcoded no snippet
**Authentication:** nenhuma (client-side, chave pública de medição)

**Eventos customizados implementados:**

| Evento           | Disparado quando                                   | Parâmetros                          |
| ----------------- | --------------------------------------------------- | ------------------------------------ |
| `whatsapp_click`  | clique em qualquer link `[data-wa-text]`             | `link_text`, `link_location`         |
| `nav_click`       | clique em link do menu (desktop ou mobile)           | `link_text`, `link_url`              |
| `cta_click`       | clique em botão `.btn` que não seja WhatsApp         | `link_text`                          |
| `section_view`    | seção de `<main>` entra 40% na viewport (uma vez)    | `section_id`                         |
| `scroll_depth`    | usuário atinge 25/50/75/100% de rolagem da página    | `percent`                            |
| `time_on_page`    | ping a cada 30s enquanto a aba está visível          | `seconds` (acumulado)                |

`page_view` é automático via `gtag('config', ...)`.

**Gap conhecido:** não há tracking de "login" porque o site não possui autenticação/área logada (ver `CONCERNS.md`).

## Mensageria / Conversão

**Service:** WhatsApp (`wa.me` deep link)
**Purpose:** canal único de fechamento de venda — todo CTA do site leva a uma conversa pré-preenchida
**Implementation:** atributo `data-wa-text` em âncoras, resolvido em JS para `https://wa.me/{numero}?text={mensagem}`
**Configuration:** constante `WA_NUMBER` no script de `index.html` — **atualmente com número placeholder `5511999999999`, precisa ser substituído pelo número real da loja**
**Authentication:** nenhuma

## Mapas

**Service:** Google Maps (iframe embed)
**Purpose:** exibir localização da loja na seção `#contato`
**Implementation:** `<iframe src="https://maps.google.com/maps?q=...">`
**Configuration:** endereço fixo no `src` do iframe

## Fontes

**Service:** Google Fonts
**Purpose:** tipografia (`Instrument Sans`)
**Implementation:** `<link rel="preconnect">` + `<link rel="stylesheet">` no `<head>`

## Background Jobs

Nenhum — site estático sem processamento assíncrono no servidor.
