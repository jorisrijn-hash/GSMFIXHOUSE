/* =========================================================
   GSM FIXHOUSE — interactions (v3)
   ========================================================= */
(function () {
  "use strict";

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const fine = window.matchMedia("(pointer:fine)").matches;
  const phone = document.getElementById("phone");

  /* phone starts cracked so the heal is visible on load */
  if (phone) phone.classList.add("is-broken");

  /* ---------- page loader ---------- */
  function startLoad() {
    const loader = document.getElementById("loader");
    setTimeout(function () {
      if (loader) loader.classList.add("is-done");
      document.body.classList.add("is-ready");
      healPhone();
      initScrollAnimations();   /* run AFTER loader fades so animations are visible */
    }, reduced ? 0 : 550);
  }
  if (document.readyState === "complete") startLoad();
  else window.addEventListener("load", startLoad);

  /* ---------- header shrink ---------- */
  const header = document.getElementById("header");
  const onScroll = function () { if (header) header.classList.toggle("is-scrolled", window.scrollY > 12); };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- mobile bottom-nav: compact while scrolling ---------- */
  const bnav = document.querySelector(".bottom-nav");
  if (bnav) {
    let bnavT;
    const bnavCompact = function () {
      bnav.classList.add("is-compact");
      clearTimeout(bnavT);
      bnavT = setTimeout(function () { bnav.classList.remove("is-compact"); }, 650);
    };
    window.addEventListener("scroll", bnavCompact, { passive: true });
    const bnavWake = function () { clearTimeout(bnavT); bnav.classList.remove("is-compact"); };
    bnav.addEventListener("pointerdown", bnavWake);
    bnav.addEventListener("touchstart", bnavWake, { passive: true });
  }

  /* ---------- scroll progress ---------- */
  const progress = document.getElementById("scrollProgress");
  if (progress) {
    const updP = function () {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      progress.style.width = (max > 0 ? (el.scrollTop / max) * 100 : 0) + "%";
    };
    window.addEventListener("scroll", updP, { passive: true });
    updP();
  }

  /* ---------- scroll-triggered animations (init after loader) ---------- */
  function initScrollAnimations() {
  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window && !reduced) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const group = el.closest("[data-stagger]");
        if (group) {
          const items = Array.prototype.slice.call(group.querySelectorAll("[data-reveal]"));
          el.style.transitionDelay = Math.min(items.indexOf(el), 8) * 70 + "ms";
        }
        el.classList.add("is-visible");
        io.unobserve(el);
      });
    }, { threshold: 0.08, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("is-visible"); });
  }

  /* ---------- count-up ---------- */
  const counters = document.querySelectorAll("[data-count]");
  const runCount = function (el) {
    const target = parseInt(el.getAttribute("data-count"), 10) || 0;
    const suffix = el.getAttribute("data-suffix") || "";
    if (reduced) { el.textContent = target.toLocaleString("nl-NL") + suffix; return; }
    const dur = 1400, start = performance.now();
    const tick = function (now) {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased).toLocaleString("nl-NL") + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if ("IntersectionObserver" in window) {
    const co = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { if (entry.isIntersecting) { runCount(entry.target); co.unobserve(entry.target); } });
    }, { threshold: 0.6 });
    counters.forEach(function (el) { co.observe(el); });
  } else { counters.forEach(runCount); }

  /* ---------- decode / scramble (all green eyebrows, on scroll) ---------- */
  const glyphs = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&/<>_";
  const runDecode = function (el) {
    const finalText = el.dataset.finalText || el.textContent;
    el.dataset.finalText = finalText;
    if (reduced) { el.textContent = finalText; return; }
    let frame = 0;
    const id = setInterval(function () {
      frame++;
      const settled = Math.floor(frame / 1.6);
      let out = "";
      for (let i = 0; i < finalText.length; i++) {
        const c = finalText[i];
        out += (i < settled || c === " ") ? c : glyphs[Math.floor(Math.random() * glyphs.length)];
      }
      el.textContent = out;
      if (settled >= finalText.length) { clearInterval(id); el.textContent = finalText; }
    }, 28);
  };
  const decodeEls = document.querySelectorAll("[data-decode]");
  if ("IntersectionObserver" in window && !reduced) {
    const dio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { runDecode(entry.target); dio.unobserve(entry.target); }
      });
    }, { threshold: 0.6 });
    decodeEls.forEach(function (el) { dio.observe(el); });
  }
  } /* end initScrollAnimations */

  /* ---------- hero parallax ---------- */
  const hero = document.querySelector(".hero");
  if (hero && !reduced && fine) {
    const layers = hero.querySelectorAll("[data-depth]");
    hero.addEventListener("pointermove", function (e) {
      const r = hero.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      layers.forEach(function (l) {
        const d = parseFloat(l.getAttribute("data-depth")) || 0;
        l.style.transform = "translate(" + (x * d).toFixed(1) + "px," + (y * d).toFixed(1) + "px)";
      });
    });
    hero.addEventListener("pointerleave", function () { layers.forEach(function (l) { l.style.transform = ""; }); });
  }

  /* ---------- 3D tilt ---------- */
  if (!reduced && fine) {
    document.querySelectorAll("[data-tilt]").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transition = "transform .08s linear";
        card.style.transform = "rotateY(" + (x * 7).toFixed(2) + "deg) rotateX(" + (-y * 7).toFixed(2) + "deg) translateY(-6px)";
      });
      card.addEventListener("pointerleave", function () {
        card.style.transition = "transform .5s cubic-bezier(.22,.61,.36,1)";
        card.style.transform = "";
      });
    });
  }

  /* ---------- magnetic buttons ---------- */
  if (!reduced && fine) {
    document.querySelectorAll(".btn--primary.btn--lg").forEach(function (btn) {
      btn.addEventListener("pointermove", function (e) {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - r.left - r.width / 2;
        const y = e.clientY - r.top - r.height / 2;
        btn.style.transition = "transform .1s ease-out";
        btn.style.transform = "translate(" + (x * 0.3).toFixed(1) + "px," + (y * 0.4 - 2).toFixed(1) + "px)";
      });
      btn.addEventListener("pointerleave", function () {
        btn.style.transition = "transform .45s cubic-bezier(.34,1.56,.64,1)";
        btn.style.transform = "";
      });
    });
  }

  /* ---------- self-healing phone: break on hover, heal on leave ---------- */
  const scan = phone ? phone.querySelector(".scanline") : null;
  function healPhone() {
    if (!phone) return;
    phone.classList.remove("is-broken");
    phone.classList.add("is-healed");
    if (scan && !reduced) { scan.style.animation = "none"; void scan.offsetWidth; scan.style.animation = ""; }
  }
  function breakPhone() {
    if (!phone) return;
    phone.classList.remove("is-healed");
    phone.classList.add("is-broken");
  }
  if (phone && !reduced) {
    phone.addEventListener("pointerenter", breakPhone);
    phone.addEventListener("pointerleave", healPhone);
    /* touch: tap toggles */
    phone.addEventListener("click", function () {
      if (phone.classList.contains("is-broken")) healPhone(); else breakPhone();
    });
  }

  /* ---------- live open / closed status ---------- */
  const HOURS = {
    leiden:  { 1: [780, 1050], 2: [600, 1050], 3: [600, 1050], 4: [600, 1050], 5: [600, 1050], 6: [600, 1020] },
    katwijk: { 1: [780, 1050], 2: [600, 1050], 3: [600, 1050], 4: [600, 1050], 5: [600, 1050], 6: [600, 1020] }
  };
  const fmt = function (m) { return String(Math.floor(m / 60)).padStart(2, "0") + ":" + String(m % 60).padStart(2, "0"); };
  const applyStatus = function () {
    document.querySelectorAll(".status[data-loc]").forEach(function (el) {
      const loc = el.getAttribute("data-loc");
      const now = new Date();
      const mins = now.getHours() * 60 + now.getMinutes();
      const win = (HOURS[loc] || {})[now.getDay()];
      let open = false, txt = "Nu gesloten";
      if (win && mins >= win[0] && mins < win[1]) { open = true; txt = "Nu geopend · tot " + fmt(win[1]); }
      el.classList.toggle("status--open", open);
      el.classList.toggle("status--closed", !open);
      el.innerHTML = '<span class="status__dot"></span>' + txt;
    });
  };
  applyStatus();
  setInterval(applyStatus, 60000);

})();
