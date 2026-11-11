/* Menu tab: product cards, customize dialog */
document.body.insertAdjacentHTML("beforeend", `<!-- Customize dialog -->
<dialog id="custDlg" aria-labelledby="custTitle">
 <div class="dlg">
  <h2 id="custTitle" style="font-size:1.6rem">Customize</h2>
  <div><label for="flavorSel"><strong>Flavor</strong></label><select id="flavorSel"></select></div>
  <fieldset><legend>Base (required)</legend><div id="baseOpts"></div></fieldset>
  <fieldset><legend>Sauces &amp; extras</legend><div id="extraOpts"></div></fieldset>
  <div><label for="noteIn"><strong>Note (optional)</strong></label><textarea id="noteIn" rows="2" maxlength="140" placeholder="Any special request?"></textarea></div>
  <div class="qty"><strong id="qLbl">Quantity</strong><button type="button" id="qMinus" aria-label="Decrease quantity">−</button><output id="qVal" aria-labelledby="qLbl">1</output><button type="button" id="qPlus" aria-label="Increase quantity">+</button></div>
  <p id="subtotal" aria-live="polite"></p>
  <p class="err" id="custErr" role="alert"></p>
  <div class="row"><button class="btn alt" type="button" id="custCancel">Cancel</button><button class="btn" type="button" id="custAdd">Add to Cart</button></div>
 </div>
</dialog>

`);
let draft = null;
/* ---------- render menu ---------- */
function renderProducts(){
  const g = $("#products"); g.replaceChildren();
  PRODUCTS.forEach(p => {
    const pic = el("div",{class:"pic"});
    if (p.image){
      const im = el("img",{src:p.image,alt:p.name,loading:"lazy",width:"400",height:"300"});
      im.onerror = () => { im.remove(); pic.append(art(p.id, p.bases[0] === "Kamote")); };
      pic.append(im);
    } else pic.append(art(p.id, p.bases[0] === "Kamote"));
    const body = el("div",{class:"body"},[
      el("span",{class:"tag",text:p.category}),
      el("h3",{text:p.name}),
      el("p",{text:p.desc}),
      el("p",{class:"opts",text:"Base: " + p.bases.join(" or ")}),
      el("p",{class:"price",text: hasPrice(p) ? peso(p.price) : "Price to be confirmed"}),
      el("button",{class:"btn sm",type:"button","data-pid":p.id,"aria-label":"Customize "+p.name,text:"Customize"})
    ]);
    g.append(el("article",{class:"card"},[pic,body]));
  });
}

/* ---------- customize dialog ---------- */
const dlg = $("#custDlg");
function openCustomize(pid){
  draft = { pid, qty:1 };
  const sel = $("#flavorSel"); sel.replaceChildren();
  PRODUCTS.forEach(p => sel.append(el("option",{value:p.id,text:p.name})));
  sel.value = pid; $("#noteIn").value = ""; $("#custErr").textContent = "";
  buildOptions(); dlg.showModal();
}
function buildOptions(){
  const p = PRODUCTS.find(x => x.id === $("#flavorSel").value); draft.pid = p.id;
  $("#custTitle").textContent = "Customize: " + p.name;
  const b = $("#baseOpts"); b.replaceChildren();
  p.bases.forEach(name => b.append(el("label",{class:"opt"},[el("input",{type:"radio",name:"base",value:name,...(p.bases.length===1?{checked:""}:{})}), name])));
  const x = $("#extraOpts"); x.replaceChildren();
  if (p.cheeseSauce) x.append(el("label",{class:"opt"},[el("input",{type:"checkbox",id:"sauceChk"}), "Special cheese sauce (on request)"]));
  else x.append(el("p",{text:"Special cheese sauce is not offered with this flavor."}));
  if (p.vinegar) x.append(el("label",{class:"opt"},[el("input",{type:"checkbox",id:"vinChk"}), "Add vinegar on the side"]));
  updateSub();
}
function updateSub(){
  const p = PRODUCTS.find(x => x.id === draft.pid);
  $("#qVal").textContent = draft.qty;
  $("#subtotal").textContent = hasPrice(p) ? "Subtotal: " + peso(p.price*draft.qty) : "Subtotal: price to be confirmed";
}
function addToCart(){
  const p = PRODUCTS.find(x => x.id === draft.pid);
  const base = $("input[name=base]:checked");
  if (!base){ $("#custErr").textContent = "Please choose Potato or Kamote."; return; }
  const sauce = !!($("#sauceChk") && p.cheeseSauce && $("#sauceChk").checked);
  const vinegar = !!($("#vinChk") && p.vinegar && $("#vinChk").checked);
  const note = $("#noteIn").value.trim().slice(0,140);
  const key = [p.id, base.value, sauce, vinegar, note].join("|");
  const hit = cart.find(i => i.key === key);
  if (hit) hit.qty += draft.qty; else cart.push({key, pid:p.id, base:base.value, sauce, vinegar, qty:draft.qty, note});
  dlg.close(); renderCart(); toast(p.name + " added to cart");
}

/* ---------- wiring ---------- */
$("#products").addEventListener("click", e => { const b=e.target.closest("[data-pid]"); if(b) openCustomize(b.dataset.pid); });
$("#flavorSel").addEventListener("change", buildOptions);
$("#qMinus").onclick = () => { draft.qty = Math.max(1, draft.qty-1); updateSub(); };
$("#qPlus").onclick = () => { draft.qty = Math.min(20, draft.qty+1); updateSub(); };
$("#custAdd").onclick = addToCart;
$("#custCancel").onclick = () => dlg.close();
$("#custDlg").addEventListener("click", e => { if (e.target === e.currentTarget) e.currentTarget.close(); });
renderProducts();
pager($("#products"), () => innerWidth >= 700 ? {n:5, cols: innerWidth >= 1000 ? 5 : 3} : {n:4, cols:2});
initEyes();