(() => {
  "use strict";

  if (document.body.dataset.page !== "works") return;

  let touchStartY = null;

  function onTouchStart(event) {
    touchStartY = event.touches[0]?.clientY ?? null;
  }

  function normalizeWheelDelta(event) {
    if (event.deltaMode === WheelEvent.DOM_DELTA_LINE) return event.deltaY * 16;
    if (event.deltaMode === WheelEvent.DOM_DELTA_PAGE) return event.deltaY * window.innerHeight;
    return event.deltaY;
  }

  function scrollParent(deltaY) {
    if (!Number.isFinite(deltaY) || deltaY === 0) return;
    window.scrollBy({ top: deltaY, left: 0, behavior: "auto" });
  }

  function onTouchEnd(event) {
    if (touchStartY === null) return;
    const endY = event.changedTouches[0]?.clientY ?? touchStartY;
    const deltaY = touchStartY - endY;
    touchStartY = null;
    if (Math.abs(deltaY) >= 8) scrollParent(deltaY);
  }

  function bridgeFrame(frame) {
    if (!frame || frame.dataset.pageFlowBridge === "true") return;
    frame.dataset.pageFlowBridge = "true";

    const connect = () => {
      try {
        const frameWindow = frame.contentWindow;
        frameWindow.addEventListener("wheel", (event) => scrollParent(normalizeWheelDelta(event)), { passive: true });
        frameWindow.addEventListener("touchstart", onTouchStart, { passive: true });
        frameWindow.addEventListener("touchend", onTouchEnd, { passive: true });
      } catch (_) {
        // Same-origin previews bridge their gestures; inaccessible frames keep native behavior.
      }
    };

    frame.addEventListener("load", connect);
    connect();
  }

  const root = document.querySelector(".home-flow");
  if (!root) return;
  root.querySelectorAll("iframe").forEach(bridgeFrame);
  root.addEventListener("load", (event) => {
    if (event.target instanceof HTMLIFrameElement) bridgeFrame(event.target);
  }, true);
})();
