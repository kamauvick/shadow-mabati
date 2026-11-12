/* ------------------------------------------------------------------
   Procedural SVG art: sheet profiles, accessories, hero house, factory.
   Swap for real photography later by setting `image` on a product.
------------------------------------------------------------------- */
(function () {
  let uid = 0;
  const nextId = (p) => `${p}${++uid}`;

  function hexToRgb(hex) {
    const h = hex.replace("#", "");
    const n = parseInt(h.length === 3 ? h.split("").map((c) => c + c).join("") : h, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  // amt: -1 (black) .. 0 .. 1 (white)
  function shade(hex, amt) {
    const [r, g, b] = hexToRgb(hex);
    const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
    const m = (c) => Math.round((t - c) * p + c);
    return `rgb(${m(r)},${m(g)},${m(b)})`;
  }

  /* ---------- pattern defs per profile ---------- */
  function waveGrad(id, c, stops) {
    return `<linearGradient id="${id}" x1="0" x2="1" y1="0" y2="0">${stops
      .map(([o, a]) => `<stop offset="${o}" stop-color="${shade(c, a)}"/>`).join("")}</linearGradient>`;
  }
  function patternDefs(profile, c, scale = 1) {
    const id = nextId("pat");
    const g = nextId("g");
    const v = nextId("v");
    const s = scale;
    let body = "";
    switch (profile) {
      case "box":
        body = `<pattern id="${id}" width="${60 * s}" height="10" patternUnits="userSpaceOnUse">
          <rect width="${60 * s}" height="10" fill="${c}"/>
          <rect x="${12 * s}" width="${2 * s}" height="10" fill="${shade(c, -0.1)}"/>
          <rect x="${22 * s}" width="${2 * s}" height="10" fill="${shade(c, -0.1)}"/>
          <rect x="${34 * s}" width="${4 * s}" height="10" fill="${shade(c, 0.2)}"/>
          <rect x="${38 * s}" width="${10 * s}" height="10" fill="${shade(c, 0.32)}"/>
          <rect x="${48 * s}" width="${4 * s}" height="10" fill="${shade(c, -0.3)}"/>
        </pattern>`;
        break;
      case "corrugated":
        body = `<defs>${waveGrad(g, c, [[0, -0.32], [0.5, 0.28], [1, -0.32]])}</defs>
          <pattern id="${id}" width="${26 * s}" height="10" patternUnits="userSpaceOnUse">
          <rect width="${26 * s}" height="10" fill="url(#${g})"/></pattern>`;
        break;
      case "tile":
      case "euro":
      case "roman": {
        const w = (profile === "euro" ? 58 : profile === "roman" ? 50 : 42) * s;
        const h = (profile === "euro" ? 50 : 44) * s;
        const stops = profile === "euro"
          ? [[0, -0.42], [0.35, 0.34], [0.62, 0.08], [1, -0.42]]
          : profile === "roman"
            ? [[0, -0.36], [0.18, 0.26], [0.45, 0.06], [0.8, 0.04], [1, -0.36]]
            : [[0, -0.3], [0.5, 0.24], [1, -0.3]];
        body = `<defs>${waveGrad(g, c, stops)}
          <linearGradient id="${v}" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".85" stop-color="#000" stop-opacity=".08"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient></defs>
          <pattern id="${id}" width="${w}" height="${h}" patternUnits="userSpaceOnUse">
            <rect width="${w}" height="${h}" fill="url(#${g})"/>
            <rect width="${w}" height="${h}" fill="url(#${v})"/>
            <rect y="${h - 4 * s}" width="${w}" height="${4 * s}" fill="${shade(c, -0.55)}"/>
            <rect y="${h - 5.5 * s}" width="${w}" height="${1.5 * s}" fill="${shade(c, 0.35)}"/>
          </pattern>`;
        break;
      }
      case "stone": {
        const dots = [[6, 5], [14, 11], [27, 4], [33, 14], [20, 18], [9, 19], [37, 8], [24, 10]]
          .map(([x, y], i) => `<circle cx="${x * s}" cy="${y * s}" r="${(0.9 + (i % 3) * 0.4) * s}" fill="${i % 2 ? "#fff" : "#000"}" opacity="${i % 2 ? 0.18 : 0.22}"/>`).join("");
        body = `<defs><radialGradient id="${g}" cx=".5" cy=".2" r=".9"><stop offset="0" stop-color="${shade(c, 0.22)}"/><stop offset="1" stop-color="${shade(c, -0.25)}"/></radialGradient></defs>
          <pattern id="${id}" width="${40 * s}" height="${24 * s}" patternUnits="userSpaceOnUse">
            <rect width="${40 * s}" height="${24 * s}" fill="${shade(c, -0.45)}"/>
            <path d="M0 0H${40 * s}V${16 * s}Q${30 * s} ${23 * s} ${20 * s} ${16 * s}Q${10 * s} ${23 * s} 0 ${16 * s}Z" fill="url(#${g})"/>
            ${dots}
          </pattern>`;
        break;
      }
      default:
        body = `<pattern id="${id}" width="10" height="10" patternUnits="userSpaceOnUse"><rect width="10" height="10" fill="${c}"/></pattern>`;
    }
    return { id, defs: body };
  }

  /* ---------- product media ---------- */
  function sheetArt(profile, hex) {
    const c = hex;
    const bg1 = shade(c, 0.88), bg2 = shade(c, 0.74);
    const bgId = nextId("bg");
    const shId = nextId("sh");
    const base = `<defs><linearGradient id="${bgId}" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="400" y2="300"><stop offset="0" stop-color="${bg1}"/><stop offset="1" stop-color="${bg2}"/></linearGradient>
      <filter id="${shId}" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="14" stdDeviation="12" flood-color="#0f1d38" flood-opacity=".28"/></filter></defs>
      <rect x="-400" y="-400" width="1200" height="1100" fill="url(#${bgId})"/>`;

    if (profile === "ridge") {
      return svg(`${base}<g filter="url(#${shId})">
        <polygon points="50,150 320,92 300,62 34,118" fill="${shade(c, -0.28)}"/>
        <polygon points="50,150 320,92 352,160 84,216" fill="${shade(c, 0.12)}"/>
        <polygon points="84,216 352,160 360,170 92,226" fill="${shade(c, -0.45)}"/>
        <polygon points="50,150 84,216 92,226 40,156" fill="${shade(c, -0.55)}"/>
        <line x1="50" y1="150" x2="320" y2="92" stroke="${shade(c, 0.5)}" stroke-width="3" stroke-linecap="round"/>
      </g>`);
    }
    if (profile === "gutter") {
      return svg(`${base}<g filter="url(#${shId})">
        <polygon points="40,120 330,80 360,96 70,138" fill="${shade(c, 0.12)}"/>
        <polygon points="70,138 360,96 360,140 70,186" fill="${c}"/>
        <polygon points="40,120 70,138 70,186 44,170" fill="${shade(c, -0.35)}"/>
        <polygon points="74,142 356,101 356,108 74,150" fill="${shade(c, -0.5)}"/>
        <rect x="250" y="120" width="34" height="160" fill="${shade(c, -0.05)}"/>
        <rect x="250" y="120" width="10" height="160" fill="${shade(c, 0.22)}"/>
        <rect x="276" y="120" width="8" height="160" fill="${shade(c, -0.3)}"/>
      </g>`);
    }
    if (profile === "fixing") {
      const steel = "#a7afb8";
      return svg(`${base}<g filter="url(#${shId})" transform="rotate(-18 200 150)">
        <ellipse cx="200" cy="92" rx="62" ry="20" fill="${shade(c, 0.1)}"/>
        <ellipse cx="200" cy="86" rx="62" ry="20" fill="${shade(c, 0.35)}"/>
        <ellipse cx="200" cy="84" rx="22" ry="7" fill="${shade(c, 0.6)}"/>
        <rect x="192" y="96" width="16" height="150" rx="3" fill="${steel}"/>
        <rect x="192" y="96" width="5" height="150" fill="#d4dae0"/>
        <polygon points="192,246 208,246 200,272" fill="${steel}"/>
        ${[120, 140, 160, 180, 200, 220].map((y) => `<rect x="190" y="${y}" width="20" height="3" fill="#7c858f"/>`).join("")}
      </g>`);
    }
    const p = patternDefs(profile, c, profile === "stone" ? 1.2 : 1);
    // edge profile path for the cut end of the sheet
    const edge = edgePath(profile);
    const gl = nextId("gloss");
    return svg(`${base}<defs>${p.defs}</defs>
      <g filter="url(#${shId})" transform="translate(52 34) skewY(-7)">
        <rect width="300" height="200" rx="3" fill="url(#${p.id})"/>
        <rect width="300" height="200" rx="3" fill="url(#${gl})" opacity=".35"/>
        <path d="${edge}" fill="${shade(c, -0.5)}"/>
      </g>
      <defs><linearGradient id="${gl}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".5"/><stop offset=".4" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".18"/></linearGradient></defs>`);
  }
  function edgePath(profile) {
    // thin strip at the bottom showing the sheet cross-section
    const y = 200, pts = [];
    if (profile === "box") {
      for (let x = 0; x < 300; x += 60) pts.push(`L${x + 34} ${y}L${x + 38} ${y + 7}L${x + 48} ${y + 7}L${x + 52} ${y}L${x + 60} ${y}`);
      return `M0 ${y}${pts.join("")}L300 ${y + 3}L0 ${y + 3}Z`;
    }
    if (profile === "stone") return `M0 ${y}H300V${y + 5}H0Z`;
    const w = profile === "corrugated" ? 26 : profile === "euro" ? 58 : 42;
    let d = `M0 ${y + 3}`;
    for (let x = 0; x < 300; x += w) d += `Q${x + w / 2} ${y - 6} ${x + w} ${y + 3}`;
    return d + `L300 ${y + 6}L0 ${y + 6}Z`;
  }
  function svg(inner, vb = "0 0 400 300") {
    return `<svg viewBox="${vb}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${inner}</svg>`;
  }

  /* ---------- hero house ---------- */
  function houseArt(profile, hex) {
    const c = hex;
    const p = patternDefs(profile === "stone" ? "stone" : profile, c, 0.62);
    const glass = nextId("gl");
    const rs = nextId("rs");
    const win = (x, y, w, h) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2" fill="url(#${glass})"/><rect x="${x + w / 2 - 1}" y="${y}" width="2" height="${h}" fill="#fff" opacity=".8"/><rect x="${x - 3}" y="${y + h}" width="${w + 6}" height="4" rx="1" fill="#d9d1c3"/>`;
    return `<svg viewBox="0 0 500 360" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMax slice" aria-hidden="true">
      <defs>${p.defs}
        <linearGradient id="${glass}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9fc0e8"/><stop offset="1" stop-color="#3f6aa8"/></linearGradient>
      </defs>
      <circle cx="420" cy="70" r="34" fill="#fff" opacity=".55"/>
      <circle cx="420" cy="70" r="22" fill="#ffe7b8" opacity=".9"/>
      <path d="M0 270 C 90 240 170 250 260 262 C 350 274 420 250 500 256 V360 H0Z" fill="#c9d4bd"/>
      <path d="M0 300 C 120 286 260 296 500 288 V360 H0Z" fill="#b3c3a4"/>
      <!-- trees -->
      <ellipse cx="54" cy="236" rx="34" ry="44" fill="#4f7a5a"/><ellipse cx="40" cy="250" rx="26" ry="32" fill="#5f8c69"/><rect x="50" y="262" width="6" height="34" fill="#6b4d3a"/>
      <!-- main block -->
      <rect x="96" y="172" width="226" height="122" fill="#f6f1e8"/>
      <rect x="96" y="172" width="226" height="12" fill="#000" opacity=".07"/>
      ${win(118, 206, 44, 46)}${win(178, 206, 44, 46)}
      <rect x="244" y="214" width="40" height="80" rx="2" fill="#7b5236"/><rect x="248" y="218" width="32" height="72" fill="#8e6141"/><circle cx="274" cy="256" r="2.4" fill="#e9c77d"/>
      <rect x="236" y="290" width="56" height="6" fill="#d9d1c3"/>
      <!-- main roof -->
      <polygon points="72,180 346,180 296,92 122,92" fill="url(#${p.id})"/>
      <polygon points="72,180 346,180 296,92 122,92" fill="url(#${rs})"/>
      <rect x="118" y="88" width="182" height="7" rx="2" fill="${shade(c, -0.32)}"/>
      <rect x="68" y="178" width="282" height="8" fill="${shade(c, -0.48)}"/>
      <rect x="70" y="186" width="278" height="4" fill="#8c95a1"/>
      <!-- wing -->
      <rect x="312" y="196" width="128" height="98" fill="#fbf7ef"/>
      ${win(350, 222, 52, 44)}
      <polygon points="300,204 376,124 452,204" fill="${shade(c, -0.35)}"/>
      <polygon points="314,200 376,136 438,200" fill="#efe6d6"/>
      <circle cx="376" cy="174" r="7" fill="#d9cdb8"/><circle cx="376" cy="174" r="4" fill="#c6b79d"/>
      <rect x="296" y="200" width="160" height="6" fill="${shade(c, -0.5)}"/>
      <rect x="0" y="292" width="500" height="6" fill="#a7b796" opacity=".6"/>
      <defs><linearGradient id="${rs}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient></defs>
    </svg>`;
  }

  /* ---------- about: stacked sheets ---------- */
  function factoryArt() {
    const sheets = [
      ["box", "#6E1F24"], ["tile", "#B23A2E"], ["corrugated", "#B9BEC4"], ["box", "#33383F"], ["euro", "#2E5741"], ["box", "#1E4AA8"],
    ];
    let defs = "", g = "";
    sheets.forEach(([pr, col], i) => {
      const p = patternDefs(pr, col, 0.9);
      defs += p.defs;
      const y = 380 - i * 46;
      g += `<g transform="translate(${60 + i * 10} ${y}) skewY(-12)"><rect width="300" height="34" fill="url(#${p.id})"/><rect y="34" width="300" height="6" fill="${shade(col, -0.5)}"/></g>`;
    });
    return `<svg viewBox="0 0 420 440" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>${defs}<radialGradient id="fglow" cx=".7" cy=".2" r=".9"><stop offset="0" stop-color="#1d4aa6" stop-opacity=".7"/><stop offset="1" stop-color="#0f1d38" stop-opacity="0"/></radialGradient></defs>
      <rect width="420" height="440" fill="#0f1d38"/><rect width="420" height="440" fill="url(#fglow)"/>
      ${Array.from({ length: 9 }, (_, i) => `<rect x="${i * 48}" y="0" width="1" height="440" fill="#fff" opacity=".05"/>`).join("")}
      ${g}
    </svg>`;
  }

  /* ---------- roof type icons ---------- */
  const roofIcons = {
    gable: `<svg viewBox="0 0 64 40" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M6 22 32 6l26 16"/><path d="M12 19v15h40V19"/></svg>`,
    hip: `<svg viewBox="0 0 64 40" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M4 22 18 8h28l14 14Z"/><path d="M10 22v12h44V22"/></svg>`,
    leanto: `<svg viewBox="0 0 64 40" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M6 12 58 22"/><path d="M12 13v21h40V21"/></svg>`,
  };

  window.SMArt = { shade, sheetArt, houseArt, factoryArt, roofIcons };
})();
