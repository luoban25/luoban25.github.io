(() => {
  "use strict";

  function init() {
    const host = document.querySelector("[data-project-viewer]");
    if (!host) return;
    const data = window.AICreativeLabData;
    const ui = window.AICreativeLabUI;
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug") || "particle-rubik";
    const project = data.projectIndex[slug];
    const from = ["works", "skills", "spectra"].includes(params.get("from")) ? params.get("from") : "works";

    if (!project) {
      document.title = "PROJECT NOT FOUND — AI Creative Lab";
      host.innerHTML = `<section class="empty-state"><p class="eyebrow">404 / UNKNOWN PROJECT</p><h1 class="pixel-heading">PROJECT NOT FOUND</h1><p>The requested project is not in the current archive.</p><a class="pill-button" href="./index.html">BACK TO WORKS</a></section>`;
      return;
    }

    const collections = {
      works: data.workProjects,
      skills: data.skillProjects,
      spectra: data.spectraProjects,
    };
    const collection = collections[from];
    let currentIndex = collection.findIndex((item) => item.slug === project.slug);
    if (currentIndex < 0) currentIndex = 0;
    const previous = collection[(currentIndex - 1 + collection.length) % collection.length];
    const next = collection[(currentIndex + 1) % collection.length];
    const backTargets = {
      works: ["./index.html", "BACK TO WORKS"],
      skills: ["./skills.html", "BACK TO SKILLS"],
      spectra: ["./index.html#spectra", "BACK TO SPECTRA"],
    };

    document.title = `${project.title} — AI Creative Lab`;
    host.innerHTML = `
      <article class="project-detail">
        <header class="project-detail__header">
          <p class="eyebrow">PROJECT / ${ui.escapeHtml(project.category)}</p>
          <div class="project-detail__heading">
            <span class="project-detail__number tabular">${project.number}</span>
            <h1 class="pixel-heading">${ui.escapeHtml(project.title)}</h1>
          </div>
          <div class="project-detail__meta">
            <p><span>YEAR</span><strong class="tabular">${ui.escapeHtml(project.year)}</strong></p>
            <p><span>TECHNOLOGY</span><strong>${ui.escapeHtml(project.technology)}</strong></p>
            <p><span>CATEGORY</span><strong>${ui.escapeHtml(project.category)}</strong></p>
          </div>
        </header>
        <div class="project-detail__viewer" data-detail-preview></div>
        <div class="project-detail__footer">
          <p>${ui.escapeHtml(project.description)}</p>
          <a class="pill-button" href="${backTargets[from][0]}">← ${backTargets[from][1]}</a>
        </div>
        <nav class="project-adjacent" aria-label="Adjacent projects">
          <a href="${ui.projectUrl(previous, from)}"><span>← PREVIOUS PROJECT</span><strong>${ui.escapeHtml(previous.title)}</strong></a>
          <a href="${ui.projectUrl(next, from)}"><span>NEXT PROJECT →</span><strong>${ui.escapeHtml(next.title)}</strong></a>
        </nav>
      </article>
    `;
    ui.renderProjectPreview(host.querySelector("[data-detail-preview]"), project, { eager: true });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init, { once: true });
  else init();
})();
