import JSON5 from 'json5';
const modules = import.meta.glob('/src/levels/**/*.json5', { eager: true });

export const Levels = new Map<number, LevelData>();

export interface LevelData {
    format: number,
    type?: string,
    about?: LevelAbout,
    data: any[],
    spawn?: number[],
    reward?: any,
    id: number,
};

interface LevelAbout {
    name: string,
    create: string,
    diff: string,
}


for (const path in modules) {
    const level = modules[path] as LevelData;
    Levels.set(level.id, level);
}

export function GetLevel(lvlID: number) {
    const lvl = Levels.get(lvlID);
    if (lvl === undefined) throw new Error("Failed loading level with ID: " + lvlID + ". Maybe it doesn't exist?");
    return lvl;
}

export function PromptPlayerLevel() {
    const p = prompt("Enter level data:");
    if (p === null || p === '') return false;
    const data = JSON5.parse(p);
    return data;
}