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

// Reveal on scroll
const revealTargets = document.querySelectorAll(
  ".section__head, .split__media, .split__text, .card, .step, .results figure, .product, .b2b__item, .faq details, .contact > *"
);
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("is-visible");
        io.unobserve(e.target);
      }
    }),
    { threshold: 0.12 }
  );
  revealTargets.forEach((el) => { el.classList.add("reveal"); io.observe(el); });
}

// Play result videos only while visible
const videos = document.querySelectorAll(".results video");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
if ("IntersectionObserver" in window && !reduceMotion) {
  const vio = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) e.target.play().catch(() => {});
      else e.target.pause();
    }),
    { threshold: 0.4 }
  );
  videos.forEach((v) => vio.observe(v));
} else {
  videos.forEach((v) => { v.controls = true; });
}

// Contact form
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  let valid = true;
  form.querySelectorAll("[required]").forEach((field) => {
    const ok = field.checkValidity();
    field.classList.toggle("is-invalid", !ok);
    if (!ok) valid = false;
  });
  if (!valid) {
    status.textContent = "Udfyld venligst navn og en gyldig e-mail.";
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

  try {
    await navigator.clipboard.writeText(message);
    status.textContent = "Tak! Din besked er kopieret – indsæt den i vores Instagram-chat, som åbner nu.";
  } catch {
    status.textContent = "Tak! Skriv til os i Instagram-chatten, som åbner nu.";
  }
  window.open(`https://ig.me/m/${INSTAGRAM_USER}`, "_blank", "noopener");
});

document.getElementById("year").textContent = new Date().getFullYear();
