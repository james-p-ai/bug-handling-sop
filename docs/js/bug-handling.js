(() => {
  const STORAGE_KEY = "bug-handling-sop-progress-v2";
  const THEME_KEY = "bug-handling-sop-theme";

  const MODULES = [
    { id: "module-1", href: "module-1.html", num: "1", label: "Report", meta: "25m" },
    { id: "module-2", href: "module-2.html", num: "2", label: "Triage", meta: "30m" },
    { id: "module-3", href: "module-3.html", num: "3", label: "Diagnosis", meta: "45m" },
    { id: "module-4", href: "module-4.html", num: "4", label: "Fix", meta: "35m" },
    { id: "module-5", href: "module-5.html", num: "5", label: "Review", meta: "30m" },
  ];

  const SETUP = { id: "setup", href: "setup.html", num: "⚙", label: "Setup", meta: "15m" };

  const REFERENCE = [
    { id: "next-steps", href: "next-steps.html", num: "→", label: "Next steps" },
    { id: "certification", href: "certification.html", num: "✓", label: "Certification" },
    { id: "bookiq-report", href: "bookiq-report.html", num: "BQ", label: "BookIQ report" },
  ];

  const PROGRESS_IDS = [
    "setup-c1", "setup-c2",
    "m1-c1", "m1-c2", "m1-c3",
    "m2-c1", "m2-c2", "m2-c3",
    "m3-c1", "m3-c2", "m3-c3", "m3-c4",
    "m4-c1", "m4-c2", "m4-c3",
    "m5-c1", "m5-c2", "m5-c3",
    "cert-1", "cert-2", "cert-3", "cert-4",
  ];

  const PAGE_ORDER = [
    "index.html",
    SETUP.href,
    ...MODULES.map((m) => m.href),
    "next-steps.html",
    "certification.html",
    "bookiq-report.html",
    "quick-reference.html",
  ];

  const HUB_URL = "https://practical-office.github.io/dev-sops/";
  const HUB_SKILLS_URL = "https://practical-office.github.io/dev-sops/skills.html";

  const BUG_TEMPLATE = `**Title:** [Clear, concise description]

**Environment**
- Browser / OS / Version:
- Backend / API version:
- User role / permissions:
- Other relevant context (device, network, etc.):

**Reproduction Steps**
1.
2.
3.

**Expected Behavior**
[What should happen]

**Actual Behavior**
[What actually happens]

**Logs / Screenshots / Video**
[Attach or link here]

**Business / User Impact**
[Who is affected and how severely; note any workaround]

**Suggested Severity** (optional — triage confirms)
<!-- severity/s1 | severity/s2 | severity/s3 | severity/s4 -->

**Suggested Priority** (optional — triage confirms)
<!-- priority/p0 | priority/p1 | priority/p2 | priority/p3 -->`;

  const body = document.body;
  const base = body.dataset.base || "";
  const pageId = body.dataset.page || "";
  const isPrintPage = body.classList.contains("print-page");

  function href(path) {
    return `${base}${path}`;
  }

  function load() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    } catch {
      return {};
    }
  }

  function save(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function updateGlobalProgress() {
    const state = load();
    const done = PROGRESS_IDS.filter((id) => state[id]).length;
    const pct = PROGRESS_IDS.length ? Math.round((done / PROGRESS_IDS.length) * 100) : 0;
    const progressFill = document.getElementById("progressFill");
    const progressPct = document.getElementById("progressPct");
    if (progressFill) progressFill.style.width = `${pct}%`;
    if (progressPct) progressPct.textContent = `${pct}%`;
  }

  function applyChecks() {
    const state = load();
    document.querySelectorAll('input[type="checkbox"][data-progress]').forEach((el) => {
      el.checked = Boolean(state[el.dataset.progress]);
      el.closest("label")?.classList.toggle("is-checked", el.checked);
    });
    updateGlobalProgress();
    updateNavComplete();
  }

  function updateNavComplete() {
    const state = load();
    const byModule = {
      setup: ["setup-c1", "setup-c2"],
      "module-1": ["m1-c1", "m1-c2", "m1-c3"],
      "module-2": ["m2-c1", "m2-c2", "m2-c3"],
      "module-3": ["m3-c1", "m3-c2", "m3-c3", "m3-c4"],
      "module-4": ["m4-c1", "m4-c2", "m4-c3"],
      "module-5": ["m5-c1", "m5-c2", "m5-c3"],
      certification: ["cert-1", "cert-2", "cert-3", "cert-4"],
    };
    document.querySelectorAll(".nav-link[data-module]").forEach((link) => {
      const moduleId = link.dataset.module;
      const ids = byModule[moduleId];
      const complete = ids ? ids.every((id) => state[id]) : false;
      link.classList.toggle("is-complete", complete);
    });
  }

  function buildSidebar() {
    const sidebar = document.getElementById("sidebar");
    if (!sidebar || sidebar.dataset.built) return;

    const moduleLinks = MODULES.map(
      (m) =>
        `<a class="nav-link${pageId === m.id ? " is-active" : ""}" data-module="${m.id}" href="${href(m.href)}"><span class="nav-num">${m.num}</span> ${m.label} <span class="nav-meta">${m.meta}</span></a>`
    ).join("");

    const refLinks = REFERENCE.map(
      (r) =>
        `<a class="nav-link${pageId === r.id ? " is-active" : ""}" data-module="${r.id}" href="${href(r.href)}"><span class="nav-num">${r.num}</span> ${r.label}</a>`
    ).join("");

    sidebar.innerHTML = `
      <a class="sidebar-brand" href="${href("index.html")}">
        <img src="${href("assets/practical-ai-mark.png")}" alt="" width="40" height="40" />
        <div class="sidebar-brand-text">
          <strong>Practical AI</strong>
          <span>Bug Handling SOP</span>
        </div>
      </a>
      <div class="progress-panel">
        <div class="progress-label">
          <span>Course progress</span>
          <strong id="progressPct">0%</strong>
        </div>
        <div class="progress-track" aria-hidden="true">
          <div class="progress-fill" id="progressFill"></div>
        </div>
      </div>
      <nav class="sidebar-nav">
        <p class="nav-section-label">Start</p>
        <a class="nav-link" href="${HUB_URL}"><span class="nav-num">←</span> Back to hub</a>
        <a class="nav-link${pageId === "hub" ? " is-active" : ""}" data-module="hub" href="${href("index.html")}"><span class="nav-num">⌂</span> Course hub</a>
        <a class="nav-link${pageId === "quick-reference" ? " is-active" : ""}" data-module="quick-reference" href="${href("quick-reference.html")}"><span class="nav-num">⚡</span> Quick reference</a>
        <a class="nav-link${pageId === SETUP.id ? " is-active" : ""}" data-module="${SETUP.id}" href="${href(SETUP.href)}"><span class="nav-num">${SETUP.num}</span> ${SETUP.label} <span class="nav-meta">${SETUP.meta}</span></a>
        <p class="nav-section-label">Modules</p>
        ${moduleLinks}
        <p class="nav-section-label">Reference</p>
        <a class="nav-link" href="${HUB_SKILLS_URL}"><span class="nav-num">/</span> Skills</a>
        ${refLinks}
        <a class="nav-link" href="${href("course-full.html")}"><span class="nav-num">PDF</span> Save as PDF</a>
        <a class="nav-link" href="https://github.com/Practical-Office/bug-handling-sop/blob/main/docs/reference/BUG-HANDLING-SOP.md" target="_blank" rel="noopener noreferrer"><span class="nav-num">SOP</span> Living SOP</a>
      </nav>
      <div class="sidebar-footer">
        <button type="button" class="btn btn-ghost btn-sm" id="themeToggle" style="width:100%;margin-bottom:0.5rem">Toggle theme</button>
        <a href="https://github.com/Practical-Office/bug-handling-sop" target="_blank" rel="noopener noreferrer">GitHub repo</a>
        ·
        <a href="https://p-ai.net" target="_blank" rel="noopener noreferrer">p-ai.net</a>
      </div>`;
    sidebar.dataset.built = "1";
  }

  function injectHubButton() {
    const actions = document.querySelector(".topbar-actions");
    if (!actions || actions.querySelector("[data-hub-back]")) return;
    const a = document.createElement("a");
    a.className = "btn btn-ghost btn-sm";
    a.href = HUB_URL;
    a.dataset.hubBack = "1";
    a.textContent = "← Back to hub";
    actions.prepend(a);
  }

  function setupPrevNext() {
    const nav = document.getElementById("pageNav");
    if (!nav) return;
    const current = `${base}${body.dataset.file || "index.html"}`.replace(/^\.\//, "");
    const idx = PAGE_ORDER.findIndex((p) => current.endsWith(p) || p === current);
    if (idx < 0) return;
    const prev = idx > 0 ? PAGE_ORDER[idx - 1] : null;
    const next = idx < PAGE_ORDER.length - 1 ? PAGE_ORDER[idx + 1] : null;
    let html = "";
    if (prev) html += `<a class="btn btn-ghost btn-sm page-nav-prev" href="${href(prev)}">← Previous</a>`;
    if (next) html += `<a class="btn btn-primary btn-sm page-nav-next" href="${href(next)}">Next →</a>`;
    nav.innerHTML = html;
  }

  function bindChecks() {
    document.querySelectorAll('input[type="checkbox"][data-progress]').forEach((el) => {
      el.addEventListener("change", () => {
        const state = load();
        state[el.dataset.progress] = el.checked;
        save(state);
        el.closest("label")?.classList.toggle("is-checked", el.checked);
        updateGlobalProgress();
        updateNavComplete();
      });
    });
  }

  function bindMobileNav() {
    const menuBtn = document.getElementById("menuBtn");
    const overlay = document.getElementById("navOverlay");
    const closeNav = () => document.body.classList.remove("nav-open");
    menuBtn?.addEventListener("click", () => document.body.classList.toggle("nav-open"));
    overlay?.addEventListener("click", closeNav);
    document.querySelectorAll(".sidebar a").forEach((a) => {
      a.addEventListener("click", () => {
        if (window.matchMedia("(max-width: 900px)").matches) closeNav();
      });
    });
  }

  function bindReset() {
    document.getElementById("resetProgress")?.addEventListener("click", () => {
      if (!confirm("Reset all checklist progress on this device?")) return;
      localStorage.removeItem(STORAGE_KEY);
      applyChecks();
    });
  }

  function bindPrint() {
    document.getElementById("printCourse")?.addEventListener("click", () => window.print());
  }

  function bindTheme() {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark" || stored === "light") {
      document.documentElement.setAttribute("data-theme", stored);
    }
    const toggle = () => {
      const current = document.documentElement.getAttribute("data-theme");
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      const isDark = current === "dark" || (!current && prefersDark);
      const next = isDark ? "light" : "dark";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem(THEME_KEY, next);
    };
    document.getElementById("themeToggle")?.addEventListener("click", toggle);
    document.getElementById("topbarTheme")?.addEventListener("click", toggle);
  }

  async function copyText(text, feedbackEl) {
    try {
      await navigator.clipboard.writeText(text);
      if (feedbackEl) {
        feedbackEl.textContent = "Copied!";
        feedbackEl.classList.add("is-visible");
        setTimeout(() => feedbackEl.classList.remove("is-visible"), 2000);
      }
    } catch {
      if (feedbackEl) {
        feedbackEl.textContent = "Copy failed — select manually";
        feedbackEl.classList.add("is-visible");
      }
    }
  }

  function bindCopyButtons() {
    document.querySelectorAll("[data-copy-target]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetId = btn.dataset.copyTarget;
        const el = document.getElementById(targetId);
        const feedback = btn.parentElement?.querySelector(".copy-feedback");
        const text = el?.textContent || el?.innerText || BUG_TEMPLATE;
        copyText(text.trim(), feedback);
      });
    });
    document.querySelectorAll("[data-copy-template]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const feedback = btn.parentElement?.querySelector(".copy-feedback");
        copyText(BUG_TEMPLATE, feedback);
      });
    });
  }

  function bindRevealButtons() {
    document.querySelectorAll("[data-reveal]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const answer = document.getElementById(btn.dataset.reveal);
        if (!answer) return;
        const open = answer.classList.toggle("is-open");
        btn.textContent = open ? "Hide answer" : "Show answer";
        btn.setAttribute("aria-expanded", String(open));
      });
    });
  }

  if (!isPrintPage) {
    buildSidebar();
    injectHubButton();
    setupPrevNext();
    bindChecks();
    bindMobileNav();
    bindReset();
    bindTheme();
    bindCopyButtons();
    bindRevealButtons();
    applyChecks();
  }
  bindPrint();
})();
