/* Barbería 3:16 — datos y flujo de reserva.
   Datos tomados de la agenda online actual del local (AgendaPro), octubre 2026. */

const CONFIG = {
  // En modo demo el botón final abre WhatsApp sin destinatario, para no escribirle al local por error.
  // Para usarlo de verdad, poné DEMO en false.
  DEMO: true,
  whatsapp: "541121933162",
  agendaUrl: "https://barberiaa316.site.agendapro.com/ar/sucursal/93700",
  daysAhead: 12,
  slotStep: 30, // minutos entre turnos
};

const SERVICES = [
  { id: "corte", group: "Cortes", name: "Corte de cabello", price: 18000, min: 30 },
  { id: "corte-af", group: "Cortes", name: "Corte con afeitadora", price: 20000, min: 30, note: "Terminación al ras con navaja" },
  { id: "barba", group: "Barba", name: "Barba", price: 16000, min: 30, note: "Perfilado y arreglo completo" },
  { id: "combo", group: "Combos", name: "Corte de cabello + barba", price: 20000, min: 40 },
  { id: "combo-af", group: "Combos", name: "Corte con afeitadora + barba", price: 22000, min: 40 },
];
const EXTRAS = [
  { id: "cejas", name: "Cejas", price: 1000, min: 5 },
  { id: "linea", name: "Línea o diseño", price: 1000, min: 5 },
];
// day: 1 = lunes … 6 = sábado. Domingo cerrado.
const BARBERS = [
  {
    id: "agustin", name: "Agustín Cavicchioli", short: "Agustín",
    img: "https://dcx13p9dsx90t.cloudfront.net/uploads/attachment_images/12972/attachment_c4c7e788c1eda155.png",
    hours: { 1: ["09:30", "18:00"], 2: ["09:30", "18:00"], 3: ["09:30", "18:00"], 4: ["09:30", "18:00"], 5: ["09:30", "18:00"], 6: ["14:30", "18:00"] },
  },
  {
    id: "enzo", name: "Enzo Cavicchioli", short: "Enzo",
    img: "https://dcx13p9dsx90t.cloudfront.net/uploads/attachment_images/320311/attachment_11bdf6ded72c3e25.png",
    hours: { 1: ["09:00", "18:00"], 2: ["09:00", "17:30"], 3: ["09:00", "18:00"], 4: ["09:00", "17:30"], 5: ["09:00", "18:00"], 6: ["09:00", "18:00"] },
  },
];
// Reseñas reales. Las de Google, de Google Maps; las otras, de la agenda online. Solo se corrigió la ortografía.
const REVIEWS = [
  { name: "Nelson Varela", src: "Google", text: "¡Excelente el servicio! Son puntuales con los turnos, buena onda, te cortan tranquilos y atentos a todos los detalles. Ya fui muchas veces y siempre salí contento. Los recomiendo." },
  { name: "Alejandra Tosi", src: "Google · Local Guide", text: "Excelente la atención y muy profesional. A mi hijo le encantó el corte, ¡vamos a volver! ¡Súper recomendable!" },
  { name: "Pablo Daniel", src: "Google · Local Guide", text: "Son los mejores de San Martín, súper detallistas y atentos. Agustín, un capo. Los súper recomiendo." },
  { name: "Hernán Guzmán", src: "Google", text: "Excelente atención, muy amables y siempre te atienden con la mejor onda. ¡El servicio es espectacular! Súper recomendable." },
  { name: "Feche", src: "Google", text: "¡Agus y Enzo son unos fenómenos! Cortan muy prolijo y son súper amables." },
  { name: "Virginia", src: "Agenda online · Corte con Agustín", text: "Van mis hijos y siempre excelente todo: la organización, el trato y los cortes." },
  { name: "Jula Puntoriero", src: "Google", text: "Excelente atención. ¡Muy amigables! Desde que fui la primera vez voy siempre." },
  { name: "Gabriel", src: "Google", text: "¡Excelente atención! Siempre al detalle de lo que uno quiere en su corte." },
  { name: "Rodrigo Menichelli", src: "Google", text: "Felicitaciones por el nuevo lugar. La atención y buena onda como siempre." },
  { name: "Máximo Caraballo", src: "Google", text: "Muy buen servicio. Estoy bastante conforme con los servicios brindados, son muy copados y prolijos." },
  { name: "Rodo Oviedo", src: "Google", text: "Muy buen servicio, precios acordes y los chicos son unos copados." },
  { name: "Lucas", src: "Agenda online · Corte con Enzo", text: "Excelente atención y servicio de ambos." },
  { name: "Pamela Di Chiara", src: "Google", text: "Excelente atención y servicio, súper recomendable." },
  { name: "Tomás Ceballos", src: "Google", text: "¡Muy buen lugar! Lo recomiendo, muy buenos barberos." },
  { name: "Natanael Robledo", src: "Google", text: "Buen servicio, buenos cortes y gente copada." },
];
const REVIEWS_SHOWN = 6;

