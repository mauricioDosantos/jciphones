# JC Iphones — Site de Vendas

**Vision:** Transformar o site institucional da JC Iphones em uma vitrine de conversão no padrão iPortess (catalogo.iportess.com), com catálogo de ofertas, ficha de produto, tags de urgência e caminho direto para fechamento de venda via WhatsApp.
**For:** Clientes finais de José de Freitas - PI que buscam comprar iPhones novos/seminovos e acessórios Apple, majoritariamente pelo celular.
**Solves:** Hoje o site é informativo e não guia o visitante até a compra; não há senso de urgência, ficha de produto ou um link único para a bio do Instagram. O dono da loja também não tem visibilidade de como o site é usado.

## Goals

- [ ] Converter visitante em conversa qualificada no WhatsApp — meta: todo produto tem um caminho de no máximo 2 cliques até o WhatsApp
- [ ] Reduzir tempo gasto pela equipe respondendo dúvidas repetitivas — meta: tags, ficha de produto e horário visível cobrem as perguntas mais comuns
- [ ] Ter visibilidade de uso do site — meta: relatório mensal de acessos, cliques e engajamento via GA4 (já implementado)

## Tech Stack

**Core:**

- Framework: nenhum — HTML/CSS/JS estático
- Language: HTML5, CSS3, JavaScript (vanilla)
- Hospedagem: GitHub Pages

**Key dependencies:**

- Google Analytics 4 (gtag.js) — telemetria de uso
- Google Fonts (Instrument Sans) — tipografia
- WhatsApp (`wa.me`) — canal único de conversão
- Google Maps embed — localização

## Scope

**v1 includes (combinado com o cliente — 7h desenvolvimento + 2h publicação):**

- Catálogo alimentado por JSON estático (`data/catalogo.json`) + imagens em `static/produtos/` — **ampliado em AD-004**
- Abas Dispositivos / Acessórios, busca por nome, ordenação (menor/maior preço, mais recente) e filtros (preço, linha, condição) — **ampliado em AD-004**
- Cards com preço, desconto, parcelamento e selos de condição/urgência
- Ficha do produto em tela própria (`produto.html?p=slug`) com especificações, botão verde "Garantir sua unidade" (WhatsApp) e "Você também pode gostar"
- Destaque das vantagens: garantia (1 ano fábrica ou 6 meses loja), pagamento (pix ou cartão), entrega/retirada (combinar no WhatsApp)
- Página link-na-bio com URL própria (`/bio/`) para colar no Instagram
- Horário de atendimento atualizado para 8h às 18h
- Responsividade mobile-first
- Monitoramento via Google Analytics (GA4) com eventos customizados — **já implementado nesta sessão**

**Explicitly out of scope (v1):**

- Painel admin / CMS / backend (o catálogo é um JSON estático editado à mão)
- Login/área do cliente (não existe conceito de conta de usuário no site)
- Carrinho de compras / checkout — toda venda fecha via conversa no WhatsApp

## Constraints

- Timeline: orçado em 7h de desenvolvimento + 2h de publicação (plano contratado pelo cliente — ver proposta comercial)
- Technical: sem framework/build step — HTML/CSS/JS vanilla; páginas `index.html`, `produto.html`, `bio/index.html`, dados em `data/catalogo.json`, imagens em `static/` (AD-004)
- Resources: qualquer funcionalidade que ultrapasse as horas combinadas é orçada à parte (mesma regra do documento de orçamento)
