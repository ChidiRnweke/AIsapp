import { getElementOrThrow, getAttributeOrThrow } from "../utils/utils.js";
import { getSlideHandler, SlideHandler } from "../handlers/slideHandlers.js"
class SequentialSlider extends HTMLElement {

    slotsArray!: HTMLElement[];
    currentSlotIndex: number;
    validatorType: string;
    validator!: SlideHandler;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentSlotIndex = 0;
        this.validatorType = getAttributeOrThrow(this, 'data-validator');

    }

    connectedCallback(): void {
        this.validator = getSlideHandler(this);
        this.render();
        this.initializeSlider();
        this.addEventListeners();
    }

    private initializeSlider() {
        this.slotsArray = Array.from(this.querySelectorAll('article'));
        this.updateState();
        this.slotsArray[0].classList.add('active');
    }

    render(): void {
        this.shadowRoot!.innerHTML = /*html*/`
        <style>
            @import url('static/aisapp/css/slider.css');
        </style>
        <slot></slot>
        <div class="navigation-buttons">
            <button id="previous">Previous</button>
            <button id="next">Next</button>
        </div>
      `;

    }

    addEventListeners(): void {
        getElementOrThrow<HTMLButtonElement>(this.shadowRoot!, '#next').addEventListener('click', () => this.showNext());
        getElementOrThrow<HTMLButtonElement>(this.shadowRoot!, '#previous').addEventListener('click', () => this.showPrevious());

    }

    showNext(): void {
        if (this.validator && !this.validator.validate()) {
            return;
        }
        this.currentSlotIndex += 1;
        this.updateState();
    }

    showPrevious(): void {
        this.currentSlotIndex -= 1;
        this.updateState();
    }

    updateState(): void {

        this.slotsArray.forEach(slot => slot.classList.remove('active'));
        this.slotsArray[this.currentSlotIndex].classList.add('active');

        getElementOrThrow<HTMLButtonElement>(this.shadowRoot!, '#next').disabled = this.currentSlotIndex === this.slotsArray.length - 1;
        getElementOrThrow<HTMLButtonElement>(this.shadowRoot!, '#previous').disabled = this.currentSlotIndex === 0;
    }
}

customElements.define('sequential-slider', SequentialSlider);
