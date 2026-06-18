/* =========================================================
   GSM FIXHOUSE - gedeelde catalogus (1 bron van waarheid)
   =========================================================
   Dit bestand bevat ALLE toestellen, reparaties en prijzen.
   Het wordt automatisch gebruikt door:
     - de website        (Alle reparaties + verkoop-wizard)
     - de admin /admin   (facturatie: factuur + bonnetje)
   Pas je hieronder iets aan, dan verandert het OVERAL mee.

   >>> Je hoeft alleen blok 1 (en eventueel blok 2) aan te raken. <<<
   (prijzen zijn voorbeeld/indicatie - vervang met echte cijfers)
   ========================================================= */
(function () {
  "use strict";

  /* =========================================================
     1) TOESTELLEN & REPARATIES        <-- HIER AANPASSEN
     ---------------------------------------------------------
     Formaat:
       "Categorie": {
         "Toestelnaam": { "Reparatie": prijs, "Reparatie": prijs },
         ...
       }

     - Nieuw toestel?     voeg een regel toe in de juiste categorie
     - Nieuwe reparatie?   zet  "Naam": prijs  erbij achter het toestel
     - Iets weghalen?      verwijder die regel of dat stukje
     - Prijzen: in euro's, incl. btw (bv. 169 of 89.50). Komma's NIET,
       gebruik een punt voor centen: 89.50
     - In namen mag je gewoon  &  en  /  typen.
     - Let op: de 6 categorie-namen hieronder niet hernoemen
       (Smartphone, Tablet, Laptop, Computer, Console, Smartwatch) -
       daar hangen de iconen en de zoekfilters aan vast.
     - De volgorde waarin je ze typt = de volgorde op de site.
     ========================================================= */
  var TOESTELLEN = {

    "Smartphone": {
      // --- Apple iPhone ---
      "iPhone 17":       { "Scherm vervangen": 329, "Batterij vervangen": 99, "Laadpoort": 79 },
      "iPhone 16":       { "Scherm vervangen": 299, "Batterij vervangen": 89, "Laadpoort": 75 },
      "iPhone 15":       { "Scherm vervangen": 279, "Batterij vervangen": 85, "Laadpoort": 69, "Achterkant glas": 89 },
      "iPhone 14":       { "Scherm vervangen": 219, "Batterij vervangen": 79, "Laadpoort": 65, "Camera glas": 49 },
      "iPhone 13":       { "Scherm vervangen": 169, "Batterij vervangen": 75, "Laadpoort": 59, "Camera glas": 45 },
      "iPhone 12":       { "Scherm vervangen": 149, "Batterij vervangen": 69, "Laadpoort": 59 },
      "iPhone 11":       { "Scherm vervangen": 99,  "Batterij vervangen": 65, "Laadpoort": 55 },
      "iPhone X / XS":   { "Scherm vervangen": 99,  "Batterij vervangen": 59, "Laadpoort": 55 },
      "iPhone 8":        { "Scherm vervangen": 79,  "Batterij vervangen": 49, "Laadpoort": 45 },
      "iPhone 7":        { "Scherm vervangen": 69,  "Batterij vervangen": 45, "Laadpoort": 39 },
      "iPhone SE":       { "Scherm vervangen": 69,  "Batterij vervangen": 45 },

      // --- Samsung ---
      "Samsung S Serie":       { "Scherm vervangen": 199, "Batterij vervangen": 79, "Laadpoort": 69 },
      "Samsung A Serie":       { "Scherm vervangen": 99,  "Batterij vervangen": 55, "Laadpoort": 49 },
      "Samsung Z Serie":       { "Scherm vervangen": 299, "Batterij vervangen": 99 },
      "Samsung Note Serie":    { "Scherm vervangen": 189, "Batterij vervangen": 79 },
      "Samsung M Serie":       { "Scherm vervangen": 89,  "Batterij vervangen": 55 },
      "Samsung X Cover Serie": { "Scherm vervangen": 99,  "Batterij vervangen": 59 },

      // --- Motorola ---
      "Moto G Serie":    { "Scherm vervangen": 89, "Batterij vervangen": 55 },
      "Moto X Serie":    { "Scherm vervangen": 99, "Batterij vervangen": 59 },
      "Motorola overig": { "Scherm vervangen": 89, "Batterij vervangen": 55 },

      // --- Huawei ---
      "Huawei P Serie":     { "Scherm vervangen": 119, "Batterij vervangen": 65 },
      "Huawei Mate Serie":  { "Scherm vervangen": 139, "Batterij vervangen": 69 },
      "Huawei Honor Serie": { "Scherm vervangen": 99,  "Batterij vervangen": 59 },
      "Huawei overig":      { "Scherm vervangen": 89,  "Batterij vervangen": 55 },

      // --- Overige merken ---
      "OnePlus":            { "Scherm vervangen": 119, "Batterij vervangen": 65 },
      "Google Pixel":       { "Scherm vervangen": 129, "Batterij vervangen": 69 },
      "Nokia":              { "Scherm vervangen": 79,  "Batterij vervangen": 49 },
      "Xiaomi Mi Serie":    { "Scherm vervangen": 99,  "Batterij vervangen": 59 },
      "Xiaomi Redmi Serie": { "Scherm vervangen": 89,  "Batterij vervangen": 55 },
      "Xiaomi Poco Serie":  { "Scherm vervangen": 99,  "Batterij vervangen": 59 },
      "Xiaomi Shark Serie": { "Scherm vervangen": 129, "Batterij vervangen": 69 },
      "Oppo A Serie":       { "Scherm vervangen": 89,  "Batterij vervangen": 55 },
      "Oppo Find X Serie":  { "Scherm vervangen": 149, "Batterij vervangen": 69 },
      "Oppo Reno Serie":    { "Scherm vervangen": 109, "Batterij vervangen": 59 }
    },

    "Tablet": {
      "Apple iPad":        { "Scherm vervangen": 89,  "Batterij vervangen": 65, "Laadpoort": 59 },
      "Samsung tablet":    { "Scherm vervangen": 99,  "Batterij vervangen": 69 },
      "Microsoft Surface": { "Scherm vervangen": 149, "Batterij vervangen": 89 },
      "Huawei tablet":     { "Scherm vervangen": 99,  "Batterij vervangen": 65 },
      "Sony tablet":       { "Scherm vervangen": 109, "Batterij vervangen": 69 }
    },

    "Laptop": {
      "MacBook":       { "Scherm vervangen": 299, "Batterij vervangen": 129, "Toetsenbord": 149, "Opslag upgrade": 99 },
      "Windows laptop": { "Opschonen & herstel": 49, "SSD upgrade": 79, "Batterij vervangen": 89 }
    },

    "Computer": {
      "Computer / PC": { "Opschonen & herstel": 49, "SSD upgrade": 79, "Onderdelen vervangen": 59 }
    },

    "Console": {
      "PlayStation 5":   { "HDMI-poort": 99, "Reiniging & koeling": 49, "Ventilator": 69 },
      "PlayStation 4":   { "HDMI-poort": 89, "Reiniging & koeling": 45, "Ventilator": 59 },
      "Xbox":            { "HDMI-poort": 99, "Reiniging & koeling": 49 },
      "Nintendo Switch": { "Joy-Con drift": 39, "Scherm vervangen": 89, "Laadpoort": 59 }
    },

    "Smartwatch": {
      "Smartwatch": { "Scherm vervangen": 89, "Batterij vervangen": 59 }
    }

  };

  /* =========================================================
     2) INRUIL / VERKOOP-PRIJZEN   (alleen de verkopen-pagina)
     ---------------------------------------------------------
     Dit voedt de "Verkoop je toestel"-wizard op de website.
     models:  "Merk|categorie": [ ["Model", richtprijs], ... ]
     storage: vaste opslag-toeslagen ; conditions: staat -> factor
     ========================================================= */
  var SELL = {
    categories: [
      { id: "telefoon",   name: "Telefoon",   sub: "iPhone, Samsung, Google", icon: "phone" },
      { id: "tablet",     name: "Tablet",     sub: "iPad &amp; Galaxy Tab",   icon: "tablet" },
      { id: "smartwatch", name: "Smartwatch", sub: "Apple Watch &amp; meer",  icon: "watch" },
      { id: "laptop",     name: "Laptop",     sub: "MacBook",                 icon: "laptop" }
    ],
    brands: {
      telefoon:   ["Apple", "Samsung", "Google"],
      tablet:     ["Apple", "Samsung"],
      smartwatch: ["Apple", "Samsung"],
      laptop:     ["Apple"]
    },
    models: {
      "Apple|telefoon":     [["iPhone 15 Pro", 520], ["iPhone 15", 430], ["iPhone 14", 330], ["iPhone 13", 240], ["iPhone 12", 150], ["iPhone 11", 95]],
      "Apple|tablet":       [['iPad Pro 11"', 360], ["iPad Air", 240], ["iPad 10", 180]],
      "Apple|smartwatch":   [["Apple Watch S9", 180], ["Apple Watch SE", 95]],
      "Apple|laptop":       [["MacBook Air M2", 620], ['MacBook Pro 14"', 900]],
      "Samsung|telefoon":   [["Samsung S24", 430], ["Samsung S23", 300], ["Samsung A54", 120]],
      "Samsung|tablet":     [["Samsung Tab S9", 300]],
      "Samsung|smartwatch": [["Samsung Watch 6", 120]],
      "Google|telefoon":    [["Pixel 8 Pro", 360], ["Pixel 7", 190]]
    },
    storage: [["128GB", 0], ["256GB", 30], ["512GB", 70], ["1TB", 120]],
    conditions: [
      ["Als nieuw",      "Geen krasjes, werkt perfect",   1.0],
      ["Licht gebruikt", "Lichte gebruikssporen",         0.82],
      ["Zwaar gebruikt", "Duidelijke krassen of deuken",  0.55],
      ["Kapot",          "Scherm of onderdeel defect",    0.3]
    ]
  };

  /* =========================================================
     3) TECHNIEK - hieronder NIET aanpassen
     ---------------------------------------------------------
     Zet de leesbare lijst uit blok 1 om naar de interne vorm
     die de website en de admin gebruiken. Namen worden veilig
     ge-encodeerd (& wordt &amp; enz.) zodat alles goed weergeeft.
     ========================================================= */
  function enc(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  var REPAIR = { cats: [], devices: [] };
  Object.keys(TOESTELLEN).forEach(function (cat) {
    REPAIR.cats.push(cat);
    var toestellen = TOESTELLEN[cat];
    Object.keys(toestellen).forEach(function (naam) {
      var diensten = toestellen[naam];
      var lijst = Object.keys(diensten).map(function (svc) {
        return [enc(svc), diensten[svc]];
      });
      REPAIR.devices.push([cat, enc(naam), lijst]);
    });
  });

  window.GSMFIX_CATALOG = { REPAIR: REPAIR, SELL: SELL };
})();
