# Westmere Care Limited — website

A static, dependency-free HTML/CSS/JS website for Westmere Care Limited
(Company No. 17308051), a children's residential care provider based in
Edgware, North West London. Built for local authority social workers and
commissioning teams, not the general public.

## Structure

```
index.html        Home
about.html         About Us — mission, values, leadership bios
our-homes.html     Our Homes — general overview, no exact address
referrals.html     Referrals — process + enquiry form
careers.html       Careers — recruitment info + enquiry form
residential-support-worker.html   Full job description, linked from careers.html
contact.html       Contact — phone/email/contact form, no address
privacy.html       Privacy & Cookies Policy (UK GDPR)
css/style.css      Shared stylesheet (single design system, no framework)
js/main.js         Mobile nav, cookie banner, progressive-enhancement form handling
assets/logo.png    Real logo (icon mark), transparent background
assets/favicon-*.png, apple-touch-icon.png   Favicons derived from the logo
robots.txt / sitemap.xml
netlify.toml       Optional Netlify headers/caching config
```

No build step, no framework, no backend or database. Every page is plain
semantic HTML and can be opened directly in a browser or deployed as-is.

## Content still needed — search for `[PLACEHOLDER]`

Everything is filled in with real content now, with one deliberate
exception:

- **ICO registration reference** (`privacy.html`) — do not invent this;
  leave it until confirmed

## Ofsted & Regulation page — removed for now

There was previously an `ofsted.html` page (registration status, Ofsted
Quality Standards). It was removed at the client's request until the home is
actually registered, rather than leave a half-finished regulatory page live.
It's still in git history (see the "Wire in real content" commit) and can be
restored easily once registration is confirmed — re-add the page, then add
its nav link back to all pages' `<nav class="primary-nav">` and footer
`Site` list, plus a sitemap.xml entry.

## Safeguarding: what must never be added

- The exact street address of the residential home (only the general area —
  "Edgware, North West London" — is published)
- Any individual child's name, photo, or identifying detail
- Pricing / placement fees
- Any Ofsted rating or registration claim that hasn't been confirmed
- A staff salary figure (`residential-support-worker.html` deliberately
  omits one, per the client's instruction — it's discussed at interview)

The public enquiry forms (Referrals, Careers, Contact) intentionally only
collect name, organisation, phone, email and a free-text message — there is
no field for child-identifying information, and each form carries an
explicit instruction not to include any.

## Wiring up the forms

The three forms (`referrals.html`, `careers.html`, `contact.html`) are live,
pointing at a real Formspree endpoint:

```html
<form action="https://formspree.io/f/xnpqkabg" method="POST" ...>
```

All three currently share one Formspree form — the hidden `_subject` field
on each labels submissions by page, so they're still easy to tell apart in
the inbox/dashboard. Each form also has a hidden honeypot field (`_gotcha`)
for basic spam protection. If you ever want the three forms split into
separate Formspree forms/dashboards, create additional forms at
[formspree.io](https://formspree.io) and swap the `action` URL on the
relevant `<form>` tag.

The forms work as plain HTML `POST` submissions even without JavaScript.
`js/main.js` progressively enhances them to submit via `fetch` and show an
inline confirmation message instead of a full-page redirect — but it
deliberately does nothing (lets the native browser submission proceed) if it
detects the endpoint is still the placeholder `YOUR_FORM_ID`, so a forgotten
step fails loudly rather than silently "succeeding".

## Cookie / privacy notice

A simple, unobtrusive banner (bottom of screen) offers "Accept all" or
"Essential only", storing the choice in `localStorage` only — no cookie is
set by the banner itself, and no analytics script is wired in by default.
If you add an analytics tool later, gate its loading on the stored consent
value (`westmere_cookie_consent`) and update `privacy.html` accordingly.

## Accessibility (WCAG 2.1 AA)

- Skip-to-content link on every page
- Semantic landmarks (`header`, `nav`, `main`, `footer`)
- Visible focus states on all interactive elements
- Keyboard-operable mobile navigation (Escape closes the menu)
- Colour palette checked for AA text contrast
- All decorative SVG illustrations marked `aria-hidden="true"`
- Form fields all have associated `<label>`s and required fields are marked

Re-check contrast and screen-reader behaviour once real photography/imagery
(if any) is added, since this build deliberately uses no photos — only
abstract line-art SVGs — to avoid any stock imagery of children.

## Deployment

Static hosting, no build command required:

- **Netlify**: publish directory = `/` (see `netlify.toml`)
- **Vercel**: framework preset = "Other", build command = none, output
  directory = `/`
- **Cloudflare Pages**: build command = none, build output directory = `/`

The `<link rel="canonical">` tags, `sitemap.xml`, `robots.txt` and the
Open Graph/structured data URLs currently point at
`https://westmerecare.netlify.app` — **not** `www.westmerecare.co.uk` —
because as of this writing the custom domain still shows Squarespace's
default "under construction" page rather than resolving to this Netlify
site. Once `westmerecare.co.uk` is actually connected to Netlify (Netlify
dashboard → Domain settings) and resolving correctly, switch every one of
those references back to `https://www.westmerecare.co.uk` — a find/replace
across `*.html`, `sitemap.xml` and `robots.txt` for the domain string is
enough, there's no build step to worry about.
