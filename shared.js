/* Shared script: loaded on every tab. Edit CONFIG and PRODUCTS here. */
/* =====================================================
   EDIT HERE: business settings (leave null until confirmed)
   ===================================================== */
const CONFIG = {
  phone: null,
  email: null,
  facebook: null,
  hours: null,
  mapUrl: "https://www.google.com/maps/search/?api=1&query=" +
    encodeURIComponent("The Outlets at LIMA Estate, J.P. Laurel Highway, Lipa City, Batangas"),
  orderLink: null,
  sheetUrl: "https://script.google.com/macros/s/AKfycbx641GbPy0XNZHFOKpNC4tISPFZfAFiGyZQqThxTbVD1eFZme_79KaJ84XsIuHaBrdqoQ/exec",
};

/* Products. price is pesos; image can be a path/URL or empty for cartoon art. */
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
const $ = (selector, root=document) => root.querySelector(selector);
const peso = amount => "₱" + amount.toFixed(2);
const hasPrice = product => typeof product.price === "number" && product.price >= 0;
function el(tag, props={}, kids=[]) {
  const node = document.createElement(tag);
  for (const key in props) {
    if (key === "text") node.textContent = props[key];
    else if (key === "class") node.className = props[key];
    else node.setAttribute(key, props[key]);
  }
  [].concat(kids).forEach(child => node.append(child));
  return node;
}
function toast(message) {
  const node = $("#toast");
  if (!node) return;
  node.textContent = message;
  node.classList.add("show");
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => node.classList.remove("show"), 2400);
}

