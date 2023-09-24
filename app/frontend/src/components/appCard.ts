import { getElementOrThrow } from "../utils/utils";
export class AppCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }

    private render(): void {
        this.shadowRoot!.innerHTML = `
        <style>
            @import url('static/css/AppCard.css');
        </style>

            <article class="card">
                <section class="text-content">
                    <slot name="title"></slot>
                    <slot name="text"></slot>
                </section>
                <img>

            </article>
        `;
    }

    static get observedAttributes() {
        return ["img-src", "img-alt", "reversed"];
    }

    attributeChangedCallback(name: string, _oldValue: string, newValue: string) {
        const imgElem = getElementOrThrow<HTMLImageElement>(this.shadowRoot!, 'img');
        const article = getElementOrThrow<HTMLElement>(this.shadowRoot!, 'article');

        switch (name) {
            case 'img-src':
                imgElem.setAttribute("src", newValue);
                break;

            case 'img-alt':
                imgElem.setAttribute("alt", newValue);
                break;

            case 'reversed':
                article.className = "card reverse";
                break;
        }
    }

}

customElements.define('app-card', AppCard);
