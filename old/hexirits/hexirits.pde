int W = 500; int H = 500;
int nW = 0; int nH = 0;
Hexirit[][] sp; Hexirit[][] so;

void setup() {
  println("Begin");
  size (W, H);
  noStroke();

  float side = 15;
  
  float dx = 3*side;
  float dy = side*sqrt(3);
  
  nW = ceil(W/dx);
  nH = ceil(H/dx);
  
  //println("nW: " + nW + " - nH: " + nH);
  
  sp = new Hexirit[nW*2][nH*2];
  so = new Hexirit[nW*2][nH*2];

  float margin = 0.07;
  
  for (int i = 0; i < nW*2; i++) {
    for (int j = 0; j < nH*2; j++) {
      float spx = dx * (i - 0.2);
      float spy = dy * (j - 0.2);
      
      float sox = spx + dx / 2;
      float soy = spy + dy / 2;
      
      sp[i][j] = new Hexirit(spx, spy, side * (1-margin));
      so[i][j] = new Hexirit(sox, soy, side * (1-margin));
      //println("spx: " + spx + " - spy: " + spy + " - r: " + side);
      //println("sox: " + sox + " - soy: " + soy + " - r: " + side);
    }
  }
  
  //stuff();
}

void draw() {
  background (160);
  for (int i = 0; i < nW*2; i++) {
    for (int j = 0; j < nH*2; j++) {
      fill(random(20)+200, 0, 0);
      sp[i][j].display();
      fill(random(20)+200, 0, 0);
      so[i][j].display();
    }
  }
}

class Hexirit {
  float x, y;
  boolean on;
  Pt[] pts = new Pt[6];
  
  Hexirit (float x, float y, float r) {
    this.x = x; this.y = y;
    float sho = r * cos(PI / 3);
    float lon = r * sin(PI / 3);    //this.r = r;
    pts [0] = new Pt (x + r, y);
    pts [1] = new Pt (x + sho, y + lon);
    pts [2] = new Pt (x - sho, y + lon);
    pts [3] = new Pt (x - r, y);
    pts [4] = new Pt (x - sho, y - lon);
    pts [5] = new Pt (x + sho, y - lon);
    on = true;
  }
  
  void display() {
    //fill(255, 0, 0);
    int f = 8;
    if (on)
      f = 1;
    
    if (random(1000) < f)
      on = !on;
    
    if (!on)
      fill (20);
    
    beginShape();
      for (int i = 0; i < pts.length; i++)
        vertex(pts[i].X, pts[i].Y);
    endShape(CLOSE);
  }
}

class Pt {
  public float X;
  public float Y;
  
  Pt (float x, float y) {
    X = x; Y = y;
  }
}

