/***** Further Developments Introudced *****/
/*
 * Added grid height control slider
 * Added camera direction control slider
 * Added two directional lights and noise options
 * Added Switches to control the added lights and noise
 * Added sliders to change color channels when directional light is on (Sliders are disabled if the lights are off)
 */

/**** Global Variables ****/

// grid initial values
let gridBoxSize = 50;
let gridStartPosX = -400;
let gridStartPosY = -400;
let gridEndPosX = 400;
let gridEndPosY = 400;

// initial cam location
let camXLoc;
let camYLoc;
let camZLoc;

// confetti initial values
let confLocs = [];
let confTheta = [];
let vectorsAmount = 200;
let confettiAnimationIncrement = 15;
let confettiRotationIncrement = 30;

// grid control sliders and initial values
let gridHeightSlider;
let cameraSlider;
let len = 0;
let minLength = 1;
let maxLength = 250;
let minCam = -150;
let maxCam = 2000;
let camDefault = 1000;

// switch buttons and containers
let lightToggleButton;
let noiseToggleButton;
let colorControlSlidersContainer;
let gridControlSlidersContainer;
let buttonsContainer;

// Switch controls initial behaviors
let lightStatus = 'Off';
let noiseStatus = 'Not Applied';
let isLightOn = false;
let isNoiseOn = false;

// default font for text drawn on canvas
let defaultFont;

// from the p5 js documentation p5js.org/reference/#/p5/loadFont. Required when using WEBGL
function preload() {
    defaultFont = loadFont('fonts/inconsolata.ttf');
}

function setup() {
    createCanvas(900, 800, WEBGL);
    angleMode(DEGREES);

    // default font sizing and styling, applied for text drawn on Canvas
    textSize(36);
    textFont(defaultFont);

    // create 200 3D vectors and random angle and populate the specified arrays accordingly
    for (let i = 0; i < vectorsAmount; i++) {
        confLocs.push(createVector(random(-500, 500), random(-800, 0), random(-500, 500)));
        confTheta.push(random(0, 360));
    }

    // grid control sliders container creation, positioning and styling
    gridControlSlidersContainer = createDiv('Grid Control Sliders');
    gridControlSlidersContainer.position(3, height + 20);
    gridControlSlidersContainer.style('display', 'flex');
    gridControlSlidersContainer.style('flex-direction', 'column');
    gridControlSlidersContainer.style('align-items', 'space-between');
    gridControlSlidersContainer.style('font-weight', 'bold');

    // grid height slider pre text creation and positioning
    let gridHeightLabelContainer = createSpan('Grid Height:');
    gridHeightLabelContainer.style('font-style', 'italic');
    gridHeightLabelContainer.style('font-weight', 'normal');
    gridHeightLabelContainer.parent(gridControlSlidersContainer);
    gridHeightLabelContainer.position(0, 25);

    // camera slider pre text creation and positioning
    let cameraDirectionLabelContainer = createSpan('Camera Direction:');
    cameraDirectionLabelContainer.style('font-style', 'italic');
    cameraDirectionLabelContainer.style('font-weight', 'normal');
    cameraDirectionLabelContainer.parent(gridControlSlidersContainer);
    cameraDirectionLabelContainer.position(0, 55);

    // grid height slider creation, positioning and styling
    gridHeightSlider = createSlider(minLength, maxLength, length);
    gridHeightSlider.style('margin', '8px 0 0 90px');
    gridHeightSlider.parent(gridControlSlidersContainer);
    gridHeightSlider.style('width', '250px');

    // camera slider creation, positioning and styling
    cameraSlider = createSlider(minCam, maxCam, camDefault);
    cameraSlider.style('margin', '13px 0 0 130px');
    cameraSlider.parent(gridControlSlidersContainer);
    cameraSlider.style('width', '250px');

    // light color control sliders container creation, positioning and styling
    colorControlSlidersContainer = createDiv('Color Control Sliders (Only when light is on)');
    colorControlSlidersContainer.position(300, height + 120);
    colorControlSlidersContainer.style('display', 'flex');
    colorControlSlidersContainer.style('flex-direction', 'column');
    colorControlSlidersContainer.style('align-items', 'space-between');
    colorControlSlidersContainer.style('font-weight', 'bold');

    // red slider creation, interaction, positioning and styling
    redSlider = createSlider(0, 255, 128, 1);
    redSlider.parent(colorControlSlidersContainer);
    redSlider.style('margin', '10px 0 10px 50px');
    let redLabelContainer = createSpan('Red');
    redLabelContainer.parent(colorControlSlidersContainer);
    redLabelContainer.style('font-style', 'italic');
    redLabelContainer.style('font-weight', 'normal');
    redLabelContainer.position(0, 30);
    redSlider.attribute('disabled', '');

    // green slider creation, interaction, positioning and styling
    greenSlider = createSlider(0, 255, 128, 1);
    greenSlider.parent(colorControlSlidersContainer);
    greenSlider.style('margin', '10px 0 10px 50px');
    let greenLabelContainer = createSpan('Green');
    greenLabelContainer.parent(colorControlSlidersContainer);
    greenLabelContainer.style('font-style', 'italic');
    greenLabelContainer.style('font-weight', 'normal');
    greenLabelContainer.position(0, 63);
    greenSlider.attribute('disabled', '');

    // blue slider creation, interaction, positioning and styling
    blueSlider = createSlider(0, 255, 128, 1);
    blueSlider.parent(colorControlSlidersContainer);
    blueSlider.style('margin', '10px 0 10px 50px');
    let blueLabelContainer = createSpan('Blue');
    blueLabelContainer.parent(colorControlSlidersContainer);
    blueLabelContainer.style('font-style', 'italic');
    blueLabelContainer.style('font-weight', 'normal');
    blueLabelContainer.position(0, 100);
    blueSlider.attribute('disabled', '');

    // light and noise button switches container creation, positioning and styling
    buttonsContainer = createDiv('Switches');
    buttonsContainer.style('font-weight', 'bold');
    buttonsContainer.position(5, height + 120);

    // light button creation, interaction, positioning and styling
    lightToggleButton = createButton('Light');
    lightToggleButton.mousePressed(flipLightToggle);
    lightToggleButton.position(0, 30);
    lightToggleButton.style('width', '150px');
    lightToggleButton.parent(buttonsContainer);

    // noise button creation, interaction, positioning and styling
    noiseToggleButton = createButton('Noise', false);
    noiseToggleButton.mousePressed(flipNoiseToggle);
    noiseToggleButton.position(155, 30);
    noiseToggleButton.parent(buttonsContainer);
}

