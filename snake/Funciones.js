// Variables globales
let snake; // Variable que almacena la serpiente del juego
let food; // Variable que guarda la posición de la comida
let obstacles = []; // Array que almacena las posiciones de los obstáculos
let canChangeDirection = true; // Variable de control para cambios de dirección
let score = 0; // Puntuación del jugador
let level = 0; // Nivel del juego
let backgroundImage;
let appleImg; // Variable para la imagen de la manzana
let obstacleImg; // Variable para la imagen de los obstáculos
let gameStarted = false; // Variable para controlar el inicio del juego

function preload() {
    backgroundImage = loadImage('https://cdn.leonardo.ai/users/93c2b651-d59d-4b36-a34f-9bf3b29ab679/generations/38104637-ef38-44d6-a3b0-3245a1d4ecce/Leonardo_Diffusion_XL_grass_minimalist_background_checkerboard_3.jpg'); // Cambia la ruta por la ubicación de tu imagen
    appleImg = loadImage('https://static.wikia.nocookie.net/minecraft_gamepedia/images/a/ae/Golden_Apple_JE1_BE1.png/revision/latest?cb=20191229204603');
    obstacleImg = loadImage('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRdt8wJZO-TJ1iF5Nc_XtFe4LVsK5YX-xR_eF_GeLJuMbhHXG11FYi01bYgengKAPJsPpI&usqp=CAU');
}

// Configuración inicial del lienzo
function setup() {
    createCanvas(600, 600); // Crear un lienzo de 600x600 píxeles
    frameRate(12); // Establecer la velocidad de actualización a 12 fotogramas por segundo
    snake = new Snake(); // Inicializar la serpiente
    food = createFood(); // Crear la comida inicial
    score = 0; // Inicializar la puntuación del jugador
    level = 0; // Inicializar el nivel del juego
}

        // Función que se ejecuta en cada fotograma
function draw() {
    if (!gameStarted) {
        showStartScreen(); // Mostrar la pantalla de inicio
    } else {
        background(backgroundImage); // Establecer el fondo del lienzo
    snake.move(); // Mover la serpiente
    snake.checkCollision(); // Verificar colisiones
    snake.update(); // Actualizar lógica del juego (opcional)
    snake.show(); // Mostrar la serpiente en el lienzo
    if (snake.eat(food)) { // Verificar si la serpiente ha comido la comida
        food = createFood(); // Crear nueva comida
        score++; // Incrementar la puntuación del jugador
        if (score % 10 === 0) { // Si la puntuación es múltiplo de 10, incrementar el nivel y agregar obstáculos
            level++;
            addObstacles();
        }
    }

    // Dibujar obstáculos de color negro
     for (let obstacle of obstacles) {
        image(obstacleImg, obstacle.x, obstacle.y, 20, 20);
    }

    image(appleImg, food.x, food.y, 20, 20);
    canChangeDirection = true; // Permitir cambios de dirección
    displayRanking();
    }
    
}

function showStartScreen() {
    // Código para mostrar la pantalla de inicio
    background(0); // Fondo negro
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Presiona Enter para empezar", width / 2, height / 2);
}
// Función para manejar las teclas presionadas
function keyPressed() {
    if (keyCode === ENTER && !gameStarted) {
        gameStarted = true; // Iniciar el juego al presionar Enter
    }
    if (canChangeDirection) {
        switch (keyCode) {
            // Cambiar dirección de la serpiente según la tecla presionada
            // UP_ARROW: Arriba, DOWN_ARROW: Abajo, LEFT_ARROW: Izquierda, RIGHT_ARROW: Derecha
            case UP_ARROW:
                if (snake.yDirection !== 1) {
                    snake.setDirection(0, -1);
                    canChangeDirection = false;
                }
                break;
            case DOWN_ARROW:
                if (snake.yDirection !== -1) {
                    snake.setDirection(0, 1);
                    canChangeDirection = false;
                }
                break;
            case LEFT_ARROW:
                if (snake.xDirection !== 1) {
                    snake.setDirection(-1, 0);
                    canChangeDirection = false;
                }
                break;
            case RIGHT_ARROW:
                if (snake.xDirection !== -1) {
                    snake.setDirection(1, 0);
                    canChangeDirection = false;
                }
                break;
        }
    }
}

// Función para crear la posición inicial de la comida
function createFood() {
// Generar posición aleatoria para la comida
// Evitar que la comida aparezca en la serpiente u obstáculos existentes

    let foodPos;
    do {
        const cols = floor(width / 20);
        const rows = floor(height / 20);
        foodPos = createVector(floor(random(cols)), floor(random(rows)));
        foodPos.mult(20);
    } while (foodOnSnake(foodPos) || foodOnObstacles(foodPos));
    return foodPos;
}

// Función para verificar si la comida está en la posición de la serpiente
function foodOnSnake(pos) {
// Comprobar si la posición coincide con algún segmento de la serpiente
    for (let segment of snake.body) {
        if (pos.x === segment.x && pos.y === segment.y) {
            return true;
        }
    }
    return false;
}

