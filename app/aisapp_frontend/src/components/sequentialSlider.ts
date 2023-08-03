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
        this.shadowRoot!.innerHTML = `
        <style>
            ::slotted(article) {
                display: none;
            }
            
            ::slotted(.active) {
                display: block;
            }

            #previous, #next {
                padding: 10px 20px;
                color: #fff;
                background-color: rgba(69, 178, 233, 0.8);
                border: 1px solid rgba(255, 255, 255, 0.5);
                border-radius: 10%;
                cursor: pointer;
                font-size: 1em;
                transition: background-color 0.3s ease, transform 0.3s;
                margin: 1vw 1.25vw;
            }

            #previous:hover, #next:hover {
                background-color: rgba(69, 178, 233, 1);
                transform: scale(1.02);
            }

            #previous:disabled, #next:disabled {
                background-color: rgba(0, 0, 0, 0.4);
                cursor: not-allowed;
            }

            .navigation-buttons {
                display: flex;
                margin-top: 2vw;
                justify-content: right;
            }
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
