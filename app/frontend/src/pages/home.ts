import { getElementOrThrow } from "../utils/utils.js";
import { Page, navigateTo } from "./utils.js";

export const homePage: Page = {
    templateId: "home",
    onRender: () => {
        const loginButton = getElementOrThrow<HTMLButtonElement>(document, '#login-button')!;
        const registerButton = getElementOrThrow<HTMLButtonElement>(document, '#register-button')!;

        loginButton.addEventListener('click', () => navigateTo('login', '/login'));

        registerButton.addEventListener('click', () => navigateTo('register', '/register'));
    }
}