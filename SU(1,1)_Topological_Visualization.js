let c = 1;
let a = 0;
// https://editor.p5js.org/javierochomil/full/OdITgp7VZ
// Code by Javierochomil (jadl98)

let ct = 0;
let ind = 0.1
let esc = 150;
let t = -1;

function setup() {
  createCanvas(800, 800, WEBGL);
  slider = createSlider(0.01, 0.5, 0.1, 0.001);
  slider.position(10, 10);
  slider.style('width', '100px');
  razon = createSlider(1, 4, 1, 1)
  razon.position(width-110, 10);
  razon.style('width', '100px')
  bot = createButton('Ver toro');
  bot.position(width/2-30,10);
  bot.mousePressed(toro);
}

function  toro() {
  t = t*(-1);
}

function draw() {
  //background(230,0,100);
  background(10);
  rotateX(-mouseY*TWO_PI/width)
  rotateY(-mouseX*TWO_PI/height)
  let sc = map(razon.value(),1,4,150,80);
  scale(sc);
  strokeWeight(1);
  let val = slider.value();
  let lin = map(val, 0.01,0.05,1,0)
  stroke(255-65*lin, 0*lin, 255-155*lin)
  ind = slider.value();
  c = razon.value();
  for (let a = 0; a <TWO_PI+0.01; a+=ind){
    rotateY(a);
    //let x = map(mouseX, 0, width+20, 0, 255);
    fill(190-slider.value()*190, 0, 100-slider.value()*100);
    ellipse(1,0,c*sin(a));
    rotateY(-a);
  }
  if (t == 1){
    rotateX(PI/2);
  noFill();
  stroke(200);
  torus(1,c/2);
  }

  
}


