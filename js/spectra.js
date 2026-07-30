(() => {
  "use strict";

  function init() {
    const { spectraProjects } = window.AICreativeLabData;
    const ui = window.AICreativeLabUI;
    const filters = document.querySelector("[data-spectra-filters]");
    const grid = document.querySelector("[data-spectra-grid]");
    if (!filters || !grid) return;

    const options = [{ slug: "all", title: "ALL" }, ...spectraProjects];
    filters.innerHTML = options.map((project, index) => `<button class="filter-button${index === 0 ? " is-active" : ""}" type="button" data-filter="${project.slug}" aria-pressed="${index === 0}"><span aria-hidden="true"></span>${ui.escapeHtml(project.title)}</button>`).join("");

    spectraProjects.forEach((project) => {
      const article = document.createElement("article");
      article.className = "spectra-study filterable-card";
      article.dataset.slug = project.slug;
      article.innerHTML = `
        <div class="spectra-study__frame"></div>
        <div class="spectra-study__info">
          <span class="spectra-study__number tabular">${project.number}</span>
          <h2>${ui.escapeHtml(project.title)}</h2>
          <p class="tabular">$128.00</p>
          <strong>PAID</strong>
        </div>
        <a class="circle-arrow spectra-study__link" href="${ui.projectUrl(project, "spectra")}" aria-label="View ${ui.escapeHtml(project.title)} details">→</a>
      `;
      const previewUrl = new URL(project.embedUrl, window.location.href);
      previewUrl.searchParams.set("collection", "grid");
      ui.renderProjectPreview(article.querySelector(".spectra-study__frame"), {
        ...project,
        embedUrl: previewUrl.href,
      });
      article.addEventListener("mouseenter", () => {
        grid.classList.add("has-hover");
        article.classList.add("is-hovered");
      });
      article.addEventListener("mouseleave", () => {
        grid.classList.remove("has-hover");
        article.classList.remove("is-hovered");
      });
      grid.append(article);
    });

    function applyFilter(filter) {
      filters.querySelectorAll("[data-filter]").forEach((button) => {
        const active = button.dataset.filter === filter;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
      grid.classList.add("is-filtering");
      window.setTimeout(() => {
        grid.querySelectorAll(".spectra-study").forEach((card) => {
          card.hidden = filter !== "all" && card.dataset.slug !== filter;
        });
        requestAnimationFrame(() => grid.classList.remove("is-filtering"));
      }, 160);
    }

    filters.addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter]");
      if (button) applyFilter(button.dataset.filter);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
