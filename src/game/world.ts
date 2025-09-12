import { Area, Vector2 } from "guppy-lib";
import { Block } from "./blockModels/block.js";
import { createBlock } from "./createBlock.js";
import type { LevelData } from "./levels.js";
import { NormalBlock } from "./blocks/normalBlock.js";

const ChunkSize = 4 * 30;

export class World {
    static data: Block[] = []
    static chunks = new Map<string, Block[]>();
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

    static getCornerChunks(area: Area) {
        return [
            new Vector2(Math.floor(area.x / ChunkSize), Math.floor(area.y / ChunkSize)),
            new Vector2(Math.floor(area.width / ChunkSize), Math.floor(area.height / ChunkSize)),
        ];
    }

    static getChunksInArea(area: Area) {
        // get top left chunk pos & bottom right
        const [topLeftChunk, bottomRightChunk] = this.getCornerChunks(area);


        // return an array of all chunks in this area
        const chunkList: string[] = [];
        for (let x = topLeftChunk.x; x <= bottomRightChunk.x; x++) {
            for (let y = topLeftChunk.y; y <= bottomRightChunk.y; y++) {
                chunkList.push(x + ',' + y);
            }
        }
        return chunkList;
    }

    static getChunkPos(pos: Vector2) {
        return new Vector2(
            Math.floor(pos.x / ChunkSize),
            Math.floor(pos.y / ChunkSize),
        );
    }
    
    static getChunkString(pos: Vector2) {
        const chunkPos = this.getChunkPos(pos);
        return chunkPos.x + "," + chunkPos.y;
    }

    static createWorld(levelData: LevelData) {
        World.data = [];

        if (levelData.format === 2 || levelData.format === 1) {
            const data = levelData.data;

            for (const block of data) {
                // TODO: make this work with chunks
                World.data.push(createBlock(...block as [number, number, string, number, number]));
            }
        }
    }

    static splitBlock(block: Block): Map<string, Block> {
        const blocks = new Map<string, Block>();

        // split block into a map? or dictionary?
        const chunks = this.getChunksInArea(block);

        if (chunks.length === 1) {
            return blocks.set(chunks[0], block);
        }

        const [topLeftChunk, bottomRightChunk] = this.getCornerChunks(block);

        // make block from top left to chunk borders
        // so to get block width,   Math.ceil((chunkSize - (pos.x % chunkSize)) / block.size.x)

        // loop for every difference in x
        // loop for every difference in y
            // in loop
            // make block from
        for (let x = topLeftChunk.x; x <= bottomRightChunk.x; x++) {
            for (let y = topLeftChunk.y; y <= bottomRightChunk.y; y++) {
                const blockX = Math.max(block.x, x * ChunkSize);
                const blockY = Math.max(block.y, y * ChunkSize);

                const blockW = (x === bottomRightChunk.x) ? Math.ceil((block.x + block.width) % ChunkSize / block.size.x) : Math.ceil((ChunkSize - blockX % ChunkSize) / block.size.x);
                const blockH = (y === bottomRightChunk.y) ? Math.ceil((block.y + block.height) % ChunkSize / block.size.y) : Math.ceil((ChunkSize - blockY % ChunkSize) / block.size.y); // don't ask me how this code works, but I think It does
                    // SEOMTHING DOESN'T WORK HERwe
                const cutBlock = createBlock(
                    blockX,
                    blockY,
                    block.type,
                    blockW,
                    blockH,
                );
                const stringPos = x + ',' + y;
                blocks.set(stringPos, cutBlock);
            }
        }

        return blocks;
    }
}

//console.log(World.getChunksInArea(new Area(0, -5, 5*30, 40)));

console.log(World.splitBlock(createBlock(0, 0, 'block', 5, 1)));