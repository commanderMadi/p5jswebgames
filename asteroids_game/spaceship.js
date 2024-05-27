class Spaceship {
    constructor() {
        this.img = loadImage('assets/img/spaceship.png');
        this.velocity = new createVector(0, 0);
        this.location = new createVector(width / 2, height / 2);
        this.acceleration = new createVector(0, 0);
        this.maxVelocity = 5;
        this.bulletSys = new BulletSystem();
        this.size = 50;
    }

    run() {
        this.bulletSys.run();
        this.draw();
        this.move();
        this.edges();
        this.interaction();
    }

    draw() {
        fill(125);
        // create an image to represent the spaceship instead of the default triangle
        image(this.img, this.location.x, this.location.y, this.size + 15, this.size + 15);
    }

    move() {
        // Add acceleration to affect velocity
        this.velocity.add(this.acceleration);
        // Add velocity to affect location
        this.location.add(this.velocity);
        // reset the acceleration to prevent accumlating
        this.acceleration.mult(0);
        // limit the max velocity
        this.velocity.limit(this.maxVelocity);
    }

    applyForce(f) {
        this.acceleration.add(f);
    }

    interaction() {
        if (keyIsDown(LEFT_ARROW)) {
            // Moving Left
            this.applyForce(createVector(-0.1, 0));
        }
        if (keyIsDown(RIGHT_ARROW)) {
            //Moving Right
            this.applyForce(createVector(0.1, 0));
        }
        if (keyIsDown(UP_ARROW)) {
            // Moving Up
            this.applyForce(createVector(0, -0.1));
            // apply thrust in "downward" direction when moving down
            this.applyThrust('down');
        }
        if (keyIsDown(DOWN_ARROW)) {
            // Moving Down
            this.applyForce(createVector(0, 0.1));
            // apply thrust in "upward" direction when moving down
            this.applyThrust('up');
        }
    }

    fire() {
        this.bulletSys.fire(this.location.x, this.location.y);
    }

    edges() {
        if (this.location.x < 0) this.location.x = width;
        else if (this.location.x > width) this.location.x = 0;
        else if (this.location.y < 0) this.location.y = height;
        else if (this.location.y > height) this.location.y = 0;
    }

    setNearEarth() {
        // Create a gravitional pull vector that pulls the spaceship downwards.
        let gravitionalPull = new createVector(0, 0.05);
        // apply the gravitional pull to the spaceship
        this.applyForce(gravitionalPull);
        // create a friction vector that is 30 times smaller than the velocity of the spaceship
        let friction = p5.Vector.div(this.velocity, 30);
        // friction is supposed to act against the direction of the spaceship velocity, so we multiply by -1
        friction = p5.Vector.mult(friction, -1);
        // apply the friction to the spaceship velocity
        this.applyForce(friction);
    }

    /* add thrust animations that appear in a direction opposite
     to the movement of the spaceship when it moves up and down */
    applyThrust(location) {
        stroke('yellow');
        strokeWeight(8);
        switch (location) {
            case 'up':
                // draw thrusters pushing down when the up key is pressed
                line(
                    this.location.x - 30,
                    this.location.y + 5,
                    this.location.x - 30,
                    this.location.y - 20
                );
                line(
                    this.location.x + 30,
                    this.location.y + 5,
                    this.location.x + 30,
                    this.location.y - 20
                );
                break;
            case 'down':
                // draw thrusters pushing up when the down key is pressed
                line(
                    this.location.x - 20,
                    this.location.y + 15,
                    this.location.x - 20,
                    this.location.y + 45
                );
                line(
                    this.location.x + 23,
                    this.location.y + 15,
                    this.location.x + 23,
                    this.location.y + 45
                );
                break;
        }
    }
}
