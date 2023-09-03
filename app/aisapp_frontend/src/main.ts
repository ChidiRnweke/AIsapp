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

    if (PageRoutes[newRoute]) {
        render(PageRoutes[newRoute]);
    } else {
        render(PageRoutes['/not-found']);
    }
};

const render = (page: Page) => {
    const mainContent = getElementOrThrow<HTMLDivElement>(document, '#main-content');
    const template = getElementOrThrow<HTMLTemplateElement>(document, `#${page.templateId}`);
    const clone = document.importNode(template.content, true);

    mainContent.innerHTML = '';
    mainContent.appendChild(clone);

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