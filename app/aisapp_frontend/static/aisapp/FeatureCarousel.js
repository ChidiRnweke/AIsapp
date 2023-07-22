class FeatureCarousel extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentSlide = 0;
    }

    connectedCallback() {
        this.render();

        this.shadowRoot.querySelector('slot').addEventListener('slotchange', () => {
            this.initCarousel();
        });
    }

    initCarousel() {
        this.slides = this.querySelectorAll('p');
        console.log(this.slides)
        for (let i = 0; i < this.slides.length; i++) {
            this.slides[i].style.display = 'none';
        }
        if (this.slides[this.currentSlide]) {
            this.slides[this.currentSlide].style.display = 'block';
        }

        this.shadowRoot.querySelector('.next').addEventListener('click', () => {
            this.slides[this.currentSlide].style.display = 'none';
            this.currentSlide = (this.currentSlide + 1) % this.slides.length;
            this.slides[this.currentSlide].style.display = 'block';
        });

        this.shadowRoot.querySelector('.prev').addEventListener('click', () => {
            this.slides[this.currentSlide].style.display = 'none';
            this.currentSlide = (this.currentSlide - 1 + this.slides.length) % this.slides.length;
            this.slides[this.currentSlide].style.display = 'block';
        });
    }

    render() {
        this.shadowRoot.innerHTML = `
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
