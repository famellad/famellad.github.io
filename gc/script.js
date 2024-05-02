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

}

function writeGET () {
    
}