const test = require("node:test");
const assert = require("node:assert/strict");
const core = require("../static/js/catalogo-core.js");

const P = [
  { slug: "i13", nome: "iPhone 13 128GB", grupo: "dispositivo", tipo: "iphone", linha: "iPhone 13", condicao: "seminovo", preco: 2799, adicionadoEm: "2026-09-15" },
  { slug: "i13p", nome: "iPhone 13 Pro 256GB", grupo: "dispositivo", tipo: "iphone", linha: "iPhone 13", condicao: "seminovo", preco: 3599, estoque: 3, adicionadoEm: "2026-09-10" },
  { slug: "i9", nome: "iPhone 9", grupo: "dispositivo", tipo: "iphone", linha: "iPhone 9", condicao: "seminovo", preco: 999, adicionadoEm: "2026-09-15" },
  { slug: "i16", nome: "iPhone 16 128GB", grupo: "dispositivo", tipo: "iphone", linha: "iPhone 16", condicao: "novo", preco: 5999, adicionadoEm: "2026-09-22" },
  { slug: "i11", nome: "iPhone 11 64GB", grupo: "dispositivo", tipo: "iphone", linha: "iPhone 11", condicao: "seminovo", preco: 1699, estoque: 0, adicionadoEm: "2026-09-01" },
  { slug: "jbl", nome: "Caixa de Som JBL", grupo: "dispositivo", tipo: "caixa-de-som", condicao: "novo", preco: 699, adicionadoEm: "2026-09-05" },
  { slug: "capa", nome: "Capa Acessório Silicone", grupo: "acessorio", tipo: "capa", condicao: "novo", preco: 89, adicionadoEm: "2026-09-19" },
  { slug: "watch", nome: "Apple Watch Series 9", grupo: "acessorio", tipo: "apple-watch", linha: "Apple Watch", condicao: "seminovo", preco: 1999, estoque: 1, adicionadoEm: "2026-09-17" }
];

const slugs = (list) => list.map((p) => p.slug);

test("normalize remove acentos e caixa", () => {
  assert.equal(core.normalize("  Acessório ÚNICO "), "acessorio unico");
  assert.equal(core.normalize(null), "");
});

test("isAvailable: estoque ausente ou > 0", () => {
  assert.equal(core.isAvailable({}), true);
  assert.equal(core.isAvailable({ estoque: 2 }), true);
  assert.equal(core.isAvailable({ estoque: 0 }), false);
});

test("filterProducts: grupo padrão é dispositivo e esconde estoque 0", () => {
  const r = slugs(core.filterProducts(P, {}));
  assert.deepEqual(r.sort(), ["i13", "i13p", "i16", "i9", "jbl"].sort());
});

test("filterProducts: busca ignora caixa e acento, por palavras", () => {
  const a = slugs(core.filterProducts(P, { q: "IPHONE 13" }));
  const b = slugs(core.filterProducts(P, { q: "iphone 13" }));
  assert.deepEqual(a, b);
  assert.deepEqual(a.sort(), ["i13", "i13p"]);
  assert.deepEqual(slugs(core.filterProducts(P, { grupo: "acessorio", q: "acessorio" })), ["capa"]);
  assert.deepEqual(slugs(core.filterProducts(P, { q: "13 256" })), ["i13p"]);
});

test("filterProducts: linhas combinam com OU, critérios com E", () => {
  const r = slugs(core.filterProducts(P, { linhas: ["iPhone 13", "iPhone 16"], condicoes: ["seminovo"] }));
  assert.deepEqual(r.sort(), ["i13", "i13p"]);
});

test("filterProducts: produto sem linha sai quando há filtro de linha", () => {
  assert.ok(slugs(core.filterProducts(P, {})).includes("jbl"));
  assert.ok(!slugs(core.filterProducts(P, { linhas: ["iPhone 13"] })).includes("jbl"));
});

test("filterProducts: faixa de preço, vazios ignorados e min>max trocados", () => {
  assert.deepEqual(slugs(core.filterProducts(P, { min: 1000, max: 3000 })), ["i13"]);
  assert.deepEqual(slugs(core.filterProducts(P, { min: 3000, max: 1000 })), ["i13"]);
  assert.equal(core.filterProducts(P, { min: "", max: null }).length, 5);
  assert.deepEqual(slugs(core.filterProducts(P, { min: 5000 })), ["i16"]);
});

test("normalizePriceRange", () => {
  assert.deepEqual(core.normalizePriceRange("", ""), { min: null, max: null });
  assert.deepEqual(core.normalizePriceRange(500, 100), { min: 100, max: 500 });
  assert.deepEqual(core.normalizePriceRange("abc", -5), { min: null, max: null });
});

