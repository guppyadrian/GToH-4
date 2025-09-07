import { Keyboard } from "./keyboard";

export class Input {
    static initialized = false;
    static keyBinds = new Map();

    static initialize() {
        Keyboard.initialize();

        if (Input.initialized) return;
        Input.initialized = true;
    }

    static addBind(name, keys) {
        this.keyBinds.set(name, keys);
    }

    static get(name) {
        const inputs = Input.keyBinds.get(name); // array of keycodes
        for (const key in inputs) {
            if (Keyboard.isDown(inputs[key])) {
                return true;
            }
        }
        return false;
    }
}