// Valida o data/catalogo.json real. Rode `node --test` antes de publicar.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const core = require("../static/js/catalogo-core.js");

const ROOT = path.join(__dirname, "..");
const catalogo = JSON.parse(fs.readFileSync(path.join(ROOT, "data/catalogo.json"), "utf8"));

function report(problems) {
  return "\n" + problems.map((p) => "  - " + p).join("\n");
}

test("catalogo.json tem a lista de produtos", () => {
  assert.ok(Array.isArray(catalogo.produtos), '"produtos" deve ser uma lista');
  assert.ok(catalogo.produtos.length > 0, "o catálogo está vazio");
});

test("todos os produtos têm os campos certos", () => {
  const problems = [];
  catalogo.produtos.forEach((p, i) => {
    core.validateProduct(p).forEach((e) => problems.push(`${p && p.slug ? p.slug : "produto #" + (i + 1)}: ${e}`));
  });
  assert.deepEqual(problems, [], report(problems));
});

test("slugs são únicos", () => {
  const seen = new Set();
  const dup = catalogo.produtos.map((p) => p.slug).filter((s) => (seen.has(s) ? true : (seen.add(s), false)));
  assert.deepEqual(dup, [], "slug repetido: " + dup.join(", "));
});

test("todas as imagens existem", () => {
  const missing = [];
  catalogo.produtos.forEach((p) => {
    (p.imagens || []).forEach((img) => {
      if (!fs.existsSync(path.join(ROOT, img))) missing.push(`${p.slug}: ${img}`);
    });
  });
  assert.deepEqual(missing, [], "imagem não encontrada:" + report(missing));
});
