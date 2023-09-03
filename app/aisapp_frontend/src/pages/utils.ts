export interface Page {
    templateId: string;
    onRender: () => void;
}

export const navigateTo = (pageKey: string, url: string): void => {
    history.pushState({ page: pageKey }, '', url);
    const event = new Event('routeChanged');
    document.dispatchEvent(event);
};