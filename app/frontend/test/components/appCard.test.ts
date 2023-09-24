/**
 * @vitest-environment jsdom
 */

import { describe, beforeEach, afterEach, it, expect } from 'vitest'
import { AppCard } from '../../src/components/appCard';

describe('AppCard Component', () => {
    let component: AppCard;

    beforeEach(() => {
        component = new AppCard();
        document.body.appendChild(component);
    });

    afterEach(() => {
        document.body.removeChild(component);
    });

    it('renders correctly', () => {
        expect(component.shadowRoot).not.toBeNull();
        expect(component.shadowRoot!.querySelector('article.card')).not.toBeNull();
        expect(component.shadowRoot!.querySelector('section.text-content')).not.toBeNull();
        expect(component.shadowRoot!.querySelector('img')).not.toBeNull();
    });

    it('updates image src and alt on attribute change', () => {
        component.setAttribute('img-src', 'test.jpg');
        component.setAttribute('img-alt', 'Test Image');

        const imgElem = component.shadowRoot!.querySelector('img')!;
        expect(imgElem.getAttribute('src')).toBe('test.jpg');
        expect(imgElem.getAttribute('alt')).toBe('Test Image');
    });

    it('updates class on reversed attribute change', () => {
        component.setAttribute('reversed', '');

        const articleElem = component.shadowRoot!.querySelector('article.card')!;
        expect(articleElem.className).toBe('card reverse');
    });
});
