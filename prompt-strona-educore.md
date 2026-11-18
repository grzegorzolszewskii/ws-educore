# Prompt dla Claude Code: strona EduCore

Zbuduj od zera stronę internetową mojej szkoły korepetycji **EduCore**. Strona ma być od pierwszej wersji gotowa produkcyjnie pod kątem SEO, GEO (widoczność w odpowiedziach modeli AI: ChatGPT, Claude, Perplexity, Gemini, Google AI Overviews), wydajności, dostępności i RODO, tak żebym nie musiał jej później przebudowywać.

Zanim zaczniesz pisać kod:
1. Przeczytaj cały prompt.
2. Zadaj mi pytania o wszystko, czego brakuje w sekcji „Dane”.
3. Przedstaw plan: strukturę adresów URL, stack, listę plików i kolejność prac. Poczekaj na moją akceptację.

---

## 1. Dane (uzupełniam ja — wszystko, czego brakuje, oznacz w kodzie jako `[DO UZUPEŁNIENIA]`)

- Marka: **EduCore**
- Właściciel / twarz marki: Grzegorz Olszewski
- Spółka: G&D Olszewscy sp. z o.o., siedziba: ul. Stanisławowska 47, 54-611 Wrocław, NIP: 8943285090, KRS: 0001235751, REGON: 544528843
- Domena docelowa: nie mamy jeszcze
- E-mail: jeszcze nie ma możesz dać placeholder, telefon: jeszcze nie ma możesz dać placeholder [NUMER]
- YouTube: https://www.youtube.com/@EduCore-vid
- Inne profile: nie ma, mozesz dac placeholdery
- Obszar zajęć stacjonarnych: woj. Dolnośląskie zdalnie: cała Polska
- Doświadczenie założyciela: korepetycje od 2018, nauczyciel matematyki i informatyki w liceum, 100+ uczniów przygotowanych do matury z matematyki oraz informatyki

- Oferta:
Tutaj do dopracowania ale chcemy docelowo mieć głównie: matematyka, informatyka, angielski, polski, fizyka

- Ceny pakietów: do uzupełnienia

**Zasada nadrzędna: niczego nie zmyślaj.** Żadnych wymyślonych opinii, wyników, liczb uczniów, nazwisk ani certyfikatów. Tam, gdzie potrzebna jest treść, której nie podałem zadaj mi pytanie co wstawić.

---

## 2. Stack i hosting

- zwykly html/css/js, ma działać tak że żeby mieć podgląd strony odpalam po prostu index.html czy inne pliki .html
- Hosting: GitHub Pages z własną domeną ale to na przyszłość
- Formularz kontaktowy: zewnętrzna usługa działająca bez backendu (np. Formspree)
- Zero zbędnych bibliotek. Bez jQuery, bez dużych frameworków UI, bez page builderów.

Git i GitHub obsługuję wyłącznie ręcznie. Nie inicjalizuj repozytorium, nie rób commitów, pushy ani zmian w ustawieniach GitHuba. Przygotuj tylko plik .github/workflows/deploy.yml do publikacji na GitHub Pages oraz .gitignore, a w README opisz krok po kroku, co mam kliknąć w ustawieniach repozytorium (Settings → Pages → Source: GitHub Actions) i jak wygląda publikacja po moim pushu.

---

## 3. Struktura strony i adresy URL

Krótkie adresy po polsku, bez polskich znaków, małe litery, myślniki, spójny ukośnik na końcu (wybierz jedną konwencję i trzymaj się jej).

- `/` — strona główna
- `/oferta/` - tutaj opis wszystkich przedmiotów których nauczamy
- `/oferta/matematyka/`
- `/oferta/polski/`
- `/oferta/angielski/`
- `/oferta/fizyka/`
- `/oferta/informatyka/`
- `/kurs-maturalny-grupowy/`
- `/cennik/`
- `/metoda/` — jak wygląda współpraca: diagnoza, plan, zajęcia, raporty dla rodziców
- `/wyniki-i-opinie/`
- `/faq/`
- `/blog/` + wpisy `/blog/[slug]/` — rozwiązania zadań maturalnych, poradniki
- `/kontakt/`
- `/o-nas/`
- `/zespol/` — przygotuj szablon, ale nie publikuj w menu (w przyszłości będą tu korepetytorzy EduCore, każdy z własnym profilem `/zespol/[imie-nazwisko]/`)
- `/regulamin/`, `/polityka-prywatnosci/`
- strona 404 z linkami do najważniejszych sekcji

