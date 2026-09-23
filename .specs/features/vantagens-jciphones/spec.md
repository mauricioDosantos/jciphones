# Vantagens JC Iphones Specification

## Problem Statement

As objeções mais comuns antes do contato — "tem garantia?", "como pago?", "entregam?" — hoje não são respondidas de forma direta. A seção atual "Por que escolher a JC Iphones" (`#porque`) fala de forma genérica ("Garantia de verdade", "Parcelamento") sem os termos concretos. O concorrente exibe esses selos ("Garantia iPortess", "Formas de pagamento") no próprio catálogo.

## Goals

- [ ] As 3 vantagens concretas ficam visíveis na home e na ficha de produto, sem precisar perguntar no WhatsApp

## Out of Scope

| Feature                              | Reason                                     |
| ------------------------------------ | ------------------------------------------ |
| Página de política de garantia completa | Não pedido; detalhes são tratados no WhatsApp |
| Cálculo de frete / agendamento de entrega | Entrega é combinada no WhatsApp          |

---

## Conteúdo (texto acordado)

| Vantagem              | Texto                                                        |
| --------------------- | ------------------------------------------------------------ |
| Garantia JC Iphones   | Garantia de 1 ano da fábrica ou 6 meses da loja               |
| Forma de pagamento    | Pix ou cartão                                                 |
| Entrega ou retirada   | Combine pelo WhatsApp                                         |

---

## User Stories

### P1: Ver as vantagens de comprar na JC Iphones ⭐ MVP

**User Story**: Como visitante, quero ver garantia, formas de pagamento e opções de entrega de forma clara, para confiar na loja antes de chamar.

**Acceptance Criteria**:

1. WHEN a home é exibida THEN SHALL haver um bloco de destaque com as 3 vantagens (ícone + título + texto da tabela acima), posicionado logo após o catálogo
2. WHEN a seção `#porque` atual é revisada THEN seus itens genéricos "Garantia de verdade" e "Parcelamento" SHALL ser substituídos/fundidos com as 3 vantagens, para não haver informação duplicada ou contraditória (ex.: "parcelamento" vs. "pix ou cartão")
3. WHEN a ficha de produto é exibida THEN as 3 vantagens SHALL aparecer em formato compacto próximo ao botão "Garantir sua unidade"
4. WHEN o visitante clica em "Entrega ou retirada" THEN SHALL abrir o WhatsApp com mensagem pré-preenchida perguntando sobre entrega/retirada
5. WHEN a tela é de celular THEN os 3 itens SHALL ficar empilhados ou em carrossel legível, sem scroll horizontal da página

**Independent Test**: Abrir home e uma ficha em mobile e desktop e conferir os 3 textos exatamente como na tabela.

---

## Requirement Traceability

| Requirement ID | Story                                      | Phase  | Status  |
| -------------- | ------------------------------------------ | ------ | ------- |
| VANT-01        | P1: bloco de vantagens na home              | Tasks | In Tasks |
| VANT-02        | P1: reconciliar com `#porque`               | Tasks | In Tasks |
| VANT-03        | P1: vantagens compactas na ficha            | Tasks | In Tasks |
| VANT-04        | P1: "Entrega ou retirada" abre WhatsApp     | Tasks | In Tasks |

**Coverage:** todos os requisitos mapeados em `catalogo-e-ficha-produto/tasks.md`

---

## Success Criteria

- [ ] Os textos de garantia, pagamento e entrega aparecem idênticos em todos os pontos do site
- [ ] Nenhum texto antigo contradiz as vantagens (ex.: menção a parcelamento sem ser "cartão")

> **Tasks:** ver `.specs/features/catalogo-e-ficha-produto/tasks.md` (arquivo único para as 3 features).
