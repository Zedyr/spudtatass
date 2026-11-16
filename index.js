/* Home tab */
const heroSvg = document.getElementById("heroSvg");
const heroKamote = document.getElementById("heroKamote");

if (typeof art === "function") {
  if (heroSvg) heroSvg.append(art("hero"));
  if (heroKamote) heroKamote.append(art("hero", true));
  if (typeof initEyes === "function") initEyes();
} else if (heroSvg) {
  // Keep the hero illustration visible if shared.js fails to load or parse.
  heroSvg.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 165" role="img" aria-label="A smiling baked potato topped with cheese" style="display:block;width:100%;height:100%">
    <ellipse cx="100" cy="153" rx="70" ry="8" fill="rgba(75,46,31,.18)"/>
    <path d="M30 96c0-38 34-62 72-62s68 24 68 62c0 30-30 52-70 52S30 126 30 96z" fill="#C98A3C" stroke="#4B2E1F" stroke-width="3"/>
    <path d="M54 80c8-22 30-30 48-30s40 8 48 30c-8 12-20 6-28 14-8-6-16 4-24-2s-16 6-24-2-14 2-20-10z" fill="#FFC83D" stroke="#4B2E1F" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="86" cy="64" r="4" fill="#fff6d6"/><circle cx="118" cy="62" r="3" fill="#fff6d6"/>
    <circle cx="48" cy="120" r="3" fill="rgba(75,46,31,.25)"/><circle cx="156" cy="128" r="3" fill="rgba(75,46,31,.25)"/>
    <circle cx="82" cy="110" r="13" fill="#fff" stroke="#4B2E1F" stroke-width="3"/><circle cx="118" cy="110" r="13" fill="#fff" stroke="#4B2E1F" stroke-width="3"/>
    <circle cx="82" cy="110" r="6.5" fill="#2a190f"/><circle cx="118" cy="110" r="6.5" fill="#2a190f"/>
    <path d="M86 128q14 16 28 0z" fill="#9b2f2f" stroke="#4B2E1F" stroke-width="3" stroke-linejoin="round"/><path d="M96 134q4 5 8 0" fill="none" stroke="#ff8f8f" stroke-width="2"/>
  </svg>`;
}
