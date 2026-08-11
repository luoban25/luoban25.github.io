(() => {
  "use strict";

  const BEND = window.AICreativeLabBend;
  if (
    !BEND ||
    typeof BEND.createBend !== "function" ||
    typeof BEND.supportsHtmlInCanvas !== "function"
  ) {
    return;
  }
  if (document.body.dataset.page !== "skills") return;

  // The effect needs a fixed-height internal scroll area, so it only runs on
  // desktop layouts where the catalog keeps its sidebar + grid columns.
  const desktopQuery = window.matchMedia(
    "(min-width: 1024px) and (pointer: fine)",
  );

  async function enable() {
    const grid = document.querySelector("[data-skill-grid]");
    if (!grid || grid.dataset.bendReady === "true") return;

    const swaps = [];
    grid.querySelectorAll("article[data-static-preview]").forEach((card) => {
      const preview = card.querySelector(".skill-card__preview");
      const frame = preview ? preview.querySelector("iframe") : null;
      const src = card.dataset.staticPreview;
      if (!preview || !frame || !src) return;
      swaps.push({ preview, frame, src, title: card.querySelector("h2")?.textContent || "Skill" });
    });

    // The folded surface is a snapshot of the DOM, so every iframe preview
    // must have a static image ready. If any image is missing (for example in
    // the reduced public copy), keep the normal page and its live previews.
    const loaded = await Promise.all(
      swaps.map(
        (item) =>
          new Promise((resolve) => {
            const probe = new Image();
            probe.onload = () => resolve(true);
            probe.onerror = () => resolve(false);
            probe.src = item.src;
          }),
      ),
    );
    if (swaps.length > 0 && loaded.some((ok) => !ok)) return;

    swaps.forEach((item) => {
      const image = document.createElement("img");
      image.className = "skill-preview-image";
      image.src = item.src;
      image.alt = `${item.title} project preview`;
      image.loading = "lazy";
      item.preview.replaceChildren(image);
    });

    const workspace = document.createElement("div");
    workspace.className = "bend-workspace";

    const source = document.createElement("canvas");
    source.className = "bend-source";
    source.setAttribute("layoutsubtree", "true");

    const content = document.createElement("div");
    content.className = "bend-content";

    const output = document.createElement("canvas");
    output.className = "bend-output";
    output.setAttribute("aria-hidden", "true");

    grid.before(workspace);
    content.append(grid);
    source.append(content);
    workspace.append(source, output);

    const instance = BEND.createBend(
      { source, content, output },
      {
        zone: 200,
        angle: 80,
        rounding: 150,
        perspective: 700,
        direction: "in",
        ease: 240,
        smoothing: 0.1,
        top: true,
        bottom: true,
        tumble: 0.5,
        tilt: 0.35,
      },
    );

    if (!instance) {
      workspace.replaceWith(grid);
      return;
    }

    grid.dataset.bendReady = "true";
    document.body.classList.add("is-bend-active");

    // Wheel gestures over the fixed sidebar still drive the card grid.
    const sidebar = document.querySelector(".catalog-sidebar");
    const forwardWheel = (event) => {
      if (Number.isFinite(event.deltaY)) content.scrollTop += event.deltaY;
    };
    sidebar?.addEventListener("wheel", forwardWheel, { passive: true });
  }

  function init() {
    if (!desktopQuery.matches) return;
    if (!BEND.supportsHtmlInCanvas()) return;
    enable();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
