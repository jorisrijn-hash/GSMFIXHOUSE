/* =========================================================
   GSM FIXHOUSE — /admin  facturatie
   Zoek toestel + dienst  ->  NAW klant  ->  print factuur + bonnetje
   Self-contained: gebruikt alleen de gedeelde catalogus (catalog.js).
   ========================================================= */
(function () {
  "use strict";

  /* ===================== INSTELLINGEN (PAS AAN) ===================== */
  // Inloggegevens voor /admin (alleen voor intern gebruik in de winkel).
  var ADMIN_USER = "GSMFIXHOUSE";
  var ADMIN_PASS = "GSMFIX123";

  // Bedrijfsgegevens op factuur + bonnetje.
  // >>> Vul KvK, BTW-nummer en IBAN in voor een rechtsgeldige factuur. <<<
  var BEDRIJF = {
    naam: "GSM Fixhouse",
    email: "info@gsmfixhouse.nl",
    website: "gsmfixhouse.nl",
    kvk: "92318444",                 // <-- KvK-nummer invullen
    btwId: "NL004948343B14",         // <-- BTW-identificatienummer invullen
    iban: "NL00 BANK 0000 0000 00",  // <-- IBAN invullen
    vestigingen: {
      Leiden:  { straat: "Haarlemmerstraat 226", postcode: "2312 GJ", plaats: "Leiden",  tel: "06 39432333" },
      Katwijk: { straat: "Princestraat 24B",     postcode: "2225 GC", plaats: "Katwijk", tel: "06 22444556" }
    }
  };

  var BTW_TARIEF = 21;            // BTW-percentage (NL standaard 21%)
  var PRIJZEN_INCL_BTW = true;    // catalogusprijzen zijn incl. BTW (consumentprijs)
  var GARANTIE_TEKST = "6 maanden garantie op de uitgevoerde reparatie. No cure, no pay.";

  /* ===================== CATALOGUS ===================== */
  var CAT = window.GSMFIX_CATALOG || { REPAIR: { cats: [], devices: [] } };
  var REPAIR = CAT.REPAIR;

  /* ===================== HELPERS ===================== */
  var $ = function (sel, root) { return (root || document).querySelector(sel); };
  var _dec = document.createElement("textarea");
  var decode = function (s) { _dec.innerHTML = String(s); return _dec.value; };
  var esc = function (s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };
  var euro = function (n) {
    var v = (Math.round(n * 100) / 100);
    return "\u20ac\u00a0" + v.toLocaleString("nl-NL", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };
  var num = function (v) { var n = parseFloat(String(v).replace(",", ".")); return isNaN(n) ? 0 : n; };
  var slug = function (s) {
    return String(decode(s)).toLowerCase()
      .replace(/["'\u201d\u201c]/g, "").replace(/[\/]+/g, "-")
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  };
  var pad4 = function (n) { return String(n).padStart(4, "0"); };
  var todayISO = function () {
    var d = new Date(), z = function (x) { return String(x).padStart(2, "0"); };
    return d.getFullYear() + "-" + z(d.getMonth() + 1) + "-" + z(d.getDate());
  };
  var nlDate = function (iso) {
    if (!iso) return "";
    var p = iso.split("-"); return p.length === 3 ? p[2] + "-" + p[1] + "-" + p[0] : iso;
  };

  /* category device-art (overgenomen uit de huisstijl voor visuele samenhang) */
  var DEVART = {
    Smartphone: '<svg viewBox="0 0 96 96" fill="none"><rect x="34" y="12" width="28" height="72" rx="7" fill="#17171d" stroke="#2c2c34" stroke-width="1.5"/><rect x="37.5" y="18" width="21" height="56" rx="3" fill="#0f2e1a"/><rect x="37.5" y="18" width="21" height="18" rx="3" fill="#1d4f2b"/><rect x="43" y="14.5" width="10" height="2.4" rx="1.2" fill="#0a0a0d"/><circle cx="48" cy="79" r="1.6" fill="#3a3a44"/></svg>',
    Tablet: '<svg viewBox="0 0 96 96" fill="none"><rect x="26" y="14" width="44" height="68" rx="6" fill="#17171d" stroke="#2c2c34" stroke-width="1.5"/><rect x="30" y="20" width="36" height="52" rx="2.5" fill="#0f2e1a"/><rect x="30" y="20" width="36" height="16" rx="2.5" fill="#1d4f2b"/><circle cx="48" cy="17" r="1" fill="#3a3a44"/><circle cx="48" cy="77" r="2" fill="none" stroke="#3a3a44" stroke-width="1.2"/></svg>',
    Laptop: '<svg viewBox="0 0 96 96" fill="none"><rect x="22" y="24" width="52" height="34" rx="3" fill="#17171d" stroke="#2c2c34" stroke-width="1.5"/><rect x="26" y="28" width="44" height="26" rx="1.5" fill="#0f2e1a"/><rect x="26" y="28" width="44" height="9" fill="#1d4f2b"/><path d="M14 58 h68 l5 8 a3 3 0 0 1 -3 4 H12 a3 3 0 0 1 -3 -4 z" fill="#1a1a20" stroke="#2c2c34" stroke-width="1.2"/><rect x="40" y="61" width="16" height="2.4" rx="1.2" fill="#2c2c34"/></svg>',
    Computer: '<svg viewBox="0 0 96 96" fill="none"><rect x="16" y="16" width="64" height="44" rx="4" fill="#17171d" stroke="#2c2c34" stroke-width="1.5"/><rect x="20" y="20" width="56" height="36" rx="2" fill="#0f2e1a"/><rect x="20" y="20" width="56" height="12" fill="#1d4f2b"/><rect x="43" y="60" width="10" height="9" fill="#1a1a20"/><rect x="32" y="70" width="32" height="5" rx="2.5" fill="#1a1a20" stroke="#2c2c34" stroke-width="1"/></svg>',
    Console: '<svg viewBox="0 0 96 96" fill="none"><path d="M30 40 q-10 0 -13 14 q-3 14 7 16 q7 1.5 11 -7 h26 q4 8.5 11 7 q10 -2 7 -16 q-3 -14 -13 -14 z" fill="#17171d" stroke="#2c2c34" stroke-width="1.5"/><circle cx="62" cy="52" r="2.4" fill="#36b349"/><circle cx="69" cy="58" r="2.4" fill="#36b349"/><circle cx="55" cy="58" r="2.4" fill="#2c2c34"/><circle cx="62" cy="64" r="2.4" fill="#2c2c34"/></svg>',
    Smartwatch: '<svg viewBox="0 0 96 96" fill="none"><rect x="40" y="8" width="16" height="16" rx="4" fill="#1a1a20"/><rect x="40" y="72" width="16" height="16" rx="4" fill="#1a1a20"/><rect x="32" y="24" width="32" height="48" rx="10" fill="#17171d" stroke="#2c2c34" stroke-width="1.5"/><rect x="36" y="29" width="24" height="38" rx="6" fill="#0f2e1a"/><rect x="36" y="29" width="24" height="13" rx="6" fill="#1d4f2b"/></svg>'
  };
  var art = function (cat) { return DEVART[cat] || DEVART.Smartphone; };
  var photo = function (name) {
    var s = slug(name);
    return '<img class="dev-photo" src="../assets/devices/' + s + '.png" alt="" loading="lazy"' +
      ' onload="var a=this.closest(\'.dev-art\');a&&a.classList.add(\'has-photo\')"' +
      ' onerror="if(this.dataset.fb){this.remove();}else{this.dataset.fb=1;this.src=\'../assets/devices/' + s + '.jpg\';}">';
  };

  /* ===================== STATE ===================== */
  var seq = 0; // line/group id counter
  var counterKey = "gsmfix_factuur_seq";
  var getCounter = function () { return parseInt(localStorage.getItem(counterKey) || "0", 10) || 0; };
  var setCounter = function (n) { try { localStorage.setItem(counterKey, String(n)); } catch (e) {} };
  var newNumber = function () {
    return new Date().getFullYear() + "-" + pad4(getCounter() + 1);
  };

  var INV = null;
  var freshInvoice = function () {
    return {
      groups: [],
      customer: { naam: "", straat: "", postcode: "", plaats: "", email: "", tel: "" },
      meta: { nummer: newNumber(), datum: todayISO(), vestiging: "Leiden", betaalwijze: "Pin", notitie: "" }
    };
  };

  var findGroupByDevice = function (name, cat) {
    for (var i = 0; i < INV.groups.length; i++) {
      if (!INV.groups[i].custom && INV.groups[i].device === name && INV.groups[i].cat === cat) return INV.groups[i];
    }
    return null;
  };
  var groupById = function (id) { return INV.groups.filter(function (g) { return g.id === id; })[0]; };

  var addService = function (deviceName, cat, desc, price) {
    var g = findGroupByDevice(deviceName, cat);
    if (!g) { g = { id: ++seq, device: deviceName, cat: cat, imei: "", custom: false, lines: [] }; INV.groups.push(g); }
    // bump quantity if same service already present
    for (var i = 0; i < g.lines.length; i++) {
      if (!g.lines[i].custom && g.lines[i].desc === desc) { g.lines[i].qty += 1; renderCart(); softUpdate(); return; }
    }
    g.lines.push({ id: ++seq, desc: desc, qty: 1, price: price, custom: false });
    renderCart(); softUpdate();
  };
  var addBlankLine = function (groupId) {
    var g = groupById(groupId); if (!g) return;
    g.lines.push({ id: ++seq, desc: "", qty: 1, price: 0, custom: true });
    renderCart(); softUpdate();
    var inp = document.querySelector('[data-g="' + g.id + '"][data-l="' + seq + '"][data-k="desc"]');
    if (inp) inp.focus();
  };
  var overigeGroup = function () {
    for (var i = 0; i < INV.groups.length; i++) if (INV.groups[i].overig) return INV.groups[i];
    var g = { id: ++seq, device: "Overige", cat: "", imei: "", custom: true, overig: true, lines: [] };
    INV.groups.push(g); return g;
  };

  /* ===================== TOTALS ===================== */
  var calc = function () {
    var total = 0;
    INV.groups.forEach(function (g) { g.lines.forEach(function (l) { total += num(l.qty) * num(l.price); }); });
    var rate = BTW_TARIEF / 100, incl, excl, btw;
    if (PRIJZEN_INCL_BTW) { incl = total; excl = total / (1 + rate); btw = incl - excl; }
    else { excl = total; btw = excl * rate; incl = excl + btw; }
    return { incl: incl, excl: excl, btw: btw };
  };

  /* ===================== DEVICE SEARCH ===================== */
  var search = { q: "", cat: "Alle" };
  var renderChips = function () {
    var box = $("#aChips"); if (!box) return;
    var cats = ["Alle"].concat(REPAIR.cats);
    box.innerHTML = cats.map(function (c) {
      return '<button class="a-chip' + (search.cat === c ? " is-on" : "") + '" type="button" data-cat="' + esc(c) + '">' + esc(c) + "</button>";
    }).join("");
  };
  var renderDevices = function () {
    var grid = $("#aDevGrid"); if (!grid) return;
    var q = search.q.toLowerCase();
    var rows = REPAIR.devices.filter(function (d) {
      var okC = search.cat === "Alle" || d[0] === search.cat;
      var okQ = !q || (decode(d[1]) + " " + d[0]).toLowerCase().indexOf(q) > -1;
      return okC && okQ;
    });
    if (!rows.length) { grid.innerHTML = '<p class="a-empty">Geen toestel gevonden. Probeer een andere zoekterm of voeg het toestel handmatig toe.</p>'; return; }
    var minP = function (d) { return Math.min.apply(null, d[2].map(function (r) { return r[1]; })); };
    grid.innerHTML = rows.map(function (d) {
      var i = REPAIR.devices.indexOf(d);
      return '<button class="a-dev" type="button" data-dev="' + i + '">' +
        '<span class="dev-art">' + art(d[0]) + photo(d[1]) + "</span>" +
        '<span class="a-dev__cat">' + esc(d[0]) + "</span>" +
        "<h4>" + esc(decode(d[1])) + "</h4>" +
        '<span class="a-dev__from">vanaf <strong>' + euro(minP(d)) + "</strong></span></button>";
    }).join("");
  };

  /* ===================== SERVICE MODAL ===================== */
  var openServiceModal = function (i) {
    var d = REPAIR.devices[i];
    var name = decode(d[1]);
    var rows = d[2].map(function (r) {
      return '<div class="a-srow"><span>' + esc(decode(r[0])) + "</span>" +
        '<span><span class="a-srow__price">' + euro(r[1]) + "</span>" +
        '<button class="a-add" type="button" data-svc="' + esc(decode(r[0])) + '" data-price="' + r[1] + '">Toevoegen</button></span></div>';
    }).join("");
    $("#aModalBody").innerHTML =
      '<button class="a-modal__close" type="button" data-close aria-label="Sluiten">\u00d7</button>' +
      '<div class="a-modal__cat">' + esc(d[0]) + "</div><h3>" + esc(name) + "</h3>" +
      rows +
      '<div class="a-custom"><div class="a-modal__cat" style="margin-bottom:8px">Eigen reparatie / onderdeel</div>' +
      '<div class="a-custom__row">' +
      '<div class="a-field"><label>Omschrijving</label><input id="cSvcDesc" placeholder="bv. Speaker vervangen"></div>' +
      '<div class="a-field"><label>Prijs &euro;</label><input id="cSvcPrice" inputmode="decimal" placeholder="0,00"></div>' +
      '<button class="a-add" type="button" id="cSvcAdd">Toevoegen</button></div></div>';
    var modal = $("#aModal");
    modal.classList.add("is-open");
    modal.dataset.device = name; modal.dataset.cat = d[0];
  };
  var closeModal = function () { $("#aModal").classList.remove("is-open"); };

  /* ===================== CART ===================== */
  var renderCart = function () {
    var wrap = $("#aCart");
    if (!INV.groups.length) {
      wrap.innerHTML = '<div class="a-cart__empty">Nog geen reparaties toegevoegd. Zoek hierboven een toestel en kies een dienst.</div>';
      return;
    }
    wrap.innerHTML = INV.groups.map(function (g) {
      var lines = g.lines.map(function (l) {
        var descCell = l.custom
          ? '<input class="a-line__descedit" data-g="' + g.id + '" data-l="' + l.id + '" data-k="desc" value="' + esc(l.desc) + '" placeholder="Omschrijving">'
          : '<span class="a-line__desc">' + esc(l.desc) + "</span>";
        return '<div class="a-line">' + descCell +
          '<input data-g="' + g.id + '" data-l="' + l.id + '" data-k="qty" inputmode="numeric" value="' + esc(l.qty) + '">' +
          '<input data-g="' + g.id + '" data-l="' + l.id + '" data-k="price" inputmode="decimal" value="' + esc(l.price) + '">' +
          '<span class="a-line__tot" data-tot="' + g.id + "-" + l.id + '">' + euro(num(l.qty) * num(l.price)) + "</span>" +
          '<button class="a-line__x" type="button" data-del-line="' + g.id + "-" + l.id + '" aria-label="Verwijder regel">\u00d7</button></div>';
      }).join("");
      var head = g.overig
        ? '<span class="a-group__cat">Los</span><span class="a-group__name">Overige regels &amp; korting</span>'
        : '<span class="a-group__cat">' + esc(g.cat || "Toestel") + '</span><span class="a-group__name">' + esc(g.device) + "</span>" +
          '<span class="a-group__imei"><input data-g="' + g.id + '" data-k="imei" value="' + esc(g.imei) + '" placeholder="IMEI / serienr. (optioneel)"></span>';
      return '<div class="a-group">' +
        '<div class="a-group__head">' + head +
        '<button class="a-group__del" type="button" data-del-group="' + g.id + '" aria-label="Verwijder toestel">\u00d7</button></div>' +
        '<div class="a-lines">' + lines + "</div>" +
        '<button class="a-group__add" type="button" data-add-line="' + g.id + '">+ regel toevoegen</button></div>';
    }).join("");
  };

  var renderTotals = function () {
    var t = calc();
    var box = $("#aTotals");
    box.innerHTML =
      '<div class="a-totals__row"><span>Subtotaal (excl. btw)</span><strong>' + euro(t.excl) + "</strong></div>" +
      '<div class="a-totals__row"><span>Btw ' + BTW_TARIEF + "%</span><strong>" + euro(t.btw) + "</strong></div>" +
      '<div class="a-totals__row a-totals__grand"><span>Totaal incl. btw</span><span>' + euro(t.incl) + "</span></div>";
  };

  /* live update without rebuilding cart (keeps input focus) */
  var softUpdate = function () { renderTotals(); renderPreview(); };

  /* ===================== FACTUUR HTML ===================== */
  var buildFactuur = function () {
    var v = BEDRIJF.vestigingen[INV.meta.vestiging] || BEDRIJF.vestigingen.Leiden;
    var t = calc();
    var c = INV.customer;

    var body = "";
    INV.groups.forEach(function (g) {
      if (!g.lines.length) return;
      var sub = g.overig ? "" : (g.imei ? '<span class="fac__grpsub"> &middot; ' + esc(g.imei) + "</span>" : "");
      var title = g.overig ? "Overige" : esc(g.device);
      body += '<tr class="fac__grp"><td colspan="4"><span class="fac__grpname">' + title + "</span>" + sub + "</td></tr>";
      g.lines.forEach(function (l) {
        body += '<tr class="fac__item"><td class="fac__desc">' + esc(l.desc || "") + "</td>" +
          '<td class="num">' + esc(l.qty) + "</td>" +
          '<td class="num">' + euro(num(l.price)) + "</td>" +
          '<td class="num">' + euro(num(l.qty) * num(l.price)) + "</td></tr>";
      });
    });
    if (!body) body = '<tr class="fac__item"><td class="fac__desc" colspan="4" style="color:#999">Nog geen regels</td></tr>';

    var payLine = INV.meta.betaalwijze === "Op rekening"
      ? "<strong>Te voldoen</strong> binnen 14 dagen op " + esc(BEDRIJF.iban) + " o.v.v. factuurnummer " + esc(INV.meta.nummer) + "."
      : "<strong>Voldaan</strong> via " + esc(INV.meta.betaalwijze) + " op " + esc(nlDate(INV.meta.datum)) + ".";

    var custAddr = [c.straat, (c.postcode + " " + c.plaats).trim()].filter(Boolean).map(esc).join("<br>");

    return '<div class="fac">' +
      '<div class="fac__top"><div class="fac__title"><h1>Factuur</h1>' +
        '<div class="fac__sub">' + esc(BEDRIJF.naam) + " &middot; " + esc(INV.meta.vestiging) + "</div></div>" +
        '<img class="fac__logo" src="../assets/logo-mark.svg" alt="GSM Fixhouse"></div>' +
      '<div class="fac__meta">' +
        '<div class="fac__to"><div class="fac__lbl">Factuur voor</div>' +
          "<strong>" + (esc(c.naam) || "&mdash;") + "</strong>" + (custAddr ? custAddr : "") +
          (c.email ? "<br>" + esc(c.email) : "") + "</div>" +
        '<div class="fac__info"><table>' +
          "<tr><td>Factuurnummer</td><td>" + esc(INV.meta.nummer) + "</td></tr>" +
          "<tr><td>Factuurdatum</td><td>" + esc(nlDate(INV.meta.datum)) + "</td></tr>" +
          "<tr><td>Vestiging</td><td>" + esc(INV.meta.vestiging) + "</td></tr>" +
          "<tr><td>Betaalwijze</td><td>" + esc(INV.meta.betaalwijze) + "</td></tr>" +
        "</table></div></div>" +
      '<table class="fac__table"><thead><tr>' +
        '<th class="fac__col-desc">Omschrijving</th>' +
        '<th class="num fac__col-qty">Aantal</th>' +
        '<th class="num fac__col-price">Prijs</th>' +
        '<th class="num fac__col-tot">Totaal</th></tr></thead><tbody>' + body + "</tbody></table>" +
      '<div class="fac__totbox">' +
        '<div class="r"><span>Subtotaal (excl. btw)</span><span>' + euro(t.excl) + "</span></div>" +
        '<div class="r"><span>Btw ' + BTW_TARIEF + "%</span><span>" + euro(t.btw) + "</span></div>" +
        '<div class="r grand"><span>Totaalbedrag incl. btw</span><span>' + euro(t.incl) + "</span></div></div>" +
      '<p class="fac__pay">' + payLine + "</p>" +
      (INV.meta.notitie ? '<p class="fac__note">' + esc(INV.meta.notitie) + "</p>" : "") +
      '<p class="fac__note">' + esc(GARANTIE_TEKST) + "</p>" +
      '<div class="fac__thanks">Bedankt voor uw bezoek aan GSM Fixhouse</div>' +
      '<div class="fac__foot">' +
        "<div><b>" + esc(BEDRIJF.naam) + " " + esc(INV.meta.vestiging) + "</b><br>" +
          esc(v.straat) + "<br>" + esc(v.postcode) + " " + esc(v.plaats) + "<br>Tel. " + esc(v.tel) + "</div>" +
        "<div><b>Contact</b><br>" + esc(BEDRIJF.email) + "<br>" + esc(BEDRIJF.website) + "</div>" +
        "<div><b>Administratie</b><br>KvK: " + esc(BEDRIJF.kvk) + "<br>Btw: " + esc(BEDRIJF.btwId) + "<br>IBAN: " + esc(BEDRIJF.iban) + "</div>" +
      "</div></div>";
  };

  /* ===================== BONNETJE HTML ===================== */
  var MARK = '<svg class="bon__mark" viewBox="0 0 878 1304" aria-hidden="true"><path fill="#16a02a" d="M797.9,533.62h0c44.48-.32,80.37-36.48,80.37-80.96v-255.43C878.28,88.3,789.97,0,681.05,0H205.17C91.86,0,0,91.86,0,205.17v871.06c0,125.8,101.98,227.77,227.77,227.77h456.65c107.06,0,193.85-86.79,193.85-193.85v-402.75c0-55.72-45.17-100.89-100.89-100.89h-316.31c-60.75,0-110,49.25-110,110v132.02c0,46.7,37.86,84.56,84.56,84.56h0c46.7,0,84.56-37.86,84.56-84.56v-75.47c0-5.66,4.59-10.26,10.26-10.26h169.03c9.2,0,16.66,7.46,16.66,16.66v340.57c0,17.22-13.96,31.17-31.17,31.17H222.23c-33.84,0-61.27-27.43-61.27-61.27V202.81c0-25.05,20.31-45.35,45.35-45.35h475.63c19.48,0,35.23,15.83,35.08,35.31-.39,50.9-.99,176.41-.68,260.24.17,44.82,36.73,80.93,81.55,80.6Z"/><rect fill="#16a02a" x="312.08" y="242.01" width="255.42" height="69.5" rx="34.75"/><circle fill="#16a02a" cx="440.25" cy="1039.9" r="37.5"/></svg>';

  var buildBon = function () {
    var v = BEDRIJF.vestigingen[INV.meta.vestiging] || BEDRIJF.vestigingen.Leiden;
    var t = calc();
    var c = INV.customer;
    var items = "";
    INV.groups.forEach(function (g) {
      if (!g.lines.length) return;
      items += '<div class="bon__grp">' + (g.overig ? "Overige" : esc(g.device)) + (g.imei ? " (" + esc(g.imei) + ")" : "") + "</div>";
      g.lines.forEach(function (l) {
        items += '<div class="bon__line"><span>' + esc(l.desc || "") +
          (num(l.qty) > 1 ? ' <span class="q">x' + esc(l.qty) + "</span>" : "") + "</span>" +
          "<span>" + euro(num(l.qty) * num(l.price)) + "</span></div>";
      });
    });
    if (!items) items = '<div class="bon__line"><span style="color:#999">Nog geen regels</span><span></span></div>';

    return '<div class="bon">' +
      '<div class="bon__head">' + MARK +
        '<div class="bon__name">GSM FIXHOUSE</div>' +
        '<div class="bon__addr">' + esc(v.straat) + " &middot; " + esc(v.postcode) + " " + esc(v.plaats) + "<br>Tel. " + esc(v.tel) + " &middot; " + esc(BEDRIJF.website) + "</div></div>" +
      '<hr class="bon__hr">' +
      '<div class="bon__meta"><div>Bon ' + esc(INV.meta.nummer) + "</div><div>" + esc(nlDate(INV.meta.datum)) + "</div></div>" +
      (c.naam ? '<div class="bon__cust"><b>Klant:</b> ' + esc(c.naam) + "</div>" : "") +
      '<hr class="bon__hr">' + items + '<hr class="bon__hr">' +
      '<div class="bon__btw"><span>Subtotaal excl. btw</span><span>' + euro(t.excl) + "</span></div>" +
      '<div class="bon__btw"><span>Btw ' + BTW_TARIEF + "%</span><span>" + euro(t.btw) + "</span></div>" +
      '<div class="bon__tot"><span>TOTAAL</span><span>' + euro(t.incl) + "</span></div>" +
      '<div class="bon__foot">Betaald via ' + esc(INV.meta.betaalwijze) + "</div>" +
      '<hr class="bon__hr">' +
      '<div class="bon__warr">' + esc(GARANTIE_TEKST) + "</div>" +
      '<div class="bon__thanks">Bedankt &amp; tot ziens!</div></div>';
  };

  /* ===================== PREVIEW ===================== */
  var previewTab = "factuur";
  var renderPreview = function () {
    var stage = $("#aStage");
    if (previewTab === "factuur") { stage.className = "a-stage"; stage.innerHTML = buildFactuur(); }
    else { stage.className = "a-stage a-stage--bon"; stage.innerHTML = buildBon(); }
  };

  /* ===================== PRINT ===================== */
  var doPrint = function (kind) {
    var root = $("#printRoot");
    root.innerHTML = kind === "bon" ? buildBon() : buildFactuur();
    if (kind === "factuur") {
      // verbruik dit factuurnummer (volgende nieuwe factuur krijgt +1)
      var m = String(INV.meta.nummer).match(/(\d+)\s*$/);
      if (m) { var s = parseInt(m[1], 10); if (s > getCounter()) setCounter(s); }
    }
    window.print();
  };
  window.addEventListener("afterprint", function () { $("#printRoot").innerHTML = ""; });

  /* ===================== NAW + META BINDING ===================== */
  var fillMetaFields = function () {
    var set = function (id, val) { var el = $(id); if (el) el.value = val; };
    set("#mNummer", INV.meta.nummer); set("#mDatum", INV.meta.datum);
    set("#mVestiging", INV.meta.vestiging); set("#mBetaal", INV.meta.betaalwijze);
    var _vs = $("#mVestiging"); if (_vs) _vs.dispatchEvent(new Event("change"));
    set("#mNotitie", INV.meta.notitie);
    set("#cNaam", INV.customer.naam); set("#cStraat", INV.customer.straat);
    set("#cPostcode", INV.customer.postcode); set("#cPlaats", INV.customer.plaats);
    set("#cEmail", INV.customer.email); set("#cTel", INV.customer.tel);
  };

  /* ===================== EVENTS ===================== */
  var wire = function () {
    // device search
    $("#aSearch").addEventListener("input", function () { search.q = this.value; renderDevices(); });
    $("#aChips").addEventListener("click", function (e) {
      var c = e.target.closest("[data-cat]"); if (!c) return;
      search.cat = c.dataset.cat; renderChips(); renderDevices();
    });
    $("#aDevGrid").addEventListener("click", function (e) {
      var d = e.target.closest("[data-dev]"); if (d) openServiceModal(parseInt(d.dataset.dev, 10));
    });

    // service modal
    var modal = $("#aModal");
    modal.addEventListener("click", function (e) {
      if (e.target === modal || e.target.closest("[data-close]")) return closeModal();
      var add = e.target.closest("[data-svc]");
      if (add) {
        addService(modal.dataset.device, modal.dataset.cat, add.dataset.svc, num(add.dataset.price));
        add.textContent = "Toegevoegd \u2713"; setTimeout(function () { add.textContent = "Toevoegen"; }, 900);
        return;
      }
      if (e.target.id === "cSvcAdd") {
        var dEl = $("#cSvcDesc"), pEl = $("#cSvcPrice");
        if (!dEl.value.trim()) { dEl.focus(); return; }
        addService(modal.dataset.device, modal.dataset.cat, dEl.value.trim(), num(pEl.value));
        dEl.value = ""; pEl.value = ""; dEl.focus();
      }
    });

    // manual device + losse regel
    $("#aManual").addEventListener("click", function () {
      var name = ($("#aManualName").value || "").trim();
      if (!name) { $("#aManualName").focus(); return; }
      var cat = $("#aManualCat").value;
      var g = { id: ++seq, device: name, cat: cat, imei: "", custom: false, lines: [] };
      INV.groups.push(g); $("#aManualName").value = "";
      addBlankLine(g.id);
    });
    $("#aLosse").addEventListener("click", function () { addBlankLine(overigeGroup().id); });

    // cart: structural clicks
    $("#aCart").addEventListener("click", function (e) {
      var dl = e.target.closest("[data-del-line]");
      if (dl) {
        var p = dl.dataset.delLine.split("-"), g = groupById(parseInt(p[0], 10));
        if (g) { g.lines = g.lines.filter(function (l) { return l.id !== parseInt(p[1], 10); });
          if (!g.lines.length) INV.groups = INV.groups.filter(function (x) { return x !== g; }); }
        renderCart(); softUpdate(); return;
      }
      var dg = e.target.closest("[data-del-group]");
      if (dg) { var id = parseInt(dg.dataset.delGroup, 10); INV.groups = INV.groups.filter(function (x) { return x.id !== id; }); renderCart(); softUpdate(); return; }
      var al = e.target.closest("[data-add-line]");
      if (al) { addBlankLine(parseInt(al.dataset.addLine, 10)); }
    });
    // cart: inline edits (no rebuild -> keeps focus)
    $("#aCart").addEventListener("input", function (e) {
      var el = e.target; if (!el.dataset.g) return;
      var g = groupById(parseInt(el.dataset.g, 10)); if (!g) return;
      if (el.dataset.k === "imei") { g.imei = el.value; renderPreview(); return; }
      var l = g.lines.filter(function (x) { return x.id === parseInt(el.dataset.l, 10); })[0]; if (!l) return;
      if (el.dataset.k === "desc") l.desc = el.value;
      else if (el.dataset.k === "qty") l.qty = el.value;
      else if (el.dataset.k === "price") l.price = el.value;
      var tot = document.querySelector('[data-tot="' + g.id + "-" + l.id + '"]');
      if (tot) tot.textContent = euro(num(l.qty) * num(l.price));
      softUpdate();
    });

    // NAW + meta form
    var form = $("#aForm");
    form.addEventListener("input", function (e) {
      var id = e.target.id, val = e.target.value;
      var map = { cNaam: ["customer", "naam"], cStraat: ["customer", "straat"], cPostcode: ["customer", "postcode"],
        cPlaats: ["customer", "plaats"], cEmail: ["customer", "email"], cTel: ["customer", "tel"],
        mNummer: ["meta", "nummer"], mDatum: ["meta", "datum"], mVestiging: ["meta", "vestiging"],
        mBetaal: ["meta", "betaalwijze"], mNotitie: ["meta", "notitie"] };
      if (map[id]) { INV[map[id][0]][map[id][1]] = val; renderPreview(); }
    });

    // vestiging segmented control (staat buiten #aForm, dus apart gekoppeld)
    var vestSeg = $("#aVestSeg"), vestSel = $("#mVestiging");
    var syncVest = function () {
      if (!vestSeg || !vestSel) return;
      vestSeg.querySelectorAll(".a-vest__btn").forEach(function (b) {
        b.classList.toggle("is-on", b.dataset.vest === vestSel.value);
      });
    };
    if (vestSeg && vestSel) {
      vestSeg.addEventListener("click", function (e) {
        var b = e.target.closest(".a-vest__btn"); if (!b) return;
        vestSel.value = b.dataset.vest;
        INV.meta.vestiging = b.dataset.vest;
        syncVest(); renderPreview();
      });
      vestSel.addEventListener("change", function () {
        INV.meta.vestiging = vestSel.value; syncVest(); renderPreview();
      });
      syncVest();
    }

    // preview tabs
    $("#aPreviewTabs").addEventListener("click", function (e) {
      var b = e.target.closest("[data-tab]"); if (!b) return;
      previewTab = b.dataset.tab;
      this.querySelectorAll("[data-tab]").forEach(function (x) { x.classList.toggle("is-on", x === b); });
      renderPreview();
    });

    // actions
    $("#aPrintFac").addEventListener("click", function () { doPrint("factuur"); });
    $("#aPrintBon").addEventListener("click", function () { doPrint("bon"); });
    $("#aReset").addEventListener("click", function () {
      if (!confirm("Nieuwe factuur starten? De huidige gegevens worden gewist.")) return;
      INV = freshInvoice(); fillMetaFields(); renderCart(); softUpdate();
    });
    $("#aLogout").addEventListener("click", function () {
      try { sessionStorage.removeItem("gsmfix_admin"); } catch (e) {}
      location.reload();
    });

    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeModal(); });
  };

  /* ===================== LOGIN ===================== */
  var startApp = function () {
    $("#aLogin").hidden = true;
    INV = freshInvoice();
    renderChips(); renderDevices(); renderCart(); fillMetaFields(); renderTotals(); renderPreview();
    wire();
  };
  var initLogin = function () {
    if (sessionStorage.getItem("gsmfix_admin") === "ok") { startApp(); return; }
    var form = $("#aLoginForm"), err = $("#aLoginErr");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var u = $("#aUser").value.trim(), p = $("#aPass").value;
      if (u === ADMIN_USER && p === ADMIN_PASS) {
        try { sessionStorage.setItem("gsmfix_admin", "ok"); } catch (er) {}
        startApp();
      } else { err.classList.add("is-on"); $("#aPass").value = ""; $("#aPass").focus(); }
    });
    $("#aUser").focus();
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initLogin);
  else initLogin();
})();
