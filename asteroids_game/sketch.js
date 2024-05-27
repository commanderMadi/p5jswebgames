///////////// My customizations to the game /////////////
/*
1. Sound effects
   a. Gun firing sound effect (when a bullet is fired)
   b. Explosion sound effect (when an asteroid is destroyed)
   c. Crash sound effect (when the spaceship hits earth, another asteroid, or goes off screen)
   d. Danger zone (atmosphere) sound effect (when the spaceship or asteroids are in the atmosphere layer)
2. Visual Customizations
   a. The spaceship object is represented a real image of a cartoon spaceship.
   (Image Credit: https://www.flaticon.com/free-icons/spaceship - Spaceship icons created by Freepik - Flaticon)
   b. Bullets are changed from ellipses to lines and are given a green color to resemble a green laser beam.
   c. Asteroids change color each game instance, random colors are generated each time.
   d. Added thrusters (represented by two yellow lines) that push up/back the spaceship in the opposite direction

3. Features Added
   a. Added a scoreboard that keeps track of the player progress (One asteroid destroyed = 1 Point added)
   b. Added game restart functionality on game over.

4. Code enhancements
   a. Used ES6 syntax when possible (let, const)
   b. Code formatted done by prettier
*/
//////////////////////////

/* Global Variables */

let spaceship;
let asteroids;
let atmosphereLoc;
let atmosphereSize;
let earthLoc;
let earthSize;
let starLocs = [];
// variable to keep track of asteroids count
let asteroidsCount;

// variables to obtain the earth and atmosphere diameters
let earthDiameter;
let atmosphereDiameter;
// variable to keep track of score
let score = 0;
let scoreBoardLocation;

// variable to keep track of the game current status
let isGameOver = false;

// variables to hold the various sound effects added to the game
let shotSound;
let explosionSound;
let dangerSound;
let loseSound;

// preload the sound files to prevent code-blocking scenarios
function preload() {
    soundFormats('wav');
    shotSound = loadSound('assets/sounds/shot');
    explosionSound = loadSound('assets/sounds/explosion');
    dangerSound = loadSound('assets/sounds/danger');
    loseSound = loadSound('assets/sounds/lose');
}

//////////////////////////////////////////////////
function setup() {
    // center the image of the spaceship around the coordinates given to it
    imageMode(CENTER);
    createCanvas(1200, 800);
    // create an instance of the spaceship as well as the asteroids
    spaceship = new Spaceship();
    asteroids = new AsteroidSystem();
    // on each game instance, a random color will be generated for asteroids
    asteroids.generateRandomColor();

    // set coordinates to draw the scoreboard
    scoreBoardLocation = {
        x: 70,
        y: 50,
    };

    //location and size of earth and its atmosphere
    atmosphereLoc = new createVector(width / 2, height * 2.9);
    atmosphereSize = new createVector(width * 3, width * 3);
    earthLoc = new createVector(width / 2, height * 3.1);
    earthSize = new createVector(width * 3, width * 3);
    // Obtain the earth diameter from the earthSize vector object
    earthDiameter = earthSize.x;
    // Obtain the atmosphere diameter from the atmosphereSize vector object
    atmosphereDiameter = atmosphereSize.x;
    // draw the scoreboard on top left corner
}

//////////////////////////////////////////////////
function draw() {
    background(0);

    sky();
    textSize(32);

    spaceship.run();
    asteroids.run();

    drawEarth();
    drawScoreBoard();
    // keep checking for collisions
    checkCollisions(spaceship, asteroids); // function that checks collision between letious elements
}

//////////////////////////////////////////////////
//draws earth and atmosphere
function drawEarth() {
    noStroke();
    //draw atmosphere
    fill(0, 0, 255, 50);
    ellipse(
        atmosphereLoc.x,
        atmosphereLoc.y,
        atmosphereSize.x,
        atmosphereSize.y
    );
    //draw earth
    fill(100, 255);
    ellipse(earthLoc.x, earthLoc.y, earthSize.x, earthSize.y);
}

function drawScoreBoard() {
    // draw scoreboard
    textSize(30);
    textAlign(CENTER);
    fill('yellow');
    text(`Score: ${score} `, scoreBoardLocation.x, scoreBoardLocation.y);
}

