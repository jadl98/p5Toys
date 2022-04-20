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
let images = []
let beltramiLines = []

// Hacer todo independiente del 340/540 

//refactorizar todo esto para que los arcos sean clases
//me gustaría más bien que en draw se dibujen todas las instancias de un arco
//usando el atributo arc.render()
//para encargarnos en un sólo código de tanto el caso en el que arco es una línea
//como cuando es un arco

//ver cómo incluir puntos arrastrables

//Hacer que el círculo sea una crucecita en vez de un punto


//escribir una función que ordene vectores por norma

//darle atributo de color a los arcos para poder dibujarlos de distinto color en el mismo ciclo de draw

//Unificar arco con rectas dando un arreglo con parámetros vacíos correspondientes al ángulo start y stop

//idea:
//function puntoSobreLínea(p){
// checo color del pixel en el que estoy: si es distinto de blanco, digo que
// estoy sobre una línea, y regreso true;
// si es blanco, checo los 8 pixeles circundantes 
// me gustaría regresar más que true: me gustaría dar el "centro" del objeto
// que estoy "pisando", como algún tipo de promedio geométrico sobre el cual
// dibujar el punto, de forma que considere el grosor de las líneas
// quiero que esta función se llame al dibujar un punto


function arg(z){
  if (z.heading() < 0){
    return -1*z.heading();
  } else {
    return TWO_PI - z.heading();
  }
}

function setup() {
  canvas = createCanvas(2*RadioPoincare+20, 2*RadioPoincare+20);
  boton = createButton('Limpiar canvas');
  boton.position(width-110, height-40);
  boton.mousePressed(borrar);
  paralelismo = createButton('Ángulo de Paralelismo')
  paralelismo.position(width-110, height-20)
  paralelismo.mousePressed(activarAdeP);
}

function activarAdeP() {
  //borrar();
  angDeP *= -1;
}

function ToBeltrami(p) {
  let u = p.mag()/RadioPoincare;
  let s = 2*u/(1+u*u);
  let p_ = createVector(p.x, p.y);
  p_.normalize();
  p_.mult(s);
  p_.mult(RadioPoincare)
  //let p_ = createVector(s*p.x, s*p.y);
  return(p_)
}

function borrar() {
  arcos = [];
  puntos = [];
  PuntosExtremos = [];
  puntosMedios = [];
  count = 0;
  images = [];
  beltramiLines = [];
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
  if (arr[0] > RadioPoincare-0.01) { //esto implica que ambos están en S1
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
    let inv = p5.Vector.mult(chico, (RadioPoincare/m)**2)
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
     e2 = p5.Vector.mult(p2, RadioPoincare/p2.mag());
     e1 = p5.Vector.mult(e2, -1)
    } else{
      e1 = p5.Vector.mult(p1, RadioPoincare/p1.mag());
      e2 = p5.Vector.mult(e1, -1)
    }
  } else {
    let a = crearArco(p1, p2);
    let cent = createVector(a[0], a[1]);
    let ang = acos(RadioPoincare/(cent.mag()));
    cent.mult(RadioPoincare/cent.mag());
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
  let SobreFrontera = -1;
  if (z0.mag()>RadioPoincare-2){
    z0.mult(0.999);
    SobreFrontera = 1;
  }
  let x0 = z0.x/RadioPoincare;
  let y0 = z0.y/RadioPoincare;
  let x = z.x/RadioPoincare;
  let y = z.y/RadioPoincare;
  let Dx = 1 - x0*x - y0*y;  //coordenadas del denominador
  let Dy = x*y0 - x0*y;
  let k = 1/(Dx*Dx + Dy*Dy) // recíproco de la norma cuadrada del denominador
  let Rx = RadioPoincare*k*((x-x0)*Dx + (y-y0)*Dy);
  let Ry = RadioPoincare*k*((x-x0)*(-1)*Dy + (y-y0)*Dx);
  let res = new p5.Vector(Rx, Ry);
  if (SobreFrontera == 1){
    z0.mult(1/0.999);
  }
  return res;
}

