#!/usr/bin/env node
/**
 * EduCore — kontrola jakości przed publikacją (bez zależności).
 * Sprawdza w każdym pliku HTML: poprawność JSON-LD, dokładnie jeden <h1>, długość <title> i description,
 * unikalność tytułów, obecność canonical, lang="pl", alt w obrazkach i istnienie linkowanych plików.
 * Użycie:  node tools/check.mjs
 */
import { readFileSync, existsSync } from "node:fs";
import { join, relative, sep, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { listHtml } from "./sync-layout.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const errors = [], warnings = [], titles = new Map();
let ldCount = 0;
const types = new Map();

for (const file of listHtml()) {
  const rel = relative(ROOT, file).split(sep).join("/");
  const html = readFileSync(file, "utf8");
  const noComments = html.replace(/<!--[\s\S]*?-->/g, "");
  const isTemplate = rel.startsWith("zespol/szablon-profilu");

  if (!/<html lang="pl"/.test(html)) errors.push(`${rel}: brak <html lang="pl">`);
  const h1 = (noComments.match(/<h1[\s>]/g) || []).length;
  if (h1 !== 1) errors.push(`${rel}: liczba <h1> = ${h1}`);

  const title = (html.match(/<title>([\s\S]*?)<\/title>/) || [])[1] || "";
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "";
  if (!title) errors.push(`${rel}: brak <title>`);
  if (title.length > 65) warnings.push(`${rel}: <title> ma ${title.length} znaków`);
  if (!desc) errors.push(`${rel}: brak meta description`);
  if (desc.length > 160) warnings.push(`${rel}: description ma ${desc.length} znaków`);
  if (!isTemplate) {
    if (titles.has(title)) errors.push(`${rel}: zduplikowany <title> (jak w ${titles.get(title)})`);
    titles.set(title, rel);
  }
  if (rel !== "404.html" && !/<link rel="canonical"/.test(html)) errors.push(`${rel}: brak canonical`);

  for (const m of noComments.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
    try {
      const data = JSON.parse(m[1]);
      ldCount++;
      const nodes = data["@graph"] || [data];
      for (const n of nodes) {
        const t = [].concat(n["@type"]).join("+");
        types.set(t, (types.get(t) || 0) + 1);
        if (!data["@context"] && !n["@context"]) errors.push(`${rel}: JSON-LD bez @context`);
      }
    } catch (e) {
      errors.push(`${rel}: niepoprawny JSON-LD — ${e.message}`);
    }
  }

  for (const m of noComments.matchAll(/<img\b[^>]*>/g)) {
    if (!/\balt="/.test(m[0])) errors.push(`${rel}: <img> bez alt`);
    if (!/\bwidth="/.test(m[0]) || !/\bheight="/.test(m[0])) warnings.push(`${rel}: <img> bez width/height`);
  }

  for (const m of noComments.matchAll(/\bhref="([^"#]+)(#[^"]*)?"/g)) {
    const href = m[1];
    if (/^([a-z]+:|\/\/)/i.test(href)) continue;
    let target = join(dirname(file), href);
    if (href.endsWith("/") || href === "." || href === "..") target = join(target, "index.html");
    if (!existsSync(target)) errors.push(`${rel}: martwy link → ${href}`);
  }
}

console.log(`Sprawdzono ${titles.size} stron, bloków JSON-LD: ${ldCount}`);
console.log("Typy danych strukturalnych:", Object.fromEntries(types));
for (const w of warnings) console.log("UWAGA:", w);
for (const e of errors) console.log("BŁĄD:", e);
console.log(errors.length ? `\n${errors.length} błędów.` : "\nOK — brak błędów.");
process.exitCode = errors.length ? 1 : 0;
