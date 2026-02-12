// === CONFIG ===
// Set your Formspree endpoint here:
const FORM_ENDPOINT = ""; // e.g. "https://formspree.io/f/XXXXXXX"
const JC_PHONE_E164 = "+12602981652";

const toast = (msg) => {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.style.display = "block";
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => (el.style.display = "none"), 2600);
};

const qs = (s, root=document) => root.querySelector(s);
const qsa = (s, root=document) => Array.from(root.querySelectorAll(s));

function buildMessage(data){
  const lines = [
    "FREE QUOTE REQUEST",
    "-------------------",
    `Name: ${data.name || ""}`,
    `Phone: ${data.phone || ""}`,
    `Address: ${data.address || ""}`,
    data.email ? `Email: ${data.email}` : "",
    "",
    "Request:",
    data.details || "",
    "",
    "Preferred contact: call/text",
  ].filter(Boolean);
  return lines.join("\n");
}

function smsLink(body){
  const encoded = encodeURIComponent(body);
  return `sms:${JC_PHONE_E164}?&body=${encoded}`;
}

async function copyToClipboard(text){
  try{
    await navigator.clipboard.writeText(text);
    toast("Copied.");
    return true;
  }catch(e){
    const ta = document.createElement("textarea");
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    ta.remove();
    toast("Copied.");
    return true;
  }
}

// Modal
const modal = qs("#quoteModal");
const openQuoteBtn = qs("#openQuote");
function openModal(){ modal?.setAttribute("aria-hidden", "false"); }
function closeModal(){ modal?.setAttribute("aria-hidden", "true"); }
openQuoteBtn?.addEventListener("click", openModal);
qsa("[data-close]", modal || document).forEach(el => el.addEventListener("click", closeModal));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

// Form
const form = qs("#quoteForm");
const copyBtn = qs("#copyBtn");
const after = qs("#after");
const textAfter = qs("#textAfter");

let lastMessage = "";

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  if (!FORM_ENDPOINT) {
    toast("Set FORM_ENDPOINT in main.js (Formspree).");
    return;
  }

  const fd = new FormData(form);
  if ((fd.get("_gotcha") || "").toString().trim()) return;

  const data = Object.fromEntries(fd.entries());
  const msg = buildMessage(data);
  lastMessage = msg;

  try{
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: fd
    });

    if (res.ok) {
      toast("Sent.");
      await copyToClipboard(msg);

      if (textAfter) textAfter.href = smsLink(msg);
      if (after) after.style.display = "block";

      // Optional: auto-open text composer on mobile:
      // window.location.href = smsLink(msg);

      form.reset();
    } else {
      toast("Send failed — check Formspree endpoint.");
    }
  }catch(err){
    toast("Send failed — check connection/endpoint.");
  }
});

copyBtn?.addEventListener("click", async () => {
  if (!lastMessage) return toast("Fill the form first.");
  await copyToClipboard(lastMessage);
});

// Phone UX
const phoneInput = qs('input[name="phone"]');
phoneInput?.addEventListener("input", () => {
  const v = phoneInput.value || "";
  const bad = /[a-zA-Z]/.test(v);
  phoneInput.style.outline = bad ? "2px solid rgba(200,0,0,.35)" : "";
});
