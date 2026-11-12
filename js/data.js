/* ------------------------------------------------------------------
   Product catalogue. Prices are KES.
   - unit "m": base = G30 gloss price per running metre (gauge/finish uplifts from config)
   - other units: fixed price per unit
   - quote: true → "Price on request" (no price, enquiry via WhatsApp instead of cart)
   - photos: { colour: "file in assets/products/" }. The first listed colour should have a photo;
     colours without one fall back to the drawn illustration in that colour.
------------------------------------------------------------------- */
window.SM_COLOURS = [
  { name: "Maroon", hex: "#6E1F24" },
  { name: "Tile Red", hex: "#B23A2E" },
  { name: "Brick Red", hex: "#8F3B2A" },
  { name: "Charcoal", hex: "#33383F" },
  { name: "Coffee Brown", hex: "#5A3E2E" },
  { name: "Forest Green", hex: "#2E5741" },
  { name: "Royal Blue", hex: "#1E4AA8" },
  { name: "Ocean Blue", hex: "#2F6E95" },
  { name: "Aluzinc Silver", hex: "#B9BEC4" },
];

window.SM_PRODUCTS = [
  {
    id: "box-profile", name: "Box Profile", category: "Roofing Sheets", profile: "box",
    unit: "m", base: 520, cover: 0.9, gauges: [30, 28, 26], finishes: ["Gloss", "Matte"],
    colours: ["Maroon", "Charcoal", "Royal Blue", "Coffee Brown", "Tile Red", "Forest Green"],
    photos: { "Maroon": "box-profile-maroon.jpg", "Charcoal": "box-profile-charcoal.jpg", "Royal Blue": "box-profile-blue.jpg", "Coffee Brown": "box-profile-brown.jpg" },
    featured: true, badge: "Best seller", warranty: "15 yrs (G28)",
    short: "Sharp trapezoidal ribs. Clean, modern lines for homes, warehouses and estates.",
    use: "Residential · Commercial",
  },
  {
    id: "versatile-tile", name: "Versatile Tile", category: "Roofing Sheets", profile: "tile",
    unit: "m", base: 600, cover: 1.0, gauges: [30, 28], finishes: ["Gloss", "Matte"],
    colours: ["Tile Red", "Forest Green", "Charcoal", "Maroon", "Brick Red", "Coffee Brown"],
    photos: { "Tile Red": "versatile-tile-red.jpg", "Forest Green": "versatile-tile-green.jpg", "Charcoal": "versatile-tile-charcoal.jpg" },
    featured: true, badge: "Premium look", warranty: "15 yrs (G28)",
    short: "Step-tile profile that reads like clay tiles from the road, at a fraction of the weight.",
    use: "Residential · Maisonettes",
  },
  {
    id: "euro-tile", name: "Euro Tile", category: "Roofing Sheets", profile: "euro",
    unit: "m", base: 640, cover: 1.0, gauges: [30, 28], finishes: ["Gloss", "Matte"],
    colours: ["Charcoal", "Maroon", "Coffee Brown", "Tile Red"],
    photos: { "Charcoal": "euro-tile-charcoal.jpg" },
    featured: true, badge: "New", warranty: "15 yrs (G28)",
    short: "Deep, rounded tile pattern with bold shadow lines. Our most architectural sheet.",
    use: "Villas · Modern homes",
  },
  {
    id: "classic-tile", name: "Classic Roman Tile", category: "Roofing Sheets", profile: "roman",
    unit: "m", base: 630, cover: 1.0, gauges: [30, 28], finishes: ["Gloss", "Matte"],
    colours: ["Coffee Brown", "Forest Green", "Charcoal", "Tile Red", "Brick Red", "Maroon"],
    photos: { "Coffee Brown": "roman-tile-brown.jpg", "Forest Green": "roman-tile-green.jpg", "Charcoal": "roman-tile-charcoal.jpg" },
    short: "Traditional rolled-tile look with crisp step breaks and generous cover width.",
    use: "Residential", warranty: "15 yrs (G28)",
  },
  {
    id: "corrugated", name: "Corrugated", category: "Roofing Sheets", profile: "corrugated",
    unit: "m", base: 420, cover: 0.76, gauges: [32, 30, 28], finishes: ["Gloss"],
    colours: ["Aluzinc Silver", "Maroon", "Charcoal", "Forest Green", "Ocean Blue"],
    photos: { "Aluzinc Silver": "corrugated-aluzinc.jpg", "Maroon": "corrugated-maroon.jpg", "Charcoal": "corrugated-charcoal.jpg" },
    featured: true, badge: "Best value", warranty: "10 yrs (G28)",
    short: "The dependable classic. Light, quick to install and kind on the budget.",
    use: "Farm · Rentals · Stores",
  },
  {
    id: "aluzinc-box", name: "Aluzinc Box Profile", category: "Roofing Sheets", profile: "box",
    unit: "m", base: 560, cover: 0.9, gauges: [30, 28], finishes: ["Gloss"],
    colours: ["Aluzinc Silver"],
    short: "Unpainted aluminium-zinc coating. Excellent rust resistance for coastal and industrial sites.",
    use: "Industrial · Coastal", warranty: "20 yrs (G28)",
  },
  {
    id: "crimped-canopy", name: "Crimped Canopy Sheet", category: "Roofing Sheets", profile: "corrugated",
    unit: "m", base: 650, cover: 0.76, gauges: [30, 28], finishes: ["Gloss", "Matte"],
    colours: ["Charcoal", "Maroon", "Forest Green", "Royal Blue"],
    short: "Factory-curved sheet for verandas, car-ports and curved roofs.",
    use: "Canopies · Car-ports", warranty: "10 yrs (G28)",
  },
  {
    id: "stone-coated", name: "Stone-Coated Tile", category: "Roofing Sheets", profile: "stone",
    unit: "tile", price: 780, perSqm: 2.1, gauges: [], finishes: ["Granule"],
    colours: ["Charcoal", "Coffee Brown", "Forest Green", "Maroon", "Tile Red"],
    photos: { "Charcoal": "stone-coated-charcoal.jpg", "Coffee Brown": "stone-coated-brown.jpg", "Forest Green": "stone-coated-green.jpg", "Maroon": "stone-coated-maroon.jpg" },
    featured: true, badge: "Luxury", warranty: "30 yrs",
    short: "Steel tiles with a stone-chip finish. Silent in rain, rich in texture, built for decades.",
    use: "Luxury homes",
  },

  // Accessories
  { id: "ridge-cap", name: "Ridge Cap (2.0 m)", category: "Ridges & Flashing", profile: "ridge", unit: "pc", price: 650,
    colours: ["Maroon", "Charcoal", "Tile Red", "Forest Green", "Royal Blue", "Coffee Brown", "Aluzinc Silver"],
    short: "Pre-bent ridge matched to your sheet colour." },
  { id: "valley", name: "Valley Gutter (2.0 m)", category: "Ridges & Flashing", profile: "ridge", unit: "pc", price: 700,
    colours: ["Maroon", "Charcoal", "Tile Red", "Aluzinc Silver"], short: "Channels water where two roof slopes meet." },
  { id: "wall-flash", name: "Wall Flashing (2.0 m)", category: "Ridges & Flashing", profile: "ridge", unit: "pc", price: 550,
    colours: ["Maroon", "Charcoal", "Tile Red", "Aluzinc Silver"], short: "Seals the joint between roof and parapet wall." },
  { id: "gutter", name: "Box Gutter (4.0 m)", category: "Gutters & Downpipes", profile: "gutter", unit: "pc", price: 1750,
    colours: ["Charcoal", "Maroon", "Coffee Brown", "Aluzinc Silver"], short: "Pre-painted steel gutter for clean rainwater harvesting." },
  { id: "downpipe", name: "Downpipe (4.0 m)", category: "Gutters & Downpipes", profile: "gutter", unit: "pc", price: 1550,
    colours: ["Charcoal", "Maroon", "Coffee Brown", "Aluzinc Silver"], short: "Matching square downpipe." },
  { id: "gutter-fittings", name: "Gutter Fittings Set", category: "Gutters & Downpipes", profile: "gutter", unit: "set", price: 1200,
    colours: ["Charcoal", "Maroon", "Coffee Brown"], short: "End caps, joiner, outlet, 2 elbows and hangers." },
  { id: "nails", name: "Umbrella Roofing Nails", category: "Fixings", profile: "fixing", unit: "kg", price: 320,
    colours: ["Forest Green", "Charcoal"],
    photos: { "Forest Green": "nails-green.jpg", "Charcoal": "nails-black.jpg" },
    short: "Galvanised nails with a colour-matched umbrella head. Approx. 1 kg per 10 m²." },
  { id: "screws", name: "Self-Drilling Roof Screws (100)", category: "Fixings", profile: "fixing", unit: "box", price: 1800,
    short: "Colour-matched heads with EPDM washers for steel purlins." },
  { id: "washers", name: "Rubber Washers (100)", category: "Fixings", profile: "fixing", unit: "pack", price: 150,
    short: "Weatherproof seal under every fixing." },
  { id: "silicone", name: "Roof Sealant / Silicone", category: "Fixings", profile: "fixing", unit: "tube", price: 450,
    short: "UV-stable sealant for flashings and overlaps." },

  // Price on request
  { id: "asphalt-shingles", name: "Asphalt Roofing Shingles", category: "Shingles & Insulation", profile: "stone", unit: "bundle", quote: true,
    photos: { "": "asphalt-shingles.jpg" },
    short: "Fibreglass asphalt shingles for steep and decorative roofs. See the full colour range at our showroom.",
    use: "Villas · Gazebos" },
  { id: "roof-insulation", name: "Reflective Roof Insulation", category: "Shingles & Insulation", profile: "fixing", unit: "roll", quote: true,
    photos: { "": "roof-insulation.jpg" },
    short: "Foil-faced insulation rolls laid under the sheets. Keeps rooms cooler and quietens heavy rain.",
    use: "Homes · Schools · Warehouses" },
];

