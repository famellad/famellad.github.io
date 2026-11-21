// Placeholder
const _SCALE = 1;

let mainColor;
let secoColor;
let acceColor;

let mTextColor;
let sTextColor;

let mL, mR;

let layerMain, layerSmall;

let theme = {};

const FONTS = {
  cabinSketch: { label: 'Cabin Sketch', file: 'CabinSketch', sizeFactor: 1.1, bold: true },
  cantarell:   { label: 'Cantarell',    file: 'Cantarell',   sizeFactor: 1.2, bold: true },
  gentiumPlus: { label: 'Gentium Plus', file: 'GentiumPlus', sizeFactor: 1.2, bold: true },
  kalam:       { label: 'Kalam',        file: 'Kalam',       sizeFactor: 1.2, bold: true },
  oswald:      { label: 'Oswald',       file: 'Oswald',      sizeFactor: 1.0, bold: true },
  playfair:    { label: 'Playfair',     file: 'Playfair',    sizeFactor: 1.3, bold: true },
  /*zillaSlab:   { label: 'Zilla Slab',   file: 'ZillaSlab',   sizeFactor: 1.1, bold: true },*/
};
const DEFAULT_FONT = 'oswald';

let fontN, fontB;
let sizeN = 1, sizeB = 1;
const fontCache = {}; // url -> Promise<p5.Font>, so each file is only fetched once
let fontLoadId = 0; // To handle async and always get the latest change

async function loadTheme(name) {
  const base = `themes/${name}/`;

  const res = await fetch(base + 'theme.json');
  if (!res.ok) throw new Error(`Can't load ${res.url} (HTTP ${res.status})`);
  const data = await res.json();

  const parts = ['nbod', 'ntip', 'bbod', 'btip', 'acc'];
  const imgs = await Promise.all(parts.map(p =>
    new Promise((resolve, reject) =>
      loadImage(base + p + '.png', resolve,
                () => reject(new Error(`Missing image: ${base + p}.png`)))
    )
  ));

  data.img = Object.fromEntries(parts.map((p, i) => [p, imgs[i]]));
  theme = data;
  redraw();
}

function setup() {
  pixelDensity(_SCALE); // TODO add a checkbox if the user wants it in 4K?
  noLoop()
  textAlign(LEFT, BASELINE);
  const canvas = createCanvas(1920, 1080);
  canvas.parent('canvasDiv');

  layerMain = createGraphics(1920, 1080);
  layerSmall = createGraphics(1920, 1080);
}

function draw() {
  clear(); // Clear the image to let the user know something is happening

  if (!theme.img || !fontN || !fontB) return; // Wait for theme and fonts

  noStroke();

  getColors();

  let mText = document.getElementById('nombre').value
  let sText1 = document.getElementById('bajada1').value
  let sText2 = document.getElementById('bajada2').value

  y = theme.gcY;
  h = theme.nomH;

  mL = theme.textMarginL ?? 0;
  mR = theme.textMarginR ?? 0;

  if (sText1 != '')
    drawSmallBanner( sText1, sText2 );

  drawBigBanner( mText );
}

function drawBigBanner( mText ) {
  // Calculate width
  
  const START_SIZE = 48 * sizeN;
  const MAX_SIZE = 60 * sizeN;
  const pad = mL + mR;
  let tSize = START_SIZE;
  //let saneText = superSanitizeString(mText);

  textFont(fontN);

  let bigW = fontN.textBounds(mText, 0, 0, START_SIZE).w + pad;

  if (bigW < theme.minBarW) { // short text: bar grows to min, text scales up (max 60)
    bigW = theme.minBarW;
    tSize = fitTextSize(fontN, mText, START_SIZE, bigW - pad, START_SIZE, MAX_SIZE);
  }
  else if (bigW > theme.maxBarW) {       // long text: bar stops at max, text shrinks to fit (min 2)
    bigW = theme.maxBarW;
    tSize = fitTextSize(fontN, mText, START_SIZE, bigW - pad, 2, START_SIZE);
  }

  //let textH = fontN.textBounds(saneText, 0, 0, tSize).h;
  // Cap height of this font at this size: a fixed reference, so the baseline
  // doesn't depend on which letters were typed
  let capH = fontN.textBounds('H', 0, 0, tSize).h;

    bigW = Math.ceil(bigW)
    layerMain.clear();
    layerMain.tint(mainColor);
    layerMain.image(theme.img.nbod, 0, y, bigW, h);
    layerMain.image(theme.img.ntip, bigW - 1, y);

    if (document.getElementById("bAcento").checked) {
      layerMain.tint(acceColor);
      if (theme.accAnchor == "ntip") layerMain.image(theme.img.acc, bigW + theme.img.ntip.width + theme.accOffset - 1, y);
      else if (theme.accAnchor == "nleft") layerMain.image(theme.img.acc, theme.accOffset - 1, y);
    }

    drawWithShadow(layerMain);

    fill(mTextColor);
    textSize(tSize);
    text(mText, mL, (capH + h) / 2 + y);
  }

