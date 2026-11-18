# EduCore — strona internetowa

Strona szkoły korepetycji **EduCore** w czystym HTML, CSS i JS. Bez frameworków, bez `npm install`, bez generatorów stron.

- **Podgląd lokalny:** kliknij dwukrotnie `index.html` (albo dowolny inny plik `.html`). Linki działają także przy otwieraniu z dysku.
- **Publikacja:** GitHub Pages przez GitHub Actions (`.github/workflows/deploy.yml`), automatycznie po każdym pushu.
- **Stan:** wersja robocza w **trybie przedpremierowym**, czyli z `noindex` i blokadą w robots.txt.

Powiązane pliki:
- [CHECKLISTA.md](CHECKLISTA.md) — co zrobić po starcie (domena, Search Console, Bing…),
- [DO-UZUPELNIENIA.md](DO-UZUPELNIENIA.md) — wszystkie miejsca do uzupełnienia, z opisem,
- [TEMATY-BLOGA.md](TEMATY-BLOGA.md) — 20 kolejnych tematów wpisów.

---

## 1. Struktura projektu

```
index.html                    strona główna
oferta/                       oferta + 5 przedmiotów (matematyka, informatyka, angielski, polski, fizyka)
kurs-maturalny-grupowy/       kurs grupowy (szablon do uzupełnienia)
cennik/  metoda/  wyniki-i-opinie/  faq/  o-nas/
kontakt/  kontakt/dziekujemy/ formularz i strona po wysłaniu
blog/                         lista wpisów + każdy wpis w swoim folderze
zespol/                       zespół (poza menu, noindex) + szablon-profilu/
regulamin/  polityka-prywatnosci/   szablony do sprawdzenia przez prawnika
404.html  robots.txt  llms.txt  llms-full.txt  favicon.svg
assets/css/style.css          cały wygląd; kolory i fonty w zmiennych na górze pliku
assets/js/main.js             menu mobilne, fasada YouTube, formularz, analityka
assets/fonts/                 font Inter (lokalnie — bez Google Fonts)
assets/img/                   logo, obrazek OG 1200×630, ikony
site.config.json              ← DANE W JEDNYM MIEJSCU: telefon, e-mail, wolne miejsca, formularz, analityka, social media
tools/sync-layout.mjs         wpisuje nagłówek, stopkę, meta tagi i dane z configu do wszystkich stron
tools/build.mjs               przygotowanie do publikacji (używa go GitHub Actions)
tools/check.mjs               kontrola jakości: JSON-LD, H1, tytuły, martwe linki
tools/robots.production.txt   robots.txt po wyjściu z trybu przedpremierowego
aktualizuj.bat                dwuklik = uruchomienie tools/sync-layout.mjs
```

Adresy URL: małe litery, bez polskich znaków, myślniki, **zawsze z ukośnikiem na końcu** (`/oferta/matematyka/`). Każda strona to folder z plikiem `index.html`.

### Jak działają wspólne elementy

W każdym pliku HTML są znaczniki:

```html
<!-- @meta --> ... <!-- /@meta -->                  canonical, robots, Open Graph, Twitter, BreadcrumbList, FAQPage
<!-- @common-head --> ... <!-- /@common-head -->    CSS, font, ikony, skrypty, dane firmy (JSON-LD)
<!-- @header --> ... <!-- /@header -->              logo i menu
<!-- @footer --> ... <!-- /@footer -->              stopka z danymi spółki + pasek mobilny
```

**Nie edytuj ręcznie tego, co jest między tymi znacznikami.** Zawartość wpisuje skrypt `tools/sync-layout.mjs`. Zmieniasz dane w `site.config.json` (albo menu w `tools/sync-layout.mjs`, stała `NAV`) i uruchamiasz:

```
node tools/sync-layout.mjs
```

Możesz też kliknąć dwukrotnie `aktualizuj.bat`. Wymaga to Node.js, który masz zainstalowany. Przy publikacji GitHub Actions robi to samo automatycznie, więc nawet jeśli zapomnisz, opublikowana strona będzie aktualna.

