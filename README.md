# GSM Fixhouse — website

Statische, snelle website (HTML + CSS + vanilla JS). Geen build-stap nodig.
Open de map in VS Code en open `index.html` (of gebruik de Live Server extensie).

## Pagina's
- `index.html` — home (hero met zelf-herstellende telefoon, categorieën, USP's, stats, reviews)
- `reparaties.html` — overzicht apparaten + proces + populaire reparaties
- `alle-reparaties.html` — doorzoekbare reparatie-catalogus met indicatieprijzen + modal
- `verkopen.html` — verkoop/trade-in pagina met stap-voor-stap prijswizard
- `zakelijk.html` — zakelijke klanten
- `over.html` — over ons + reviews
- `locaties.html` — vestigingen Leiden & Katwijk
- `admin/index.html` — **interne** facturatiepagina (factuur + bonnetje printen), niet zichtbaar voor klanten

## Structuur
- `css/styles.css` — alle styling van de publieke site (1 bestand)
- `css/admin.css` — styling van de interne admin-/facturatiepagina
- `js/main.js` — loader, scroll-reveal, decode-animatie, telt op, telefoon break/heal, live open/dicht status
- `js/catalog.js` — **één centrale lijst** met alle toestellen, diensten en prijzen (REPAIR + SELL). Wordt gebruikt door zowel de publieke site als de admin, zodat prijzen nooit uit elkaar lopen.
- `js/flow.js` — verkoop-wizard + reparatie-catalogus + roterend hero-woord (leest uit `catalog.js`)
- `js/admin.js` — logica van de interne facturatiepagina (login, factuur + bonnetje opbouwen, printen)
- `admin/index.html` — interne facturatiepagina (zie hieronder)
- `assets/` — winkelfoto's (Leiden & Katwijk) + favicon + logo's + toestelfoto's
- `build_site.py` — generator die alle pagina's opbouwt (inclusief `admin/index.html`)

## Admin / facturatie (intern — `/admin`)
Een aparte, interne pagina om per klant snel een **factuur** en een **bonnetje** te maken en te printen. Niet gelinkt vanaf de publieke site en voorzien van `noindex, nofollow`.

**Openen:** `…/admin/` (bv. `http://localhost:5500/admin/` of `gsmfixhouse.nl/admin/`).
**Inloggen:** gebruikersnaam `GSMFIXHOUSE`, wachtwoord `GSMFIX123`.

**Werkwijze (van boven naar beneden):**
1. Zoek het toestel en voeg de dienst(en) toe — staat een toestel er niet bij, voeg het handmatig toe.
2. De reparaties komen **per toestel gegroepeerd** in de factuur (eventueel met IMEI/serienummer per toestel). Losse regels of korting kunnen via "+ Losse regel of korting".
3. Vul de klantgegevens in (naam, adres, woonplaats + optioneel e-mail/telefoon) en de factuurgegevens (nummer, datum, vestiging, betaalwijze).
4. Rechts zie je een **live voorbeeld** (tabblad Factuur / Bonnetje). Print via "Print / PDF factuur" of "Print bonnetje" (kies "Opslaan als PDF" om te bewaren/mailen).

**Aanpassen vóór gebruik** — bovenin `js/admin.js` (blok `BEDRIJF`):
- `kvk`, `btwId`, `iban` staan nu op **placeholders** → vul je echte KvK-nummer, btw-id en IBAN in (verschijnen onderaan de factuur).
- Adressen/telefoon van Leiden & Katwijk staan al ingevuld; pas aan indien nodig.
- Wachtwoord/gebruikersnaam wijzig je in hetzelfde bestand (`ADMIN_USER` / `ADMIN_PASS`).
- Btw staat op 21% (`BTW_TARIEF`) en catalogusprijzen worden als **incl. btw** behandeld (`PRIJZEN_INCL_BTW = true`); de factuur splitst automatisch subtotaal excl. + btw uit.

**Factuurnummers** lopen automatisch op (`JAAR-0001`, `JAAR-0002`, …) en worden lokaal in de browser bijgehouden. Een nummer wordt pas "verbruikt" zodra je een factuur print; je kunt het nummer altijd handmatig overschrijven.

**Bonnetje:** standaard op A4. Heb je een bonprinter (80 mm rol), zet dan in het printvenster het papierformaat op 80 mm.

> **Beveiliging:** de login is client-side (alleen om de pagina uit het zicht te houden) — dit is géén echte beveiliging. Zet `/admin` daarom **niet** mee online op de publieke hosting, of zet er server-side bescherming (bv. wachtwoord via de host / `.htpasswd`) voor. Voor intern, lokaal gebruik op de winkel-pc is dit prima.

## Belangrijke functies
- **3D-laadanimatie**: draaiende munt met het logo, op élke pagina.
- **Animaties overal**: scroll-reveal en de groene "decode" eyebrow-animatie op alle pagina's.
- **Zelf-herstellende telefoon**: heelt bij laden, breekt als je de muis erover beweegt, heelt weer als je weggaat (tik = wisselen op mobiel).
- **Mobiele navigatie**: Instagram-stijl zwevende onderbalk; tegels staan op telefoon 2 naast elkaar (desktop blijft 3/4-koloms).

## Aanpassen
### Toestellen, reparaties & prijzen (1 plek voor alles)
Alle toestellen en reparaties staan in **`js/catalog.js`** in blok 1 (`TOESTELLEN`). Pas je daar iets aan, dan verandert het **automatisch mee op de website (Alle reparaties) én in de admin-facturatie** — je hoeft het maar op één plek te doen.

Formaat:
```js
"Smartphone": {
  "iPhone 13": { "Scherm vervangen": 169, "Batterij vervangen": 75 },
  "Fairphone 5": { "Scherm vervangen": 159 }   // <- nieuw toestel: regel toevoegen
},
```
- **Nieuw toestel?** voeg een regel toe in de juiste categorie.
- **Nieuwe reparatie?** zet `"Naam": prijs` erbij achter het toestel.
- **Weghalen?** verwijder die regel of dat stukje.
- Prijzen in euro's incl. btw; centen met een **punt** (`89.50`), geen komma.
- De 6 categorie-namen (Smartphone, Tablet, Laptop, Computer, Console, Smartwatch) niet hernoemen — daar hangen de iconen en filters aan vast.
- De **inruil-/verkoopprijzen** (verkopen-pagina) staan in hetzelfde bestand in blok 2 (`SELL`).
- Blok 3 onderaan is techniek; dat hoef je niet aan te raken.

### Overige inhoud
Teksten, reviews en statistieken staan in `build_site.py` (genereer opnieuw met `python3 build_site.py`), of pas de gegenereerde `.html` rechtstreeks aan.

## Let op (placeholders)
- Reviews, statistieken en de **prijzen in de verkoop-wizard en reparatie-catalogus zijn voorbeelddata / indicaties** — vervang met echte cijfers.
- De échte verkoopflow op `verkopen.gsmfixhouse.nl` is een **betaalde externe add-on ("Powered by Trade in")**. Deze pagina is een nagebouwde demo in jullie eigen stijl met voorbeelddata; de zoekbalk en "Verkoop nu" verwijzen door naar de echte tool.
- Merknamen worden als tekst getoond (geen officiële logo's) i.v.m. merkrechten.
- Winkelfoto's zijn de aangeleverde foto's; vervang `assets/winkel-leiden.jpg` / `assets/winkel-katwijk.jpg` voor andere beelden.
