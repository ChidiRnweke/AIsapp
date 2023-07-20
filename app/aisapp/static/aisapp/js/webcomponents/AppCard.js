class AppCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        const reversed = this.hasAttribute('reversed');
        this.render(reversed);
    }

    render(reversed) {
        this.shadowRoot.innerHTML = `
        <style>
            @import url('static/aisapp/js/webcomponents/AppCard.css');
        </style>

            <article class="card ${reversed ? 'reverse' : ''}">
                <section class="text-content">
                <h2 class="card-title"><slot name="title"></slot></h2>
                    <slot name="text"></slot>
                </section>
                <img src="${this.getAttribute('img-src')}" alt="${this.getAttribute('img-alt')}">

            </article>
        `;
    }
}

customElements.define('app-card', AppCard);
