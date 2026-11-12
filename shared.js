/* Shared script: loaded on every tab. Edit CONFIG and PRODUCTS here. */
/* =====================================================
   EDIT HERE: business settings (leave null until confirmed)
   ===================================================== */
const CONFIG = {
  phone: null,        // e.g. "+63 900 000 0000"
  email: null,        // e.g. "hello@example.com"
  instagram: null,    // full URL once confirmed
  facebook: null,     // full URL once confirmed
  hours: null, "8am to 10pm"       // e.g. "Daily, 10 AM - 8 PM" 
  mapUrl: "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("The Outlets at LIMA Estate, J.P. Laurel Highway, Lipa City, Batangas"),
  orderLink: null,    // real ordering link (Messenger, form, etc.) once configured
  sheetUrl: "https://script.google.com/a/macros/edustria.edu.ph/s/AKfycbxNrc07tPqjnDe5rxgvGZla8Owoo5H7Ab-QuvRaaW3uLYlaq0dGMZ9XzH-XzmfRvmrI/exec",
};
/* =====================================================
   EDIT HERE: products. price: number in pesos, or null.
   image: path/URL to a photo, or "" to use the cartoon art.
   ===================================================== */
const PRODUCTS = [
  { id:"cheese", name:"Overload Cheese", category:"Cheesy Classic", price:49, image:"", color:"#FFD84D",
    desc:"A savory potato or kamote base topped generously with grated quick-melt cheese. Special cheese sauce may be requested.",
    bases:["Potato"], cheeseSauce:true, side:null },
  { id:"ham", name:"Ham and Cheese", category:"Savory Favorite", price:49, image:"", color:"#F7A8A0",
    desc:"A savory potato or kamote base with cooked ham and melted quick-melt cheese. Special cheese sauce may be requested.",
   bases:["Potato"], cheeseSauce:true, side:null },
  { id:"beans", name:"Beans", category:"Hearty Pick", price:49, image:"", color:"#C0562B",
    desc:"A potato or kamote base topped with canned beans. Special cheese sauce may be requested.",
   bases:["Potato"], cheeseSauce:true, side:null },
  { id:"dilis", name:"Dilis", category:"Filipino-Inspired", price:59, image:"", color:"#9FB8C8",
    desc:"A savory kamote topped with fried dilis. Vinegar on the side is optional. The special cheese sauce is not offered with this flavor.",
    bases:["Kamote"], cheeseSauce:false, vinegar:true },
 
];

/* ---------- helpers ---------- */
const $ = (s, r=document) => r.querySelector(s);
const peso = n => "₱" + n.toFixed(2);
const hasPrice = p => typeof p.price === "number" && p.price >= 0;
function el(tag, props={}, kids=[]){
  const e = document.createElement(tag);
  for (const k in props){ if(k==="text") e.textContent=props[k]; else if(k==="class") e.className=props[k]; else e.setAttribute(k,props[k]); }
  [].concat(kids).forEach(c => e.append(c));
  return e;
}
function toast(msg){ const t=$("#toast"); t.textContent=msg; t.classList.add("show"); clearTimeout(toast.t); toast.t=setTimeout(()=>t.classList.remove("show"),2400); }