const DAY_LONG = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
const DAY_SHORT = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
const MONTHS = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];

const money = (n) => "$" + n.toLocaleString("es-AR");
const toMin = (hhmm) => { const [h, m] = hhmm.split(":").map(Number); return h * 60 + m; };
const toHHMM = (min) => String(Math.floor(min / 60)).padStart(2, "0") + ":" + String(min % 60).padStart(2, "0");
const sameDay = (a, b) => a.toDateString() === b.toDateString();
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const initials = (name) => name.split(" ").map((w) => w[0]).slice(0, 2).join("");

function avatar(b) {
  return `<span class="avatar" aria-hidden="true">${esc(initials(b.name))}${b.img ? `<img src="${b.img}" alt="" onerror="this.remove()">` : ""}</span>`;
}

/* ---------- Estado ---------- */
const state = {
  step: 0,
  service: null,
  extras: new Set(),
  barber: null, // id o "any"
  date: null,
  time: null,
  assigned: null, // barbero asignado cuando se elige "any"
  name: "",
  phone: "",
  notes: "",
  confirmed: false,
};
const STEPS = ["Servicio", "Barbero", "Día y hora", "Tus datos"];

const totals = () => {
  const s = SERVICES.find((x) => x.id === state.service);
  if (!s) return null;
  let price = s.price, min = s.min;
  EXTRAS.forEach((e) => { if (state.extras.has(e.id)) { price += e.price; min += e.min; } });
  return { s, price, min };
};

function canAdvance(step) {
  if (step === 0) return !!state.service;
  if (step === 1) return !!state.barber;
  if (step === 2) return !!(state.date && state.time);
  if (step === 3) return validName(state.name) && validPhone(state.phone);
  return false;
}
const validName = (v) => v.trim().length >= 2;
const validPhone = (v) => v.replace(/\D/g, "").length >= 8;

/* ---------- Turnos disponibles ---------- */
function slotsFor(barber, date, duration) {
  const h = barber.hours[date.getDay()];
  if (!h) return [];
  const start = toMin(h[0]), end = toMin(h[1]);
  const now = new Date();
  const nowMin = sameDay(date, now) ? now.getHours() * 60 + now.getMinutes() + 30 : -1;
  const out = [];
  for (let t = start; t + duration <= end; t += CONFIG.slotStep) if (t > nowMin) out.push(t);
  return out;
}
function availableSlots(date) {
  const t = totals(); if (!t) return [];
  const list = state.barber === "any" ? BARBERS : BARBERS.filter((b) => b.id === state.barber);
  const map = new Map(); // minuto -> barbero
  list.forEach((b) => slotsFor(b, date, t.min).forEach((m) => { if (!map.has(m)) map.set(m, b.id); }));
  return [...map.entries()].sort((a, b) => a[0] - b[0]);
}
function upcomingDays() {
  const days = [];
  const d = new Date(); d.setHours(0, 0, 0, 0);
  for (let i = 0; i < CONFIG.daysAhead; i++) {
    const x = new Date(d); x.setDate(d.getDate() + i);
    days.push(x);
  }
  return days;
}

/* ---------- Render ---------- */
const $ = (id) => document.getElementById(id);

function renderStepper() {
  $("stepper").innerHTML = STEPS.map((label, i) => {
    const reachable = i <= state.step || STEPS.slice(0, i).every((_, j) => canAdvance(j));
    const done = i < state.step || (state.confirmed && i <= 3);
    return `<li><button type="button" data-step="${i}" class="${done ? "done" : ""}" ${i === state.step && !state.confirmed ? 'aria-current="step"' : ""} ${reachable && !state.confirmed ? "" : "disabled"}>
      <span class="num">${done ? "✓" : i + 1}</span>${label}</button></li>`;
  }).join("");
}