---

## 4. SEO techniczne (wszystko od pierwszego commita)

- Każda strona: unikalny `<title>` (do ~60 znaków, fraza na początku, marka na końcu) i `meta description` (do ~155 znaków, z wezwaniem do działania).
- Dokładnie jeden `<h1>` na stronę, logiczna hierarchia nagłówków h2–h3.
- `<html lang="pl">`, semantyczny HTML5 (`header`, `nav`, `main`, `article`, `section`, `footer`).
- Tag `canonical` na każdej stronie, absolutne adresy (tutaj url jak bedzie).
- `sitemap.xml` generowany automatycznie (z `lastmod`), `robots.txt` z linkiem do sitemapy.
- Open Graph i Twitter Cards dla każdej strony, z domyślnym obrazkiem OG 1200×630 i możliwością nadpisania dla wpisów.
- Breadcrumbs widoczne na stronie + dane strukturalne `BreadcrumbList`.
- Linkowanie wewnętrzne: każda podstrona usługi linkuje do cennika, kontaktu, FAQ i powiązanych wpisów na blogu; wpisy linkują do usług.
- Obrazy: AVIF/WebP z fallbackiem, `width`/`height`, `alt` po polsku, lazy loading poniżej pierwszego ekranu, opisowe nazwy plików.
- Brak treści dostępnych tylko po wykonaniu JavaScriptu.
- Przekierowania 301 z www na wersję bez www i z http na https.
- **Tryb przedpremierowy:** dopóki strona działa pod adresem roboczym (np. github.io), ma mieć `noindex` w meta i blokadę w robots.txt. Przełączenie na indeksowanie ma się robić jedną zmienną środowiskową przy starcie na [jeszcze nie mamy domeny]. Opisz to w README.

### Dane strukturalne (JSON-LD, zwalidowane w Rich Results Test i validator.schema.org)

- `EducationalOrganization` + `LocalBusiness` dla EduCore: nazwa, logo, URL, telefon, e-mail, `areaServed` (Wrocław, Legnica, Polska — online), `sameAs` (YouTube, Google Business, social media), `founder`.
  - Adres wirtualnej siedziby spółki **nie** idzie do danych LocalBusiness (zajęcia nie odbywają się pod tym adresem) — pokazuj go tylko w danych prawnych spółki w stopce.
- `Person` dla mnie: imię i nazwisko, stanowisko, `knowsAbout` (matematyka, matura, informatyka, Python, C++, SQL), `worksFor`, `sameAs`.
- `Service` lub `Course` dla każdej usługi i kursu (z `provider`, `offers` i ceną, gdy jest podana).
- `FAQPage` na stronach z FAQ.
- `Article`/`BlogPosting` dla wpisów: autor (link do `/o-nas/`), `datePublished`, `dateModified`.
- `VideoObject` dla osadzonych filmów z YouTube.
- **Nie dodawaj** `AggregateRating` ani `Review` wystawionych samemu sobie — Google tego nie wyświetla i może to uznać za spam. Opinie pokazuj normalnie w treści, z linkiem do profilu Google.

---

## 5. GEO — optymalizacja pod modele AI

Cel: żeby modele AI, pytane np. „dobre korepetycje z matematyki rozszerzonej we Wrocławiu” albo „jak się przygotować do matury z informatyki”, znały EduCore, rozumiały, czym jest, i polecały ją lub cytowały.

