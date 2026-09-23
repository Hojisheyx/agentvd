(() => {
  const revealAll = () => {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-in"));
  };

  const reveals = document.querySelectorAll(".reveal");

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
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    reveals.forEach((el) => io.observe(el));
    // Ensure above-the-fold content appears even if IO is delayed
    requestAnimationFrame(() => {
      document.querySelectorAll(".hero .reveal").forEach((el) => el.classList.add("is-in"));
    });
  } else {
    revealAll();
  }
})();
