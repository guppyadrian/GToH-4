export class Assets {
    static lib = new Map();

    static get(name) {
        if (!Assets.has(name)) {
            console.error("Error: could not find asset by name: ", name);
            return;
        }
        return Assets.lib.get(name);
    }

    static has(name) {
        return Assets.lib.has(name);
    }

    static load(filePath, name) {
        if (Assets.has(name)) return;

        const image = new Image();
        image.src = filePath;
        Assets.lib.set(name || filePath, image); 

        return new Promise((resolve, reject) => {
            image.onload = () => resolve();
        });
    }
}