import { Vector2 } from "./vector2";

export class Camera {
    static x = 0;
    static y = 0;
    static z = 1;

    /**
     * @overload
     * @param {number} x
     * @param {number} y
     * @returns {Vector2}
     */

    /**
     * @overload
     * @param {Vector2} pos
     * @returns {Vector2}
     */

    /**
     * Converts an ingame position to a screen position
     * @param {number | Vector2} x 
     * @param {number} y 
     * @returns {Vector2}
     */
    static toScreen(pos, y) {
        if (y === undefined) {
            return new Vector2((pos.x - Camera.x) * Camera.z, (pos.y - Camera.y) * Camera.z);
        }
        const x = pos;
        return new Vector2((x - Camera.x) * Camera.z, (y - Camera.y) * Camera.z);
    }
}