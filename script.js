const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const year = document.querySelector("[data-year]");
const progress = document.querySelector("[data-progress]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (year) year.textContent = String(new Date().getFullYear());

const setMenuOpen = (open) => {
  if (!navToggle || !mobileNav) return;
  navToggle.setAttribute("aria-expanded", String(open));
  mobileNav.classList.toggle("is-open", open);
  mobileNav.hidden = !open;
};

if (navToggle && mobileNav) {
  mobileNav.hidden = true;
  navToggle.addEventListener("click", () => {
    setMenuOpen(navToggle.getAttribute("aria-expanded") !== "true");
  });
  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setMenuOpen(false));
  });
}

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener("click", (event) => {
    const id = link.getAttribute("href");
    if (!id || id === "#") return;
    const target = document.querySelector(id);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "start" });
    history.pushState(null, "", id);

    document.querySelectorAll(".nav a").forEach((item) => {
      item.classList.toggle("is-active", item.getAttribute("href") === id);
    });
  });
});

const onScroll = () => {
  const y = window.scrollY || 0;
  if (header) header.classList.toggle("is-scrolled", y > 8);
  if (progress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    progress.style.width = `${max > 0 ? Math.min(100, (y / max) * 100) : 0}%`;
  }
};

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const revealItems = document.querySelectorAll(".reveal");
if (!reduceMotion && "IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  revealItems.forEach((el) => observer.observe(el));
} else {
  revealItems.forEach((el) => el.classList.add("is-visible"));
}
