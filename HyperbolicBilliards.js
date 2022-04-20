//https://editor.p5js.org/javierochomil/full/eUysngiVc
// Code by Javierochomil (jadl98)


let iguales = 0;
let count = 0;
let epsilon = 2;
let puntos = [];
let arcos = [];
let PuntosExtremos = [];
let puntosMedios = [];
let angDeP = 1;
let tamañoDePuntos = 10;
let RadioPoincare = 340;
let pol = 6;
let particleSize = 3;
let particles = [];
let flows = [];
let times = [];
let bounds = [];
let colliding = false;
let seeFlows = false;
let seeTangents = false;
let inCover = false;
let rot=0;
let traza = false;

// Necesito mejorar el update

// Nota: el sistema de colisión es a posteriori. Una mejor estrategia sería calcular correctamente el punto de intersección exacto,
// Pero pienso que la diferencia es mínima
// El problema es que calculo n distancias en cada cuadro
// ¿Es más eficiente revisar el color del píxel? 

class particle {
  
  constructor(x, y, vx, vy, insideFundamental=1) {
    this.x = x;
    this.y = y;
    this.position = createVector(this.x, this.y);
    this.magnitude = this.position.mag();
    this.firstx = x;
    this.firsty = y;
    //this.n = n;
    this.insideFundamental = insideFundamental;
    this.closest = [createVector(0, 0)];
    this.index = null;
    this.v = new p5.Vector(vx, vy);
    // if (n == 1) {
    //   this.v.setMag(5);
    // }
    let phi = this.v.heading();
    this.bounds = bounds;
    
  }

  update() {
    
    //Aquí debería hacer la corrección de la posición
    
    
    //hypMag(this.v, this.x, this.y, 3040)
    
    this.x = this.x + this.v.x;
    this.y = this.y + this.v.y;
    colliding = false;
    
  }
  
  show() {
    push(); 
    noStroke(); 
    fill(0);
    ellipse(this.x, this.y, 2*particleSize, 2*particleSize); 
    pop();
  }
  
  checkCollision() {
    if (this.insideFundamental == 0) {
      return;
    }
    let c = this.closest;
    this.check = this.v.copy();
    this.check.mult(1/2*this.check.mag());
    //line(this.x, this.y, c[0].x, c[0].y)
    if (dist(this.x+this.check.x, this.y+this.check.y, c[0].x, c[0].y) < c[1]) { // Si crucé, reflejo en donde cruzo
      
      colliding = true;
      
      let currentX = this.x;
      let currentY = this.y
      
      let tan = tangent(c[0].x, c[0].y, c[1]);
      let mirror = tan(currentX, currentY);
      let ref = reflectOn(mirror.x, mirror.y);
      
      if (seeTangents) {
        push(); stroke(0, 255, 0); line(currentX, currentY, mirror.x+currentX, mirror.y+currentY); pop(); 
      }
      
      let newV = this.v;

      newV.mult(40);
      if (seeTangents) {
        push(); stroke(0, 0, 255); line(currentX, currentY, newV.x+currentX, newV.y+currentY); pop();              
      }
      newV = ref(newV.x, newV.y);
      if (seeTangents) {
        push(); stroke(255, 0, 0); line(currentX, currentY, newV.x+currentX, newV.y+currentY); pop();        
      }

      this.v = newV
      
      let pos = createVector(currentX, currentY)
      let f = flowFromVector(pos, newV.x, newV.y);
      flows[this.index] = f;
    }
  }
  
}

function hypMag(vector, posx, posy, defaultMag) {
  
  let mg = posx**2+posy**2;
  let m = 300*vector.mag();
  let newMag = 2*defaultMag/(RadioPoincare-mg);
  vector.setMag(newMag);
  
}


function tesselate(level) {
  
}

function reflectOn(x, y) {

  return function w(ux, uy) {
    let v = createVector(-y, x);
    let m = v.mag(); 
    m = m*m;
    let dot = ux*v.x + uy*v.y;
    let xx = ux-2*(dot/m)*v.x;
    let yy = uy-2*(dot/m)*v.y;
    let reflection = createVector(xx, yy);
    return reflection
  }

}

function tangent(x, y, r) { //Recibe centro del círculo y radio
  return function(atx, aty) {
    let xx = atx-x;
    let yy = aty-y;
    let pt = createVector(-yy, xx);
    return pt;
  }
}

