/* Contact tab */
/* ---------- contact ---------- */
function renderContact(){
  const list = $("#contactList"), foot = document.createElement("ul");
  const rows = [
    ["Business","Spudtaneous & Co. (quick-service food business)",null],
    ["Telephone",CONFIG.phone,CONFIG.phone&&"tel:"+CONFIG.phone.replace(/[^+\d]/g,"")],
    ["Email",CONFIG.email,CONFIG.email&&"mailto:"+CONFIG.email],
    ["Facebook",CONFIG.facebook,CONFIG.facebook],
    ["Operating hours",CONFIG.hours,null]
  ];
  rows.forEach(([label,val,href]) => {
    const dd = el("dd");
    if (!val) dd.append(el("span",{class:"ph",text:"To be confirmed"}));
    else if (href) dd.append(el("a",{href,target:href.startsWith("http")?"_blank":"_self",rel:"noopener",text:val}));
    else dd.textContent = val;
    list.append(el("div",{class:"cell"},[el("dt",{text:label}), dd]));
    if (val && href) foot.append(el("li",{},[el("a",{href,text:label+": "+val})]));
  });
  $("#mapLink").href = CONFIG.mapUrl;
}

renderContact();