function draw() {
    background(255, 125, 255);
    angleMode(DEGREES);

    // Light status text
    text(`Light: ${lightStatus} `, -440, -350);
    // Noise status text
    text(`Noise: ${noiseStatus} `, -440, -310);

    push();

    // using the input camera slider value to control rotation around x axis
    cameraXLoc = cos(frameCount) * cameraSlider.value();
    // specified y location, set in instructions
    cameraYLoc = -600;
    // using the input camera slider value to control rotation around z axis
    cameraZLoc = sin(frameCount) * cameraSlider.value();

    // Camera keeps rotating around x and Z axes, while pointing at the center of the scene
    camera(cameraXLoc, cameraYLoc, cameraZLoc, 1, 1, 1, 0, 1, 0);

    // apply two directionals lights to the mid y-component of the canvas height
    // Use the rgb sliders created to specify the reflected light properly
    if (isLightOn) {
        directionalLight(
            redSlider.value(),
            greenSlider.value(),
            blueSlider.value(),
            0,
            height / 2,
            0
        );
        directionalLight(
            redSlider.value(),
            greenSlider.value(),
            blueSlider.value(),
            0,
            height / 2,
            0
        );
    } else {
        // if there are no lights, revert to the default material and styling
        normalMaterial();
        stroke(0);
        strokeWeight(2);
    }

    // create the grid boxes
    for (let x = gridStartPosX; x < gridEndPosX; x += gridBoxSize) {
        for (let y = gridStartPosX; y < gridEndPosY; y += gridBoxSize) {
            push();

            // calculate the distance from the center of the coordinate system
            let distance = dist(x, y, 0, 0);

            // If noise toggle is on, apply noise to the grid, otherwise, keep the wavy sine structure modulating between 100 and 300
            isNoiseOn
                ? (len = map(noise(x / 10, y / 10, frameCount / 25), 0, 1, 100, 300))
                : (len = map(sin(distance + frameCount), -1, 1, 100, 300));

            // translate to the specified coordinates
            translate(x, 0, y);
            // Create the grid boxes with initial size of 50, change the height based on the value specified by the grid height slider
            box(gridBoxSize, len + gridHeightSlider.value(), gridBoxSize);
            pop();
        }
    }

    // splash confetti everywhere!
    confetti();
    pop();
}

// Toggle lights on and off based on user interaction
function flipLightToggle() {
    isLightOn = !isLightOn;
    isLightOn ? (lightStatus = 'On') : (lightStatus = 'Off');
    isLightOn ? redSlider.removeAttribute('disabled') : redSlider.attribute('disabled', '');
    isLightOn ? greenSlider.removeAttribute('disabled') : greenSlider.attribute('disabled', '');
    isLightOn ? blueSlider.removeAttribute('disabled') : blueSlider.attribute('disabled', '');
}

// Toggle noise on and off based on user interaction
function flipNoiseToggle() {
    isNoiseOn = !isNoiseOn;
    isNoiseOn ? (noiseStatus = 'Applied') : (noiseStatus = 'Not Applied');
}

// Confetti logic
function confetti() {
    for (let i = 0; i < confLocs.length; i++) {
        push();

        noStroke();
        let confettiX = confLocs[i].x;
        let confettiY = confLocs[i].y;
        let confettiZ = confLocs[i].z;
        let confettiAngle = confTheta[i];

        // initial translation to the specified confetti coordinates.
        translate(confettiX, confettiY, confettiZ);

        // rotate by the specified angle that is generated randomly in the confTheta array.
        rotateX(confettiAngle);

        // draw a plane of size 15 x 15
        plane(15, 15);

        // add animation increment to each generated vector
        confLocs[i].y += confettiAnimationIncrement;
        // add rotation speed increment to each generated vector
        confTheta[i] += confettiRotationIncrement;

        // reset confetti locations if they reached the middle of the coordinate system
        if (confLocs[i].y > 0) {
            confLocs[i].y = -800;
        }
        pop();
    }
}