let randomSides = false;
function convexPolygon(sides) {
  let vertices = [];
  let n = sides;
  let currentAngle = 0;
  for (let i = 0; i < n+1; i++){
    let ang = i*TWO_PI/n;
    if ((randomSides) && (i > 0)) {
      currentAngle = random(currentAngle, currentAngle+TWO_PI/n)
      ang = currentAngle;
    }
    if (i == n) {
      ang = 0;
    }
    let x = 340*cos(ang); 
    let y = 340*sin(ang);

    //let v = p5.Vector.fromAngle(ang, 340);
    let v = new p5.Vector(x, y);
    vertices.push(v);
    if (i > 0){
      let a = crearArco(vertices[i], vertices[(i-1)]);
    arcos.push(a);
    let c = createVector(a[0], a[1]);
    let centerOfBound = [c, a[2]];
    bounds.push(centerOfBound);
    } 
  }
}


function reflectOnArc(c_arcox, c_arcoy) {
  let x = c_arcox; 
  let y = c_arcoy;
  
}

function arg(z){
  if (z.heading() < 0){
    return -1*z.heading();
  } else {
    return TWO_PI - z.heading();
  }
}

function setup() {
  canvas = createCanvas(700, 700);
  boton = createButton('Limpiar canvas');
  boton.position(width-110, height-40);
  boton.mousePressed(borrar);
  convexPolygon(pol);
  background(255);
}

function borrar() {
  arcos = [];
  convexPolygon(pol);
  puntos = [];
  PuntosExtremos = [];
  puntosMedios = [];
  count = 0;
  particles = [];
  flows = [];
  background(255);
}

function crearArco(p1, p2, color = 0, punteo = 0) {
  let col = [0,0,0];
  if (color > 0){
    col[color-1]= 255;
  }
  //col.dict[color]=255;
  let c; //cuidado con el scope de c
  let m1 = p1.mag();
  let m2 = p2.mag();
  let arr = sort([m1, m2]);
  if(arr[0]==0){
    if (arr[0] == m2){
      let temporal = p1;
      p1 = p2;
      p2 = temporal;
    }
    return  [p1, p2]
  }
  if (arr[0] > 339.99) { //esto implica que ambos están en S1
    let t1 = p1, t2 = p2;
    let a = t1.x**2+t1.y**2, b = t2.x**2+t2.y**2;
    det = t1.x*t2.y-t1.y*t2.x;
    a = a/det; b = b/det;
    let cx = t2.y*a-t1.y*b; 
    let cy = t1.x*b-t2.x*a;
    let cent = new p5.Vector(cx, cy);
    let r = p5.Vector.sub(t1,cent);
    let rad = r.mag();
    c = [cent, rad];
    // return c;
    
  } else { //uso CircPor3Puntos en p1, p2 y el inverso de p1
    if (arr[0]==m1){
      chico = p1;
    } else {
      chico = p2;
    }
    m = chico.mag();
    let inv = p5.Vector.mult(chico, (340/m)**2)
    c = CircPorTresPuntos(p1, p2, inv);
    
  }
  let centro = c[0];
  let T1 = p5.Vector.sub(p1, centro);
  let T2 = p5.Vector.sub(p2, centro);
  let start = 0, stop = 0;
    if (T1.x*T2.y-T1.y*T2.x >0){
      start = T1.heading();
      stop = T2.heading(); 
    } else {
      start = T2.heading();
      stop = T1.heading();
    }
    return [c[0].x, c[0].y, c[1], start, stop, col, punteo];
}

function CircPorTresPuntos(a, b, c) {
  let ba = p5.Vector.sub(b, a) , ca = p5.Vector.sub(c, a);
  let bma = p5.Vector.add(b, a), cma = p5.Vector.add(c, a);
  let kba = 0.5 * (p5.Vector.dot(bma, ba)), kca = 0.5 * (p5.Vector.dot(cma, ca));
  let det = ba.x * ca.y - ba.y * ca.x;
  let cx = (1 / det) * (ca.y * kba - ba.y * kca), cy = (1 / det) * (ba.x * kca - ca.x * kba);
  let centro = new p5.Vector(cx, cy);
  let oa = p5.Vector.sub(centro, a);
  let r = oa.mag();
  return [centro, r];

}

function extremos(p1, p2){
  let e1 = new p5.Vector();
  let e2 = new p5.Vector();
  let m1 = p1.mag();
  let m2 = p2.mag();
  let arr = sort([m1, m2])
  // if (m1 > 339.99 || m2 > 339.99){
  //   if (m1 > 339.99){
  //     e1 = p1;
  //   }
  //   if (m2 > 339.99){
  //     e2 = p2;
  //   }
  //   return [e1, e2];
  // } 
  let det = p1.x*p2.y-p2.x*p1.y;
  if (abs(det) < 0.001){ //si la geodésica es una recta
    if (arr[0] == m1){
     e2 = p5.Vector.mult(p2, 340/p2.mag());
     e1 = p5.Vector.mult(e2, -1)
    } else{
      e1 = p5.Vector.mult(p1, 340/p1.mag());
      e2 = p5.Vector.mult(e1, -1)
    }
  } else {
    let a = crearArco(p1, p2);
    let cent = createVector(a[0], a[1]);
    let ang = acos(340/(cent.mag()));
    cent.mult(340/cent.mag());
    e1.x = cos(ang)*cent.x - sin(ang)*cent.y;
    e1.y = sin(ang)*cent.x + cos(ang)*cent.y;
    e2.x = cos(-1*ang)*cent.x - sin(-1*ang)*cent.y;
    e2.y = sin(-1*ang)*cent.x + cos(-1*ang)*cent.y; 
  }
  return [e1, e2]
}

