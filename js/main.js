(function () {
  "use strict";

  /* ---------- Footer copyright year ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Mobile nav toggle ---------- */
  var toggle = document.querySelector("[data-nav-toggle]");
  var nav = document.getElementById("primary-nav");

  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });

    nav.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && nav.classList.contains("is-open")) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });

    // Close the mobile menu if the viewport is widened past the breakpoint.
    var mq = window.matchMedia("(min-width: 861px)");
    var handleBreakpoint = function (e) {
      if (e.matches) {
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    };
    if (mq.addEventListener) mq.addEventListener("change", handleBreakpoint);
  }

  /* ---------- Cookie / privacy notice (UK GDPR) ---------- */
  var CONSENT_KEY = "westmere_cookie_consent";
  var banner = document.getElementById("cookie-banner");

  if (banner) {
    var stored = null;
    try { stored = window.localStorage.getItem(CONSENT_KEY); } catch (e) { /* storage unavailable */ }

    if (!stored) {
      banner.hidden = false;
    }

    var acceptBtn = banner.querySelector("[data-cookie-accept]");
    var essentialBtn = banner.querySelector("[data-cookie-essential]");

    function dismiss(value) {
      banner.hidden = true;
      try { window.localStorage.setItem(CONSENT_KEY, value); } catch (e) { /* storage unavailable */ }
    }

    if (acceptBtn) acceptBtn.addEventListener("click", function () { dismiss("accepted"); });
    if (essentialBtn) essentialBtn.addEventListener("click", function () { dismiss("essential-only"); });
  }

  /* ---------- Enquiry / referral / contact forms ---------- */
  // Progressive enhancement only: forms work via a normal POST (e.g. to Formspree)
  // even if this script fails to load. When JS is available, we intercept submission
  // to show an inline confirmation instead of a full page redirect.
  var forms = document.querySelectorAll("[data-ajax-form]");

  forms.forEach(function (form) {
    form.addEventListener("submit", function (event) {
      // Honeypot check: if the hidden field has been filled in, silently
      // pretend to succeed without ever contacting the form endpoint.
      var honeypot = form.querySelector('[name="_gotcha"]');
      if (honeypot && honeypot.value) {
        event.preventDefault();
        showFormSuccess(form);
        form.reset();
        return;
      }

      var endpoint = form.getAttribute("action") || "";
      if (endpoint.indexOf("YOUR_FORM_ID") !== -1) {
        // Form endpoint has not been configured yet — let it submit normally
        // (it will simply fail), rather than pretending it worked.
        return;
      }

      event.preventDefault();
      var formData = new FormData(form);
      var submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Sending…"; }

      fetch(endpoint, {
        method: "POST",
        body: formData,
        headers: { Accept: "application/json" },
      })
        .then(function (response) {
          if (response.ok) {
            showFormSuccess(form);
            form.reset();
          } else {
            showFormError(form);
          }
        })
        .catch(function () {
          showFormError(form);
        })
        .finally(function () {
          if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = submitBtn.dataset.label || "Send"; }
        });
    });
  });

  function showFormSuccess(form) {
    clearFormMessages(form);
    var msg = document.createElement("div");
    msg.className = "form-success";
    msg.setAttribute("role", "status");
    msg.tabIndex = -1;
    msg.textContent = "Thank you — your message has been sent. We aim to respond within one working day.";
    form.parentNode.insertBefore(msg, form);
    msg.focus();
  }

  function showFormError(form) {
    clearFormMessages(form);
    var msg = document.createElement("div");
    msg.className = "form-success";
    msg.style.background = "#fbe9e7";
    msg.style.borderColor = "#e0a89e";
    msg.style.color = "#7a2e1f";
    msg.setAttribute("role", "alert");
    msg.tabIndex = -1;
    msg.textContent = "Sorry, something went wrong sending your message. Please try again, or contact us by phone.";
    form.parentNode.insertBefore(msg, form);
    msg.focus();
  }

  function clearFormMessages(form) {
    var existing = form.parentNode.querySelectorAll(".form-success");
    existing.forEach(function (el) { el.remove(); });
  }
})();
