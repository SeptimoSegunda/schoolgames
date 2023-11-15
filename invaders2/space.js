var myFont, fontReady = false;
var user;
var bullets = [];
var aliens = [];
var GameOverFlag = false;
var btnVisible = false;
var difficultyIndex = 5;
var score = 0;
var shootSound,hitSound,GOSound,musica1,tomatela;
var state;
var nivel;
var cargarki;
var muerte;
function fontRead(){
  fontReady = true;
}
function arranque(){

textFont('Pixelify Sans');
fill('gold');
 textSize(20);
 text("te mueves con las flechas ",2, 57);
 fill('gold');
 textSize(20);
 text("disparas con 'ESPACIO' ",2, 80);
 fill('gold');
 textSize(20);
 text("llegaran y reapareceran mas aliens conforme vayas avanzando... ",2, 100);
 fill('gold');
 textSize(40);
 text("Presiona 'ESPACIO' para continuar.... ",2, 150);

}
function menu(){
  
textFont('Pixelify Sans');
 fill('gold');
 textSize(50);
 text("la leyenda del Super CussiShin",2, 57);
 fill(255,255,255);
 textSize(30);
 text("Presiona ENTER",240,300);
// mensaje del cussishin
  fill('gray');
  textSize(20);
  text("¿Podrá nuestro guerrero cusshisin defender la tierra?", 70, 80);
  fill('gray')
  textSize(13);
  text("Game by The Bolivian Games™, Todos los derechos reservados",170,330);
}
function preload() {
cussishin = loadImage("super.png");
cussi_normal = loadImage("cussi_menu.png");
  myFont = loadFont("pixels.ttf", fontRead);
  nave = loadImage("cussi.png");
  nave2 = loadImage("cussi_dispara.png");
  fondo = loadImage("tierra.png");
  shootSound = loadSound('shoot.wav');
  hitSound = loadSound('invaderkilled.wav');
  GOSound = loadSound('pacman_death.wav');
  musica1 = loadSound('gameplay.wav');
  musica2 = loadSound('gameover.wav');
  tomatela = loadSound('tomatela.wav');
  ki = loadSound('ki.wav');
  uuu = loadSound('uuu.wav');
  menusong = loadSound('menu.wav');
  cussif = loadImage("cussik.png");
}
function setup() {
  shootSound.play();
  muerte = false;
 cargarki = 0;
textFont('Pixelify Sans');
  state = 0;
  
  createCanvas(720, 400);
  user = new userShip(width/2,height+10);
  frameRate(60);
  

}
function resetGame() {
  location.reload();
}
function draw() {
 frameRate(60);
  background('black');
  if(state == 0){

    arranque();
  }
 if( state == 1){
  menu(); // texto del menu
  
  image(fondo,160,350);
   image(cussi_normal,250,80);
   if(ki.currentTime() >= 0.2){ // iniciar transformacion
     cussi_normal = cussishin;
   }
if(ki.currentTime() >= 0.6){ // iniciar cancion del menu
     if(menusong.isPlaying() == false){
   menusong.loop();
  menusong.amp(1);
  
   }
}
   if(cargarki == 0){
   uuu.play(1);
   ki.play(2);
   
   cargarki++;
   }
 }
 if( state == 2){
   
   // musica gameplay
   if(musica1.isPlaying() == false && muerte == false){
   musica1.loop();
  musica1.amp(1);
  
   }
if(uuu.isPlaying() == true && state == 2){
 uuu.pause(); 
  ki.pause();
  menusong.pause();
}
else if(menusong.isPlaying() == true && state == 2){
  menusong.pause();
}
  image(fondo,160,330);
  // line(56, 46, 55, 55);

  if (fontReady && !GameOverFlag) {
    user.show();
    user.update();
    if (aliens.length<difficultyIndex) {
      var alien = new Alien(user.x, height);
      aliens.push(alien);
    }
    if(keyIsDown(LEFT_ARROW)){
      user.move('left');
    }else if(keyIsDown(RIGHT_ARROW)){
      user.move('right');
    }
    for (var i = 0; i < aliens.length; i++) {
      aliens[i].show();
      aliens[i].update();
      if(aliens[i].y>(height-20)){
        // clear();
        fill(255);
        textSize(36);
        textFont("Arial");
        text("Game Over", ((width/2)-100), height/2);
        frameRate(1);
        GameOverFlag=true;

      }
    }
    for (var i = 0; i < bullets.length; i++) {
      bullets[i].show();
      bullets[i].move();
      for (var j = 0; j < aliens.length; j++) {
        if (bullets[i].hits(aliens[j])) {
          aliens.splice(j, 1);
          // bullets.splice(i, 1);
          bullets[i].delmefn();
          score=score+1;
          hitSound.play();
          hitSound.amp(0.1);
          if(score%20==0){
            difficultyIndex=difficultyIndex+1;
            
          }
        }
      }
    }


    for (var i = 0; i < bullets.length; i++) {
      if(bullets[i].y<0 || bullets[i].delme== true){
        bullets.splice(i, 1);
      }
    }

  }else {
    fill(255);
    textSize(36);
    textFont("Arial");
    // GAMER OVER
    var GOStr = "GAME OVER....   Score = "+score;
    var fin = "los aliens han invadido la tierra...";
    text(GOStr, ((width/2)-200), height/2);
    textSize(5);
    text(fin, 160, 300);
    fondo = loadImage('tierrak.png');
    image(cussif,340,80);
    
    if (!btnVisible) {
      var button = createButton('Restart Game');
      button.mousePressed(resetGame);
      btnVisible = true;
      musica1.pause();
      musica2.loop(2);
      tomatela.play(1);
      muerte = true;
     
    }
  }
  
   
 }
}
function keyPressed() {
  if(keyCode === ENTER){
   if(state == 1){


      state++;
    } 
   
  }
  if(!GameOverFlag){
    if(keyCode === 65){
      var alien = new Alien(user.x, height);
      aliens.push(alien);
    }else if (keyCode === RIGHT_ARROW) {
      // console.log('Right!');
      // user.move('right');

    }else if(keyCode === 32){
      shootSound.play();
      shootSound.amp(0.1);
      if(state == 0){


      state++;
    }
      nave = nave2;
      var bullet = new Bullet(user.x, height);
      bullets.push(bullet);
    }else {
      // console.log(keyCode);
    }
  }
}
function keyReleased(){
 nave = loadImage("cussi.png"); 
  
}