function renderService() {
  const groups = [...new Set(SERVICES.map((s) => s.group))];
  return `<h3>¿Qué te hacés?</h3>
    ${groups.map((g) => `<div class="group"><span class="group-title">${g}</span><div class="options">
      ${SERVICES.filter((s) => s.group === g).map((s) => `
        <button type="button" class="option" data-service="${s.id}" aria-pressed="${state.service === s.id}">
          <span class="name">${s.name}</span><span class="price">${money(s.price)}</span>
          <span class="meta">${s.min} min${s.note ? ". " + s.note : ""}</span>
        </button>`).join("")}
    </div></div>`).join("")}
    <div class="group"><span class="group-title">Sumale si querés</span><div class="options">
      ${EXTRAS.map((e) => `
        <button type="button" class="option" role="checkbox" data-extra="${e.id}" aria-checked="${state.extras.has(e.id)}">
          <span class="name">${state.extras.has(e.id) ? "✓ " : "+ "}${e.name}</span><span class="price">${money(e.price)}</span>
          <span class="meta">${e.min} min más</span>
        </button>`).join("")}
    </div></div>`;
}

function renderBarber() {
  const any = `<button type="button" class="option barber-opt" data-barber="any" aria-pressed="${state.barber === "any"}">
      <span class="avatar" aria-hidden="true">3:16</span>
      <span class="name">El primero libre</span>
      <span class="meta">Te damos más horarios para elegir</span>
    </button>`;
  return `<h3>¿Con quién?</h3><div class="barbers">${BARBERS.map((b) => `
    <button type="button" class="option barber-opt" data-barber="${b.id}" aria-pressed="${state.barber === b.id}">
      ${avatar(b)}<span class="name">${b.short}</span>
      <span class="meta">${b.id === "agustin" ? "Sábados desde las 14:30" : "Sábados desde las 9:00"}</span>
    </button>`).join("")}${any}</div>`;
}

function renderDate() {
  const days = upcomingDays();
  if (!state.date || !availableSlots(state.date).length) {
    state.date = days.find((d) => availableSlots(d).length) || null;
    state.time = null;
  }
  const slots = state.date ? availableSlots(state.date) : [];
  const dayBtns = days.map((d) => {
    const n = availableSlots(d).length;
    const label = sameDay(d, new Date()) ? "Hoy" : DAY_SHORT[d.getDay()];
    return `<button type="button" class="day" data-date="${d.toISOString()}" aria-pressed="${state.date && sameDay(d, state.date)}" ${n ? "" : "disabled style='opacity:.4;cursor:not-allowed'"} aria-label="${DAY_LONG[d.getDay()]} ${d.getDate()}${n ? "" : ", cerrado"}">
      <span class="dow">${label}</span><span class="dnum">${d.getDate()}</span></button>`;
  }).join("");
  return `<h3>¿Cuándo?</h3>
    <div class="days" role="group" aria-label="Días">${dayBtns}</div>
    ${state.date ? `<div class="group"><span class="group-title">${DAY_LONG[state.date.getDay()]} ${state.date.getDate()} de ${MONTHS[state.date.getMonth()]}</span>
      ${slots.length ? `<div class="slots">${slots.map(([m, bid]) => `<button type="button" class="slot" data-time="${m}" data-by="${bid}" aria-pressed="${state.time === m}">${toHHMM(m)}</button>`).join("")}</div>`
        : `<p class="empty">No quedan horarios este día. Probá con otro.</p>`}</div>` : `<p class="empty">No hay horarios en los próximos días.</p>`}`;
}

function renderData() {
  const nameErr = state.touched && !validName(state.name);
  const phoneErr = state.touched && !validPhone(state.phone);
  return `<h3>¿A nombre de quién?</h3>
    <form class="form" id="data-form" novalidate>
      <div class="field"><label for="f-name">Nombre</label>
        <input id="f-name" name="name" autocomplete="given-name" value="${esc(state.name)}" required>
        ${nameErr ? `<span class="error">Escribí tu nombre para que sepamos a quién esperar.</span>` : ""}</div>
      <div class="field"><label for="f-phone">WhatsApp</label>
        <input id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" placeholder="11 1234-5678" value="${esc(state.phone)}" required>
        ${phoneErr ? `<span class="error">Revisá el número: necesitamos al menos 8 dígitos para confirmarte.</span>` : `<span class="hint">Te confirmamos el turno por acá.</span>`}</div>
      <div class="field"><label for="f-notes">¿Algo que debamos saber? (opcional)</label>
        <textarea id="f-notes" name="notes" rows="2" placeholder="Ej.: es para mi hijo de 8 años">${esc(state.notes)}</textarea></div>
    </form>`;
}

function waMessage() {
  const t = totals();
  const b = BARBERS.find((x) => x.id === (state.barber === "any" ? state.assigned : state.barber));
  const extras = EXTRAS.filter((e) => state.extras.has(e.id)).map((e) => e.name);
  const d = state.date;
  return [
    `Hola! Quiero reservar un turno en Barbería 3:16.`,
    `Servicio: ${t.s.name}${extras.length ? " + " + extras.join(" + ") : ""} (${money(t.price)})`,
    `Barbero: ${b ? b.short : "el primero libre"}`,
    `Día: ${DAY_LONG[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()]}, ${toHHMM(state.time)} hs`,
    `Nombre: ${state.name.trim()}`,
    state.notes.trim() ? `Nota: ${state.notes.trim()}` : null,
  ].filter(Boolean).join("\n");
}

