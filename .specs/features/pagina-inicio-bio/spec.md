# Página Link-na-Bio Specification

> **Revisão 2026-09-23 (AD-004):** substitui a versão de 2026-09-18, que implementava a bio como um toggle dentro de `#inicio` e deixava URL separada fora do escopo. Agora a bio tem **URL própria** para colar no Instagram. Design e tasks antigos foram movidos para `_superseded/`.

## Problem Statement

O Instagram permite um único link na bio. Mandar esse link para a home completa é denso demais para quem vem de um story e só quer escolher entre WhatsApp, catálogo, Instagram ou localização. A iPortess usa uma página curta, no formato link-na-bio (referência: `image.png` na raiz do repo), com endereço próprio.

## Goals

- [ ] Existe uma URL curta e estável (`https://<domínio>/bio/`) para colar na bio do Instagram
- [ ] Quem entra por ela decide para onde ir em < 5 segundos, sem rolar em um celular comum

## Out of Scope

| Feature                                  | Reason                                                   |
| ---------------------------------------- | -------------------------------------------------------- |
| Links editáveis por painel                | Sem backend; os 4 links são fixos no HTML                |
| Encurtador / domínio próprio para a bio   | Usa o domínio do site; domínio é decisão de publicação   |
| Rastreamento de UTM por story/post        | Pode ser feito depois com parâmetros na URL, sem código novo |

---

## User Stories

### P1: Acessar a página link-na-bio por URL própria ⭐ MVP

**User Story**: Como visitante vindo do Instagram, quero ver em uma tela só os caminhos principais da loja, para escolher rapidamente.

**Acceptance Criteria**:

1. WHEN o visitante acessa `/bio/` (arquivo `bio/index.html`) THEN SHALL ver, de cima para baixo: banner da loja, logo circular sobreposto ao banner, título "Bem-vindo à JC Iphones", bio curta (iPhones novos e seminovos, acessórios, cidade) e 4 botões empilhados
2. WHEN os botões são exibidos THEN cada um SHALL ter ícone, título e subtítulo, nesta ordem:
   - "Entre em contato" — "Fale conosco pelo WhatsApp para tirar dúvidas e fazer pedidos"
   - "Veja o nosso catálogo" — "Confira todos os nossos aparelhos e acessórios disponíveis"
   - "Nosso Instagram" — "Acompanhe novidades e promoções no Instagram"
   - "Ver localização" — "Veja a localização da loja no Google Maps"
3. WHEN o visitante clica em "Entre em contato" THEN SHALL abrir o WhatsApp (`WA_NUMBER`) com mensagem genérica de contato
4. WHEN o visitante clica em "Veja o nosso catálogo" THEN SHALL abrir a home posicionada no catálogo (`/#catalogo`)
5. WHEN o visitante clica em "Nosso Instagram" THEN SHALL abrir o perfil da loja em nova aba
6. WHEN o visitante clica em "Ver localização" THEN SHALL abrir o Google Maps com o mesmo endereço usado em `#contato`
7. WHEN a página é exibida THEN o rodapé SHALL mostrar "© {ano} JC Iphones — Todos os direitos reservados" e o horário "Seg a dom, 8h às 18h"
8. WHEN a página é aberta em celular de 360–430px THEN logo, título e os 4 botões SHALL caber na tela sem scroll horizontal, com área de toque ≥ 44px por botão
9. WHEN a página carrega THEN SHALL disparar `page_view` no GA4 e cada botão SHALL disparar `track('bio_click', { destino })`

**Independent Test**: Abrir `/bio/` em celular, conferir ordem e texto dos 4 botões e que cada um leva ao destino certo.

---

### P2: Horário de atendimento correto em todo o site

**User Story**: Como cliente, quero que o horário exibido esteja certo em qualquer página.

**Acceptance Criteria**:

1. WHEN qualquer página (home, ficha, bio) exibe horário THEN o texto SHALL ser "8h às 18h" (corrigindo o "7h às 18h" atual do hero)

**Independent Test**: `grep -r "7h às 18h"` no repositório não retorna nada.

---

### P2: Link para a bio a partir do site

**Acceptance Criteria**:

1. WHEN a página `/bio/` é compartilhada (WhatsApp/Instagram) THEN SHALL exibir preview com título, descrição e imagem via meta tags Open Graph

---

## Edge Cases

- WHEN o link do Instagram ainda não foi fornecido THEN o botão SHALL usar placeholder registrado em `STATE.md` → Todos, bloqueando publicação
- WHEN o visitante acessa `/bio` sem barra final THEN o GitHub Pages SHALL redirecionar para `/bio/` (comportamento padrão — verificar após deploy)
- WHEN o banner não carrega THEN o topo SHALL cair para um fundo sólido da paleta, mantendo logo e botões legíveis

---

## Requirement Traceability

| Requirement ID | Story                                  | Phase  | Status  |
| -------------- | -------------------------------------- | ------ | ------- |
| BIO-01         | P1: página `/bio/` com layout de referência | Tasks | In Tasks |
| BIO-02         | P1: 4 botões com destinos corretos      | Tasks | In Tasks |
| BIO-03         | P1: mobile-first + GA4                  | Tasks | In Tasks |
| BIO-04         | P2: horário 8h–18h em todo o site        | Tasks | In Tasks |
| BIO-05         | P2: meta tags Open Graph                 | Tasks | In Tasks |

**Coverage:** todos os requisitos mapeados em `catalogo-e-ficha-produto/tasks.md`

---

## Success Criteria

- [ ] Link `/bio/` colado na bio do Instagram abre a página correta no navegador interno do Instagram (iOS e Android)
- [ ] Nenhuma ocorrência de "7h às 18h" no site publicado

> **Tasks:** ver `.specs/features/catalogo-e-ficha-produto/tasks.md` (arquivo único para as 3 features).
