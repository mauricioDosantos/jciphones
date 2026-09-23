// Ficha do produto (produto.html?p=slug).
(function () {
  var CATALOG_URL = "data/catalogo.json";

  var root = document.getElementById("produto");
  if (!root) return;

  var slug = new URLSearchParams(location.search).get("p");
  bindBackLink();

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
        renderGallery(p) +
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
    bindGallery();
    renderStickyBar(p);
  }

  // Celular: repete preço + CTA no rodapé enquanto o botão principal está fora da tela.
  function renderStickyBar(p) {
    var cta = document.getElementById("pdCta");
    if (!("IntersectionObserver" in window) || !cta) return;
    var bar = document.createElement("div");
    bar.className = "pd-bar";
    bar.innerHTML =
      '<div class="pd-bar-price"><small>' + JC.escapeHtml(p.nome) + "</small><strong>" + JCCore.formatPrice(p.preco) + "</strong></div>" +
      '<a class="btn btn-whatsapp" data-wa-location="ficha_barra" data-item-id="' + JC.escapeHtml(p.slug) + '"' +
      ' data-wa-text="' + JC.escapeHtml(JC.productMessage(p)) + '">Garantir sua unidade</a>';
    document.body.appendChild(bar);
    document.body.classList.add("has-pd-bar");
    JC.bindWaLinks(bar);

    new IntersectionObserver(function (entries) {
      bar.classList.toggle("is-visible", !entries[0].isIntersecting);
    }).observe(cta);
  }

  function renderGallery(p) {
    var many = p.imagens.length > 1;
    var slides = p.imagens.map(function (src, i) {
      return '<div class="pd-slide product-media"><img src="' + JC.escapeHtml(src) + '"' +
        ' alt="' + JC.escapeHtml(p.nome) + (many ? " — foto " + (i + 1) + " de " + p.imagens.length : "") + '"' +
        ' width="600" height="600"' + (i ? ' loading="lazy"' : "") +
        ' onerror="this.onerror=null;this.parentNode.classList.add(\'is-broken\')"></div>';
    }).join("");
    if (!many) return '<div class="pd-gallery"><div class="pd-track">' + slides + "</div></div>";

    var dots = p.imagens.map(function (_, i) {
      return '<span class="pd-dot' + (i ? "" : " is-active") + '"></span>';
    }).join("");
    var thumbs = p.imagens.map(function (src, i) {
      return '<button type="button" class="pd-thumb" data-index="' + i + '" aria-label="Ver foto ' + (i + 1) + " de " + p.imagens.length + '"' +
        (i ? "" : ' aria-current="true"') + '><img src="' + JC.escapeHtml(src) + '" alt="" loading="lazy" width="120" height="120"></button>';
    }).join("");
    return '<div class="pd-gallery">' +
      '<div class="pd-track" tabindex="0" aria-label="Fotos do produto, deslize para ver mais">' + slides + "</div>" +
      '<div class="pd-dots" aria-hidden="true">' + dots + "</div>" +
      '<div class="pd-thumbs">' + thumbs + "</div>" +
    "</div>";
  }

  function bindGallery() {
    var track = root.querySelector(".pd-track");
    var thumbs = root.querySelectorAll(".pd-thumb");
    var dots = root.querySelectorAll(".pd-dot");
    if (!thumbs.length) return;

    function setActive(index) {
      thumbs.forEach(function (t, i) {
        if (i === index) t.setAttribute("aria-current", "true");
        else t.removeAttribute("aria-current");
      });
      dots.forEach(function (d, i) { d.classList.toggle("is-active", i === index); });
    }

    var ticking = false;
    track.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(function () {
        setActive(Math.round(track.scrollLeft / track.clientWidth));
        ticking = false;
      });
    }, { passive: true });

    thumbs.forEach(function (thumb) {
      thumb.addEventListener("click", function () {
        var index = Number(thumb.getAttribute("data-index"));
        track.scrollTo({ left: index * track.clientWidth, behavior: "smooth" });
        setActive(index);
      });
    });
  }

  function renderRelated(products, p) {
    var related = JCCore.relatedProducts(products, p, 4);
    if (!related.length) return;
    var section = document.getElementById("relacionados");
    var relatedGrid = document.getElementById("relatedGrid");
    relatedGrid.innerHTML = related.map(function (item) { return JC.renderCard(item, "relacionados"); }).join("");
    section.hidden = false;
    JC.observeReveal(relatedGrid);
  }

  // Vindo do catálogo, "voltar" usa o histórico: restaura filtros (URL) e a posição de rolagem.
  function bindBackLink() {
    var back = document.getElementById("backLink");
    var ref;
    try { ref = new URL(document.referrer); } catch (e) { return; }
    var dir = location.pathname.replace(/produto\.html$/, "");
    var fromHome = ref.origin === location.origin && (ref.pathname === dir || ref.pathname === dir + "index.html");
    if (!back || !fromHome || history.length < 2) return;
    back.addEventListener("click", function (e) {
      e.preventDefault();
      history.back();
    });
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
      renderRelated(catalog.produtos, p);
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
