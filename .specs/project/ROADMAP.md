# Roadmap

**Current Milestone:** V1 — Vitrine de Conversão (padrão iPortess)
**Status:** In Progress

---

## V1 — Vitrine de Conversão (padrão iPortess)

**Goal:** Site pronto para publicação, com catálogo de conversão, ficha de produto, página link-na-bio e monitoramento de uso — dentro das 7h de desenvolvimento + 2h de publicação combinadas com o cliente.
**Target:** Escopo fechado na proposta comercial (setembro/2026)

### Features

**Monitoramento (Google Analytics)** - COMPLETE

- Snippet gtag.js (G-FJ1ECSJ4RF) integrado no `<head>`
- Eventos customizados: whatsapp_click, nav_click, cta_click, section_view, scroll_depth, time_on_page

**Catálogo e Ficha de Produto** - COMPLETE (2026-09-23, aguardando dados reais)

- Catálogo lido de `data/catalogo.json`, imagens em `static/produtos/`
- Abas Dispositivos / Acessórios, busca, ordenação e filtros (preço, linha, condição)
- Ficha em `produto.html?p=slug` com botão "Garantir sua unidade" e "Você também pode gostar"

**Vantagens JC Iphones** - COMPLETE

- Garantia, formas de pagamento e entrega/retirada na home e na ficha

**Página Link-na-Bio** - COMPLETE (aguardando URL do Instagram)

- Página própria em `/bio/` no layout da referência iPortess
- Botões: Entre em contato, Veja o nosso catálogo, Nosso Instagram, Ver localização
- Horário de atendimento corrigido para 8h às 18h

---

## Future Considerations

- Painel admin para editar o catálogo sem mexer no JSON
- Páginas estáticas por produto (build step) para SEO de cauda longa
- SEO local ("iPhone + cidade") e compressão/otimização de imagens
- Relatório mensal automatizado a partir dos eventos do GA4 (parte do plano "Zero Preocupação")
