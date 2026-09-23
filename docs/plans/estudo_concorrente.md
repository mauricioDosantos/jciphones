# Estudo de Concorrente — iPortess (iportess.com)

> Análise realizada em 22/09/2026 via fetch remoto do site público (HTML renderizado, bundle JS/CSS compilado, sitemap.xml e robots.txt). Concorrente direto do JC Iphones (mesmo segmento: venda de iPhones novos/seminovos + acessórios + assistência técnica).

## Visão geral do projeto

**Url concorrente:** [iportess.com](https://iportess.com)

**Produto:** E-commerce/vitrine de smartphones (majoritariamente iPhones) novos e seminovos, com acessórios Apple e de terceiros (fontes, fones, caixas de som) e assistência técnica. Funciona como catálogo digital com fechamento de venda via WhatsApp (não há checkout online).

**Objetivo principal:** Gerar contato via WhatsApp a partir de um catálogo de produtos navegável, com preço, condição e estoque exibidos por item. CTA dominante: **"Garantir agora"** / **"Falar no WhatsApp"**, com mensagem pré-preenchida contendo o nome e preço do produto (mesmo padrão usado no JC Iphones via `data-wa-text`).

**Público-alvo:** Consumidores de Teresina e Campo Maior (PI) interessados em iPhone com preço mais baixo que o oficial (novos lacrados com desconto e seminovos com % de bateria informado), sensíveis a urgência/escassez ("Apenas 1 unidade disponível").

**Tom de comunicação:** Premium/Apple-like, mas com gatilhos agressivos de conversão (desconto percentual explícito, contador de estoque, "exclusividade"). Frase de assinatura: *"Onde exclusividade encontra tecnologia"*.

**Diferencial central:** Catálogo estruturado como banco de dados real (produtos individuais com slug próprio, preço, % de desconto, saúde da bateria, estoque) em vez de cards estáticos — ou seja, competem com **profundidade de catálogo e senso de urgência/escassez**, enquanto o JC Iphones hoje (`index.html`) é uma landing page única com 6 categorias genéricas e sem produtos individuais nem preços.

---

## Funcionalidades e quais problemas resolvem

| Funcionalidade | Problema que resolve |
|---|---|
| Catálogo com produto individual (`/catalogo/:slug`) | Cliente não precisa perguntar preço/condição no WhatsApp antes de decidir — reduz atrito e filtra leads mais qualificados |
| Filtro por categoria (iPhones, MacBooks, Apple Watch, SmartWatch, Tablet, Notebook, Caixa de som) e ordenação por preço | Facilita achar o aparelho certo em um catálogo maior que uma landing simples |
| Selo de condição ("Lacrado"/"Excelente") + % de bateria + capacidade de armazenamento | Transparência técnica, reduz objeção de compra em seminovos |
| Contador de estoque ("Apenas 1 unidade disponível") | Gatilho de urgência/escassez para acelerar decisão |
| Preço "de/por" com % de desconto | Ancoragem de valor, percepção de oportunidade |
| Painel admin (`/admin`, `/admin/login`) sobre Supabase | Permite ao lojista atualizar catálogo, preço e estoque sem mexer em código — escalável para dezenas de produtos |
| Produtos relacionados ("Você também pode gostar") | Cross-sell / upsell dentro da própria página de produto |
| CTA WhatsApp com mensagem pré-preenchida por produto | Mesma estratégia do JC Iphones, mas aqui contextualizada por item específico (maior taxa de resposta) |

---

## Casos de uso do produto

1. **Descoberta → Catálogo → Produto → WhatsApp (fluxo principal de conversão)**
   Home (`/`) → clique em CTA ou navegação → `/catalogo` → filtro por categoria/ordenação → clique em produto → `/catalogo/:slug` → leitura de specs/preço/estoque → clique em "Garantir agora" → abre WhatsApp com mensagem pré-preenchida (produto + preço) → conversa comercial fora do site.

2. **Fluxo de venda direta (SEO/Google)**
   Cada produto tem URL própria, prioridade individual no `sitemap.xml` e `<title>` dedicado — indica estratégia de SEO de cauda longa (ex.: alguém busca "iphone 15 seminovo teresina" cai direto na página do produto, não na home).

3. **Fluxo de gestão interna (lojista)**
   `/admin/login` → autenticação (provavelmente Supabase Auth) → `/admin` → CRUD de produtos (preço, estoque, condição, fotos) refletido automaticamente no catálogo público. Indica backend real (Supabase = Postgres + Auth + Storage), diferente do site estático do JC Iphones.

4. **Fluxo de confiança/local**
   Seções institucionais (garantia iPortess, formas de pagamento, localização) reduzem objeção antes do contato — mesmo racional das seções "Diferenciais" e "Contato" do JC Iphones.

---

## Especificação Técnica

### Tecnologias

- **Frontend:** React (SPA) — `react-*.js` em chunk separado, roteamento client-side (rotas `/`, `/catalogo`, `/catalogo/:slug`, `/admin`, `/admin/login`)
- **Build tool:** Vite (arquivos com hash de conteúdo: `index-CgxEZCZZ.js`, `index-BdCUoike.css`, `modulepreload` de chunks separados)
- **Animações:** Framer Motion (`motion-BVu37fX-.js` como chunk dedicado)
- **Backend/BaaS:** Supabase (`supabase-SRSXtynz.js` como chunk dedicado; preconnect/dns-prefetch para `pzcvoapzxqpambfucuej.supabase.co`) — provável uso de Postgres para catálogo + Auth para `/admin` + Storage para imagens de produto
- **Estilização:** Tailwind CSS (classes utilitárias visíveis no CSS compilado: `text-2xl`, `font-mono`, cores em formato `#hex` com opacidade embutida tipo `#10b98133`) provavelmente combinado com shadcn/ui (padrão comum nesse stack)
- **Tipografia:** fontes `DM Sans` (texto) e `Geist` (provavelmente títulos/UI), carregadas sem Google Fonts explícito no CSS — possivelmente self-hosted/variable font embutida
- **Analytics/Tracking:**
  - Google Analytics 4 via `gtag.js` (measurement ID `G-CJC0B2TQ4G`), carregado de forma lazy (só após primeira interação: `pointerdown`, `keydown`, `scroll`, ou `requestIdleCallback`/`load+3s`) — otimização de performance (não bloqueia LCP)
  - Script adicional `/~flock.js` com `data-proxy-url="/~api/analytics"` — nome e padrão sugerem uma ferramenta de analytics/anti-fraude proxied pelo próprio domínio (evita bloqueadores de anúncio); origem não confirmável sem inspecionar o script em runtime
- **SEO estruturado:** JSON-LD `schema.org/LocalBusiness` no `<head>` com nome, descrição, URL e telefone — o JC Iphones **não tem** isso hoje
- **Meta tags completas:** Open Graph + Twitter Card com imagem OG hospedada em Cloudflare R2 (`pub-*.r2.dev`), indício de que o site foi gerado/hospedado via **Lovable** (`id-preview-...lovable.app` no nome do arquivo de imagem OG) — plataforma no-code/AI de geração de apps React+Supabase
- **Hospedagem:** provável Vercel/Netlify/Cloudflare Pages (padrão de build Vite com asset hashing) + domínio próprio

### Paleta de Cores

Tema **escuro** (dark-first), diferente do JC Iphones que é claro (fundo branco `#ffffff`):

| Cor | Uso provável |
|---|---|
| `#0f0f0f` / `#000000` (via `#0000` alpha) | Fundo principal dark |
| `#fff` / `#ffffff` (com variações de opacidade: `eb`, `e6`, `b3`, `80`, `4d`, `26`, `1a`, `0d`, `0a`) | Texto e camadas translúcidas sobre o fundo escuro (glassmorphism) |
| `#f5f5f7` / `#f0f0f0` | Superfícies claras secundárias (cards, contraste pontual) — mesmo tom "Apple gray" usado no JC Iphones (`--bg-secondary: #f5f5f7`) |
| `#10b981` (com alphas `33`) | **Verde** — provavelmente selo de "disponível"/confiança/sucesso |
| `#fbbf24` / `#f59e0b` (com alphas `b3`, `99`, `1a`, `33`) | **Âmbar/dourado** — provavelmente badges de desconto, urgência ("apenas 1 unidade"), destaque de preço |
| `#9ca3af` | Cinza neutro — texto secundário |
| `#c8c8c8` (com alphas) | Cinza claro — bordas/divisores |

Não há indício de um azul "accent" tipo Apple (`#0071e3`, usado no JC Iphones) — a iPortess aposta em **preto + âmbar/dourado + verde**, uma paleta mais "premium/luxo + urgência" do que a estética Apple oficial que o JC Iphones replica.

### Tipografia

- **DM Sans** — fonte principal de texto/corpo (geometric sans, moderna, boa legibilidade)
- **Geist** — usada em conjunto (provavelmente títulos, UI, números de preço — é a fonte oficial da Vercel, comum em produtos "tech/SaaS")
- Fallback: `system-ui, sans-serif`
- Fonte monoespaçada disponível (`font-mono`) para elementos técnicos (specs, códigos)

Comparação: o JC Iphones usa **Instrument Sans** única, via Google Fonts CDN. A iPortess usa uma dupla de fontes mais "tech/startup" (DM Sans + Geist) em vez da estética "Apple-clone".

### Arquitetura da Página

**Rotas identificadas (via sitemap.xml + bundle JS):**

```
/                                          → Home institucional
/catalogo                                 → Listagem/catálogo completo
/catalogo/:slug                           → Página de produto individual
/admin                                    → Painel administrativo (protegido)
/admin/login                              → Login do painel
```

**Produtos catalogados no sitemap (29 itens), por categoria:**

- **iPhones novos:** iphone-17, iphone-17-pro-max, iphone-16, iphone-15
- **iPhones seminovos:** iphone-12-seminovo, iphone-13-seminovo, iphone-13-pro-max-seminovo, iphone-14-seminovo, iphone-14-pro-max, iphone-14-pro-max-seminovo, iphone-15-seminovo, iphone-15-pro-seminovo, iphone-15-pro-max-seminovo, iphone-16-pro-seminovo, iphone-16-pro-max-seminovo, iphone-17-pro-seminovo
- **Apple Watch:** apple-watch-series-11-46mm, apple-watch-series-11-42mm, apple-watch-series-3-44mm
- **Notebook:** macbook-neo-silver
- **Tablet:** tablet-redmi-pad-2 (não-Apple)
- **Áudio:** airpods-max-linha-1-c-case, realme-t200-fone-sem-fio, caixa-waaw-beat-1000-by-alok
- **Acessórios/carregadores:** fonte-gshild-25w-type-c, fonte-gshild-20w-type-c, fonte-orignal-apple

**Estrutura da Home (ordem das seções):**
1. Header/nav + logo
2. Hero com imagem de destaque e proposta de valor
3. CTA primário → WhatsApp
4. Bloco "catálogo em destaque" → link para `/catalogo`
5. Links sociais (Instagram) e localização (Google Maps)
6. Footer com copyright

**Estrutura da página `/catalogo`:**
1. Título "Catálogo de iPhones e Acessórios em Teresina e Campo Maior"
2. Subtítulo "Onde exclusividade encontra tecnologia"
3. Filtro por categoria: Todos, iPhones, MacBooks, Apple Watch, SmartWatch, Tablet, Notebook, Caixa de som
4. Ordenação (ex.: "Menor preço")
5. Grid de cards de produto
6. Badges informativos fixos: "Garantia iPortess", "Formas de pagamento"
7. CTA WhatsApp

**Estrutura da página de produto (`/catalogo/:slug`):**
1. Navegação de volta ao catálogo (breadcrumb simples) + botão de compartilhar
2. Imagem principal do produto (cor específica, ex. "Cosmic Orange")
3. Título do produto + selo de condição ("Lacrado"/"Excelente")
4. Preço "de/por" com % de desconto
5. Specs-chave: capacidade de armazenamento, saúde da bateria
6. Aviso de estoque baixo ("Apenas 1 unidade disponível")
7. CTA "Garantir agora" → WhatsApp com mensagem pré-preenchida (produto + preço)
8. Seção "Você também pode gostar" (relacionados)

### Fraseologia

**Meta/SEO:**
- Title: "iPortess | Smartphones Novos e Seminovos"
- Description: "iPortess — venda de smartphones novos, seminovos. Confira nosso catálogo e entre em contato."
- OG Title: "iPortess | iPhones novos e seminovos no Piauí"
- Twitter Title: "iPortess | Smartphones Novos e Seminovos"

**Home:**
- Headline: "iPortess — iPhones novos e seminovos em Campo Maior e Teresina - PI"
- Tagline: "iPhones novos & seminovos | acessórios exclusivos ⚡ suporte dedicado"
- CTAs: "Entre em contato" / "Fale conosco pelo WhatsApp para tirar dúvidas e fazer pedidos"; "Veja o nosso catálogo" / "Confira todos os nossos smartphones disponíveis"; "Nosso Instagram"; "Ver localização"
- Footer: "© 2026 iPortess — Todos os direitos reservados"

**Catálogo:**
- "Catálogo de iPhones e Acessórios em Teresina e Campo Maior — iPortess"
- "Onde exclusividade encontra tecnologia"
- "Uma seleção exclusiva de aparelhos revisados, testados e com a qualidade Apple que você merece"

**Produto (exemplo iPhone 17 Pro Max):**
- Preço: R$ 7.699,00 (de R$ 9.900,00, -22%)
- "Lacrado" / "Excelente"
- "256GB" / "Bateria 100%"
- "Apenas 1 unidade disponível"
- CTA: "Garantir agora"
- "Você também pode gostar"

### SEO

**Palavras-chave-alvo identificadas (meta keywords + estrutura de URL/sitemap):**
- iPortess (marca)
- smartphones
- celulares
- seminovos
- novos
- assistência técnica
- iphone + modelo (ex. "iphone 15 seminovo", "iphone 17 pro max") — cauda longa via slug de produto
- Geolocalização: "Teresina", "Campo Maior - PI"

**Pontos fortes de SEO técnico observados:**
- `robots.txt` liberando todos os bots relevantes (Googlebot, Bingbot, Twitterbot, facebookexternalhit) + referência ao sitemap
- `sitemap.xml` completo com todas as 29 páginas de produto individualmente priorizadas (0.7) e catálogo com prioridade 0.9
- JSON-LD `LocalBusiness` (rich snippet de negócio local no Google)
- Open Graph + Twitter Card completos com imagem dedicada
- `google-site-verification` configurado (Search Console ativo)
- URLs amigáveis e descritivas por produto (`/catalogo/iphone-16-pro-max-seminovo`)

Sem acesso a ferramentas externas de rank tracking (Semrush/Ahrefs) não é possível confirmar posição real nos resultados de busca para estes termos — a análise acima é estrutural (o que o site está *otimizado para ranquear*), não uma medição de posição atual.

---

## KPIs do projeto

Não há dashboards públicos, mas a instrumentação do JC Iphones (nosso próprio site, via `gtag`) sugere quais métricas a iPortess provavelmente também rastreia com GA4 + o script `/~flock.js`:

- **Cliques em WhatsApp por origem** (home, catálogo, produto) — funil de conversão por página
- **Visualização de seção/página** (scroll depth, tempo na página) — engajamento
- **Taxa de clique por produto** (qual modelo mais gera contato) — usada para priorizar estoque
- **Origem de tráfego orgânico por slug de produto** — validação do investimento em SEO de cauda longa
- **Taxa de conversão catálogo → WhatsApp** — eficácia do funil "browse antes de falar"

---

## Pontos de melhoria (identificados na análise, e oportunidades para o JC Iphones)

1. **Catálogo real com preço, estoque e condição por produto** — a iPortess expõe preço e diferencial (bateria, armazenamento, desconto) direto no site; o JC Iphones hoje é só uma landing institucional sem catálogo navegável nem preços, o que gera mais fricção (cliente precisa perguntar tudo no WhatsApp).
2. **URLs individuais por produto + sitemap dinâmico** — forte para SEO de cauda longa ("iphone X seminovo + cidade"); o JC Iphones não tem páginas de produto indexáveis.
3. **JSON-LD LocalBusiness ausente no JC Iphones** — fácil de replicar, melhora rich snippets no Google (nome, endereço, telefone, horário já estão na página).
4. **Gatilhos de urgência/escassez** ("apenas 1 unidade disponível", % de desconto) ausentes no JC Iphones — podem aumentar conversão, mas exigem manter estoque real atualizado (risco de credibilidade se ficar desatualizado).
5. **Painel admin próprio (Supabase)** — permite à iPortess atualizar catálogo sem depender de deploy de código; o JC Iphones é HTML estático puro, então qualquer alteração de produto exige editar `index.html` manualmente. Se o catálogo crescer, vale considerar um backend simples (mesmo que não seja Supabase) para o JC Iphones.
6. **Carregamento de analytics adiado até interação** (evita penalizar LCP) — boa prática de performance que o JC Iphones ainda não usa (o `gtag.js` do JC Iphones carrega `async` mas sem o mesmo adiamento condicionado a interação).
7. **Ponto de atenção/risco na iPortess:** o script `/~flock.js` com proxy de analytics em rota própria (`/~api/analytics`) não é claramente identificável — pode ser uma ferramenta legítima de anti-adblock analytics, mas também pode ser um risco de privacidade/dependência de terceiro não documentado; vale como alerta a não copiar sem entender a origem.
8. **Paleta escura + dourado/âmbar** transmite "loja premium/exclusiva"; o JC Iphones usa a estética clara "Apple-clone" — não é necessariamente uma melhoria, mas é um diferencial de posicionamento visual que vale considerar testar (ex.: uma seção dark para "ofertas" gerar mais contraste/urgência, como o JC Iphones já esboça com `.card-dark`).