Skrypt generuje sam:
- **canonical, Open Graph i Twitter Cards** — z `<title>` i `<meta name="description">` strony,
- **BreadcrumbList** — z widocznych okruszków `<nav class="breadcrumbs">`,
- **FAQPage** — z pytań w blokach `<div class="faq" data-faq-schema>` (pytania z placeholderami są pomijane),
- **dane organizacji i założyciela** (`EducationalOrganization` + `LocalBusiness`, `Person`, `WebSite`) — z `site.config.json`.

Dzięki temu dane strukturalne zawsze zgadzają się z treścią i nie trzeba ich pilnować ręcznie.

---

## 2. Najczęstsze zmiany

### Zmiana telefonu, e-maila, social mediów

Uzupełnij `phone`, `email` i `social` w `site.config.json`, potem uruchom `aktualizuj.bat`. Numer i e-mail pojawią się w stopce, pasku mobilnym, kontakcie, regulaminie i danych strukturalnych. Dopóki pole zawiera `[`, w danych strukturalnych go nie ma, a na stronie widać żółty znacznik.

### Liczba wolnych miejsc

W `site.config.json` ustaw `freeSlots` (zajęcia indywidualne) i `freeSlotsGroup` (kurs grupowy), np. `"freeSlots": "3"`, i uruchom `aktualizuj.bat`. Wartość pojawi się wszędzie przy CTA (elementy z atrybutem `data-config="freeSlots"`).

### Zmiana cen

Ceny są **tylko w jednym pliku**: `cennik/index.html`. Zmień je w dwóch miejscach w tym pliku:
1. **widoczne ceny** — karty pakietów (`<p class="price">…`) i tabela „Pojedyncze zajęcia”,
2. **dane strukturalne** — blok `<script type="application/ld+json">` na górze pliku (pole `"price"`; komentarz `CENY:` wskazuje miejsce).

Dodatkowo krótkie podsumowanie cen („od 90 zł do 150 zł”, „od 420 zł”) jest w: `cennik/index.html` (pierwszy akapit), `faq/index.html` (pytanie „Ile kosztują korepetycje w EduCore?”) i `blog/ile-kosztuja-korepetycje-z-matematyki-wroclaw/` (link do cennika). Szukaj frazy `zł` w tych plikach. Gdy ceny będą docelowe, usuń żółtą ramkę „Ceny przykładowe” z góry cennika.

### Dodanie opinii

W `wyniki-i-opinie/index.html` (i opcjonalnie na stronie głównej, sekcja „Co mówią uczniowie i rodzice”) skopiuj blok:

```html
<figure class="card testimonial">
  <blockquote><p>Treść opinii — dosłownie, tak jak napisał uczeń lub rodzic.</p></blockquote>
  <figcaption>Anna, rodzic ucznia klasy 8 · matematyka · 2026 · źródło: opinia Google</figcaption>
</figure>
```

Zasady:
- publikuj tylko **prawdziwe** opinie, za zgodą autora,
- **nie dodawaj** danych strukturalnych `Review` ani `AggregateRating` dla opinii o sobie (Google tego nie wyświetla i może uznać za spam),
- gdy powstanie profil Google, podlinkuj go pod opiniami i dodaj do `social.googleBusiness` w configu.

### Dodanie filmu z YouTube (fasada — odtwarzacz ładuje się dopiero po kliknięciu)

1. Pobierz miniaturę filmu i zapisz ją lokalnie, np. `assets/img/yt/rozwiazanie-zadania-2026.jpg` (adres miniatury: `https://i.ytimg.com/vi/ID_FILMU/hqdefault.jpg`). Lokalna kopia sprawia, że przed kliknięciem przeglądarka nie łączy się z serwerami Google (RODO).
2. W miejscu filmu (np. sekcja „Zobacz, jak tłumaczymy zadania” na stronie głównej) wklej:

```html
<div class="yt" data-yt-id="ID_FILMU" data-yt-title="Tytuł filmu">
  <img src="assets/img/yt/rozwiazanie-zadania-2026.jpg" alt="Miniatura filmu: Tytuł filmu" width="480" height="360" loading="lazy">
  <button class="yt__btn" type="button"><span>Odtwórz film: Tytuł filmu</span></button>
</div>
<p class="yt-caption">Krótki opis filmu.</p>
```

