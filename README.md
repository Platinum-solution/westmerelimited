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
ofsted.html        Ofsted & Regulation — registration status, quality standards
referrals.html     Referrals — process + enquiry form
careers.html       Careers — recruitment info + enquiry form
contact.html       Contact — phone/email/contact form, no address
privacy.html       Privacy & Cookies Policy (UK GDPR)
css/style.css      Shared stylesheet (single design system, no framework)
js/main.js         Mobile nav, cookie banner, progressive-enhancement form handling
assets/favicon.svg Site icon
robots.txt / sitemap.xml
netlify.toml       Optional Netlify headers/caching config
```

No build step, no framework, no backend or database. Every page is plain
semantic HTML and can be opened directly in a browser or deployed as-is.

## Content still needed — search for `[PLACEHOLDER]`

Every piece of content that requires real information (not yet supplied, or
that would otherwise involve inventing a regulatory claim) is wrapped in a
`[PLACEHOLDER]`-style tag, often with a dashed amber background so it's easy
to spot visually in the browser. Before launch, replace all of these. Key
items:

- **Mission statement wording** (`about.html`)
- **Founders' / leadership professional bios** (`about.html`) — no personal
  addresses or private details, professional background only
- **Care model / methodology description, age range, placement capacity**
  (`about.html`, `our-homes.html`)
- **Ofsted URN, registration status, and inspection rating** (`ofsted.html`)
  — do **not** fill this in until Ofsted registration/rating is actually
  confirmed
- **London Borough** for the Edgware home (`our-homes.html`)
- **Phone number and email domain** (footer of every page, `contact.html`,
  `referrals.html`, `careers.html`)
- **Registered office address** (footer of every page, `privacy.html`) — this
  is the company's statutory registered office (a Companies House / legal
  requirement), which is **separate** from the care home's own address. The
  home's exact address must never be published on this site — see the
  safeguarding note below.
- **Form endpoint** — see "Wiring up the forms" below
- **Privacy policy specifics** — ICO registration reference, data retention
  periods, and the actual form-processing service used (`privacy.html`)
- **Current vacancies** (`careers.html`)

## Safeguarding: what must never be added

- The exact street address of the residential home (only the general area —
  "Edgware, North West London" — is published)
- Any individual child's name, photo, or identifying detail
- Pricing / placement fees
- Any Ofsted rating or registration claim that hasn't been confirmed

The public enquiry forms (Referrals, Careers, Contact) intentionally only
collect name, organisation, phone, email and a free-text message — there is
no field for child-identifying information, and each form carries an
explicit instruction not to include any.

## Wiring up the forms

The three forms (`referrals.html`, `careers.html`, `contact.html`) currently
point at:

```html
<form action="https://formspree.io/f/YOUR_FORM_ID" method="POST" ...>
```

To go live:

1. Create a free account at [formspree.io](https://formspree.io) (or any
   similar form backend / email-forwarding service).
2. Create a form and copy its endpoint URL.
3. Replace `https://formspree.io/f/YOUR_FORM_ID` in all three files with your
   real endpoint.
4. Each form also has a hidden honeypot field (`_gotcha`) for basic spam
   protection, and a hidden `_subject` field you can customise per form.

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

The `<link rel="canonical">` tags, `sitemap.xml` and `robots.txt` already
point at the real domain, `www.westmerecare.co.uk`. If that ever changes,
update all three.