function phi(z, z0) { 
  
  //la función está dada por phi_z = az - az0 / a - a * conjz0*z 
  // aunque alpha = 1/sqrt(1-|z0|^2) para que esté en SU(1,1), al 
  // final alpha es innecesaria y el cálculo puede hacerse sin ella
  // Nota que cuando z_0 tiene norma 1, el cálculo no funciona.
  // Para resolverlo, engañamos un poco el ojo
  if (z0.mag() == 0) {
    return z0;
  }
  let SobreFrontera = -1;
  if (z0.mag()>338){
    z0.mult(0.999);
    SobreFrontera = 1;
  }
  let x0 = z0.x/340;
  let y0 = z0.y/340;
  let x = z.x/340;
  let y = z.y/340;
  let Dx = 1 - x0*x - y0*y;  //coordenadas del denominador
  let Dy = x*y0 - x0*y;
  let k = 1/(Dx*Dx + Dy*Dy) // recíproco de la norma cuadrada del denominador
  let Rx = 340*k*((x-x0)*Dx + (y-y0)*Dy);
  let Ry = 340*k*((x-x0)*(-1)*Dy + (y-y0)*Dx);
  let res = new p5.Vector(Rx, Ry);
  if (SobreFrontera == 1){
    z0.mult(1/0.999);
  }
  return res;
}

function draw() {
  // if (colliding) {
  //   frameRate(1);
  // } else {
  //   frameRate(60);
  // }
  if (!traza) {
    background(255, 20);
  }
  //background(255);
  translate(width / 2, height / 2);
  //push(); fill(0); ellipse(0,0,particleSize, particleSize); pop();
  noFill();
  stroke(0);
  strokeWeight(2);
  ellipse(0, 0, height - 20);
  let v = new p5.Vector(mouseX - width / 2, mouseY - height / 2, 0);
  if ((mouseX - width / 2) ** 2 + (mouseY - height / 2) ** 2 > 340 ** 2) {
    v.normalize();
    v.mult(340);
  }
  fill(0);
  //ellipse(100,10,10);
  //rotate(rot);
  for (let a of arcos) {
    
    noFill();
     //ellipse(a[0], a[1], 2*a[2]);
    canvas.drawingContext.setLineDash([])
    if (a[6]==1) {
      canvas.drawingContext.setLineDash([5, 5])
    }
    stroke(a[5]); 
    if (a.length == 2){
      line(a[0].x, a[0].y, a[1].x, a[1].y);
    } else {
      arc(a[0], a[1], 2*a[2], 2*a[2],a[3], a[4]); 
    }
  }  canvas.drawingContext.setLineDash([])


  if (count % 2 == 1) {
    let v = puntos[count-1];
    let x = mouseX-width/2;
    let y = mouseY-height/2;
    disp = new p5.Vector(x-v.x, y-v.y)
    if (disp.mag() > 15) {
      disp.setMag(15);
       //x = v.x + disp.x;
       //y = v.y + disp.y;
    }
    drawArrow(v, disp, 'red');
    
  }
  
  for (let i = 0; i < particles.length; i++) {
    particles[i].show();
    particles[i].update();
    if (particles[i].insideFundamental == 1) {
      particles[i].checkCollision();
    }
    particles[i].index = i;
    let f = flows[i];
    
    if (seeFlows) {
       push(); noFill(); stroke(255, 255, 0); ellipse(f[0].x, f[0].y, 2*f[1]); pop();
    }
   
    
    //particles[i].correct()
    let newPoint = new p5.Vector(particles[i].x, particles[i].y);
    let toCenter = p5.Vector.sub(newPoint, f[0]);
    toCenter.setMag(f[1]);
    //let correctedPoint = p5.Vector.add(toCenter,f[0]);
    
    // ellipse(correctedPoint.x, correctedPoint.y, 5);
    // line(f[0].x, f[0].y, particles[i].x, particles[i].y);
    // push(); fill(255, 0, 0); ellipse(toCenter.x, toCenter.y, 10); pop();
    
    let newVelocity = new p5.Vector(-toCenter.y, toCenter.x);
    
    // let dx = particles[i].v.mag();
    // print(correctedPoint.mag());
    // let pos = (340*340 - sq(correctedPoint.mag()));
    // let newMag = 2*dx/pos;
    newVelocity.setMag(3);
    
    
    //push(); fill(0, 255, 0); ellipse(newVelocity.x, newVelocity.y, 10); pop();
    let dt = p5.Vector.dot(newVelocity, particles[i].v);
    if (dt < 0) {
      newVelocity.x = -newVelocity.x;
      newVelocity.y = -newVelocity.y;
    }
    particles[i].v = newVelocity;
    
    //line(0, 0, 30*newVelocity.x, 30*newVelocity.y)
    
    
    // Corrección artificial al avance dado por dv
//     particles[i].x = correctedPoint.x; 
//     particles[i].y = correctedPoint.y;
    
    
//     if (particles[i].x+particles[i].y>480) {
//       particles.pop(i);
//       flows.pop(i);
//     }
  
    let x = particles[i].x; 
    let y = particles[i].y;
    let distances = [];
    let dict = {}
    for (let b of bounds) {
      let cx = b[0].x
      let cy = b[0].y;
      let d = dist(x, y, cx, cy)
      dict[d] = b;
      distances.push(d);
      
    }
    distances.sort();
    let s = distances[0];
    let c = dict[s];
    particles[i].closest = c;
    //line(x, y, c[0].x, c[0].y)
  
    
    // Draw complete geodesic throught particle and with given tangent vector
  //ellipse(f[0].x, f[0].y, 2*f[1]);
  
    
  }
  
  rot+=0.001;
}


