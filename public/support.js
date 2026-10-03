(() => {
  const endpoint = "https://hb-receptionist.2faxrpl.workers.dev";
  const form = document.getElementById("leadForm");
  if (form) {
    const note = document.createElement("p");
    note.className = "form-note";
    note.textContent =
      "Please share only a brief description. Do not include SINs, passwords, banking details or tax documents.";
    form.append(note);
    const error = document.createElement("p");
    error.className = "form-error";
    error.setAttribute("role", "alert");
    form.after(error);
    let busy = false;
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (busy) return;
      busy = true;
      error.textContent = "";
      const button = form.querySelector("[type=submit]");
      button.disabled = true;
      button.textContent = "Sending…";
      try {
        const response = await fetch(endpoint + "/lead", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(Object.fromEntries(new FormData(form))),
          signal: AbortSignal.timeout(30000),
        });
        const data = await response.json();
        if (
          !response.ok ||
          data.error ||
          data.ok === false ||
          data.success === false
        )
          throw Error();
        const ok = document.getElementById("leadOk");
        ok.setAttribute("role", "status");
        ok.style.display = "block";
        form.style.display = "none";
      } catch {
        error.textContent =
          "Your request could not be confirmed. Please try again or contact us by phone or email.";
      } finally {
        busy = false;
        button.disabled = false;
        button.textContent = "Send My Request";
      }
    });
  }
  const button = document.getElementById("hbchatBtn"),
    panel = document.getElementById("hbchat"),
    input = document.getElementById("hbchatInput"),
    messages = document.getElementById("hbchatMsgs"),
    send = document.getElementById("hbchatSend");
  if (button && panel) {
    button.textContent = "HB";
    button.setAttribute("aria-expanded", "false");
    panel.setAttribute("role", "dialog");
    panel.setAttribute("aria-label", "HB Assistant");
    messages.setAttribute("role", "log");
    messages.setAttribute("aria-live", "polite");
    function close() {
      panel.classList.remove("open");
      button.setAttribute("aria-expanded", "false");
      button.focus();
    }
    button.addEventListener("click", () => {
      panel.classList.toggle("open");
      button.setAttribute(
        "aria-expanded",
        String(panel.classList.contains("open")),
      );
      if (panel.classList.contains("open")) input.focus();
    });
    document.getElementById("hbchatClose").addEventListener("click", close);
    panel.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
    let history = [],
      busy = false;
    const session = crypto.randomUUID();
    function add(role, text) {
      const el = document.createElement("div");
      el.className = "m " + (role === "user" ? "me" : "bot");
      el.textContent = text;
      messages.append(el);
      messages.scrollTop = messages.scrollHeight;
      return el;
    }
    async function go() {
      const text = input.value.trim();
      if (!text || busy) return;
      busy = true;
      send.disabled = true;
      input.value = "";
      const bubble = add("user", text),
        tip = add("assistant", "HB is replying…");
      const next = [...history, { role: "user", content: text }];
      try {
        const r = await fetch(endpoint + "/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session, messages: next }),
          signal: AbortSignal.timeout(30000),
        });
        const data = await r.json();
        if (!r.ok || typeof data.reply !== "string" || !data.reply.trim())
          throw Error();
        tip.textContent = data.reply;
        history = [...next, { role: "assistant", content: data.reply }];
      } catch {
        bubble.remove();
        tip.textContent =
          "HB couldn’t connect. Try again or contact the team at (416) 908-1916.";
        input.value = text;
      } finally {
        busy = false;
        send.disabled = false;
        messages.scrollTop = messages.scrollHeight;
      }
    }
    send.addEventListener("click", go);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") go();
    });
  }
  if (/\/checklist(?:\.html)?\/?$/.test(location.pathname)) {
    const cards = [...document.querySelectorAll("section .card")];
    let total = 0;
    cards
      .filter((card) => !card.textContent.includes("Deadlines"))
      .forEach((card) =>
        card.querySelectorAll(".checks li").forEach((item) => {
          const label = document.createElement("label");
          label.className = "check-item";
          const checkbox = document.createElement("input");
          checkbox.type = "checkbox";
          const span = document.createElement("span");
          span.textContent = item.textContent;
          label.append(checkbox, span);
          item.replaceChildren(label);
          total++;
        }),
      );
    const progress = document.createElement("p");
    progress.className = "check-progress";
    progress.setAttribute("role", "status");
    document.querySelector(".hero-inner").append(progress);
    function update() {
      progress.textContent =
        document.querySelectorAll(".check-item input:checked").length +
        " of " +
        total +
        " items gathered · Progress stays on this page.";
    }
    document.addEventListener("change", update);
    update();
    const sources = document.createElement("p");
    sources.className = "form-note";
    sources.innerHTML =
      '2026 filing dates relate to the 2025 tax year. Check <a href="https://www.canada.ca/en/revenue-agency/services/tax/individuals/topics/important-dates-individuals.html" target="_blank" rel="noopener">CRA’s current deadlines</a> for your situation. Arrange secure document sharing with Hairouna; never share your CRA password.';
    document.querySelector(".notice").after(sources);
  }
})();

// Shared motion preference across the homepage and every supporting page.
(() => {
  let paused = false;
  try { paused = sessionStorage.getItem('hbs-motion') === 'paused'; } catch {}
  const control = document.createElement('button');
  control.type = 'button';
  control.className = 'support-motion-toggle';
  const update = () => {
    document.documentElement.dataset.motion = paused ? 'paused' : 'active';
    control.textContent = paused ? 'Resume motion' : 'Pause motion';
    control.setAttribute('aria-pressed', String(paused));
  };
  control.addEventListener('click', () => {
    paused = !paused;
    try { sessionStorage.setItem('hbs-motion', paused ? 'paused' : 'active'); } catch {}
    update();
  });
  update();
  const footer = document.querySelector('footer .wrap') || document.querySelector('footer');
  if (footer) footer.append(control);
})();

import("/depth.js").then(({ installDepth }) => installDepth()).catch(() => {});
