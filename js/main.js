(() => {
  const topbar = document.getElementById("topbar");
  const reveals = document.querySelectorAll(".reveal");

  const onScroll = () => {
    if (topbar) topbar.classList.toggle("is-solid", window.scrollY > 24);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("is-in"));
  }

  requestAnimationFrame(() => {
    document.querySelectorAll(".hero .reveal").forEach((el) => el.classList.add("is-in"));
  });

  // Soft parallax on route images
  const cards = document.querySelectorAll("[data-parallax] img");
  if (cards.length && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    window.addEventListener(
      "scroll",
      () => {
        const vh = window.innerHeight;
        cards.forEach((img) => {
          const rect = img.parentElement.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > vh) return;
          const progress = (vh / 2 - (rect.top + rect.height / 2)) / vh;
          img.style.transform = `translate3d(0, ${progress * 18}px, 0) scale(1.08)`;
        });
      },
      { passive: true }
    );
  }
})();
