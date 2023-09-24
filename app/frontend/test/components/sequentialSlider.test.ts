/**
 * @vitest-environment jsdom
 */

import { describe, beforeEach, afterEach, it, expect } from 'vitest'
import { SequentialSlider } from '../../src/components/sequentialSlider';
import { getElementOrThrow } from '../../src/utils/utils';


function createArticleWithParagraph(text: string): HTMLElement {
    let article = document.createElement('article');
    let para = document.createElement('p');
    para.innerHTML = text;
    article.appendChild(para)
    return article;
}

function buttonIsDisabled(component: SequentialSlider, button: string) {
    return getElementOrThrow<HTMLButtonElement>(component.shadowRoot!, button).disabled
}

function isActive(article: HTMLElement): Boolean {
    return article.classList.contains('active')

}

describe('SequentialSlider Component', () => {
    let component: SequentialSlider;
    let article1: HTMLElement;
    let article2: HTMLElement;

    beforeEach(() => {
        component = new SequentialSlider();
        article1 = createArticleWithParagraph("para1");
        article2 = createArticleWithParagraph("para2");
        component.appendChild(article1);
        component.appendChild(article2);
        document.body.appendChild(component);
    })

    afterEach(() => {
        document.body.removeChild(component);
    });

    it('initializes with the first article active', () => {
        expect(isActive(article1)).toBeTruthy();
        expect(isActive(article2)).toBeFalsy();
    });

    it('initializes with the first first button active and the second disabled', () => {
        expect(buttonIsDisabled(component, "#previous")).toBeTruthy();
        expect(buttonIsDisabled(component, "#next")).toBeFalsy();

    });

    it('navigates to next article correctly', () => {
        getElementOrThrow<HTMLButtonElement>(component.shadowRoot!, '#next').click();

        expect(isActive(article2)).toBeTruthy();
        expect(isActive(article1)).toBeFalsy();

    });

    it('deactivates the buttons correctly at the next page', () => {
        getElementOrThrow<HTMLButtonElement>(component.shadowRoot!, '#next').click();

        expect(buttonIsDisabled(component, "#previous")).toBeFalsy();
        expect(buttonIsDisabled(component, "#next")).toBeTruthy();
    });

})


