export const getElementOrThrow = <T extends Element>(source: Document | ShadowRoot, selector: string): T => {
    const element = source.querySelector<T>(selector);
    if (!element) {
        throw new Error(`Element with selector "${selector}" was not found in the light DOM.`);
    }
    return element;
}

export const getAttributeOrThrow = (source: Element, attributeName: string): string => {
    const attribute = source.getAttribute(attributeName);
    if (!attribute) {
        throw new Error(`attribute with selector "${attribute}" was not found!`);
    }
    return attribute;
}
