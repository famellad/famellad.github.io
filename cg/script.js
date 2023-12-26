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
  font = loadFont('https://github.com/googlefonts/OswaldFont/raw/main/fonts/otf/Oswald-Regular.otf');
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
      
  mTextColor = color(255, 255, 255);
  sTextColor = color(0, 0, 0);

  y = topBarY;
  h = topBarH;
  w = 600 / _SCALE;
  l = textMargin / _SCALE;


  drawBigBanner( 600 );
  drawSmallBanner( 600 );
  drawText();
}

function drawBigBanner( width ) {
  fill(acceColor);
  quad(0, y, w + 20 + 15, y, w + 15, y + h, 0, y + h);

  fill(mainColor);
  quad(0, y, w + 20, y, w, y + h, 0, y + h); 
}

function drawSmallBanner ( width ) {
  fill(secoColor);
  quad(0, y + h, w * 0.8 + 16, y + h, w * 0.8, y + 1.6*h, 0, y + 1.6*h);
}

function drawText() {
  textFont(font);
  
  fill(mTextColor);
  textSize(24);
  text(document.getElementById('nombre').value, l, y + h/1.5);
  
  fill(sTextColor);
  textSize(14);
  text(document.getElementById('bajada1').value, l, y + h * 1.37);
}

function getColors() {
  mainColor = color(document.getElementById('cPrinc').value);
  secoColor = color(document.getElementById('cBajad').value);
  acceColor = color(document.getElementById('cAcent').value);
}
