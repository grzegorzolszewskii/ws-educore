# Lista miejsc do uzupełnienia

Na stronie placeholdery są widoczne jako **żółte znaczniki** (`[DO UZUPEŁNIENIA]`, `[NUMER]`, `[E-MAIL]`, `[PRZYKŁADOWA OSOBA]`). Wyszukasz je w edytorze frazą `[DO UZUP`, `[PRZYKŁ` lub `todo`.

## A. `site.config.json` (po zmianie uruchom `aktualizuj.bat`)

| Pole | Co wpisać | Gdzie się pojawi |
|---|---|---|
| `phone` | numer telefonu, np. `+48 600 000 000` | stopka, pasek mobilny, kontakt, regulamin, „Dziękujemy”, JSON-LD |
| `email` | adres e-mail, np. `kontakt@twojadomena.pl` | stopka, kontakt, polityka prywatności, regulamin, JSON-LD |
| `freeSlots` | liczba wolnych miejsc na zajęcia indywidualne, np. `3` | strona główna, CTA na wszystkich stronach usług |
| `freeSlotsGroup` | wolne miejsca w kursie grupowym | `/kurs-maturalny-grupowy/` |
| `formEndpoint` | adres formularza z Formspree | formularz w `/kontakt/` |
| `analytics` | Umami lub Plausible (README, sekcja 7) | wszystkie strony |
| `social.facebook`, `instagram`, `tiktok` | adresy profili (puste = ukryte w danych, widoczny placeholder w stopce) | stopka, `sameAs` |
| `social.linkedinFounder` | profil LinkedIn Grzegorza | `sameAs` osoby |
| `social.googleBusiness` | link do profilu Google | `sameAs` |
| `verification.google`, `bing` | kody weryfikacyjne | meta tagi, `BingSiteAuth.xml` |
| `siteUrl` | docelowa domena (po starcie) | canonical, OG, JSON-LD w plikach źródłowych |

## B. Treści o Tobie i wynikach

| Plik | Co uzupełnić |
|---|---|
| `o-nas/index.html` | wykształcenie; 3–5 zdań o podejściu do uczniów; certyfikaty/osiągnięcia (tylko prawdziwe); zdjęcie (format 4:5) |
| `oferta/matematyka/`, `oferta/informatyka/` | zdjęcie; w matematyce 1–2 zdania o wykształceniu i podejściu |
| `zespol/index.html` | Twoje zdjęcie |
| `wyniki-i-opinie/index.html` | średnie wyniki z matury (matematyka PR, informatyka), tabela wyników uczniów (za zgodą), 4 opinie z imieniem i źródłem, link do profilu Google |
| `index.html` | 3 opinie w sekcji „Co mówią uczniowie i rodzice”; ID filmu YouTube (README → „Jak dodać film”) |

## C. Przykładowe osoby (do podmiany na prawdziwych korepetytorów)

| Osoba (fikcyjna) | Przedmiot | Gdzie występuje |
|---|---|---|
| Anna Kowalczyk | angielski | `oferta/angielski/`, `oferta/index.html`, `zespol/index.html` |
| Magdalena Wiśniewska | polski | `oferta/polski/`, `oferta/index.html`, `zespol/index.html` |
| Tomasz Zieliński | fizyka | `oferta/fizyka/`, `oferta/index.html`, `zespol/index.html` |

Dla każdej prawdziwej osoby: wykształcenie, doświadczenie, certyfikaty, zdjęcie. Profil utwórz z `zespol/szablon-profilu/` (instrukcja w komentarzu w pliku) i odkomentuj tam dane `Person`.

## D. Zasady dla rodziców (teraz lorem ipsum)

| Plik | Sekcja |
|---|---|
| `index.html` | „Co rodzic wie o zajęciach” — 4 karty: raporty, kontakt, bezpieczeństwo, płatności i odwoływanie |
| `metoda/index.html` | „Dla rodziców: raporty, kontakt, bezpieczeństwo” — 4 akapity |
| `cennik/index.html` | „Zasady płatności i odwoływania zajęć” — płatności, odwoływanie, faktury |
| `faq/index.html` | 2 pytania: „Jak wygląda płatność i odwoływanie zajęć?”, „Czy mogę porozmawiać z prowadzącym…?” (po uzupełnieniu trafią automatycznie do FAQPage) |
| `regulamin/index.html` | § 3 (forma potwierdzenia umowy), § 5 (płatności), § 6 (odwoływanie), § 10 |

## E. Cennik (teraz ceny przykładowe)

`cennik/index.html`: ceny pakietów, tabela stawek **i** blok JSON-LD na górze pliku; usuń żółtą ramkę „Ceny przykładowe”; uzupełnij cenę i liczbę osób w kursie grupowym w tabeli porównania. Popraw też podsumowania cen w `faq/index.html` i w pierwszym akapicie cennika (README → „Zmiana cen”).

## F. Kurs maturalny grupowy

`kurs-maturalny-grupowy/index.html`: przedmiot i poziom, liczba osób w grupie, czas trwania, liczba godzin, forma, cena, program, dla kogo, harmonogram; odkomentuj szablon danych `Course` w `<head>`. Uzupełnij też wiersz „Dostępność” w tabeli w `oferta/index.html`.

## G. Dokumenty prawne (wymagają sprawdzenia przez prawnika)

| Plik | Co uzupełnić |
|---|---|
| `polityka-prywatnosci/index.html` | data wersji; okres przechowywania zapytań (teraz [12 miesięcy]); okres danych analitycznych; dostawca analityki, poczty, biuro rachunkowe; podstawa transferu danych do USA (Formspree, GitHub) |
| `regulamin/index.html` | data wersji i punkty z sekcji D; weryfikacja § 7 (odstąpienie od umowy) |
| stopka (`tools/sync-layout.mjs`, funkcja `footer`) | sąd rejestrowy i kapitał zakładowy — wymagane przez art. 206 KSH |

## H. Do weryfikacji (treści oparte na researchu)

| Plik | Co sprawdzić |
|---|---|
| `blog/ile-kosztuja-korepetycje-z-matematyki-wroclaw/` | widełki cen rynkowych we Wrocławiu (oznaczone `[DO WERYFIKACJI]`) |
| strony matematyki, informatyki, polskiego, FAQ, `llms-full.txt`, wpisy blogowe | terminy matury 2027 (PP mat. 5.05, PR mat. 11.05, informatyka 17.05, wyniki 9.07.2027) i parametry egzaminów (czas, punkty) — porównaj z harmonogramem i informatorami na cke.gov.pl |
| `oferta/informatyka/`, wpis Python vs C++ | lista dozwolonych języków programowania w aktualnym komunikacie CKE |
| `metoda/index.html` | opis etapów współpracy (diagnoza, plan, zajęcia) — czy zgadza się z tym, jak faktycznie pracujesz |
| `cennik/index.html` | opis pakietów (np. „raport dla rodzica”, „arkusze CKE”) — czy pasuje do docelowej oferty |