- **Spójna encja:** wszędzie ta sama nazwa „EduCore”, ten sam opis jednym zdaniem, to samo imię i nazwisko założyciela, te same dane kontaktowe. Na stronie głównej i w `/o-nas/` umieść jasny, faktograficzny akapit „Czym jest EduCore” (kto, co, dla kogo, gdzie, od kiedy, czym się wyróżnia) — tak, żeby model mógł go zacytować w całości.
- **Najpierw odpowiedź:** każda podstrona i wpis zaczyna się od 2–3 zdań, które bezpośrednio odpowiadają na główne pytanie strony, a dopiero potem rozwija temat.
- **Treści do cytowania:** konkretne liczby i fakty (czas trwania kursu, liczba osób w grupie, liczba godzin, zakres materiału, terminy matur), tabele porównawcze (np. poziom podstawowy vs rozszerzony, 1:1 vs grupa), listy kroków, definicje.
- **Sekcje FAQ** pisane pytaniami, które ludzie naprawdę zadają (po polsku, językiem ucznia i rodzica), z krótką odpowiedzią w pierwszym zdaniu.
- **E-E-A-T:** każdy wpis podpisany przeze mnie, z krótką notką o autorze i linkiem do `/o-nas/`; widoczne daty publikacji i aktualizacji; odwołania do źródeł oficjalnych (CKE, informatory maturalne).
- **Crawlery AI:** robots.txt jawnie wpuszcza GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, PerplexityBot, Google-Extended, Applebot-Extended i Bingbot.
- **`/llms.txt`** (oraz opcjonalnie `/llms-full.txt`): zwięzły opis EduCore w Markdown z listą najważniejszych stron i krótkim opisem każdej.
- **Bing:** przygotuj obsługę IndexNow i plik weryfikacyjny Bing Webmaster Tools (wyszukiwarki AI w dużej mierze korzystają z indeksu Binga).
- Cała treść dostępna w czystym HTML, bez ukrywania w zakładkach ładowanych JavaScriptem.

---

## 6. Wydajność i dostępność

- Cel: Lighthouse 95+ we wszystkich kategoriach na mobile; Core Web Vitals: LCP < 2,5 s, INP < 200 ms, CLS < 0,1.
- Fonty hostowane lokalnie (bez Google Fonts z zewnętrznego serwera — to też kwestia RODO), `font-display: swap`, maksymalnie 2 rodziny.
- Filmy z YouTube jako „fasada” (miniatura + przycisk, odtwarzacz ładuje się dopiero po kliknięciu), domena youtube-nocookie.com.
- WCAG 2.2 AA: kontrast, widoczny focus, obsługa klawiaturą, etykiety pól formularza, `prefers-reduced-motion`, poprawne teksty linków (bez „kliknij tutaj”).
- Mobile first — większość rodziców i uczniów wejdzie z telefonu.

---

## 7. Konwersja (strona ma zbierać zapytania, nie tylko ładnie wyglądać)

- Jedno główne wezwanie do działania w całym serwisie: **„Umów bezpłatną konsultację”** (15–20 min). 
- Na telefonie przyklejony pasek z przyciskami „Zadzwoń” i „Napisz”.
- Krótki formularz: imię, e-mail lub telefon, kto pisze (uczeń/rodzic), klasa, przedmiot i poziom, cel (np. wynik na maturze), preferowana forma (stacjonarnie/online), wiadomość. Po wysłaniu — strona podziękowania z informacją, kiedy się odezwę.
- Ceny widoczne na stronie (pakiety miesięczne), bez „cena do uzgodnienia”.
- Elementy zaufania przy CTA: doświadczenie, wyniki uczniów, opinie, informacja o liczbie wolnych miejsc w grupie (łatwo edytowalna zmienna).
- Sekcja „Jak zacząć” w 3 krokach: konsultacja → diagnoza poziomu → plan i zajęcia.
- Sekcja dla rodziców: raporty postępów, kontakt, bezpieczeństwo, przejrzyste zasady płatności i odwoływania zajęć.

---

## 8. RODO i wymogi prawne

- Stopka z pełnymi danymi spółki zgodnie z art. 206 KSH: firma spółki, siedziba i adres, sąd rejestrowy, numer KRS, NIP, wysokość kapitału zakładowego. Marka EduCore jako nazwa handlowa.
- Polityka prywatności i regulamin jako szablony z miejscami do uzupełnienia (zaznacz wyraźnie, że wymagają sprawdzenia przez prawnika).
- Formularz: obowiązkowy checkbox ze zgodą na przetwarzanie danych w celu kontaktu i link do polityki prywatności; informacja, że w przypadku osoby poniżej 16 lat formularz powinien wypełnić rodzic lub opiekun.
- Analityka bez cookies, niewymagająca banera zgód (np. Plausible lub Umami). Jeśli zaproponujesz Google Analytics 4, to tylko z bannerem zgód i Consent Mode v2 — opisz kompromis i zostaw decyzję mnie.
- Zdarzenia analityczne: wysłanie formularza, kliknięcie telefonu i e-maila.

