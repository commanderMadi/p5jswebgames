/****  Further Developments Introduced ****/
/*
 * Created a Note custom JS class and refactored code from the Grid function to accommodate for these changes
 * Created logic to give user the ability to choose between three different color schemes for the note transitions
 * Created logic to give user the ability to choose between a square-shaped or an ellipse-shaped note
 * Added a custom CSS file to control some styling for the added buttons
 */

// ********************************
// BACKGROUND SUBTRACTION EXAMPLE *
// ********************************

/****  Global Variables ****/

let video;
let prevImg;
let diffImg;
let currImg;
let thresholdSlider;
let threshold;
let grid;
let instructionsContainer;
let colorSwitchContainer;
let shapeSwitchContainer;
let switchToRedGreen;
let switchToGreenBlue;
let switchToRedBlue;
let switchToSquares;
let switchToEllipses;
let currentColorScheme = 'redblue';
let currentShape = 'ellipse';

function setup() {
    createCanvas(640 * 2, 480);
    pixelDensity(1);
    video = createCapture(VIDEO);
    video.hide();
    thresholdSlider = createSlider(0, 255, 50);
    thresholdSlider.position(20, 20);
    // create a grid instance
    grid = new Grid(640, 480);

    // instruction container creation, positioning and styling
    instructionsContainer = createDiv('Instructions');
    instructionsContainer.position(3, height + 50);
    instructionsContainer.style('display', 'flex');
    instructionsContainer.style('flex-direction', 'column');
    instructionsContainer.style('align-items', 'space-between');
    instructionsContainer.style('margin-left', '15px');
    instructionsContainer.style('font-size', '32px');

    // color switch instructions container creation, positioning and styling
    colorSwitchContainer = createDiv('Note Color Switch Controls');
    colorSwitchContainer.parent(instructionsContainer);
    colorSwitchContainer.style('display', 'flex');
    colorSwitchContainer.style('flex-direction', 'column');
    colorSwitchContainer.style('font-size', '20px');

    // shape switch instructions container creation, positioning and styling
    shapeSwitchContainer = createDiv('Note Shape Switch Controls');
    shapeSwitchContainer.parent(instructionsContainer);
    shapeSwitchContainer.style('display', 'flex');
    shapeSwitchContainer.style('flex-direction', 'column');
    shapeSwitchContainer.style('font-size', '20px');

    // color buttons logic, styling and positioning
    switchToGreenBlue = createButton('Green - Blue');
    switchToGreenBlue.attribute('id', 'greenblue');
    switchToGreenBlue.parent(colorSwitchContainer);
    switchToGreenBlue.mousePressed(activateGreenBlue);

    switchToRedGreen = createButton('Red - Green');
    switchToRedGreen.attribute('id', 'redgreen');

    switchToRedGreen.parent(colorSwitchContainer);
    switchToRedGreen.mousePressed(activateRedGreen);

    switchToRedBlue = createButton('Red - Blue');
    switchToRedBlue.attribute('id', 'redblue');
    switchToRedBlue.parent(colorSwitchContainer);
    switchToRedBlue.mousePressed(activateRedBlue);

    // shape switch buttons logic, styling and positioning
    switchToSquares = createButton('Square');
    switchToSquares.parent(shapeSwitchContainer);
    switchToSquares.mousePressed(activateSquareShape);

    switchToEllipses = createButton('Ellipse');
    switchToEllipses.parent(shapeSwitchContainer);
    switchToEllipses.mousePressed(activateEllipseShape);
}

function draw() {
    background(0);
    image(video, 0, 0);

    currImg = createImage(video.width, video.height);
    currImg.copy(video, 0, 0, video.width, video.height, 0, 0, video.width, video.height);
    // resize the current image to a quarter of its original size
    currImg.resize(currImg.width * 0.25, currImg.height * 0.25);
    // apply filter to the current image
    currImg.filter(BLUR, 3);

    diffImg = createImage(video.width, video.height);
    // resize the diff image to a quarter of its original size
    diffImg.resize(diffImg.width * 0.25, diffImg.height * 0.25);
    diffImg.loadPixels();

    threshold = thresholdSlider.value();

    if (typeof prevImg !== 'undefined') {
        prevImg.loadPixels();
        currImg.loadPixels();
        for (let x = 0; x < currImg.width; x += 1) {
            for (let y = 0; y < currImg.height; y += 1) {
                let index = (x + y * currImg.width) * 4;
                let redSource = currImg.pixels[index + 0];
                let greenSource = currImg.pixels[index + 1];
                let blueSource = currImg.pixels[index + 2];

                let redBack = prevImg.pixels[index + 0];
                let greenBack = prevImg.pixels[index + 1];
                let blueBack = prevImg.pixels[index + 2];

                let d = dist(redSource, greenSource, blueSource, redBack, greenBack, blueBack);

                if (d > threshold) {
                    diffImg.pixels[index + 0] = 0;
                    diffImg.pixels[index + 1] = 0;
                    diffImg.pixels[index + 2] = 0;
                    diffImg.pixels[index + 3] = 255;
                } else {
                    diffImg.pixels[index + 0] = 255;
                    diffImg.pixels[index + 1] = 255;
                    diffImg.pixels[index + 2] = 255;
                    diffImg.pixels[index + 3] = 255;
                }
            }
        }
    }
    diffImg.updatePixels();
    image(diffImg, 640, 0);

    noFill();
    stroke(255);
    text(threshold, 160, 35);
    prevImg = createImage(currImg.width, currImg.height);
    prevImg.copy(currImg, 0, 0, currImg.width, currImg.height, 0, 0, currImg.width, currImg.height);
    grid.run(diffImg);
}

// uncommented function from original source code as it is no longer doing anything useful.
// function keyPressed() {
//     console.log('saved new background');
// }

// faster method for calculating color similarity which does not calculate root.
// Only needed if dist() runs slow
function distSquared(x1, y1, z1, x2, y2, z2) {
    let d = (x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1) + (z2 - z1) * (z2 - z1);
    return d;
}

// activate green blue color scheme
function activateGreenBlue() {
    currentColorScheme = 'greenblue';
}
// activate red green color scheme
function activateRedGreen() {
    currentColorScheme = 'redgreen';
}
// activate red blue color scheme
function activateRedBlue() {
    currentColorScheme = 'redblue';
}
// activate note draw instruction as s shape
function activateSquareShape() {
    currentShape = 'square';
}
// activate note draw instruction as ellipse shape
function activateEllipseShape() {
    currentShape = 'ellipse';
}
