const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const mobileNav = document.querySelector("[data-mobile-nav]");
const year = document.querySelector("[data-year]");
const progress = document.querySelector("[data-progress]");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (year) {
  year.textContent = String(new Date().getFullYear());
}

const setMenuOpen = (open) => {
  if (!navToggle || !mobileNav) return;
  navToggle.setAttribute("aria-expanded", String(open));
  mobileNav.classList.toggle("is-open", open);
  mobileNav.hidden = !open;
};

if (navToggle && mobileNav) {
  mobileNav.hidden = true;
  navToggle.addEventListener("click", () => {
    const open = navToggle.getAttribute("aria-expanded") === "true";
    setMenuOpen(!open);
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
  });
});

const onScroll = () => {
  const y = window.scrollY || 0;
  if (header) header.classList.toggle("is-scrolled", y > 10);

  if (progress) {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const value = max > 0 ? (y / max) * 100 : 0;
    progress.style.width = `${Math.min(100, Math.max(0, value))}%`;
  }

  if (!reduceMotion) {
    document.querySelectorAll("[data-parallax]").forEach((img) => {
      const rect = img.getBoundingClientRect();
      const center = rect.top + rect.height / 2 - window.innerHeight / 2;
      const shift = Math.max(-18, Math.min(18, center * -0.04));
      img.style.transform = `scale(1.08) translate3d(0, ${shift}px, 0)`;
    });
  }
};

onScroll();
window.addEventListener("scroll", onScroll, { passive: true });
window.addEventListener("resize", onScroll);

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
    { threshold: 0.14, rootMargin: "0px 0px -10% 0px" }
  );
  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}
