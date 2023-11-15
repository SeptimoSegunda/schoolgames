let bullets = [];
let enemies = [];
let scoreElem;

let score = 0;
let maxEnemies = 20; // Número máximo de enemigos por oleada
let gameover = false;

function setup() {
  // Score
  scoreElem = createDiv('Score = 0');
  scoreElem.position(20, 20);
  scoreElem.id = 'score';
  scoreElem.style('color', 'white');

  // Canvas
  createCanvas(1200, 500);

  // Crear enemigos
  spawnEnemies();
}

function draw() {
  background(51);
  rectMode(CENTER);

  // Dibujar el jugador (triángulo amarillo)
  fill(255, 255, 0); // Amarillo
  triangle(mouseX - 10, height - 20, mouseX + 10, height - 20, mouseX, height - 50);

  // Actualizar y dibujar las balas
  for (let bullet of bullets) {
    bullet.update();
    bullet.show();
  }

  // Actualizar y dibujar enemigos
  for (let enemy of enemies) {
    enemy.update();
    enemy.show();
  }

  // Manejar colisiones
  for (let i = enemies.length - 1; i >= 0; i--) {
    for (let j = bullets.length - 1; j >= 0; j--) {
      if (dist(enemies[i].x, enemies[i].y, bullets[j].x, bullets[j].y) < 10) {
        // Incrementar o decrementar el marcador
        if (bullets[j].isHit === undefined || !bullets[j].isHit) {
          score++;
          bullets[j].isHit = true;
        }

        // Eliminar enemigo y bala
        enemies.splice(i, 1);
        bullets.splice(j, 1);

        // Agregar un nuevo enemigo
        if (enemies.length < maxEnemies) {
          let newEnemy = new Enemy(random(0, width), random(-800, 0));
          enemies.push(newEnemy);
        }
      }
    }
  }

  // Verificar colisión con el tirador
  for (let enemy of enemies) {
    if (dist(enemy.x, enemy.y, mouseX, height - 50) < 15) {
      gameover = true;
    }
  }

  // Mostrar el marcador
  scoreElem.html('Score = ' + score);

  // Verificar si se ha ganado o perdido
  if (score === 18) {
      displayGameOver('Winner', color(0, 255, 0)); // Mostrar mensaje de ganar en verde
  }
  if (enemies.length === 0 || gameover) {
    if (score < 0 || gameover) {
      displayGameOver('Gameover', color(255, 0, 0)); // Mostrar mensaje de perder en rojo
    } else {
      spawnEnemies(); // Generar una nueva oleada de enemigos
    }
  }
}

function mousePressed() {
  // Spawn de una bala cuando el usuario hace clic
  let bullet = new Bullet(mouseX, height - 50);
  bullets.push(bullet);
}

function displayGameOver(message, textColor) {
  textSize(32);
  fill(textColor);
  textAlign(CENTER, CENTER);
  text(message, width / 2, height / 2);
  noLoop(); // Detener el bucle de dibujo
}

function spawnEnemies() {
  // Generar nuevos enemigos
  enemies = [];
  for (let i = 0; i < maxEnemies; i++) {
    let enemy = new Enemy(random(0, width), random(-800, 0));
    enemies.push(enemy);
  }

  gameover = false; // Reiniciar el estado del juego al generar nuevos enemigos
}

class Bullet {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.isHit = false; // Flag para verificar si la bala ya ha golpeado a un enemigo
  }

  update() {
    this.y -= 10;
  }

  show() {
    fill(255);
    triangle(this.x - 2.5, this.y, this.x + 2.5, this.y, this.x, this.y - 7.5);
  }
}

class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  update() {
    this.y += 2;
  }

  show() {
    fill(255);
    rect(this.x, this.y, 10, 10);
  }
}