function renderDone() {
  const t = totals();
  const b = BARBERS.find((x) => x.id === (state.barber === "any" ? state.assigned : state.barber));
  const d = state.date;
  const target = CONFIG.DEMO ? "" : CONFIG.whatsapp;
  const href = `https://wa.me/${target}?text=${encodeURIComponent(waMessage())}`;
  return `<div class="done-card">
    <span class="check" aria-hidden="true">¡Listo!</span>
    <h3>Ya casi tenés tu turno, ${esc(state.name.trim())}</h3>
    <p>Mandanos el pedido por WhatsApp y te lo confirmamos.</p>
    <dl class="ticket">
      <dt>Servicio</dt><dd>${t.s.name}${[...state.extras].map((id) => " + " + EXTRAS.find((e) => e.id === id).name).join("")}</dd>
      <dt>Barbero</dt><dd>${b ? b.short : "El primero libre"}</dd>
      <dt>Cuándo</dt><dd>${DAY_LONG[d.getDay()]} ${d.getDate()} de ${MONTHS[d.getMonth()]}, ${toHHMM(state.time)} hs</dd>
      <dt>Total</dt><dd>${money(t.price)}, se paga en el local</dd>
    </dl>
    <div style="display:flex;flex-wrap:wrap;gap:10px">
      <a class="btn" href="${href}" target="_blank" rel="noopener">Enviar por WhatsApp</a>
      <button type="button" class="btn btn--ghost" id="btn-restart">Hacer otra reserva</button>
    </div>
    ${CONFIG.DEMO ? `<p class="note">Versión de muestra: el mensaje se abre en WhatsApp sin destinatario, así no le llega al local.</p>` : ""}
  </div>`;
}

function renderSummary() {
  const t = totals();
  const l1 = $("sum-line1"), l2 = $("sum-line2");
  if (!t) { l1.textContent = "Todavía no elegiste servicio"; l2.textContent = "Elegí uno para empezar"; }
  else {
    const extras = EXTRAS.filter((e) => state.extras.has(e.id)).map((e) => e.name);
    l1.textContent = t.s.name + (extras.length ? " + " + extras.join(" + ") : "");
    const bits = [money(t.price), t.min + " min"];
    if (state.barber) {
      const bid = state.barber === "any" ? state.assigned : state.barber;
      const b = BARBERS.find((x) => x.id === bid);
      bits.push(b ? "con " + b.short : "con el primero libre");
    }
    if (state.date && state.time != null) bits.push(`${DAY_SHORT[state.date.getDay()]} ${state.date.getDate()}, ${toHHMM(state.time)} hs`);
    l2.textContent = bits.join(", ");
  }
  const back = $("btn-back"), next = $("btn-next");
  $("summary").hidden = state.confirmed;
  back.hidden = state.step === 0;
  next.textContent = state.step === 3 ? "Pedir turno" : "Continuar";
  next.disabled = state.step === 3 ? false : !canAdvance(state.step);
}

function render() {
  renderStepper();
  const body = $("step-body");
  body.innerHTML = state.confirmed ? renderDone()
    : [renderService, renderBarber, renderDate, renderData][state.step]();
  renderSummary();
}

/* ---------- Eventos ---------- */
function go(step) {
  state.step = Math.max(0, Math.min(3, step));
  render();
  const panel = document.querySelector(".booking");
  const top = panel.getBoundingClientRect().top;
  if (top < 0 || top > window.innerHeight * 0.6) panel.scrollIntoView({ block: "start" });
}

