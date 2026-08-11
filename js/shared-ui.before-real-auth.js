(() => {
  "use strict";

  const data = window.AICreativeLabData;
  let homeHeaderResizeObserver = null;

  const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character]);

  function activePage(host) {
    const explicit = host.dataset.active;
    if (explicit) return explicit;
    if (document.body.dataset.page !== "project") return "";
    const from = new URLSearchParams(window.location.search).get("from");
    if (from === "spectra") return "works";
    return ["works", "about", "exhibitions", "contact"].includes(from) ? from : "works";
  }

  function headerTemplate(active) {
    const navItems = [
      ["works", "WORKS", "./index.html"],
      ["about", "ABOUT", "./about.html"],
      ["exhibitions", "EXHIBITIONS", "./exhibitions.html"],
      ["contact", "CONTACT", "./contact.html"],
    ];
    const links = navItems.map(([id, label, href]) => `
      <a class="site-nav__link${active === id ? " is-active" : ""}" href="${href}"${active === id ? ' aria-current="page"' : ""}>${label}</a>
    `).join("");

    return `
      <a class="skip-link" href="#main-content">SKIP TO CONTENT</a>
      <header class="site-header">
        <div class="site-header__inner">
          <a class="identity" href="./index.html" aria-label="AI Creative Lab home">
            <span class="identity__mark" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i></span>
            <span class="identity__name"><strong>AI 创意实验室</strong><span aria-hidden="true">/</span><span>AI CREATIVE LAB</span></span>
          </a>
          <button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="site-navigation">
            <span></span><span></span>
          </button>
          <nav class="site-nav" id="site-navigation" aria-label="Primary navigation">${links}</nav>
          <div class="header-tools">
            <button class="theme-toggle" type="button" aria-label="Switch to dark theme" aria-pressed="false"><span aria-hidden="true">☼</span></button>
            <button class="sign-in-button" type="button" data-sign-in>
              <svg viewBox="0 0 18 18" aria-hidden="true">
                <circle cx="9" cy="5.25" r="3.25" fill="currentColor" />
                <path d="M3.25 15.75c0-3.15 2.35-5.25 5.75-5.25s5.75 2.1 5.75 5.25H3.25Z" fill="currentColor" />
              </svg>
              <span>Sign in</span>
            </button>
          </div>
        </div>
      </header>
    `;
  }

  function footerTemplate() {
    return `
      <footer class="site-footer">
        <div class="site-footer__inner">
          <p>• DIGITAL ART. CODE. EMOTION.</p>
          <nav aria-label="Social links">
            <button type="button" data-wechat-open>WECHAT</button>
            <a href="https://x.com/qiqi06291" target="_blank" rel="noopener noreferrer">X</a>
            <a href="mailto:luoban25@gmail.com">EMAIL</a>
          </nav>
        </div>
      </footer>
      <dialog class="wechat-dialog" data-wechat-dialog aria-labelledby="wechat-dialog-title">
        <div class="wechat-dialog__header"><strong id="wechat-dialog-title">WECHAT / QR</strong><button type="button" data-wechat-close aria-label="Close WeChat QR code">×</button></div>
        <img src="./images/wechat-qr.jpg" alt="WeChat QR code" />
        <p>SCAN TO ADD</p>
      </dialog>
    `;
  }

  function setTheme(theme) {
    const selected = theme === "dark" ? "dark" : "light";
    document.documentElement.dataset.theme = selected;
    const toggle = document.querySelector(".theme-toggle");
    if (toggle) {
      const dark = selected === "dark";
      toggle.setAttribute("aria-pressed", String(dark));
      toggle.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
      toggle.firstElementChild.textContent = dark ? "◐" : "☼";
    }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = selected === "dark" ? "#0b0c0e" : "#f4f4f6";
    try { window.localStorage.setItem("acl-theme", selected); } catch (_) {}
  }

  function syncHomeHeaderOffset() {
    if (document.body.dataset.page !== "works") return;
    const header = document.querySelector(".site-header");
    if (!header) return;
    const height = Math.ceil(header.getBoundingClientRect().height);
    document.documentElement.style.setProperty("--site-header-offset", `${height}px`);
  }

  function initHomeHeaderOffset() {
    if (document.body.dataset.page !== "works") return;
    const header = document.querySelector(".site-header");
    if (!header) return;

    syncHomeHeaderOffset();
    if ("ResizeObserver" in window) {
      homeHeaderResizeObserver?.disconnect();
      homeHeaderResizeObserver = new ResizeObserver(syncHomeHeaderOffset);
      homeHeaderResizeObserver.observe(header);
    } else {
      window.addEventListener("resize", syncHomeHeaderOffset, { passive: true });
    }
  }

  function initShell() {
    document.querySelectorAll("[data-site-header]").forEach((host) => {
      host.innerHTML = headerTemplate(activePage(host));
    });
    document.querySelectorAll("[data-site-footer]").forEach((host) => {
      host.innerHTML = footerTemplate();
    });
    initHomeHeaderOffset();

    let savedTheme = "light";
    try { savedTheme = window.localStorage.getItem("acl-theme") || "light"; } catch (_) {}
    setTheme(savedTheme);

    const toggle = document.querySelector(".theme-toggle");
    toggle?.addEventListener("click", () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark"));

    const menu = document.querySelector(".menu-toggle");
    const navigation = document.querySelector(".site-nav");
    menu?.addEventListener("click", () => {
      const open = menu.getAttribute("aria-expanded") === "true";
      menu.setAttribute("aria-expanded", String(!open));
      menu.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
      navigation?.classList.toggle("is-open", !open);
      window.requestAnimationFrame(syncHomeHeaderOffset);
    });

    const dialog = document.querySelector("[data-wechat-dialog]");
    document.querySelector("[data-wechat-open]")?.addEventListener("click", () => dialog?.showModal());
    document.querySelector("[data-wechat-close]")?.addEventListener("click", () => dialog?.close());
    dialog?.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });

    window.AICreativeLabMotion?.revealPage();
  }

  function componentPreview(project, compact) {
    if (project.component === "wormhole") {
      return `<div class="graphic-preview graphic-preview--wormhole" aria-label="Wormhole graphic"><span>{ WH }</span><i></i><i></i></div>`;
    }
    if (project.component === "fluid-dropdown") {
      const id = compact ? `fluid-${project.number}` : "fluid-project-select";
      return `<div class="graphic-preview graphic-preview--dropdown"><label for="${id}">SELECT DISCIPLINE</label><select id="${id}"><option>GENERATIVE ART</option><option>MOTION SYSTEMS</option><option>INTERACTION</option><option>DATA IO</option></select><span aria-hidden="true">↓</span></div>`;
    }
    return "";
  }

  function renderProjectPreview(container, project, options = {}) {
    if (!container || !project) return;
    container.replaceChildren();
    container.dataset.previewType = project.previewType;
    if (project.previewType === "iframe") {
      const frame = document.createElement("iframe");
      let previewUrl = project.embedUrl;
      if (options.compact && project.slug === "spectra") {
        const compactUrl = new URL(project.embedUrl, window.location.href);
        compactUrl.searchParams.set("collection", "grid");
        previewUrl = compactUrl.href;
      }
      frame.src = previewUrl;
      frame.title = `${project.title} live interactive preview`;
      frame.loading = options.eager ? "eager" : "lazy";
      frame.allow = "autoplay";
      frame.setAttribute("data-raw-work", "embedded-only");
      container.append(frame);
      return;
    }
    if (project.previewType === "image") {
      const image = document.createElement("img");
      image.src = project.embedUrl;
      image.alt = `${project.title} project preview`;
      container.append(image);
      return;
    }
    container.innerHTML = componentPreview(project, options.compact);
  }

  function projectUrl(project, from) {
    return `./project.html?slug=${encodeURIComponent(project.slug)}&from=${encodeURIComponent(from)}`;
  }

  window.AICreativeLabUI = Object.freeze({
    data,
    escapeHtml,
    renderProjectPreview,
    projectUrl,
    setTheme,
  });

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", initShell, { once: true });
  else initShell();
})();
