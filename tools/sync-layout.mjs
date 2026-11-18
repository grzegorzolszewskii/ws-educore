#!/usr/bin/env node
/**
 * EduCore — synchronizacja wspólnych elementów strony (bez zależności, czysty Node).
 *
 * Co robi: w KAŻDYM pliku .html podmienia zawartość między znacznikami:
 *   <!-- @common-head --> ... <!-- /@common-head -->   (CSS, fonty, ikony, skrypty, dane strukturalne firmy)
 *   <!-- @header -->      ... <!-- /@header -->        (logo + menu)
 *   <!-- @footer -->      ... <!-- /@footer -->        (stopka + pasek mobilny)
 * oraz wartości z site.config.json w elementach z atrybutem:
 *   data-config="freeSlots"  (tekst w środku elementu)
 *   data-config-link="phone" / "email"  (atrybut href linku)
 *
 * Ścieżki są względne (../), więc strona działa z dysku, pod github.io/ws-educore/ i pod własną domeną.
 *
 * Użycie:  node tools/sync-layout.mjs
 */
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SKIP_DIRS = new Set(["node_modules", "_site", ".github", "tools", ".git", "assets", "lighthouse"]);

export function loadConfig() {
  return JSON.parse(readFileSync(join(ROOT, "site.config.json"), "utf8"));
}