/* Cartoon potato mascot. kind: hero | cheese | ham | beans | dilis */
function art(kind, kamote){
  const skin = kamote ? "#B5527A" : "#C98A3C", inner = kamote ? "#F2A04A" : "#F6DFA0";
  const capFill = {dilis:"#F3E0B0", beans:"#C5602F"}[kind] || "#FFC83D";
  const st = 'stroke="#4B2E1F" stroke-width="3"';
  const cap = `<path d="M54 80c8-22 30-30 48-30s40 8 48 30c-8 12-20 6-28 14-8-6-16 4-24-2s-16 6-24-2-14 2-20-10z" fill="${capFill}" ${st} stroke-linejoin="round"/>`;
  const extra = {
    ham:[0,1,2].map(i=>`<rect x="${68+i*22}" y="${58+(i%2)*6}" width="16" height="12" rx="3" fill="#F28B95" stroke="#4B2E1F" stroke-width="2.5" transform="rotate(${i*12-14} ${76+i*22} 66)"/>`).join(""),
    beans:[[72,66],[94,60],[116,66],[104,74],[84,76]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="7" ry="5" fill="#7A2E14" stroke="#4B2E1F" stroke-width="2"/>`).join(""),
    dilis:[[74,66,-15],[100,60,5],[124,68,18]].map(([x,y,r])=>`<g transform="rotate(${r} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="13" ry="5" fill="#B8C4CC" stroke="#4B2E1F" stroke-width="2"/><path d="M${x+12} ${y}l8-6v12z" fill="#B8C4CC" stroke="#4B2E1F" stroke-width="2"/><circle cx="${x-7}" cy="${y-1}" r="1.5" fill="#4B2E1F"/></g>`).join(""),
    cheese:'<circle cx="80" cy="96" r="4" fill="#FFC83D" stroke="#4B2E1F" stroke-width="2"/><circle cx="124" cy="98" r="4" fill="#FFC83D" stroke="#4B2E1F" stroke-width="2"/>',
    hero:'<circle cx="86" cy="64" r="4" fill="#fff6d6"/><circle cx="118" cy="62" r="3" fill="#fff6d6"/>'
  }[kind] || "";
  const eye = cx => `<g><circle class="eyew" cx="${cx}" cy="110" r="13" fill="#fff" ${st}/><g class="pupil"><circle cx="${cx}" cy="110" r="6.5" fill="#2a190f"/><circle cx="${cx+2.5}" cy="107.5" r="2.2" fill="#fff"/></g></g>`;
  const wrap = document.createElement("div");
  wrap.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 165" aria-hidden="true">
   <ellipse cx="100" cy="153" rx="70" ry="8" fill="rgba(75,46,31,.18)"/>
   <path d="M30 96c0-38 34-62 72-62s68 24 68 62c0 30-30 52-70 52S30 126 30 96z" fill="${skin}" ${st}/>
   <circle cx="48" cy="120" r="3" fill="rgba(75,46,31,.25)"/><circle cx="156" cy="128" r="3" fill="rgba(75,46,31,.25)"/><circle cx="140" cy="136" r="2.5" fill="rgba(75,46,31,.25)"/>
   ${cap}${extra}
   <circle cx="62" fill="#FF7E9D" opacity=".6"./><circle cx="138" cy="128" r="8" fill="#F28C28" opacity=".45"/>
   ${eye(82)}${eye(118)}
   <path d="M86 128q14 16 28 0z" fill="#9b2f2f" ${st} stroke-linejoin="round"/><path d="M96 134q4 5 8 0" fill="#ff8f8f"/>
  </svg>`;
  return wrap.firstElementChild;
}

/* Eyes follow the cursor / touch; wander gently when idle; still under reduced motion */
function initEyes(){
  const reduce = matchMedia("(prefers-reduced-motion: reduce)");
  const st = [...document.querySelectorAll(".pupil")].map(p => ({p, eye:p.previousElementSibling, x:0, y:0, tx:0, ty:0}));
  if (!st.length) return;
  let pt = null, last = 0, run = false;
  function aim(){
    st.forEach(s => {
      if (!pt || reduce.matches){ s.tx = s.ty = 0; return; }
      const r = s.eye.getBoundingClientRect(), dx = pt.x-(r.left+r.width/2), dy = pt.y-(r.top+r.height/2);
      const d = Math.hypot(dx,dy) || 1, m = 4.5*Math.min(1, d/180); // 4.5 keeps the pupil inside the eye
      s.tx = dx/d*m; s.ty = dy/d*m;
    });
    if (!run){ run = true; requestAnimationFrame(tick); }
  }
  function tick(){
    let moving = false;
    st.forEach(s => {
      s.x += (s.tx-s.x)*.16; s.y += (s.ty-s.y)*.16;
      if (Math.abs(s.tx-s.x)+Math.abs(s.ty-s.y) > .01) moving = true;
      s.p.setAttribute("transform", `translate(${s.x.toFixed(2)} ${s.y.toFixed(2)})`);
    });
    if (moving) requestAnimationFrame(tick); else run = false;
  }
  const look = (x,y) => { pt = {x,y}; last = Date.now(); aim(); };
  addEventListener("pointermove", e => look(e.clientX,e.clientY), {passive:true});
  ["touchstart","touchmove"].forEach(ev => addEventListener(ev, e => { const t = e.touches[0]; if (t) look(t.clientX,t.clientY); }, {passive:true})); // follows the finger, even while scrolling
  addEventListener("scroll", () => { if (pt) aim(); }, {passive:true});
  setInterval(() => { if (reduce.matches || document.hidden || Date.now()-last < 3500) return; pt = {x:Math.random()*innerWidth, y:Math.random()*innerHeight}; aim(); }, 2600);
  reduce.addEventListener && reduce.addEventListener("change", aim);
}


/* ---------- header, footer, cart (same on every tab) ---------- */
const PAGES = [['home','Home'],['menu','Menu'],['order','How to Order'],['about','About Us'],['why','Why Choose Us'],['contact','Contact']];
const cur = document.body.dataset.page;
document.body.insertAdjacentHTML("afterbegin", `<header><div class="wrap bar">
 
 <nav id="nav" aria-label="Main"><ul>`
 + PAGES.map(([k,t]) => `<li><a class="link" href="${k}.html"${k===cur?' aria-current="page"':''}>${t}</a></li>`).join("")
 + `<li><a class="btn sm" href="menu.html">Order Now</a></li>
 <li class="hdrcart"><button class="btn alt sm cartbtn" data-opencart type="button">🛒 Cart <span class="badge" data-count>0</span></button></li></ul></nav>
 <button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="nav" aria-label="Open menu">☰</button></div></header>`);
document.body.insertAdjacentHTML("beforeend", `<footer class="minifoot">© <span id="year"></span> Spudtaneous &amp; Co. · “Spudtaneous: Sarap na Abot-Kaya, Bawat Kagat may halong Saya!”</footer>
<button class="btn fab cartbtn" data-opencart type="button" aria-label="Open cart">🛒 <span class="badge" data-count>0</span></button><!-- Cart drawer -->
<dialog id="cartDlg" aria-labelledby="cartTitle">
 <div class="dlg">
  <div class="row" style="justify-content:space-between;align-items:center"><h2 id="cartTitle" style="font-size:1.6rem">Your Cart</h2><button class="btn alt sm" type="button" id="cartClose">Close</button></div>
  <div id="cartBody"></div>
  <div id="cartSum"></div>
  <div><label for="custName"><strong>Your name</strong></label><input type="text" id="custName" maxlength="60" autocomplete="name"></div>
<div><label for="custPhone"><strong>Contact number</strong></label><input type="tel" id="custPhone" maxlength="20" autocomplete="tel"></div>
  <button class="btn dark" type="button" id="checkout">Review Order Summary</button>
  <p class="note" id="ckNote" hidden></p>
 </div>
</dialog>
<div class="toast" id="toast" role="status" aria-live="polite"></div>

`);
$("#year").textContent = new Date().getFullYear();

/* ---------- cart (saved in the browser so it follows you between tabs) ---------- */
const CART_KEY = "spudtaneous_cart_v1";
function loadCart(){ try { return (JSON.parse(localStorage.getItem(CART_KEY)) || []).filter(i => i && PRODUCTS.some(p => p.id===i.pid) && Number.isInteger(i.qty) && i.qty>0); } catch(e){ return []; } }
function saveCart(){ try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch(e){} }
let cart = loadCart();
/* ---------- cart ---------- */
function renderCart(){
  saveCart();
  const n = cart.reduce((s,i)=>s+i.qty,0);
  document.querySelectorAll("[data-count]").forEach(c => c.textContent = n);
  const body = $("#cartBody"); body.replaceChildren();
  if (!cart.length){ body.append(el("p",{text:"Your cart is empty. Pick a flavor from the menu!"})); $("#cartSum").replaceChildren(); $("#checkout").disabled = true; return; }
  $("#checkout").disabled = false;
  let total = 0, incomplete = false;
  cart.forEach(i => {
    const p = PRODUCTS.find(x => x.id === i.pid);
    const opts = [i.base, i.sauce ? "special cheese sauce" : null, p.vinegar ? (i.vinegar ? "vinegar on the side: yes" : "vinegar not requested") : null].filter(Boolean).join(" · ");
    let sub = "Price to be confirmed";
    if (hasPrice(p)){ total += p.price*i.qty; sub = peso(p.price*i.qty); } else incomplete = true;
    const q = el("div",{class:"qty"},[
      el("button",{type:"button","data-act":"dec","data-key":i.key,"aria-label":"Decrease quantity of "+p.name,text:"−"}),
      el("output",{text:i.qty}),
      el("button",{type:"button","data-act":"inc","data-key":i.key,"aria-label":"Increase quantity of "+p.name,text:"+"}),
      el("button",{class:"btn alt sm",type:"button","data-act":"rm","data-key":i.key,"aria-label":"Remove "+p.name,text:"❌"})
    ]);
    const line = el("div",{class:"line"},[el("strong",{text:p.name+" × "+i.qty}), el("small",{text:opts})]);
    if (i.note) line.append(el("small",{text:"Note: "+i.note}));
    line.append(el("span",{text:sub}), q); body.append(line);
  });
  const sum = $("#cartSum"); sum.replaceChildren();
  sum.append(el("p",{class:"price",text: incomplete ? "Total: incomplete (some prices are to be confirmed)" : "Total: " + peso(total)}));
  if (incomplete) sum.append(el("p",{class:"opts",text:"This total can’t be used as a final payable amount."}));
}
$("#cartBody").addEventListener("click", e => {
  const b = e.target.closest("button[data-act]"); if(!b) return;
  const i = cart.find(x => x.key === b.dataset.key); if(!i) return;
  if (b.dataset.act === "inc") i.qty++;
  if (b.dataset.act === "dec") i.qty = Math.max(1, i.qty-1);
  if (b.dataset.act === "rm") cart = cart.filter(x => x !== i);
  renderCart();
});
$("#checkout").addEventListener("click", async () => {
  const note = $("#ckNote"), btn = $("#checkout"); note.hidden = false;
  if (!CONFIG.sheetUrl){
    note.textContent = "Demo checkout: no ordering channel is connected yet, so nothing has been sent to the business and no payment was taken.";
    return;
  }
  const name = $("#custName").value.trim(), phone = $("#custPhone").value.trim();
  if (!name || !phone){ note.textContent = "Please enter your name and contact number first."; return; }
  btn.disabled = true; note.textContent = "Sending your order…";
  const items = cart.map(i => {
    const p = PRODUCTS.find(x => x.id === i.pid);
    return { name:p.name, base:i.base, qty:i.qty, cheeseSauce:i.sauce, note:i.note,
             vinegar: p.vinegar ? (i.vinegar ? "Yes" : "Not requested") : "",
             unitPrice: hasPrice(p) ? p.price : null };
  });
  try {
    const res = await fetch(CONFIG.sheetUrl, { method:"POST", headers:{"Content-Type":"text/plain;charset=utf-8"}, body: JSON.stringify({name, phone, items}) });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error || "failed");
    cart = []; renderCart();
    note.hidden = false;
    note.textContent = "Order received! Your reference is " + data.ref + ". The shop will confirm your order and total. No payment has been taken online.";
  } catch (e) {
    note.textContent = "We couldn’t send your order. Please try again or contact the shop directly.";
  }
  btn.disabled = !cart.length;
});

document.querySelectorAll("[data-opencart]").forEach(b => b.onclick = () => { renderCart(); $("#cartDlg").showModal(); });
$("#cartClose").onclick = () => $("#cartDlg").close();
document.querySelectorAll("dialog").forEach(d => d.addEventListener("click", e => { if (e.target === d) d.close(); })); // click backdrop to close

/* Mobile nav */
const nav = $("#nav"), burger = $("#burger");
function setNav(open){ nav.classList.toggle("open",open); burger.setAttribute("aria-expanded",open); burger.setAttribute("aria-label",open?"Close menu":"Open menu"); burger.textContent = open ? "✕" : "☰"; }
burger.onclick = () => setNav(!nav.classList.contains("open"));
nav.addEventListener("click", e => { if (e.target.closest("a")) setNav(false); });
document.addEventListener("keydown", e => { if (e.key === "Escape") setNav(false); });


/* ---------- pager: shows a few items per screen instead of scrolling ---------- */
function pager(box, perFn){
  const items = [...box.children]; let page = 0, sx = null;
  const prev = el("button",{type:"button","aria-label":"Previous",text:"‹"}), next = el("button",{type:"button","aria-label":"Next",text:"›"});
  const status = el("span",{"aria-live":"polite"}), ctl = el("div",{class:"pg-ctl"},[prev,status,next]);
  box.after(ctl);
  function show(){
    const r = perFn(), n = r.n || r, pages = Math.ceil(items.length/n);
    box.style.setProperty("--n", r.cols || n); page = Math.max(0, Math.min(page, pages-1));
    items.forEach((it,i) => it.hidden = !(i >= page*n && i < (page+1)*n));
    status.textContent = (page+1) + " / " + pages; prev.disabled = page===0; next.disabled = page>=pages-1; ctl.hidden = pages<=1;
  }
  const go = d => { page += d; show(); };
  prev.onclick = () => go(-1); next.onclick = () => go(1);
  box.addEventListener("touchstart", e => { sx = e.touches[0].clientX; }, {passive:true});
  box.addEventListener("touchend", e => { if (sx===null) return; const dx = e.changedTouches[0].clientX - sx; sx = null; if (Math.abs(dx) > 50) go(dx<0 ? 1 : -1); }, {passive:true});
  addEventListener("resize", show); show(); return {show};
}
renderCart();
