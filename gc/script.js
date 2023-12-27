// Placeholder
_SCALE = 2;

let currFont;

let mainColor;
let secoColor;
let acceColor;

let mTextColor;
let sTextColor;

let textMargin = 69;

let topBarY = 780;
let topBarH = 140;

let accentW = 15;

let minBarW = 150;
let maxBarW = 400;

let botBarY = topBarY + topBarH;
let botBarH = 88;

let tanTh = 0;

function preload() {
  currFont = loadFont('https://famellad.github.io/gc/exres/Oswald-Regular.otf');
}

function setup() {
  frameRate(5);
  textAlign(LEFT, BASELINE);
  var canvas = createCanvas(1920 / _SCALE, 1080 / _SCALE);
  canvas.parent('canvasDiv');
    
  topBarY = topBarY / _SCALE;
  topBarH = topBarH / _SCALE;

  botBarY = botBarY / _SCALE;
  botBarH = botBarH / _SCALE;

  tanTh = 20 / topBarH;
}

function draw() {
  clear();
  noStroke();

  getColors();

  mText = document.getElementById('nombre').value
  sText1 = document.getElementById('bajada1').value
  sText2 = document.getElementById('bajada2').value

  y = topBarY;
  h = topBarH;
  w = 600 / _SCALE;
  l = textMargin / _SCALE;

  textFont(currFont);

  drawBigBanner( mText );

  if (sText1 != '')
    drawSmallBanner( sText1, sText2 );
}

function drawBigBanner( mText ) {
  // Calculate width
  tSize = 24; // Start assuming size 24
  saneText = sanitizeText( mText )
  textBB = currFont.textBounds(mText, 0, 0, tSize); // Get the bounding box

  bigW = textBB.w + 2*l;

  if (bigW < minBarW) {
    bigW = minBarW;

    newSize = tSize;

    for (i = tSize; i <= 30; i += 0.1) {
      textBB = currFont.textBounds(mText, 0, 0, tSize); // Get the bounding box
      if (textBB.w >= bigW - 2*l)
        break;
      tSize = i;
    }
  }

  else if (bigW > maxBarW) {
    bigW = maxBarW;

    newSize = tSize;

    for (i = tSize; i >= 1; i -= 0.1) {
      textBB = currFont.textBounds(mText, 0, 0, tSize); // Get the bounding box
      if (textBB.w <= bigW - 2*l)
        break;
      tSize = i;
    }
  }

  textH = currFont.textBounds(saneText, 0, 0, tSize).h;

  if (document.getElementById('bAcento').checked) {
    fill(acceColor);
    quad(0, y, bigW + 20 + accentW, y, bigW + accentW, y + h, 0, y + h);
  }

  fill(mainColor);
  quad(0, y, bigW + 20, y, bigW, y + h, 0, y + h); 

  fill(mTextColor);
  textSize(tSize);
  text(mText, l, (textH + h) / 2 + y);
}

function drawSmallBanner ( sText1, sText2 ) {
  ny = y + h;
  nh = 0.70 * h;

  off = nh * tanTh;
  vOffset = 0;

  tSize = 16;

  numberOfLines = 1;

  sText = sText1;
  if (sText2 != '') {
    sText += '\n' + sText2;
    tSize = 12;
    numberOfLines = 2;
  }

  saneText = sanitizeText(sText);

  textSize(tSize);
  sTextH = currFont.textBounds(saneText, 0, 0, tSize).h;
  sTextW = currFont.textBounds(sText, 0, 0, tSize).w

  if (numberOfLines == 2)
    vOffset = -sTextH + 2;

  smallW = sTextW + 2*l;

  fill(secoColor);
  quad(0, ny, smallW + off, ny, smallW, ny + nh, 0, ny + nh);

  fill(sTextColor);
  text(sText, l, ny + (nh - sTextH) / 2 + sTextH + vOffset);
}

function getColors() {
  mainColor = color(document.getElementById('cPrinc').value);
  secoColor = color(document.getElementById('cBajad').value);
  acceColor = color(document.getElementById('cAcent').value);
  mTextColor = color(document.getElementById('cPrincText').value);
  sTextColor = color(document.getElementById('cBajadText').value);
}

function sanitizeText( text ) {
  return text.toUpperCase().replace('Á','A').replace('É','E').replace('Í','I').replace('Ó','O').replace('Ú','U').replace('Ñ','N').replace(',','.').replace('\n','');
}

function bruteForceFontSize( smallen, currentSize, targetSize, text ) {
  if (smallen) {
    newSize = currentSize;

    for (i = currentSize; i >= 1; i -= 0.5) {
      newSize = i;
      b = currFont.textBounds(text, 0, 0, newSize); // Get the bounding box
      if (b.w <= targetSize)
        return newSize;
    }

    return newSize;
  }
}