var foods = [];
var scal = 15;

function setup() {
    createCanvas(600, 600);
    s = new sneak();
    frameRate(12);
    spawnFruits(5); // Cantidad de frutas a mostrar
}

function spawnFruits(count) {
    var cols = floor(width / scal);
    var rows = floor(height / scal);
    foods = []; // Vaciar el array de frutas
    for (var i = 0; i < count; i++) {
        var food = createVector(floor(random(cols)), floor(random(rows)));
        food.mult(scal);
        foods.push(food);
    }
}

function draw() {
    background(51);
    for (var i = foods.length - 1; i >= 0; i--) {
        if (s.eat(foods[i])) {
            score += 1; // ajustar la puntuación por fruta aquí
            foods.splice(i, 1); // Eliminar la fruta comida
        }
    }
    s.update();
    s.death();
    s.show();
    if (foods.length === 0) {
        spawnFruits(3); // Respawn de las frutas cuando se han comido todas
    }
    for (var i = 0; i < foods.length; i++) {
        fill(255, 0, 10);
        rect(foods[i].x, foods[i].y, scal, scal);
    }
    fill(255);
    textSize(24);
    text('Puntos: ' + score, 10, 30);
}
