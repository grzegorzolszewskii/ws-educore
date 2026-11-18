# Checklista po starcie strony EduCore

Kolejność ma znaczenie: najpierw domena i HTTPS, potem indeksowanie, potem narzędzia wyszukiwarek.

## 0. Przed startem
- [ ] Uzupełnione wszystkie pozycje z [DO-UZUPELNIENIA.md](DO-UZUPELNIENIA.md) (szczególnie: telefon, e-mail, Formspree, ceny, przykładowe osoby).
- [ ] Regulamin i polityka prywatności sprawdzone przez prawnika; usunięte żółte ramki „SZABLON”.
- [ ] Dopisany sąd rejestrowy i kapitał zakładowy w stopce (art. 206 KSH) — patrz README, sekcja 11.
- [ ] `node tools/check.mjs` → „OK — brak błędów”.
- [ ] Test formularza: wysłanie → przekierowanie na stronę „Dziękujemy” → mail w skrzynce.

## 1. Domena i HTTPS
- [ ] Kup domenę (np. `.pl`) u rejestratora.
- [ ] GitHub → repozytorium `ws-educore` → **Settings → Pages → Custom domain** → wpisz domenę bez www (np. `twojadomena.pl`) → Save.
- [ ] U rejestratora ustaw DNS:
  - rekordy **A** dla domeny głównej (`@`): `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`,
  - (opcjonalnie IPv6, rekordy **AAAA**: `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`),
  - rekord **CNAME** dla `www` → `grzegorzolszewskii.github.io`.
- [ ] Zalecane: zweryfikuj domenę w GitHub (**Settings konta → Pages → Add a domain**) — chroni przed przejęciem domeny.
- [ ] Poczekaj, aż GitHub wyda certyfikat (do 24 h), potem zaznacz **Enforce HTTPS**.
- [ ] Sprawdź przekierowania 301 (GitHub robi je sam): `http://` → `https://` oraz `www.twojadomena.pl` → `twojadomena.pl`.

## 2. Wyłączenie trybu przedpremierowego
- [ ] **Settings → Secrets and variables → Actions → Variables**:
  - `SITE_URL` = `https://twojadomena.pl`
  - `INDEXING` = `true`
  - (opcjonalnie) `INDEXNOW` = `true`
- [ ] W `site.config.json` zmień `siteUrl` na nową domenę (żeby lokalne pliki też miały właściwy adres), uruchom `aktualizuj.bat`, zrób commit i push.
- [ ] Po publikacji sprawdź:
  - `https://twojadomena.pl/robots.txt` — lista crawlerów i link do sitemapy,
  - `https://twojadomena.pl/sitemap.xml` — adresy z nową domeną,
  - w kodzie strony głównej **nie ma** `noindex`, a canonical wskazuje nową domenę,
  - `https://twojadomena.pl/llms.txt` — linki z nową domeną.

## 3. Google Search Console
- [ ] [search.google.com/search-console](https://search.google.com/search-console) → dodaj usługę **Domena** (weryfikacja rekordem TXT w DNS — obejmuje http/https i www).
  - Alternatywa (prefiks URL): skopiuj kod z meta tagu do `verification.google` w `site.config.json` → `aktualizuj.bat` → push.
- [ ] **Mapy witryn** → dodaj `sitemap.xml`.
- [ ] **Sprawdzanie adresu URL** → strona główna → „Poproś o zindeksowanie”. Powtórz dla oferty, matematyki i informatyki.
- [ ] Po kilku dniach: raporty „Strony” i „Ulepszenia” (okruszki, FAQ).

## 4. Bing Webmaster Tools (ważne dla ChatGPT i Copilota)
- [ ] [bing.com/webmasters](https://www.bing.com/webmasters) → **Import z Google Search Console** (najszybciej) albo dodaj stronę ręcznie.
  - Weryfikacja ręczna: kod z meta tagu `msvalidate.01` wpisz do `verification.bing` w configu. Build utworzy też plik `BingSiteAuth.xml`.
- [ ] Dodaj `sitemap.xml`.
- [ ] **IndexNow:** klucz jest w `site.config.json` (`indexNowKey`), a plik klucza jest publikowany automatycznie (`https://twojadomena.pl/<klucz>.txt`). Ustaw zmienną `INDEXNOW=true`, żeby adresy były zgłaszane po każdej publikacji. W Bing Webmaster Tools → IndexNow sprawdź, czy zgłoszenia docierają.

## 5. Profil Google (Google Business Profile)
- [ ] Załóż profil firmy jako **firma usługowa bez adresu** (obszar działania: Wrocław, Legnica, województwo dolnośląskie). Nie podawaj adresu siedziby spółki, bo zajęcia się tam nie odbywają.
- [ ] Kategoria np. „Korepetytor” / „Usługi korepetycji”; opis taki sam jak akapit „Czym jest EduCore”.
- [ ] **NAP identyczny jak na stronie:** nazwa „EduCore”, ten sam telefon, ta sama domena.
- [ ] Link do profilu wpisz w `social.googleBusiness` (pojawi się w `sameAs`) i podlinkuj go na stronie `/wyniki-i-opinie/`.
- [ ] Poproś zadowolonych uczniów i rodziców o opinie w Google.

## 6. Testy po starcie
- [ ] [Rich Results Test](https://search.google.com/test/rich-results): strona główna, `/faq/`, `/oferta/matematyka/`, `/cennik/`, jeden wpis bloga.
- [ ] [validator.schema.org](https://validator.schema.org/): te same adresy — 0 błędów (ostrzeżenie o braku adresu ulicy w LocalBusiness jest świadome).
- [ ] [PageSpeed Insights](https://pagespeed.web.dev/): strona główna i kontakt, wersja mobilna — cel 95+.
- [ ] Podgląd udostępnienia: [opengraph.xyz](https://www.opengraph.xyz/) lub Facebook Sharing Debugger.
- [ ] Wejście z telefonu: menu, pasek „Zadzwoń / Napisz”, formularz.

## 7. Linki zewnętrzne (spójna encja)
- [ ] YouTube (@EduCore-vid): w opisie kanału i w zakładce „Linki” dodaj adres strony. W opisach filmów linkuj do pasujących wpisów i stron przedmiotów.
- [ ] Social media (Facebook, Instagram, TikTok — jeśli powstaną): ta sama nazwa, opis i link. Adresy wpisz w `social` w configu (trafią do `sameAs`).
- [ ] LinkedIn Grzegorza: link do `/o-nas/`; adres profilu wpisz w `social.linkedinFounder`.
- [ ] Katalogi korepetytorów i lokalne katalogi firm: ta sama nazwa i dane kontaktowe co na stronie.

## 8. Regularnie
- [ ] Co miesiąc: liczba wolnych miejsc (`freeSlots`), nowy wpis na blogu ([TEMATY-BLOGA.md](TEMATY-BLOGA.md)), nowe opinie.
- [ ] Co rok (sierpień/wrzesień): nowy harmonogram matur CKE — zaktualizuj terminy na stronach matematyki, informatyki, w FAQ, `llms-full.txt` i we wpisach (pole `dateModified`).
