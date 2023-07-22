document.addEventListener('DOMContentLoaded', function () {

    window.addEventListener('popstate', handleRouteChange);
    handleRouteChange();

});

const handleRouteChange = () => {
    const route = window.location.pathname;
    console.log(route);
    switch (route) {
        case '/':
        case '':
            renderHomePage();
            break;
        case '/login':
            renderLoginPage();
            break;
        default:
            render404Page();
            break;
    }
}

const renderHomePage = () => {
    loadView("home");
    const loginButton = document.querySelector('header button');
    loginButton.addEventListener('click', () => {
        history.pushState({ page: "login" }, null, "/login");
        handleRouteChange();
    });

}

const renderLoginPage = () => {
    loadView("login");
}

const render404Page = () => {
    loadView('404');
    const loginButton = document.getElementById('back-home');
    loginButton.addEventListener('click', () => {
        history.pushState({ page: "home" }, null, "/");
        handleRouteChange();
    });
}

const loadView = (templateId) => {
    const mainContent = document.getElementById('main-content');
    const template = document.getElementById(templateId);
    const clone = document.importNode(template.content, true);

    mainContent.innerHTML = '';
    mainContent.appendChild(clone);
}