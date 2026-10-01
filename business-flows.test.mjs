import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { JSDOM } from "jsdom";
const script = readFileSync("public/support.js", "utf8");
function page(name, fetch) {
  const dom = new JSDOM(readFileSync("public/" + name + ".html", "utf8"), {
    url: "https://hairounaholdingsinc.com/" + name + ".html",
    runScripts: "outside-only",
  });
  dom.window.fetch = fetch;
  dom.window.AbortSignal = AbortSignal;
  dom.window.eval(script);
  return dom.window;
}
const settle = () => new Promise((r) => setTimeout(r, 5));
test("consultation failure preserves entries, permits retry and never reports success", async () => {
  let calls = 0;
  let payload;
  const w = page("contact", async (url, options) => {
    calls++;
    payload = JSON.parse(options.body);
    return calls === 1
      ? { ok: false, json: async () => ({ ok: false }) }
      : { ok: true, json: async () => ({ ok: true }) };
  });
  const f = w.document.getElementById("leadForm");
  f.elements.name.value = "Test";
  f.elements.email.value = "test@example.invalid";
  f.dispatchEvent(new w.Event("submit", { cancelable: true }));
  await settle();
  assert.notEqual(f.style.display, "none");
  assert.equal(f.elements.name.value, "Test");
  assert.match(
    w.document.querySelector(".form-error").textContent,
    /could not be confirmed/,
  );
  assert.equal(f.querySelector("button").disabled, false);
  f.dispatchEvent(new w.Event("submit", { cancelable: true }));
  await settle();
  assert.equal(f.style.display, "none");
  assert.equal(w.document.getElementById("leadOk").style.display, "block");
  assert.equal(payload.email, "test@example.invalid");
  w.close();
});
test("duplicate submissions are prevented while request is pending", async () => {
  let calls = 0,
    resolve;
  const w = page("contact", () => {
    calls++;
    return new Promise((r) => (resolve = r));
  });
  const f = w.document.getElementById("leadForm");
  f.dispatchEvent(new w.Event("submit", { cancelable: true }));
  f.dispatchEvent(new w.Event("submit", { cancelable: true }));
  assert.equal(calls, 1);
  resolve({ ok: true, json: async () => ({ ok: true }) });
  await settle();
  w.close();
});
test("HB sends established session/messages contract and renders responses as text", async () => {
  let body;
  const w = page("services", async (url, options) => {
    assert.match(url, /\/chat$/);
    body = JSON.parse(options.body);
    return {
      ok: true,
      json: async () => ({ reply: "<img src=x onerror=alert(1)>" }),
    };
  });
  const i = w.document.getElementById("hbchatInput");
  i.value = "What services do you offer?";
  w.document.getElementById("hbchatSend").click();
  await settle();
  assert.equal(body.messages[0].role, "user");
  assert.ok(body.session);
  assert.equal(w.document.querySelector("#hbchatMsgs img"), null);
  assert.match(w.document.getElementById("hbchatMsgs").textContent, /<img/);
  w.close();
});
test("checklist tracks gathered items without submitting personal information", () => {
  const w = page("checklist", () => {
    throw Error("Unexpected request");
  });
  const boxes = w.document.querySelectorAll(".check-item input");
  assert.ok(boxes.length > 20);
  boxes[0].checked = true;
  boxes[0].dispatchEvent(new w.Event("change", { bubbles: true }));
  assert.match(w.document.querySelector(".check-progress").textContent, /1 of/);
  w.close();
});
