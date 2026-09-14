(() => {
  const header = document.getElementById("header");
  const burger = document.getElementById("burger");
  const nav = document.getElementById("nav");
  const year = document.getElementById("year");
  const form = document.getElementById("bookingForm");
  const success = document.getElementById("formSuccess");

  if (year) year.textContent = String(new Date().getFullYear());

  // Sticky header
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 20);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Mobile menu
  if (burger && nav) {
    burger.addEventListener("click", () => {
      nav.classList.toggle("is-open");
      burger.setAttribute(
        "aria-expanded",
        nav.classList.contains("is-open") ? "true" : "false"
      );
    });

    nav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => nav.classList.remove("is-open"));
    });
  }

  // Reviews slider
  const cards = Array.from(document.querySelectorAll(".review-card"));
  const dotsWrap = document.getElementById("reviewsDots");
  const prevBtn = document.getElementById("prevReview");
  const nextBtn = document.getElementById("nextReview");
  let current = 0;
  let timer;

  const showReview = (index) => {
    if (!cards.length) return;
    current = (index + cards.length) % cards.length;
    cards.forEach((card, i) => card.classList.toggle("is-active", i === current));
    if (dotsWrap) {
      dotsWrap.querySelectorAll("button").forEach((dot, i) => {
        dot.classList.toggle("is-active", i === current);
      });
    }
  };

  if (dotsWrap && cards.length) {
    cards.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.setAttribute("aria-label", `Отзыв ${i + 1}`);
      if (i === 0) dot.classList.add("is-active");
      dot.addEventListener("click", () => {
        showReview(i);
        restartAutoplay();
      });
      dotsWrap.appendChild(dot);
    });
  }

  prevBtn?.addEventListener("click", () => {
    showReview(current - 1);
    restartAutoplay();
  });

  nextBtn?.addEventListener("click", () => {
    showReview(current + 1);
    restartAutoplay();
  });

  const startAutoplay = () => {
    timer = window.setInterval(() => showReview(current + 1), 6000);
  };

  const restartAutoplay = () => {
    window.clearInterval(timer);
    startAutoplay();
  };

  if (cards.length > 1) startAutoplay();

  // Booking form (demo frontend)
  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const service = String(data.get("service") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!name || !phone || !service) return;

    const text = [
      "Здравствуйте! Хочу записаться в Лазерную клинику.",
      `Имя: ${name}`,
      `Телефон: ${phone}`,
      `Услуга: ${service}`,
      message ? `Комментарий: ${message}` : "",
    ]
      .filter(Boolean)
      .join("\n");

    // Open WhatsApp with prefilled message as primary conversion path
    const waUrl = `https://wa.me/992777112355?text=${encodeURIComponent(text)}`;
    window.open(waUrl, "_blank", "noopener");

    if (success) {
      success.hidden = false;
    }
    form.reset();
  });
})();
