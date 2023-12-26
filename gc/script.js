// Placeholder
_SCALE = 2;

let font;

let mainColor;
let secoColor;
let acceColor;

let mTextColor;
let sTextColor;

let textMargin = 69;

let topBarY = 818;
let topBarH = 112;

let botBarY = topBarY + topBarH;
let botBarH = 88;

function preload() {
  //font = loadFont('Oswald-Regular.otf');
}

function setup() {
  font = loadFont('https://famellad.github.io/cg/exres/Oswald-Regular.otf');
  frameRate(5);
  var canvas = createCanvas(1920 / _SCALE, 1080 / _SCALE);
  canvas.parent('canvasDiv');
    
  topBarY = topBarY / _SCALE;
  topBarH = topBarH / _SCALE;

  botBarY = botBarY / _SCALE;
  botBarH = botBarH / _SCALE;
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

  textFont(font);

  drawBigBanner( mText );
  drawSmallBanner( sText1, sText2 );
}

function drawBigBanner( mText ) {
  fill(acceColor);
  quad(0, y, w + 20 + 15, y, w + 15, y + h, 0, y + h);

  fill(mainColor);
  quad(0, y, w + 20, y, w, y + h, 0, y + h); 

  fill(mTextColor);
  textSize(24);
  text(mText, l, y + h/1.5);
}

function drawSmallBanner ( sText1, sText2 ) {
  fill(secoColor);
  quad(0, y + h, w * 0.8 + 16, y + h, w * 0.8, y + 1.6*h, 0, y + 1.6*h);

  fill(sTextColor);
  textSize(14);
  text(sText1, l, y + h * 1.37);
}

function getColors() {
  mainColor = color(document.getElementById('cPrinc').value);
  secoColor = color(document.getElementById('cBajad').value);
  acceColor = color(document.getElementById('cAcent').value);
  mTextColor = color(document.getElementById('cPrincText').value);
  sTextColor = color(document.getElementById('cBajadText').value);
}
