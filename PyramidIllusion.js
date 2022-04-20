// https://editor.p5js.org/javierochomil/full/7xtBdrLWQ
// Code by Javierochomil (jadl98)

let angle = 0;
let b = 1;
let theta = 0;
function setup() {
  createCanvas(800, 800, WEBGL);
}

function draw() {
  background(60);
  ortho();
  rotateX(angle);
  rotateZ(theta);
  stroke(255);
  strokeWeight(1);
  fill(0);
  beginShape(TRIANGLES);
    for (let i = 0; i < 5; i++){
    vertex(100*cos(i*TWO_PI/5), 100*sin(i*TWO_PI/5),0);
    vertex(0,0,110);
    vertex(100*cos((i+1)*TWO_PI/5), 100*sin((i+1)*TWO_PI/5),0);
  }
  endShape();
  angle += b*0.03;
  theta -= b*0.01;
  if (abs(angle) > 3*PI){
    angle = 0;
    b = -1*b;
  }
}
