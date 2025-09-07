export class Vector2 {
    x;
    y;
    
    static get zero() {
        return new this();
    }

    add(otherVec) {
        this.x += otherVec.x;
        this.y += otherVec.y;
    }

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y; 
    }
}