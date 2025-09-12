import { Block } from "./blockModels/block";
import { SwapBlock } from "./blockModels/swapBlock";
import { BlueBlock } from "./blocks/blueBlock";
import { RedBlock } from "./blocks/redBlock";

export interface BlockTags {
    inverted?: boolean; // for orange/purple & red/blue
    direction?: number; // TODO: Make this an enum? also side note enum for direction for player physics loop
}

const blockMap: Record<string, new (a: number, b: number, c: number, d: number, e: BlockTags) => Block> = {
    block: Block,
    red: RedBlock,
    blue: BlueBlock,
};

// TODO: dynamically import blocks

export function createBlock(x: number, y: number, type: string, w: number, h: number, tags: BlockTags) {
    const ctor = blockMap[type];
    if (!ctor) {
        console.error("Trying to create nonexistant block type:", type);
        return new Block(x, y, w, h);
    }
    return new ctor(x, y, w, h, tags);
}