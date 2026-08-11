(() => {
  "use strict";

  const SDK_URL = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.57.4/+esm";
  const config = window.AICreativeLabAuthConfig || {};
  const trigger = document.querySelector("[data-sign-in]");

  if (!trigger || document.querySelector("[data-auth-dialog]")) return;

  let authClient = null;
  let currentUser = null;
  let lastTrigger = null;

  const dialogMarkup = `
    <dialog class="auth-dialog" id="auth-dialog" data-auth-dialog aria-labelledby="auth-dialog-title">
      <div class="auth-dialog__panel">
        <header class="auth-dialog__header">
          <div>
            <p class="auth-dialog__eyebrow">AI CREATIVE LAB / ACCOUNT</p>
            <h2 id="auth-dialog-title">SIGN IN</h2>
          </div>
          <button class="auth-dialog__close" type="button" data-auth-close aria-label="Close sign in dialog">
            <span aria-hidden="true">×</span>
          </button>
        </header>

        <div data-auth-view="loading">
          <p class="auth-dialog__copy">Checking your account…</p>
        </div>

        <div data-auth-view="setup" hidden>
          <p class="auth-dialog__copy">The secure login service still needs its public project connection.</p>
          <p class="auth-dialog__note">Add the Supabase project URL and publishable key in <strong>js/auth-config.js</strong>.</p>
        </div>

        <form class="auth-form" data-auth-form data-auth-view="signed-out" hidden novalidate>
          <p class="auth-dialog__copy">Enter your email and we’ll send you a secure sign-in link. No password required.</p>
          <label for="auth-email">EMAIL ADDRESS</label>
          <input id="auth-email" name="email" type="email" inputmode="email" autocomplete="email" placeholder="you@example.com" aria-describedby="auth-email-help auth-status" required />
          <p class="auth-form__help" id="auth-email-help">The link signs you in and creates an account if this is your first visit.</p>
          <button class="auth-form__submit" type="submit" data-auth-submit>SEND SIGN-IN LINK</button>
        </form>

        <div class="auth-account" data-auth-view="signed-in" hidden>
          <p class="auth-dialog__copy">You are signed in as</p>
          <strong data-auth-email></strong>
          <button class="auth-form__submit auth-form__submit--secondary" type="button" data-auth-sign-out>SIGN OUT</button>
        </div>

        <p class="auth-status" id="auth-status" data-auth-status role="status" aria-live="polite"></p>
      </div>
    </dialog>
  `;

  document.body.insertAdjacentHTML("beforeend", dialogMarkup);

  const dialog = document.querySelector("[data-auth-dialog]");
  const closeButton = dialog.querySelector("[data-auth-close]");
  const form = dialog.querySelector("[data-auth-form]");
  const emailInput = dialog.querySelector("#auth-email");
  const submitButton = dialog.querySelector("[data-auth-submit]");
  const signOutButton = dialog.querySelector("[data-auth-sign-out]");
  const status = dialog.querySelector("[data-auth-status]");
  const accountEmail = dialog.querySelector("[data-auth-email]");
  const views = [...dialog.querySelectorAll("[data-auth-view]")];

  function hasUsableConfig() {
    const url = String(config.supabaseUrl || "").trim();
    const key = String(config.supabasePublishableKey || "").trim();
    if (!url || !key || /service[_-]?role/i.test(key) || /^sb_secret_/i.test(key)) return false;
    if (key.split(".").length === 3) {
      try {
        const encodedPayload = key.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
        const paddedPayload = encodedPayload.padEnd(Math.ceil(encodedPayload.length / 4) * 4, "=");
        if (JSON.parse(window.atob(paddedPayload)).role === "service_role") return false;
      } catch (_) {}
    }
    try {
      const parsed = new URL(url);
      return ["http:", "https:"].includes(parsed.protocol);
    } catch (_) {
      return false;
    }
  }

  function showView(name) {
    views.forEach((view) => {
      view.hidden = view.dataset.authView !== name;
    });
  }

  function setStatus(message = "", type = "") {
    status.textContent = message;
    status.dataset.state = type;
  }

  function setBusy(busy) {
    submitButton.disabled = busy;
    submitButton.setAttribute("aria-busy", String(busy));
    emailInput.readOnly = busy;
  }

  function updateUser(user) {
    currentUser = user || null;
    if (currentUser) {
      const email = currentUser.email || "Account";
      trigger.querySelector("span").textContent = email;
      trigger.setAttribute("aria-label", `Account: ${email}`);
      trigger.classList.add("is-signed-in");
      accountEmail.textContent = email;
      showView("signed-in");
      return;
    }

    trigger.querySelector("span").textContent = "Sign in";
    trigger.setAttribute("aria-label", "Sign in");
    trigger.classList.remove("is-signed-in");
    showView(hasUsableConfig() ? "signed-out" : "setup");
  }

  function openDialog() {
    lastTrigger = document.activeElement;
    setStatus();
    updateUser(currentUser);
    if (!dialog.open) dialog.showModal();
    window.requestAnimationFrame(() => {
      if (currentUser) signOutButton.focus();
      else if (hasUsableConfig()) emailInput.focus();
      else closeButton.focus();
    });
  }

  function closeDialog() {
    dialog.close();
  }

  function authRedirectUrl() {
    const url = new URL(window.location.href);
    ["code", "error", "error_code", "error_description"].forEach((key) => url.searchParams.delete(key));
    url.hash = "";
    return url.toString();
  }

  function authErrorFromUrl() {
    const query = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    return query.get("error_description") || hash.get("error_description") || "";
  }

  async function initializeAuth() {
    if (!hasUsableConfig()) {
      showView("setup");
      return;
    }

    try {
      const { createClient } = await import(SDK_URL);
      authClient = createClient(
        String(config.supabaseUrl).trim(),
        String(config.supabasePublishableKey).trim(),
        {
          auth: {
            autoRefreshToken: true,
            detectSessionInUrl: true,
            persistSession: true,
            flowType: "pkce",
          },
        },
      );

      authClient.auth.onAuthStateChange((event, session) => {
        updateUser(session?.user || null);
        if (event === "SIGNED_IN" && dialog.open) {
          setStatus("Signed in successfully.", "success");
        }
      });

      const { data, error } = await authClient.auth.getUser();
      if (error && !/session/i.test(error.message || "")) throw error;
      updateUser(data?.user || null);

      const redirectError = authErrorFromUrl();
      if (redirectError) {
        openDialog();
        setStatus(redirectError, "error");
      }
    } catch (_) {
      authClient = null;
      showView("signed-out");
      setStatus("The sign-in service could not be reached. Please try again.", "error");
    }
  }

  trigger.setAttribute("aria-haspopup", "dialog");
  trigger.setAttribute("aria-controls", "auth-dialog");
  trigger.addEventListener("click", openDialog);
  closeButton.addEventListener("click", closeDialog);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });
  dialog.addEventListener("close", () => {
    if (lastTrigger instanceof HTMLElement) lastTrigger.focus();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus();
    emailInput.setAttribute("aria-invalid", "false");

    if (!emailInput.validity.valid) {
      emailInput.setAttribute("aria-invalid", "true");
      setStatus("Enter a valid email address.", "error");
      emailInput.focus();
      return;
    }

    if (!authClient) {
      setStatus("The sign-in service is not ready yet.", "error");
      return;
    }

    setBusy(true);
    setStatus("Sending your secure sign-in link…");
    try {
      const { error } = await authClient.auth.signInWithOtp({
        email: emailInput.value.trim(),
        options: {
          emailRedirectTo: authRedirectUrl(),
          shouldCreateUser: true,
        },
      });

      if (error) {
        setStatus(error.message || "We could not send the sign-in link. Please try again.", "error");
        return;
      }

      setStatus("Check your inbox and open the sign-in link to continue.", "success");
    } catch (_) {
      setStatus("The sign-in service could not be reached. Please try again.", "error");
    } finally {
      setBusy(false);
    }
  });

  signOutButton.addEventListener("click", async () => {
    if (!authClient) return;
    signOutButton.disabled = true;
    setStatus("Signing out…");
    try {
      const { error } = await authClient.auth.signOut();
      if (error) {
        setStatus(error.message || "Sign out failed. Please try again.", "error");
        return;
      }
      updateUser(null);
      setStatus("Signed out.", "success");
    } catch (_) {
      setStatus("The sign-in service could not be reached. Please try again.", "error");
    } finally {
      signOutButton.disabled = false;
    }
  });

  initializeAuth();
})();
