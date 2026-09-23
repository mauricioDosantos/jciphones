# Concerns

**Analyzed:** 2026-09-18

## Configuration

### Número de WhatsApp é placeholder

**Location:** `index.html` — `var WA_NUMBER = "5511999999999";`
**Risk:** Alto — todo CTA do site (a razão de existir da página) aponta para um número de exemplo. Se publicado assim, 100% dos leads se perdem.
**Fix:** Substituir pelo número real da JC Iphones antes de qualquer publicação. Deve ser a primeira tarefa de qualquer feature que toque o arquivo.

### Horário de atendimento desatualizado

**Location:** `index.html` — hero trust badge exibe "Seg a dom, 7h às 18h"
**Risk:** Médio — diverge do horário acordado com o cliente (8h às 18h), gera expectativa errada.
**Fix:** Atualizar texto para refletir 8h às 18h (rastreado em `pagina-inicio-bio/spec.md`).

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

### Catálogo hardcoded no HTML

**Location:** seção `#produtos` de `index.html`
**Risk:** Baixo hoje (poucos produtos), mas cada produto novo exige editar HTML diretamente — não há fonte de dados única (JSON/CMS).
**Fix:** Fora do escopo das 7h de desenvolvimento combinadas com o cliente. Registrado como ideia futura em `project/STATE.md` (Deferred Ideas) para quando o catálogo crescer.
