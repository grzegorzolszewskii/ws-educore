#!/usr/bin/env node
/**
 * EduCore — przygotowanie strony do publikacji (bez zależności, czysty Node 18+).
 * Uruchamiany automatycznie przez GitHub Actions (.github/workflows/deploy.yml).
 * Lokalnie NIE jest potrzebny — do podglądu wystarczy otworzyć index.html.
 *
 * Co robi:
 *  1. synchronizuje nagłówek/stopkę/meta (tools/sync-layout.mjs),
 *  2. kopiuje stronę do folderu _site/ (bez plików roboczych),
 *  3. podmienia adres strony na SITE_URL (np. własną domenę),
 *  4. tryb przedpremierowy: INDEXING != "true" → zostaje noindex i robots.txt blokujący wszystko;
 *     INDEXING = "true" → usuwa noindex i zapisuje produkcyjny robots.txt,
 *  5. generuje sitemap.xml (z lastmod z historii git), plik klucza IndexNow i BingSiteAuth.xml.
 *
 * Zmienne środowiskowe:
 *   SITE_URL  — adres strony bez ukośnika na końcu (domyślnie z site.config.json)
 *   INDEXING  — "true" włącza indeksowanie (wyłącza tryb przedpremierowy)
 *
 * Użycie:  node tools/build.mjs                 (budowanie)
 *          node tools/build.mjs --ping-indexnow (budowanie + zgłoszenie adresów do IndexNow)
 */
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, statSync, copyFileSync, existsSync } from "node:fs";
import { join, relative, sep, dirname, extname } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import { syncAll, loadConfig } from "./sync-layout.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "_site");
const EXCLUDE = new Set([
  "_site", "tools", ".github", ".git", "node_modules", ".vscode", ".claude",
  "README.md", "CHECKLISTA.md", "DO-UZUPELNIENIA.md", "TEMATY-BLOGA.md", "prompt-strona-educore.md",
  "site.config.json", "aktualizuj.bat", ".gitignore", "lighthouse",
]);
const TEXT_EXT = new Set([".html", ".txt", ".xml", ".json", ".webmanifest", ".css", ".js"]);

const c = loadConfig();
const DEFAULT_URL = c.siteUrl.replace(/\/$/, "");
const SITE = (process.env.SITE_URL || DEFAULT_URL).replace(/\/$/, "");
const INDEXING = process.env.INDEXING === "true";
const BASE_PATH = new URL(SITE + "/").pathname; // np. "/ws-educore/" albo "/"

function copyDir(src, dst) {
  mkdirSync(dst, { recursive: true });
  for (const name of readdirSync(src)) {
    if (EXCLUDE.has(name)) continue;
    const s = join(src, name), d = join(dst, name);
    if (statSync(s).isDirectory()) copyDir(s, d);
    else copyFileSync(s, d);
  }
}
function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const f = join(dir, name);
    if (statSync(f).isDirectory()) out.push(...walk(f));
    else out.push(f);
  }
  return out;
}
function lastmod(srcFile) {
  try {
    const d = execFileSync("git", ["log", "-1", "--format=%cs", "--", srcFile], { cwd: ROOT, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    if (d) return d;
  } catch { /* brak gita — użyj daty pliku */ }
  return statSync(srcFile).mtime.toISOString().slice(0, 10);
}

function build() {
  const n = syncAll();
  rmSync(OUT, { recursive: true, force: true });
  copyDir(ROOT, OUT);

  const files = walk(OUT);
  const sitemap = [];
  for (const f of files) {
    if (!TEXT_EXT.has(extname(f))) continue;
    let txt = readFileSync(f, "utf8");
    if (SITE !== DEFAULT_URL) txt = txt.split(DEFAULT_URL).join(SITE);
    if (extname(f) === ".html") {
      if (INDEXING) txt = txt.replace(/<meta name="robots" content="noindex, nofollow" data-prelaunch>\n?/g, "");
      const rel = relative(OUT, f).split(sep).join("/");
      const permanentNoindex = /<meta name="robots" content="noindex, follow">/.test(txt) || rel === "404.html";
      if (!permanentNoindex) {
        const path = rel === "index.html" ? "" : rel.replace(/index\.html$/, "");
        sitemap.push({ loc: `${SITE}/${path}`, lastmod: lastmod(join(ROOT, rel)), depth: path.split("/").filter(Boolean).length });
      }
    }
    writeFileSync(f, txt);
  }

  // robots.txt
  if (INDEXING) {
    const tpl = readFileSync(join(ROOT, "tools", "robots.production.txt"), "utf8");
    writeFileSync(join(OUT, "robots.txt"), tpl.replaceAll("{{SITE}}", SITE).replaceAll("{{BASE}}", BASE_PATH));
  }

  // sitemap.xml
  sitemap.sort((a, b) => a.depth - b.depth || a.loc.localeCompare(b.loc));
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemap.map((u) => `  <url><loc>${u.loc}</loc><lastmod>${u.lastmod}</lastmod></url>`).join("\n")}
</urlset>
`;
  writeFileSync(join(OUT, "sitemap.xml"), xml);

  // IndexNow — plik klucza
  if (c.indexNowKey) writeFileSync(join(OUT, `${c.indexNowKey}.txt`), c.indexNowKey);
  // Bing Webmaster Tools — plik weryfikacyjny (alternatywa dla meta tagu)
  if (c.verification && c.verification.bing)
    writeFileSync(join(OUT, "BingSiteAuth.xml"), `<?xml version="1.0"?>\n<users>\n\t<user>${c.verification.bing}</user>\n</users>\n`);
  // GitHub Pages — bez przetwarzania Jekyllem
  writeFileSync(join(OUT, ".nojekyll"), "");

  console.log(`EduCore build: ${SITE} | indeksowanie: ${INDEXING ? "WŁĄCZONE" : "wyłączone (tryb przedpremierowy)"} | stron w sitemap: ${sitemap.length} | zsynchronizowano: ${n}`);
  return sitemap.map((u) => u.loc);
}

async function pingIndexNow(urls) {
  if (!INDEXING) { console.log("IndexNow: pominięto — indeksowanie wyłączone."); return; }
  const host = new URL(SITE).host;
  const body = { host, key: c.indexNowKey, keyLocation: `${SITE}/${c.indexNowKey}.txt`, urlList: urls };
  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(body),
  });
  console.log(`IndexNow: wysłano ${urls.length} adresów, odpowiedź HTTP ${res.status}`);
}

const urls = build();
if (process.argv.includes("--ping-indexnow")) await pingIndexNow(urls);
