/***** Further Developments Introudced *****/
/*
 * Added code to randomize selected image on the left when the space key is pressed
 * Added code to transition between the original image on the left and the average image on the right (Using the lerp function)
 */

/***** Global Variables *****/
const imgs = [];
let avgImg;
const numOfImages = 30;
let firstImage;
let randomIndex = 0;
let instructionsContainer;

//////////////////////////////////////////////////////////
function preload() {
    // preload() runs once
    for (let i = 0; i < numOfImages; i++) {
        let imageLoaded = loadImage(`assets/${i}.jpg`);
        // add the loaded images to the imgs array
        imgs.push(imageLoaded);
    }
}
//////////////////////////////////////////////////////////
function setup() {
    firstImage = imgs[0];
    createCanvas(firstImage.width * 2, firstImage.height);
    pixelDensity(1);
    // create a shape based on the first image dimensions
    avgImg = createGraphics(firstImage.width, firstImage.height);

    // instructions container creation, positioning and stylings
    instructionsContainer = createDiv('Press space key on your keyboard to load a random image');
    instructionsContainer.position(10, height + 50);
    instructionsContainer.style('width', '100%');
    instructionsContainer.style('font-weight', 'bold');
    instructionsContainer.style('font-size', '24px');
}
//////////////////////////////////////////////////////////
function draw() {
    background(125);
    image(imgs[randomIndex], 0, 0);
    avgImg.loadPixels();
    for (let i = 0; i < imgs.length; i++) {
        let currentImage = imgs[i];
        currentImage.loadPixels();
    }

    // looping over the image dimensions and grabbing the indices
    for (let x = 0; x < firstImage.width; x++) {
        for (let y = 0; y < firstImage.height; y++) {
            let index = (y * firstImage.width + x) * 4;

            avgImg.pixels[index + 0] = 255;
            avgImg.pixels[index + 1] = 0;
            avgImg.pixels[index + 2] = 0;
            avgImg.pixels[index + 3] = 255; // bright red

            // initialize sum of red, green and blue channels to zero
            let sumR = (sumG = sumB = 0);

            // accumulate the values for each channel
            for (let i = 0; i < imgs.length; i++) {
                sumR += imgs[i].pixels[index + 0];
                sumG += imgs[i].pixels[index + 1];
                sumB += imgs[i].pixels[index + 2];
            }

            // map mouse x from 0 to canvas width to values between 0 and 1 since lerp functions best utilize these.
            // 0.1 is very close to the first value while 0.9 is very close to the second value
            let mappedX = map(mouseX, 0, width, 0.0, 1.0);

            // random image RGB channels
            let randomImageRedIndex = imgs[randomIndex].pixels[index + 0];
            let randomImageGreenIndex = imgs[randomIndex].pixels[index + 1];
            let randomImageBlueIndex = imgs[randomIndex].pixels[index + 2];

            // average RGB channels
            let avgRedIndex = sumR / imgs.length;
            let avgGreenIndex = sumG / imgs.length;
            let avgBlueIndex = sumB / imgs.length;

            // using the lerp function to obtain a number that dictates transition between the randomly selected image and the average image
            avgImg.pixels[index + 0] = lerp(randomImageRedIndex, avgRedIndex, mappedX);
            avgImg.pixels[index + 1] = lerp(randomImageGreenIndex, avgGreenIndex, mappedX);
            avgImg.pixels[index + 2] = lerp(randomImageBlueIndex, avgBlueIndex, mappedX);
        }
    }
    // update pixels array to inform we have changed the data of the average image
    avgImg.updatePixels();

    // draw the average image exactly on the other right half side of the canvas
    image(avgImg, width - firstImage.width, 0);
    noLoop();
}

// loop when mouse is moved across the canvas to enable the transition effect between the random image and the average image
function mouseMoved() {
    loop();
}
// When space key is pressed, load a random image onto the canvas
function keyPressed() {
    if (keyCode === 32) {
        randomIndex = Math.floor(random(0, 30));
        loop();
    }
}