/* Cartoon potato mascot. kind: hero | cheese | ham | beans | dilis */
function art(kind, kamote=false) {
  const skin = kamote ? "#B5527A" : "#C98A3C";
  const capFill = ({dilis:"#F3E0B0", beans:"#C5602F"})[kind] || "#FFC83D";
  const stroke = 'stroke="#4B2E1F" stroke-width="3"';
  const cap = `<path d="M54 80c8-22 30-30 48-30s40 8 48 30c-8 12-20 6-28 14-8-6-16 4-24-2s-16 6-24-2-14 2-20-10z" fill="${capFill}" ${stroke} stroke-linejoin="round"/>`;
  const extras = {
    ham: [0,1,2].map(i => `<rect x="${68+i*22}" y="${58+(i%2)*6}" width="16" height="12" rx="3" fill="#F28B95" stroke="#4B2E1F" stroke-width="2.5" transform="rotate(${i*12-14} ${76+i*22} 66)"/>`).join(""),
    beans: [[72,66],[94,60],[116,66],[104,74],[84,76]].map(([x,y]) => `<ellipse cx="${x}" cy="${y}" rx="7" ry="5" fill="#7A2E14" stroke="#4B2E1F" stroke-width="2"/>`).join(""),
    dilis: [[74,66,-15],[100,60,5],[124,68,18]].map(([x,y,r]) => `<g transform="rotate(${r} ${x} ${y})"><ellipse cx="${x}" cy="${y}" rx="13" ry="5" fill="#B8C4CC" stroke="#4B2E1F" stroke-width="2"/><path d="M${x+12} ${y}l8-6v12z" fill="#B8C4CC" stroke="#4B2E1F" stroke-width="2"/><circle cx="${x-7}" cy="${y-1}" r="1.5" fill="#4B2E1F"/></g>`).join(""),
    cheese: '<circle cx="80" cy="96" r="4" fill="#FFC83D" stroke="#4B2E1F" stroke-width="2"/><circle cx="124" cy="98" r="4" fill="#FFC83D" stroke="#4B2E1F" stroke-width="2"/>',
    hero: '<circle cx="86" cy="64" r="4" fill="#fff6d6"/><circle cx="118" cy="62" r="3" fill="#fff6d6"/>',
  }[kind] || "";
  const eye = cx => `<g><circle class="eyew" cx="${cx}" cy="110" r="13" fill="#fff" ${stroke}/><g class="pupil"><circle cx="${cx}" cy="110" r="6.5" fill="#2a190f"/><circle cx="${cx+2.5}" cy="107.5" r="2.2" fill="#fff"/></g></g>`;
  const wrapper = document.createElement("div");
  wrapper.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 165" aria-hidden="true">
    <ellipse cx="100" cy="153" rx="70" ry="8" fill="rgba(75,46,31,.18)"/>
    <path d="M30 96c0-38 34-62 72-62s68 24 68 62c0 30-30 52-70 52S30 126 30 96z" fill="${skin}" ${stroke}/>
    <circle cx="48" cy="120" r="3" fill="rgba(75,46,31,.25)"/><circle cx="156" cy="128" r="3" fill="rgba(75,46,31,.25)"/><circle cx="140" cy="136" r="2.5" fill="rgba(75,46,31,.25)"/>
    ${cap}${extras}
    <circle cx="62" cy="128" r="8" fill="#FF7E9D" opacity=".6"/><circle cx="138" cy="128" r="8" fill="#F28C28" opacity=".45"/>
    ${eye(82)}${eye(118)}
    <path d="M86 128q14 16 28 0z" fill="#9b2f2f" ${stroke} stroke-linejoin="round"/><path d="M96 134q4 5 8 0" fill="none" stroke="#ff8f8f" stroke-width="2"/>
  </svg>`;
  return wrapper.firstElementChild;
}

/* Eyes follow cursor/touch and gently wander when idle. */
function initEyes() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  const eyes = [...document.querySelectorAll(".pupil")].map(pupil => ({
    pupil, eye:pupil.previousElementSibling, x:0, y:0, tx:0, ty:0,
  }));
  if (!eyes.length) return;
  let point = null, lastInput = Date.now(), running = false;
  function tick() {
    let moving = false;
    eyes.forEach(state => {
      state.x += (state.tx-state.x)*.16;
      state.y += (state.ty-state.y)*.16;
      if (Math.abs(state.tx-state.x)+Math.abs(state.ty-state.y) > .01) moving = true;
      state.pupil.setAttribute("transform", `translate(${state.x.toFixed(2)} ${state.y.toFixed(2)})`);
    });
    if (moving) requestAnimationFrame(tick);
    else running = false;
  }
  function aim() {
    eyes.forEach(state => {
      if (!point || reduce.matches) { state.tx = 0; state.ty = 0; return; }
      const rect = state.eye.getBoundingClientRect();
      const dx = point.x-(rect.left+rect.width/2), dy = point.y-(rect.top+rect.height/2);
      const distance = Math.hypot(dx,dy) || 1;
      const movement = 4.5*Math.min(1,distance/180);
      state.tx = dx/distance*movement;
      state.ty = dy/distance*movement;
    });
    if (!running) { running = true; requestAnimationFrame(tick); }
  }
  const look = (x,y) => { point={x,y}; lastInput=Date.now(); aim(); };
  window.addEventListener("pointermove", event => look(event.clientX,event.clientY), {passive:true});
  ["touchstart","touchmove"].forEach(type => window.addEventListener(type, event => {
    const touch=event.touches[0];
    if (touch) look(touch.clientX,touch.clientY);
  }, {passive:true}));
  window.addEventListener("scroll", () => { if (point) aim(); }, {passive:true});
  window.setInterval(() => {
    if (reduce.matches || document.hidden || Date.now()-lastInput < 3500) return;
    point={x:Math.random()*innerWidth,y:Math.random()*innerHeight};
    aim();
  },2600);
  if (reduce.addEventListener) reduce.addEventListener("change", aim);
}

/* ---------- shared header, footer, and cart ---------- */
const PAGES = [["home","Home"],["menu","Menu"],["order","How to Order"],["about","About Us"],["why","Why Choose Us"],["contact","Contact"]];
const currentPage = document.body.dataset.page;
document.body.insertAdjacentHTML("afterbegin", `<header class="site-header"><div class="wrap bar">
  <a class="logo" href="index.html" aria-label="Spudtaneous home"><span class="wordmark">Spud<span>taneous</span></span></a>
  <nav id="nav" aria-label="Main navigation"><ul>
  ${PAGES.map(([key,title]) => `<li><a class="link" href="${key}.html"${key===currentPage?' aria-current="page"':''}>${title}</a></li>`).join("")}
  <li><a class="btn sm" href="menu.html">Order Now</a></li>
  <li class="hdrcart"><button class="btn alt sm cartbtn" data-opencart type="button">🛒 Cart <span class="badge" data-count>0</span></button></li>
  </ul></nav>
  <button class="burger" id="burger" type="button" aria-expanded="false" aria-controls="nav" aria-label="Open menu">☰</button>
</div></header>`);
document.body.insertAdjacentHTML("beforeend", `<footer class="minifoot">© <span id="year"></span> Spudtaneous &amp; Co. · “Spudtaneous: Sarap na Abot-Kaya, Bawat Kagat may halong Saya!”</footer>
<button class="btn fab cartbtn" data-opencart type="button" aria-label="Open cart">🛒 <span class="badge" data-count>0</span></button>
<dialog id="cartDlg" aria-labelledby="cartTitle"><div class="dlg">
  <div class="row" style="justify-content:space-between;align-items:center"><h2 id="cartTitle" style="font-size:1.6rem">Your Cart</h2><button class="btn alt sm" type="button" id="cartClose">Close</button></div>
  <div id="cartBody"></div><div id="cartSum"></div>
  <div><label for="custName"><strong>Your name</strong></label><input type="text" id="custName" maxlength="60" autocomplete="name"></div>
  <div><label for="custPhone"><strong>Contact number</strong></label><input type="tel" id="custPhone" maxlength="20" autocomplete="tel"></div>
  <button class="btn dark" type="button" id="checkout">Review Order Summary</button>
  <p class="note" id="ckNote" hidden></p>
</div></dialog><div class="toast" id="toast" role="status" aria-live="polite"></div>`);
$("#year").textContent = new Date().getFullYear();

const CART_KEY = "spudtaneous_cart_v1";
function loadCart() {
  try { return (JSON.parse(localStorage.getItem(CART_KEY)) || []).filter(item => item && PRODUCTS.some(p => p.id===item.pid) && Number.isInteger(item.qty) && item.qty>0); }
  catch { return []; }
}
function saveCart() { try { localStorage.setItem(CART_KEY,JSON.stringify(cart)); } catch {} }
let cart = loadCart();
function renderCart() {
  saveCart();
  const count=cart.reduce((sum,item)=>sum+item.qty,0);
  document.querySelectorAll("[data-count]").forEach(node => node.textContent=count);
  const body=$("#cartBody");
  body.replaceChildren();
  if (!cart.length) {
    body.append(el("p",{text:"Your cart is empty. Pick a flavor from the menu!"}));
    $("#cartSum").replaceChildren();
    $("#checkout").disabled=true;
    return;
  }
  $("#checkout").disabled=false;
  let total=0,incomplete=false;
  cart.forEach(item => {
    const product=PRODUCTS.find(p=>p.id===item.pid);
    const options=[item.base,item.sauce?"special cheese sauce":null,product.vinegar?(item.vinegar?"vinegar on the side: yes":"vinegar not requested"):null].filter(Boolean).join(" · ");
    let subtotal="Price to be confirmed";
    if (hasPrice(product)) { total+=product.price*item.qty; subtotal=peso(product.price*item.qty); }
    else incomplete=true;
    const controls=el("div",{class:"qty"},[
      el("button",{type:"button","data-act":"dec","data-key":item.key,"aria-label":"Decrease quantity of "+product.name,text:"−"}),
      el("output",{text:item.qty}),
      el("button",{type:"button","data-act":"inc","data-key":item.key,"aria-label":"Increase quantity of "+product.name,text:"+"}),
      el("button",{class:"btn alt sm",type:"button","data-act":"rm","data-key":item.key,"aria-label":"Remove "+product.name,text:"❌"}),
    ]);
    const line=el("div",{class:"line"},[el("strong",{text:product.name+" × "+item.qty}),el("small",{text:options})]);
    if (item.note) line.append(el("small",{text:"Note: "+item.note}));
    line.append(el("span",{text:subtotal}),controls);
    body.append(line);
  });
  const sum=$("#cartSum");
  sum.replaceChildren(el("p",{class:"price",text:incomplete?"Total: incomplete (some prices are to be confirmed)":"Total: "+peso(total)}));
  if (incomplete) sum.append(el("p",{class:"opts",text:"This total can’t be used as a final payable amount."}));
}
$("#cartBody").addEventListener("click",event=>{
  const button=event.target.closest("button[data-act]");
  if (!button) return;
  const item=cart.find(entry=>entry.key===button.dataset.key);
  if (!item) return;
  if (button.dataset.act==="inc") item.qty++;
  if (button.dataset.act==="dec") item.qty=Math.max(1,item.qty-1);
  if (button.dataset.act==="rm") cart=cart.filter(entry=>entry!==item);
  renderCart();
});
$("#checkout").addEventListener("click",async()=>{
  const note=$("#ckNote"),button=$("#checkout");
  note.hidden=false;
  if (!CONFIG.sheetUrl) {
    note.textContent="Demo checkout: no ordering channel is connected yet, so nothing has been sent to the business and no payment was taken.";
    return;
  }
  const name=$("#custName").value.trim(),phone=$("#custPhone").value.trim();
  if (!name||!phone) { note.textContent="Please enter your name and contact number first."; return; }
  button.disabled=true;
  note.textContent="Sending your order…";
  const items=cart.map(item=>{
    const product=PRODUCTS.find(p=>p.id===item.pid);
    return {name:product.name,base:item.base,qty:item.qty,cheeseSauce:item.sauce,note:item.note,
      vinegar:product.vinegar?(item.vinegar?"Yes":"Not requested"):"",unitPrice:hasPrice(product)?product.price:null};
  });
  try {
    const response=await fetch(CONFIG.sheetUrl,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify({name,phone,items})});
    const data=await response.json();
    if (!response.ok||!data.ok) throw new Error(data.error||"Order request failed");
    cart=[];
    renderCart();
    note.hidden=false;
    note.textContent="Order received! Your reference is "+data.ref+". The shop will confirm your order and total. No payment has been taken online.";
  } catch {
    note.textContent="We couldn’t send your order. Please try again or contact the shop directly.";
  }
  button.disabled=!cart.length;
});
document.querySelectorAll("[data-opencart]").forEach(button=>button.addEventListener("click",()=>{renderCart();$("#cartDlg").showModal();}));
$("#cartClose").addEventListener("click",()=>$("#cartDlg").close());
document.querySelectorAll("dialog").forEach(dialog=>dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close();}));

/* Mobile navigation */
const nav=$("#nav"),burger=$("#burger");
function setNav(open) {
  nav.classList.toggle("open",open);
  burger.setAttribute("aria-expanded",String(open));
  burger.setAttribute("aria-label",open?"Close menu":"Open menu");
  burger.textContent=open?"×":"☰";
}
burger.addEventListener("click",()=>setNav(!nav.classList.contains("open")));
nav.addEventListener("click",event=>{if(event.target.closest("a"))setNav(false);});
document.addEventListener("keydown",event=>{if(event.key==="Escape")setNav(false);});

/* Responsive pager for pages that opt in. */
function pager(box,perPage) {
  if (!box) return;
  const items=[...box.children];
  if (!items.length) return;
  let page=0,startX=null;
  const previous=el("button",{type:"button","aria-label":"Previous",text:"‹"});
  const next=el("button",{type:"button","aria-label":"Next",text:"›"});
  const status=el("span",{"aria-live":"polite"});
  const controls=el("div",{class:"pg-ctl"},[previous,status,next]);
  box.after(controls);
  function show() {
    const config=perPage(),size=config.n||config,pages=Math.ceil(items.length/size);
    box.style.setProperty("--n",config.cols||size);
    page=Math.max(0,Math.min(page,pages-1));
    items.forEach((item,index)=>item.hidden=!(index>=page*size&&index<(page+1)*size));
    status.textContent=(page+1)+" / "+pages;
    previous.disabled=page===0;
    next.disabled=page>=pages-1;
    controls.hidden=pages<=1;
  }
  const go=direction=>{page+=direction;show();};
  previous.addEventListener("click",()=>go(-1));
  next.addEventListener("click",()=>go(1));
  box.addEventListener("touchstart",event=>{startX=event.touches[0].clientX;},{passive:true});
  box.addEventListener("touchend",event=>{
    if(startX===null)return;
    const dx=event.changedTouches[0].clientX-startX;
    startX=null;
    if(Math.abs(dx)>50)go(dx<0?1:-1);
  },{passive:true});
  window.addEventListener("resize",show);
  show();
  return {show};
}
renderCart();
initEyes();