//////////////////////////////////////////////////
//checks collisions between all types of bodies
function checkCollisions(spaceship, asteroids) {
    //spaceship-2-asteroid collisions
    // obtain the length of all asteroids in play
    asteroidsCount = asteroids.locations.length;
    // loop over all asteroids and compare their locations to spaceship location
    // if they are close enough, then they collided
    for (let i = 0; i < asteroidsCount; i++) {
        if (
            isInside(
                spaceship.location,
                spaceship.size,
                asteroids.locations[i],
                asteroids.diams[i]
            )
        ) {
            gameOver();
        }
    }
    //asteroid-2-earth collisions
    // obtain the length of all asteroids in play
    asteroidsCount = asteroids.locations.length;
    // loop over all asteroids and compare their locations to earth location
    // if they are close enough, then they collided
    for (let i = 0; i < asteroidsCount; i++) {
        if (
            isInside(
                earthLoc,
                earthDiameter,
                asteroids.locations[i],
                asteroids.diams[i]
            )
        ) {
            gameOver();
        }
    }

    //asteroid enters atmosphere warning
    // obtain the length of all asteroids in play
    asteroidsCount = asteroids.locations.length;
    // loop over all asteroids and compare their locations to atmosphere location
    for (let i = 0; i < asteroidsCount; i++) {
        if (
            isInside(
                atmosphereLoc,
                atmosphereDiameter,
                asteroids.locations[i],
                asteroids.diams[i]
            )
        ) {
            // if the asteroids enter the atmosphere, play the danger sound.
            dangerSound.playMode('untilDone');
            dangerSound.play();
        }
    }

    //spaceship-2-earth
    // Compare spaceship location to earth location
    // if they are close enough, then they collided
    if (isInside(earthLoc, earthDiameter, spaceship.location, spaceship.size)) {
        gameOver();
    }

    //spaceship-2-atmosphere
    // Compare spaceship location to atmosphere location
    // if the spaceship is inside the atmosphere, apply friction and gravitional pull.
    if (
        isInside(
            spaceship.location,
            spaceship.size,
            atmosphereLoc,
            atmosphereDiameter
        )
    ) {
        spaceship.setNearEarth();
        // play the danger sound as long as the ship is in the atmosphere
        dangerSound.playMode('untilDone');
        dangerSound.play();
    }
    //bullet collisions
    // save the bulletDiameter in a constant since it doesn't change
    const bulletDiameter = spaceship.bulletSys.diam;
    // obtain the length of all asteroids in play
    asteroidsCount = asteroids.locations.length;
    // Compare bullets locations to asteroids location
    // if they are close enough, then the asteroids are hit.
    for (let i = 0; i < spaceship.bulletSys.bullets.length; i++) {
        for (let j = 0; j < asteroids.locations.length; j++) {
            if (
                isInside(
                    spaceship.bulletSys.bullets[i],
                    bulletDiameter,
                    asteroids.locations[j],
                    asteroids.diams[j]
                )
            ) {
                // destroy asteroids, remove them from play
                asteroids.destroy(j);
                // on bullet hit, play explosion sound
                explosionSound.play();
                // increment player score by 1
                score++;
            }
        }
    }
}

//////////////////////////////////////////////////
//helper function checking if there's collision between object A and object B
function isInside(locA, sizeA, locB, sizeB) {
    // Since the size of a circle is equivalent to its a diameter, we obtain the radius by dividing the size by 2
    let radiusA = sizeA / 2;
    let radiusB = sizeB / 2;
    /* If the distance between the center points of two circles is less than the sum of their radii, 
  then collison happened and we return true, otherwise, return false
  */
    if (dist(locA.x, locA.y, locB.x, locB.y) < radiusA + radiusB) {
        return true;
    } else {
        return false;
    }
}

//////////////////////////////////////////////////
function keyPressed() {
    if (!isGameOver && keyIsPressed && keyCode === 32) {
        // if spacebar is pressed, fire!
        spaceship.fire();
        shotSound.play();
    }
    if (isGameOver && keyPressed && keyCode === 13) {
        // restart the game if the enter key is pressed
        restartGame();
    }
}

// Restart the game
function restartGame() {
    starLocs = [];
    isGameOver = false;
    score = 0;

    // setup the code again and restart the draw loop
    setup();
    loop();
}

//////////////////////////////////////////////////
// function that ends the game by stopping the loops and displaying "Game Over. Press Enter to Play again"
function gameOver() {
    fill(255);
    textSize(50);
    textAlign(CENTER);
    text('GAME OVER. PRESS ENTER TO PLAY AGAIN', width / 2, height / 2);
    // play the lose sound when the game is over (applies for all crashes)
    loseSound.play();
    // set the game end status to true
    isGameOver = true;
    noLoop();

    return isGameOver;
}

//////////////////////////////////////////////////
// function that creates a star lit sky
function sky() {
    push();
    while (starLocs.length < 300) {
        starLocs.push(new createVector(random(width), random(height)));
    }
    fill(255);
    for (let i = 0; i < starLocs.length; i++) {
        rect(starLocs[i].x, starLocs[i].y, 2, 2);
    }

    if (random(1) < 0.3) starLocs.splice(int(random(starLocs.length)), 1);
    pop();
}
