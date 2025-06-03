// https://stackoverflow.com/questions/8126623/downloading-canvas-element-to-an-image
function downloadCanvasAsImage(){
    let canvasImage = document.getElementById('defaultCanvas0').toDataURL('image/png');
    
    // this can be used to download any image from webpage to local disk
    let xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function () {
        let a = document.createElement('a');
        a.href = window.URL.createObjectURL(xhr.response);
        a.download = filenameString();
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
      };
      xhr.open('GET', canvasImage); // This is to download the canvas Image
      xhr.send();
}

function superSanitizeString (inStr) {
    inStr = inStr.replace("(", "").replace(")", "");
    inStr = inStr.replace(",", "").replace(".", "");
    inStr = inStr.toLowerCase();
    inStr = inStr.replace("ñ", "n");
    inStr = inStr.replace("á", "a");
    inStr = inStr.replace("é", "e");
    inStr = inStr.replace("í", "i");
    inStr = inStr.replace("ó", "o");
    inStr = inStr.replace("ú", "u");
    inStr = inStr.replace("ú", "u");
    inStr = inStr.replace("ç", "c");
    inStr = inStr.toUpperCase();

    return inStr;
}

function filenameString() {
    tmp = document.getElementById('nombre').value;

    tmp = superSanitizeString(tmp);
    tmp = Math.floor(Date.now() / 1000).toString() + "-" + tmp;

    return tmp + ".png";
}

function readGET () {
    // bgn fgn
    // bgt fgt
    // acc cac
    // nam
    // ti1 ti2
    let params = new URLSearchParams(location.search);
    let bgn = params.get('bgn'); let fgn = params.get('fgn');
    let bgt = params.get('bgt'); let fgt = params.get('fgt');
    let acc = params.get('acc'); let cac = params.get('cac');

    if (bgn != null)
        document.getElementById("cPrinc").value = "#" + bgn.toString();
    if (fgn != null)
        document.getElementById("cPrincText").value = "#" + fgn.toString();

    if (bgt != null)
        document.getElementById("cBajad").value = "#" + bgt.toString();
    if (fgt != null)
        document.getElementById("cBajadText").value = "#" + fgt.toString();

    if (cac != null)
        document.getElementById("cAcent").value = "#" + cac.toString();

    if (acc != null)
        document.getElementById("bAcento").checked = (acc === "true");

    document.querySelector('#cPrinc').dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('#cPrincText').dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('#cBajad').dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('#cBajadText').dispatchEvent(new Event('input', { bubbles: true }));
    document.querySelector('#cAcent').dispatchEvent(new Event('input', { bubbles: true }));
}

function writeGET () {
    // ?bgn=000000&fgn=ff0000&bgt=00ff00&fgt=0000ff&cac=ffff00&acc=False
    let bgn = document.getElementById("cPrinc").value.replace('#','');
    let fgn = document.getElementById("cPrincText").value.replace('#','');

    let bgt = document.getElementById("cBajad").value.replace('#','');
    let fgt = document.getElementById("cBajadText").value.replace('#','');

    let cac = document.getElementById("cAcent").value.replace('#','');
    let acc = document.getElementById("bAcento").checked;

    let GETstring = "?bgn=" + bgn + "&fgn=" + fgn + "&bgt=" + bgt + "&fgt=" + fgt + "&cac=" + cac + "&acc=" + acc;

    url = window.location.href;
    url = url.split('?')[0] + GETstring;

    //url.searchParams.set('bgn', bgn)

	history.replaceState(history.state, '', url);
}

document.addEventListener('coloris:pick', event => {
    writeGET();
});