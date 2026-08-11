(() => {
  "use strict";

  function init() {
    const { skillProjects, skillFilters } = window.AICreativeLabData;
    const ui = window.AICreativeLabUI;
    const filters = document.querySelector("[data-skill-filters]");
    const grid = document.querySelector("[data-skill-grid]");
    if (!filters || !grid) return;

    let currentFilter = "all";
    filters.innerHTML = skillFilters.map((filter) => `<button class="filter-button${filter === "all" ? " is-active" : ""}" type="button" data-filter="${filter}" aria-pressed="${filter === "all"}"><span aria-hidden="true"></span>${filter.toUpperCase()}</button>`).join("");

    skillProjects.forEach((project) => {
      const article = document.createElement("article");
      article.className = "skill-card filterable-card";
      article.dataset.categories = (project.filters || []).join(" ");
      article.dataset.staticPreview = project.staticPreview || "";
      article.innerHTML = `
        <div class="skill-card__preview"></div>
        <div class="skill-card__body">
          <div class="skill-card__index"><span class="tabular">${project.number}</span><span>${ui.escapeHtml(project.category)}</span></div>
          <h2 class="pixel-heading">${ui.escapeHtml(project.title)}</h2>
          <p>${ui.escapeHtml(project.description)}</p>
          <a class="text-link" href="${ui.projectUrl(project, "skills")}">VIEW DETAILS <span aria-hidden="true">→</span></a>
        </div>
      `;
      ui.renderProjectPreview(article.querySelector(".skill-card__preview"), project, { compact: true });
      grid.append(article);
    });

    function applyFilter(filter) {
      currentFilter = filter;
      filters.querySelectorAll("[data-filter]").forEach((button) => {
        const active = button.dataset.filter === filter;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });

      grid.classList.add("is-filtering");
      window.setTimeout(() => {
        grid.querySelectorAll(".filterable-card").forEach((card) => {
          const visible = filter === "all" || card.dataset.categories.split(" ").includes(filter);
          card.hidden = !visible;
        });
        requestAnimationFrame(() => grid.classList.remove("is-filtering"));
      }, 160);
    }

    filters.addEventListener("click", (event) => {
      const button = event.target.closest("[data-filter]");
      if (button && button.dataset.filter !== currentFilter) applyFilter(button.dataset.filter);
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
