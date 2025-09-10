const modules = import.meta.glob('/src/levels/**/*.json', { eager: true });

export const Levels = new Map<number, LevelData>();

export interface LevelData {
    format: number,
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

console.log(Levels);