3. W `<head>` tej strony dodaj dane strukturalne:

```html
<script type="application/ld+json">{"@context":"https://schema.org","@type":"VideoObject","name":"Tytuł filmu","description":"Opis filmu","thumbnailUrl":"https://grzegorzolszewskii.github.io/ws-educore/assets/img/yt/rozwiazanie-zadania-2026.jpg","uploadDate":"2026-11-16","embedUrl":"https://www.youtube-nocookie.com/embed/ID_FILMU","contentUrl":"https://www.youtube.com/watch?v=ID_FILMU","publisher":{"@id":"https://grzegorzolszewskii.github.io/ws-educore/#organization"}}</script>
```

Ścieżka `src` miniatury jest względna: na stronie głównej `assets/...`, na podstronie `../assets/...`, na wpisie bloga `../../assets/...`.

### Zdjęcia (AVIF/WebP z fallbackiem)

Szare ramki „[ZDJĘCIE]” zamień na:

```html
<picture>
  <source srcset="../assets/img/grzegorz-olszewski-korepetytor-matematyki.avif" type="image/avif">
  <source srcset="../assets/img/grzegorz-olszewski-korepetytor-matematyki.webp" type="image/webp">
  <img src="../assets/img/grzegorz-olszewski-korepetytor-matematyki.jpg" alt="Grzegorz Olszewski, założyciel EduCore, nauczyciel matematyki" width="800" height="1000" loading="lazy">
</picture>
```