function anguloDeParalelismo(z0, z1, z2) {
  // if (z0.mag() == 0){
  //   //ir al paso donde calculo intersección, que ya es más fácil
  //   //alternativamente, asignar z0 al punto central con el que trabajaré
  //   //i.e. definir phi(z0) = z0
  // }
  let ext = extremos(z1, z2);
  let e1 = ext[0]; 
  let e2 = ext[1];
  let fe1 = phi(e1, z0); //imagen de extremo 1 bajo phi
  let fe2 = phi(e2, z0); //imagen de extremo 2 bajo phi

  let circulo = crearArco(fe1, fe2);
  let c = new p5.Vector(circulo[0], circulo[1])
  let r = circulo[2];

  let ptoMedioAEscalar = p5.Vector.add(fe1, fe2);
  ptoMedioAEscalar.normalize();
  ptoMedioAEscalar.mult(c.mag()+r);
  let Inv = ptoMedioAEscalar;
  Inv.mult((RadioPoincare**2)/(Inv.mag()**2))
  let PhiPuntoMedio = Inv;
  let menosz0 = new p5.Vector(-z0.x, -1*z0.y);
  let PuntoMedio = phi(PhiPuntoMedio, menosz0); //hay que invertir bien
  let a = crearArco(z0, PuntoMedio);
  puntosMedios.push(PuntoMedio)
  arcos.push(a);
  let z0AExtremo1 = extremos(z0, e1);
  let z0AExtremo2 = extremos(z0, e2)
  let b = crearArco(z0AExtremo1[0], z0AExtremo1[1], 1, 1);
  let d = crearArco(z0AExtremo2[0], z0AExtremo2[1],  1, 1) ;
  arcos.push(b);
  arcos.push(d);
  let a1 = arg(z1); let a2 = arg(z2); let ae1 = arg(e1); let ae2 = arg(e2);
  let orden = {
    a1: z1,
    a2: z1,
    ae1: e1,
    ae2: e2
  }
  let args = [a1, a2, ae1, ae2];
  sort([args]);
  a1 = args[0]; a2 = args[1]; ae1 = args[2]; ae2 = args[3];
  let arcComp1 = crearArco(orden.a1, orden.a2, 0, 1);
  let arcComp2 = crearArco(orden.ae1, orden.ae2, 0, 1);
  arcos.push(arcComp1); arcos.push(arcComp2);
  let dePunto1AExtremo1;
}

function draw() {
  background(255);
  translate(width / 2, height / 2);
  //push(); fill(0); ellipse(0,0,10); pop(); // Centro del disco
  noFill();
  stroke(0);
  strokeWeight(2);
  ellipse(0, 0, 2*RadioPoincare);
  let v = new p5.Vector(mouseX - width / 2, mouseY - height / 2, 0);
  if ((mouseX - width / 2) ** 2 + (mouseY - height / 2) ** 2 > RadioPoincare ** 2) {
    v.normalize();
    v.mult(RadioPoincare);
  }
  fill(0);
  //ellipse(100,10,10);
  
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
//   for (let e of PuntosExtremos) {
    
//     fill(255,0,0);
//     ellipse(e[0].x, e[0].y, 10);
//     ellipse(e[1].x, e[1].y, 10);
//   }
  for (let p of puntos) {
    stroke(0);
    fill(0);
    ellipse(p.x, p.y, 10);
    
//     // Dibuja a p y a su imagen bajo phi
//     let fi_p = phi(p, z0Prueba);
//     fill(0, 255, 0);
//     ellipse(fi_p.x, fi_p.y, 10);

  }
  
  for (let im of images) {
    noStroke();
    fill(0, 0, 255);
    ellipse(im.x, im.y, 10);
  }
  
  for (let linea of beltramiLines) {
    stroke(0, 0, 255);
    p1 = linea[0];
    p2 = linea[1];
    line(p1.x, p1.y, p2.x, p2.y);
  }
  
   for (let p of puntosMedios){
    stroke(0);
    fill(0, 0, 255);
    ellipse(p.x, p.y, 10);
  }


  // if (count > 10){
  //   noLoop();
  // }
}

function mousePressed() {
  if (mouseX > width -111 && mouseY > height - 41){ //evita comportamiento cuando estoy sobre el botón de clear canvas. Podría hacerlo más bonito
    return;
  }
  count++;
  let p = new p5.Vector(mouseX - width / 2, mouseY - height / 2, 0);
  if ((mouseX - width / 2) ** 2 + (mouseY - height / 2) ** 2 > RadioPoincare ** 2) {
    p.normalize();
    p.mult(RadioPoincare);
  }
  if (p.mag() < 7){
    p.x = 0; p.y = 0;
  }
  puntos.push(p);
  if (angDeP == 1){
    if (count > 0 && count % 2 == 0) {
      let p1 = puntos[count - 2];
      let p2 = puntos[count - 1];
      let im1 = ToBeltrami(p1);
      let im2 = ToBeltrami(p2);
      images.push(im1, im2);
      beltramiLines.push([im1, im2]);
      let sub = p5.Vector.sub(p1, p2);
      let m = sub.mag();
      if (m > 0) {
        let l = crearArco(p1, p2);
        arcos.push(l); 
        let ext = extremos(p1, p2)
        PuntosExtremos.push(ext);
      }    
    }
  } else {
    if (count > 0 && count % 3 == 0) {
      let z1 = puntos[count - 3];
      let z2 = puntos[count - 2];
      let z0 = puntos[count -1];
      let sub = p5.Vector.sub(z1, z2);
      let m = sub.mag();
      if (m > 0) {
        let l = crearArco(z1, z2);
        arcos.push(l); 
      }
      anguloDeParalelismo(z0, z1, z2);
    } 
  }
}
