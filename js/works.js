(() => {
  "use strict";

  function init() {
    const { workProjects } = window.AICreativeLabData;
    const ui = window.AICreativeLabUI;
    const motion = window.AICreativeLabMotion;
    const card = document.querySelector("[data-selected-card]");
    const preview = document.querySelector("[data-selected-preview]");
    const count = document.querySelector("[data-selected-count]");
    const title = document.querySelector("[data-selected-title]");
    const meta = document.querySelector("[data-selected-meta]");
    const description = document.querySelector("[data-selected-description]");
    const link = document.querySelector("[data-selected-link]");
    const selector = document.querySelector("[data-project-selector]");
    if (!card || !selector) return;

    let currentIndex = 3;
    let switching = false;

    selector.innerHTML = `
      <button class="selector-arrow" type="button" data-selector-direction="-1" aria-label="Previous project">←</button>
      <div class="selector-options">
        ${workProjects.map((project, index) => `<button type="button" data-project-index="${index}" aria-label="Select ${ui.escapeHtml(project.title)}" aria-pressed="${index === currentIndex}"><span>${project.number}</span><small>${ui.escapeHtml(project.shortTitle || project.title)}</small></button>`).join("")}
      </div>
      <button class="selector-arrow" type="button" data-selector-direction="1" aria-label="Next project">→</button>
    `;

    function paint(project) {
      ui.renderProjectPreview(preview, project, { eager: true });
      count.textContent = `${project.number} / ${String(workProjects.length).padStart(2, "0")}`;
      title.textContent = project.title;
      meta.textContent = `${project.year}, ${project.technology}`;
      description.textContent = project.description;
      link.href = ui.projectUrl(project, "works");
      selector.querySelectorAll("[data-project-index]").forEach((button, index) => {
        const active = index === currentIndex;
        button.classList.toggle("is-active", active);
        button.setAttribute("aria-pressed", String(active));
      });
    }

    async function select(index) {
      if (switching || index === currentIndex) return;
      switching = true;
      currentIndex = (index + workProjects.length) % workProjects.length;
      await motion.swapContent(card, () => paint(workProjects[currentIndex]));
      switching = false;
    }

    selector.addEventListener("click", (event) => {
      const projectButton = event.target.closest("[data-project-index]");
      const arrowButton = event.target.closest("[data-selector-direction]");
      if (projectButton) select(Number(projectButton.dataset.projectIndex));
      if (arrowButton) select(currentIndex + Number(arrowButton.dataset.selectorDirection));
    });

    paint(workProjects[currentIndex]);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
