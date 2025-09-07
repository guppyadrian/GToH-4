/**
 * Static class used to handle loading and retrieving assets.
 */
export class Assets {
    static lib = new Map();

    /**
     * Gets an asset by a name
     * @param {string} name name of asset
     * @returns {Image | undefined}
     */
    static get(name) {
        if (!Assets.has(name)) {
            console.error("Error: could not find asset by name: ", name);
            return;
        }
        return Assets.lib.get(name);
    }

    /**
     * Returns whether asset is loaded
     * @param {string} name name of asset
     * @returns {boolean}
     */
    static has(name) {
        return Assets.lib.has(name);
    }

    /**
     * Loads an asset
     * @param {string} filePath path to asset
     * @param {string} name name of asset
     * @returns {Promise} 
     */
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