export function listHtml(dir = ROOT) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) { if (!SKIP_DIRS.has(name)) out.push(...listHtml(full)); }
    else if (name.endsWith(".html")) out.push(full);
  }
  return out;
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const isTodo = (v) => !v || /\[/.test(v);
const show = (v) => (isTodo(v) ? `<mark class="todo">${esc(v || "[DO UZUPEŁNIENIA]")}</mark>` : esc(v));
const telHref = (p) => (isTodo(p) ? "tel:[NUMER]" : "tel:" + p.replace(/[^\d+]/g, ""));
const mailHref = (m) => "mailto:" + m;

const NAV = [
  ["oferta/", "Oferta"],
  ["kurs-maturalny-grupowy/", "Kurs maturalny"],
  ["cennik/", "Cennik"],
  ["metoda/", "Metoda"],
  ["wyniki-i-opinie/", "Opinie"],
  ["blog/", "Blog"],
  ["o-nas/", "O nas"],
  ["kontakt/", "Kontakt"],
];

const LOGO_MARK = `<svg viewBox="0 0 48 48" aria-hidden="true" focusable="false"><rect x="2" y="2" width="44" height="44" rx="11" fill="#1f3d7a"/><circle cx="24" cy="24" r="12" fill="none" stroke="#fff" stroke-width="4"/><circle cx="24" cy="24" r="4.5" fill="#8fabdb"/></svg>`;

function orgGraph(c) {
  const S = c.siteUrl;
  const sameAs = Object.entries(c.social)
    .filter(([k, v]) => v && k !== "linkedinFounder")
    .map(([, v]) => v);
  const org = {
    "@type": ["EducationalOrganization", "LocalBusiness"],
    "@id": `${S}/#organization`,
    name: c.brand,
    url: `${S}/`,
    logo: { "@type": "ImageObject", url: `${S}/assets/img/logo-educore-512.png`, width: 512, height: 512 },
    image: `${S}/assets/img/og-default.png`,
    description: c.description,
    slogan: c.tagline,
    legalName: c.company.name,
    taxID: c.company.nip,
    founder: { "@id": `${S}/o-nas/#grzegorz-olszewski` },
    address: { "@type": "PostalAddress", addressRegion: "dolnośląskie", addressCountry: "PL" },
    areaServed: [
      { "@type": "City", name: "Wrocław" },
      { "@type": "City", name: "Legnica" },
      { "@type": "AdministrativeArea", name: "województwo dolnośląskie" },
      { "@type": "Country", name: "Polska" },
    ],
    knowsAbout: ["matematyka", "informatyka", "język angielski", "język polski", "fizyka", "matura", "egzamin ósmoklasisty"],
    sameAs,
  };
  if (!isTodo(c.phone)) org.telephone = c.phone;
  if (!isTodo(c.email)) org.email = c.email;
  const person = {
    "@type": "Person",
    "@id": `${S}/o-nas/#grzegorz-olszewski`,
    name: c.founder.name,
    jobTitle: c.founder.jobTitle,
    description: `Nauczyciel matematyki i informatyki w liceum, udziela korepetycji od ${c.founder.since} roku. Przygotował ponad 100 uczniów do matury z matematyki i informatyki.`,
    url: `${S}/o-nas/`,
    worksFor: { "@id": `${S}/#organization` },
    knowsAbout: ["matematyka", "matura z matematyki", "informatyka", "matura z informatyki", "Python", "C++", "SQL"],
  };
  const pSame = [c.social.linkedinFounder].filter(Boolean);
  if (pSame.length) person.sameAs = pSame;
  const site = {
    "@type": "WebSite",
    "@id": `${S}/#website`,
    url: `${S}/`,
    name: c.brand,
    inLanguage: "pl-PL",
    publisher: { "@id": `${S}/#organization` },
  };
  return JSON.stringify({ "@context": "https://schema.org", "@graph": [org, person, site] });
}

function analytics(c) {
  const a = c.analytics || {};
  if (a.provider === "umami" && a.scriptUrl && a.websiteId)
    return `<script defer src="${esc(a.scriptUrl)}" data-website-id="${esc(a.websiteId)}"></script>`;
  if (a.provider === "plausible" && a.domain)
    return `<script defer data-domain="${esc(a.domain)}" src="${esc(a.scriptUrl || "https://plausible.io/js/script.tagged-events.js")}"></script>`;
  return `<!-- analityka wyłączona: ustaw "analytics" w site.config.json -->`;
}

function commonHead(c, p) {
  const v = c.verification || {};
  return [
    `<link rel="preload" href="${p}assets/fonts/inter-latin-wght.woff2" as="font" type="font/woff2" crossorigin>`,
    `<link rel="stylesheet" href="${p}assets/css/style.css">`,
    `<link rel="icon" href="${p}favicon.svg" type="image/svg+xml">`,
    `<link rel="apple-touch-icon" href="${p}assets/img/apple-touch-icon.png">`,
    `<meta name="theme-color" content="#10214a">`,
    v.google ? `<meta name="google-site-verification" content="${esc(v.google)}">` : "",
    v.bing ? `<meta name="msvalidate.01" content="${esc(v.bing)}">` : "",
    `<script>document.documentElement.classList.add("js")</script>`,
    `<script src="${p}assets/js/main.js" defer></script>`,
    analytics(c),
    `<script type="application/ld+json">${orgGraph(c)}</script>`,
  ].filter(Boolean).join("\n");
}

function header(p, home, cur) {
  const items = NAV.map(([href, label]) => {
    let aria = "";
    if (cur === href) aria = ' aria-current="page"';
    else if (cur.startsWith(href)) aria = ' aria-current="true"';
    return `      <li><a href="${p}${href}"${aria}>${label}</a></li>`;
  }).join("\n");
  return `<a class="skip-link" href="#main">Przejdź do treści</a>
<header class="site-header">
  <div class="container site-header__inner">
    <a class="logo" href="${home}">${LOGO_MARK}<span>EduCore</span></a>
    <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav"><span class="nav-toggle__icon" aria-hidden="true"></span>Menu</button>
    <nav id="site-nav" class="site-nav" aria-label="Główna nawigacja">
      <ul class="site-nav__list">
${items}
      </ul>
    </nav>
    <a class="btn btn--primary btn--sm site-header__cta" href="${p}kontakt/#formularz">Umów bezpłatną konsultację</a>
  </div>
</header>`;
}

function footer(c, p, home) {
  const co = c.company;
  const year = new Date().getFullYear();
  const social = [
    ["YouTube", c.social.youtube],
    ["Facebook", c.social.facebook || "[DO UZUPEŁNIENIA]"],
    ["Instagram", c.social.instagram || "[DO UZUPEŁNIENIA]"],
  ].map(([n, u]) => (isTodo(u) ? `<li>${n}: ${show(u)}</li>` : `<li><a href="${esc(u)}" rel="noopener">${n}</a></li>`)).join("");
  return `<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <a class="logo" href="${home}">${LOGO_MARK}<span>EduCore</span></a>
        <p>${esc(c.tagline)}</p>
        <a class="btn btn--light btn--sm" href="${p}kontakt/#formularz">Umów bezpłatną konsultację</a>
      </div>
      <nav aria-label="Oferta">
        <h2>Oferta</h2>
        <ul>
          <li><a href="${p}oferta/matematyka/">Matematyka</a></li>
          <li><a href="${p}oferta/informatyka/">Informatyka</a></li>
          <li><a href="${p}oferta/angielski/">Angielski</a></li>
          <li><a href="${p}oferta/polski/">Polski</a></li>
          <li><a href="${p}oferta/fizyka/">Fizyka</a></li>
          <li><a href="${p}kurs-maturalny-grupowy/">Kurs maturalny grupowy</a></li>
          <li><a href="${p}cennik/">Cennik</a></li>
        </ul>
      </nav>
      <nav aria-label="EduCore">
        <h2>EduCore</h2>
        <ul>
          <li><a href="${p}metoda/">Metoda pracy</a></li>
          <li><a href="${p}wyniki-i-opinie/">Wyniki i opinie</a></li>
          <li><a href="${p}o-nas/">O nas</a></li>
          <li><a href="${p}blog/">Blog</a></li>
          <li><a href="${p}faq/">FAQ</a></li>
          <li><a href="${p}kontakt/">Kontakt</a></li>
        </ul>
      </nav>
      <div>
        <h2>Kontakt</h2>
        <ul>
          <li>Telefon: <a href="${telHref(c.phone)}" data-track="stopka">${show(c.phone)}</a></li>
          <li>E-mail: <a href="${mailHref(c.email)}" data-track="stopka">${show(c.email)}</a></li>
          ${social}
          <li>Stacjonarnie: województwo dolnośląskie</li>
          <li>Online: cała Polska</li>
        </ul>
      </div>
    </div>
    <div class="footer-legal">
      <p>EduCore jest nazwą handlową, pod którą działa ${esc(co.name)} z siedzibą we Wrocławiu, ${esc(co.street)}, ${esc(co.postalCode)} ${esc(co.city)}. KRS: ${esc(co.krs)}, NIP: ${esc(co.nip)}, REGON: ${esc(co.regon)}. Podany adres jest adresem rejestrowym spółki, zajęcia nie odbywają się pod tym adresem.</p>
      <p><a href="${p}regulamin/">Regulamin</a> · <a href="${p}polityka-prywatnosci/">Polityka prywatności</a> · © ${year} EduCore</p>
    </div>
  </div>
</footer>
<div class="mobile-bar" role="navigation" aria-label="Szybki kontakt">
  <a class="btn btn--secondary" href="${telHref(c.phone)}" data-track="pasek-mobilny">Zadzwoń</a>
  <a class="btn btn--primary" href="${p}kontakt/#formularz">Napisz</a>
</div>`;
}

const unesc = (s) => s.replace(/<[^>]+>/g, "").replace(/&quot;/g, '"').replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();

/** Canonical, robots, Open Graph, Twitter Cards i BreadcrumbList — generowane z treści strony. */
function pageMeta(c, html, cur, is404) {
  const S = c.siteUrl;
  const title = unesc((html.match(/<title>([\s\S]*?)<\/title>/) || [, "EduCore"])[1]);
  const desc = unesc((html.match(/<meta name="description" content="([^"]*)"/) || [, ""])[1]);
  const htmlTag = (html.match(/<html\b[^>]*>/) || [""])[0];
  const attr = (n) => (htmlTag.match(new RegExp(`${n}="([^"]*)"`)) || [])[1];
  const noindex = /\bdata-noindex\b/.test(htmlTag) || is404;
  const ogType = attr("data-og-type") || "website";
  const ogImage = `${S}/${attr("data-og-image") || "assets/img/og-default.png"}`;
  const url = `${S}/${cur}`;
  const out = [];
  out.push(noindex
    ? `<meta name="robots" content="noindex, follow">`
    : `<meta name="robots" content="noindex, nofollow" data-prelaunch>`);
  if (!is404) out.push(`<link rel="canonical" href="${url}">`);
  out.push(
    `<meta property="og:type" content="${ogType}">`,
    `<meta property="og:locale" content="pl_PL">`,
    `<meta property="og:site_name" content="EduCore">`,
    `<meta property="og:title" content="${esc(title)}">`,
    `<meta property="og:description" content="${esc(desc)}">`,
    is404 ? "" : `<meta property="og:url" content="${url}">`,
    `<meta property="og:image" content="${ogImage}">`,
    `<meta property="og:image:width" content="1200">`,
    `<meta property="og:image:height" content="630">`,
    `<meta property="og:image:alt" content="EduCore — korepetycje z matematyki, informatyki, angielskiego, polskiego i fizyki">`,
    `<meta name="twitter:card" content="summary_large_image">`,
    `<meta name="twitter:title" content="${esc(title)}">`,
    `<meta name="twitter:description" content="${esc(desc)}">`,
    `<meta name="twitter:image" content="${ogImage}">`
  );
  // BreadcrumbList z widocznych okruszków <nav class="breadcrumbs">
  const bc = html.match(/<nav class="breadcrumbs"[\s\S]*?<\/nav>/);
  if (bc && !is404) {
    const items = [...bc[0].matchAll(/<li>([\s\S]*?)<\/li>/g)].map((m, i) => {
      const a = m[1].match(/href="([^"]*)"/);
      const name = unesc(m[1]);
      const item = a ? new URL(a[1], url).href : url;
      return { "@type": "ListItem", position: i + 1, name, item };
    });
    if (items.length)
      out.push(`<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: items })}</script>`);
  }
  // FAQPage z widocznych pytań w blokach <div class="faq" data-faq-schema>
  const faqBlocks = [...html.matchAll(/<div class="faq" data-faq-schema>([\s\S]*?)<\/div>\s*<!-- \/faq -->/g)];
  const qa = [];
  for (const b of faqBlocks)
    for (const m of b[1].matchAll(/<summary><h3>([\s\S]*?)<\/h3><\/summary>\s*<div class="faq__answer">([\s\S]*?)<\/div>\s*<\/details>/g))
      if (!/\[DO UZUP|Lorem ipsum/.test(m[2])) qa.push({ "@type": "Question", name: unesc(m[1]), acceptedAnswer: { "@type": "Answer", text: unesc(m[2]) } });
  if (qa.length)
    out.push(`<script type="application/ld+json">${JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: qa })}</script>`);
  return out.filter(Boolean).join("\n");
}

function region(html, name, content) {
  const re = new RegExp(`(<!-- @${name} -->)[\\s\\S]*?(<!-- /@${name} -->)`, "g");
  return html.replace(re, (_, a, b) => `${a}\n${content}\n${b}`);
}

export function syncFile(file, c) {
  const rel = relative(ROOT, file).split(sep).join("/");
  const is404 = rel === "404.html";
  const depth = rel.split("/").length - 1;
  const p = is404 ? `${c.siteUrl}/` : "../".repeat(depth);
  const home = p || "./";
  const cur = rel === "index.html" ? "" : rel.replace(/index\.html$/, "");

  let html = readFileSync(file, "utf8");
  const before = html;
  html = region(html, "meta", pageMeta(c, html, cur, is404));
  html = region(html, "common-head", commonHead(c, p));
  html = region(html, "header", header(p, home, cur));
  html = region(html, "footer", footer(c, p, home));

  // wartości z konfiguracji
  html = html.replace(/(<(\w+)\b[^>]*\bdata-config="(\w+)"[^>]*>)([\s\S]*?)(<\/\2>)/g, (m, open, tag, key, _inner, close) => {
    const val = c[key];
    if (val === undefined) return m;
    return open + show(val) + close;
  });
  html = html.replace(/<a\b([^>]*?)\bdata-config-link="(phone|email)"([^>]*)>/g, (m, a1, key, a2) => {
    const href = key === "phone" ? telHref(c.phone) : mailHref(c.email);
    const attrs = (a1 + `data-config-link="${key}"` + a2).replace(/\s*href="[^"]*"/, "");
    return `<a href="${href}" ${attrs.trim()}>`;
  });
  html = html.replace(/(<form\b[^>]*\bdata-contact-form\b[^>]*\baction=")[^"]*(")/, (_, a, b) => a + esc(c.formEndpoint) + b);

  if (html !== before) writeFileSync(file, html);
  return html !== before;
}

export function syncAll() {
  const c = loadConfig();
  let n = 0;
  for (const f of listHtml()) if (syncFile(f, c)) n++;
  return n;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const n = syncAll();
  console.log(`EduCore: zaktualizowano ${n} plik(ów) HTML.`);
}
