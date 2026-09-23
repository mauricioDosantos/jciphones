# Testing Infrastructure

**Atualizado:** 2026-09-23

## Test Frameworks

**Unit:** `node:test` + `node:assert` (embutidos no Node ≥ 18). Sem `package.json`, sem dependências.
**E2E:** não versionado. Na execução da feature de catálogo, a verificação visual/funcional foi feita com Playwright fora do repositório.

## Test Organization

```
tests/catalogo-core.test.js   regras de catalogo-core.js (filtro, ordem, relacionados, URL, formatação)
tests/catalogo-json.test.js   valida o data/catalogo.json real (campos, slugs únicos, fotos existentes)
```

## Test Execution

```bash
node --test        # na raiz; descobre **/*.test.js
```

Obs.: no Node 24, `node --test tests/` (passando a pasta) **não** funciona; use sem argumento.

## Coverage Targets

Toda regra de negócio do catálogo vive em `catalogo-core.js` e é coberta por testes. As camadas de DOM (`catalogo.js`, `produto.js`) são verificadas manualmente/Playwright pelos critérios de `tasks.md`.
**Enforcement:** rodar `node --test` antes de publicar (documentado no README).
