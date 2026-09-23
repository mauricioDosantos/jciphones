# Catálogo e Ficha de Produto Specification

> **Revisão 2026-09-23 (AD-004):** substitui a versão de 2026-09-18, que mantinha produtos hardcoded em `data-*` no HTML e deixava filtros fora do escopo. Agora o catálogo é alimentado por um JSON estático, tem busca/ordenação/filtros e a ficha é uma tela própria. Design e tasks antigos foram movidos para `_superseded/`.

## Problem Statement

O `#produtos` atual mostra 6 cards genéricos de categoria, sem produto individual, preço ou condição — toda dúvida básica vai para o WhatsApp. O concorrente (iPortess, ver `docs/plans/estudo_concorrente.md`) resolve isso com um catálogo navegável por produto e uma ficha com CTA direto. Queremos o mesmo, mantendo o site estático (GitHub Pages, sem backend) e permitindo que o lojista atualize produtos editando um único arquivo JSON.

## Goals

- [ ] Todo produto à venda aparece no catálogo com foto, nome, preço e condição, lido de um único `data/catalogo.json`
- [ ] Visitante encontra o aparelho certo em até 3 interações (aba + busca/filtro + clique)
- [ ] Todo produto tem no máximo 2 cliques até o WhatsApp (card → ficha → "Garantir sua unidade")
- [ ] Adicionar/editar/remover um produto exige só editar o JSON e subir as imagens em `static/produtos/` — nenhuma mudança em HTML/JS

## Out of Scope

| Feature                                  | Reason                                                                 |
| ---------------------------------------- | ---------------------------------------------------------------------- |
| Painel admin / CMS / backend (Supabase)  | JSON estático editado à mão atende o volume atual; admin fica para fase futura |
| Carrinho / checkout / pagamento online   | Toda venda fecha no WhatsApp                                            |
| Controle de estoque automático           | Estoque é um campo manual no JSON                                        |
| Avaliações de clientes                    | Não pedido                                                              |
| Página HTML pré-renderizada por produto (SEO por slug) | Exige build step; a ficha é uma página única que lê o slug da URL. Ver "Riscos" |
| Busca por texto em especificações/descrição | Busca cobre só o nome do produto, conforme pedido                      |

---

## Fonte de dados (contrato do JSON)

Arquivo: `data/catalogo.json`. Imagens: `static/produtos/<slug>/<arquivo>`.
O formato exato é refinado no design; o spec exige apenas que estes dados existam por produto:

| Campo           | Obrigatório | Uso                                                                      |
| --------------- | ----------- | ------------------------------------------------------------------------ |
| `slug`          | sim         | Identificador único e URL da ficha (`iphone-13-128gb-seminovo`)           |
| `nome`          | sim         | Título do card/ficha; alvo da busca                                       |
| `grupo`         | sim         | `dispositivo` \| `acessorio` — abas "Dispositivos"/"Acessórios"          |
| `tipo`          | sim         | `iphone`, `notebook`, `caixa-de-som`, `fone`, `capa`, `apple-watch`, `carregador`, … |
| `linha`         | não         | Linha do aparelho para o filtro (ex.: `iPhone 13`, `iPhone 15`, `MacBook Air`) |
| `condicao`      | sim         | `novo` \| `seminovo`                                                     |
| `preco`         | sim         | Preço de venda (número, em reais)                                         |
| `precoOriginal` | não         | Preço "de" riscado; desconto % é calculado                                |
| `parcelamento`  | não         | Texto livre (ex.: `12x de R$ 641,58`)                                     |
| `imagens`       | sim (≥1)    | Caminhos em `static/produtos/`; a primeira é a capa do card              |
| `especificacoes`| não         | Lista de pares rótulo/valor (Armazenamento, Bateria, Cor, Tela…)         |
| `estoque`       | não         | Número; 0 esconde o produto, 1–2 mostra selo de urgência                  |
| `adicionadoEm`  | sim         | Data (AAAA-MM-DD) usada na ordenação "Mais recente"                      |
| `tags`          | não         | Selos livres extras (ex.: `Lacrado`, `Promoção`)                         |

Classificação acordada: **Dispositivos** = iPhone, notebook, caixa de som, tablet e similares. **Acessórios** = fone de ouvido, capa de celular, Apple Watch, carregador e similares.

---

## User Stories

### P1: Navegar no catálogo de produtos ⭐ MVP

**User Story**: Como visitante, quero ver os produtos disponíveis logo abaixo do título da página, com preço e condição, para decidir sem precisar perguntar no WhatsApp.

**Why P1**: É o núcleo do pedido; sem ele nada mais funciona.

**Acceptance Criteria**:

