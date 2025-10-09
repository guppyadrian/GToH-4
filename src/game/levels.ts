const modules = import.meta.glob('/src/levels/**/*.json5', { eager: true });

export const Levels = new Map<number, LevelData>();

export interface LevelData {
    format: number,
    type: string,
    about: LevelAbout,
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
    console.log(`LVL: ${lvlID}`);
    console.log(lvl);
    if (lvl === undefined) throw new Error("Could not get level with ID: " + lvlID);
    return lvl;
}