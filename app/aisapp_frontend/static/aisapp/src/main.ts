document.addEventListener('DOMContentLoaded', function (): void {

    window.addEventListener('popstate', handleRouteChange);
    handleRouteChange();

});

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
    loadView('404');
    document.addEventListener('click', () => {
        history.pushState({ page: "home" }, '', "/");
        handleRouteChange();
    });
}

const loadView = (templateId: string) => {
    const mainContent = document.getElementById('main-content')!;
    const template = (document.getElementById(templateId) as HTMLTemplateElement);
    const clone = document.importNode(template.content, true);

    mainContent.innerHTML = '';
    mainContent.appendChild(clone);
}