- nazwy plików opisowe, małe litery, myślniki,
- `width` i `height` zawsze (zapobiega przesunięciom układu),
- `loading="lazy"` dla zdjęć poniżej pierwszego ekranu; dla zdjęcia w pierwszym ekranie użyj `fetchpriority="high"` zamiast lazy,
- konwersja: np. [Squoosh](https://squoosh.app) (AVIF ~ jakość 50, WebP ~ 75, szerokość max 1600 px).

### Kolory i fonty marki

Na górze `assets/css/style.css`, w sekcji `1. TOKENY`: granaty (`--navy-*`), szarości (`--gray-*`) i role kolorów (`--color-primary` itd.). Zmiana jednej zmiennej zmienia kolor w całym serwisie. Jeśli zmienisz `--navy-700`, zmień też kolor w logo (`assets/img/logo-educore.svg`, `favicon.svg` i stała `LOGO_MARK` w `tools/sync-layout.mjs`).

---

## 3. Jak dodać wpis na blog

1. Skopiuj folder istniejącego wpisu, np. `blog/korepetycje-online-czy-stacjonarne/`, pod nową nazwą — **slug**: małe litery, bez polskich znaków, myślniki, np. `blog/matura-ustna-z-polskiego-jak-sie-przygotowac/`.
2. W nowym `index.html` zmień:
   - `<title>` (do ~60 znaków, fraza na początku, ` | EduCore` na końcu),
   - `<meta name="description">` (do ~155 znaków, z wezwaniem do działania),
   - blok `BlogPosting` w JSON-LD: `headline`, `description`, `datePublished`, `dateModified`, `mainEntityOfPage` (adres wpisu), `about`,
   - okruszki (ostatni element), `<h1>`, daty w `post-meta`,
   - treść: **zacznij od ramki `answer-first`** (2–3 zdania z bezpośrednią odpowiedzią), potem spis treści, sekcje `<h2>`/`<h3>`, tabele i listy, źródła (CKE), notka o autorze, linki do usług (`../../oferta/...`, `../../cennik/`).
3. Własny obrazek OG (opcjonalnie): zapisz PNG 1200×630 w `assets/img/blog/` i dodaj do `<html>` atrybut `data-og-image="assets/img/blog/nazwa.png"`.
4. Dodaj kartę wpisu na górze listy w `blog/index.html` (komentarz `NOWY WPIS`), a najlepiej też link w `llms.txt` i na powiązanej stronie przedmiotu.
5. Uruchom `aktualizuj.bat`, a potem `node tools/check.mjs` (sprawdza H1, tytuły, JSON-LD i martwe linki).

Przy aktualizacji starego wpisu zmień `dateModified` w JSON-LD i datę „Aktualizacja” w treści.

---

## 4. Tryb przedpremierowy i włączenie indeksowania

Dopóki strona jest w budowie:
- każda strona ma `<meta name="robots" content="noindex, nofollow" data-prelaunch>`,
- `robots.txt` blokuje wszystkie roboty (`Disallow: /`).

**Włączenie indeksowania robisz jedną zmienną, bez zmian w kodzie:**

1. GitHub → repozytorium `ws-educore` → **Settings → Secrets and variables → Actions → zakładka Variables → New repository variable**.
2. Dodaj `INDEXING` = `true`.
3. Gdy masz domenę: dodaj też `SITE_URL` = `https://twojadomena.pl` (bez `/` na końcu). Wszystkie canonical, OG, sitemap, llms.txt i dane strukturalne przełączą się na tę domenę.
4. Opcjonalnie `INDEXNOW` = `true` — po każdej publikacji adresy zostaną zgłoszone do IndexNow (Bing i inne wyszukiwarki).
5. Uruchom publikację: zakładka **Actions → Publikacja na GitHub Pages → Run workflow** (albo zrób dowolny push).

Przy `INDEXING=true` skrypt `tools/build.mjs`:
- usuwa `noindex` z publicznych stron (strony z `data-noindex` — `zespol/`, `kontakt/dziekujemy/`, `404` — zostają `noindex`),
- zastępuje `robots.txt` wersją z `tools/robots.production.txt` (jawnie wpuszczone: Googlebot, Bingbot, Google-Extended, Applebot(-Extended), GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User) z linkiem do sitemapy,
- generuje `sitemap.xml` z `lastmod` z historii gita.

Uwaga: pod adresem `github.io/ws-educore/` plik robots.txt nie leży w katalogu głównym domeny, więc roboty go nie czytają (o indeksowaniu decyduje wtedy meta `noindex`). Robots.txt w pełni działa dopiero na własnej domenie.

---

## 5. Publikacja na GitHub Pages (krok po kroku)

Git obsługujesz ręcznie. Ten projekt nie robi commitów ani pushy.

1. Utwórz repozytorium **`ws-educore`** na koncie `grzegorzolszewskii` i wypchnij do niego ten folder (gałąź `main`). `.gitignore` pomija `_site/` i `lighthouse/`.
2. W repozytorium: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Po każdym pushu na `main` w zakładce **Actions** uruchomi się „Publikacja na GitHub Pages”:
   - **build** — `node tools/build.mjs` tworzy folder `_site/`,
   - **deploy** — publikuje `_site/` na GitHub Pages,
   - **indexnow** — tylko przy `INDEXING=true` i `INDEXNOW=true`.
4. Po 1–2 minutach strona jest pod adresem **https://grzegorzolszewskii.github.io/ws-educore/** (link widać też w Settings → Pages i przy zadaniu „deploy”).
5. Jeśli workflow się nie uruchomi: sprawdź, czy gałąź nazywa się `main`, i czy w Settings → Actions → General akcje są dozwolone.

Lokalny test buildu (opcjonalnie): `node tools/build.mjs` tworzy `_site/` — to dokładnie to, co trafi na serwer.

---

## 6. Formularz kontaktowy (Formspree)

1. Załóż konto na [formspree.io](https://formspree.io), utwórz formularz, ustaw e-mail odbiorcy.
2. Skopiuj adres formularza (`https://formspree.io/f/abcdwxyz`) do `formEndpoint` w `site.config.json` i uruchom `aktualizuj.bat`.
3. W ustawieniach Formspree dodaj domenę strony do dozwolonych (Restrict to domain).
4. Z JavaScriptem formularz wysyła dane w tle i przekierowuje na `/kontakt/dziekujemy/`. Bez JS działa zwykłe wysłanie i pojawia się strona podziękowania Formspree.
5. Ochrona przed spamem: ukryte pole `_gotcha` jest już w formularzu; w Formspree możesz włączyć dodatkowo reCAPTCHA lub ich filtr.
6. Formspree to podmiot z USA. Jest wymieniony w polityce prywatności, a prawnik powinien potwierdzić podstawę transferu.

---

## 7. Analityka bez cookies

Strona jest przygotowana pod **Umami** lub **Plausible**. Oba narzędzia nie używają cookies i nie wymagają banera zgód. Zdarzenia są już podpięte w `assets/js/main.js`:
- `Wysłanie formularza` (z przedmiotem),
- `Klik telefon` i `Klik e-mail` (z miejscem kliknięcia: stopka, pasek mobilny, kontakt),
- `Odtworzenie filmu`.

Włączenie — w `site.config.json`:

```json
"analytics": { "provider": "umami", "scriptUrl": "https://cloud.umami.is/script.js", "websiteId": "TWOJE-ID", "domain": "" }
```
albo
```json
"analytics": { "provider": "plausible", "scriptUrl": "", "websiteId": "", "domain": "twojadomena.pl" }
```

Potem uruchom `aktualizuj.bat`.

**Kompromis: GA4 vs Umami/Plausible.** Decyzja należy do Ciebie.

| | Umami / Plausible | Google Analytics 4 |
|---|---|---|
| Cookies / baner zgód | nie / nie | tak / **wymagany** baner + Consent Mode v2 |
| RODO | proste (dane zagregowane, serwery w UE w Plausible) | wymaga zgody, transfer do USA, więcej zapisów w polityce |
| Koszt | Umami: darmowy self-hosting lub chmura z darmowym planem; Plausible: płatny (od ok. 9 USD/mies.) | darmowy |
| Dane | odsłony, źródła, zdarzenia — wystarczające dla tej strony | bardzo szczegółowe, integracja z Google Ads |
| Wpływ na wydajność | skrypt < 2 KB | ok. 50–90 KB + baner |
| Dokładność | pełna (brak odmów zgody) | część użytkowników odrzuci zgodę, więc część danych jest modelowana |

Rekomendacja: **Umami lub Plausible**. Pełna liczba odwiedzin, zero banerów, lepsza wydajność. GA4 ma sens dopiero przy kampaniach Google Ads.

---

## 8. Testy (stan na 16.11.2026)

### Lighthouse (mobile, symulowane wolne 4G, Lighthouse 12.2.1)

Test wykonany na wersji z `INDEXING=true` serwowanej lokalnie (`http://localhost:8080`):

| Strona | Wydajność | Dostępność | Dobre praktyki | SEO | LCP | CLS | TBT |
|---|---|---|---|---|---|---|---|
| Strona główna | 99 | 100 | 100 | 100 | 2,0 s | 0 | 0 ms |
| Matematyka | 99 | 100 | 100 | 100 | 2,0 s | 0 | 0 ms |
| Cennik | 99 | 100 | 100 | 100 | 2,0 s | 0 | 0 ms |
| FAQ | 99 | 100 | 100 | 100 | 2,0 s | 0 | 0 ms |
| Kontakt (formularz) | 99 | 100 | 100 | 100 | 2,0 s | 0 | 0 ms |
| Wpis: Python czy C++ | 99 | 100 | 100 | 100 | 2,0 s | 0 | 0 ms |

Pełne raporty HTML: folder `lighthouse/` (nie trafia do repozytorium). Po publikacji powtórz test w [PageSpeed Insights](https://pagespeed.web.dev/), bo tam są też dane z prawdziwych urządzeń (CrUX).

Uwaga: w trybie przedpremierowym SEO w Lighthouse pokaże mniej niż 100, bo strona ma celowo `noindex`.

### Dane strukturalne

`node tools/check.mjs` → **25 stron, 73 bloki JSON-LD, 0 błędów** (poprawna składnia, `@context`, dokładnie jeden H1, unikalne tytuły, brak martwych linków).

Typy: `EducationalOrganization` + `LocalBusiness`, `Person`, `WebSite` (każda strona), `BreadcrumbList` (24), `FAQPage` (8), `Service` (5 przedmiotów), `BlogPosting` (5), `Blog`, `OfferCatalog` (cennik), `ContactPage`, `AboutPage`, `ItemList`. Szablony: `Course` (kurs grupowy), `ProfilePage`/`Person` (profil korepetytora), `VideoObject` (README).

**Rich Results Test i validator.schema.org** działają tylko na publicznym adresie, więc ten krok jest w [CHECKLISTA.md](CHECKLISTA.md). Do sprawdzenia ręcznie przed publikacją możesz wkleić kod strony na [validator.schema.org](https://validator.schema.org/) (opcja „Code snippet”).

Świadome decyzje:
- `LocalBusiness` nie ma adresu ulicy — siedziba spółki to adres rejestrowy, a zajęcia się tam nie odbywają. Podany jest tylko region (`dolnośląskie`, `PL`) i `areaServed`. Google może pokazać ostrzeżenie „brak address.streetAddress” — to nie błąd.
- Brak `Review`/`AggregateRating` (zgodnie z wytycznymi Google).
- Przykładowi nauczyciele (angielski, polski, fizyka) **nie mają** danych `Person`, żeby fikcyjne osoby nie trafiły do wyszukiwarek i modeli AI.
- Google od 2023 r. pokazuje wyniki rozszerzone FAQ głównie stronom rządowym i medycznym, ale `FAQPage` nadal pomaga modelom AI zrozumieć treść.

---

## 9. GEO — widoczność w odpowiedziach AI

- **Spójna encja:** nazwa „EduCore”, ten sam opis i ten sam założyciel na każdej stronie. Akapit „Czym jest EduCore?” jest na stronie głównej, w `/o-nas/`, w `llms.txt` i `llms-full.txt`, a dane encji są w JSON-LD na każdej stronie.
- **Najpierw odpowiedź:** każda strona i wpis zaczyna się od 2–3 zdań z odpowiedzią.
- **Fakty do cytowania:** tabele (poziomy, PP vs PR, Python vs C++, 1:1 vs grupa, online vs stacjonarnie), konkretne terminy matur 2027, liczby punktów i czas egzaminów.
- **`/llms.txt` i `/llms-full.txt`:** zwięzły i pełny opis EduCore w Markdown.
- **Crawlery AI:** wpuszczone w produkcyjnym robots.txt.
- **Bing:** IndexNow (klucz w `site.config.json` → `indexNowKey`, plik klucza tworzony automatycznie), weryfikacja przez meta tag lub plik `BingSiteAuth.xml` (wpisz kod w `verification.bing`).
- **Ważne po starcie:** linki zwrotne z YouTube, social mediów i profilu Google wzmacniają encję. Ta sama nazwa i dane (NAP) wszędzie.

---

## 10. Dostępność i wydajność — co jest zrobione

- WCAG 2.2 AA: kontrast kolorów AA, widoczny focus, link „Przejdź do treści”, menu obsługiwane klawiaturą (Esc zamyka), etykiety wszystkich pól, `prefers-reduced-motion`, cele dotykowe min. 44 px, opisowe teksty linków.
- Treść w czystym HTML. Bez JS działa wszystko poza zwijanym menu (wtedy menu jest po prostu rozwinięte) i wysyłką formularza w tle.
- Font Inter hostowany lokalnie (2 pliki woff2, `font-display: swap`) z fontem zapasowym o dopasowanych metrykach (CLS = 0).
- Brak zewnętrznych skryptów i bibliotek. Cały JS to jeden plik ~5 KB.
- Pasek „Zadzwoń / Napisz” przyklejony na dole ekranu na telefonach.

---

## 11. Dane prawne w stopce

Stopka podaje: nazwę spółki, siedzibę i adres, KRS, NIP, REGON i informację, że EduCore to nazwa handlowa.

**Uwaga:** na Twoją prośbę pominąłem sąd rejestrowy i wysokość kapitału zakładowego. Art. 206 § 1 KSH wymaga obu tych danych na stronie internetowej spółki z o.o. Przed publikacją warto je dopisać (stopka: funkcja `footer()` w `tools/sync-layout.mjs`, sekcja `footer-legal`) albo potwierdzić to z prawnikiem.
