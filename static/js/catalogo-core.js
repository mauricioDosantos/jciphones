// Regras do catálogo sem DOM: roda no navegador (window.JCCore) e no Node (testes).
(function (root) {
  var GRUPOS = ["dispositivo", "acessorio"];
  var CONDICOES = ["novo", "seminovo"];
  var ORDENS = ["recente", "menor-preco", "maior-preco"];

  var DEFAULT_STATE = {
    grupo: "dispositivo",
    q: "",
    ordem: "recente",
    linhas: [],
    condicoes: [],
    min: null,
    max: null
  };

  var collator = new Intl.Collator("pt-BR", { numeric: true, sensitivity: "base" });

  function normalize(str) {
    return String(str == null ? "" : str)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim();
  }

  function isAvailable(p) {
    return p.estoque == null || p.estoque > 0;
  }

  function toPrice(value) {
    if (value === null || value === undefined || value === "") return null;
    var n = Number(value);
    return isFinite(n) && n >= 0 ? n : null;
  }

  function normalizePriceRange(min, max) {
    min = toPrice(min);
    max = toPrice(max);
    if (min !== null && max !== null && min > max) {
      var tmp = min;
      min = max;
      max = tmp;
    }
    return { min: min, max: max };
  }

  function withDefaults(state) {
    var s = {};
    for (var k in DEFAULT_STATE) s[k] = state && state[k] !== undefined ? state[k] : DEFAULT_STATE[k];
    return s;
  }

  function filterProducts(products, state) {
    var s = withDefaults(state);
    var words = normalize(s.q).split(/\s+/).filter(Boolean);
    var range = normalizePriceRange(s.min, s.max);

    return products.filter(function (p) {
      if (!isAvailable(p)) return false;
      if (s.grupo && p.grupo !== s.grupo) return false;
      if (words.length) {
        var nome = normalize(p.nome);
        for (var i = 0; i < words.length; i++) if (nome.indexOf(words[i]) === -1) return false;
      }
      if (range.min !== null && p.preco < range.min) return false;
      if (range.max !== null && p.preco > range.max) return false;
      if (s.linhas.length && s.linhas.indexOf(p.linha) === -1) return false;
      if (s.condicoes.length && s.condicoes.indexOf(p.condicao) === -1) return false;
      return true;
    });
  }

  function byName(a, b) {
    return collator.compare(a.nome, b.nome);
  }

  var COMPARATORS = {
    "recente": function (a, b) {
      return String(b.adicionadoEm).localeCompare(String(a.adicionadoEm)) || byName(a, b);
    },
    "menor-preco": function (a, b) { return a.preco - b.preco || byName(a, b); },
    "maior-preco": function (a, b) { return b.preco - a.preco || byName(a, b); }
  };

  function sortProducts(products, ordem) {
    return products.slice().sort(COMPARATORS[ordem] || COMPARATORS.recente);
  }

  function linesFor(products, grupo) {
    var seen = {};
    products.forEach(function (p) {
      if (p.linha && isAvailable(p) && (!grupo || p.grupo === grupo)) seen[p.linha] = true;
    });
    return Object.keys(seen).sort(collator.compare);
  }

  function discountPercent(p) {
    if (!(p.precoOriginal > p.preco)) return null;
    return Math.round(((p.precoOriginal - p.preco) / p.precoOriginal) * 100);
  }

  function urgencyLabel(p) {
    if (p.estoque === 1) return "Última unidade";
    if (p.estoque === 2) return "Últimas 2 unidades";
    return null;
  }

  var priceFormat = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });

  function formatPrice(n) {
    return priceFormat.format(n);
  }

  function relatedProducts(products, current, limit) {
    function rank(p) {
      if (p.tipo === current.tipo) return 0;
      if (p.grupo === current.grupo) return 1;
      return 2;
    }
    return products
      .filter(function (p) { return p.slug !== current.slug && isAvailable(p); })
      .sort(function (a, b) {
        return rank(a) - rank(b) ||
          Math.abs(a.preco - current.preco) - Math.abs(b.preco - current.preco) ||
          byName(a, b);
      })
      .slice(0, limit == null ? 4 : limit);
  }

  function splitList(value, allowed) {
    return (value || "").split(",").filter(function (v) {
      return v && (!allowed || allowed.indexOf(v) !== -1);
    });
  }

  function stateFromQuery(search) {
    var params = new URLSearchParams(search || "");
    var grupo = params.get("grupo");
    var ordem = params.get("ordem");
    return {
      grupo: GRUPOS.indexOf(grupo) !== -1 ? grupo : DEFAULT_STATE.grupo,
      q: params.get("q") || "",
      ordem: ORDENS.indexOf(ordem) !== -1 ? ordem : DEFAULT_STATE.ordem,
      linhas: splitList(params.get("linha")),
      condicoes: splitList(params.get("cond"), CONDICOES),
      min: toPrice(params.get("min")),
      max: toPrice(params.get("max"))
    };
  }

  // Vírgula fica literal para a URL continuar legível: ?linha=iPhone%2013,iPhone%2015
  function stateToQuery(state) {
    var s = withDefaults(state);
    var parts = [];
    function add(key, value) {
      parts.push(key + "=" + [].concat(value).map(encodeURIComponent).join(","));
    }
    if (s.grupo !== DEFAULT_STATE.grupo) add("grupo", s.grupo);
    if (s.q.trim()) add("q", s.q.trim());
    if (s.ordem !== DEFAULT_STATE.ordem) add("ordem", s.ordem);
    if (s.linhas.length) add("linha", s.linhas);
    if (s.condicoes.length) add("cond", s.condicoes);
    if (toPrice(s.min) !== null) add("min", toPrice(s.min));
    if (toPrice(s.max) !== null) add("max", toPrice(s.max));
    return parts.length ? "?" + parts.join("&") : "";
  }

  // Lista de problemas de um produto do JSON; vazia quando está tudo certo.
  function validateProduct(p) {
    var errors = [];
    function isText(v) { return typeof v === "string" && v.trim() !== ""; }
    if (!p || typeof p !== "object") return ["não é um objeto"];
    if (!isText(p.slug) || !/^[a-z0-9]+(-[a-z0-9]+)*$/.test(p.slug)) errors.push("slug inválido (use só a-z, 0-9 e hífen)");
    if (!isText(p.nome)) errors.push("nome ausente");
    if (GRUPOS.indexOf(p.grupo) === -1) errors.push("grupo deve ser " + GRUPOS.join(" ou "));
    if (!isText(p.tipo)) errors.push("tipo ausente");
    if (CONDICOES.indexOf(p.condicao) === -1) errors.push("condicao deve ser " + CONDICOES.join(" ou "));
    if (typeof p.preco !== "number" || !(p.preco > 0)) errors.push("preco deve ser um número maior que 0");
    if (!isText(p.adicionadoEm) || !/^\d{4}-\d{2}-\d{2}$/.test(p.adicionadoEm)) errors.push("adicionadoEm deve estar no formato AAAA-MM-DD");
    if (!Array.isArray(p.imagens) || !p.imagens.length || !p.imagens.every(isText)) errors.push("imagens deve ter pelo menos 1 caminho");
    if (p.linha !== undefined && (!isText(p.linha) || p.linha.indexOf(",") !== -1)) errors.push("linha não pode ser vazia nem conter vírgula");
    if (p.precoOriginal !== undefined && typeof p.precoOriginal !== "number") errors.push("precoOriginal deve ser um número");
    if (p.parcelamento !== undefined && !isText(p.parcelamento)) errors.push("parcelamento deve ser texto");
    if (p.estoque !== undefined && !(Number.isInteger(p.estoque) && p.estoque >= 0)) errors.push("estoque deve ser um inteiro ≥ 0");
    if (p.especificacoes !== undefined && !(Array.isArray(p.especificacoes) && p.especificacoes.every(function (e) {
      return e && isText(e.rotulo) && isText(e.valor);
    }))) errors.push("especificacoes deve ser uma lista de { rotulo, valor }");
    if (p.tags !== undefined && !(Array.isArray(p.tags) && p.tags.every(isText))) errors.push("tags deve ser uma lista de textos");
    return errors;
  }

  var api = {
    GRUPOS: GRUPOS,
    CONDICOES: CONDICOES,
    ORDENS: ORDENS,
    DEFAULT_STATE: DEFAULT_STATE,
    normalize: normalize,
    isAvailable: isAvailable,
    toPrice: toPrice,
    normalizePriceRange: normalizePriceRange,
    filterProducts: filterProducts,
    sortProducts: sortProducts,
    linesFor: linesFor,
    discountPercent: discountPercent,
    urgencyLabel: urgencyLabel,
    formatPrice: formatPrice,
    relatedProducts: relatedProducts,
    stateFromQuery: stateFromQuery,
    stateToQuery: stateToQuery,
    validateProduct: validateProduct
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.JCCore = api;
})(this);
