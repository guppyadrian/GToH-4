import { Block } from "./block";
import { SwapBlock } from "./blocks/swapBlock";

const blockMap: Record<string, new (a: number, b: number, c: number, d: number) => Block> = {
    block: Block,
    red: SwapBlock,
    blue: SwapBlock,
};

export function createBlock(x: number, y: number, type: string, w: number, h: number) {
    const ctor = blockMap[type];
    if (!ctor) {
        console.error("Trying to create nonexistant block type:", type);
        return new Block(x, y, w, h);
    }
    return new ctor(x, y, w, h);
}