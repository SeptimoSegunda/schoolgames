function sneak() {
    // Inicializa las propiedades de la serpiente
    this.x = 0;
    this.y = 0;
    this.xspeed = 1;
    this.yspeed = 0;
    this.total = 0;
    this.tail = [];

    // Cambia la dirección de la serpiente
    this.dir = function (x, y) {
        this.xspeed = x;
        this.yspeed = y;
    }

    // Actualiza la posición de la serpiente y su cola
    this.update = function () {
        // Actualiza la cola de la serpiente
        if (this.total === this.tail.length) {
            for (var i = 0; i < this.tail.length - 1; i++) {
                this.tail[i] = this.tail[i + 1];
            }
        }
        // Agrega una nueva posición a la cola
        this.tail[this.total - 1] = createVector(this.x, this.y);

        // Actualiza la posición de la cabeza
        this.x = this.x + this.xspeed * scal;
        this.y = this.y + this.yspeed * scal;

        // Limita la posición de la serpiente al área de juego
        this.x = constrain(this.x, 0, width - scal);
        this.y = constrain(this.y, 0, height - scal);
    }

    // Dibuja la serpiente y su cola en la pantalla
    this.show = function () {
        fill(255);
        for (var i = 0; i < this.tail.length; i++) {
            rect(this.tail[i].x, this.tail[i].y, scal, scal);
        }
        rect(this.x, this.y, scal, scal);
    }

    // Comprueba si la serpiente come la comida
    this.eat = function (pos) {
        var d = dist(this.x, this.y, pos.x, pos.y);
        if (d < 1) {
            this.total++;
            return true;
        } else {
            return false;
        }
    }

    // Comprueba si la serpiente muere al chocar consigo misma
    this.death = function () {
        for (var i = 0; i < this.tail.length; i++) {
            var pos = this.tail[i];
            var d = dist(this.x, this.y, pos.x, pos.y);
            if (d < 1) {
                this.total = 0;
                this.tail = [];
                score = 0;
            }
        }
    }
}
