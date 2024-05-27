// Example is based on examples from: http://brm.io/matter-js/, https://github.com/shiffman/p5-matter
// add also Benedict Gross credit

///////////// My customizations to the game /////////////
/*

1. Visual Customizations
   a. Changed the canvas background color.
   b. Spawned birds have random colors.

2. Features Added
   a. App converted to a game.
   b. Added game restart functionality on game over.
   c. Added a counter that starts from 60 and decrements every second.

3. Code enhancements
   a. Used ES6 syntax when possible (let, const)
   b. Wrote shorter code when possible (ternary operator)
   b. Code formatted done by prettier
*/
//////////////////////////

/* Global Variables */
let Engine = Matter.Engine;
let Render = Matter.Render;
let World = Matter.World;
let Bodies = Matter.Bodies;
let Body = Matter.Body;
let Constraint = Matter.Constraint;
let Mouse = Matter.Mouse;
let MouseConstraint = Matter.MouseConstraint;

// countdown variable that starts from 60
let countDown = 60;

// variable to keep track of the game progress status
let hasGameStarted = true;

let engine;
let propeller;
let boxes = [];
let birds = [];
let colors = [];

// variables to hold the random colors that will be used to generate different colors for the spawned birds
let randomRedShades = [];
let randomGreenShades = [];
let randomBlueShades = [];

let ground;
let slingshotBird, slingshotConstraint;
let angle = 0;
let angleSpeed = 0;
let canvas;
////////////////////////////////////////////////////////////
function setup() {
    canvas = createCanvas(1000, 600);

    engine = Engine.create(); // create an engine

    setupGround();

    setupPropeller();

    setupTower();

    setupSlingshot();

    setupMouseInteraction();
}
////////////////////////////////////////////////////////////
function draw() {
    background(128);

    Engine.update(engine);

    // Start the game as long as the hasGameStarted variable is true
    hasGameStarted ? startGame() : null;

    // keep checking the status of the game
    checkGameStatus();
}
////////////////////////////////////////////////////////////
//use arrow keys to control propeller
function keyPressed() {
    if (keyCode == LEFT_ARROW) {
        // Increase speed in the left direction when propeller is moving left
        angleSpeed += 0.01;
    } else if (keyCode == RIGHT_ARROW) {
        // Increase speed in the right direction when propeller is moving right
        angleSpeed -= 0.01;
    }
    // On Enter Key press, restart the game. Can happen any time (Not necessarily when game ends)
    if (keyPressed && keyCode === 13) {
        playAgain();
    }
}
////////////////////////////////////////////////////////////
function keyTyped() {
    //if 'b' create a new bird to use with propeller
    if (key === 'b') {
        setupBird();
    }

    //if 'r' reset the slingshot
    if (key === 'r') {
        removeFromWorld(slingshotBird);
        removeFromWorld(slingshotConstraint);
        setupSlingshot();
    }
}
// wrapper function that runs all the necessary functions to start the game (runs if hasGameStarted is true)
function startGame() {
    drawGround();

    drawPropeller();

    drawTower();

    drawBirds();

    drawSlingshot();

    drawTimer();
}

function drawTimer() {
    fill(255);
    textAlign(CENTER);
    textSize(28);
    text(`Time Remaining: ${countDown} seconds`, 190, 30);
    // 1 second equates 60 frames
    // as long as the framecount is under 60 and the countDown is still not finished, decrement countdown by 1
    frameCount % 60 == 0 && countDown > 0 ? countDown-- : false;
}

// Check if the game is still ongoing, cleared or lost
function checkGameStatus() {
    if (countDown <= 0 && boxes.length > 0) {
        text(`GAME OVER. Press Enter to play again!`, width / 2, height / 2);
        hasGameStarted = false;
    } else if (boxes.length === 0) {
        text(
            `You have cleared all boxes. Good work!. Press Enter to play again!`,
            width / 2,
            height / 2
        );
        hasGameStarted = false;
    }
}

// restart the game
function playAgain() {
    boxes = [];
    birds = [];
    colors = [];
    randomRedShades = [];
    randomGreenShades = [];
    randomBlueShades = [];
    angle = 0;
    angleSpeed = 0;
    setup();
    hasGameStarted = true;
    countDown = 60;
}
//**********************************************************************
//  HELPER FUNCTIONS - DO NOT WRITE BELOW THIS line
//**********************************************************************

//if mouse is released destroy slingshot constraint so that
//slingshot bird can fly off
function mouseReleased() {
    setTimeout(() => {
        slingshotConstraint.bodyB = null;
        slingshotConstraint.pointA = { x: 0, y: 0 };
    }, 100);
}
////////////////////////////////////////////////////////////
//tells you if a body is off-screen
function isOffScreen(body) {
    let pos = body.position;
    return pos.y > height || pos.x < 0 || pos.x > width;
}
////////////////////////////////////////////////////////////
//removes a body from the physics world
function removeFromWorld(body) {
    World.remove(engine.world, body);
}
////////////////////////////////////////////////////////////
function drawVertices(vertices) {
    beginShape();
    for (let i = 0; i < vertices.length; i++) {
        vertex(vertices[i].x, vertices[i].y);
    }
    endShape(CLOSE);
}
////////////////////////////////////////////////////////////
function drawConstraint(constraint) {
    push();
    let offsetA = constraint.pointA;
    let posA = { x: 0, y: 0 };
    if (constraint.bodyA) {
        posA = constraint.bodyA.position;
    }
    let offsetB = constraint.pointB;
    let posB = { x: 0, y: 0 };
    if (constraint.bodyB) {
        posB = constraint.bodyB.position;
    }
    strokeWeight(5);
    stroke(255);
    line(posA.x + offsetA.x, posA.y + offsetA.y, posB.x + offsetB.x, posB.y + offsetB.y);
    pop();
}
