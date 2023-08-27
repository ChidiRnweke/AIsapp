class AppCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback(): void {
        const reversed = this.hasAttribute('reversed');
        this.render(reversed);
    }

    render(reversed: boolean): void {
        this.shadowRoot!.innerHTML = `
        <style>
            @import url('static/aisapp/css/AppCard.css');
        </style>

            <article class="card ${reversed ? 'reverse' : ''}">
                <section class="text-content">
                    <slot name="title"></slot>
                    <slot name="text"></slot>
                </section>
                <img src="${this.getAttribute('img-src')}" alt="${this.getAttribute('img-alt')}">

            </article>
        `;
    }
}

customElements.define('app-card', AppCard);
