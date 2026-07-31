(() => {
  "use strict";

  const filters = document.querySelector("[data-fluid-progress-filters]");
  const grid = document.querySelector("[data-fluid-progress-grid]");

  if (!filters || !grid) return;

  const buttons = [...filters.querySelectorAll("[data-fluid-theme]")];
  const cards = [...grid.querySelectorAll("[data-fluid-theme-card]")];

  const applyFilter = (theme) => {
    buttons.forEach((button) => {
      const isActive = button.dataset.fluidTheme === theme;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    grid.classList.add("is-filtering");
    window.setTimeout(() => {
      cards.forEach((card) => {
        card.hidden =
          theme !== "all" && card.dataset.fluidThemeCard !== theme;
      });
      requestAnimationFrame(() => grid.classList.remove("is-filtering"));
    }, 160);
  };

  filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-fluid-theme]");
    if (!button || !filters.contains(button)) return;
    applyFilter(button.dataset.fluidTheme);
  });
})();