---

## 9. Treści startowe

- Napisz po polsku pełne teksty wszystkich stron (ton: konkretny, ciepły, ekspercki, bez korpomowy i bez przesadnych obietnic typu „gwarantujemy 100%”). Zwracaj się do dwóch grup: ucznia i rodzica.
- Przygotuj 5 pierwszych wpisów na blog (pełne teksty, na podstawie aktualnych wymagań CKE dla matury w formule 2023), np.:
  1. Jak przygotować się do matury rozszerzonej z matematyki w 6 miesięcy — plan tydzień po tygodniu
  2. Matura z informatyki: Python czy C++? Co wybrać i dlaczego
  3. Najczęstsze błędy na maturze z matematyki i jak ich uniknąć
  4. Ile kosztują korepetycje z matematyki we Wrocławiu i jak wybrać korepetytora
  5. Korepetycje online czy stacjonarne — co daje lepsze wyniki
- Zaproponuj listę 20 kolejnych tematów wpisów pod frazy, które ludzie wpisują w Google i zadają modelom AI.
- Teksty o mnie, wynikach i opiniach zostaw z miejscami `[DO UZUPEŁNIENIA]`.

---

## 10. Wygląd

- Nowoczesny, czysty, wiarygodny — ma budzić zaufanie rodzica, a jednocześnie nie odstraszać licealisty. Bez stockowych zdjęć uśmiechniętych ludzi przy laptopach; miejsce na moje prawdziwe zdjęcia.
- Przygotuj prosty system kolorów i typografii w zmiennych CSS, żebym mógł łatwo podmienić kolory marki.

---

## 11. Czego oczekuję na koniec

1. Działający projekt z instrukcją uruchomienia.
2. Komunikaty co robiłeś itd.
3. **README po polsku**: jak dodać wpis na blog, jak zmienić ceny i liczbę wolnych miejsc, jak dodać opinię, jak przełączyć stronę z trybu przedpremierowego na indeksowany.
4. Raport z Lighthouse i wynik walidacji danych strukturalnych.
5. **Checklista po starcie**, krok po kroku:
   - podpięcie domeny [jeszcze nie wiemy jaka domena] i HTTPS,
   - wyłączenie trybu przedpremierowego,
   - Google Search Console: weryfikacja i zgłoszenie sitemapy,
   - Bing Webmaster Tools: weryfikacja, sitemap, IndexNow,
   - powiązanie strony z profilem Google Business (ten sam NAP),
   - test w Rich Results Test i PageSpeed Insights,
   - dodanie linku do strony na YouTube i w social mediach.
6. Lista wszystkich miejsc `[DO UZUPEŁNIENIA]` z opisem, co tam wpisać.

Pracuj etapami i po każdym większym etapie (struktura → strony usług → blog → SEO/GEO → testy) pokaż mi, co jest gotowe.


obszar zajec stacjonarnych woj dolnoslaskie, google business profile nie ma, kapital zakladowy i sad rejestrowy pomijamy

Ja ucze matematyki i informatyki, reszty uczą na razie wpisz zmyślone osoby. Poziomy SP, SP egz 8kl, szkola srednia, matura, studia. Kurs grupowy na razie niech bedzie pusty. Ceny na razie daj byle jakie pozniej sobie zmienie. Zasady dla rodziców - na razie tutaj daj lorem ipsum pozniej zmienie. Czas odpowiedzi dowolny

Informacje o mnie sobie pozniej uzupelnie, tak samo wyniki i opinie i wolne miejsca. Daj tutaj placeholdery tak samo jak do filmów z YT.

Wyglądu na razie nie mam, zrób sam i zdjęć tez nie mam

Repo będzie się nazywać ws-educore. Co do punktów 19/20 to strona na razie jest w fazie budowania wiec tutaj nie robimy jeszcze tak do konca. Research do bloga - bierz informacje skad chcesz ja najwyzej pozniej je poprawie

konwencja url to male litery bez polskich znakow

na razie strone odpalam tylko lokalnie dla siebie, JESTESMY NA ETAPIE BUDOWY
