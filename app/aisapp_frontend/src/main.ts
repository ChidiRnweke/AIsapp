import { getElementOrThrow } from "./utils/utils.js";

const handleRouteChange = (): void => {
    const route = window.location.pathname;

    switch (route) {
        case '/':
        case '':
            renderHomePage();
            break;
        case '/register':
            renderRegisterPage();
            break;
        case '/login':
            renderLoginPage();
            break;
        case '/setup':
            renderSetupPage();
            break;
        default:
            render404Page();
            break;
    }
}

const loadView = (templateId: string) => {
    const mainContent = getElementOrThrow<HTMLDivElement>(document, '#main-content')!;
    const template = getElementOrThrow<HTMLTemplateElement>(document, `#${templateId}`);
    const clone = document.importNode(template.content, true);

    mainContent.innerHTML = '';
    mainContent.appendChild(clone);
}

const renderHomePage = (): void => {
    loadView("home");

    const loginButton = document.querySelector('#login-button')!;
    const registerButton = document.querySelector('#register-button')!;

    loginButton.addEventListener('click', () => {
        history.pushState({ page: "login" }, '', "/login");
        handleRouteChange();
    });

    registerButton.addEventListener('click', () => {
        history.pushState({ page: "register" }, '', "/register");
        handleRouteChange();
    });
}

const renderRegisterPage = (): void => {
    loadView("register");
    document.addEventListener('registrationSuccessful', () => {
        history.pushState({ page: "setup" }, '', "/setup");
        handleRouteChange();
    })
}

const renderLoginPage = (): void => {
    loadView("login");
    document.addEventListener('loginSuccessful', () => {
        history.pushState({ page: "setup" }, '', "/setup");
        handleRouteChange();
    })
}

const renderSetupPage = (): void => {
    loadView("setup");
}

const render404Page = (): void => {
    loadView('page-not-found');

    const homeButton = getElementOrThrow(document, "#back-home");
    homeButton.addEventListener('click', () => {
        history.pushState({ page: "home" }, '', "/");
        handleRouteChange();
    });
}

document.addEventListener('DOMContentLoaded', function (): void {

    window.addEventListener('popstate', handleRouteChange);
    handleRouteChange();

});