function userShip(x,y) {
  this.x = 50;
  this.y = height-20;
  this.length =10;
  this.show = function() {
image(nave,this.x-40,this.y-30);
  };
  this.update = function () {

  }
  this.move = function (direction) {
    if (direction=='right') {
      this.x=this.x+8;
    }else if(direction=='left'){
      this.x=this.x-8;
    }
    this.x = constrain(this.x, 50, width-50);
  }
}
function Bullet(x, y) {
  this.x = x;
  this.y = y;
  this.r = 3;
  this.delme = false
  this.show = function() {
    noStroke();
    fill('yellow');
    ellipse(this.x+13, this.y-30, this.r*2, this.r*2);
  }

  this.move = function() {
    this.y = this.y - 15;
  }
  this.delmefn = function () {
    this.delme = true;
  }

  this.hits = function(alien) {
    var d = dist(this.x, this.y, alien.x, alien.y);
    if (d < 20) {
      return true;
    } else {
      return false;
    }
  }
}
function Alien(x, y) {
  this.x = random(50,width-50);
  this.y = random(20,height/2);
  var types=['I','H']
  this.show = function() {
    fill(204,255,0);
    textSize(36);
    textFont(myFont);
    text(random(types), this.x, this.y);

  }
  this.update = function () {
    this.y=this.y+0.5;
  }
}