function drawSmallBanner ( sText1, sText2 ) {
  ny = y + h;
  nh = theme.bajH;

  vOffset = 0;

  tSize = 32 * sizeB;

  numberOfLines = 1;

  sText = sText1;
  if (sText2 != '') {
    sText += '\n' + sText2;
    tSize = 24 * sizeB;
    numberOfLines = 2;
  }

  saneText = superSanitizeString(sText);

  textFont(fontB);
  textSize(tSize);

  let capH = fontB.textBounds('H', 0, 0, tSize).h;
  //let sTextH = fontB.textBounds(saneText, 0, 0, tSize).h;
  let sTextW = fontB.textBounds(sText, 0, 0, tSize).w

  if (numberOfLines == 2)
    vOffset = -capH;

  let smallW = sTextW + mL + mR;

  smallW = Math.ceil(smallW);
  layerSmall.clear();
  layerSmall.tint(secoColor);
  layerSmall.image(theme.img.bbod, 0, ny, smallW, nh);
  layerSmall.image(theme.img.btip, smallW - 1, ny);
  drawWithShadow(layerSmall);

  fill(sTextColor);
  text(sText, mL, ny + (nh - capH) / 2 + capH + vOffset);
}

function drawWithShadow(layer) {
  push();
  noTint();

  if (theme.shadow && document.getElementById("bSombra").checked) {
    const ctx = drawingContext;
    ctx.shadowColor   = `rgba(0, 0, 0, ${theme.shadow.opacity})`;
    ctx.shadowBlur    = theme.shadow.blur;
    ctx.shadowOffsetX = theme.shadow.offsetX;
    ctx.shadowOffsetY = theme.shadow.offsetY;
  }
  image(layer, 0, 0);
  pop();
}

function getColors() {
  mainColor = color(document.getElementById('cPrinc').value);
  secoColor = color(document.getElementById('cBajad').value);
  acceColor = color(document.getElementById('cAcent').value);
  mTextColor = color(document.getElementById('cPrincText').value);
  sTextColor = color(document.getElementById('cBajadText').value);
}

// Returns the font size at which `txt` is exactly `targetW` wide, clamped to [minS, maxS]
function fitTextSize(font, txt, startSize, targetW, minS, maxS) {
  const w = font.textBounds(txt, 0, 0, startSize).w;
  if (!w) return startSize;
  return constrain(startSize * targetW / w, minS, maxS);
}

function fontUrl(key, bold) {
  return `exres/${FONTS[key].file}-${bold ? 'Bold' : 'Regular'}.ttf`;
}

function getFont(url) {
  if (!fontCache[url]) {
    fontCache[url] = new Promise((resolve, reject) =>
      loadFont(url, resolve, () => {
        delete fontCache[url];                       // don't cache failures
        reject(new Error(`Missing font: ${url}`));
      }));
  }
  return fontCache[url];
}

async function loadFonts(selN, selB) {
  const id = ++fontLoadId;
  const [n, b] = await Promise.all([getFont(selN.url), getFont(selB.url)]);
  if (id !== fontLoadId) return;
  fontN = n;  sizeN = selN.sizeFactor;
  fontB = b;  sizeB = selB.sizeFactor;
  redraw();
}