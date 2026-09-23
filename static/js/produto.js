// Ficha do produto (produto.html?p=slug).
(function () {
  var CATALOG_URL = "data/catalogo.json";

  var root = document.getElementById("produto");
  if (!root) return;

  var slug = new URLSearchParams(location.search).get("p");

  function notFound() {
    document.title = "Produto não encontrado | JC Iphones";
    root.innerHTML =
      '<div class="catalog-state">' +
        "<h3>Produto não encontrado ou já vendido</h3>" +
        "<p>Esta unidade pode ter acabado de sair. Veja o que temos disponível ou pergunte pelo WhatsApp.</p>" +
        '<div class="state-actions">' +
          '<a class="btn btn-primary" href="./#catalogo">Ver catálogo</a>' +
          '<a class="btn btn-whatsapp" data-wa-text="Olá! Procurei um produto no site e não encontrei. Podem me ajudar?">Falar no WhatsApp</a>' +
        "</div>" +
      "</div>";
    JC.bindWaLinks(root);
  }

  function renderSpecs(p) {
    if (!p.especificacoes || !p.especificacoes.length) return "";
    return '<section class="pd-specs"><h2>Especificações técnicas</h2><dl>' +
      p.especificacoes.map(function (e) {
        return "<div><dt>" + JC.escapeHtml(e.rotulo) + "</dt><dd>" + JC.escapeHtml(e.valor) + "</dd></div>";
      }).join("") +
      "</dl></section>";
  }

  function renderProduct(p) {
    root.innerHTML =
      '<div class="pd">' +
        '<div class="pd-gallery" id="pdGallery">' +
          '<div class="pd-main product-media"><img src="' + JC.escapeHtml(p.imagens[0]) + '" alt="' + JC.escapeHtml(p.nome) + '" width="600" height="600"' +
          ' onerror="this.onerror=null;this.parentNode.classList.add(\'is-broken\')"></div>' +
        "</div>" +
        '<div class="pd-info">' +
          '<div class="pd-tags">' + JC.renderTags(p) + "</div>" +
          '<h1 class="pd-name">' + JC.escapeHtml(p.nome) + "</h1>" +
          JC.renderPrice(p) +
          '<a class="btn btn-whatsapp btn-lg btn-block pd-cta" id="pdCta" data-wa-location="ficha" data-item-id="' + JC.escapeHtml(p.slug) + '"' +
          ' data-wa-text="' + JC.escapeHtml(JC.productMessage(p)) + '">' + JC.WA_ICON + "Garantir sua unidade</a>" +
          '<p class="pd-cta-note">Resposta rápida pelo WhatsApp · Seg a dom, 8h às 18h</p>' +
          '<div id="pdVantagens"></div>' +
          renderSpecs(p) +
        "</div>" +
      "</div>";
    JC.bindWaLinks(root);
  }

  function updateMeta(p) {
    document.title = p.nome + " | JC Iphones";
    var description = p.nome + " " + JC.CONDICAO_LABEL[p.condicao].toLowerCase() + " por " + JCCore.formatPrice(p.preco) +
      " na JC Iphones, em José de Freitas - PI.";
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", description);
  }

  JC.loadCatalog(CATALOG_URL)
    .then(function (catalog) {
      var p = catalog.produtos.filter(function (item) { return item.slug === slug; })[0];
      if (!p || !JCCore.isAvailable(p)) return notFound();

      renderProduct(p);
      updateMeta(p);
      JC.track("view_item", {
        currency: "BRL",
        value: p.preco,
        items: [{ item_id: p.slug, item_name: p.nome, item_category: p.tipo, price: p.preco }]
      });
    })
    .catch(function (err) {
      console.error("[ficha]", err);
      notFound();
    });
})();
