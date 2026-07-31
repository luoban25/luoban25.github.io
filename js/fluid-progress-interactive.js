(() => {
  "use strict";

  const filters = document.querySelector("[data-fluid-interactive-filters]");
  const grid = document.querySelector("[data-fluid-interactive-grid]");

  if (!filters || !grid) return;

  const buttons = [
    ...filters.querySelectorAll("[data-fluid-interactive-theme]"),
  ];
  const cards = [
    ...grid.querySelectorAll("[data-fluid-interactive-card]"),
  ];
  let filterTimer = 0;

  const applyFilter = (theme) => {
    buttons.forEach((button) => {
      const isActive = button.dataset.fluidInteractiveTheme === theme;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", String(isActive));
    });

    window.clearTimeout(filterTimer);
    grid.classList.add("is-filtering");
    filterTimer = window.setTimeout(() => {
      cards.forEach((card) => {
        card.hidden =
          theme !== "all" &&
          card.dataset.fluidInteractiveCard !== theme;
      });
      grid.classList.toggle("is-single", theme !== "all");
      requestAnimationFrame(() => grid.classList.remove("is-filtering"));
    }, 160);
  };

  filters.addEventListener("click", (event) => {
    const button = event.target.closest("[data-fluid-interactive-theme]");
    if (!button || !filters.contains(button)) return;
    applyFilter(button.dataset.fluidInteractiveTheme);
  });

  const skillsPanel = document.querySelector(".home-panel--skills");
  const spectraPanel = document.querySelector(".spectra-panel--cards");
  const fluidPanel = document.querySelector(".fluid-progress-panel");
  const interactivePanel = document.querySelector(".fluid-interactive-panel");
  const skillFrames = [
    ...(skillsPanel?.querySelectorAll("iframe") || []),
  ];
  const fluidFrames = [
    ...(fluidPanel?.querySelectorAll("iframe") || []),
  ];
  const interactiveFrames = [
    ...(interactivePanel?.querySelectorAll("iframe") || []),
  ];

  if (!spectraPanel || !fluidPanel || !interactivePanel) return;

  [...skillFrames, ...fluidFrames].forEach((frame) => {
    frame.dataset.lifecycleSrc = frame.getAttribute("src") || "";
  });

  const loadFrames = (frames) => {
    frames.forEach((frame) => {
      const source = frame.dataset.lifecycleSrc || frame.dataset.src;
      if (!source || frame.getAttribute("src") === source) return;
      frame.setAttribute("src", source);
    });
  };

  const releaseFrames = (frames) => {
    frames.forEach((frame) => {
      const source = frame.getAttribute("src");
      if (source && source !== "about:blank") {
        frame.dataset.lifecycleSrc = source;
      }
      frame.setAttribute("src", "about:blank");
    });
  };

  let activeChapter = "";
  let chapterTimer = 0;

  const switchChapter = (chapter) => {
    if (chapter === activeChapter) return;
    activeChapter = chapter;
    window.clearTimeout(chapterTimer);

    if (chapter === "interactive") {
      releaseFrames(skillFrames);
      releaseFrames(fluidFrames);
      chapterTimer = window.setTimeout(() => {
        if (activeChapter === "interactive") loadFrames(interactiveFrames);
      }, 80);
      return;
    }

    if (chapter === "fluid") {
      releaseFrames(skillFrames);
      releaseFrames(interactiveFrames);
      chapterTimer = window.setTimeout(() => {
        if (activeChapter === "fluid") loadFrames(fluidFrames);
      }, 80);
      return;
    }

    releaseFrames(fluidFrames);
    releaseFrames(interactiveFrames);

    if (chapter === "spectra") {
      releaseFrames(skillFrames);
      return;
    }

    chapterTimer = window.setTimeout(() => {
      if (activeChapter === "skills") loadFrames(skillFrames);
    }, 80);
  };

  const isPrimary = (panel) => {
    if (!panel) return false;
    const rect = panel.getBoundingClientRect();
    return rect.top < window.innerHeight * 0.6 && rect.bottom > window.innerHeight * 0.2;
  };

  const updateActiveChapter = () => {
    if (isPrimary(interactivePanel)) {
      switchChapter("interactive");
      return;
    }
    if (isPrimary(fluidPanel)) {
      switchChapter("fluid");
      return;
    }
    if (isPrimary(spectraPanel)) {
      switchChapter("spectra");
      return;
    }
    switchChapter("skills");
  };

  const chapterObserver = new IntersectionObserver(updateActiveChapter, {
    threshold: [0, 0.2, 0.5, 1],
  });

  if (skillsPanel) chapterObserver.observe(skillsPanel);
  chapterObserver.observe(spectraPanel);
  chapterObserver.observe(fluidPanel);
  chapterObserver.observe(interactivePanel);
  updateActiveChapter();
})();
