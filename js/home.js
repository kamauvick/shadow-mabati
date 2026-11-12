(function () {
  const S = window.SM, A = window.SMArt, CFG = window.SM_CONFIG;
  const { $, $$, esc, fmt, ICON } = S;

  /* ---------- Hero: stack of sheets (bottom → top) ---------- */
  const heroArt = $("#hero-art");
  if (heroArt) heroArt.innerHTML = A.heroStackArt([
    { hex: S.colourHex("Aluzinc Silver"), type: "corrugated", du: 6, dv: 4 },
    { hex: S.colourHex("Forest Green"), type: "box", du: -14, dv: -3 },
    { hex: S.colourHex("Charcoal"), type: "corrugated", du: 18, dv: 5 },
    { hex: S.colourHex("Royal Blue"), type: "box", du: -6, dv: -2 },
    { hex: S.colourHex("Tile Red"), type: "box", du: 22, dv: 3 },
    { hex: S.colourHex("Maroon"), type: "box", du: 0, dv: 0 },
  ]);

  /* ---------- Roof visualiser section ---------- */
  const visProfiles = ["box-profile", "versatile-tile", "euro-tile", "corrugated", "stone-coated"];
  const vis = { pid: "versatile-tile", colour: "Maroon" };
  function renderVis() {
    const p = S.byId(vis.pid);
    if (!p.colours.includes(vis.colour)) vis.colour = p.colours[0];
    $("#vis-stage").innerHTML = A.houseArt(p.profile, S.colourHex(vis.colour));
    // each profile thumbnail is drawn in the chosen colour where that profile offers it
    $("#vis-profile").innerHTML = visProfiles.map((id) => {
      const q = S.byId(id);
      const col = q.colours.includes(vis.colour) ? vis.colour : q.colours[0];
      return `<button type="button" class="vis-profile" data-pid="${id}" aria-pressed="${id === vis.pid}">
        <span class="vp-thumb">${S.artFor(q, col, { photo: false })}</span>
        <span class="vp-text"><b>${esc(q.name)}</b><small>from ${fmt(S.fromPrice(q))}${S.isSheet(q) ? "/m" : "/tile"}</small></span>
      </button>`;
    }).join("");
    $("#vis-colours").innerHTML = p.colours.map((c) => `<button type="button" class="swatch" data-c="${esc(c)}" title="${esc(c)}" aria-label="${esc(c)}" aria-pressed="${c === vis.colour}" style="background:${S.colourHex(c)}"></button>`).join("");
    $("#vis-colour-name").textContent = `· ${vis.colour}`;
    $("#vis-tag i").style.background = S.colourHex(vis.colour);
    $("#vis-tag span").textContent = `${p.name} · ${vis.colour}`;
    $("#vis-price").textContent = `${fmt(S.fromPrice(p))}${S.isSheet(p) ? " / metre" : " / tile"}`;
    $("#vis-cover").textContent = S.isSheet(p) ? `${p.cover} m cover · ${p.gauges.map((g) => `G${g}`).join(", ")}` : `${p.perSqm} tiles per m²`;
  }
  $("#visualiser").addEventListener("click", (e) => {
    const b = e.target.closest("[data-pid]"); if (b) { vis.pid = b.dataset.pid; renderVis(); }
    const c = e.target.closest("#vis-colours [data-c]"); if (c) { vis.colour = c.dataset.c; renderVis(); }
    if (e.target.closest(".vis-frame, #vis-config")) S.openProduct(vis.pid, { colour: vis.colour });
    if (e.target.closest("#vis-calc")) {
      // carry the chosen sheet and colour into the calculator
      st.pid = vis.pid; st.colour = vis.colour; $("#cprod").value = vis.pid;
      renderOptions(); compute();
      $("#calculator").scrollIntoView({ behavior: "smooth" });
    }
  });
  renderVis();

  /* ---------- Featured ---------- */
  $("#featured").innerHTML = window.SM_PRODUCTS.filter((p) => p.featured).slice(0, 4).map((p) => S.productCard(p)).join("");
  $$("#featured .product-card").forEach((c, i) => { c.classList.add("reveal"); c.style.transitionDelay = `${i * 70}ms`; });

  /* ---------- Calculator ---------- */
  const roofSheets = window.SM_PRODUCTS.filter((p) => p.category === "Roofing Sheets");
  const st = { roof: "gable", pid: "box-profile", gauge: 28, finish: "Gloss", colour: "Maroon" };
  $("#roof-types").innerHTML = [["gable", "Gable"], ["hip", "Hip"], ["leanto", "Lean-to"]].map(([k, l]) => `<button type="button" class="roof-type" data-roof="${k}" aria-pressed="${k === st.roof}">${A.roofIcons[k]}${l}</button>`).join("");
  $("#cprod").innerHTML = roofSheets.map((p) => `<option value="${p.id}">${esc(p.name)}: from ${fmt(S.fromPrice(p))} ${S.unitLabel(p)}</option>`).join("");
  $("#cprod").value = st.pid;

  function renderOptions() {
    const p = S.byId(st.pid);
    if (p.gauges.length && !p.gauges.includes(st.gauge)) st.gauge = p.gauges.includes(28) ? 28 : p.gauges[0];
    if (!p.gauges.length) st.gauge = null;
    if (!p.finishes.includes(st.finish)) st.finish = p.finishes[0];
    if (!p.colours.includes(st.colour)) st.colour = p.colours[0];
    $("#cgauge").innerHTML = p.gauges.length ? p.gauges.map((g) => `<button type="button" data-g="${g}" aria-pressed="${g === st.gauge}">G${g}</button>`).join("") : `<button type="button" aria-pressed="true">Standard</button>`;
    $("#cfinish").innerHTML = p.finishes.map((f) => `<button type="button" data-f="${f}" aria-pressed="${f === st.finish}">${f}</button>`).join("");
    $("#ccolour").innerHTML = p.colours.map((c) => `<button type="button" class="swatch" data-c="${esc(c)}" title="${esc(c)}" aria-label="${esc(c)}" aria-pressed="${c === st.colour}" style="background:${S.colourHex(c)}"></button>`).join("");
    $("#ccolour-name").textContent = `· ${st.colour}`;
  }

  const num = (id, min, max, d) => { const v = parseFloat($(id).value); return isNaN(v) ? d : Math.min(max, Math.max(min, v)); };
  let estimate = null;

  function compute() {
    const L = num("#cl", 3, 80, 12), W = num("#cw", 3, 40, 9), pitchDeg = num("#cp", 5, 45, 25), o = num("#co", 0, 1.5, 0.6);
    const f = $("#calc-form");
    const inc = { ridges: f.ridges.checked, gutters: f.gutters.checked, nails: f.nails.checked };
    const p = S.byId(st.pid);
    const rad = (pitchDeg * Math.PI) / 180, cos = Math.cos(rad);
    const Lp = L + 2 * o, Wp = W + 2 * o;
    const r1 = (x) => Math.ceil(x * 10) / 10;
    let area, sheetLen = null, sheets = null, metres = null, capLen, gutterLen, capName = "Ridge Cap (2.0 m)", capId = "ridge-cap";

    if (st.roof === "gable") {
      const s = Wp / 2 / cos;
      area = 2 * Lp * s; sheetLen = r1(s); capLen = Lp; gutterLen = 2 * Lp;
      if (S.isSheet(p)) { sheets = 2 * Math.ceil(Lp / p.cover); metres = sheets * sheetLen; }
    } else if (st.roof === "hip") {
      const s = Wp / 2 / cos;
      area = (Lp * Wp) / cos;
      const hip = Math.sqrt(s * s + (Wp / 2) ** 2);
      capLen = Math.max(Lp - Wp, 0) + 4 * hip; gutterLen = 2 * (Lp + Wp);
      if (S.isSheet(p)) { metres = r1((area / p.cover) * 1.08); }
    } else {
      const s = Wp / cos;
      area = Lp * s; sheetLen = r1(s); capLen = Lp; gutterLen = Lp; capName = "Wall Flashing (2.0 m)"; capId = "wall-flash";
      if (S.isSheet(p)) { sheets = Math.ceil(Lp / p.cover); metres = sheets * sheetLen; }
    }

    const items = [];
    const base = { colour: st.colour, gauge: st.gauge, finish: S.isSheet(p) ? st.finish : null };
    if (S.isSheet(p)) {
      if (sheets) items.push({ id: p.id, ...base, length: sheetLen, qty: sheets });
      else items.push({ id: p.id, ...base, length: metres, qty: 1, note: "assorted hip cuts" });
    } else {
      items.push({ id: p.id, colour: st.colour, gauge: null, finish: null, length: null, qty: Math.ceil(area * p.perSqm * 1.05) });
    }
    const capCol = (c) => (S.byId(c).colours.includes(st.colour) ? st.colour : S.byId(c).colours[0]);
    if (inc.ridges) items.push({ id: capId, colour: capCol(capId), qty: Math.ceil(capLen / 1.8) });
    if (inc.gutters) {
      const dp = Math.max(2, Math.ceil(gutterLen / 10));
      const gc = capCol("gutter");
      items.push({ id: "gutter", colour: gc, qty: Math.ceil(gutterLen / 3.9) });
      items.push({ id: "downpipe", colour: gc, qty: dp });
      items.push({ id: "gutter-fittings", colour: S.byId("gutter-fittings").colours.includes(gc) ? gc : "Charcoal", qty: dp });
    }
    if (inc.nails && p.unit === "m") {
      items.push({ id: "nails", qty: Math.max(1, Math.ceil(area / 10)) });
      items.push({ id: "washers", qty: Math.max(1, Math.ceil((area * 8) / 100)) });
    } else if (inc.nails) items.push({ id: "screws", qty: Math.max(1, Math.ceil((area * 9) / 100)) });

    const total = items.reduce((s, i) => s + S.lineTotal(i), 0);
    estimate = { L, W, pitchDeg, o, area, sheetLen, sheets, metres, items, total, p, roof: st.roof };
    renderResult();
  }

  function diagram(e) {
    const c = S.colourHex(st.colour);
    const base = 250, x0 = 35, x1 = 285, wallTop = 110, wallBot = 145;
    const span = x1 - x0;
    const rise = Math.min(80, Math.tan((e.pitchDeg * Math.PI) / 180) * (e.roof === "leanto" ? span : span / 2) * 0.55);
    const ink = "#5d6679", trim = A.shade(c, -0.35);
    let roof, labels;
    if (e.roof === "gable") {
      roof = `<polygon points="${x0 - 14},${wallTop + 4} ${(x0 + x1) / 2},${wallTop - rise} ${x1 + 14},${wallTop + 4}" fill="${c}"/>`;
      labels = `<text x="${(x0 + x1) / 2}" y="${wallTop - rise - 8}" fill="${ink}" font-size="11" font-weight="600" text-anchor="middle">${e.sheetLen} m sheets</text>`;
    } else if (e.roof === "hip") {
      roof = `<polygon points="${x0 - 14},${wallTop + 4} ${x0 + 70},${wallTop - rise} ${x1 - 70},${wallTop - rise} ${x1 + 14},${wallTop + 4}" fill="${c}"/>`;
      labels = `<text x="${(x0 + x1) / 2}" y="${wallTop - rise - 8}" fill="${ink}" font-size="11" font-weight="600" text-anchor="middle">hip &amp; ridge caps</text>`;
    } else {
      roof = `<polygon points="${x0 - 14},${wallTop - rise} ${x1 + 14},${wallTop + 4} ${x1 + 14},${wallTop + 10} ${x0 - 14},${wallTop - rise + 6}" fill="${c}"/>`;
      labels = `<text x="${(x0 + x1) / 2}" y="${wallTop - rise - 2}" fill="${ink}" font-size="11" font-weight="600" text-anchor="middle">${e.sheetLen} m sheets</text>`;
    }
    const vy = Math.max(0, Math.floor(wallTop - rise - 26)); // crop empty sky above the roof
    return `<svg viewBox="0 ${vy} 320 ${170 - vy}" xmlns="http://www.w3.org/2000/svg" font-family="Inter, sans-serif" role="img" aria-label="Roof diagram">
      <line x1="10" y1="${wallBot}" x2="310" y2="${wallBot}" stroke="#d6d0c4" stroke-width="1.5"/>
      <rect x="${x0}" y="${wallTop}" width="${span}" height="${wallBot - wallTop}" fill="#f4efe6" stroke="#d6d0c4"/>
      <rect x="${x0 + 30}" y="${wallTop + 10}" width="22" height="18" rx="2" fill="#bccbe8"/><rect x="${x1 - 52}" y="${wallTop + 10}" width="22" height="18" rx="2" fill="#bccbe8"/>
      <rect x="${(x0 + x1) / 2 - 9}" y="${wallTop + 12}" width="18" height="${wallBot - wallTop - 12}" rx="1.5" fill="#a6826a"/>
      ${roof}
      <rect x="${x0 - 14}" y="${wallTop + 2}" width="${span + 28}" height="4" fill="${trim}"/>
      <line x1="${x0}" y1="158" x2="${x1}" y2="158" stroke="#8b93a3" stroke-width="1"/><line x1="${x0}" y1="153" x2="${x0}" y2="163" stroke="#8b93a3"/><line x1="${x1}" y1="153" x2="${x1}" y2="163" stroke="#8b93a3"/>
      <rect x="${(x0 + x1) / 2 - 34}" y="151" width="68" height="14" rx="7" fill="#0f1d38"/>
      <text x="${(x0 + x1) / 2}" y="161.5" fill="#fff" font-size="10.5" font-weight="700" text-anchor="middle">${e.W} m wide</text>
      <text x="${x1 + 4}" y="${wallTop + 26}" fill="#d42a35" font-size="11" font-weight="700">${e.pitchDeg}°</text>
      ${labels}
    </svg>`;
  }

  function renderResult() {
    const e = estimate, p = e.p;
    $("#calc-diagram").innerHTML = diagram(e);
    const k3 = S.isSheet(p) ? (e.sheets ? ["Sheets", `${e.sheets} × ${e.sheetLen}m`] : ["Sheet metres", `${e.metres} m`]) : ["Tiles", e.items[0].qty];
    $("#calc-kpis").innerHTML = [["Roof area", `${e.area.toFixed(0)} m²`], ["KES per m²", fmt(e.total / e.area).replace("KES ", "")], k3]
      .map(([s, b]) => `<div class="kpi"><small>${s}</small><b>${b}</b></div>`).join("");
    $("#calc-lines").innerHTML = e.items.map((it) => {
      const ip = S.byId(it.id);
      return `<div class="line"><span>${esc(ip.name)}<small>${esc([S.lineSpec(it), S.lineQtyText(it)].filter(Boolean).join(" · "))}</small></span><b>${fmt(S.lineTotal(it))}</b></div>`;
    }).join("");
    $("#calc-total").textContent = fmt(e.total);
  }

  $("#calc-cart").innerHTML = `${ICON.cart} Add full estimate to cart`;
  $("#calc-wa").innerHTML = `${ICON.wa} Get PDF quote on WhatsApp`;
  $("#calc-cart").addEventListener("click", () => {
    estimate.items.forEach((i) => S.addToCart(i, { silent: true }));
    S.toast(`${estimate.items.length} items added to your cart`, "View cart", S.openDrawer);
  });
  $("#calc-wa").addEventListener("click", () => {
    const e = estimate;
    const roofName = { gable: "Gable", hip: "Hip", leanto: "Lean-to" }[e.roof];
    const summary = `${roofName} roof · house ${e.L} × ${e.W} m · pitch ${e.pitchDeg}° · overhang ${e.o} m · roof area ≈ ${e.area.toFixed(1)} m²`;
    const order = { no: S.orderNo("SMQ"), title: "ROOFING ESTIMATE", date: new Date(), summary, items: e.items, subtotal: e.total, total: e.total };
    const msg = [`Hello Shadow Mabati, I used your roof calculator and would like a quote.`, ``, `*Estimate:* ${order.no}`, `*Roof:* ${summary}`, ``,
      ...e.items.map((it, i) => `${i + 1}. ${S.byId(it.id).name}${S.lineSpec(it) ? ` (${S.lineSpec(it)})` : ""}: ${S.lineQtyText(it)} = ${fmt(S.lineTotal(it))}`),
      ``, `*Estimated total: ${fmt(e.total)}*`, ``, `Please confirm availability and delivery. (Estimate PDF attached)`].join("\n");
    S.sendWithPDF(order, msg);
  });

  const form = $("#calc-form");
  form.addEventListener("input", (e) => { if (e.target.id === "cp") $("#cp-out").textContent = `${e.target.value}°`; compute(); });
  form.addEventListener("change", (e) => { if (e.target.id === "cprod") { st.pid = e.target.value; renderOptions(); } compute(); });
  form.addEventListener("click", (e) => {
    const r = e.target.closest("[data-roof]"); if (r) { st.roof = r.dataset.roof; $$("[data-roof]").forEach((b) => b.setAttribute("aria-pressed", b === r)); }
    const g = e.target.closest("[data-g]"); if (g) st.gauge = Number(g.dataset.g);
    const f = e.target.closest("[data-f]"); if (f) st.finish = f.dataset.f;
    const c = e.target.closest("#ccolour [data-c]"); if (c) st.colour = c.dataset.c;
    if (r || g || f || c) { renderOptions(); compute(); }
  });
  form.addEventListener("submit", (e) => e.preventDefault());
  renderOptions(); compute();

  /* ---------- Steps ---------- */
  $("#steps").innerHTML = [
    [ICON.calc, "Measure or calculate", "Use the calculator, send your house plan, or book a free site measurement."],
    [ICON.wa, "Confirm on WhatsApp", "We check your cutting list and confirm the price, colour and delivery date."],
    [ICON.factory, "We roll-form", "Your sheets are cut to length on our Kamakis line, usually within 24 hours."],
    [ICON.truck, "Delivered to site", "Bundled, counted and offloaded at your site. Pay by M-PESA or bank transfer."],
  ].map(([i, h, p]) => `<div class="step reveal"><span class="t-icon">${i}</span><h3>${h}</h3><p>${p}</p></div>`).join("");

  /* ---------- Testimonials ---------- */
  const stars = Array(5).fill(ICON.star).join("");
  $("#avg-stars").innerHTML = stars;
  const avCols = ["#1d4aa6", "#d42a35", "#2e5741", "#5a3e2e", "#33383f"];
  $("#t-track").innerHTML = window.SM_TESTIMONIALS.map((t, i) => `<figure class="t-card" style="margin:0">
      <div class="stars">${stars}</div><blockquote>“${esc(t.text)}”</blockquote>
      <figcaption class="t-who"><span class="avatar" style="background:${avCols[i % avCols.length]}">${esc(t.name.split(" ").map((w) => w[0]).join("").slice(0, 2))}</span>
      <div><b>${esc(t.name)}</b><span>${esc(t.place)} · ${esc(t.product)}</span></div></figcaption></figure>`).join("");
  const track = $("#t-track");
  $("#t-prev").innerHTML = `<span style="transform:rotate(180deg);display:grid">${ICON.arrow}</span>`;
  $("#t-next").innerHTML = ICON.arrow;
  const step = () => ($(".t-card", track).offsetWidth + 24);
  $("#t-prev").onclick = () => track.scrollBy({ left: -step(), behavior: "smooth" });
  $("#t-next").onclick = () => track.scrollBy({ left: step(), behavior: "smooth" });

  /* ---------- About ---------- */
  $("#about-visual").insertAdjacentHTML("afterbegin", A.factoryArt());
  $("#about-icon").innerHTML = ICON.factory;
  $("#values").innerHTML = [
    ["Honest measurements", "We'll tell you when G30 is enough. We don't upsell."],
    ["Built for Kenyan weather", "Our coatings are chosen for strong equatorial sun and heavy long rains."],
    ["Local and accountable", "If anything goes wrong, you know exactly where to find us."],
  ].map(([b, s]) => `<div class="value">${ICON.check}<div><b>${b}</b><br><span style="color:var(--muted);font-size:.92rem">${s}</span></div></div>`).join("");

  /* ---------- FAQ ---------- */
  $("#faq-list").innerHTML = window.SM_FAQ.map((f, i) => `<details class="faq-item"${i === 0 ? " open" : ""}><summary>${esc(f.q)}<i aria-hidden="true"></i></summary><p>${esc(f.a)}</p></details>`).join("");
  $("#faq-wa").href = S.waLink("Hello Shadow Mabati, I have a question about roofing sheets.");
  $("#faq-wa").insertAdjacentHTML("afterbegin", ICON.wa);

  /* ---------- Contact ---------- */
  const tel = CFG.phoneDisplay.replace(/\s/g, "");
  $("#contact-info").innerHTML = `
    <a class="c-item" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CFG.mapQuery)}" target="_blank" rel="noopener"><span class="t-icon">${ICON.pin}</span><div><small>Factory & showroom</small><b>${esc(CFG.address)}</b></div></a>
    <a class="c-item" href="tel:${tel}"><span class="t-icon">${ICON.phone}</span><div><small>Call sales</small><b>${esc(CFG.phoneDisplay)}</b></div></a>
    <a class="c-item" href="${S.waLink("Hello Shadow Mabati!")}" target="_blank" rel="noopener"><span class="t-icon" style="background:#1fa855">${ICON.wa}</span><div><small>WhatsApp</small><b>Chat with a roofing advisor</b></div></a>
    <a class="c-item" href="mailto:${CFG.email}"><span class="t-icon">${ICON.mail}</span><div><small>Email</small><b>${esc(CFG.email)}</b></div></a>
    <div class="c-item"><span class="t-icon">${ICON.clock}</span><div><small>Opening hours</small><b>${esc(CFG.hours)}</b></div></div>
    <div class="map"><iframe title="Map to Shadow Mabati Factory" loading="lazy" referrerpolicy="no-referrer-when-downgrade" src="https://www.google.com/maps?q=${encodeURIComponent(CFG.mapQuery)}&output=embed"></iframe></div>`;

  const needs = ["Roofing sheets", "Stone-coated tiles", "Gutters", "Ridges & flashing", "Site measurement"];
  const chosen = new Set(["Roofing sheets"]);
  $("#q-needs").innerHTML = needs.map((n) => `<button type="button" class="chip" aria-pressed="${chosen.has(n)}">${n}</button>`).join("");
  $("#q-needs").addEventListener("click", (e) => {
    const c = e.target.closest(".chip"); if (!c) return;
    chosen.has(c.textContent) ? chosen.delete(c.textContent) : chosen.add(c.textContent);
    c.setAttribute("aria-pressed", chosen.has(c.textContent));
  });
  $("#q-submit").insertAdjacentHTML("afterbegin", ICON.wa);
  $("#quote-form").addEventListener("submit", (e) => {
    e.preventDefault();
    const name = $("#q-name").value.trim(), phone = $("#q-phone").value.trim();
    $("#q-name").style.borderColor = name ? "" : "var(--red)";
    const okPhone = /^(\+?254|0)?[17]\d{8}$/.test(phone.replace(/[\s-]/g, ""));
    $("#q-phone").style.borderColor = okPhone ? "" : "var(--red)";
    if (!name || !okPhone) { S.toast(!okPhone && name ? "Please enter a valid Kenyan phone number" : "Please add your name and phone number"); return; }
    const msg = [`Hello Shadow Mabati, I'd like a quote.`, ``, `*Name:* ${name}`, `*Phone:* ${phone}`, `*Site:* ${$("#q-loc").value.trim() || "-"}`,
      `*Needs:* ${[...chosen].join(", ") || "-"}`, `*Timeline:* ${$("#q-when").value}`, ``, $("#q-msg").value.trim()].join("\n");
    window.open(S.waLink(msg), "_blank", "noopener");
    S.toast("Opening WhatsApp. Attach your plan in the chat.");
  });

  S.reveal();
})();
