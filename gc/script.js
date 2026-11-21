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
    let params = new URLSearchParams(location.search);
    let bgn = params.get('bgn'); let fgn = params.get('fgn');
    let bgt = params.get('bgt'); let fgt = params.get('fgt');
    let acc = params.get('acc'); let cac = params.get('cac');
    let thm = params.get('thm'); let pal = params.get('pal'); let fnt = params.get('fnt');

    // Name colors
    if (bgn != null) document.getElementById("cPrinc").value = "#" + bgn;
    if (fgn != null) document.getElementById("cPrincText").value = "#" + fgn;

    // Subtext colors
    if (bgt != null) document.getElementById("cBajad").value = "#" + bgt;
    if (fgt != null) document.getElementById("cBajadText").value = "#" + fgt;

    // Accent
    if (cac != null) document.getElementById("cAcent").value = "#" + cac;
    if (acc != null) document.getElementById("bAcento").checked = (acc === "true");

    // Theming stuff
    if (thm != null) document.getElementById("ddTheme").value = thm;
    if (pal != null) document.getElementById("ddPalette").value = pal;
    if (fnt != null) document.getElementById("ddFont").value = fnt;

    loadTheme(thm ?? 'familiar')
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

    let thm = document.getElementById("ddTheme").value;
    let pal = document.getElementById("ddPalette").value;
    let fnt = document.getElementById("ddFont").value;

    let GETstring = "?bgn=" + bgn + "&fgn=" + fgn + "&bgt=" + bgt + "&fgt=" + fgt + "&cac=" + cac + "&acc=" + acc + "&thm=" + thm + "&pal=" + pal + "&fnt=" + fnt;

    url = window.location.href;
    url = url.split('?')[0] + GETstring;

	history.replaceState(history.state, '', url);
}

function reloadTheme() {
    newTheme = document.getElementById("ddTheme").value;

    loadTheme(newTheme);

    writeGET();
}

document.addEventListener('coloris:pick', event => {
    writeGET();
});

document.getElementById('configDiv').addEventListener('input', () => redraw());
document.addEventListener('coloris:pick', event => {
    writeGET();
    redraw();
});