test("sortProducts: preço e recente, sem mutar o original", () => {
  const original = P.slice();
  const disp = core.filterProducts(P, {});
  assert.deepEqual(slugs(core.sortProducts(disp, "menor-preco")), ["jbl", "i9", "i13", "i13p", "i16"]);
  assert.deepEqual(slugs(core.sortProducts(disp, "maior-preco")), ["i16", "i13p", "i13", "i9", "jbl"]);
  // i13 e i9 têm a mesma data: desempate por nome com ordem numérica (9 antes de 13)
  assert.deepEqual(slugs(core.sortProducts(disp, "recente")), ["i16", "i9", "i13", "i13p", "jbl"]);
  assert.deepEqual(slugs(core.sortProducts(disp, "xyz")), slugs(core.sortProducts(disp, "recente")));
  assert.deepEqual(P, original);
});

test("linesFor: por grupo, só disponíveis, ordem numérica", () => {
  assert.deepEqual(core.linesFor(P, "dispositivo"), ["iPhone 9", "iPhone 13", "iPhone 16"]);
  assert.deepEqual(core.linesFor(P, "acessorio"), ["Apple Watch"]);
});

test("discountPercent", () => {
  assert.equal(core.discountPercent({ preco: 7699, precoOriginal: 8999 }), 14);
  assert.equal(core.discountPercent({ preco: 100 }), null);
  assert.equal(core.discountPercent({ preco: 100, precoOriginal: 100 }), null);
  assert.equal(core.discountPercent({ preco: 100, precoOriginal: 90 }), null);
});

test("urgencyLabel", () => {
  assert.equal(core.urgencyLabel({ estoque: 1 }), "Última unidade");
  assert.equal(core.urgencyLabel({ estoque: 2 }), "Últimas 2 unidades");
  assert.equal(core.urgencyLabel({ estoque: 3 }), null);
  assert.equal(core.urgencyLabel({}), null);
});

test("formatPrice em BRL", () => {
  assert.equal(core.formatPrice(3199).replace(/\s/g, " "), "R$ 3.199,00");
  assert.equal(core.formatPrice(89.9).replace(/\s/g, " "), "R$ 89,90");
});

test("relatedProducts: mesmo tipo, depois mesmo grupo, depois o resto", () => {
  const current = P.find((p) => p.slug === "i13");
  const r = core.relatedProducts(P, current, 4);
  assert.equal(r.length, 4);
  assert.ok(!slugs(r).includes("i13"));
  assert.ok(!slugs(r).includes("i11"), "estoque 0 não entra");
  // iPhones disponíveis por proximidade de preço: i13p (800), i9 (1800), i16 (3200); depois jbl (mesmo grupo)
  assert.deepEqual(slugs(r), ["i13p", "i9", "i16", "jbl"]);
  const watch = P.find((p) => p.slug === "watch");
  // depois do mesmo grupo (capa), o mais próximo em preço de 1999 é i13 (2799), não i9 (999)
  assert.deepEqual(slugs(core.relatedProducts(P, watch, 2)), ["capa", "i13"]);
});

test("relatedProducts: catálogo de 1 item retorna vazio", () => {
  assert.deepEqual(core.relatedProducts([P[0]], P[0]), []);
});

test("stateToQuery: estado padrão gera string vazia", () => {
  assert.equal(core.stateToQuery({}), "");
  assert.equal(core.stateToQuery(core.DEFAULT_STATE), "");
});

test("stateToQuery ⇄ stateFromQuery preserva o estado", () => {
  const s = {
    grupo: "acessorio",
    q: "capa, iphone & cia",
    ordem: "menor-preco",
    linhas: ["iPhone 13", "Apple Watch Série Ã"],
    condicoes: ["novo", "seminovo"],
    min: 100,
    max: 3500
  };
  const qs = core.stateToQuery(s);
  assert.match(qs, /linha=iPhone%2013,Apple%20Watch/);
  assert.deepEqual(core.stateFromQuery(qs), s);
  assert.deepEqual(core.stateFromQuery(core.stateToQuery({ ordem: "maior-preco" })), { ...core.DEFAULT_STATE, ordem: "maior-preco" });
});

test("stateFromQuery: valores inválidos caem no padrão", () => {
  assert.deepEqual(
    core.stateFromQuery("?grupo=xyz&ordem=abc&min=abc&max=-1&cond=usado,novo"),
    { ...core.DEFAULT_STATE, condicoes: ["novo"] }
  );
  assert.deepEqual(core.stateFromQuery(""), core.DEFAULT_STATE);
});
