import { Input } from "guppy-lib";
import { Multiplayer } from "./multiplayer";

// i guess this isn't a static class

export let inLoginScreen = false;
export let requestedUsername = "ERR";

const loginStatusElement = document.getElementById('login-status')!;
export function setLoginStatus(text: string) {
    loginStatusElement.textContent = text;
}

export function showLoginScreen() {
    document.getElementById('game-div')!.hidden = true;
    document.getElementById('login-div')!.hidden = false;
    inLoginScreen = true;
}

export function hideLoginScreen() {
    document.getElementById('game-div')!.hidden = false;
    document.getElementById('login-div')!.hidden = true;
    inLoginScreen = false;
    Input.reset();
}

export function attemptLogin() {
    const username = (document.getElementById('username-input') as HTMLInputElement).value;
    const password = (document.getElementById('password-input') as HTMLInputElement).value;

    requestedUsername = username;

    if (!username || !password)
    {
        setLoginStatus("Username and password cannot be blank.");
        return;
    }

    if (!Multiplayer.connected) {
        setLoginStatus("Not connected to server! Can't log in!");
        return;
    }

    Multiplayer.attemptLogin(username, password);
}

document.getElementById('back-button')!.onclick = hideLoginScreen;
document.getElementById('login-button')!.onclick = attemptLogin;