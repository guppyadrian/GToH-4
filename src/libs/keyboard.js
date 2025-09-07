export class Keyboard {
    static keys = new Map();
    static initialized = false;

    static initialize() {
        if (Keyboard.initialized) return;
        Keyboard.initialized = true;

        window.addEventListener("keydown", e => {
            Keyboard.handleKey(e, true);
        });
        window.addEventListener("keyup", e => {
            Keyboard.handleKey(e, false);
        });
    }

    static handleKey(event, isDown) {
        Keyboard.keys.set(event.code, isDown);
    }

    static isDown(key) {
        return Keyboard.keys.get(key) || false;
    }

    static isUp(key) {
        return !Keyboard.keys.get(key);
    }
}