window.SM_TESTIMONIALS = [
  { name: "Grace W.", place: "Ruiru, Membley", product: "Versatile Tile · Maroon", text: "They cut every sheet to my exact rafter lengths, so there was no waste on site. My fundi finished the roof in two days." },
  { name: "Peter K.", place: "Juja Farm", product: "Box Profile · G28 Charcoal", text: "I compared three factories. Shadow's quote was the clearest, and they delivered on the same afternoon I paid." },
  { name: "Esther N.", place: "Thika", product: "Stone-Coated Tile", text: "The quote calculator was spot on. The final bill came in under my budget, and the roof is completely silent in the rain." },
  { name: "Brian O.", place: "Kitengela", product: "Corrugated · 12 rental units", text: "Good prices for bulk and honest advice on gauge. They told me where G30 was enough instead of upselling me." },
  { name: "Mama Wanjiru", place: "Githurai 45", product: "Box Profile · Forest Green", text: "Two years on, the colour has not faded at all. My neighbours keep asking where I bought my mabati." },
];

window.SM_FAQ = [
  { q: "What is the difference between Gauge 28 and Gauge 30?", a: "Lower gauge numbers mean thicker steel. G28 (≈0.40 mm) is stiffer, quieter in rain and lasts longer, so it's the one we recommend for homes. G30 (≈0.30 mm) is lighter and cheaper, and works well for stores, rentals and farm structures. G32 suits temporary structures only." },
  { q: "Do you cut sheets to length?", a: "Yes. Every profile is roll-formed to your exact lengths, from 1 m up to 10 m. Send us your rafter lengths (or your house plan) and we'll prepare a cutting list so nothing goes to waste." },
  { q: "How fast is delivery?", a: "Orders within Ruiru, Juja, Kiambu and Thika Road are usually delivered the same or next day. Nairobi Metro takes 1 to 2 days, and countrywide delivery takes 2 to 5 working days depending on the county." },
  { q: "Can I return sheets?", a: "Uncut, unused stock-length items can be returned within 7 days in their original condition. Custom-cut sheets can't be returned, but any manufacturing defect is replaced free. That is our quality promise." },
  { q: "Is the paint safe for rainwater harvesting?", a: "Yes. Our pre-painted sheets use lead-free coatings that are suitable for collecting domestic rainwater. Wash the roof once after installation before you start collecting." },
  { q: "How do I pay?", a: "M-PESA (Paybill details are sent with your order confirmation), bank transfer or cash at the factory. Production starts once a deposit is confirmed." },
  { q: "Can someone visit my site to measure?", a: "Yes. Within Ruiru and the surrounding areas we offer a free site measurement for orders above KES 100,000. Book one through the quote form or on WhatsApp." },
  { q: "How accurate is the online calculator?", a: "It is a planning estimate based on your house dimensions, pitch and overhang, plus about 5% overlap and waste. Final quantities are confirmed from your plan or after a site measurement." },
];
