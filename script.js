// Set CONTACT_EMAIL to send the form via e-mail instead of Instagram DM.
const CONTACT_EMAIL = "";
const INSTAGRAM_USER = "6d_pro__hair_extensiondk";

// Mobile menu
const burger = document.getElementById("burger");
const nav = document.getElementById("nav");

function setMenu(open) {
  nav.classList.toggle("is-open", open);
  burger.setAttribute("aria-expanded", String(open));
  burger.setAttribute("aria-label", open ? "Luk menu" : "Åbn menu");
}
burger.addEventListener("click", () => setMenu(!nav.classList.contains("is-open")));
nav.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

// Header shadow on scroll
const header = document.querySelector(".header");
const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 10);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Play result videos only while visible, unless the visitor paused them
const videos = document.querySelectorAll(".results video");
const videoToggle = document.getElementById("video-toggle");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if ("IntersectionObserver" in window && !reduceMotion) {
  const visible = new Set();
  let paused = false;
  const vio = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        visible.add(e.target);
        if (!paused) e.target.play().catch(() => {});
      } else {
        visible.delete(e.target);
        e.target.pause();
      }
    }),
    { threshold: 0.4 }
  );
  videos.forEach((v) => vio.observe(v));
  videoToggle.addEventListener("click", () => {
    paused = !paused;
    videoToggle.textContent = paused ? "Afspil videoer" : "Pause videoer";
    visible.forEach((v) => (paused ? v.pause() : v.play().catch(() => {})));
  });
} else {
  videos.forEach((v) => { v.controls = true; });
  videoToggle.hidden = true;
}

// Contact form
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
if (CONTACT_EMAIL) document.getElementById("form-submit").textContent = "Send via e-mail";

const fieldErrors = {
  navn: "Skriv dit navn.",
  email: "Skriv en gyldig e-mail, fx navn@mail.dk.",
};

// Shows (or clears) the error under a field, inside its label.
function setFieldError(field, message) {
  let el = field.parentElement.querySelector(".form__error");
  field.classList.toggle("is-invalid", Boolean(message));
  if (!message) {
    el?.remove();
    field.removeAttribute("aria-invalid");
    return;
  }
  if (!el) {
    el = document.createElement("span");
    el.className = "form__error";
    field.after(el);
  }
  el.textContent = message;
  field.setAttribute("aria-invalid", "true");
}

form.addEventListener("input", (e) => {
  if (e.target.classList.contains("is-invalid") && e.target.checkValidity()) setFieldError(e.target, "");
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const invalid = [...form.querySelectorAll("[required]")].filter((field) => !field.checkValidity());
  form.querySelectorAll("[required]").forEach((field) => {
    setFieldError(field, invalid.includes(field) ? fieldErrors[field.name] : "");
  });
  if (invalid.length) {
    status.textContent = "Ret de markerede felter.";
    invalid[0].focus();
    return;
  }

  const d = new FormData(form);
  const message =
    `Hej 6D Pro! Jeg vil gerne høre om: ${d.get("emne")} (${d.get("by")}).\n\n` +
    `Navn: ${d.get("navn")}\n` +
    `E-mail: ${d.get("email")}\n` +
    (d.get("telefon") ? `Telefon: ${d.get("telefon")}\n` : "") +
    (d.get("besked") ? `\n${d.get("besked")}` : "");

  if (CONTACT_EMAIL) {
    const subject = encodeURIComponent(`Forespørgsel: ${d.get("emne")}`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${encodeURIComponent(message)}`;
    status.textContent = "Tak! Dit mailprogram åbner nu med din besked.";
    return;
  }

  // Start the copy and open the chat right away, inside the click: browsers
  // (Safari especially) block a window opened after waiting on the clipboard.
  const copied = navigator.clipboard ? navigator.clipboard.writeText(message) : Promise.reject();
  window.open(`https://ig.me/m/${INSTAGRAM_USER}`, "_blank", "noopener");
  copied.then(
    () => { status.textContent = "Tak! Din besked er kopieret – indsæt den i vores Instagram-chat, som åbner nu."; },
    () => { status.textContent = "Tak! Skriv til os i Instagram-chatten, som åbner nu."; }
  );
});

document.getElementById("year").textContent = new Date().getFullYear();
