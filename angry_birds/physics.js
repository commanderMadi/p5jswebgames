////////////////////////////////////////////////////////////////
function setupGround() {
    ground = Bodies.rectangle(500, 600, 1000, 40, {
        isStatic: true,
        angle: 0,
    });
    World.add(engine.world, [ground]);
}

////////////////////////////////////////////////////////////////
// draw the ground object
function drawGround() {
    push();
    fill(128);
    drawVertices(ground.vertices);
    pop();
}
////////////////////////////////////////////////////////////////
function setupPropeller() {
    // set up the propeller object
    propeller = Bodies.rectangle(150, 480, 200, 15, { angle, isStatic: true });

    // add the propeller to the world
    World.add(engine.world, [propeller]);
}
////////////////////////////////////////////////////////////////
//updates and draws the propeller
function drawPropeller() {
    push();
    // draw the propeller
    drawVertices(propeller.vertices);
    // Set the initial angle of the propeller
    Body.setAngle(propeller, angle);

    // dictate the rotation speed of the propeller when moved
    Body.setAngularVelocity(propeller, angleSpeed);
    angle += angleSpeed;
    pop();
}
////////////////////////////////////////////////////////////////
function setupBird() {
    // set up the Bird object
    let bird = Bodies.circle(mouseX, mouseY, 20, { friction: 0, restitution: 0.95 });
    Matter.Body.setMass(bird, bird.mass * 10);
    World.add(engine.world, [bird]);
    birds.push(bird);
    // Add random colors to each bird
    let randomShadeOfRed = Math.floor(random(255));
    let randomShadeOfGreen = Math.floor(random(255));
    let randomShadeOfBlue = Math.floor(random(255));
    randomRedShades.push(randomShadeOfRed);
    randomGreenShades.push(randomShadeOfGreen);
    randomBlueShades.push(randomShadeOfBlue);
}
////////////////////////////////////////////////////////////////
function drawBirds() {
    //updates and draws the propeller
    push();
    for (let i = 0; i < birds.length; i++) {
        let bird = birds[i];
        let randomShadeOfRed = randomRedShades[i];
        let randomShadeOfGreen = randomGreenShades[i];
        let randomShadeOfBlue = randomBlueShades[i];
        fill(randomShadeOfRed, randomShadeOfGreen, randomShadeOfBlue, 255);
        drawVertices(bird.vertices);
        if (isOffScreen(bird)) {
            // Remove each bird from the matter js world and the birds array when the bird flies off the screen
            removeFromWorld(bird);
            birds.splice(i, 1);
            randomRedShades.splice(i, 1);
            randomGreenShades.splice(i, 1);
            randomBlueShades.splice(i, 1);

            i--;
        }
    }
    pop();
}
////////////////////////////////////////////////////////////////
//creates a tower of boxes
function setupTower() {
    let towerWidth = 3;
    let towerHeight = 6;
    // Nested for loops that start by filling the boxes vertically on each column before moving to the adjacent column
    for (let x = 0; x < towerWidth; x++) {
        for (let y = 0; y < towerHeight; y++) {
            // Dividing the available width and height by the width and the height of the canvas, respectively
            // Adding appropriate spacing between each box
            let box = Bodies.rectangle(
                Math.round(width / towerWidth + 300) + x * 80,
                Math.round(height / towerHeight + 40) + y * 80,
                80,
                80
            );
            boxes.push(box);
            // add the boxes to the world
            World.add(engine.world, [box]);

            // Added random shades of green to the colors array
            let randomShadeOfGreen = Math.floor(random(255));
            colors.push(randomShadeOfGreen);
        }
    }
}
////////////////////////////////////////////////////////////////
//draws tower of boxes
function drawTower() {
    push();

    for (let i = 0; i < boxes.length; i++) {
        let box = boxes[i];
        let randomShadeOfGreen = colors[i];
        fill(0, randomShadeOfGreen, 0);
        drawVertices(box.vertices);
        if (isOffScreen(box)) {
            // Remove each box from the matter js world and the birds array when the box flies off the screen
            removeFromWorld(box);
            boxes.splice(i, 1);
            colors.splice(i, 1);
            i--;
        }
    }
    pop();
}
////////////////////////////////////////////////////////////////
function setupSlingshot() {
    // Create the slingshotBird in the same way the Bird objects are created
    slingshotBird = Bodies.circle(230, 200, 30, { friction: 0, restitution: 0.95 });
    Matter.Body.setMass(slingshotBird, slingshotBird.mass * 10);

    // Create a global constraint to which the slingshotbird is attached
    slingshotConstraint = Constraint.create({
        pointA: { x: 230, y: 150 },
        bodyB: slingshotBird,
        pointB: { x: 0, y: 0 },
        stiffness: 0.01,
        damping: 0.0001,
    });
    // add the slingshotBird and its constraint to the world
    World.add(engine.world, [slingshotBird, slingshotConstraint]);
}
////////////////////////////////////////////////////////////////
//draws slingshot bird and its constraint
function drawSlingshot() {
    push();
    // give the slingshotBird an orange color
    fill('orange');
    // draw the slingshotBird and the global constraint on the screen
    drawVertices(slingshotBird.vertices);
    drawConstraint(slingshotConstraint);
    pop();
}
/////////////////////////////////////////////////////////////////
function setupMouseInteraction() {
    let mouse = Mouse.create(canvas.elt);
    let mouseParams = {
        mouse: mouse,
        constraint: { stiffness: 0.05 },
    };
    mouseConstraint = MouseConstraint.create(engine, mouseParams);
    mouseConstraint.mouse.pixelRatio = pixelDensity();
    World.add(engine.world, mouseConstraint);
}
