class BulletSystem {
    constructor() {
        this.bullets = [];
        this.velocity = new createVector(0, -5);
        this.diam = 10;
    }

    run() {
        this.move();
        this.draw();
        this.edges();
    }

    fire(x, y) {
        this.bullets.push(createVector(x, y));
    }

    //draws all bullets
    draw() {
        fill(255);
        for (let i = 0; i < this.bullets.length; i++) {
            stroke('limegreen');
            // bullet thickness
            strokeWeight(2);
            // change bullets from ellipses to lines to make them resemble a true asteroid game bullet
            line(
                this.bullets[i].x,
                this.bullets[i].y - 10,
                this.bullets[i].x,
                this.bullets[i].y - 30
            );
        }
    }

    //updates the location of all bullets
    move() {
        for (let i = 0; i < this.bullets.length; i++) {
            this.bullets[i].y += this.velocity.y;
        }
    }

    //check if bullets leave the screen and remove them from the array
    edges() {
        let bullets = this.bullets;
        for (let bullet of bullets) {
            let i = 0;
            if (bullet.y < 0) {
                // remove bullets from the bullet array when they leave the screen
                bullets.splice(i, 1);
                i--;
            }
        }
    }
}
