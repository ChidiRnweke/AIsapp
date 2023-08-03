interface SlideValidator {
    validate(): boolean
};

class FormSlideValidator implements SlideValidator {
    private slider: SequentialSlider;

    constructor(slider: SequentialSlider) {
        this.slider = slider;
    }

    validate(): boolean {
        const activeSlot = this.slider.slotsArray[this.slider.currentSlotIndex];
        const form = activeSlot.querySelector('form');
        return form ? form.checkValidity() : false;
    }
}

class SequentialSlider extends HTMLElement {

    slotsArray!: HTMLElement[];
    currentSlotIndex: number;
    validator: SlideValidator | undefined;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.currentSlotIndex = 0;

    }

    setValidator(validator: SlideValidator) {
        this.validator = validator;
    }

    connectedCallback(): void {
        const validatorType = this.getAttribute('data-validator');
        if (validatorType === 'form') {
            this.setValidator(new FormSlideValidator(this));
        }
        this.slotsArray = Array.from(this.querySelectorAll('article'));
        console.log(this.slotsArray)
        this.render();
        this.updateState();
        this.slotsArray[0].classList.add('active');
        this.addEventListeners();
    }

    render(): void {
        this.shadowRoot!.innerHTML = `
        <style>
            ::slotted(article) {
                display: none;
            }
            
            /* This makes the active article visible */
            ::slotted(.active) {
                display: block;
            }
        </style>
            <slot></slot>
            <button id="previous">Previous</button>
            <button id="next">Next</button>
      `;

    }

    addEventListeners(): void {
        this.getElementOrThrow<HTMLButtonElement>('#next').addEventListener('click', () => this.showNext());
        this.getElementOrThrow<HTMLButtonElement>('#previous').addEventListener('click', () => this.showPrevious());

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

        this.getElementOrThrow<HTMLButtonElement>('#next').disabled = this.currentSlotIndex === this.slotsArray.length - 1;
        this.getElementOrThrow<HTMLButtonElement>('#previous').disabled = this.currentSlotIndex === 0;
    }

    protected getElementOrThrow<T extends Element>(selector: string): T {
        const element = this.shadowRoot!.querySelector<T>(selector);
        if (!element) {
            throw new Error(`Element with selector "${selector}" was not found!`);
        }
        return element;
    }
}

customElements.define('sequential-slider', SequentialSlider);