1. WHEN a página inicial carrega THEN o catálogo SHALL aparecer logo abaixo do título e subtítulo atuais do hero, substituindo a grade de categorias "O que você encontra aqui"
2. WHEN o catálogo carrega THEN o sistema SHALL ler `data/catalogo.json` e renderizar um card por produto com `estoque` diferente de 0
3. WHEN um card é renderizado THEN SHALL exibir imagem de capa, nome, selo de condição (Novo/Seminovo), preço em destaque e botão "Saiba mais"
4. WHEN o produto tem `precoOriginal` maior que `preco` THEN o card SHALL exibir o preço original riscado e o percentual de desconto
5. WHEN o produto tem `parcelamento` THEN o card SHALL exibir "ou {parcelamento}" abaixo do preço
6. WHEN o produto tem `estoque` 1 ou 2 THEN o card SHALL exibir o selo "Última unidade" / "Últimas 2 unidades"
7. WHEN a tela é de celular THEN o grid SHALL ter 2 colunas (≥ 360px) sem scroll horizontal; em desktop, 3–4 colunas

**Independent Test**: Com um JSON de 6+ produtos variados, abrir `index.html` via servidor local e conferir cada card contra o JSON, em mobile e desktop.

---

### P1: Alternar entre Dispositivos e Acessórios ⭐ MVP

**User Story**: Como visitante, quero separar aparelhos de acessórios com um toque, para não misturar iPhone com capinha.

**Acceptance Criteria**:

1. WHEN o catálogo é exibido THEN SHALL haver dois botões lado a lado, "Dispositivos" e "Acessórios", com "Dispositivos" ativo por padrão
2. WHEN o visitante toca em um dos botões THEN o grid SHALL mostrar apenas produtos daquele `grupo` e o botão SHALL ficar visualmente ativo
3. WHEN o grupo muda THEN busca, ordenação e filtros ativos SHALL continuar aplicados, e as opções de "Linha" SHALL refletir só as linhas existentes no grupo selecionado (filtros de linha que deixam de existir são limpos)

**Independent Test**: Alternar entre os botões e confirmar que nenhum produto do outro grupo aparece.

---

### P1: Abrir a ficha do produto e ir ao WhatsApp ⭐ MVP

**User Story**: Como visitante interessado, quero ver os detalhes do aparelho e falar com a loja com um clique, para garantir a unidade.

**Acceptance Criteria**:

1. WHEN o visitante clica no card (imagem/nome) ou no botão "Saiba mais" THEN o site SHALL abrir a tela de detalhes em `produto.html?p={slug}`
2. WHEN a ficha carrega THEN SHALL exibir: imagem(ns), nome, selo de condição, preço (com riscado/desconto e parcelamento quando houver) e a lista de especificações técnicas
3. WHEN a ficha é exibida THEN SHALL haver um botão verde chamativo "Garantir sua unidade", visível sem rolar em celular
4. WHEN o visitante clica em "Garantir sua unidade" THEN o site SHALL abrir o WhatsApp da loja (`WA_NUMBER`) com mensagem pré-preenchida contendo nome, condição e preço do produto
5. WHEN a ficha é exibida THEN SHALL haver um link "← Voltar ao catálogo" que retorna à home já posicionada no catálogo
6. WHEN o produto tem mais de uma imagem THEN o visitante SHALL poder alternar entre elas (miniaturas ou swipe)
7. WHEN a ficha carrega THEN o `<title>` da aba SHALL ser "{nome} | JC Iphones"

**Independent Test**: Clicar em 3 produtos diferentes, conferir dados contra o JSON e que o WhatsApp abre com a mensagem certa.

---

### P1: "Você também pode gostar" ⭐ MVP

**User Story**: Como visitante na ficha, quero ver outras opções parecidas, para comparar sem voltar ao catálogo.

**Acceptance Criteria**:

1. WHEN a ficha é exibida THEN abaixo do conteúdo principal SHALL haver a seção "Você também pode gostar" com até 4 produtos
2. WHEN os relacionados são escolhidos THEN SHALL priorizar produtos do mesmo `tipo`, depois do mesmo `grupo`, nunca incluindo o próprio produto nem itens com estoque 0
3. WHEN o visitante clica em um relacionado THEN SHALL abrir a ficha daquele produto
4. WHEN não há outros produtos disponíveis THEN a seção SHALL ser omitida

---

### P2: Buscar por nome e ordenar

**User Story**: Como visitante, quero digitar o modelo e ordenar por preço, para achar rápido o que cabe no meu bolso.

**Acceptance Criteria**:

1. WHEN o visitante digita no campo de busca THEN o grid SHALL mostrar apenas produtos cujo nome contenha o termo, ignorando maiúsculas/minúsculas e acentos, atualizando enquanto digita
2. WHEN o visitante escolhe uma ordenação THEN o grid SHALL reordenar por: "Menor preço", "Maior preço" ou "Mais recente" (`adicionadoEm` desc)
3. WHEN nenhuma ordenação foi escolhida THEN o padrão SHALL ser "Mais recente"

---

### P2: Filtrar por preço, linha e condição

**User Story**: Como visitante, quero filtrar por faixa de preço, linha do aparelho e condição, para ver só o que me interessa.

**Acceptance Criteria**:

