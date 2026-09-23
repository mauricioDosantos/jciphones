// Seção #catalogo da home: estado (URL) → filtros/ordenação → grid.
(function () {
  var CATALOG_URL = "data/catalogo.json";

  var grid = document.getElementById("catalogGrid");
  if (!grid) return;
  var countEl = document.getElementById("catalogCount");
  var tabs = document.querySelectorAll(".catalog-tabs [role=tab]");
  var searchInput = document.getElementById("catalogSearch");
  var sortSelect = document.getElementById("catalogSort");
  var drawer = document.getElementById("filterDrawer");
  var openBtn = document.getElementById("filterOpen");
  var filterCount = document.getElementById("filterCount");
  var minInput = document.getElementById("filterMin");
  var maxInput = document.getElementById("filterMax");
  var linhasBox = document.getElementById("filterLinhas");
  var linhasGroup = document.getElementById("filterLinhasGroup");
  var applyBtn = document.getElementById("filterApply");

  var products = [];
  var state = JCCore.stateFromQuery(location.search);
  var rendered = false;
  var linesGrupo = null;

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
      '<button type="button" class="btn btn-ghost" data-action="clear-all">Limpar busca e filtros</button>' +
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
    syncFilters(list.length);
  }

  function activeFilterCount() {
    return (state.min !== null || state.max !== null ? 1 : 0) +
      (state.linhas.length ? 1 : 0) +
      (state.condicoes.length ? 1 : 0);
  }

  // Checkboxes de linha só são recriados quando o grupo muda, para não perder o foco.
  function renderLineOptions() {
    if (linesGrupo === state.grupo) return;
    linesGrupo = state.grupo;
    var lines = JCCore.linesFor(products, state.grupo);
    linhasGroup.hidden = !lines.length;
    linhasBox.innerHTML = lines.map(function (l) {
      return '<label class="chip"><input type="checkbox" name="linha" value="' + JC.escapeHtml(l) + '"><span>' + JC.escapeHtml(l) + "</span></label>";
    }).join("");
  }

  function syncFilters(resultCount) {
    renderLineOptions();
    linhasBox.querySelectorAll("input").forEach(function (cb) { cb.checked = state.linhas.indexOf(cb.value) !== -1; });
    drawer.querySelectorAll("input[name=cond]").forEach(function (cb) { cb.checked = state.condicoes.indexOf(cb.value) !== -1; });
    if (document.activeElement !== minInput) minInput.value = state.min === null ? "" : state.min;
    if (document.activeElement !== maxInput) maxInput.value = state.max === null ? "" : state.max;

    var n = activeFilterCount();
    filterCount.hidden = !n;
    filterCount.textContent = n;
    openBtn.classList.toggle("is-active", n > 0);
    openBtn.setAttribute("aria-label", n ? "Filtros, " + n + " ativo" + (n > 1 ? "s" : "") : "Filtros");
    applyBtn.textContent = resultCount === 1 ? "Ver 1 resultado" : "Ver " + resultCount + " resultados";
  }

  function checkedValues(name) {
    return Array.prototype.map.call(drawer.querySelectorAll("input[name=" + name + "]:checked"), function (cb) { return cb.value; });
  }

  function focusables() {
    return drawer.querySelectorAll("button, input, [href]");
  }

  function onDrawerKey(e) {
    if (e.key === "Escape") return closeFilters();
    if (e.key !== "Tab") return;
    var items = focusables();
    var first = items[0];
    var last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }

  function openFilters() {
    drawer.hidden = false;
    document.body.style.overflow = "hidden";
    openBtn.setAttribute("aria-expanded", "true");
    requestAnimationFrame(function () { drawer.classList.add("open"); });
    document.addEventListener("keydown", onDrawerKey);
    drawer.querySelector(".filter-close").focus();
  }

  function closeFilters() {
    if (drawer.hidden) return;
    drawer.classList.remove("open");
    document.body.style.overflow = "";
    openBtn.setAttribute("aria-expanded", "false");
    document.removeEventListener("keydown", onDrawerKey);
    setTimeout(function () { drawer.hidden = true; }, 350);
    openBtn.focus({ preventScroll: true });
  }

  var priceTimer;
  function applyPrice() {
    clearTimeout(priceTimer);
    setState({ min: JCCore.toPrice(minInput.value), max: JCCore.toPrice(maxInput.value) });
  }
  function onPriceInput() {
    clearTimeout(priceTimer);
    priceTimer = setTimeout(applyPrice, 300);
  }

  function syncControls() {
    tabs.forEach(function (tab) {
      var active = tab.getAttribute("data-grupo") === state.grupo;
      tab.setAttribute("aria-selected", active ? "true" : "false");
      tab.tabIndex = active ? 0 : -1;
      if (active) grid.setAttribute("aria-labelledby", tab.id);
    });
    if (searchInput.value !== state.q) searchInput.value = state.q;
    sortSelect.value = state.ordem;
  }

  function setState(patch) {
    for (var k in patch) state[k] = patch[k];
    if (patch.grupo) {
      // Linhas que não existem no novo grupo deixam de valer.
      var available = JCCore.linesFor(products, state.grupo);
      state.linhas = state.linhas.filter(function (l) { return available.indexOf(l) !== -1; });
    }
    history.replaceState(null, "", location.pathname + JCCore.stateToQuery(state) + "#catalogo");
    syncControls();
    if (products.length) render();
  }

  function selectTab(tab) {
    tab.focus();
    var grupo = tab.getAttribute("data-grupo");
    if (grupo === state.grupo) return;
    setState({ grupo: grupo });
    JC.track("catalog_group", { grupo: grupo });
  }

  tabs.forEach(function (tab, i) {
    tab.addEventListener("click", function () { selectTab(tab); });
    tab.addEventListener("keydown", function (e) {
      var dir = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!dir) return;
      e.preventDefault();
      selectTab(tabs[(i + dir + tabs.length) % tabs.length]);
    });
  });

  searchInput.addEventListener("input", function () {
    setState({ q: searchInput.value });
  });

  sortSelect.addEventListener("change", function () {
    setState({ ordem: sortSelect.value });
    JC.track("catalog_sort", { ordem: sortSelect.value });
  });

  openBtn.addEventListener("click", openFilters);
  drawer.addEventListener("click", function (e) {
    if (e.target.closest("[data-close]")) closeFilters();
  });
  drawer.addEventListener("change", function (e) {
    if (e.target.name === "linha") setState({ linhas: checkedValues("linha") });
    if (e.target.name === "cond") setState({ condicoes: checkedValues("cond") });
  });
  minInput.addEventListener("input", onPriceInput);
  maxInput.addEventListener("input", onPriceInput);
  // Ao sair do campo, aplica o valor pendente na hora (mín > máx é resolvido no filtro).
  minInput.addEventListener("blur", applyPrice);
  maxInput.addEventListener("blur", applyPrice);
  document.getElementById("filterClear").addEventListener("click", function () {
    minInput.value = maxInput.value = "";
    setState({ linhas: [], condicoes: [], min: null, max: null });
  });

  grid.addEventListener("click", function (e) {
    if (e.target.closest("[data-action=clear-all]")) {
      setState({ q: "", linhas: [], condicoes: [], min: null, max: null });
      searchInput.focus();
    }
  });

  syncControls();
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
