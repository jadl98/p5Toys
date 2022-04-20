// https://editor.p5js.org/javierochomil/full/nHn7bWw9W
// Code by Javierochomil (jadl98)


let fas = 0;
class poli  {
  
  constructor(lados, frec, amp, fase, cx, cy, dirección) {  
    this.cx = cx;
    this.cy = cy;
    this.lados = lados;
    this.frec = frec;
    this.amp = amp;
    this.fase = fase;
    this.dir = dirección
    this.valores = [];
    this.step = 1;
    this.stop = 80;
    for (let x = 0; x < 2*this.stop; x += this.step) {
      let y = (x/(80))**5*sin(this.fase + TWO_PI * x / this.frec) * this.amp + this.cy;
      this.valores.push(y);
    }
  
  }
  display() {

    for (let i = 0; i < this.lados; i++) {
      push();
      noStroke();
      rotate(i*TWO_PI/this.lados);
      let size = map(frameCount, 0, 10000, 3, 10);
      for (let x = 0; x < this.stop; x+= this.step) {
        ellipse(x+this.cx, this.cy+this.valores[x], size)
      }
      pop();
    } 
  }
  update() { 
    this.fase += 0.1;    
  }
}

let pol;

function setup() {
  createCanvas(400, 400);
  pol = new poli(3, 80, 20, 0, 0, 0, 0)
  
}

function draw() {
  translate(width/2, height/2);
  background(0);
  pol.display();
  if (fas < 7.5){
   fasprima = fas 
  }
  fas += 0.1
  pol = new poli(7,200-25*fasprima, 50, fas, 0, 0, 0)
  //probar con pol = new poli(10, fas, 10*fas, 0 ,0 , 0 ,0)
  
}