document.addEventListener("click", (ev) => {
  const el = ev.target.closest("button");
  if (!el || !el.closest(".booking")) return;
  if (el.dataset.step) return go(Number(el.dataset.step));
  if (el.dataset.service) { state.service = el.dataset.service; state.time = null; return render(); }
  if (el.dataset.extra) {
    const id = el.dataset.extra; state.extras.has(id) ? state.extras.delete(id) : state.extras.add(id);
    state.time = null; return render();
  }
  if (el.dataset.barber) { state.barber = el.dataset.barber; state.time = null; state.assigned = null; return render(); }
  if (el.dataset.date) { state.date = new Date(el.dataset.date); state.time = null; state.assigned = null; return render(); }
  if (el.dataset.time) { state.time = Number(el.dataset.time); state.assigned = el.dataset.by; return render(); }
  if (el.id === "btn-back") return go(state.step - 1);
  if (el.id === "btn-next") {
    if (state.step < 3) return canAdvance(state.step) && go(state.step + 1);
    state.touched = true;
    if (canAdvance(3)) { state.confirmed = true; render(); }
    else { render(); const bad = !validName(state.name) ? "f-name" : "f-phone"; $(bad).focus(); }
    return;
  }
  if (el.id === "btn-restart") {
    Object.assign(state, { step: 0, service: null, barber: null, date: null, time: null, assigned: null, confirmed: false, touched: false });
    state.extras.clear(); render();
  }
});
document.addEventListener("input", (ev) => {
  if (ev.target.id === "f-name") state.name = ev.target.value;
  if (ev.target.id === "f-phone") state.phone = ev.target.value;
  if (ev.target.id === "f-notes") state.notes = ev.target.value;
});
document.addEventListener("submit", (ev) => { ev.preventDefault(); $("btn-next").click(); });

/* ---------- Secciones estáticas ---------- */
function renderPrices() {
  const groups = [...new Set(SERVICES.map((s) => s.group))];
  const row = (name, price, min) => `<div class="price-row"><span>${name}</span><span class="leader"></span><span class="val">${money(price)}</span><span class="dur">${min} min</span></div>`;
  $("price-list").innerHTML = groups.map((g) => `<div class="price-group"><h3>${g}</h3>
      ${SERVICES.filter((s) => s.group === g).map((s) => row(s.name, s.price, s.min)).join("")}</div>`).join("")
    + `<div class="price-group"><h3>Extras</h3>${EXTRAS.map((e) => row(e.name, e.price, e.min)).join("")}</div>`;
}
function renderTeam() {
  const fmt = (r) => r ? `${r[0].replace(/^0/, "")} a ${r[1].replace(/^0/, "")}` : "Cerrado";
  const sameWeek = (b) => [1, 2, 3, 4, 5].every((d) => b.hours[d][0] === b.hours[1][0] && b.hours[d][1] === b.hours[1][1]);
  $("team").innerHTML = BARBERS.map((b) => `<article class="member">${avatar(b)}
    <div class="who"><h3>${b.name}</h3>
      <dl class="hours">${sameWeek(b)
        ? `<dt>Lun a vie</dt><dd>${fmt(b.hours[1])}</dd>`
        : [1, 2, 3, 4, 5].map((d) => `<dt>${DAY_SHORT[d]}</dt><dd>${fmt(b.hours[d])}</dd>`).join("")}
        <dt>Sábado</dt><dd>${fmt(b.hours[6])}</dd></dl>
      <a class="link" href="#reservar" data-pick="${b.id}">Reservar con ${b.short}</a>
    </div></article>`).join("");
  $("team").addEventListener("click", (ev) => {
    const a = ev.target.closest("[data-pick]"); if (!a) return;
    state.barber = a.dataset.pick; state.time = null;
    state.step = state.service ? 2 : 0; render();
  });
}

function renderReviews(all) {
  const list = all ? REVIEWS : REVIEWS.slice(0, REVIEWS_SHOWN);
  $("review-grid").innerHTML = list.map((r) => `<figure class="review">
      <figcaption class="review-who"><span class="initial" aria-hidden="true">${esc(r.name[0])}</span>
        <span class="name">${esc(r.name)}</span><span class="src">${esc(r.src)}</span></figcaption>
      <p>${esc(r.text)}</p></figure>`).join("");
  const more = $("more-reviews");
  more.hidden = all || REVIEWS.length <= REVIEWS_SHOWN;
  more.textContent = `Ver las ${REVIEWS.length} reseñas`;
}
$("more-reviews").addEventListener("click", () => renderReviews(true));

$("copy-wa").addEventListener("click", async (ev) => {
  const btn = ev.currentTarget;
  try { await navigator.clipboard.writeText("+54 9 11 2193-3162"); btn.textContent = "Copiado"; }
  catch { const r = document.createRange(); r.selectNodeContents($("wa-number")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); btn.textContent = "Seleccionado"; }
  setTimeout(() => (btn.textContent = "Copiar"), 1800);
});

// La barra fija del celular se oculta mientras ves el panel de reserva.
const bar = $("mobile-bar");
if ("IntersectionObserver" in window) {
  new IntersectionObserver(([e]) => { bar.hidden = e.isIntersecting; }, { threshold: 0.15 })
    .observe(document.querySelector("#reservar"));
}

renderPrices();
renderTeam();
renderReviews(false);
render();
