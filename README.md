# jciphones

Site da JC Iphones (José de Freitas - PI): catálogo de iPhones e acessórios com fechamento de venda pelo WhatsApp. Site estático, sem build, publicado no GitHub Pages.

| Página | Arquivo | Para quê |
| --- | --- | --- |
| Home | `index.html` | Hero, catálogo (`#catalogo`), vantagens, assistência, contato |
| Produto | `produto.html?p=<slug>` | Tela de detalhes com "Garantir sua unidade" |
| Link da bio | `bio/index.html` → `/bio/` | Link para colar na bio do Instagram |

## Como adicionar, editar ou remover um produto

Tudo fica em **`data/catalogo.json`**. Não é preciso mexer em HTML nem em JS.

1. Coloque as fotos em `static/produtos/<slug>/` (ex.: `static/produtos/iphone-13-128gb-seminovo/1.jpg`).
   - Fotos quadradas, com cerca de **1000×1000px** e até **~150KB** cada (celular com 4G agradece).
   - A primeira foto da lista é a capa do card.
2. Adicione um bloco em `"produtos"`:

```json
{
  "slug": "iphone-13-128gb-seminovo",
  "nome": "iPhone 13 128GB",
  "grupo": "dispositivo",
  "tipo": "iphone",
  "linha": "iPhone 13",
  "condicao": "seminovo",
  "preco": 2799,
  "precoOriginal": 3199,
  "parcelamento": "10x de R$ 279,90",
  "estoque": 2,
  "adicionadoEm": "2026-09-15",
  "imagens": [
    "static/produtos/iphone-13-128gb-seminovo/1.jpg",
    "static/produtos/iphone-13-128gb-seminovo/2.jpg"
  ],
  "especificacoes": [
    { "rotulo": "Armazenamento", "valor": "128GB" },
    { "rotulo": "Bateria", "valor": "88%" }
  ],
  "tags": ["Promoção"]
}
```

| Campo | Obrigatório | O que é |
| --- | --- | --- |
| `slug` | sim | Identificador único, vira o link do produto. Só letras minúsculas, números e hífen |
| `nome` | sim | Nome exibido e usado na busca |
| `grupo` | sim | `"dispositivo"` (iPhone, notebook, tablet, caixa de som…) ou `"acessorio"` (fone, capa, Apple Watch, carregador…) |
| `tipo` | sim | Tipo do produto (`iphone`, `notebook`, `tablet`, `caixa-de-som`, `fone`, `capa`, `apple-watch`, `carregador`…). Usado em "Você também pode gostar" |
| `linha` | não | Linha para o filtro (ex.: `"iPhone 13"`, `"MacBook Air"`). Sem vírgula |
| `condicao` | sim | `"novo"` ou `"seminovo"` |
| `preco` | sim | Preço em reais, **número** sem aspas (ex.: `2799` ou `2799.90`) |
| `precoOriginal` | não | Preço "de", aparece riscado com o % de desconto |
| `parcelamento` | não | Texto livre, aparece como "ou 10x de R$ 279,90" |
| `estoque` | não | `0` esconde o produto; `1` mostra "Última unidade"; `2` mostra "Últimas 2 unidades" |
| `adicionadoEm` | sim | Data no formato `AAAA-MM-DD`, usada em "Mais recente" |
| `imagens` | sim | Lista de caminhos das fotos (pelo menos 1) |
| `especificacoes` | não | Lista de `{ "rotulo", "valor" }`, na ordem em que devem aparecer |
| `tags` | não | Selos extras (ex.: `"Lacrado"`, `"Promoção"`, `"Original"`) |

- **Vendeu?** Coloque `"estoque": 0`. O produto some do catálogo e o link antigo mostra "Produto não encontrado ou já vendido".
- **Remover de vez:** apague o bloco do produto e a pasta de fotos dele.
- Atenção às vírgulas entre os blocos: o JSON não aceita vírgula sobrando no fim da lista.

### Conferir antes de publicar

```bash
node --test
```

O teste avisa, citando o slug, se falta campo obrigatório, se há slug repetido ou se alguma foto não existe. Precisa do Node 18 ou mais novo; não é preciso instalar nada. Se passar, é só fazer commit e push.

## Rodar localmente

O catálogo é carregado com `fetch`, que **não funciona abrindo o arquivo direto** (`file://`). Use um servidor:

```bash
python3 -m http.server 8000
# abra http://localhost:8000/
```

## Configurações que precisam ser trocadas antes de publicar

| O quê | Onde |
| --- | --- |
| Número do WhatsApp | `WA_NUMBER` em `static/js/common.js` **e** os links dentro de `<noscript>` em `index.html` e `produto.html` |
| Link do Instagram | `href="#"` em `bio/index.html` e no rodapé de `index.html`/`produto.html` |
| Domínio do site | Meta tags `og:*` em `bio/index.html` |

## Estrutura

```
index.html · produto.html · bio/index.html
data/catalogo.json            fonte única do catálogo
static/css/site.css           estilos globais (tokens, nav, botões, seções)
static/css/catalogo.css       catálogo, filtros, ficha e vantagens
static/css/bio.css            página da bio
static/js/common.js           WhatsApp, GA4, menu, card de produto, vantagens
static/js/catalogo-core.js    regras puras: filtros, ordenação, relacionados, validação
static/js/catalogo.js         seção de catálogo da home
static/js/produto.js          tela de detalhes
static/produtos/<slug>/       fotos dos produtos
tests/                        node --test
```
