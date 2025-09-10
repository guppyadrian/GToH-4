import { Block } from "./block.js";
import { createBlock } from "./createBlock.js";
import type { LevelData } from "./levels.js";

export class World {
    static data: Block[] = [];
    // This needs to have a chunk system
    // all the stuff in this needs to extend from area for collision check & draw methods

    static draw() {
        for (const block of World.data) {
            block.draw();
        }
    }

    static createWorld(levelData: LevelData) {
        console.log(levelData)
        World.data = [];

        if (levelData.format === 2 || levelData.format === 1) {
            const data = levelData.data;

            for (const block of data) {
                World.data.push(createBlock(...block as [number, number, string, number, number]));
            }
        }
    }
}