(function () {
  const S = window.SM, CFG = window.SM_CONFIG, P = window.SM_PRODUCTS;
  const { $, $$, esc, fmt, ICON } = S;

  const PROFILE_GROUPS = { box: "Box profile", tile: "Tile", euro: "Tile", roman: "Tile", corrugated: "Corrugated", stone: "Stone-coated" };
  const cats = ["All", ...new Set(P.map((p) => p.category))];
  const params = new URLSearchParams(location.search);
  const f = {
    cat: cats.includes(params.get("cat")) ? params.get("cat") : "All",
    q: "", profiles: new Set(), gauges: new Set(), colours: new Set(), min: null, max: null, sort: "featured",
  };
  const compare = new Set();

  /* ---------- static filter UI ---------- */
  $("#cat-tabs").innerHTML = cats.map((c) => `<button class="cat-tab" type="button" data-cat="${esc(c)}">${esc(c)}<em>${c === "All" ? P.length : P.filter((p) => p.category === c).length}</em></button>`).join("");
  $("#f-profile").innerHTML = [...new Set(Object.values(PROFILE_GROUPS))].map((g) => `<label class="check"><input type="checkbox" value="${g}"> ${g}</label>`).join("");
  $("#f-gauge").innerHTML = [32, 30, 28, 26].map((g) => `<button type="button" class="chip" data-gauge="${g}" aria-pressed="false">G${g}</button>`).join("");
  $("#f-colour").innerHTML = window.SM_COLOURS.map((c) => `<button type="button" class="swatch" data-colour="${esc(c.name)}" title="${esc(c.name)}" aria-label="${esc(c.name)}" aria-pressed="false" style="background:${c.hex}"></button>`).join("");
  $("#filters-close").innerHTML = ICON.close;
  $("#filters-open").insertAdjacentHTML("afterbegin", ICON.filter);
  $("#help-icon").innerHTML = ICON.info;
  $("#help-wa").href = S.waLink("Hello Shadow Mabati, I need help choosing roofing sheets.");

  /* ---------- filtering ---------- */
  function matches(p) {
    if (f.cat !== "All" && p.category !== f.cat) return false;
    if (f.q) {
      const hay = `${p.name} ${p.category} ${p.short} ${p.use || ""} ${(p.colours || []).join(" ")}`.toLowerCase();
      if (!f.q.toLowerCase().split(/\s+/).every((w) => hay.includes(w))) return false;
    }
    if (f.profiles.size && !f.profiles.has(PROFILE_GROUPS[p.profile])) return false;
    if (f.gauges.size && !(p.gauges || []).some((g) => f.gauges.has(g))) return false;
    if (f.colours.size && !(p.colours || []).some((c) => f.colours.has(c))) return false;
    const fp = S.fromPrice(p);
    if (f.min !== null && fp < f.min) return false;
    if (f.max !== null && fp > f.max) return false;
    return true;
  }
  const valueScore = (p) => S.perSqm(p, p.gauges && p.gauges[0], p.finishes && p.finishes[0]) ?? Infinity;
  function sorted(list) {
    const l = [...list];
    if (f.sort === "price-asc") l.sort((a, b) => S.fromPrice(a) - S.fromPrice(b));
    if (f.sort === "price-desc") l.sort((a, b) => S.fromPrice(b) - S.fromPrice(a));
    if (f.sort === "name") l.sort((a, b) => a.name.localeCompare(b.name));
    if (f.sort === "value") l.sort((a, b) => valueScore(a) - valueScore(b));
    if (f.sort === "featured") l.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    return l;
  }

  function render() {
    $$(".cat-tab").forEach((t) => t.setAttribute("aria-pressed", t.dataset.cat === f.cat));
    const sheetsVisible = f.cat === "All" || f.cat === "Roofing Sheets";
    $("#fg-profile").style.display = sheetsVisible ? "" : "none";
    $("#fg-gauge").style.display = sheetsVisible ? "" : "none";

    const list = sorted(P.filter(matches));
    $("#count").innerHTML = `Showing <b>${list.length}</b> of ${P.length} products`;
    $("#grid").innerHTML = list.length
      ? list.map((p) => S.productCard(p, { compare: S.isSheet(p) || p.unit === "tile" })).join("")
      : `<div class="empty" style="grid-column:1/-1">${ICON.filter}<b style="color:var(--ink)">No products match these filters</b><button class="btn btn-ghost btn-sm" data-reset>Reset filters</button></div>`;
    $$("[data-compare]").forEach((c) => (c.checked = compare.has(c.dataset.compare)));

    const chips = [];
    if (f.q) chips.push([`“${f.q}”`, () => { f.q = ""; $("#search").value = ""; }]);
    f.profiles.forEach((v) => chips.push([v, () => { f.profiles.delete(v); syncInputs(); }]));
    f.gauges.forEach((v) => chips.push([`G${v}`, () => { f.gauges.delete(v); syncInputs(); }]));
    f.colours.forEach((v) => chips.push([v, () => { f.colours.delete(v); syncInputs(); }]));
    if (f.min !== null || f.max !== null) chips.push([`${f.min ?? 0} – ${f.max ?? "∞"} KES`, () => { f.min = f.max = null; $("#f-min").value = $("#f-max").value = ""; }]);
    $("#active-filters").innerHTML = chips.map(([l], i) => `<button type="button" data-chip="${i}">${esc(l)} ✕</button>`).join("");
    $$("#active-filters [data-chip]").forEach((b) => (b.onclick = () => { chips[b.dataset.chip][1](); render(); }));

    const url = new URL(location.href);
    f.cat === "All" ? url.searchParams.delete("cat") : url.searchParams.set("cat", f.cat);
    history.replaceState(null, "", url);
  }
  function syncInputs() {
    $$("#f-profile input").forEach((i) => (i.checked = f.profiles.has(i.value)));
    $$("#f-gauge [data-gauge]").forEach((b) => b.setAttribute("aria-pressed", f.gauges.has(Number(b.dataset.gauge))));
    $$("#f-colour [data-colour]").forEach((b) => b.setAttribute("aria-pressed", f.colours.has(b.dataset.colour)));
  }
  function reset() {
    f.q = ""; f.profiles.clear(); f.gauges.clear(); f.colours.clear(); f.min = f.max = null;
    $("#search").value = $("#f-min").value = $("#f-max").value = "";
    syncInputs(); render();
  }

  /* ---------- events ---------- */
  $("#cat-tabs").addEventListener("click", (e) => { const t = e.target.closest("[data-cat]"); if (t) { f.cat = t.dataset.cat; render(); } });
  let qT; $("#search").addEventListener("input", (e) => { clearTimeout(qT); qT = setTimeout(() => { f.q = e.target.value.trim(); render(); }, 150); });
  $("#sort").addEventListener("change", (e) => { f.sort = e.target.value; render(); });
  $("#f-profile").addEventListener("change", (e) => { e.target.checked ? f.profiles.add(e.target.value) : f.profiles.delete(e.target.value); render(); });
  $("#f-gauge").addEventListener("click", (e) => { const b = e.target.closest("[data-gauge]"); if (!b) return; const g = Number(b.dataset.gauge); f.gauges.has(g) ? f.gauges.delete(g) : f.gauges.add(g); syncInputs(); render(); });
  $("#f-colour").addEventListener("click", (e) => { const b = e.target.closest("[data-colour]"); if (!b) return; const c = b.dataset.colour; f.colours.has(c) ? f.colours.delete(c) : f.colours.add(c); syncInputs(); render(); });
  const priceIn = () => { const mn = parseFloat($("#f-min").value), mx = parseFloat($("#f-max").value); f.min = isNaN(mn) ? null : mn; f.max = isNaN(mx) ? null : mx; render(); };
  $("#f-min").addEventListener("change", priceIn); $("#f-max").addEventListener("change", priceIn);
  $("#f-reset").addEventListener("click", reset);
  document.addEventListener("click", (e) => { if (e.target.closest("[data-reset]")) reset(); });

  const filters = $("#filters"), scrim = $("[data-scrim]");
  $("#filters-open").addEventListener("click", () => { filters.classList.add("open"); scrim.classList.add("open"); });
  const closeFilters = () => { filters.classList.remove("open"); if (!$(".drawer.open") && !$("#modal.open")) scrim.classList.remove("open"); };
  $("#filters-close").addEventListener("click", closeFilters);
  window.addEventListener("sm:scrim", closeFilters);

  /* ---------- compare ---------- */
  $("#grid").addEventListener("change", (e) => {
    const c = e.target.closest("[data-compare]"); if (!c) return;
    if (c.checked && compare.size >= 3) { c.checked = false; S.toast("You can compare up to 3 products"); return; }
    c.checked ? compare.add(c.dataset.compare) : compare.delete(c.dataset.compare);
    renderTray();
  });
  function renderTray() {
    $("#compare-tray").classList.toggle("show", compare.size > 0);
    $("#ct-items").innerHTML = [...compare].map((id) => `<i>${S.artFor(S.byId(id))}</i>`).join("");
    $("#ct-text").textContent = compare.size < 2 ? "Select one more to compare" : `${compare.size} products selected`;
    $("#ct-go").disabled = compare.size < 2;
  }
  $("#ct-clear").addEventListener("click", () => { compare.clear(); $$("[data-compare]").forEach((c) => (c.checked = false)); renderTray(); });
  $("#ct-go").addEventListener("click", openCompare);

  function openCompare() {
    const ps = [...compare].map(S.byId);
    const allG = [...new Set(ps.flatMap((p) => p.gauges || []))].sort((a, b) => b - a);
    const row = (label, vals, bestLow) => {
      const nums = vals.map((v) => (typeof v === "number" ? v : null)).filter((v) => v !== null);
      const best = bestLow && nums.length > 1 ? Math.min(...nums) : null;
      return `<tr><th scope="row">${label}</th>${vals.map((v) => `<td class="${best !== null && v === best ? "best" : ""}">${typeof v === "number" ? fmt(v) : v ?? "—"}</td>`).join("")}</tr>`;
    };
    const rows = [
      ...allG.map((g) => row(`G${g} · per m`, ps.map((p) => (S.isSheet(p) && p.gauges.includes(g) ? S.unitPrice(p, g, p.finishes[0]) : null)), true)),
      ...allG.map((g) => row(`G${g} · per m² covered`, ps.map((p) => (S.isSheet(p) && p.gauges.includes(g) ? Math.round(S.perSqm(p, g, p.finishes[0])) : null)), true)),
      ps.some((p) => p.unit === "tile") ? row("Per tile", ps.map((p) => (p.unit === "tile" ? p.price : null)), false) : "",
      ps.some((p) => p.unit === "tile") ? row("Per m² covered", ps.map((p) => (p.unit === "tile" ? Math.round(p.price * p.perSqm) : null)), true) : "",
      row("Cover width", ps.map((p) => (S.isSheet(p) ? `${p.cover} m` : p.unit === "tile" ? `${p.perSqm} tiles / m²` : null))),
      row("Finishes", ps.map((p) => (p.finishes || []).join(", "))),
      row("Colours", ps.map((p) => `<div class="dots">${(p.colours || []).map((c) => `<i style="background:${S.colourHex(c)}" title="${esc(c)}"></i>`).join("")}</div>`)),
      row("Warranty", ps.map((p) => p.warranty)),
      row("Best for", ps.map((p) => p.use)),
    ].join("");
    S.openModal(`<div class="compare-wrap"><h2 style="font-size:1.8rem;margin-bottom:6px">Compare products</h2>
      <p style="color:var(--muted);margin-bottom:20px">Gloss-finish prices in KES, VAT inclusive. Use <b>per m² covered</b> for a like-for-like comparison.</p>
      <div class="table-scroll"><table class="compare-table"><thead><tr><th></th>${ps.map((p) => `<th><div class="ct-head"><div class="thumb">${S.artFor(p)}</div><b>${esc(p.name)}</b><button class="btn btn-red btn-sm" data-quick="${p.id}">Configure</button></div></th>`).join("")}</tr></thead>
      <tbody>${rows}</tbody></table></div></div>`);
  }

  /* ---------- price list ---------- */
  let plFinish = "Gloss";
  function renderPriceList() {
    $("#pl-finish").innerHTML = ["Gloss", "Matte"].map((x) => `<button type="button" data-plf="${x}" aria-pressed="${x === plFinish}">${x} finish</button>`).join("");
    const sheets = P.filter(S.isSheet).filter((p) => p.finishes.includes(plFinish));
    const gauges = [32, 30, 28, 26].filter((g) => sheets.some((p) => p.gauges.includes(g)));
    const cell = (p, g) => (p.gauges.includes(g) ? `<b>${fmt(S.unitPrice(p, g, plFinish))}</b><br><span style="color:var(--muted);font-size:.8rem">${fmt(S.perSqm(p, g, plFinish))} / m²</span>` : `<span style="color:var(--muted-2)">—</span>`);
    $("#price-table").innerHTML = `<thead><tr style="background:var(--paper)"><th>Product</th><th>Cover</th>${gauges.map((g) => `<th>G${g}</th>`).join("")}<th></th></tr></thead>
      <tbody>${sheets.map((p) => `<tr><td><b>${esc(p.name)}</b></td><td>${p.cover} m</td>${gauges.map((g) => `<td>${cell(p, g)}</td>`).join("")}<td><button class="btn btn-ghost btn-sm" data-quick="${p.id}" data-finish="${plFinish}">Order</button></td></tr>`).join("")}</tbody>`;
  }
  $("#pl-finish").addEventListener("click", (e) => { const b = e.target.closest("[data-plf]"); if (b) { plFinish = b.dataset.plf; renderPriceList(); } });

  render(); renderPriceList();
})();
