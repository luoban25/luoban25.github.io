(() => {
  "use strict";

  const systemNames = Object.freeze({
    spectra: "SPECTRA",
    "fluid-progress": "FLUID PROGRESS",
    "fluid-response": "FLUID RESPONSE",
  });

  const showcases = document.querySelectorAll("[data-system-showcase]");

  showcases.forEach((showcase) => {
    const systemName = systemNames[showcase.dataset.systemShowcase];
    const frame = showcase.querySelector("[data-system-frame]");
    const shell = showcase.querySelector("[data-system-frame-shell]");
    const optionGroup = showcase.querySelector("[data-system-options]");
    const options = [...showcase.querySelectorAll("[data-system-option]")];
    const status = showcase.querySelector("[data-system-status]");

    if (!systemName || !frame || !shell || !optionGroup || !options.length || !status) return;

    let loadRequest = 0;
    let loadFallbackTimer = 0;

    const finishSwitch = (request, label) => {
      if (request !== loadRequest) return;
      window.clearTimeout(loadFallbackTimer);
      shell.classList.remove("is-switching");
      shell.setAttribute("aria-busy", "false");
      status.textContent = `${label} preview ready.`;
    };

    const selectOption = (option) => {
      if (option.getAttribute("aria-pressed") === "true") return;

      const source = option.dataset.src;
      const label = option.dataset.label || option.textContent.trim();
      if (!source) return;

      loadRequest += 1;
      const request = loadRequest;

      options.forEach((candidate) => {
        const selected = candidate === option;
        candidate.classList.toggle("is-active", selected);
        candidate.setAttribute("aria-pressed", String(selected));
      });

      shell.classList.add("is-switching");
      shell.setAttribute("aria-busy", "true");
      status.textContent = `Loading ${label} preview.`;
      frame.title = `${systemName} — ${label} live preview`;

      frame.addEventListener("load", () => {
        window.requestAnimationFrame(() => finishSwitch(request, label));
      }, { once: true });

      window.clearTimeout(loadFallbackTimer);
      loadFallbackTimer = window.setTimeout(() => finishSwitch(request, label), 10000);
      frame.src = source;
    };

    optionGroup.addEventListener("click", (event) => {
      const option = event.target.closest("[data-system-option]");
      if (option && optionGroup.contains(option)) selectOption(option);
    });

    optionGroup.addEventListener("keydown", (event) => {
      const option = event.target.closest("[data-system-option]");
      if (!option) return;

      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        selectOption(option);
        return;
      }

      const currentIndex = options.indexOf(option);
      let nextIndex = currentIndex;

      if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (currentIndex + 1) % options.length;
      else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (currentIndex - 1 + options.length) % options.length;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = options.length - 1;
      else return;

      event.preventDefault();
      options[nextIndex].focus();
    });
  });
})();
