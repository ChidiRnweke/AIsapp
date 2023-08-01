class FeatureCarousel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
    }

    render() {
        this.shadowRoot!.innerHTML = `
            <style>
            @import AppCard.css
            </style>

            <slot></slot> <!-- Slot for paragraphs -->

            <button class="prev">❮</button>
            <button class="next">❯</button>
        `;
    }
}

window.customElements.define('feature-carousel', FeatureCarousel);
