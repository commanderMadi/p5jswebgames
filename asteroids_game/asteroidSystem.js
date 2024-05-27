class AsteroidSystem {
    //creates arrays to store each asteroid's data
    constructor() {
        this.locations = [];
        this.velocities = [];
        this.accelerations = [];
        this.diams = [];
        this.colors = {
            randomShadeOfRed: null,
            randomShadeOfGreen: null,
            randomShadeOfBlue: null,
        };
    }

    run() {
        this.spawn();
        this.move();
        this.draw();
    }

    generateRandomColor() {
        this.colors.randomShadeOfRed = random(255);
        this.colors.randomShadeOfGreen = random(255);
        this.colors.randomShadeOfBlue = random(255);
    }

    // spawns asteroid at random intervals
    spawn() {
        if (random(1) < 0.01) {
            this.accelerations.push(new createVector(0, random(0.1, 1)));
            this.velocities.push(new createVector(0, 0));
            this.locations.push(new createVector(random(width), 0));
            this.diams.push(random(40, 60));
        }
    }

    //moves all asteroids
    move() {
        for (let i = 0; i < this.locations.length; i++) {
            this.velocities[i].add(this.accelerations[i]);
            this.locations[i].add(this.velocities[i]);
            this.accelerations[i].mult(0);
        }
    }

    applyForce(f) {
        for (let i = 0; i < this.locations.length; i++) {
            this.accelerations[i].add(f);
        }
    }

    //draws all asteroids
    draw() {
        noStroke();

        for (let i = 0; i < this.locations.length; i++) {
            // asteroids will change colors each game instance based on the generated values
            fill(
                this.colors.randomShadeOfRed,
                this.colors.randomShadeOfGreen,
                this.colors.randomShadeOfBlue
            );
            ellipse(this.locations[i].x, this.locations[i].y, this.diams[i], this.diams[i]);
        }
    }

    //function that calculates effect of gravity on each asteroid and accelerates it
    calcGravity(centerOfMass) {
        for (let i = 0; i < this.locations.length; i++) {
            let gravity = p5.Vector.sub(centerOfMass, this.locations[i]);
            gravity.normalize();
            gravity.mult(0.001);
            this.applyForce(gravity);
        }
    }

    //destroys all data associated with each asteroid
    destroy(index) {
        this.locations.splice(index, 1);
        this.velocities.splice(index, 1);
        this.accelerations.splice(index, 1);
        this.diams.splice(index, 1);
    }
}
