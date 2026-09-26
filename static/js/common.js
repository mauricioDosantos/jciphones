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

  var WA_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2a9.9 9.9 0 0 0-8.4 15.14L2 22l5.02-1.6A9.9 9.9 0 1 0 12.04 2zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-2.98.95.95-2.9-.2-.3a8.2 8.2 0 1 1 6.7 3.58z"/><path d="M16.5 14.2c-.3-.15-1.7-.85-2-.95-.25-.1-.45-.15-.63.15-.18.3-.72.95-.88 1.14-.16.2-.32.22-.6.07-.3-.15-1.24-.46-2.36-1.45-.87-.78-1.46-1.74-1.63-2.04-.17-.3-.02-.45.13-.6.13-.13.3-.34.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.63-1.52-.87-2.08-.23-.54-.46-.46-.63-.47h-.54c-.19 0-.5.07-.75.36-.26.3-.99.97-.99 2.36 0 1.39 1.01 2.73 1.15 2.92.14.2 1.98 3.03 4.8 4.25.67.29 1.2.46 1.6.59.68.22 1.3.19 1.78.11.55-.08 1.7-.69 1.94-1.36.24-.67.24-1.25.17-1.37-.07-.12-.26-.2-.55-.34z"/></svg>';

  // Fonte única dos textos de vantagens (home e ficha).
  var VANTAGENS = [
    {
      titulo: "Garantia JC Iphones",
      texto: "Garantia de 1 ano da fábrica ou 6 meses da loja",
      icone: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>'
    },
    {
      titulo: "Forma de pagamento",
      texto: "Pix ou cartão",
      icone: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/>'
    },
    {
      titulo: "Entrega ou retirada",
      texto: "Combine pelo WhatsApp",
      icone: '<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.62l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>',
      wa: "Olá! Gostaria de combinar a entrega ou retirada de um produto."
    }
  ];

  function renderVantagens(el, variant) {
    if (!el) return;
    el.className = "vantagens vantagens-" + (variant || "full");
    el.innerHTML = VANTAGENS.map(function (v, i) {
      var icon = '<span class="vantagem-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + v.icone + "</svg></span>";
      var body = "<strong>" + v.titulo + "</strong><span>" + v.texto + "</span>";
      if (v.wa) {
        return '<a class="vantagem vantagem-link' + (variant === "compact" ? "" : " reveal") + '" style="--d:' + i * 0.08 + 's"' +
          ' data-wa-text="' + escapeHtml(v.wa) + '">' + icon + '<span class="vantagem-body">' + body + "</span></a>";
      }
      return '<div class="vantagem' + (variant === "compact" ? "" : " reveal") + '" style="--d:' + i * 0.08 + 's">' +
        icon + '<span class="vantagem-body">' + body + "</span></div>";
    }).join("");
    bindWaLinks(el);
    observeReveal(el);
  }

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

  function productMessage(p, modelo, cor) {
    var label = p.nome;
    var price = JCCore.hasModels(p) ? JCCore.minPrice(p) : p.preco;
    if (modelo) {
      label += " " + modelo.armazenamento;
      price = modelo.preco;
    }
    if (cor) label += " (" + cor + ")";
    return "Olá! Tenho interesse neste produto: " + label + " (" + CONDICAO_LABEL[p.condicao] + "), " +
      JCCore.formatPrice(price) + ". Ainda está disponível?";
  }

  function conditionTags(p) {
    var html = '<span class="tag tag-' + p.condicao + '">' + CONDICAO_LABEL[p.condicao] + "</span>";
    (p.tags || []).forEach(function (t) {
      html += '<span class="tag tag-extra">' + escapeHtml(t) + "</span>";
    });
    return html;
  }

  function urgencyTag(p) {
    var urgency = JCCore.urgencyLabel(p);
    return urgency ? '<span class="tag tag-urgencia">' + urgency + "</span>" : "";
  }

  function renderTags(p) {
    return conditionTags(p) + urgencyTag(p);
  }

  function renderPrice(p) {
    var html = '<div class="price">';
    if (JCCore.hasModels(p)) {
      if (p.modelos.length > 1) html += '<span class="price-from">A partir de</span>';
      html += '<strong class="price-now">' + JCCore.formatPrice(JCCore.minPrice(p)) + "</strong>";
      html += '<small class="price-installments">' +
        p.modelos.map(function (m) { return escapeHtml(m.armazenamento); }).join(" · ") + "</small>";
      return html + "</div>";
    }
    var discount = JCCore.discountPercent(p);
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
      ' data-price="' + JCCore.minPrice(p) + '" data-list="' + escapeHtml(listName || "catalogo") + '">' +
        '<div class="product-media">' +
          '<img src="' + escapeHtml(p.imagens[0]) + '" alt="' + escapeHtml(p.nome) + '" loading="lazy" width="600" height="600"' +
          ' onerror="this.onerror=null;this.parentNode.classList.add(\'is-broken\')">' +
          '<div class="product-tags">' + conditionTags(p) + "</div>" +
          (JCCore.urgencyLabel(p) ? '<div class="product-urgency">' + urgencyTag(p) + "</div>" : "") +
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
    WA_ICON: WA_ICON,
    waUrl: waUrl,
    track: track,
    bindWaLinks: bindWaLinks,
    observeReveal: observeReveal,
    escapeHtml: escapeHtml,
    loadCatalog: loadCatalog,
    productMessage: productMessage,
    renderTags: renderTags,
    renderPrice: renderPrice,
    renderCard: renderCard,
    renderVantagens: renderVantagens
  };

  document.querySelectorAll("[data-vantagens]").forEach(function (el) {
    renderVantagens(el, el.getAttribute("data-vantagens"));
  });

  bindWaLinks();

  // Página link-na-bio: qual botão foi usado
  document.querySelectorAll("[data-bio]").forEach(function (link) {
    link.addEventListener("click", function () {
      track("bio_click", { destino: link.getAttribute("data-bio") });
    });
  });

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
