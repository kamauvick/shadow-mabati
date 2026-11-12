/* ------------------------------------------------------------------
   Shared: layout chrome, cart, product quick-view, checkout, PDF, WhatsApp
------------------------------------------------------------------- */
(function () {
  const CFG = window.SM_CONFIG;
  const PRODUCTS = window.SM_PRODUCTS;
  const COLOURS = window.SM_COLOURS;
  const A = window.SMArt;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (n) => `KES ${Math.round(n).toLocaleString("en-KE")}`;
  const isHome = document.body.dataset.page === "home";
  const homeHref = (hash) => (isHome ? hash : `index.html${hash}`);

  /* ---------- icons ---------- */
  const I = (d, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" ${extra}>${d}</svg>`;
  const ICON = {
    cart: I('<path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6.2"/><circle cx="10" cy="20.5" r="1.3"/><circle cx="17.5" cy="20.5" r="1.3"/>'),
    menu: I('<path d="M4 7h16M4 12h16M4 17h10"/>'),
    close: I('<path d="M6 6l12 12M18 6 6 18"/>'),
    arrow: I('<path d="M5 12h14M13 6l6 6-6 6"/>'),
    check: I('<path d="M5 12.5 10 17l9-10"/>'),
    shield: I('<path d="M12 3 4 6v6c0 4.5 3.4 8.4 8 9 4.6-.6 8-4.5 8-9V6l-8-3Z"/><path d="m8.5 12 2.5 2.5 4.5-5"/>'),
    truck: I('<path d="M2 6h11v10H2zM13 10h4.5L21 13.5V16h-8"/><circle cx="6" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>'),
    tag: I('<path d="M3 12V4h8l10 10-8 8L3 12Z"/><circle cx="7.5" cy="8" r="1.4"/>'),
    ruler: I('<path d="M3 17 17 3l4 4L7 21l-4-4Z"/><path d="m7 13 2 2M10 10l2 2M13 7l2 2"/>'),
    refresh: I('<path d="M4 4v6h6"/><path d="M20 20v-6h-6"/><path d="M5.6 15a7.5 7.5 0 0 0 13.1 1.6M18.4 9A7.5 7.5 0 0 0 5.3 7.4"/>'),
    phone: I('<path d="M5 3h3.5l1.7 4.5-2.3 1.4a12 12 0 0 0 7.2 7.2l1.4-2.3L21 15.5V19a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2Z"/>'),
    mail: I('<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3.5 6.5 8.5 6.5 8.5-6.5"/>'),
    pin: I('<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/>'),
    clock: I('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'),
    calc: I('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h2M12 11h2M16 11h0M8 15h2M12 15h2M16 15v2"/>'),
    doc: I('<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8l-5-5Z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>'),
    factory: I('<path d="M3 21V10l6 4V10l6 4V6h6v15H3Z"/><path d="M7 17h2M12 17h2M17 17h1"/>'),
    star: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9L12 2.8Z"/></svg>',
    info: I('<circle cx="12" cy="12" r="9"/><path d="M12 11v5M12 8h.01"/>'),
    filter: I('<path d="M4 6h16M7 12h10M10 18h4"/>'),
    share: I('<circle cx="18" cy="5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="19" r="2.5"/><path d="m8.2 10.8 7.6-4.5M8.2 13.2l7.6 4.5"/>'),
    download: I('<path d="M12 4v11M7 10l5 5 5-5M5 20h14"/>'),
    sparkle: I('<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>'),
    leaf: I('<path d="M5 19c0-8 5-14 15-14 0 10-6 15-14 15"/><path d="M5 19c3-4 6-6 10-8"/>'),
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2c-1.5 0-3-.4-4.3-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.3-.4.2-.4.7-1.4.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7c.1.2 1.9 2.9 4.6 4 1.7.7 2.4.8 3.2.7.5-.1 1.5-.6 1.8-1.2s.2-1.1.1-1.2l-.5-.3Z"/></svg>',
  };

  /* ---------- product helpers ---------- */
  const byId = (id) => PRODUCTS.find((p) => p.id === id);
  const colourHex = (name) => (COLOURS.find((c) => c.name === name) || {}).hex || "#9aa3ad";
  const isSheet = (p) => p.unit === "m";
  function unitPrice(p, gauge, finish) {
    if (!isSheet(p)) return p.price;
    return p.base + (CFG.gaugeUplift[gauge] || 0) + (CFG.finishUplift[finish] || 0);
  }
  function fromPrice(p) {
    if (p.quote) return null; // price on request
    if (!isSheet(p)) return p.price;
    return Math.min(...p.gauges.map((g) => unitPrice(p, g, p.finishes[0])));
  }
  const unitLabel = (p) => ({ m: "/ metre", tile: "/ tile", pc: "/ piece", set: "/ set", kg: "/ kg", box: "/ box", pack: "/ pack", tube: "/ tube", bundle: "/ bundle", roll: "/ roll" }[p.unit] || "");
  const perSqm = (p, gauge, finish) => (isSheet(p) ? unitPrice(p, gauge, finish) / p.cover : p.perSqm && p.price ? p.price * p.perSqm : null);
  // Real photo for this product/colour if we have one, otherwise the drawn illustration in that colour
  function photoFor(p, colourName) {
    if (!p.photos) return null;
    const c = colourName || (p.colours ? p.colours[0] : "");
    return p.photos[c] || null;
  }
  function artFor(p, colourName, { photo = true } = {}) {
    const src = photo && photoFor(p, colourName);
    if (src) return `<img src="assets/products/${src}" alt="${esc(p.name)}${colourName ? ` in ${esc(colourName)}` : ""}" loading="lazy" decoding="async">`;
    const hex = colourName ? colourHex(colourName) : p.colours ? colourHex(p.colours[0]) : "#9aa3ad";
    return A.sheetArt(p.profile, hex);
  }
  function lineTotal(item) {
    const p = byId(item.id);
    if (!p) return 0;
    return isSheet(p) ? unitPrice(p, item.gauge, item.finish) * item.length * item.qty : p.price * item.qty;
  }
  function lineSpec(item) {
    const p = byId(item.id);
    const bits = [];
    if (item.gauge) bits.push(`G${item.gauge}`);
    if (item.finish && isSheet(p)) bits.push(item.finish);
    if (item.colour) bits.push(item.colour);
    return bits.join(" · ");
  }
  function lineQtyText(item) {
    const p = byId(item.id);
    if (isSheet(p)) return item.note ? `${item.length} m total (${item.note})` : `${item.qty} sheet${item.qty > 1 ? "s" : ""} × ${item.length} m`;
    const plural = { box: "boxes", pc: "pcs", kg: "kg" }[p.unit] || `${p.unit}s`;
    return `${item.qty} ${item.qty > 1 ? plural : p.unit}`;
  }

  /* ---------- storage-safe cart ---------- */
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignore */ } },
  };
  let cart = store.get("sm_cart", []).filter((i) => byId(i.id));
  const listeners = [];
  function saveCart() { store.set("sm_cart", cart); updateCount(); listeners.forEach((f) => f(cart)); if (drawerOpen) renderDrawer(); }
  function addToCart(item, { silent = false } = {}) {
    if (!byId(item.id) || byId(item.id).quote) return; // price-on-request items are enquired about, not carted
    const key = [item.id, item.colour, item.gauge, item.finish, item.length, item.note].join("|");
    const ex = cart.find((i) => i.key === key);
    if (ex) ex.qty += item.qty; else cart.push({ ...item, key });
    saveCart();
    const c = $(".cart-count");
    if (c) { c.classList.remove("bump"); void c.offsetWidth; c.classList.add("bump"); }
    if (!silent) toast(`${byId(item.id).name} added to cart`, "View cart", openDrawer);
  }
  const cartSubtotal = () => cart.reduce((s, i) => s + lineTotal(i), 0);
  function updateCount() {
    const n = cart.length;
    $$(".cart-count").forEach((el) => { el.textContent = n; el.classList.toggle("show", n > 0); });
  }

  /* ---------- chrome ---------- */
  function renderChrome() {
    // [label, target]: targets starting with "#" are sections on the home page
    const nav = [["Shop", "shop.html"], ["Virtual visualiser", "#visualiser"], ["Calculator", "#calculator"], ["About", "#about"], ["FAQ", "#faq"], ["Contact", "#contact"]];
    const navLink = ([t, h]) => {
      const href = h.startsWith("#") ? homeHref(h) : h;
      const active = h === "shop.html" && document.body.dataset.page === "shop";
      return `<a href="${href}"${active ? ' class="active" aria-current="page"' : ""}>${t}</a>`;
    };
    const logo = `<img class="logo" src="assets/logo.png" alt="Shadow Mabati" width="900" height="460">`;
    document.body.insertAdjacentHTML("afterbegin", `
      ${CFG.showTopbar ? `<div class="topbar"><div class="wrap">
        <span><b>Factory-direct prices</b> · Cut to your exact length · Same-day delivery around Ruiru</span>
        <span class="tb-right"><a href="tel:${CFG.phoneDisplay.replace(/\s/g, "")}">${CFG.phoneDisplay}</a><span>${CFG.hours}</span></span>
      </div></div>` : ""}
      <header class="site-header"><div class="wrap">
        <a href="index.html" class="brand" aria-label="Shadow Mabati home">${logo}</a>
        <nav class="nav" aria-label="Main">${nav.map(navLink).join("")}</nav>
        <div class="header-actions">
          <a href="shop.html" class="btn btn-red btn-sm btn-shop">Shop now</a>
          <button class="icon-btn" data-open-cart aria-label="Open cart">${ICON.cart}<span class="cart-count">0</span></button>
          <button class="icon-btn menu-btn" aria-label="Menu" aria-expanded="false">${ICON.menu}</button>
        </div>
      </div></header>
      <nav class="mobile-nav" aria-label="Mobile">${nav.map(navLink).join("")}<a href="shop.html" class="btn btn-red">Shop now ${ICON.arrow}</a></nav>`);

    document.body.insertAdjacentHTML("beforeend", `
      <footer class="site-footer"><div class="wrap">
        <div class="footer-grid">
          <div class="footer-brand">${logo}<p>Kenyan-made roofing sheets and accessories, roll-formed to your exact lengths in Kamakis, along the Ruiru Bypass.</p></div>
          <div><h4>Shop</h4><ul>
            <li><a href="shop.html?cat=Roofing%20Sheets">Roofing sheets</a></li>
            <li><a href="shop.html?cat=Ridges%20%26%20Flashing">Ridges & flashing</a></li>
            <li><a href="shop.html?cat=Gutters%20%26%20Downpipes">Gutters & downpipes</a></li>
            <li><a href="shop.html?cat=Fixings">Nails & fixings</a></li>
            <li><a href="shop.html?cat=Shingles%20%26%20Insulation">Shingles & insulation</a></li></ul></div>
          <div><h4>Company</h4><ul>
            <li><a href="${homeHref("#about")}">About us</a></li><li><a href="${homeHref("#visualiser")}">Roof visualiser</a></li>
            <li><a href="${homeHref("#calculator")}">Roof calculator</a></li><li><a href="${homeHref("#faq")}">FAQ</a></li></ul></div>
          <div><h4>Visit the factory</h4><ul>
            <li>${esc(CFG.address)}</li><li>${esc(CFG.hours)}</li>
            <li><a href="tel:${CFG.phoneDisplay.replace(/\s/g, "")}">${CFG.phoneDisplay}</a></li><li><a href="mailto:${CFG.email}">${CFG.email}</a></li></ul></div>
        </div>
        <div class="footer-bottom"><span>© ${new Date().getFullYear()} ${esc(CFG.businessName)}. All rights reserved.</span><span>${esc(CFG.vatNote)}</span></div>
      </div></footer>
      <a class="wa-float" href="${waLink("Hello Shadow Mabati, I'd like to enquire about roofing sheets.")}" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${ICON.wa}</a>
      <div class="scrim" data-scrim></div>
      <aside class="drawer" aria-label="Cart" aria-hidden="true"></aside>
      <div class="modal" id="modal" role="dialog" aria-modal="true"><div class="modal-card"></div></div>
      <div class="toast" role="status"></div>`);

    const header = $(".site-header");
    const onScroll = () => header.classList.toggle("scrolled", scrollY > 8);
    addEventListener("scroll", onScroll, { passive: true }); onScroll();
    const mb = $(".menu-btn"), mn = $(".mobile-nav");
    mb.addEventListener("click", () => { const o = mn.classList.toggle("open"); mb.setAttribute("aria-expanded", o); mb.innerHTML = o ? ICON.close : ICON.menu; });
    $$("a", mn).forEach((a) => a.addEventListener("click", () => { mn.classList.remove("open"); mb.innerHTML = ICON.menu; }));
    document.addEventListener("click", (e) => {
      if (e.target.closest("[data-open-cart]")) openDrawer();
      if (e.target.closest("[data-scrim]")) { closeDrawer(); closeModal(); window.dispatchEvent(new Event("sm:scrim")); }
      const q = e.target.closest("[data-quick]");
      if (q) openProduct(q.dataset.quick);
    });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeDrawer(); closeModal(); } });
    updateCount();
  }

  /* ---------- toast ---------- */
  let toastT;
  function toast(msg, actionLabel, action) {
    const t = $(".toast");
    t.innerHTML = `${ICON.check}<span>${esc(msg)}</span>${actionLabel ? `<button>${esc(actionLabel)}</button>` : ""}`;
    if (actionLabel) $("button", t).onclick = () => { t.classList.remove("show"); action(); };
    t.classList.add("show");
    clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove("show"), 3600);
  }

  /* ---------- modal ---------- */
  let lastFocus;
  function openModal(html, cls = "") {
    lastFocus = document.activeElement;
    const m = $("#modal"), card = $(".modal-card", m);
    card.className = `modal-card ${cls}`;
    card.innerHTML = `<button class="icon-btn modal-close" aria-label="Close">${ICON.close}</button>${html}`;
    $(".modal-close", card).onclick = closeModal;
    m.onclick = (e) => { if (e.target === m) closeModal(); };
    m.classList.add("open"); $("[data-scrim]").classList.add("open");
    document.body.style.overflow = "hidden";
    setTimeout(() => $(".modal-close", card).focus(), 50);
    return card;
  }
  function closeModal() {
    const m = $("#modal");
    if (!m || !m.classList.contains("open")) return;
    m.classList.remove("open");
    if (!drawerOpen) { $("[data-scrim]").classList.remove("open"); document.body.style.overflow = ""; }
    lastFocus && lastFocus.focus && lastFocus.focus();
  }

  /* ---------- product quick view ---------- */
  function segHTML(name, values, current, fmtFn = (v) => v) {
    return `<div class="seg" data-opt="${name}">${values.map((v) => `<button type="button" data-v="${v}" aria-pressed="${String(v) === String(current)}">${fmtFn(v)}</button>`).join("")}</div>`;
  }
  function openProduct(id, preset = {}) {
    const p = byId(id);
    if (!p) return;
    if (p.quote) return openEnquiry(p);
    const st = {
      colour: preset.colour || (p.colours ? p.colours[0] : null),
      gauge: preset.gauge || (p.gauges && p.gauges.length ? (p.gauges.includes(28) ? 28 : p.gauges[0]) : null),
      finish: preset.finish || (isSheet(p) ? p.finishes[0] : null),
      length: preset.length || 3,
      qty: preset.qty || (isSheet(p) ? 10 : 1),
    };
    const card = openModal(`<div class="pd">
      <div class="pd-media"></div>
      <div class="pd-body">
        <div><div class="pc-cat">${esc(p.category)}${p.use ? ` · ${esc(p.use)}` : ""}</div><h2>${esc(p.name)}</h2></div>
        <p class="lead" style="font-size:1rem">${esc(p.short)}</p>
        ${p.colours ? `<div class="opt-group"><span class="label">Colour · <em data-colour-name></em></span><div class="swatches">${p.colours.map((c) => `<button class="swatch" type="button" data-colour="${esc(c)}" style="background:${colourHex(c)}" aria-label="${esc(c)}" title="${esc(c)}"></button>`).join("")}</div></div>` : ""}
        ${p.gauges && p.gauges.length ? `<div class="opt-group"><span class="label">Gauge</span>${segHTML("gauge", p.gauges, st.gauge, (g) => `G${g}`)}</div>` : ""}
        ${isSheet(p) && p.finishes.length > 1 ? `<div class="opt-group"><span class="label">Finish</span>${segHTML("finish", p.finishes, st.finish)}</div>` : ""}
        <div class="fields">
          ${isSheet(p) ? `<div class="field"><label for="pd-len">Length per sheet</label><div class="input-unit"><input id="pd-len" class="input" type="number" min="1" max="10" step="0.1" value="${st.length}"><span>m</span></div></div>` : ""}
          <div class="field ${isSheet(p) ? "" : "full"}"><label for="pd-qty">${isSheet(p) ? "Number of sheets" : `Quantity (${p.unit})`}</label><input id="pd-qty" class="input" type="number" min="1" step="1" value="${st.qty}"></div>
        </div>
        <div class="pd-actions">
          <div class="pd-price"><div><small data-unit-price></small><b data-line-total></b></div><div class="pd-cover"><small>Coverage</small><b data-cover></b></div></div>
          <div class="pd-btns">
            <button class="btn btn-red" data-add>${ICON.cart} Add to cart</button>
            <a class="btn btn-ghost" data-ask target="_blank" rel="noopener" aria-label="Ask on WhatsApp">${ICON.wa}<span>Ask on WhatsApp</span></a>
          </div>
        </div>
        <table class="spec-table"><tbody>
          ${isSheet(p) ? `<tr><td>Effective cover width</td><td>${p.cover} m</td></tr><tr><td>Lengths</td><td>Cut to size, 1 – 10 m</td></tr>` : ""}
          ${p.unit === "tile" ? `<tr><td>Tiles per m²</td><td>≈ ${p.perSqm}</td></tr>` : ""}
          ${p.warranty ? `<tr><td>Colour & perforation warranty</td><td>${esc(p.warranty)}</td></tr>` : ""}
          <tr><td>Price basis</td><td>${esc(unitLabel(p).replace("/ ", "per "))}, VAT incl.</td></tr>
        </tbody></table>
      </div></div>`);

    const media = $(".pd-media", card);
    const lenI = $("#pd-len", card), qtyI = $("#pd-qty", card);
    // keep the price / add-to-cart bar last so it can pin to the bottom on small screens
    const acts = $(".pd-actions", card); acts.parentElement.appendChild(acts);
    let artColour = null;
    function update() {
      if (artColour !== st.colour) {
        artColour = st.colour;
        media.innerHTML = artFor(p, st.colour);
        const svgEl = $("svg", media); if (svgEl) svgEl.setAttribute("preserveAspectRatio", "xMidYMid meet");
      }
      $$("[data-colour]", card).forEach((b) => b.setAttribute("aria-pressed", b.dataset.colour === st.colour));
      const cn = $("[data-colour-name]", card); if (cn) cn.textContent = st.colour;
      st.length = lenI ? Math.min(10, Math.max(1, parseFloat(lenI.value) || 1)) : null;
      st.qty = Math.max(1, parseInt(qtyI.value, 10) || 1);
      const up = unitPrice(p, st.gauge, st.finish);
      const item = { id: p.id, colour: st.colour, gauge: st.gauge, finish: st.finish, length: st.length, qty: st.qty };
      $("[data-unit-price]", card).textContent = `${fmt(up)} ${unitLabel(p)}`;
      $("[data-line-total]", card).textContent = fmt(lineTotal(item));
      $("[data-cover]", card).textContent = isSheet(p) ? `${(st.length * p.cover * st.qty).toFixed(1)} m²` : p.unit === "tile" ? `${(st.qty / p.perSqm).toFixed(1)} m²` : "—";
      $("[data-ask]", card).href = waLink(`Hello Shadow Mabati, I'm interested in ${p.name}${lineSpec(item) ? ` (${lineSpec(item)})` : ""}, ${lineQtyText(item)}. Is it available?`);
    }
    card.addEventListener("click", (e) => {
      const sw = e.target.closest("[data-colour]"); if (sw) { st.colour = sw.dataset.colour; update(); }
      const sb = e.target.closest(".seg button");
      if (sb) { const o = sb.parentElement.dataset.opt; st[o] = o === "gauge" ? Number(sb.dataset.v) : sb.dataset.v; $$("button", sb.parentElement).forEach((b) => b.setAttribute("aria-pressed", b === sb)); update(); }
      if (e.target.closest("[data-add]")) {
        update();
        addToCart({ id: p.id, colour: st.colour, gauge: st.gauge, finish: st.finish, length: st.length, qty: st.qty });
        closeModal();
      }
    });
    card.addEventListener("input", update);
    update();
  }

  /* ---------- drawer: cart + checkout ---------- */
  let drawerOpen = false, step = 1;
  const customer = store.get("sm_customer", { name: "", phone: "", location: "", delivery: "pickup", notes: "", pay: "M-PESA" });
  function openDrawer() { drawerOpen = true; step = 1; renderDrawer(); $(".drawer").classList.add("open"); $(".drawer").setAttribute("aria-hidden", "false"); $("[data-scrim]").classList.add("open"); document.body.style.overflow = "hidden"; }
  function closeDrawer() { if (!drawerOpen) return; drawerOpen = false; $(".drawer").classList.remove("open"); $(".drawer").setAttribute("aria-hidden", "true"); if (!$("#modal").classList.contains("open")) { $("[data-scrim]").classList.remove("open"); document.body.style.overflow = ""; } }
  function deliveryFee(optId, subtotal) {
    const o = CFG.delivery.find((d) => d.id === optId) || CFG.delivery[0];
    if (o.fee === null) return null;
    if (o.freeAbove && subtotal >= o.freeAbove) return 0;
    return o.fee;
  }
  function renderDrawer() {
    const d = $(".drawer");
    const sub = cartSubtotal();
    const head = `<div class="drawer-head"><div><h3>${step === 1 ? "Your cart" : "Checkout"}</h3><div class="drawer-steps"><span class="${step === 1 ? "on" : ""}">1 Cart</span>›<span class="${step === 2 ? "on" : ""}">2 Details</span>›<span>3 WhatsApp</span></div></div><button class="icon-btn" data-close-drawer aria-label="Close cart">${ICON.close}</button></div>`;
    if (!cart.length) {
      d.innerHTML = `${head}<div class="drawer-body"><div class="empty">${ICON.cart}<b style="color:var(--ink)">Your cart is empty</b><p>Browse the shop or let the roof calculator build a complete order for you.</p><a href="shop.html" class="btn btn-red">Browse products</a><a href="${homeHref("#calculator")}" class="btn btn-ghost" data-close-drawer>Use the calculator</a></div></div>`;
    } else if (step === 1) {
      d.innerHTML = `${head}<div class="drawer-body">${cart.map((it, idx) => {
        const p = byId(it.id);
        return `<div class="cart-line"><div class="cart-thumb">${artFor(p, it.colour)}</div>
          <div><h4>${esc(p.name)}</h4><div class="spec">${esc(lineSpec(it))}${lineSpec(it) ? "<br>" : ""}${esc(lineQtyText(it))}</div>
          ${it.note ? "" : `<div class="qty"><button data-dec="${idx}" aria-label="Decrease">−</button><input data-qty="${idx}" type="number" min="1" value="${it.qty}" aria-label="Quantity"><button data-inc="${idx}" aria-label="Increase">+</button></div>`}</div>
          <div class="lt"><b>${fmt(lineTotal(it))}</b><button class="remove" data-rm="${idx}">Remove</button></div></div>`;
      }).join("")}
        <div class="note-box">${ICON.info}<span>Sheets are cut to the lengths shown. Not sure about quantities? Add a note at checkout and our team will check your cutting list before production.</span></div>
      </div>
      <div class="drawer-foot"><div class="sum-row total"><span>Subtotal</span><span>${fmt(sub)}</span></div>
        <button class="btn btn-red btn-block" data-next>Continue to checkout ${ICON.arrow}</button>
        <button class="remove" style="justify-self:center" data-clear>Clear cart</button></div>`;
    } else {
      const fee = deliveryFee(customer.delivery, sub);
      d.innerHTML = `${head}<form class="drawer-body" id="checkout-form" novalidate>
        <div class="field"><label for="c-name">Full name</label><input class="input" id="c-name" name="name" required autocomplete="name" value="${esc(customer.name)}"></div>
        <div class="field"><label for="c-phone">Phone (M-PESA)</label><input class="input" id="c-phone" name="phone" required inputmode="tel" autocomplete="tel" placeholder="07XX XXX XXX" value="${esc(customer.phone)}"></div>
        <div class="field"><label for="c-loc">Delivery location / site</label><input class="input" id="c-loc" name="location" placeholder="e.g. Ruiru, Membley Estate" value="${esc(customer.location)}"></div>
        <div class="field"><span class="label">Delivery</span><div style="display:grid;gap:8px">${CFG.delivery.map((o) => {
          const f = deliveryFee(o.id, sub);
          return `<label class="radio-card"><input type="radio" name="delivery" value="${o.id}" ${customer.delivery === o.id ? "checked" : ""}><div><b>${esc(o.label)}</b><span>${esc(o.note)}</span></div><span class="fee">${f === null ? "Quoted" : f === 0 ? "Free" : fmt(f)}</span></label>`;
        }).join("")}</div></div>
        <div class="field"><span class="label">Preferred payment</span><div class="chip-row" data-pay>${["M-PESA", "Bank transfer", "Cash at factory"].map((m) => `<button type="button" class="chip" aria-pressed="${customer.pay === m}">${m}</button>`).join("")}</div></div>
        <div class="field"><label for="c-notes">Notes for our team (optional)</label><textarea class="input" id="c-notes" name="notes" placeholder="Delivery date, cutting list, site directions…">${esc(customer.notes)}</textarea></div>
      </form>
      <div class="drawer-foot">
        <div class="sum-row"><span>Subtotal (${cart.length} item${cart.length > 1 ? "s" : ""})</span><span>${fmt(sub)}</span></div>
        <div class="sum-row"><span>Delivery</span><span>${fee === null ? "Confirmed on WhatsApp" : fee === 0 ? "Free" : fmt(fee)}</span></div>
        <div class="sum-row total"><span>Total</span><span>${fmt(sub + (fee || 0))}</span></div>
        ${hasCloud()
          ? `<div class="note-box">${ICON.doc}<span>We'll create your order <b>PDF</b> and send it to Shadow Mabati on WhatsApp for confirmation.</span></div>`
          : canSharePDF() ? `<div class="note-box">${ICON.info}<span>Your order is sent as a <b>PDF</b>. When WhatsApp opens, choose the <b>Shadow Mabati</b> chat (${esc(CFG.phoneDisplay)}).</span></div>` : ""}
        <button class="btn btn-wa btn-block" data-place>${ICON.wa} ${hasCloud() || canSharePDF() ? "Send order PDF on WhatsApp" : "Place order via WhatsApp"}</button>
        <button class="remove" style="justify-self:center" data-back>← Back to cart</button>
      </div>`;
    }
  }
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".drawer")) return;
    const t = e.target;
    if (t.closest("[data-close-drawer]")) closeDrawer();
    const inc = t.closest("[data-inc]"), dec = t.closest("[data-dec]"), rm = t.closest("[data-rm]");
    if (inc) { cart[inc.dataset.inc].qty++; saveCart(); }
    if (dec) { const i = cart[dec.dataset.dec]; i.qty = Math.max(1, i.qty - 1); saveCart(); }
    if (rm) { cart.splice(Number(rm.dataset.rm), 1); saveCart(); }
    if (t.closest("[data-clear]")) { cart = []; saveCart(); }
    if (t.closest("[data-next]")) { step = 2; renderDrawer(); }
    if (t.closest("[data-back]")) { readCheckout(); step = 1; renderDrawer(); }
    const chip = t.closest("[data-pay] .chip");
    if (chip) { customer.pay = chip.textContent; $$("[data-pay] .chip").forEach((c) => c.setAttribute("aria-pressed", c === chip)); }
    if (t.closest("[data-place]")) placeOrder();
  });
  document.addEventListener("change", (e) => {
    const q = e.target.closest(".drawer [data-qty]");
    if (q) { cart[q.dataset.qty].qty = Math.max(1, parseInt(q.value, 10) || 1); saveCart(); }
    if (e.target.name === "delivery" && e.target.closest(".drawer")) { readCheckout(); renderDrawer(); }
  });
  function readCheckout() {
    const f = $("#checkout-form");
    if (!f) return;
    const fd = new FormData(f);
    Object.assign(customer, { name: fd.get("name").trim(), phone: fd.get("phone").trim(), location: fd.get("location").trim(), delivery: fd.get("delivery") || "pickup", notes: fd.get("notes").trim() });
    store.set("sm_customer", customer);
  }

  /* ---------- order → PDF → WhatsApp ---------- */
  function orderNo(prefix = "SM") {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    const abc = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const rand = Array.from({ length: 4 }, () => abc[Math.floor(Math.random() * abc.length)]).join("");
    return `${prefix}-${String(d.getFullYear()).slice(2)}${p(d.getMonth() + 1)}${p(d.getDate())}-${rand}`;
  }
  function placeOrder() {
    readCheckout();
    const bad = [];
    if (!customer.name) bad.push("#c-name");
    if (!/^(\+?254|0)?[17]\d{8}$/.test(customer.phone.replace(/[\s-]/g, ""))) bad.push("#c-phone");
    if (customer.delivery !== "pickup" && !customer.location) bad.push("#c-loc");
    $$("#checkout-form .input").forEach((i) => (i.style.borderColor = ""));
    if (bad.length) { bad.forEach((s) => ($(s).style.borderColor = "var(--red)")); $(bad[0]).focus(); toast(bad.includes("#c-phone") ? "Please enter a valid Kenyan phone number" : "Please fill in the highlighted fields"); return; }

    const sub = cartSubtotal();
    const fee = deliveryFee(customer.delivery, sub);
    const dOpt = CFG.delivery.find((d) => d.id === customer.delivery);
    const order = {
      no: orderNo(), title: "ORDER REQUEST", date: new Date(), customer: { ...customer }, deliveryLabel: dOpt.label,
      items: cart.map((i) => ({ ...i })), subtotal: sub, deliveryFee: fee, total: sub + (fee || 0),
    };
    const lines = order.items.map((it, i) => `${i + 1}. ${byId(it.id).name}${lineSpec(it) ? ` (${lineSpec(it)})` : ""}: ${lineQtyText(it)} = ${fmt(lineTotal(it))}`);
    const msg = [
      `Hello Shadow Mabati, I'd like to place an order.`, ``,
      `*Order:* ${order.no}`, `*Name:* ${customer.name}`, `*Phone:* ${customer.phone}`,
      `*Delivery:* ${dOpt.label}${customer.location ? ` (${customer.location})` : ""}`, `*Payment:* ${customer.pay}`, ``,
      `*Items*`, ...lines, ``,
      `Subtotal: ${fmt(sub)}`, `Delivery: ${fee === null ? "to be confirmed" : fee === 0 ? "Free" : fmt(fee)}`, `*Total: ${fmt(order.total)}*`,
      customer.notes ? `\nNotes: ${customer.notes}` : "", ``, `(Order PDF attached)`,
    ].join("\n");
    sendWithPDF(order, msg, () => { cart = []; saveCart(); closeDrawer(); });
  }

  /* Phones/tablets: the PDF file itself goes to WhatsApp through the native share sheet.
     (wa.me links can only carry text, so desktop falls back to text + PDF download.) */
  function canSharePDF() {
    try {
      return matchMedia("(pointer:coarse)").matches && !!navigator.canShare &&
        navigator.canShare({ files: [new File(["x"], "t.pdf", { type: "application/pdf" })] });
    } catch { return false; }
  }
  const hasCloud = () => !!(CFG.supabase && CFG.supabase.url && CFG.supabase.key);

  /* Upload the PDF to Supabase Storage and log the order. Resolves with the public PDF URL. */
  async function uploadOrder(order, blob) {
    const { url, key, bucket } = CFG.supabase;
    const isOrder = order.title === "ORDER REQUEST";
    const uuid = crypto.randomUUID ? crypto.randomUUID()
      : "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) => (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16));
    const path = `${isOrder ? "orders" : "quotes"}/${order.no}-${uuid}.pdf`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 15000);
    const headers = { apikey: key };
    try {
      const up = fetch(`${url}/storage/v1/object/${bucket}/${path}`, { method: "POST", headers: { ...headers, "Content-Type": "application/pdf" }, body: blob, signal: ctrl.signal });
      const c = order.customer || {};
      const row = {
        order_no: order.no, kind: isOrder ? "order" : "quote",
        customer_name: c.name || null, customer_phone: c.phone || null, location: c.location || null,
        delivery: order.deliveryLabel || null, payment: c.pay || null, notes: c.notes || null, summary: order.summary || null,
        items: order.items.map((it) => ({ id: it.id, name: byId(it.id).name, colour: it.colour || null, gauge: it.gauge || null, finish: it.finish || null, length: it.length || null, qty: it.qty, note: it.note || null, line_total: Math.round(lineTotal(it)) })),
        subtotal: Math.round(order.subtotal), delivery_fee: order.deliveryFee == null ? null : order.deliveryFee, total: Math.round(order.total), pdf_path: path,
      };
      const ins = fetch(`${url}/rest/v1/orders`, { method: "POST", headers: { ...headers, "Content-Type": "application/json", Prefer: "return=minimal" }, body: JSON.stringify(row), signal: ctrl.signal });
      const [upRes, insRes] = await Promise.allSettled([up, ins]);
      if (upRes.status !== "fulfilled" || !upRes.value.ok) throw new Error("PDF upload failed");
      if (insRes.status !== "fulfilled" || !insRes.value.ok) console.warn("Order log insert failed", insRes);
      return `${url}/storage/v1/object/public/${bucket}/${path}`;
    } finally { clearTimeout(timer); }
  }

  function shortMessage(order, pdfUrl) {
    const isOrder = order.title === "ORDER REQUEST";
    const c = order.customer || {};
    return [
      isOrder ? "Hello Shadow Mabati, I'd like to place an order." : "Hello Shadow Mabati, I used your roof calculator and would like a quote.",
      ``,
      `*${isOrder ? "Order" : "Estimate"}:* ${order.no}`,
      c.name ? `*Name:* ${c.name}` : null,
      c.phone ? `*Phone:* ${c.phone}` : null,
      `*${isOrder ? "Total" : "Estimated total"}:* ${fmt(order.total)}`,
      ``,
      `📄 ${isOrder ? "Order" : "Quote"} PDF: ${pdfUrl}`,
    ].filter((l) => l !== null).join("\n");
  }

  function sendWithPDF(order, msg, onDone) {
    let blob = null;
    try { blob = buildPDF(order); } catch (err) { console.error(err); }
    const isOrder = order.title === "ORDER REQUEST";
    const filename = `Shadow-Mabati-${isOrder ? "Order" : "Quote"}-${order.no}.pdf`;
    const file = blob && new File([blob], filename, { type: "application/pdf" });

    if (blob && hasCloud()) {
      openModal(`<div class="spinner" aria-hidden="true"></div><h3 style="font-size:1.5rem">Preparing your ${isOrder ? "order" : "quote"}…</h3><p>Creating your PDF and saving ${order.no}.</p>`, "sm");
      uploadOrder(order, blob)
        .then((pdfUrl) => readyModal(order, pdfUrl, blob, filename, onDone))
        .catch((err) => { console.warn(err); offlineModal(order, msg, blob, file, filename, onDone); });
      return;
    }

    if (file && canSharePDF()) {
      // Called synchronously inside the click so the browser allows the share sheet.
      navigator.share({ files: [file], title: `${isOrder ? "Order" : "Quote"} ${order.no}` })
        .then(() => { onDone && onDone(); pdfSentModal(order, msg, file); })
        .catch((err) => {
          if (err && err.name === "AbortError") { toast(`Not sent yet. Your ${isOrder ? "cart is" : "estimate is"} still here, so you can try again.`); return; }
          textFallbackModal(order, msg, blob, filename, onDone);
        });
      return;
    }
    // Desktop fallback: open the chat with the order as text (synchronously, to avoid pop-up blockers) and download the PDF.
    window.open(waLink(msg), "_blank", "noopener");
    if (blob) downloadBlob(blob, filename);
    textFallbackModal(order, msg, blob, filename, onDone, true);
  }

  /* Upload succeeded: one tap opens the Shadow Mabati chat with the PDF link (a real anchor tap works best for opening the app). */
  function readyModal(order, pdfUrl, blob, filename, onDone) {
    const isOrder = order.title === "ORDER REQUEST";
    let done = false;
    const card = openModal(`<div class="big-icon">${ICON.doc}</div>
      <h3 style="font-size:1.6rem">Your ${isOrder ? "order" : "quote"} is ready</h3>
      <p>${isOrder ? "Order" : "Estimate"} <b style="color:var(--ink)">${order.no}</b> has been saved as a PDF. Tap below to send it to Shadow Mabati on WhatsApp.</p>
      <div style="display:grid;gap:10px;width:100%;margin-top:6px">
        <a class="btn btn-wa btn-block" data-send href="${waLink(shortMessage(order, pdfUrl))}" target="_blank" rel="noopener">${ICON.wa} Send ${isOrder ? "order" : "quote"} on WhatsApp</a>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
          <a class="btn btn-ghost btn-sm" href="${pdfUrl}" target="_blank" rel="noopener">${ICON.doc} View PDF</a>
          <button class="btn btn-ghost btn-sm" data-dl>${ICON.download} Save a copy</button>
        </div>
      </div>
      <p style="font-size:.8rem" data-after>A sales rep will confirm stock, the final price and delivery time on WhatsApp, usually within 30 minutes during working hours.</p>`, "sm");
    $("[data-dl]", card).onclick = () => downloadBlob(blob, filename);
    $("[data-send]", card).addEventListener("click", () => {
      if (done) return;
      done = true;
      // let the navigation start before touching the DOM
      setTimeout(() => {
        onDone && onDone();
        $(".big-icon", card).innerHTML = ICON.check;
        $("h3", card).textContent = isOrder ? "Order sent" : "Quote sent";
        $("[data-send]", card).innerHTML = `${ICON.wa} Open the chat again`;
      }, 400);
    });
  }

  /* Upload failed (offline, blocked, etc.): fall back to sharing the file or sending text. */
  function offlineModal(order, msg, blob, file, filename, onDone) {
    const isOrder = order.title === "ORDER REQUEST";
    const share = file && canSharePDF();
    const card = openModal(`<div class="big-icon" style="background:var(--red-soft);color:var(--red)">${ICON.info}</div>
      <h3 style="font-size:1.5rem">Let's send it another way</h3>
      <p>We couldn't upload the PDF just now${navigator.onLine === false ? " (you seem to be offline)" : ""}. You can still send ${order.no} to us:</p>
      <div style="display:grid;gap:10px;width:100%;margin-top:6px">
        ${share ? `<button class="btn btn-wa btn-block" data-share>${ICON.share} Share PDF to WhatsApp</button>` : ""}
        <a class="btn ${share ? "btn-ghost" : "btn-wa"} btn-block" data-text href="${waLink(msg)}" target="_blank" rel="noopener">${ICON.wa} Send ${isOrder ? "order" : "quote"} as a message</a>
        <button class="btn btn-ghost btn-sm" data-dl>${ICON.download} Download PDF</button>
      </div>
      ${share ? `<p style="font-size:.8rem">When sharing, choose the Shadow Mabati chat (${esc(CFG.phoneDisplay)}).</p>` : ""}`, "sm");
    let done = false;
    const finish = () => { if (!done) { done = true; setTimeout(() => onDone && onDone(), 400); } };
    $("[data-dl]", card).onclick = () => downloadBlob(blob, filename);
    $("[data-text]", card).addEventListener("click", finish);
    const sh = $("[data-share]", card);
    if (sh) sh.onclick = () => navigator.share({ files: [file], title: order.no }).then(finish).catch(() => {});
  }

  function pdfSentModal(order, msg, file) {
    const isOrder = order.title === "ORDER REQUEST";
    const card = openModal(`<div class="big-icon">${ICON.check}</div>
      <h3 style="font-size:1.6rem">${isOrder ? "Order PDF sent" : "Quote PDF sent"}</h3>
      <p>Thanks! Your ${isOrder ? "order" : "estimate"} <b style="color:var(--ink)">${order.no}</b> was shared as a PDF. A sales rep will confirm stock, the final price and delivery time on WhatsApp, usually within 30 minutes during working hours.</p>
      <div style="display:grid;gap:10px;width:100%;margin-top:6px">
        <button class="btn btn-ghost btn-block" data-share>${ICON.share} Picked the wrong chat? Share again</button>
        <a class="btn btn-ghost btn-block" href="${waLink(`Hello Shadow Mabati, I've just sent ${isOrder ? "order" : "quote request"} ${order.no}.`)}" target="_blank" rel="noopener">${ICON.wa} Open the Shadow Mabati chat</a>
      </div>`, "sm");
    $("[data-share]", card).onclick = () => navigator.share({ files: [file], title: order.no }).catch(() => {});
  }

  function textFallbackModal(order, msg, blob, filename, onDone, alreadyOpened) {
    onDone && onDone();
    const card = openModal(`<div class="big-icon">${ICON.check}</div>
      <h3 style="font-size:1.6rem">${order.title === "ORDER REQUEST" ? "Order ready to send" : "Quote ready"}</h3>
      <p>${alreadyOpened ? "We've opened WhatsApp" : "Tap below to open WhatsApp"} with your ${order.title === "ORDER REQUEST" ? "order" : "estimate"} <b style="color:var(--ink)">${order.no}</b> filled in.${blob ? " The PDF has been downloaded. Please attach it in the chat so our team has the full details." : ""}</p>
      <div style="display:grid;gap:10px;width:100%;margin-top:6px">
        <a class="btn btn-wa btn-block" href="${waLink(msg)}" target="_blank" rel="noopener">${ICON.wa} Open WhatsApp chat</a>
        ${blob ? `<button class="btn btn-ghost btn-block" data-dl>${ICON.download} ${alreadyOpened ? "Download PDF again" : "Download PDF"}</button>` : ""}
      </div>
      <p style="font-size:.8rem">A sales rep will confirm stock, the final price and delivery time on WhatsApp, usually within 30 minutes during working hours.</p>`, "sm");
    const dl = $("[data-dl]", card);
    if (dl) dl.onclick = () => downloadBlob(blob, filename);
  }
  function downloadBlob(blob, name) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 4000);
  }
  function waLink(text) { return `https://wa.me/${CFG.whatsappNumber}?text=${encodeURIComponent(text)}`; }

  // Pre-crop the logo for the PDF (fails silently on file:// where canvas is tainted)
  let logoData = null;
  (function prepLogo() {
    const img = new Image();
    img.onload = () => {
      try {
        const cv = document.createElement("canvas"); cv.width = img.naturalWidth; cv.height = img.naturalHeight;
        const cx = cv.getContext("2d"); cx.fillStyle = "#fff"; cx.fillRect(0, 0, cv.width, cv.height);
        cx.drawImage(img, 0, 0);
        logoData = { url: cv.toDataURL("image/jpeg", 0.92), ratio: cv.height / cv.width };
      } catch { logoData = null; }
    };
    img.src = "assets/logo.png";
  })();

  function buildPDF(order) {
    const { jsPDF } = window.jspdf || {};
    if (!jsPDF) throw new Error("jsPDF not loaded");
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const W = 210, M = 16;
    const navy = [15, 29, 56], red = [212, 42, 53], muted = [93, 102, 121], line = [228, 223, 213];
    const money = (n) => `KES ${Math.round(n).toLocaleString("en-KE")}`;

    // header band
    doc.setFillColor(...navy); doc.rect(0, 0, W, 40, "F");
    doc.setFillColor(...red); doc.rect(0, 40, W, 1.6, "F");
    if (logoData) { doc.setFillColor(255, 255, 255); doc.roundedRect(M, 8, 50, 50 * logoData.ratio + 2, 2, 2, "F"); doc.addImage(logoData.url, "JPEG", M + 1, 9, 48, 48 * logoData.ratio); }
    else { doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.text("SHADOW MABATI", M, 22); doc.setFontSize(9); doc.setFont("helvetica", "normal"); doc.text("Roofing Factory · Ruiru Bypass, Kamakis", M, 28); }
    doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(16);
    doc.text(order.title, W - M, 18, { align: "right" });
    doc.setFont("helvetica", "normal"); doc.setFontSize(9.5);
    doc.text(`No. ${order.no}`, W - M, 25, { align: "right" });
    doc.text(order.date.toLocaleString("en-KE", { dateStyle: "medium", timeStyle: "short" }), W - M, 30.5, { align: "right" });

    // parties
    let y = 54;
    const block = (x, title, rows) => {
      doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.setTextColor(...muted); doc.text(title.toUpperCase(), x, y);
      doc.setFont("helvetica", "normal"); doc.setFontSize(10); doc.setTextColor(...navy);
      rows.filter(Boolean).forEach((r, i) => doc.text(doc.splitTextToSize(String(r), 80)[0], x, y + 6 + i * 5.2));
    };
    const c = order.customer || {};
    block(M, order.title === "ORDER REQUEST" ? "Customer" : "Prepared for", [c.name || "Walk-in customer", c.phone, c.location, c.pay ? `Payment: ${c.pay}` : null]);
    block(W / 2 + 4, "Supplier", [CFG.businessName, CFG.address, CFG.phoneDisplay, CFG.email]);
    y += 34;
    if (order.deliveryLabel) { doc.setFontSize(9.5); doc.setTextColor(...muted); doc.text(`Delivery: ${order.deliveryLabel}`, M, y); y += 6; }
    if (order.summary) { doc.setFontSize(9.5); doc.setTextColor(...muted); doc.splitTextToSize(order.summary, W - 2 * M).forEach((l) => { doc.text(l, M, y); y += 4.8; }); y += 2; }

    // table
    const cols = [{ t: "#", x: M + 2, w: 8 }, { t: "Item", x: M + 10, w: 82 }, { t: "Quantity", x: M + 94, w: 34 }, { t: "Unit price", x: W - M - 32, a: "right" }, { t: "Amount", x: W - M - 2, a: "right" }];
    doc.setFillColor(...navy); doc.roundedRect(M, y, W - 2 * M, 9, 1.5, 1.5, "F");
    doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(8.5);
    cols.forEach((col) => doc.text(col.t, col.x, y + 6, { align: col.a || "left" }));
    y += 9;
    doc.setFont("helvetica", "normal");
    order.items.forEach((it, i) => {
      const p = byId(it.id);
      const nameLines = doc.splitTextToSize(p.name, 80);
      const spec = lineSpec(it);
      const specLines = spec ? doc.splitTextToSize(spec, 80) : [];
      const qtyLines = doc.splitTextToSize(lineQtyText(it), 34);
      const h = Math.max(nameLines.length * 4.6 + specLines.length * 4.2, qtyLines.length * 4.4) + 5;
      if (y + h > 262) { doc.addPage(); y = 20; }
      if (i % 2 === 0) { doc.setFillColor(247, 245, 240); doc.rect(M, y, W - 2 * M, h, "F"); }
      doc.setTextColor(...navy); doc.setFontSize(9.5);
      doc.text(String(i + 1), cols[0].x, y + 5.5);
      doc.setFont("helvetica", "bold"); doc.text(nameLines, cols[1].x, y + 5.5); doc.setFont("helvetica", "normal");
      if (specLines.length) { doc.setTextColor(...muted); doc.setFontSize(8.5); doc.text(specLines, cols[1].x, y + 5.5 + nameLines.length * 4.6); }
      doc.setTextColor(...navy); doc.setFontSize(9); doc.text(qtyLines, cols[2].x, y + 5.5);
      const up = isSheet(p) ? `${money(unitPrice(p, it.gauge, it.finish))}/m` : money(p.price);
      doc.text(up, cols[3].x, y + 5.5, { align: "right" });
      doc.setFont("helvetica", "bold"); doc.text(money(lineTotal(it)), cols[4].x, y + 5.5, { align: "right" }); doc.setFont("helvetica", "normal");
      y += h;
      doc.setDrawColor(...line); doc.line(M, y, W - M, y);
    });

    // totals
    y += 6;
    const tot = (label, val, bold) => {
      doc.setFont("helvetica", bold ? "bold" : "normal"); doc.setFontSize(bold ? 12 : 10); doc.setTextColor(...(bold ? navy : muted));
      doc.text(label, W - M - 78, y); doc.setTextColor(...navy); doc.text(val, W - M - 2, y, { align: "right" }); y += bold ? 8 : 6;
    };
    if (y > 240) { doc.addPage(); y = 24; }
    tot("Subtotal", money(order.subtotal));
    if (order.deliveryFee !== undefined) tot("Delivery", order.deliveryFee === null ? "To be confirmed" : order.deliveryFee === 0 ? "Free" : money(order.deliveryFee));
    doc.setDrawColor(...navy); doc.line(W - M - 80, y - 3, W - M, y - 3); y += 3;
    tot(order.title === "ORDER REQUEST" ? "Total (VAT incl.)" : "Estimated total", money(order.total), true);

    if (order.customer && order.customer.notes) {
      y += 2; doc.setFontSize(9); doc.setTextColor(...muted); doc.setFont("helvetica", "bold"); doc.text("Customer notes", M, y); y += 5;
      doc.setFont("helvetica", "normal"); doc.setTextColor(...navy); doc.splitTextToSize(order.customer.notes, W - 2 * M).forEach((l) => { doc.text(l, M, y); y += 4.6; });
    }

    // footer
    doc.setFillColor(247, 245, 240); doc.rect(0, 270, W, 27, "F");
    doc.setFontSize(8.2); doc.setTextColor(...muted);
    const terms = order.title === "ORDER REQUEST"
      ? "This is an order request. Prices are indicative and are confirmed by Shadow Mabati on WhatsApp before payment. Production of custom-cut sheets starts once a deposit is received."
      : "This is a planning estimate generated from the online roof calculator. Final quantities are confirmed from your plan or a site measurement. Prices are valid for 7 days.";
    doc.text(doc.splitTextToSize(terms, W - 2 * M), M, 277);
    doc.setTextColor(...navy); doc.setFont("helvetica", "bold");
    doc.text(`${CFG.businessName}  ·  ${CFG.phoneDisplay}  ·  ${CFG.email}`, M, 290);
    return doc.output("blob");
  }

  /* ---------- reveal on scroll ---------- */
  function initReveal() {
    const els = $$(".reveal:not(.in)");
    if (!("IntersectionObserver" in window)) { els.forEach((e) => e.classList.add("in")); return; }
    const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { rootMargin: "0px 0px -8% 0px" });
    els.forEach((e) => io.observe(e));
  }

  /* ---------- product card ---------- */
  /* Price-on-request product: details + WhatsApp enquiry instead of configure/add to cart */
  function openEnquiry(p) {
    const msg = `Hello Shadow Mabati, I'd like a price for ${p.name}. Please share the options and price${p.unit ? ` per ${p.unit}` : ""}.`;
    openModal(`<div class="pd">
      <div class="pd-media">${artFor(p)}</div>
      <div class="pd-body">
        <div><div class="pc-cat">${esc(p.category)}${p.use ? ` · ${esc(p.use)}` : ""}</div><h2>${esc(p.name)}</h2></div>
        <p class="lead" style="font-size:1rem">${esc(p.short)}</p>
        <div class="pd-price"><div><small>Price</small><b style="font-size:1.5rem">On request</b></div></div>
        <p style="color:var(--muted);font-size:.92rem">Prices depend on the colour, quantity and your site. Send us a message and we'll reply with a quote, usually within 30 minutes during working hours.</p>
        <div class="pd-btns" style="grid-template-columns:1fr">
          <a class="btn btn-wa" href="${waLink(msg)}" target="_blank" rel="noopener">${ICON.wa} Ask for a price on WhatsApp</a>
        </div>
      </div></div>`);
  }

  function productCard(p, { compare = false } = {}) {
    const fp = fromPrice(p);
    const colours = p.colours || [];
    return `<article class="product-card" data-id="${p.id}">
      <div class="pc-media" data-quick="${p.id}" role="button" tabindex="0" aria-label="View ${esc(p.name)}">${artFor(p)}
        ${p.badge ? `<span class="pc-badge ${p.badge === "Best seller" ? "red" : ""}">${esc(p.badge)}</span>` : ""}</div>
      ${compare ? `<label class="pc-compare"><input type="checkbox" data-compare="${p.id}"> Compare</label>` : ""}
      <div class="pc-body">
        <h3 class="pc-title">${esc(p.name)}</h3>
        <p class="pc-desc">${esc(p.short)}</p>
        <div class="pc-meta">
          <div class="pc-specs">${[
            p.gauges && p.gauges.length ? `<b>${p.gauges.map((g) => `G${g}`).join(" · ")}</b>` : "",
            isSheet(p) ? `${p.cover} m cover` : "",
            p.unit === "tile" ? `${p.perSqm} tiles / m²` : "",
          ].filter(Boolean).join(" &nbsp;·&nbsp; ") || esc(p.category)}</div>
          ${colours.length ? `<div class="dots">${colours.slice(0, 5).map((c) => `<i style="background:${colourHex(c)}" title="${esc(c)}"></i>`).join("")}${colours.length > 5 ? `<em>+${colours.length - 5}</em>` : ""}</div>` : ""}
        </div>
        <div class="pc-foot">
          ${p.quote
            ? `<div class="price"><small>Price</small><b>On request</b></div>
          <button class="btn btn-sm" data-quick="${p.id}">Ask price</button>`
            : `<div class="price"><small>${isSheet(p) ? "From" : "Price"}</small><b>${fmt(fp)} <span>${unitLabel(p)}</span></b></div>
          <button class="btn btn-sm" data-quick="${p.id}">${isSheet(p) ? "Configure" : "Add"}</button>`}
        </div>
      </div></article>`;
  }
  document.addEventListener("keydown", (e) => { if (e.key === "Enter" && e.target.matches(".pc-media[data-quick]")) openProduct(e.target.dataset.quick); });

  window.SM = {
    $, $$, esc, fmt, ICON, byId, colourHex, isSheet, unitPrice, fromPrice, unitLabel, perSqm, artFor, lineTotal, lineSpec, lineQtyText,
    addToCart, openProduct, openDrawer, openModal, closeModal, toast, waLink, productCard, sendWithPDF, orderNo, store,
    onCart: (f) => listeners.push(f), getCart: () => cart, reveal: () => initReveal(),
  };

  renderChrome();
})();
