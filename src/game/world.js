import { Block } from "./block";

export class World {
    static data = [];
    // This needs to have a chunk system
    // all the stuff in this needs to extend from area for collision check & draw methods

    static draw() {
        for (const block of World.data) {
            block.draw();
        }
    }

    static createWorld(levelCode) {
        console.log(levelCode)
        World.data = [];

        if (levelCode.format === 2 || levelCode.format === 1) {
            const data = levelCode.data;

            for (const block of data) {
                World.data.push(new Block(...block));
            }
        }
    }
}