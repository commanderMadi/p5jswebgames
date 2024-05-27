/***** Further Developments Introudced *****/
/*
 * Added sharpen filter
 * Added grayscale filter
 * Added invert filter
 * Added controls to give the user freedom to select between the different filters
 */

// Image of Husky Creative commons from Wikipedia:
// https://en.wikipedia.org/wiki/Dog#/media/File:Siberian_Husky_pho.jpg
let imgIn, instructionsContainer, currentyAppliedFilterInfo;
let activeFilter = 'early bird filter';
let matrix = [
    [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
    [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
    [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
    [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
    [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
    [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
    [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
    [1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64, 1 / 64],
];

// special matrix for the sharpen filter
let sharpenMatrix = [
    [-1, -1, -1],
    [-1, 9, -1],
    [-1, -1, -1],
];

/////////////////////////////////////////////////////////////////
function preload() {
    imgIn = loadImage('assets/husky.jpg');
}
/////////////////////////////////////////////////////////////////
function setup() {
    createCanvas(imgIn.width * 2, imgIn.height);

    // instructions container creation, positioning and styling
    instructionsContainer = createDiv('Instructions');
    instructionsContainer.position(10, height + 50);
    instructionsContainer.style('font-size', '30px');

    // invert filter instruction element creation, positioning and styling
    let invertInstruction = createP('Press i to apply the invert filter');
    invertInstruction.style('font-size', '16px');
    invertInstruction.parent(instructionsContainer);

    // grayscale filter instruction element creation, positioning and styling
    let grayscaleInstruction = createP('Press g to apply the grayscale filter');
    grayscaleInstruction.style('font-size', '16px');
    grayscaleInstruction.parent(instructionsContainer);

    // sharpen filter instruction element creation, positioning and styling
    let sharpenInstruction = createP('Press s to apply the sharpen filter');
    sharpenInstruction.style('font-size', '16px');
    sharpenInstruction.parent(instructionsContainer);

    // early bird filter instruction element creation, positioning and styling
    let earlyBirdInstruction = createP('Press z to reset back to the default early bird filter');
    earlyBirdInstruction.style('font-size', '16px');
    earlyBirdInstruction.parent(instructionsContainer);

    // active filter information container creation, positioning and styling
    currentyAppliedFilterInfo = createP(`Currently applied filter: ${activeFilter}`);
    currentyAppliedFilterInfo.style('font-size', '24px');
    currentyAppliedFilterInfo.style('color', 'magenta');
    currentyAppliedFilterInfo.parent(instructionsContainer);
}
/////////////////////////////////////////////////////////////////
function draw() {
    background(125);
    image(imgIn, 0, 0);
    // check the active filter and apply it accordingly
    switch (activeFilter) {
        case 'early bird filter':
            image(earlyBirdFilter(imgIn), imgIn.width, 0);
            break;
        case 'invert filter':
            image(invertFilter(imgIn), imgIn.width, 0);
            break;
        case 'sharpen filter':
            image(sharpenFilter(imgIn), imgIn.width, 0);
            break;
        case 'grayscale filter':
            image(grayScaleFilter(imgIn), imgIn.width, 0);
            break;
    }
    // display information about the active filter
    currentlyApplied(activeFilter);
    noLoop();
}
/////////////////////////////////////////////////////////////////
function mousePressed() {
    loop();
}
// the initial filter, applied when the canvas is first loaded
function earlyBirdFilter(img) {
    let resultImg = createImage(imgIn.width, imgIn.height);
    resultImg = sepiaFilter(imgIn);
    resultImg = darkCorners(resultImg);
    resultImg = radialBlurFilter(resultImg);
    resultImg = borderFilter(resultImg);
    return resultImg;
}

/************** Sepia Filter **************/
function sepiaFilter(img) {
    let imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();
    img.loadPixels();

    // looping over the image dimensions to obtain the specified pixels indices
    for (let x = 0; x < img.width; x++) {
        for (let y = 0; y < img.height; y++) {
            let index = (img.width * y + x) * 4;
            let red = img.pixels[index + 0];
            let green = img.pixels[index + 1];
            let blue = img.pixels[index + 2];

            // sepia filter calculations, provided in instructions
            let newRed = red * 0.393 + green * 0.769 + blue * 0.189;
            let newGreen = red * 0.349 + green * 0.686 + blue * 0.168;
            let newBlue = red * 0.272 + green * 0.534 + blue * 0.131;

            // apply the calculations to the produced images
            imgOut.pixels[index + 0] = newRed;
            imgOut.pixels[index + 1] = newGreen;
            imgOut.pixels[index + 2] = newBlue;
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();

    return imgOut;
}
/************** dark corners effect (vigenette) **************/

function darkCorners(img) {
    let imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();
    img.loadPixels();

    // looping over the image dimensions to obtain the specified pixels indices
    for (let x = 0; x < img.width; x++) {
        for (let y = 0; y < img.height; y++) {
            let index = (img.width * y + x) * 4;

            // the dynamic luminance variable
            let dynLum;
            // calculate distance from the center of the image
            let distance = dist(x, y, img.width / 2, img.height / 2);

            switch (distance) {
                // if distance is less than or equal 300, dynamic luminance is set to 1
                case distance <= 300:
                    dynLum = 1;
                    break;
                // if distance is greater than 300 and less than or equal to 450, dynamic luminance is set between 1 and 0.4
                case distance > 300 && distance <= 450:
                    dynLum = map(distance, 300, 450, 1, 0.4);
                    break;
                default:
                    // otherwise, dynamic luminance is set between 1 and 0.4
                    dynLum = map(distance, 450, img.height, 0.4, 0);
                    break;
            }

            // multiply the channels by the dynamic lumninance values produced according to distance from the center
            let red = img.pixels[index + 0] * dynLum;
            let green = img.pixels[index + 1] * dynLum;
            let blue = img.pixels[index + 2] * dynLum;

            // add constrains to color channels to ensure they don't exceed the possible values (0-255)
            let constrainedRed = constrain(red, 0, 255);
            let constrainedGreen = constrain(green, 0, 255);
            let constrainedBlue = constrain(blue, 0, 255);

            imgOut.pixels[index + 0] = constrainedRed;
            imgOut.pixels[index + 1] = constrainedGreen;
            imgOut.pixels[index + 2] = constrainedBlue;
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();

    return imgOut;
}
/************** radial blur filter (modified from blurFilter function I wrote while live coding in class) **************/

function radialBlurFilter(img) {
    let imgOut = createImage(img.width, img.height);
    let matrixSize = matrix.length;
    let dynBlur;
    imgOut.loadPixels();
    img.loadPixels();

    // looping over the image dimensions to obtain the specified pixels indices
    for (let x = 0; x < imgOut.width; x++) {
        for (let y = 0; y < imgOut.height; y++) {
            let index = (x + y * imgOut.width) * 4;
            let red = img.pixels[index + 0];
            let green = img.pixels[index + 1];
            let blue = img.pixels[index + 2];
            // calculate the distance between the pixel and the mouse location on the coordinate system
            let distanceBetweenPixelAndMouse = dist(x, y, mouseX, mouseY);
            let mappedDistance = map(distanceBetweenPixelAndMouse, 100, 300, 0, 1);
            // constrain the blur to values between 0 and 1
            dynBlur = constrain(mappedDistance, 0, 1);

            // apply convlution
            let c = convolution(x, y, matrix, matrixSize, img);

            // add the formula specified in the instructions
            imgOut.pixels[index + 0] = c[0] * dynBlur + red * (1 - dynBlur);
            imgOut.pixels[index + 1] = c[1] * dynBlur + green * (1 - dynBlur);
            imgOut.pixels[index + 2] = c[2] * dynBlur + blue * (1 - dynBlur);
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();
    return imgOut;
}
/************** convolution functionality (modified from convolution function I wrote while live coding in class) **************/

function convolution(x, y, matrix, matrixSize, img) {
    let totalRed = 0.0;
    let totalGreen = 0.0;
    let totalBlue = 0.0;
    let offset = floor(matrixSize / 2);

    // convolution matrix loop
    for (let i = 0; i < matrixSize; i++) {
        for (let j = 0; j < matrixSize; j++) {
            // Get pixel loc within convolution matrix
            let xloc = x + i - offset;
            let yloc = y + j - offset;
            let index = (xloc + img.width * yloc) * 4;
            // ensure we don't address a pixel that doesn't exist
            index = constrain(index, 0, img.pixels.length - 1);

            // multiply all values with the mask and sum up
            totalRed += img.pixels[index + 0] * matrix[i][j];
            totalGreen += img.pixels[index + 1] * matrix[i][j];
            totalBlue += img.pixels[index + 2] * matrix[i][j];
        }
    }
    // return the new color
    return [totalRed, totalGreen, totalBlue];
}
/**************  border filter **************/

function borderFilter(img) {
    // create the buffer
    let buffer = createGraphics(img.width, img.height);

    // we use the same vanilla methods available in P5 JS as methods on the buffer object
    buffer.image(img, 0, 0);
    buffer.stroke(255);
    buffer.strokeWeight(15);
    buffer.noFill();

    // corner radii to add rounded borders
    let topLeftBorder = (topRightBorder = bottomLeftBorder = bottomRightBorder = 30);

    // a rectangle with rounded borders to create corners around the filtered image
    buffer.rect(
        5,
        5,
        img.width - 15,
        img.height - 15,
        topLeftBorder,
        topRightBorder,
        bottomRightBorder,
        bottomLeftBorder
    );
    // a rectangle without borders to cover on the cut corners produced by the previous rectangle
    buffer.rect(5, 5, img.width - 10, img.height - 10);

    return buffer;
}

/**************  invert filter (modified from invertFilter function I wrote while live coding in class) **************/
function invertFilter(img) {
    let imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();
    img.loadPixels();

    // looping over the image dimensions to obtain the specified pixels indices
    for (let x = 0; x < img.width; x++) {
        for (let y = 0; y < img.height; y++) {
            let index = (img.width * y + x) * 4;
            // diffing to obtain inverted colors
            let red = 255 - img.pixels[index + 0];
            let green = 255 - img.pixels[index + 1];
            let blue = 255 - img.pixels[index + 2];

            imgOut.pixels[index + 0] = red;
            imgOut.pixels[index + 1] = green;
            imgOut.pixels[index + 2] = blue;
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();

    return imgOut;
}
/**************  grayscale filter (modified from grayscale function I wrote while live coding in class) **************/
function grayScaleFilter(img) {
    let imgOut = createImage(img.width, img.height);
    imgOut.loadPixels();
    img.loadPixels();

    // looping over the image dimensions to obtain the specified pixels indices
    for (let x = 0; x < img.width; x++) {
        for (let y = 0; y < img.height; y++) {
            let index = (img.width * y + x) * 4;
            let red = img.pixels[index + 0];
            let green = img.pixels[index + 1];
            let blue = img.pixels[index + 2];

            // luma calculation method
            let gray = red * 0.299 + green * 0.587 + blue * 0.114;

            // apply the calculations
            imgOut.pixels[index + 0] = gray;
            imgOut.pixels[index + 1] = gray;
            imgOut.pixels[index + 2] = gray;
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();

    return imgOut;
}
/**************  sharpen filter (modified from grayscale function I wrote while live coding in class) **************/
function sharpenFilter(img) {
    let imgOut = createImage(img.width, img.height);
    let matrixSize = sharpenMatrix.length;
    imgOut.loadPixels();
    img.loadPixels();

    // looping over the image dimensions to obtain the specified pixels indices
    for (let x = 0; x < img.width; x++) {
        for (let y = 0; y < img.height; y++) {
            let index = (img.width * y + x) * 4;
            // utilize the sharpen matrix for the convolution
            let c = convolution(x, y, sharpenMatrix, matrixSize, img);
            imgOut.pixels[index + 0] = c[0];
            imgOut.pixels[index + 1] = c[1];
            imgOut.pixels[index + 2] = c[2];
            imgOut.pixels[index + 3] = 255;
        }
    }
    imgOut.updatePixels();

    return imgOut;
}

function keyPressed() {
    switch (keyCode) {
        // if the key pressed is i, switch active filter to invert
        case 73:
            activeFilter = 'invert filter';
            break;
        // if the key pressed is g, switch active filter to grayscale
        case 71:
            activeFilter = 'grayscale filter';
            break;
        // if the key pressed is s, switch active filter to sharpen
        case 83:
            activeFilter = 'sharpen filter';
            break;
        // if the key pressed is z, reset back active filter to early bird
        case 90:
            activeFilter = 'early bird filter';
            break;
    }

    // ensure drawing continues and code is applied when a key is pressed
    loop();
}

// function to update the information about what filter is currently active
function currentlyApplied(filter) {
    // if previous information already exists, remove it
    if (currentyAppliedFilterInfo) {
        currentyAppliedFilterInfo.remove();
    }
    // then create new information regarding the new active filter
    currentyAppliedFilterInfo = createP(`Currently applied filter: ${activeFilter}`);
    currentyAppliedFilterInfo.style('font-size', '24px');
    currentyAppliedFilterInfo.style('color', 'magenta');
    currentyAppliedFilterInfo.parent(instructionsContainer);
}
