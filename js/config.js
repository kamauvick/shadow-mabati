/* ------------------------------------------------------------------
   Shadow Mabati — business settings.
   Edit these values; every page reads from here.
------------------------------------------------------------------- */
window.SM_CONFIG = {
  businessName: "Shadow Mabati Factory",
  // International format, digits only (no +, spaces or leading 0). REPLACE with the real WhatsApp line.
  whatsappNumber: "254712115461",
  phoneDisplay: "0712 115 461",
  email: "sales@shadowmabati.co.ke",
  address: "Ruiru Bypass, Kamakis — near Karunguru Plaza",
  hours: "Mon – Sat, 7:30am – 6:00pm",
  mapQuery: "Karunguru Plaza, Ruiru Bypass, Kamakis",

  // Order PDFs are uploaded to Supabase Storage and every order is logged in the `orders` table.
  // The publishable key is safe to expose in the browser; database policies allow inserts only.
  // Remove this block to fall back to share-sheet / text-only ordering.
  supabase: {
    url: "https://wbkhynxgvqwdlibbumnt.supabase.co",
    key: "sb_publishable_BfCEF9cCRXF5ixR4bogzkQ_TH8OPlKU",
    bucket: "order-pdfs",
  },

  currency: "KES",
  vatNote: "Prices are indicative per running metre, VAT inclusive.",

  // Pricing modifiers applied to each product's G30 gloss base price (per metre)
  gaugeUplift: { 32: -70, 30: 0, 28: 130, 26: 290 },
  finishUplift: { Gloss: 0, Matte: 70 },

  // Delivery options shown at checkout
  delivery: [
    { id: "pickup", label: "Collect at factory (Kamakis)", fee: 0, note: "Ready same day for stock lengths" },
    { id: "local", label: "Ruiru · Juja · Kiambu · Thika Rd", fee: 1500, freeAbove: 50000, note: "Free above KES 50,000" },
    { id: "metro", label: "Nairobi Metro", fee: 3000, freeAbove: 120000, note: "Free above KES 120,000" },
    { id: "upcountry", label: "Countrywide (all 47 counties)", fee: null, note: "Rate confirmed on WhatsApp" },
  ],
};
