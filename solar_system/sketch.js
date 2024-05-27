///////////// My customizations to the game /////////////
/*

1. Features Added
   a. Added an extra celestial object that rotates around earth.

2. Code enhancements
   a. Used ES6 syntax when possible (let, const)
   b. Code formatted done by prettier
*/
//////////////////////////

let speed;

function setup() {
    createCanvas(900, 700);
}

function draw() {
    background(0);
    speed = frameCount;

    /***** Implementing the Sun transformation logic *****/

    translate(width / 2, height / 2);

    // Sun rotating around its axis at the speed / 3
    push();
    rotate(radians(speed / 3));
    celestialObj(color(255, 150, 0), 200); // Drawing the Sun celestial object
    pop();

    /***** Implementing the Earth transformation logic *****/

    // Earth rotating around the sun at velocity of speed variable
    rotate(radians(speed));

    /* The earth is at orbit 300 pixels. So 300 px on the x-axis and relatively, 75 px on the y-axis
    is a convenient number to rotate around the sun. We translate by these values.
    */
    translate(300, 300 / 4);

    // Now, rotating the earth around its axis at velocity of the speed variable
    push();
    rotate(radians(speed));
    celestialObj(color(0, 0, 255), 80); // Drawing the Earth celestial object

    /***** Implementing the Celestial Body transformation logic *****/
    // added a celestial object that rotates around the earth
    push();
    // It rotates around the earth at a velocity of speed * 1.25
    rotate(radians(speed * 1.25));
    // Giving the celestial body an orbit of 60 px on the x-axis and 15 px on the y-axis
    translate(60, 60 / 4);

    push();
    // The celestial object rotates around its axis at a velocity of the speed variable
    rotate(radians(speed));
    celestialObj(color(0, 255, 0), 25); // Drawing a green celestial body object
    pop();

    pop();

    pop();

    /***** Implementing the Moon transformation logic *****/
    push();
    /* Since the moon rotate in an opposite direction to the earth at velocity of speed * 2, we inverse by adding
    a negative sign to the rotation function.
    */
    rotate(radians(-speed * 2));
    /* The moon is at orbit 100 pixels. So 100 px on the x-axis and relatively, 25 px on the y-axis
     is a convenient number to rotate around the sun. We translate by these values.
    */
    translate(100, 100 / 4);
    celestialObj(color(255, 255, 255), 30); // Drawing the Moon celestial object

    pop(); //
}

function celestialObj(c, size) {
    strokeWeight(5);
    fill(c);
    stroke(0);
    ellipse(0, 0, size, size);
    line(0, 0, size / 2, 0);
}
