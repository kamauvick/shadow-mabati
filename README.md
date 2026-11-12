# Shadow Mabati — website

A static site with no build step. Upload the folder to any host (cPanel, Netlify, Vercel or GitHub Pages).

```
index.html      Home: hero (sheet stack + stats), featured products, roof visualiser, calculator, how ordering works, testimonials, about, FAQ, contact
shop.html       Shop: categories, filters, search, sort, compare (up to 3), gauge price list
css/styles.css  Design system (colour tokens at the top)
js/config.js    WhatsApp number, phone, email, address, hours, delivery zones and fees, gauge/finish price uplifts
js/data.js      Products, colours, testimonials, FAQ
js/art.js       SVG illustrations (fallback when a product/colour has no photo)
assets/products Product photos (max 1100 px JPEGs), mapped per colour in js/data.js
js/common.js    Header/footer, cart, quick view, checkout, PDF generation, WhatsApp hand-off
```

## Orders (Supabase project `shadow-mabati`)
- When a customer places an order or requests a calculator quote, the PDF is uploaded to the Storage bucket `order-pdfs` (in `orders/` or `quotes/`). The order is also saved in the `orders` table.
- WhatsApp then opens to the business number with a short message that links to the PDF.
- Check incoming orders in the dashboard (Table Editor → `orders`), sorted by `created_at`. Track progress in the `status` column: new → confirmed → paid → in_production → delivered / cancelled.
- The website can only insert. It cannot read, list, edit or delete orders or PDFs. Anyone who has a PDF's link can open it, but the links include a random ID that can't be guessed.
- If the upload fails (e.g. the customer is offline), the site falls back to sharing the PDF from the phone or sending the order as text.

## Before going live
1. Set the real `whatsappNumber`, `phoneDisplay` and `email` in `js/config.js`.
2. Confirm prices in `js/data.js`. Sheet prices are G30 gloss per metre; other gauges and matte use the uplifts in config.
3. Check that every claim on the page is true for the business (warranty years, delivery times, return policy, "5,000+ roofs", the 4.9 rating, testimonials) and edit the text in `index.html`, `js/home.js` and `js/data.js`.

## Deploying (GitHub Pages)

Push to `main` and GitHub Pages republishes in about a minute. After changing CSS or JS, bump the `?v=` version on the asset links so browsers fetch the new files instead of cached ones:

```sh
V=$(date +%Y%m%d%H%M); sed -i -E "s#(href=\"css/[a-z]+\.css|src=\"js/[a-z]+\.js)(\?v=[0-9]+)?\"#\1?v=$V\"#g" index.html shop.html
```

## Running locally
Open it through any static server (e.g. `npx serve .`). Opening `index.html` directly from disk works too, but the logo won't be embedded in generated PDFs.
