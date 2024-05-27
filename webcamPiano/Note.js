// Note Class that's used in Grid class.
class Note {
    // parameters for each note.
    constructor(size, position, state) {
        this.size = size;
        this.position = position;
        this.state = state;
    }

    // code refactored from the Grid class to work here.
    // It makes sense that each note instance has a self draw function
    selfDraw(x, y, arrLength) {
        let alpha = this.state[y] * 200;
        let c1, c2;
        // choices based on user color selection in instructions
        if (currentColorScheme === 'redblue') {
            c1 = color(255, 0, 0, alpha);
            c2 = color(0, 0, 255, alpha);
        } else if (currentColorScheme === 'greenblue') {
            c1 = color(0, 255, 0, alpha);
            c2 = color(0, 0, 255, alpha);
        } else {
            c1 = color(255, 0, 0, alpha);
            c2 = color(0, 255, 0, alpha);
        }

        // code refactored from the Grid class to work in the Note class
        let mappedRange = map(x, 0, arrLength, 0, 1);
        let mix = lerpColor(c1, c2, mappedRange);
        fill(mix);
        let s = this.state[y];
        push();
        // if the current selected shape is ellipse, draw it
        if (currentShape === 'ellipse') {
            ellipse(
                this.position[y].x,
                this.position[y].y,
                (this.size[y] / 2) * s,
                (this.size[y] / 2) * s
            );
        } else {
            // otherwise, draw a rectangle
            rect(
                this.position[y].x,
                this.position[y].y,
                (this.size[y] / 2) * s,
                (this.size[y] / 2) * s
            );
        }
        pop();
    }
}
