import { Block } from "./blockModels/block";
import { BlueBlock } from "./blocks/blueBlock";
import { BounceBlock } from "./blocks/bounceBlock";
import { MetalBlock } from "./blocks/metalBlock";
import { NormalBlock } from "./blocks/normalBlock";
import { OrangeBlock } from "./blocks/orangeBlock";
import { PortalBlock } from "./blocks/portalBlock";
import { PurpleBlock } from "./blocks/purpleBlock";
import { RedBlock } from "./blocks/redBlock";
import { WinBlock } from "./blocks/winBlock";

// TODO: This is unused. Use it or lose it!
export interface BlockTags {
    inverted?: boolean; // for orange/purple & red/blue
    direction?: number; // TODO: Make this an enum? also side note enum for direction for player physics loop
}

const blockMap: Record<string, new (a: number, b: number, c: number, d: number, e?: any) => Block> = {
    block: NormalBlock,
    red: RedBlock,
    blue: BlueBlock,
    orange: OrangeBlock,
    purple: PurpleBlock,
    metal: MetalBlock,
    njump: MetalBlock,
    bounce: BounceBlock,
    portal: PortalBlock,
    win: WinBlock,
};
// TODO: dynamically import blocks


export function createBlock(x: number, y: number, type: string, w: number, h: number, tags?: any) {
    const ctor = blockMap[type];
    if (!ctor) {
        console.error("Trying to create nonexistant block type:", type);
        return new Block(x, y, w, h);
    }
    return new ctor(x, y, w, h, tags);
}