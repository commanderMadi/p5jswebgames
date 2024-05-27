///////////// My customizations to the game /////////////
/*
1. Features Added
   a. Added custom colors that are interpolated by the lerp function
   b. Added zoom in/out functionality when users move across the y-axis

2. Code enhancements
   a. Used ES6 syntax when possible (let, const)
   b. Code formatted done by prettier
*/
//////////////////////////

/* Global Variables*/
let stepSize = 20;

function setup() {
    createCanvas(500, 500);
}
///////////////////////////////////////////////////////////////////////
function draw() {
    background(125);

    colorGrid();
    compassGrid();
}
///////////////////////////////////////////////////////////////////////
function colorGrid() {
    // red rgb value
    const from = color(255, 0, 0);

    // green rgb value
    const to = color(0, 255, 0);
    let interpolatedColor;

    // custom colors chosen by me
    const customColorOne = color(2, 180, 81);
    const customColorTwo = color(0, 0, 255);

    // remove the rectangle borders
    noStroke();
    for (let x = 0; x < width; x += stepSize) {
        for (let y = 0; y < height; y += stepSize) {
            // changes in mouseX determine how fast the color shifts occur (smaller values = faster speeds)
            let speed = map(mouseX, 0, width, 20, 200);

            // changes in mouseY determine how much to zoom into and out the grid (smaller values = more zoom out)
            let mouseYChangeInterval = map(mouseY, 0, height, 50, 200);

            /* generate 3D noise based on the change intervals in mouseX and mouseY
             with frameCount used as the third param */
            let generated3DNoise = noise(
                x / mouseYChangeInterval,
                y / mouseYChangeInterval,
                frameCount / speed
            );

            /* set the colors to the left half side of the grid to be a randomly interpolated color from mixing
          green and red colors. */
            if (x <= 230) {
                interpolatedColor = lerpColor(from, to, generated3DNoise);
                /* set the colors to the right half side of the grid to be a randomly interpolated color from mixing
          the custom colors designated above. */
            } else if (x > 230) {
                interpolatedColor = lerpColor(customColorOne, customColorTwo, generated3DNoise);
            }
            // fill the rectangles with the values of the interpolated colors
            fill(interpolatedColor);
            // draw the grid rectangles
            rect(x, y, stepSize, stepSize);
        }
    }
}
///////////////////////////////////////////////////////////////////////
function compassGrid() {
    // set the color of each compass line to black
    stroke(0);
    // convert to degrees mode because radians yield compass lines that move too fast
    angleMode(DEGREES);
    // set the thickness of each compass line to 2
    strokeWeight(2);
    for (let x = 0; x < width; x += stepSize) {
        for (let y = 0; y < height; y += stepSize) {
            // BEGIN UPDATES //
            push();
            // translate to the center of each grid
            translate(x + stepSize / 2, y + stepSize / 2);
            // changes in mouseX determine how fast the color shifts occur (smaller values = faster speeds)
            let mouseXChangeInterval = map(mouseX, 0, width, 20, 500);
            let n = noise(x / 500, y / 500, frameCount / mouseXChangeInterval);
            // mapping the noise value to get an angle between 0 and 720
            let angle = map(n, 0, 1, 0, 720);
            // rotate by the mapped 3D generated noise value
            rotate(angle);
            // draw the compass lines
            line(0, 0, 0, stepSize);
            pop();
            // END UPDATES //
        }
    }
}