1. WHEN o visitante toca em "Filtros" THEN SHALL abrir um painel (gaveta em mobile, painel/dropdown em desktop) com: Preço (mínimo e máximo), Linha do aparelho (múltipla escolha, opções geradas do JSON) e Condição (Novo, Seminovo)
2. WHEN filtros são aplicados THEN o grid SHALL mostrar apenas produtos que atendam a todos os filtros ativos combinados com busca e grupo
3. WHEN há filtros ativos THEN o botão "Filtros" SHALL indicar a quantidade ativa (ex.: "Filtros (2)") e SHALL haver ação "Limpar filtros"
4. WHEN o visitante não preenche o preço mínimo ou máximo THEN aquele limite SHALL ser ignorado

**Independent Test**: Combinar aba + busca + preço + linha + condição e conferir o resultado contra o JSON filtrado manualmente.

---

### P3: Manter o estado do catálogo ao voltar da ficha

**User Story**: Como visitante, quero voltar da ficha e encontrar o catálogo com os mesmos filtros, para continuar comparando.

**Acceptance Criteria**:

1. WHEN o visitante aplica aba/busca/ordem/filtros THEN o estado SHALL ser refletido na URL (query string ou hash)
2. WHEN o visitante volta da ficha (botão voltar do navegador ou "Voltar ao catálogo") THEN o catálogo SHALL restaurar o mesmo estado

---

## Edge Cases

- WHEN busca/filtros não retornam nenhum produto THEN o grid SHALL mostrar "Nenhum produto encontrado" + botão "Limpar filtros" + CTA "Não achou? Fale com a gente no WhatsApp"
- WHEN `data/catalogo.json` falha ao carregar ou está malformado THEN o catálogo SHALL mostrar mensagem amigável com CTA de WhatsApp, e o resto da página SHALL continuar funcionando
- WHEN `produto.html` é aberto sem `?p=` ou com slug inexistente/estoque 0 THEN SHALL exibir "Produto não encontrado ou já vendido" com link para o catálogo e CTA de WhatsApp
- WHEN uma imagem não carrega THEN SHALL exibir um placeholder neutro, sem quebrar o layout do card
- WHEN um produto não tem `especificacoes` THEN a seção de especificações SHALL ser omitida (não exibida vazia)
- WHEN um produto não tem `linha` THEN ele SHALL continuar aparecendo sem filtro de linha, mas SHALL ser excluído quando algum filtro de linha estiver ativo
- WHEN o preço mínimo informado é maior que o máximo THEN o sistema SHALL trocar os valores entre si
- WHEN o nome do produto é muito longo THEN o card SHALL truncar em 2 linhas sem quebrar o grid

---

## Requirement Traceability

| Requirement ID | Story                                   | Phase  | Status  |
| -------------- | --------------------------------------- | ------ | ------- |
| CAT-01         | P1: JSON estático + imagens em static   | Tasks | In Tasks |
| CAT-02         | P1: catálogo abaixo do hero, cards      | Tasks | In Tasks |
| CAT-03         | P1: preço/desconto/parcelamento/urgência | Tasks | In Tasks |
| CAT-04         | P1: abas Dispositivos / Acessórios       | Tasks | In Tasks |
| CAT-05         | P1: ficha em `produto.html?p=slug`       | Tasks | In Tasks |
| CAT-06         | P1: botão verde "Garantir sua unidade" → WhatsApp | Tasks | In Tasks |
| CAT-07         | P1: "Você também pode gostar"            | Tasks | In Tasks |
| CAT-08         | P2: busca por nome                       | Tasks | In Tasks |
| CAT-09         | P2: ordenação menor/maior preço, recente | Tasks | In Tasks |
| CAT-10         | P2: filtros preço/linha/condição         | Tasks | In Tasks |
| CAT-11         | P3: estado do catálogo na URL            | Tasks | In Tasks |
| CAT-12         | Edge: vazio / erro / slug inválido       | Tasks | In Tasks |

**Coverage:** todos os requisitos mapeados em `catalogo-e-ficha-produto/tasks.md`

---

## Riscos / notas para o design

- **`fetch()` não funciona via `file://`** — testes locais precisam de servidor (`python3 -m http.server`). No GitHub Pages funciona normalmente.
- **SEO por produto fica limitado**: como a ficha é gerada no navegador a partir de `?p=slug`, o Google indexa pior que as páginas por slug da iPortess. Aceitável na v1; revisitar se SEO de cauda longa virar prioridade.
- **GA4**: reaproveitar `track()` para `product_view`, `catalog_filter`, `catalog_search` e `whatsapp_click` com `link_location: "ficha"`.

---

## Success Criteria

- [ ] Um produto novo aparece no site apenas adicionando uma entrada no JSON e as imagens em `static/produtos/`
- [ ] Qualquer combinação de aba + busca + filtros + ordenação produz o resultado correto em < 100ms com até 100 produtos
- [ ] Toda ficha tem o botão "Garantir sua unidade" abrindo o WhatsApp com a mensagem do produto
- [ ] Nenhum scroll horizontal em telas de 360px
