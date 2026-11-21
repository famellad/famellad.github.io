// Placeholder
const _SCALE = 1;

let currFont;

let mainColor;
let secoColor;
let acceColor;

let mTextColor;
let sTextColor;

let mL, mR;

let theme = {};

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

function preload() {
  currFont = loadFont('exres/Oswald-Regular.otf');
}

function setup() {
  pixelDensity(_SCALE); // TODO add a checkbox if the user wants it in 4K?
  noLoop()
  textAlign(LEFT, BASELINE);
  var canvas = createCanvas(1920, 1080);
  canvas.parent('canvasDiv');
}

function draw() {
  clear(); // Clear the image to let the user know something is happening

  if (!theme.img) return; // Wait for a theme to be loaded before attempting any draws

  noStroke();

  getColors();

  let mText = document.getElementById('nombre').value
  let sText1 = document.getElementById('bajada1').value
  let sText2 = document.getElementById('bajada2').value

  y = theme.gcY;
  h = theme.nomH;

  mL = theme.textMarginL ?? 0;
  mR = theme.textMarginR ?? 0;

  textFont(currFont);

  drawBigBanner( mText );

  if (sText1 != '')
    drawSmallBanner( sText1, sText2 );
}

function drawBigBanner( mText ) {
  // Calculate width
  const START_SIZE = 48;
  const pad = mL + mR;
  let tSize = START_SIZE;
  let saneText = superSanitizeString(mText);

  let bigW = currFont.textBounds(mText, 0, 0, START_SIZE).w + pad;

  if (bigW < theme.minBarW) {            // short text: bar grows to min, text scales up (max 60)
    bigW = theme.minBarW;
    tSize = fitTextSize(mText, START_SIZE, bigW - pad, START_SIZE, 60);
  }
  else if (bigW > theme.maxBarW) {       // long text: bar stops at max, text shrinks to fit (min 2)
    bigW = theme.maxBarW;
    tSize = fitTextSize(mText, START_SIZE, bigW - pad, 2, START_SIZE);
  }

  let textH = currFont.textBounds(saneText, 0, 0, tSize).h;


    bigW = Math.ceil(bigW)
    tint(mainColor);
    image(theme.img.nbod, 0, y, bigW, h);
    image(theme.img.ntip, bigW - 1, y);

    if (document.getElementById("bAcento").checked) {
      tint(acceColor);
      if (theme.accAnchor == "ntip") image(theme.img.acc, bigW + theme.img.ntip.width + theme.accOffset - 1, y);
      else if (theme.accAnchor == "left") image(theme.img.acc, theme.accOffset - 1, y);
    }

    fill(mTextColor);
    textSize(tSize);
    text(mText, mL, (textH + h) / 2 + y);
  }

function drawSmallBanner ( sText1, sText2 ) {
  ny = y + h;
  nh = theme.bajH;

  vOffset = 0;

  tSize = 32;

  numberOfLines = 1;

  sText = sText1;
  if (sText2 != '') {
    sText += '\n' + sText2;
    tSize = 24;
    numberOfLines = 2;
  }

  saneText = superSanitizeString(sText);

  textSize(tSize);
  sTextH = currFont.textBounds(saneText, 0, 0, tSize).h;
  sTextW = currFont.textBounds(sText, 0, 0, tSize).w

  if (numberOfLines == 2)
    vOffset = -sTextH + 16;

  smallW = sTextW + mL + mR;

  smallW = Math.ceil(smallW)
  tint(secoColor);
  image(theme.img.bbod, 0, ny, smallW, nh);
  image(theme.img.btip, smallW - 1, ny);  

  fill(sTextColor);
  text(sText, mL, ny + (nh - sTextH) / 2 + sTextH + vOffset);
}

function getColors() {
  mainColor = color(document.getElementById('cPrinc').value);
  secoColor = color(document.getElementById('cBajad').value);
  acceColor = color(document.getElementById('cAcent').value);
  mTextColor = color(document.getElementById('cPrincText').value);
  sTextColor = color(document.getElementById('cBajadText').value);
}

// Returns the font size at which `txt` is exactly `targetW` wide, clamped to [minS, maxS]
function fitTextSize(txt, startSize, targetW, minS, maxS) {
  const w = currFont.textBounds(txt, 0, 0, startSize).w;
  if (!w) return startSize;                       // empty text
  return constrain(startSize * targetW / w, minS, maxS);
}