// Función para verificar si la comida está en la posición de un obstáculo
function foodOnObstacles(pos) {
// Comprobar si la posición coincide con algún obstáculo
    for (let obstacle of obstacles) {
        if (pos.x === obstacle.x && pos.y === obstacle.y) {
            return true;
        }
    }
    return false;
}

// Función para agregar obstáculos según el nivel actual del juego
function addObstacles() {
// Añadir obstáculos basados en el nivel del juego
    let count = level - obstacles.length;
    for (let i = 0; i < count; i++) {
        obstacles.push(createObstacle());
    }
}

// Función para crear un obstáculo en una posición aleatoria válida
function createObstacle() {
// Generar obstáculo en una posición que no colisione con la serpiente ni con otros obstáculos
    let obstaclePos;
    let collision;
    do {
        collision = false;
        const cols = floor(width / 20);
        const rows = floor(height / 20);
        obstaclePos = createVector(floor(random(cols)), floor(random(rows)));
        obstaclePos.mult(20);

        // Verificar si el obstáculo está en la posición de la serpiente o en otro obstáculo
        if (foodOnSnake(obstaclePos)) {
            collision = true;
        }
        for (let obstacle of obstacles) {
            if (obstacle.x === obstaclePos.x && obstacle.y === obstaclePos.y) {
                collision = true;
                break;
            }
        }
    } while (collision);
    return obstaclePos;
}

// Clase Snake: representa la serpiente del juego
class Snake {
// Constructor: inicializa la serpiente
// Métodos para mover, verificar colisiones, actualizar, mostrar y comer la comida
    constructor() {
        this.body = [];
        this.body[0] = createVector(floor(width / 2), floor(height / 2));
        this.xDirection = 0;
        this.yDirection = 0;
    }

    setDirection(x, y) {
        this.xDirection = x;
        this.yDirection = y;
    }

    move() {
        const head = this.body[0].copy();
        this.body.unshift(createVector(head.x + this.xDirection * 20, head.y + this.yDirection * 20));
        this.body.pop();
    }

    checkCollision() {
        const head = this.body[0];
        if (head.x < 0 || head.x >= width || head.y < 0 || head.y >= height) {
            resetGame();
        }

        for (let obstacle of obstacles) {
            if (head.x === obstacle.x && head.y === obstacle.y) {
                resetGame();
            }
        }

        for (let i = 1; i < this.body.length; i++) {
            const part = this.body[i];
            if (head.x === part.x && head.y === part.y) {
                resetGame();
            }
        }
    }

    update() {}

    show() {
        for (let i = 0; i < this.body.length; i++) {
            let transparency = map(i, 0, this.body.length, 300, 150); // Cambia la transparencia de los segmentos
            fill(139, 69, 19, transparency); // Usa una transparencia variable
            noStroke();
            rect(this.body[i].x, this.body[i].y, 20, 20, 5);
        }
    }

    eat(pos) {
        const head = this.body[0];
        if (head.x === pos.x && head.y === pos.y) {
            this.body.push(createVector(pos.x, pos.y));
            return true;
        }
        return false;
    }
}
// Función para reiniciar el juego al detectar una colisión
function displayRanking() {
    let ranking = JSON.parse(localStorage.getItem('snakeRanking')) || [];
    let scoreDiv = document.getElementById('score');
    let rankingDiv = document.getElementById('ranking');

    scoreDiv.innerText = `Puntos: ${score}`;
    rankingDiv.innerHTML = 'Ranking:<br>';
    for (let i = 0; i < ranking.length && i < 3; i++) {
        rankingDiv.innerHTML += `Top ${i + 1}: ${ranking[i]}<br>`;
    }
}
function resetGame() {
    // Obtener el ranking almacenado localmente
    let ranking = JSON.parse(localStorage.getItem('snakeRanking')) || [];

    // Agregar la puntuación actual al ranking
    ranking.push(score);

    // Ordenar el ranking en orden descendente
    ranking.sort((a, b) => b - a);

    // Limitar el ranking a las primeras 3 posiciones
    ranking = ranking.slice(0, 3);

    // Guardar el ranking actualizado en el almacenamiento local
    localStorage.setItem('snakeRanking', JSON.stringify(ranking));

    // Reiniciar la serpiente, comida, puntuación, nivel y obstáculos
    snake = new Snake();
    food = createFood();
    score = 0;
    level = 0;
    obstacles = [];

}

// Función para mostrar el ranking
function showRanking() {
    // Obtener el ranking almacenado localmente
    let ranking = JSON.parse(localStorage.getItem('snakeRanking')) || [];

    // Mostrar el ranking en la consola (puedes adaptarlo para mostrarlo en el lienzo)
    console.log("Ranking:");
    for (let i = 0; i < ranking.length; i++) {
        console.log(`Top ${i + 1}: ${ranking[i]}`);
    }
}
