import { getElementOrThrow } from "../utils/utils.js";
import { Page, navigateTo } from "./utils.js";

export const loginPage: Page = {
    templateId: "login",
    onRender: () => {
        const mainLogin = getElementOrThrow<HTMLElement>(document, "#main-login");
        mainLogin.addEventListener('registrationSuccessful', () => navigateTo('setup', '/setup'));
    }
}