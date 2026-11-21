// https://stackoverflow.com/questions/8126623/downloading-canvas-element-to-an-image
function downloadCanvasAsImage() {
    saveCanvas(filenameString(), 'png');
}

function filenameString() {
    const name = superSanitizeString(document.getElementById('nombre').value);
    return Math.floor(Date.now() / 1000) + "-" + name;   // no ".png" here anymore
}

function superSanitizeString (inStr) {
    return inStr.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[(),.]/g, '').toUpperCase();
}

function filenameString() {
    tmp = document.getElementById('nombre').value;

    tmp = superSanitizeString(tmp);
    tmp = Math.floor(Date.now() / 1000).toString() + "-" + tmp;

    return tmp + ".png";
}

function readGET () {
    populateFontMenus();

    let params = new URLSearchParams(location.search);
    let bgn = params.get('bgn'); let fgn = params.get('fgn');
    let bgt = params.get('bgt'); let fgt = params.get('fgt');
    let acc = params.get('acc'); let cac = params.get('cac');
    let thm = params.get('thm'); let pal = params.get('pal');
    let shd = params.get('shd');
    let ftn = params.get('ftn'); let fnb = params.get('fnb');
    let ftb = params.get('ftb'); let fbb = params.get('fbb');


    // Name colors
    if (bgn != null) document.getElementById("cPrinc").value = "#" + bgn;
    if (fgn != null) document.getElementById("cPrincText").value = "#" + fgn;

    // Subtext colors
    if (bgt != null) document.getElementById("cBajad").value = "#" + bgt;
    if (fgt != null) document.getElementById("cBajadText").value = "#" + fgt;

    // Accent
    if (cac != null) document.getElementById("cAcent").value = "#" + cac;
    if (acc != null) document.getElementById("bAcento").checked = (acc === "true");
    if (shd != null) document.getElementById("bSombra").checked = (shd === "true");

    // Theming stuff
    if (thm != null) document.getElementById("ddTheme").value = thm;
    if (pal != null) document.getElementById("ddPalette").value = pal;

    if (ftn != null) document.getElementById("ddFuenteN").value = ftn;
    if (ftb != null) document.getElementById("ddFuenteB").value = ftb;
    if (fnb != null) document.getElementById("bNegritaN").checked = (fnb === "true");
    if (fbb != null) document.getElementById("bNegritaB").checked = (fbb === "true");


    loadTheme(thm ?? 'familiar')
    reloadFont();
    document.querySelector('#cPrinc').dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('#cPrincText').dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('#cBajad').dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('#cBajadText').dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('#cAcent').dispatchEvent(new Event('input', { bubbles: true }));
}

function writeGET () {
    let bgn = document.getElementById("cPrinc").value.replace('#','');
    let fgn = document.getElementById("cPrincText").value.replace('#','');

    let bgt = document.getElementById("cBajad").value.replace('#','');
    let fgt = document.getElementById("cBajadText").value.replace('#','');

    let cac = document.getElementById("cAcent").value.replace('#','');
    let acc = document.getElementById("bAcento").checked;
    let shd = document.getElementById("bSombra").checked;

    let thm = document.getElementById("ddTheme").value;
    let pal = document.getElementById("ddPalette").value;
    
    let ftn = document.getElementById("ddFuenteN").value;
    let ftb = document.getElementById("ddFuenteB").value;
    let fnb = document.getElementById("bNegritaN").checked;
    let fbb = document.getElementById("bNegritaB").checked;

    let GETstring = "?bgn=" + bgn + "&fgn=" + fgn + "&bgt=" + bgt + "&fgt=" + fgt + "&cac=" + cac + "&acc=" + acc + "&shd=" + shd + "&thm=" + thm + "&pal=" + pal + "&ftn=" + ftn + "&fnb=" + fnb + "&ftb=" + ftb + "&fbb=" + fbb;

    url = window.location.href;
    url = url.split('?')[0] + GETstring;

	history.replaceState(history.state, '', url);
}

function reloadTheme() {
    newTheme = document.getElementById("ddTheme").value;

    loadTheme(newTheme);

    writeGET();
}

// Fills both font dropdowns from the FONTS dictionary in drawCG.js
function populateFontMenus() {
  for (const id of ['ddFuenteN', 'ddFuenteB']) {
    const dd = document.getElementById(id);
    dd.innerHTML = '';
    for (const [key, f] of Object.entries(FONTS)) dd.add(new Option(f.label, key));
    dd.value = DEFAULT_FONT;
  }
}

// Reads one dropdown + its B switch and returns the font file URL.
// Fonts without a Bold file get the B switch disabled and unchecked.
function fontFromUI(ddId, boldId) {
  const dd  = document.getElementById(ddId);
  const box = document.getElementById(boldId);
  if (!FONTS[dd.value]) dd.value = DEFAULT_FONT;
  const hasBold = FONTS[dd.value].bold !== false;
  box.disabled = !hasBold;
  if (!hasBold) box.checked = false;
  return {
    url: fontUrl(dd.value, box.checked),
    sizeFactor: FONTS[dd.value].sizeFactor ?? 1
  };
}

function reloadFont() {
  const selN = fontFromUI('ddFuenteN', 'bNegritaN');
  const selB = fontFromUI('ddFuenteB', 'bNegritaB');
  writeGET();
  loadFonts(selN, selB);
}

document.addEventListener('coloris:pick', event => {
    writeGET();
});

document.getElementById('configDiv').addEventListener('input', () => redraw());
document.addEventListener('coloris:pick', event => {
    writeGET();
    redraw();
});