import { getElementOrThrow } from "../utils/utils.js";
import { Page, navigateTo } from "./utils.js";

export const notFoundPage: Page = {
    templateId: 'page-not-found',
    onRender: () => {
        const homeButton = getElementOrThrow<HTMLButtonElement>(document, "#back-home");
        homeButton.addEventListener('click', () => navigateTo('home', "/"));
    }
}
