/* EduCore — main.js
   Cała treść strony jest w HTML. Ten skrypt dodaje tylko wygodę:
   1) podgląd z dysku (file://) — dopisuje index.html do linków,
   2) menu mobilne, 3) fasada YouTube, 4) wysyłka formularza,
   5) zdarzenia analityczne (formularz, telefon, e-mail). */
(function () {
  "use strict";

  var isFile = location.protocol === "file:";

  /* ---------- 1. Podgląd lokalny: "oferta/" -> "oferta/index.html" ---------- */
  function fixLocalHref(href) {
    if (!href || /^([a-z]+:|#|\/\/)/i.test(href)) return href;
    var hash = "";
    var i = href.indexOf("#");
    if (i > -1) { hash = href.slice(i); href = href.slice(0, i); }
    if (href === "" ) return href + hash;
    if (href.slice(-1) === "/") href += "index.html";
    else if (href === "." || href === "..") href += "/index.html";
    return href + hash;
  }
  if (isFile) {
    document.querySelectorAll("a[href]").forEach(function (a) {
      a.setAttribute("href", fixLocalHref(a.getAttribute("href")));
    });
  }

  /* ---------- 5 (helper). Analityka bez cookies: Umami lub Plausible ---------- */
  function track(name, props) {
    try {
      if (window.umami && typeof window.umami.track === "function") window.umami.track(name, props);
      else if (typeof window.plausible === "function") window.plausible(name, { props: props });
    } catch (e) { /* analityka nie może psuć strony */ }
  }
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var href = a.getAttribute("href") || "";
    var where = a.getAttribute("data-track") || location.pathname;
    if (href.indexOf("tel:") === 0) track("Klik telefon", { miejsce: where });
    else if (href.indexOf("mailto:") === 0) track("Klik e-mail", { miejsce: where });
  });

  /* ---------- 2. Menu mobilne ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var nav = document.getElementById("site-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ---------- 3. YouTube — fasada (odtwarzacz dopiero po kliknięciu) ---------- */
  document.querySelectorAll(".yt[data-yt-id]").forEach(function (box) {
    var btn = box.querySelector(".yt__btn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var id = box.getAttribute("data-yt-id");
      var title = box.getAttribute("data-yt-title") || "Film EduCore";
      var iframe = document.createElement("iframe");
      iframe.src = "https://www.youtube-nocookie.com/embed/" + encodeURIComponent(id) + "?autoplay=1&rel=0";
      iframe.title = title;
      iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture";
      iframe.allowFullscreen = true;
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      box.innerHTML = "";
      box.appendChild(iframe);
      iframe.focus();
      track("Odtworzenie filmu", { film: title });
    });
  });

  /* ---------- 4. Formularz kontaktowy (Formspree, bez backendu) ---------- */
  var form = document.querySelector("form[data-contact-form]");
  if (form) {
    var status = form.querySelector(".form__status");
    form.addEventListener("submit", function (e) {
      // walidacja: e-mail LUB telefon
      var email = form.querySelector("[name=email]");
      var phone = form.querySelector("[name=telefon]");
      if (email && phone && !email.value.trim() && !phone.value.trim()) {
        e.preventDefault();
        status.textContent = "Podaj e-mail lub numer telefonu, żebyśmy mogli odpowiedzieć.";
        status.className = "form__status form__status--error full";
        email.focus();
        return;
      }
      if (form.action.indexOf("[DO_UZUPELNIENIA]") > -1) {
        e.preventDefault();
        status.textContent = "Formularz nie jest jeszcze podłączony (brak adresu Formspree w site.config.json).";
        status.className = "form__status form__status--error full";
        return;
      }
      e.preventDefault();
      var btn = form.querySelector("[type=submit]");
      btn.disabled = true;
      status.textContent = "Wysyłanie…";
      status.className = "form__status full";
      fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } })
        .then(function (r) {
          if (!r.ok) throw new Error("HTTP " + r.status);
          track("Wysłanie formularza", { przedmiot: (form.querySelector("[name=przedmiot]") || {}).value || "" });
          var next = form.getAttribute("data-success") || "dziekujemy/";
          location.href = isFile ? fixLocalHref(next) : next;
        })
        .catch(function () {
          btn.disabled = false;
          status.textContent = "Nie udało się wysłać wiadomości. Spróbuj ponownie lub napisz bezpośrednio na adres e-mail podany obok.";
          status.className = "form__status form__status--error full";
        });
    });
  }
})();
