class Grid {
    // Modified to accommodate changes introduced in the Note class.
    constructor(_w, _h) {
        this.gridWidth = _w;
        this.gridHeight = _h;

        // notes array. This will now hold data about position, state and size
        this.notes = [];

        // default note size
        this.defaultNoteSize = 40;

        // initalise grid structure and state
        for (let x = 0; x < _w; x += 40) {
            let notePosition = [];
            let noteState = [];
            let noteSize = [];
            for (let y = 0; y < _h; y += 40) {
                notePosition.push(
                    createVector(x + this.defaultNoteSize / 2, y + this.defaultNoteSize / 2)
                );
                noteState.push(0);
                noteSize.push(this.defaultNoteSize);
            }
            // create a new note instance
            let newNote = new Note(noteSize, notePosition, noteState);

            // push the new note to the notes array
            this.notes.push(newNote);
        }
    }
    /////////////////////////////////
    run(img) {
        img.loadPixels();
        this.findActiveNotes(img);
        this.drawActiveNotes(img);
    }
    /////////////////////////////////
    drawActiveNotes(img) {
        fill(255);
        noStroke();
        for (let i = 0; i < this.notes[i].position.length; i++) {
            for (let j = 0; j < this.notes[i].position.length; j++) {
                if (this.notes[i].state[j] > 0) {
                    // call the drawNote function on the current note instance
                    this.notes[i].selfDraw(i, j, this.notes.length);
                }
                // decrement the state to fade with time.
                this.notes[i].state[j] -= 0.05;
                // constrain the value of the state to be between 0 and 1.
                this.notes[i].state[j] = constrain(this.notes[i].state[j], 0, 1);
            }
        }
    }
    /////////////////////////////////
    findActiveNotes(img) {
        for (let x = 0; x < img.width; x += 1) {
            for (let y = 0; y < img.height; y += 1) {
                let index = (x + y * img.width) * 4;
                let state = img.pixels[index + 0];
                if (state == 0) {
                    // if pixel is black (ie there is movement)
                    // find which note to activate
                    let screenX = map(x, 0, img.width, 0, this.gridWidth);
                    let screenY = map(y, 0, img.height, 0, this.gridHeight);
                    let i = int(screenX / this.defaultNoteSize);
                    let j = int(screenY / this.defaultNoteSize);
                    // activate the note.
                    this.notes[i].state[j] = 1;
                }
            }
        }
    }
}
