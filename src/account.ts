import { Input } from "guppy-lib";
import { Multiplayer } from "./multiplayer";

// i guess this isn't a static class

export let inLoginScreen = false;
export let requestedUsername = "ERR";
let isRegistering = false; // if registering or logging in
export let requestedPassword = "";

const loginStatusElement = document.getElementById('login-status')!;
const loginButton = document.getElementById('login-button')!;
const swapModeButton = document.getElementById('swap-mode')!;
const registerDiv = document.getElementById('register-div')!;

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

export function attemptAutoLogin(username: string, password: string) {
    requestedPassword = password;
    requestedUsername = username;
    Multiplayer.attemptLogin(username, password, false);
}

export function attemptLogin() {
    const username = (document.getElementById('username-input') as HTMLInputElement).value;
    const password = (document.getElementById('password-input') as HTMLInputElement).value;
    const confirmPassword = (document.getElementById('password-confirm-input') as HTMLInputElement).value;

    requestedUsername = username;
    requestedPassword = password;

    if (!Multiplayer.connected) {
        setLoginStatus("Not connected to server! Can't log in!");
        return;
    }

    if (!username || !password) {
        setLoginStatus("Username and password cannot be blank.");
        return;
    }

    if (isRegistering) {
        if (password !== confirmPassword) {
            setLoginStatus("Password does not match!");
            return;
        }

        Multiplayer.attemptLogin(username, password, true);
        return;
    }

    Multiplayer.attemptLogin(username, password);
}



document.getElementById('back-button')!.onclick = hideLoginScreen;
loginButton.onclick = attemptLogin;
swapModeButton.onclick = () => {
    isRegistering = !isRegistering
    if (isRegistering) {
        loginButton.textContent = "Register";
        swapModeButton.textContent = "Swap to Login";
        registerDiv.hidden = false;
    } else {
        loginButton.textContent = "Login";
        swapModeButton.textContent = "Swap to Register";
        registerDiv.hidden = true;
    }
};