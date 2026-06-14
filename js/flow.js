/* =========================================================
   GSM FIXHOUSE — verkoop-wizard + reparatie-catalogus
   (voorbeelddata / indicatieprijzen)
   ========================================================= */
(function () {
  "use strict";
  var BOOK = "#afspraak";
  var SELLURL = "https://wa.me/31639432333";
  var euro = function (n) { return "\u20ac\u00a0" + Math.round(n).toLocaleString("nl-NL"); };

  var DEVART = {
    smartphone: '<svg viewBox="0 0 96 96" fill="none"><rect x="34" y="12" width="28" height="72" rx="7" fill="#17171d" stroke="#2c2c34" stroke-width="1.5"/><rect x="37.5" y="18" width="21" height="56" rx="3" fill="#0f2e1a"/><rect x="37.5" y="18" width="21" height="18" rx="3" fill="#1d4f2b"/><rect x="43" y="14.5" width="10" height="2.4" rx="1.2" fill="#0a0a0d"/><circle cx="48" cy="79" r="1.6" fill="#3a3a44"/></svg>',
    tablet: '<svg viewBox="0 0 96 96" fill="none"><rect x="26" y="14" width="44" height="68" rx="6" fill="#17171d" stroke="#2c2c34" stroke-width="1.5"/><rect x="30" y="20" width="36" height="52" rx="2.5" fill="#0f2e1a"/><rect x="30" y="20" width="36" height="16" rx="2.5" fill="#1d4f2b"/><circle cx="48" cy="17" r="1" fill="#3a3a44"/><circle cx="48" cy="77" r="2" fill="none" stroke="#3a3a44" stroke-width="1.2"/></svg>',
    laptop: '<svg viewBox="0 0 96 96" fill="none"><rect x="22" y="24" width="52" height="34" rx="3" fill="#17171d" stroke="#2c2c34" stroke-width="1.5"/><rect x="26" y="28" width="44" height="26" rx="1.5" fill="#0f2e1a"/><rect x="26" y="28" width="44" height="9" fill="#1d4f2b"/><path d="M14 58 h68 l5 8 a3 3 0 0 1 -3 4 H12 a3 3 0 0 1 -3 -4 z" fill="#1a1a20" stroke="#2c2c34" stroke-width="1.2"/><rect x="40" y="61" width="16" height="2.4" rx="1.2" fill="#2c2c34"/></svg>',
    computer: '<svg viewBox="0 0 96 96" fill="none"><rect x="16" y="16" width="64" height="44" rx="4" fill="#17171d" stroke="#2c2c34" stroke-width="1.5"/><rect x="20" y="20" width="56" height="36" rx="2" fill="#0f2e1a"/><rect x="20" y="20" width="56" height="12" fill="#1d4f2b"/><rect x="43" y="60" width="10" height="9" fill="#1a1a20"/><rect x="32" y="70" width="32" height="5" rx="2.5" fill="#1a1a20" stroke="#2c2c34" stroke-width="1"/></svg>',
    console: '<svg viewBox="0 0 96 96" fill="none"><path d="M30 40 q-10 0 -13 14 q-3 14 7 16 q7 1.5 11 -7 h26 q4 8.5 11 7 q10 -2 7 -16 q-3 -14 -13 -14 z" fill="#17171d" stroke="#2c2c34" stroke-width="1.5"/><rect x="29.5" y="50" width="3" height="11" rx="1.5" fill="#2c2c34"/><rect x="25.5" y="54" width="11" height="3" rx="1.5" fill="#2c2c34"/><circle cx="62" cy="52" r="2.4" fill="#36b349"/><circle cx="69" cy="58" r="2.4" fill="#36b349"/><circle cx="55" cy="58" r="2.4" fill="#2c2c34"/><circle cx="62" cy="64" r="2.4" fill="#2c2c34"/></svg>',
    smartwatch: '<svg viewBox="0 0 96 96" fill="none"><rect x="40" y="8" width="16" height="16" rx="4" fill="#1a1a20"/><rect x="40" y="72" width="16" height="16" rx="4" fill="#1a1a20"/><rect x="32" y="24" width="32" height="48" rx="10" fill="#17171d" stroke="#2c2c34" stroke-width="1.5"/><rect x="36" y="29" width="24" height="38" rx="6" fill="#0f2e1a"/><rect x="36" y="29" width="24" height="13" rx="6" fill="#1d4f2b"/><rect x="64" y="40" width="3" height="9" rx="1.5" fill="#2c2c34"/></svg>'
  };
  var ART_BY_CAT = { Smartphone: "smartphone", Tablet: "tablet", Laptop: "laptop", Console: "console", Smartwatch: "smartwatch", Computer: "computer",
    telefoon: "smartphone", tablet: "tablet", smartwatch: "smartwatch", laptop: "laptop" };
  var art = function (key) { return DEVART[ART_BY_CAT[key] || key] || DEVART.smartphone; };
  var slug = function (s) {
    return String(s).toLowerCase()
      .replace(/["'\u201d\u201c]/g, "")
      .replace(/[\/]+/g, "-")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };
  var photo = function (name) {
    var s = slug(name);
    return '<img class="dev-photo" src="assets/devices/' + s + '.png" alt="' + name + '" loading="lazy" onload="var a=this.closest(\'.dev-art\');a&&a.classList.add(\'has-photo\')" onerror="if(this.dataset.fb){this.remove();}else{this.dataset.fb=1;this.src=\'assets/devices/' + s + '.jpg\';}">';
  };

  /* ---------- roterend hero-woord ---------- */
  (function rotate() {
    var el = document.getElementById("rotateWord");
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var words = ["iPhone", "Samsung", "iPad", "MacBook", "PlayStation"];
    var i = 0;
    setInterval(function () {
      el.classList.add("is-swap");
      setTimeout(function () {
        i = (i + 1) % words.length;
        el.textContent = words[i];
        el.classList.remove("is-swap");
      }, 350);
    }, 2300);
  })();

  /* ===================== VERKOOP WIZARD ===================== */
  var ICON = {
    phone: '<rect x="15" y="4" width="18" height="40" rx="4"/><line x1="21" y1="39" x2="27" y2="39"/>',
    tablet: '<rect x="10" y="6" width="28" height="36" rx="4"/><line x1="24" y1="36" x2="24" y2="36.2"/>',
    watch: '<rect x="15" y="14" width="18" height="20" rx="4"/><line x1="19" y1="14" x2="20" y2="7"/><line x1="29" y1="14" x2="28" y2="7"/><line x1="19" y1="34" x2="20" y2="41"/><line x1="29" y1="34" x2="28" y2="41"/>',
    laptop: '<rect x="9" y="10" width="30" height="20" rx="2"/><path d="M5 38 h38 l-3 -8 H8 z"/>'
  };
  var SELL = (window.GSMFIX_CATALOG && window.GSMFIX_CATALOG.SELL) || {};

  var sellApp = document.getElementById("sellApp");
  if (sellApp) {
    var S = { cat: null, brand: null, model: null, base: 0, storage: null, cond: null };
    var catName = function (id) { var c = SELL.categories.filter(function (x) { return x.id === id; })[0]; return c ? c.name : id; };
    var stepIndex = function () {
      if (!S.cat) return 0; if (!S.brand) return 1; if (!S.model) return 2;
      if (S.storage === null) return 3; if (S.cond === null) return 4; return 5;
    };
    var eco = '<div class="eco"><svg viewBox="0 0 24 24"><path d="M12 3C7 3 4 7 4 12c4 0 8-1 11-4-2 4-5 6-9 7 1 .6 3 1 5 1 5 0 7-4 7-9 0-2-1-4-6-4z"/></svg> Je bespaart het milieu, gemiddeld 233 gram e-waste.</div>';

    var render = function () {
      var i = stepIndex();
      var html = '<div class="flow-progress"><span style="width:' + (i / 5 * 100) + '%"></span></div>';
      if (i > 0) html += '<button class="flow-back" type="button" data-back>\u2039 Vorige stap</button>';

      if (i === 0) {
        html += '<h2 class="flow-crumb">Wat wil je verkopen?</h2><p class="flow-q">Kies de categorie van je toestel.</p><div class="sell-grid">';
        SELL.categories.forEach(function (c) {
          html += '<button class="sell-cat" type="button" data-cat="' + c.id + '"><span class="dev-art">' + art(c.id) + '</span><h4>' + c.name + '</h4><p>' + c.sub + '</p></button>';
        });
        html += '</div>';
      } else if (i === 1) {
        html += '<h2 class="flow-crumb">Welk merk?</h2><p class="flow-q">Kies het merk van je ' + catName(S.cat).toLowerCase() + '.</p><div class="flow-chips">';
        SELL.brands[S.cat].forEach(function (b) { html += '<button class="flow-chip" type="button" data-brand="' + b + '">' + b + '</button>'; });
        html += '</div>';
      } else if (i === 2) {
        html += '<h2 class="flow-crumb">Welk model?</h2><p class="flow-q">' + S.brand + ' ' + catName(S.cat).toLowerCase() + '.</p><div class="model-grid">';
        (SELL.models[S.brand + "|" + S.cat] || []).forEach(function (m) {
          html += '<button class="model-card" type="button" data-model="' + m[0] + '" data-base="' + m[1] + '"><span class="dev-art">' + art(S.cat) + photo(m[0]) + '</span><h4>' + m[0] + '</h4><div class="model-card__price">tot <strong>' + euro(m[1]) + '</strong></div></button>';
        });
        html += '</div>';
      } else if (i === 3) {
        html += '<h2 class="flow-crumb">' + S.model + ' verkopen</h2><p class="flow-q">Wat is de opslagcapaciteit?</p><div class="flow-chips">';
        SELL.storage.forEach(function (s, idx) { html += '<button class="flow-chip" type="button" data-storage="' + idx + '">' + s[0] + '</button>'; });
        html += '</div><div class="flow-note"><strong>Hoe controleer je dit?</strong> Te vinden via Instellingen &rsaquo; Algemeen &rsaquo; Opslag.</div>' + eco;
      } else if (i === 4) {
        html += '<h2 class="flow-crumb">' + S.model + ' verkopen</h2><p class="flow-q">Wat is de staat van je toestel?</p><div class="cond"><div class="cond__opts">';
        SELL.conditions.forEach(function (c, idx) {
          html += '<button class="cond__opt" type="button" data-cond="' + idx + '"><strong>' + c[0] + '</strong><span>' + c[1] + '</span></button>';
        });
        html += '</div></div>' + eco;
      } else {
        var base = S.base + SELL.storage[S.storage][1];
        var val = base * SELL.conditions[S.cond][2];
        var low = Math.max(10, Math.round(val * 0.92 / 5) * 5);
        var high = Math.round(val * 1.05 / 5) * 5;
        html += '<div class="result"><div class="result__label">Geschatte opbrengst</div>' +
          '<div class="result__price"><em>' + euro(low) + " \u2013 " + euro(high) + '</em></div>' +
          '<p class="result__device">' + S.model + ' \u00b7 ' + SELL.storage[S.storage][0] + ' \u00b7 ' + SELL.conditions[S.cond][0] + '</p>' +
          '<div class="result__actions"><a class="btn btn--primary btn--lg" href="' + SELLURL + '">Verkoop nu</a>' +
          '<button class="btn btn--line btn--lg" type="button" data-restart>Opnieuw</button></div>' +
          '<p class="result__fine">Indicatie op basis van voorbeelddata. De definitieve prijs zie je in de offici\u00eble tool.</p></div>';
      }
      sellApp.innerHTML = html;
    };

    sellApp.addEventListener("click", function (e) {
      var t = e.target.closest("button"); if (!t) return;
      if (t.hasAttribute("data-back")) {
        if (S.cond !== null) S.cond = null;
        else if (S.storage !== null) S.storage = null;
        else if (S.model) { S.model = null; S.base = 0; }
        else if (S.brand) S.brand = null;
        else if (S.cat) S.cat = null;
        return render();
      }
      if (t.dataset.cat) { S.cat = t.dataset.cat; return render(); }
      if (t.dataset.brand) { S.brand = t.dataset.brand; return render(); }
      if (t.dataset.model) { S.model = t.dataset.model; S.base = parseFloat(t.dataset.base); return render(); }
      if (t.dataset.storage !== undefined && t.dataset.storage !== "") { S.storage = parseInt(t.dataset.storage, 10); return render(); }
      if (t.dataset.cond !== undefined && t.dataset.cond !== "") { S.cond = parseInt(t.dataset.cond, 10); return render(); }
      if (t.hasAttribute("data-restart")) { S = { cat: null, brand: null, model: null, base: 0, storage: null, cond: null }; return render(); }
    });
    render();
  }

  /* ===================== REPARATIE-CATALOGUS ===================== */
  var REPAIR = (window.GSMFIX_CATALOG && window.GSMFIX_CATALOG.REPAIR) || { cats: [], devices: [] };

  var repairApp = document.getElementById("repairApp");
  if (repairApp) {
    var state = { q: "", cat: "Alle", brand: "Alle" };
    var grid = repairApp.querySelector("#repairGrid");
    var brandsBox = document.getElementById("repairBrands");
    var modal = document.getElementById("repairModal");
    var minPrice = function (reps) { return Math.min.apply(null, reps.map(function (r) { return r[1]; })); };

    var BRANDS = [
      ["Apple", /^(iphone|ipad|macbook|apple)/i], ["Samsung", /^samsung/i],
      ["Motorola", /^(moto|motorola)/i], ["Huawei", /^huawei/i], ["OnePlus", /^oneplus/i],
      ["Google", /^(google|pixel)/i], ["Nokia", /^nokia/i], ["Xiaomi", /^xiaomi/i], ["Oppo", /^oppo/i],
      ["Microsoft", /^(microsoft|surface)/i], ["Sony", /^sony/i], ["PlayStation", /^playstation/i],
      ["Xbox", /^xbox/i], ["Nintendo", /^nintendo/i], ["Windows", /^windows/i], ["PC", /^computer/i]
    ];
    var brandOf = function (name) {
      for (var i = 0; i < BRANDS.length; i++) if (BRANDS[i][1].test(name)) return BRANDS[i][0];
      return "Overig";
    };
    var renderBrands = function () {
      if (!brandsBox) return;
      if (state.cat === "Alle") { brandsBox.hidden = true; brandsBox.innerHTML = ""; return; }
      var list = [];
      REPAIR.devices.forEach(function (d) {
        if (d[0] !== state.cat) return;
        var b = brandOf(d[1]);
        if (list.indexOf(b) === -1) list.push(b);
      });
      if (list.length <= 1) { brandsBox.hidden = true; brandsBox.innerHTML = ""; return; }
      var html = '<span class="repair-brands__label">Merk</span>' +
        '<button class="flow-chip' + (state.brand === "Alle" ? " is-on" : "") + '" type="button" data-brand="Alle">Alle</button>';
      list.forEach(function (b) {
        html += '<button class="flow-chip' + (state.brand === b ? " is-on" : "") + '" type="button" data-brand="' + b + '">' + b + '</button>';
      });
      brandsBox.innerHTML = html;
      brandsBox.hidden = false;
    };

    var draw = function () {
      var q = state.q.toLowerCase();
      var rows = REPAIR.devices.filter(function (d) {
        var okCat = state.cat === "Alle" || d[0] === state.cat;
        var okBrand = state.brand === "Alle" || brandOf(d[1]) === state.brand;
        var okQ = !q || (d[1] + " " + d[0]).toLowerCase().indexOf(q) > -1;
        return okCat && okBrand && okQ;
      });
      if (!rows.length) { grid.innerHTML = '<p class="repair-empty">Geen toestel gevonden. Probeer een andere zoekterm.</p>'; return; }
      grid.innerHTML = rows.map(function (d) {
        var i = REPAIR.devices.indexOf(d);
        return '<button class="repair-dev" type="button" data-i="' + i + '"><span class="dev-art">' + art(d[0]) + photo(d[1]) + '</span><span class="repair-dev__cat">' + d[0] + '</span><h4>' + d[1] + '</h4><span class="repair-dev__from">vanaf <strong>' + euro(minPrice(d[2])) + '</strong></span></button>';
      }).join("");
    };

    var openModal = function (i) {
      var d = REPAIR.devices[i];
      var rows = d[2].map(function (r) { return '<div class="repair-list__row"><span>' + r[0] + '</span><strong>' + euro(r[1]) + '</strong></div>'; }).join("");
      modal.querySelector(".repair-modal__panel").innerHTML =
        '<button class="repair-modal__close" type="button" data-close aria-label="Sluiten">\u00d7</button>' +
        '<div class="repair-modal__cat">' + d[0] + '</div><h3>' + d[1] + '</h3>' +
        '<p class="repair-modal__fine">Indicatieprijzen. De exacte prijs hoor je na de gratis diagnose.</p>' +
        '<div class="repair-list">' + rows + '</div>' +
        '<a class="btn btn--primary btn--full" href="' + BOOK + '">Plan reparatie voor ' + d[1] + '</a>';
      modal.classList.add("is-open");
      document.body.style.overflow = "hidden";
    };
    var closeModal = function () { modal.classList.remove("is-open"); document.body.style.overflow = ""; };

    var search = repairApp.querySelector("#repairSearch");
    if (search) search.addEventListener("input", function () { state.q = this.value; draw(); });
    repairApp.addEventListener("click", function (e) {
      var chip = e.target.closest("[data-cat]");
      if (chip) {
        state.cat = chip.dataset.cat;
        state.brand = "Alle";
        repairApp.querySelectorAll("[data-cat]").forEach(function (c) { c.classList.toggle("is-on", c === chip); });
        renderBrands();
        return draw();
      }
      var bchip = e.target.closest("[data-brand]");
      if (bchip) {
        state.brand = bchip.dataset.brand;
        brandsBox.querySelectorAll("[data-brand]").forEach(function (c) { c.classList.toggle("is-on", c === bchip); });
        return draw();
      }
      var dev = e.target.closest(".repair-dev");
      if (dev) return openModal(parseInt(dev.dataset.i, 10));
    });
    if (modal) {
      modal.addEventListener("click", function (e) { if (e.target === modal || e.target.closest("[data-close]")) closeModal(); });
      document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });
    }
    var initCat = new URLSearchParams(location.search).get("cat");
    if (initCat) {
      var initChip = repairApp.querySelector('[data-cat="' + initCat + '"]');
      if (initChip) {
        state.cat = initCat;
        repairApp.querySelectorAll("[data-cat]").forEach(function (c) { c.classList.toggle("is-on", c === initChip); });
      }
    }
    renderBrands();
    draw();
  }
})();
