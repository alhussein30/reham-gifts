const WA = { "سمالوط": "201022661237", "المنيا": "201094693134" };
const MUG = "ماجات وبوتلز تنفع معاكي في الشتا والصيف وتحفظ الحرارة سخن وساقع.";
const P = [
  { img: "name-necklace-ar", cat: "سلاسل", t: "سلاسل أسماء عربي", d: "سلاسلنا الملونة، اطلبي الاسم وعلينا التنفيذ. متاحة للأطفال والكبار." },
  { img: "kaaba-necklace", cat: "سلاسل", t: "سلسلة مفتاح الكعبة", d: "«إنا فتحنا لك فتحا مبينا»." },
  { img: "name-necklace-en", cat: "سلاسل", t: "سلاسل أسماء إنجليزي", d: "نفس السلاسل الملونة بالحروف الإنجليزي. اطلبي الاسم وعلينا التنفيذ." },
  { img: "pink-tumbler", cat: "ماجات وبوتلز", t: "ماج حراري بإيد", d: MUG },
  { img: "butterfly-mug", cat: "ماجات وبوتلز", t: "ماج الفراشات", d: MUG },
  { img: "blue-tumbler", cat: "ماجات وبوتلز", t: "ماج أزرق بإيد", d: MUG },
  { img: "duck-slippers", cat: "لكلوك الشتا", t: "لكلوك البطة", d: "لكلوك الشتا، ليكي ولقرة عينك، أو دلعي نفسك واطلبي ليكي انتي بس." },
  { img: "slippers-wall", cat: "لكلوك الشتا", t: "لكلوك الشتا", d: "أشكال كتير من لكلوك الشتا، موجودة فورًا بفرع المنيا وسمالوط." },
  { img: "duck-plush", cat: "دباديب", t: "بطوط", d: "بطوط قطيفة بخدود بينك." },
  { img: "gingham-bag", cat: "شنط", t: "شنطة كاروهات", d: "شنطة ضهر كاروهات أبيض وأسود." },
  { img: "blue-tumbler", cat: "ماجات وبوتلز", t: "ماج أزرق بإيد", d: MUG },
  { img: "penguin-mugs", cat: "ماجات وبوتلز", t: "ماجات برسومات", d: MUG },
  { img: "steel-bottles", cat: "ماجات وبوتلز", t: "بوتلز ستيل", d: MUG },
];
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const waLink = (num, msg) => `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* loader: progress follows real image loading, plays at least 1.7s */
const loader = $("#loader"), prog = $("#lprog");
const t0 = performance.now();
let introAt = Infinity, finished = false;
const imgs = $$("img").filter((i) => i.loading !== "lazy");
let loaded = 0;
const bump = () => { loaded++; prog.style.width = Math.min(100, 20 + (loaded / Math.max(1, imgs.length)) * 80) + "%"; };
imgs.forEach((i) => (i.complete ? bump() : (i.addEventListener("load", bump), i.addEventListener("error", bump))));
function finish() {
  if (finished) return; finished = true;
  prog.style.width = "100%";
  setTimeout(() => { loader.classList.add("done"); introAt = performance.now() + 450; }, 250);
}
addEventListener("load", () => setTimeout(finish, Math.max(0, 1700 - (performance.now() - t0))));
setTimeout(finish, 4000);

/* header + menu */
const hdr = $("#hdr"), burger = $("#burger"), mnav = $("#mnav");
let lastY = 0;
const setMenu = (open) => {
  mnav.style.top = hdr.getBoundingClientRect().bottom + "px";
  mnav.classList.toggle("open", open);
  burger.setAttribute("aria-expanded", open);
  burger.setAttribute("aria-label", open ? "إغلاق القائمة" : "فتح القائمة");
};
burger.addEventListener("click", () => setMenu(!mnav.classList.contains("open")));
$$("#mnav a").forEach((a) => a.addEventListener("click", () => setMenu(false)));

/* hero: word fill on scroll + gift box rotation */
const fill = $("#fill");
const words = fill.textContent.trim().split(/\s+/);
fill.innerHTML = words.map((w) => `<span class="w">${w}</span>`).join(" ");
const ws = $$(".w", fill);
const box = $("#box"), hero = $(".hero");
const pops = $$(".pop");
let px = 0, py = 0;

function onScroll() {
  const y = scrollY;
  if (!mnav.classList.contains("open")) hdr.classList.toggle("hide", y > lastY && y > 400);
  lastY = y;
  const p = Math.min(1, y / (innerHeight * 0.55));
  const lit = Math.round(ws.length * (0.32 + 0.68 * p));
  ws.forEach((w, i) => w.classList.toggle("on", i < lit));
}
addEventListener("scroll", onScroll, { passive: true });
onScroll();

/* hero unboxing: lid pops, real products fly out, scroll opens it wider */
const clamp = (v) => Math.max(0, Math.min(1, v));
const outBack = (x) => { const k = 1.5; return 1 + (k + 1) * Math.pow(x - 1, 3) + k * Math.pow(x - 1, 2); };
const outCubic = (x) => 1 - Math.pow(1 - x, 3);
addEventListener("pointermove", (ev) => { px = ev.clientX / innerWidth - 0.5; py = ev.clientY / innerHeight - 0.5; }, { passive: true });
function frame(now) {
  const t = reduce ? 1 : clamp((now - introAt) / 1500);
  const p = reduce ? 0 : clamp(scrollY / (innerHeight * 0.8));
  const mob = innerWidth < 760;
  hero.style.setProperty("--in", outCubic(clamp(t / 0.35)));
  box.style.setProperty("--ry", 28 + px * 26 + (reduce ? 0 : Math.sin(now / 2400) * 5) + p * 40 + "deg");
  box.style.setProperty("--rx", -20 + py * 10 + "deg");
  const lid = t < 0.2 ? 0 : outBack(clamp((t - 0.2) / 0.45)) * 34 + p * 80;
  box.style.setProperty("--lift", lid);
  pops.forEach((el, i) => {
    const k = outBack(clamp((t - 0.28 - i * 0.07) / 0.55));
    const x = +(mob ? el.dataset.mx || 0 : el.dataset.x), y = +(mob ? el.dataset.my || 0 : el.dataset.y);
    const spread = 1 + p * 0.5;
    const fl = reduce ? 0 : Math.sin(now / 900 + i * 1.7) * 6;
    const dep = 14 + i * 4;
    el.style.opacity = Math.min(1, k * 1.4) * (1 - p * 0.35);
    el.style.transform = `translate(${x * k * spread + px * dep}px, ${(y + (1 - k) * 40) * spread + fl + py * dep}px) rotate(${+el.dataset.r * k}deg) scale(${0.25 + 0.75 * clamp(k)})`;
  });
  if (!reduce || t < 1) requestAnimationFrame(frame);
}
requestAnimationFrame(frame);

/* reveal */
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
}), { threshold: 0.12, rootMargin: "0px 0px -30px 0px" });
$$(".rv").forEach((el) => io.observe(el));

/* product dialog */
const pd = $("#pd");
document.addEventListener("click", (e) => {
  const b = e.target.closest("[data-open]");
  if (!b) return;
  const p = P[+b.dataset.open];
  $("#pdimg").src = `img/${p.img}.jpg`; $("#pdimg").alt = p.t;
  $("#pdcat").textContent = p.cat; $("#pdtitle").textContent = p.t; $("#pddesc").textContent = p.d;
  $("#pdwa").href = waLink(WA["سمالوط"], `السلام عليكم، عايزة أسأل عن: ${p.t} (من موقع ريهام ستور)`);
  pd.showModal();
});
$("#pdx").addEventListener("click", () => pd.close());
pd.addEventListener("click", (e) => { if (e.target === pd) pd.close(); });

/* name builder */
const nm = $("#nm"), pname = $("#pname");
const render = () => {
  pname.textContent = nm.value.trim() || "جنة";
  pname.style.setProperty("--nc", getComputedStyle($(".sw.on")).getPropertyValue("--c"));
  pname.classList.remove("bump"); void pname.offsetWidth; pname.classList.add("bump");
};
nm.addEventListener("input", render);
$$(".sw").forEach((s) => s.addEventListener("click", () => {
  $$(".sw").forEach((x) => x.classList.remove("on"));
  s.classList.add("on"); render();
}));
$("#nameToOrder").addEventListener("click", () => {
  if (nm.value.trim()) $("#nm2").value = nm.value.trim();
  const c = $('.checks input[value="سلاسل بالأسماء"]'); c.checked = true;
});

/* order form */
$("#oform").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target, who = f.who.value.trim(), err = $("#ferr");
  f.who.classList.toggle("bad", !who);
  if (!who) { err.textContent = "اكتبي اسمك الأول."; f.who.focus(); return; }
  err.textContent = "";
  const cats = $$('input[name="c"]:checked', f).map((c) => c.value);
  const br = f.br.value;
  const lines = [`السلام عليكم، أنا ${who}`];
  if (cats.length) lines.push(`مهتمة بـ: ${cats.join("، ")}`);
  if (f.nm2.value.trim()) lines.push(`الاسم على السلسلة: ${f.nm2.value.trim()} (لون الحروف: ${$(".sw.on").dataset.n})`);
  if (f.note.value.trim()) lines.push(f.note.value.trim());
  lines.push(`الفرع: ${br}`, "(من موقع ريهام ستور)");
  open(waLink(WA[br], lines.join("\n")), "_blank", "noopener");
});
