import { Area, Vector2 } from "guppy-lib";
import { Block } from "./blockModels/block.js";
import { createBlock } from "./createBlock.js";
import type { LevelData } from "./levels.js";

const ChunkSize = 4 * 30;

export class World {
    static data: Block[] = []
    //static data = new Map<string, Block[]>();
    // This needs to have a chunk system
    // all the stuff in this needs to extend from area for collision check & draw methods

    static draw() {
        for (const block of World.data) {
            block.draw();
        }
    }

    // static drawCHUNKS() {
    //     for (const [_key, blocks] of World.data) {
    //         for (const block of blocks) {
    //             block.draw();
    //         }
    //     }
    // }

    /**
     * Gets all chunks the area is located in, then returns an array of all blocks in those chunks
     * @param area the area to check for colliding chunks
     * @returns {Block[]}
     */
    static getBlocksAtChunk(_area: Area) {
        return World.data;
    }

    static getChunksInArea(area: Area) {
        // get top left chunk pos & bottom right
        const topLeftChunk = new Vector2(Math.floor(area.x / ChunkSize), Math.floor(area.y / ChunkSize));
        const bottomRightChunk = new Vector2(Math.floor(area.width / ChunkSize), Math.floor(area.height / ChunkSize));


        // return an array of all chunks in this area
        const chunkList: string[] = [];
        for (let x = topLeftChunk.x; x <= bottomRightChunk.x; x++) {
            for (let y = topLeftChunk.y; y <= bottomRightChunk.y; y++) {
                chunkList.push(x + ',' + y);
            }
        }
        return chunkList;
        

    }

    static createWorld(levelData: LevelData) {
        console.log(levelData)
        World.data = [];

        if (levelData.format === 2 || levelData.format === 1) {
            const data = levelData.data;

            for (const block of data) {
                // TODO: make this work with chunks
                World.data.push(createBlock(...block as [number, number, string, number, number]));
                //World.data.
            }
        }
    }
}

//console.log(World.getChunksInArea(new Area(0, -5, 5*30, 40)));