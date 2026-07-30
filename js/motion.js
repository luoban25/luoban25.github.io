(() => {
  "use strict";

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  function revealPage() {
    requestAnimationFrame(() => document.documentElement.classList.add("is-ready"));
  }

  function swapContent(element, update) {
    if (!element || reducedMotion.matches) {
      update();
      return Promise.resolve();
    }

    element.classList.add("is-changing");
    return new Promise((resolve) => {
      window.setTimeout(() => {
        update();
        requestAnimationFrame(() => {
          element.classList.remove("is-changing");
          window.setTimeout(resolve, 190);
        });
      }, 180);
    });
  }

  window.AICreativeLabMotion = Object.freeze({ revealPage, swapContent });
})();
