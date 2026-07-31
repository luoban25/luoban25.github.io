(() => {
  "use strict";

  const filters = document.querySelector("[data-fluid-progress-filters]");
  const grid = document.querySelector("[data-fluid-progress-grid]");

  if (!filters || !grid) return;

  const buttons = [...filters.querySelectorAll("[data-fluid-theme]")];
  const cards = [...grid.querySelectorAll("[data-fluid-theme-card]")];
  let filterTimer = 0;

  const applyFilter = (theme) => {
    buttons.forEach((button) => {
      const isActive = button.dataset.fluidTheme === theme;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    window.clearTimeout(filterTimer);
    grid.classList.add("is-filtering");
    filterTimer = window.setTimeout(() => {
      cards.forEach((card) => {
        card.hidden =
          theme !== "all" && card.dataset.fluidThemeCard !== theme;
      });
      grid.classList.toggle("is-single", theme !== "all");
      requestAnimationFrame(() => grid.classList.remove("is-filtering"));
    }, 160);
  };

  filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-fluid-theme]");
    if (!button || !filters.contains(button)) return;
    applyFilter(button.dataset.fluidTheme);
  });
})();
