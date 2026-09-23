# Concerns

**Analyzed:** 2026-09-18

## Configuration

### Número de WhatsApp é placeholder

**Location:** `static/js/common.js` — `var WA_NUMBER = "5511999999999";` (+ links `<noscript>` em `index.html` e `produto.html`)
**Risk:** Alto — todo CTA do site (a razão de existir da página) aponta para um número de exemplo. Se publicado assim, 100% dos leads se perdem.
**Fix:** Substituir pelo número real da JC Iphones antes de qualquer publicação. Deve ser a primeira tarefa de qualquer feature que toque o arquivo.

### Horário de atendimento desatualizado — RESOLVIDO (2026-09-23)

Todas as ocorrências agora dizem "8h às 18h".

## Assets

### `pagina_iphone.html` (1.6MB) na raiz do repositório

**Location:** `/pagina_iphone.html`
**Risk:** Baixo/médio — era a referência visual do site antigo (apple.com/br), hoje substituída pela referência iPortess. Não é servida, mas polui o repositório e pode confundir quem abrir o projeto pensando que é uma página ativa.
**Fix:** Mover para fora do repo ou remover após confirmar que não é mais necessária como referência.

## Test Coverage

### Nenhum teste automatizado

**Location:** projeto inteiro
**Risk:** Baixo para o tamanho atual (site estático, sem lógica de negócio complexa), mas cresce se o catálogo passar a ter dados dinâmicos (ex.: JSON de produtos, filtros, carrinho).
**Fix:** Não é urgente hoje. Se o catálogo evoluir para dados dinâmicos, introduzir testes de unidade para a função de montagem de URL do WhatsApp e para os filtros/tags do catálogo.

## Performance

### Imagens sem otimização/lazy loading confirmados

**Location:** `static/banner*.jpg` (até 1.4MB cada)
**Risk:** Médio — impacta diretamente o requisito de mobile-first, já que a maioria do público acessa por celular com conexão variável.
**Fix:** Comprimir imagens e aplicar `loading="lazy"` nas abaixo da dobra (já rastreado como sugestão aprovada na proposta comercial — ver `catalogo-e-ficha-produto/spec.md`).

## Scaling Limits

### Catálogo hardcoded no HTML — RESOLVIDO (2026-09-23)

O catálogo agora vem de `data/catalogo.json`. Novo risco: edição manual do JSON (vírgula sobrando, campo errado). Mitigação: `node --test` valida o arquivo e as fotos; em produção, produto inválido é descartado com aviso no console, sem derrubar o catálogo.

### SEO das fichas de produto

**Location:** `produto.html?p=<slug>`
**Risk:** Médio — a ficha é renderizada no navegador; o Google indexa pior que páginas estáticas por produto (como faz a iPortess).
**Fix:** se SEO de cauda longa virar prioridade, gerar páginas estáticas por produto com um script de build (ver Deferred Ideas em `STATE.md`).

### Fotos dos produtos são placeholders

**Location:** `static/produtos/**.svg` + `data/catalogo.json` de exemplo
**Risk:** Alto para publicação — preços, produtos e fotos são fictícios.
**Fix:** substituir pelo catálogo real antes do deploy (Todo em `STATE.md`).

### Menu mobile: ícone não trocava após o 1º toque — RESOLVIDO (2026-09-23)

Corrigido na extração para `common.js` (troca do `innerHTML` do botão em vez do `outerHTML` do ícone).
