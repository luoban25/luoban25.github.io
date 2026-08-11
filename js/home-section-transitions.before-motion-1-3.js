(() => {
  "use strict";

  const stateClass = "has-home-section-transitions";
  const desktopQuery = "(min-width: 1280px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)";
  const body = document.body;
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  if (!body || !gsap || !ScrollTrigger) {
    body?.classList.remove(stateClass);
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  const panels = ["#works", "#spectra", "#fluid-progress", "#fluid-response"]
    .map((selector) => document.querySelector(selector));

  if (panels.some((panel) => !panel)) {
    body.classList.remove(stateClass);
    return;
  }

  const contentOf = (panel) => panel.querySelector(":scope > .works-layout, :scope > .catalog-layout");
  const contents = panels.map(contentOf);

  if (contents.some((content) => !content)) {
    body.classList.remove(stateClass);
    return;
  }

  const media = gsap.matchMedia();

  media.add(desktopQuery, () => {
    body.classList.add(stateClass);

    const timelines = [];
    let filterRefreshTimer = 0;
    const filterSelector = "[data-spectra-filters], [data-fluid-progress-filters], [data-fluid-interactive-filters]";
    const refreshAfterFilterChange = (event) => {
      if (!event.target.closest(filterSelector)) return;
      window.clearTimeout(filterRefreshTimer);
      filterRefreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 240);
    };

    document.addEventListener("click", refreshAfterFilterChange, true);

    for (let index = 0; index < panels.length - 1; index += 1) {
      const currentContent = contents[index];
      const nextPanel = panels[index + 1];

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: panels[index + 1],
          start: "top 95%",
          end: "top 18%",
          scrub: 0.65,
          invalidateOnRefresh: true,
          onToggle: ({ isActive }) => {
            gsap.set(currentContent, {
              willChange: isActive ? "transform, opacity" : "auto",
            });
            gsap.set(nextPanel, {
              willChange: isActive ? "transform, clip-path" : "auto",
            });
          },
        },
      });

      timeline
        .fromTo(
          currentContent,
          { scale: 1, y: 0, opacity: 1 },
          { scale: 0.985, y: -18, opacity: 0.72 },
          0,
        )
        .fromTo(
          nextPanel,
          { clipPath: "inset(18% 0% 0% 0%)", y: 48 },
          { clipPath: "inset(0% 0% 0% 0%)", y: 0 },
          0,
        );

      timelines.push(timeline);
    }

    ScrollTrigger.refresh();

    const refreshAfterAssets = () => ScrollTrigger.refresh();
    if (document.readyState === "complete") {
      document.fonts?.ready.then(refreshAfterAssets);
    } else {
      window.addEventListener("load", refreshAfterAssets, { once: true });
    }

    return () => {
      window.removeEventListener("load", refreshAfterAssets);
      document.removeEventListener("click", refreshAfterFilterChange, true);
      window.clearTimeout(filterRefreshTimer);
      timelines.forEach((timeline) => timeline.kill());
      gsap.set(contents, { clearProps: "transform,opacity,willChange" });
      gsap.set(panels, { clearProps: "transform,clipPath,willChange" });
      body.classList.remove(stateClass);
    };
  });

  if (!window.matchMedia(desktopQuery).matches) {
    body.classList.remove(stateClass);
  }
})();
