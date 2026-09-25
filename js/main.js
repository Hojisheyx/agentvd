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

  // Hero city background slider
  const hero = document.getElementById("hero");
  if (hero) {
    const slides = Array.from(hero.querySelectorAll(".hero__slide"));
    const dotsWrap = document.getElementById("heroDots");
    const progress = document.getElementById("heroProgress");
    const progressBar = progress && progress.parentElement;
    const prevBtn = document.getElementById("heroPrev");
    const nextBtn = document.getElementById("heroNext");
    const cityNum = document.getElementById("heroCityNum");
    const cityName = document.getElementById("heroCityName");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let index = 0;
    let timer = null;
    const INTERVAL = 5500;

    slides.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.type = "button";
      dot.className = "hero__dot" + (i === 0 ? " is-active" : "");
      dot.setAttribute("aria-label", `Слайд ${i + 1}`);
      dot.addEventListener("click", () => goTo(i));
      dotsWrap.appendChild(dot);
    });
    const dots = Array.from(dotsWrap.querySelectorAll(".hero__dot"));

    const restartProgress = () => {
      if (!progressBar || !progress || reduceMotion) return;
      progressBar.classList.remove("is-running");
      void progressBar.offsetWidth;
      progressBar.classList.add("is-running");
    };

    const goTo = (next) => {
      index = (next + slides.length) % slides.length;
      slides.forEach((slide, i) => slide.classList.toggle("is-active", i === index));
      dots.forEach((dot, i) => dot.classList.toggle("is-active", i === index));
      const active = slides[index];
      if (cityNum) {
        cityNum.textContent = `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
      }
      if (cityName && active) {
        cityName.textContent = `${active.dataset.city} · ${active.dataset.country}`;
      }
      restartProgress();
      resetTimer();
    };

    const resetTimer = () => {
      if (timer) clearInterval(timer);
      if (reduceMotion) return;
      timer = setInterval(() => goTo(index + 1), INTERVAL);
    };

    prevBtn && prevBtn.addEventListener("click", () => goTo(index - 1));
    nextBtn && nextBtn.addEventListener("click", () => goTo(index + 1));

    hero.addEventListener("mouseenter", () => {
      if (timer) clearInterval(timer);
      if (progressBar) progressBar.classList.remove("is-running");
    });
    hero.addEventListener("mouseleave", () => {
      restartProgress();
      resetTimer();
    });

    let touchX = null;
    hero.addEventListener(
      "touchstart",
      (e) => {
        touchX = e.changedTouches[0].clientX;
      },
      { passive: true }
    );
    hero.addEventListener(
      "touchend",
      (e) => {
        if (touchX == null) return;
        const dx = e.changedTouches[0].clientX - touchX;
        if (Math.abs(dx) > 40) goTo(index + (dx < 0 ? 1 : -1));
        touchX = null;
      },
      { passive: true }
    );

    restartProgress();
    resetTimer();
  }

  // City YouTube lite embeds — click to play
  document.querySelectorAll(".yt-lite").forEach((wrap) => {
    const hit = wrap.querySelector(".yt-lite__hit");
    if (!hit) return;
    hit.addEventListener("click", () => {
      const id = wrap.getAttribute("data-yt");
      if (!id || wrap.classList.contains("is-playing")) return;
      const title = hit.getAttribute("aria-label") || "Video";
      const iframe = document.createElement("iframe");
      iframe.src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;
      iframe.title = title;
      iframe.allow =
        "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
      iframe.allowFullscreen = true;
      iframe.loading = "lazy";
      iframe.referrerPolicy = "strict-origin-when-cross-origin";
      wrap.classList.add("is-playing");
      hit.replaceWith(iframe);
    });
  });
})();