function flowFromVector(point, vectorx, vectory) {
  
  //Calcula el centro del círculo perpendicular a D que pasa por point
  //Y tiene a V=(vectorx, vectory) como velocidad en point
  
  let p = point;
  let mag = p.mag();
  let inv = p5.Vector.mult(p, (340/mag)**2);
  let v = p5.Vector.sub(inv, p);
  let w = new p5.Vector(vectorx, vectory)
  let m = p5.Vector.add(inv, p);
  m.div(2);
  let a = p5.Vector.dot(w, p);
  let b = p5.Vector.dot(v, m);
  let det = w.x*v.y - w.y*v.x;
  
  
  let Cx = (1/det)*( v.y*a - w.y*b);
  let Cy = (1/det)*(-v.x*a + w.x*b);
  let C = new p5.Vector(Cx, Cy);
  let r = dist(point.x, point.y, C.x, C.y)
  
//   // Calculamos la velocidad en el tiempo t del flujo geodésico
//   //Vamos a dar una parametrización reescalada
//   function flow(t) {
//     let dv_t = new p5.Vector();
//     if (t == 0) {
//       dv_t = w;
//     } else {
//       let sum = p5.Vector.add(p, w)
//       let s = sum.mag();
//       let frac = t*(w.mag()/s);
//       let ang = asin(frac)
//       //print(w);
//       dv_t = w.copy()
//       dv_t.rotate(frac)
//       dv_t.mult(1/20);
      
//     }
//     return dv_t;
//   }
  
  return [C, r]; 
}


function drawArrow(base, vec, myColor) {
  push();
  stroke(myColor);
  strokeWeight(3);
  fill(myColor);
  translate(base.x, base.y);
  line(0, 0, vec.x, vec.y);
  rotate(vec.heading());
  let arrowSize = 7;
  translate(vec.mag() - arrowSize, 0);
  triangle(0, arrowSize / 2, 0, -arrowSize / 2, arrowSize, 0);
  pop();
}


function mousePressed() {
  
  
  if (mouseX > width -111 && mouseY > height - 41){ //evita comportamiento cuando estoy sobre el botón de clear canvas. Podría hacerlo más bonito
  return;
  }
  count++;
  
  let p = new p5.Vector(mouseX - width / 2, mouseY - height / 2, 0);
  if ((mouseX - width / 2) ** 2 + (mouseY - height / 2) ** 2 > 340 ** 2) {
    p.normalize();
    p.mult(340);
  }
  if (p.mag() < 7){
    p.x = 0; p.y = 0;
  }
  puntos.push(p);
  
  if (count > 0 && count % 2 == 0) {
    let pt = puntos[count-2];
    p = new particle(pt.x, pt.y, disp.x, disp.y);
    particles.push(p);
    f = flowFromVector(pt, disp.x, disp.y);
    flows.push(f);
    if (inCover) {
      tP = new particle(pt.x, pt.y, disp.x, disp.y, 0);
      particles.push(tP);
      flows.push(f);
    }
    let t = 0; times.push(t);
  }
}
