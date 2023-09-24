import { Page, homePage, registerPage, setupPage, loginPage, notFoundPage } from './pages/index.js'
import { getElementOrThrow } from "./utils/utils.js";

type routes = { [key: string]: Page };

const PageRoute: routes = {
    '/': homePage,
    '/register': registerPage,
    '/setup': setupPage,
    '/login': loginPage,
    '/not-found': notFoundPage,
};

const handleRouteChange = (newRoute: string, PageRoutes: routes): void => {
    const page = PageRoutes[newRoute] || PageRoutes['/not-found'];
    render(page);
};

const render = (page: Page) => {
    const body = getElementOrThrow<HTMLDivElement>(document, "body");
    const footer = getElementOrThrow(document, "footer");


    const template = getElementOrThrow<HTMLTemplateElement>(document, `#${page.templateId}`);
    const clone = document.importNode(template.content, true);

    body.innerHTML = '';
    body.appendChild(clone);
    body.appendChild(footer);

    page.onRender();
};

document.addEventListener('routeChanged', () => {
    const route = window.location.pathname;
    handleRouteChange(route, PageRoute);
});

document.addEventListener('DOMContentLoaded', function (): void {

    window.addEventListener('popstate', () => {
        const route = window.location.pathname;
        handleRouteChange(route, PageRoute)
    });

    const route = window.location.pathname;
    handleRouteChange(route, PageRoute);

});