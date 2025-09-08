import { Block } from "./block.js";
import { createBlock } from "./createBlock.js";

export class World {
    static data: Block[] = [];
    // This needs to have a chunk system
    // all the stuff in this needs to extend from area for collision check & draw methods

    static draw() {
        for (const block of World.data) {
            block.draw();
        }
    }

    static createWorld(levelCode: any) {
        console.log(levelCode)
        World.data = [];

        if (levelCode.format === 2 || levelCode.format === 1) {
            const data = levelCode.data;

            for (const block of data) {
                World.data.push(createBlock(...block as [number, number, string, number, number]));
            }
        }
    }
}