# Catálogo e Ficha de Produto Design

**Spec**: `.specs/features/catalogo-e-ficha-produto/spec.md`
**Status**: Draft

---

## Architecture Overview

Mantém o padrão do projeto: sem framework, sem build. O catálogo continua sendo HTML estático (cards com `data-*` atributos carregando os dados do produto). A ficha de produto é um **modal único reaproveitável**, populado via JS a partir dos `data-*` do card clicado — não são N modais pré-renderizados, é 1 modal que troca de conteúdo.

```mermaid
graph TD
    A[Card do produto .product-card] -->|clique| B[openProductModal(cardEl)]
    B --> C[Lê data-* do card: nome, precos, tags, fotos, msg WhatsApp]
    C --> D[Popula #productModal com esses dados]
    D --> E[Exibe modal + trava scroll do body]
    E -->|fechar / Esc / clique fora| F[closeProductModal]
    F --> G[Restaura scroll do body]
    D --> H[Botão WhatsApp do modal usa waUrl já existente]
    A -->|clique também dispara| I[track('cta_click' ou evento novo product_view)]
```

---

## Code Reuse Analysis

### Existing Components to Leverage

| Component                     | Location                              | How to Use                                                                 |
| ------------------------------ | -------------------------------------- | ---------------------------------------------------------------------------- |
| `waUrl(message)`                | `index.html` (script final)             | Reaproveitar para montar o link de WhatsApp do modal, sem duplicar lógica    |
| `track(eventName, params)`      | `index.html` (script final)             | Reaproveitar para instrumentar `product_view` (abrir ficha) e `whatsapp_click` do modal (já cobre `link_location` genérico) |
| Padrão `.reveal` + `IntersectionObserver` | `index.html`                | Aplicar aos novos cards de produto, se fizerem parte de `#produtos`          |
| Variáveis CSS (`--accent`, `--whatsapp`, `--radius-lg`, `--ease`) | `index.html` `<style>` | Usar as mesmas variáveis para selos, modal e botões — consistência visual   |

### Integration Points

| System                  | Integration Method                                                              |
| ------------------------ | ---------------------------------------------------------------------------------- |
| Google Analytics (GA4)    | Novo evento `product_view` disparado dentro de `openProductModal`, via `track()`  |
| WhatsApp                  | Modal usa o mesmo `WA_NUMBER`/`waUrl()` já configurado — nenhuma nova configuração |

---

## Components

### Cards de produto (`.product-card`)

- **Purpose**: exibir oferta resumida no grid do catálogo e servir de gatilho para abrir a ficha
- **Location**: `index.html`, dentro de `<section id="produtos">`
- **Interfaces (atributos `data-*` por card)**:
  - `data-title` — nome do produto
  - `data-price` — preço final (número, ex. `"7699"`)
  - `data-price-original` — preço riscado (opcional)
  - `data-installments` — texto de parcelamento (opcional, ex. `"12x de R$ 641,58"`)
  - `data-condition` — `novo` | `seminovo` | `lacrado` (opcional)
  - `data-urgency` — texto livre do selo de urgência, ex. `"Última unidade"` (opcional)
  - `data-images` — lista de URLs separadas por vírgula (galeria da ficha)
  - `data-wa-text` — mensagem pré-preenchida específica do produto (reaproveita o padrão já existente)
- **Dependencies**: CSS de selos (`.tag-novo`, `.tag-seminovo`, `.tag-lacrado`, `.tag-promo`, `.tag-urgencia`)
- **Reuses**: estrutura de card já existente (`.card`), variáveis CSS já existentes

### Modal de ficha de produto (`#productModal`)

- **Purpose**: mostrar detalhe do produto clicado, com galeria e CTA de WhatsApp
- **Location**: `index.html`, um único bloco fixo próximo ao fim do `<body>` (fora de `<main>`, para evitar problemas de `overflow`/`z-index` das seções)
- **Interfaces (funções JS)**:
  - `openProductModal(cardEl: HTMLElement): void` — lê os `data-*` do card e popula o modal
  - `closeProductModal(): void` — esconde o modal e restaura o scroll do `body`
  - `renderTags(product): string` — gera o HTML dos selos a partir de `data-condition`/`data-urgency`/desconto calculado
- **Dependencies**: `waUrl()`, `track()` (ambos já existentes no script final)
- **Reuses**: paleta de cores e tipografia do `<style>` global; mesmo ícone SVG de WhatsApp já usado nos outros CTAs

### Selos/tags (`.tag-*`)

- **Purpose**: comunicar condição e urgência de forma escaneável
- **Location**: CSS novo dentro do `<style>` existente (mesma seção de componentes)
- **Interfaces**: classes `.tag`, `.tag-novo`, `.tag-seminovo`, `.tag-lacrado`, `.tag-promo`, `.tag-urgencia`
- **Dependencies**: variáveis CSS existentes (`--accent`, cores de sucesso/alerta a definir)
- **Reuses**: `--radius` para o formato de pílula, já usado em outros botões

---

## Data Models

Não há modelo de dados em banco — o "modelo" é a convenção de atributos `data-*` no HTML, documentada acima. Isso mantém consistência com `CONVENTIONS.md` (sem build, sem JSON externo nesta v1).

```html
<!-- Exemplo de card seguindo o modelo -->
<article class="card product-card reveal"
  data-title="iPhone 13 128GB"
  data-price="3199"
  data-price-original="3799"
  data-installments="ou 10x de R$ 319,90"
  data-condition="seminovo"
  data-urgency="Últimas 2 unidades"
  data-images="static/produtos/iphone13-1.jpg,static/produtos/iphone13-2.jpg"
  data-wa-text="Olá! Tenho interesse no iPhone 13 128GB (seminovo) por R$ 3.199.">
  ...
</article>
```

---

## Error Handling Strategy

| Error Scenario                                   | Handling                                                          | User Impact                                   |
| --------------------------------------------------- | --------------------------------------------------------------------- | ------------------------------------------------ |
| Card sem `data-images`                              | `renderTags`/`openProductModal` usa a imagem do card como fallback única | Ficha mostra 1 foto em vez de galeria, sem erro   |
| JS falha ao carregar                                | Cards continuam visíveis (HTML+CSS puro); apenas o clique não abre modal | Catálogo continua legível e comprável via CTA do card, se cada card também tiver um `data-wa-text` direto |
| Clique duplo/rápido em cards diferentes             | `openProductModal` sempre limpa o conteúdo anterior antes de popular o novo | Nunca há sobreposição de dois produtos no modal   |

---

## Tech Decisions (only non-obvious ones)

| Decision                                             | Choice                                                  | Rationale                                                                 |
| ------------------------------------------------------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Um modal reaproveitável vs. N modais por produto         | Um único `#productModal` populado via JS                  | Menos HTML duplicado, mais fácil de manter dentro de um arquivo único, mais rápido de implementar nas 7h combinadas |
| Dados do produto em `data-*` vs. JSON externo             | `data-*` no próprio card                                   | Mantém o projeto sem build/fetch; catálogo dinâmico via JSON fica para uma fase futura (ver `STATE.md` → Deferred Ideas) |
| Tags de urgência manuais vs. calculadas                   | Manuais via `data-urgency` no HTML                          | Não há estoque real integrado — decisão de marketing (quais produtos merecem urgência) fica nas mãos do lojista |
