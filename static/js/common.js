(function () {
  var WA_NUMBER = "5511999999999";

  function waUrl(message) {
    return "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(message);
  }

  function track(eventName, params) {
    if (typeof gtag === "function") gtag("event", eventName, params || {});
  }

  function linkLocation(link) {
    var area = link.closest("section, footer, nav, main");
    return area ? area.id || area.tagName.toLowerCase() : "unknown";
  }

  function bindWaLinks(root) {
    (root || document).querySelectorAll("[data-wa-text]:not([data-wa-bound])").forEach(function (link) {
      link.setAttribute("data-wa-bound", "");
      link.href = waUrl(link.getAttribute("data-wa-text"));
      link.target = "_blank";
      link.rel = "noopener";
      link.addEventListener("click", function () {
        track("whatsapp_click", {
          link_text: link.getAttribute("data-wa-text"),
          link_location: link.getAttribute("data-wa-location") || linkLocation(link),
          item_id: link.getAttribute("data-item-id") || undefined
        });
      });
    });
  }

  var revealObserver = "IntersectionObserver" in window
    ? new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" })
    : null;

  function observeReveal(root) {
    (root || document).querySelectorAll(".reveal:not(.in)").forEach(function (el) {
      if (revealObserver) revealObserver.observe(el);
      else el.classList.add("in");
    });
  }

  var HTML_ESCAPES = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

  function escapeHtml(str) {
    return String(str == null ? "" : str).replace(/[&<>"']/g, function (c) { return HTML_ESCAPES[c]; });
  }

  var CONDICAO_LABEL = { novo: "Novo", seminovo: "Seminovo" };

  var catalogCache = {};

  // Carrega o JSON do catálogo; produtos com erro são descartados com aviso no console.
  function loadCatalog(url) {
    if (!catalogCache[url]) {
      catalogCache[url] = fetch(url, { cache: "no-cache" })
        .then(function (res) {
          if (!res.ok) throw new Error("HTTP " + res.status + " ao carregar " + url);
          return res.json();
        })
        .then(function (json) {
          if (!json || !Array.isArray(json.produtos)) throw new Error('catálogo sem a lista "produtos"');
          json.produtos = json.produtos.filter(function (p, i) {
            var errors = JCCore.validateProduct(p);
            if (errors.length) console.warn("[catálogo] produto ignorado (" + ((p && p.slug) || "#" + (i + 1)) + "): " + errors.join("; "));
            return !errors.length;
          });
          return json;
        });
      catalogCache[url].catch(function () { delete catalogCache[url]; });
    }
    return catalogCache[url];
  }

  function productMessage(p) {
    return "Olá! Tenho interesse no " + p.nome + " (" + CONDICAO_LABEL[p.condicao] + ") por " +
      JCCore.formatPrice(p.preco) + ". Ainda está disponível?";
  }

  function renderTags(p) {
    var html = '<span class="tag tag-' + p.condicao + '">' + CONDICAO_LABEL[p.condicao] + "</span>";
    (p.tags || []).forEach(function (t) {
      html += '<span class="tag tag-extra">' + escapeHtml(t) + "</span>";
    });
    var urgency = JCCore.urgencyLabel(p);
    if (urgency) html += '<span class="tag tag-urgencia">' + urgency + "</span>";
    return html;
  }

  function renderPrice(p) {
    var discount = JCCore.discountPercent(p);
    var html = '<div class="price">';
    if (discount) {
      html += '<div class="price-old"><s>' + JCCore.formatPrice(p.precoOriginal) + '</s> <span class="tag tag-promo">-' + discount + "%</span></div>";
    }
    html += '<strong class="price-now">' + JCCore.formatPrice(p.preco) + "</strong>";
    if (p.parcelamento) html += '<small class="price-installments">ou ' + escapeHtml(p.parcelamento) + "</small>";
    return html + "</div>";
  }

  function renderCard(p, listName) {
    return '<a class="product-card reveal" href="produto.html?p=' + encodeURIComponent(p.slug) + '"' +
      ' data-slug="' + escapeHtml(p.slug) + '" data-name="' + escapeHtml(p.nome) + '"' +
      ' data-price="' + p.preco + '" data-list="' + escapeHtml(listName || "catalogo") + '">' +
        '<div class="product-media">' +
          '<img src="' + escapeHtml(p.imagens[0]) + '" alt="' + escapeHtml(p.nome) + '" loading="lazy" width="600" height="600"' +
          ' onerror="this.onerror=null;this.parentNode.classList.add(\'is-broken\')">' +
          '<div class="product-tags">' + renderTags(p) + "</div>" +
        "</div>" +
        '<div class="product-body">' +
          '<h3 class="product-name">' + escapeHtml(p.nome) + "</h3>" +
          renderPrice(p) +
          '<span class="btn btn-primary btn-sm product-more">Saiba mais</span>' +
        "</div>" +
      "</a>";
  }

  document.addEventListener("click", function (e) {
    var card = e.target.closest && e.target.closest(".product-card");
    if (!card) return;
    track("select_item", {
      item_list_name: card.getAttribute("data-list"),
      items: [{ item_id: card.getAttribute("data-slug"), item_name: card.getAttribute("data-name"), price: Number(card.getAttribute("data-price")) }]
    });
  });

  window.JC = {
    WA_NUMBER: WA_NUMBER,
    CONDICAO_LABEL: CONDICAO_LABEL,
    waUrl: waUrl,
    track: track,
    bindWaLinks: bindWaLinks,
    observeReveal: observeReveal,
    escapeHtml: escapeHtml,
    loadCatalog: loadCatalog,
    productMessage: productMessage,
    renderTags: renderTags,
    renderPrice: renderPrice,
    renderCard: renderCard
  };

  bindWaLinks();

  // Cliques em navegação (menu desktop e mobile)
  document.querySelectorAll("nav a[href*='#'], #mobileMenu a[href*='#']").forEach(function (link) {
    link.addEventListener("click", function () {
      track("nav_click", { link_text: link.textContent.trim(), link_url: link.getAttribute("href") });
    });
  });

  // Cliques em qualquer outro botão/CTA da página
  document.querySelectorAll(".btn:not([data-wa-text])").forEach(function (btn) {
    btn.addEventListener("click", function () {
      track("cta_click", { link_text: btn.textContent.trim() });
    });
  });

  // Visualização de cada seção (funil de rolagem por bloco)
  if ("IntersectionObserver" in window) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && entry.target.id) {
          track("section_view", { section_id: entry.target.id });
          sectionObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    document.querySelectorAll("main section[id]").forEach(function (section) {
      sectionObserver.observe(section);
    });
  }

  // Profundidade de rolagem (25/50/75/100%)
  (function () {
    var marks = [25, 50, 75, 100];
    var fired = {};
    window.addEventListener("scroll", function () {
      var scrollable = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollable <= 0) return;
      var pct = Math.round((window.scrollY / scrollable) * 100);
      marks.forEach(function (mark) {
        if (pct >= mark && !fired[mark]) {
          fired[mark] = true;
          track("scroll_depth", { percent: mark });
        }
      });
    }, { passive: true });
  })();

  // Tempo de permanência na página (ping a cada 30s enquanto visível)
  (function () {
    var seconds = 0;
    setInterval(function () {
      if (document.visibilityState === "visible") {
        seconds += 30;
        track("time_on_page", { seconds: seconds });
      }
    }, 30000);
  })();

  var year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  var nav = document.getElementById("nav");
  if (nav) {
    var onScroll = function () {
      if (window.scrollY > 12) nav.classList.add("scrolled");
      else nav.classList.remove("scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  var toggle = document.getElementById("navToggle");
  var menu = document.getElementById("mobileMenu");
  if (toggle && menu) {
    var iconClose = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
    var iconOpen = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="18" y2="18"/></svg>';

    var setMenu = function (open) {
      menu.classList.toggle("open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Fechar menu" : "Abrir menu");
      toggle.innerHTML = open ? iconClose : iconOpen;
    };

    toggle.addEventListener("click", function () {
      setMenu(!menu.classList.contains("open"));
    });

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        setMenu(false);
      });
    });
  }

  observeReveal();
})();
