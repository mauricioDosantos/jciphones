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

  window.JC = {
    WA_NUMBER: WA_NUMBER,
    waUrl: waUrl,
    track: track,
    bindWaLinks: bindWaLinks,
    observeReveal: observeReveal
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
