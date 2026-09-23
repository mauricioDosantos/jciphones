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
      .replace(/[̀-ͯ]/g, "")
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

  var api = {
    GRUPOS: GRUPOS,
    CONDICOES: CONDICOES,
    ORDENS: ORDENS,
    DEFAULT_STATE: DEFAULT_STATE,
    normalize: normalize,
    isAvailable: isAvailable,
    normalizePriceRange: normalizePriceRange,
    filterProducts: filterProducts,
    sortProducts: sortProducts,
    linesFor: linesFor,
    discountPercent: discountPercent,
    urgencyLabel: urgencyLabel,
    formatPrice: formatPrice,
    relatedProducts: relatedProducts
  };

  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.JCCore = api;
})(this);
