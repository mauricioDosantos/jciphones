// Seção #catalogo da home: estado (URL) → filtros/ordenação → grid.
(function () {
  var CATALOG_URL = "data/catalogo.json";

  var grid = document.getElementById("catalogGrid");
  if (!grid) return;
  var countEl = document.getElementById("catalogCount");

  var products = [];
  var state = JCCore.stateFromQuery(location.search);
  var rendered = false;

  function skeletons(n) {
    var card = '<div class="product-card is-skeleton" aria-hidden="true"><div class="product-media"></div>' +
      '<div class="product-body"><div class="sk-line"></div><div class="sk-line w-60"></div><div class="sk-line w-40"></div></div></div>';
    return new Array(n + 1).join(card);
  }

  function stateBlock(title, text, actions) {
    return '<div class="catalog-state"><h3>' + title + "</h3><p>" + text + "</p>" +
      '<div class="state-actions">' + actions + "</div></div>";
  }

  function waButton(label, message) {
    return '<a class="btn btn-whatsapp" data-wa-text="' + JC.escapeHtml(message) + '">' + label + "</a>";
  }

  function emptyState() {
    var wanted = state.q.trim() ? ": " + state.q.trim() : ".";
    return stateBlock(
      "Nenhum produto encontrado",
      "Tente outro termo ou limpe os filtros. Se não achou o que procura, a gente verifica para você.",
      '<button type="button" class="btn btn-ghost" data-action="clear-filters">Limpar filtros</button>' +
      waButton("Não achou? Fale com a gente", "Olá! Não encontrei no catálogo o que procuro" + wanted)
    );
  }

  function errorState() {
    return stateBlock(
      "Não conseguimos carregar o catálogo agora",
      "Atualize a página em instantes ou fale direto com a gente pelo WhatsApp.",
      waButton("Falar no WhatsApp", "Olá! Quero saber quais produtos vocês têm disponíveis.")
    );
  }

  function currentList() {
    return JCCore.sortProducts(JCCore.filterProducts(products, state), state.ordem);
  }

  function render() {
    var list = currentList();
    grid.innerHTML = list.length
      ? list.map(function (p) { return JC.renderCard(p, "catalogo"); }).join("")
      : emptyState();
    countEl.textContent = list.length === 1 ? "1 produto" : list.length + " produtos";

    // Só a primeira renderização anima; depois (busca/filtros) os cards aparecem direto.
    if (rendered) grid.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
    else JC.observeReveal(grid);
    rendered = true;
    JC.bindWaLinks(grid);
  }

  grid.innerHTML = skeletons(4);
  JC.loadCatalog(CATALOG_URL)
    .then(function (catalog) {
      products = catalog.produtos;
      render();
    })
    .catch(function (err) {
      console.error("[catálogo]", err);
      grid.innerHTML = errorState();
      countEl.textContent = "";
      JC.bindWaLinks(grid);
    });
})();
