import { getElementOrThrow } from "../utils/utils.js";
export class SequentialSlider extends HTMLElement {

    private slotsArray!: HTMLElement[];
    private currentSlotIndex: number;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentSlotIndex = 0;
        this.render();
    }

    connectedCallback(): void {
        this.initializeSlider();
        this.addEventListeners();
    }

    private initializeSlider() {
        this.slotsArray = Array.from(this.querySelectorAll('article'));
        this.updateState();
        this.slotsArray[0].classList.add('active');
    }

    private render(): void {
        this.shadowRoot!.innerHTML = /*html*/`
        <style>
            @import url('static/css/slider.css');
        </style>
        <slot></slot>
        <div class="navigation-buttons">
            <button id="previous">Previous</button>
            <button id="next">Next</button>
        </div>
      `;

    }

    private addEventListeners(): void {
        getElementOrThrow<HTMLButtonElement>(this.shadowRoot!, '#next').addEventListener('click', () => this.showNext());
        getElementOrThrow<HTMLButtonElement>(this.shadowRoot!, '#previous').addEventListener('click', () => this.showPrevious());

    }

    private showNext(): void {
        this.currentSlotIndex += 1;
        this.updateState();
    }

    private showPrevious(): void {
        this.currentSlotIndex -= 1;
        this.updateState();
    }

    private updateState(): void {

        this.slotsArray.forEach(slot => slot.classList.remove('active'));
        this.slotsArray[this.currentSlotIndex].classList.add('active');

        getElementOrThrow<HTMLButtonElement>(this.shadowRoot!, '#next').disabled = this.currentSlotIndex === this.slotsArray.length - 1;
        getElementOrThrow<HTMLButtonElement>(this.shadowRoot!, '#previous').disabled = this.currentSlotIndex === 0;
    }
}

customElements.define('sequential-slider', SequentialSlider);
