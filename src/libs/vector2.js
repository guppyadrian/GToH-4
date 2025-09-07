export class Vector2 {
    x;
    y;
    
    /**
     * Returns a zero vector
     */
    static get zero() {
        return new this(0, 0);
    }

    /**
     * Add's another vector to this vector
     * @param {Vector2} otherVec 
     */
    add(otherVec) {
        this.x += otherVec.x;
        this.y += otherVec.y;
    }

    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y; 
    }
}