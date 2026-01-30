document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector(".site-header");
  const toggle = document.querySelector(".nav-toggle");
  const closeBtn = document.querySelector("#close-btn");

  if (toggle && header) {
      toggle.addEventListener("click", () => {
          const isOpen = header.classList.toggle("open");
          toggle.setAttribute("aria-expanded", isOpen);
      });
  }

  if (closeBtn && header) {
      closeBtn.addEventListener("click", () => {
          header.classList.remove("open");
          toggle.setAttribute("aria-expanded", "false");
      });
  }

  // Preloader Logic
  window.addEventListener("load", () => {
      const preloader = document.querySelector("#preloader");
      if (preloader) {
          setTimeout(() => {
              preloader.classList.add("hidden");
          }, 1500); // 1.5s visibility for the loader brand experience
      }
  });

  // Scroll effect
  window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
          header.classList.add("scrolled");
      } else {
          header.classList.remove("scrolled");
      }
  });
});
