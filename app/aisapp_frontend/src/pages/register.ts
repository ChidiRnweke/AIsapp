import { getElementOrThrow } from "../utils/utils.js";
import { Page, navigateTo } from "./utils.js";

export const registerPage: Page = {
    templateId: "register",
    onRender: () => {
        const mainRegister = getElementOrThrow<HTMLElement>(document, "#main-register");
        mainRegister.addEventListener('registrationSuccessful', () => navigateTo('setup', '/setup'));
    }
};