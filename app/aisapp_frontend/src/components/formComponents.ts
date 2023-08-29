
import { FormHandler, getFormHandler } from "../handlers/formHandlers.js";
import { getElementOrThrow, getAttributeOrThrow } from "../utils/utils.js";

class PasswordFormGroup extends HTMLElement {
    static formAssociated = true;
    internals: ElementInternals;
    constructor() {
        super()
        this.attachShadow({ mode: 'open' });
        this.render();

        this.internals = this.attachInternals();
        const input = getElementOrThrow<HTMLInputElement>(this.shadowRoot!, 'input');
        input.addEventListener('change', () => {
            this.internals.setFormValue(input.value);
        })

    }

    connectedCallback() {
        this.addEventListeners();
    }

    render() {
        this.shadowRoot!.innerHTML = /*html*/`
        <style>
            @import url('static/aisapp/css/forms.css');
        </style>
        <div class="form-group">
            <label></label>
            <input type="password" required>
            <span class="toggle-password">👁</span>
        </div>
        `;
    }

    static get observedAttributes() {
        return ["label", "name", "id"];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        const input = getElementOrThrow<HTMLInputElement>(this.shadowRoot!, 'input');
        const label = getElementOrThrow<HTMLLabelElement>(this.shadowRoot!, 'label');
        const togglePassword = getElementOrThrow<HTMLSpanElement>(this.shadowRoot!, 'span');

        switch (name) {

            case 'name':
                label.htmlFor = newValue;
                input.name = newValue;
                break;

            case 'id':
                input.id = newValue;
                togglePassword.setAttribute("data-input", newValue);
                break;

            case 'label':
                label.textContent = newValue;
                break;

        }
    }

    addEventListeners() {
        const toggleElem = getElementOrThrow<HTMLElement>(this.shadowRoot!, '.toggle-password');

        ['mousedown', 'touchstart'].map(event => toggleElem.addEventListener(event, this.showPassword.bind(this)));
        ['touchend', 'mouseup', 'mouseleave'].map(event => toggleElem.addEventListener(event, this.hidePassword.bind(this)));

    }

    showPassword(e: Event): void {
        const inputId = (e.currentTarget as HTMLElement).getAttribute('data-input');
        const inputElem = getElementOrThrow<HTMLInputElement>(this.shadowRoot!, `#${inputId}`);
        inputElem.type = 'text';

    }

    hidePassword(e: Event): void {
        const inputId = (e.currentTarget as HTMLElement).getAttribute('data-input');
        const inputElem = getElementOrThrow<HTMLInputElement>(this.shadowRoot!, `#${inputId}`);
        inputElem.type = 'password';
    }

    getValue(): string {
        return getElementOrThrow<HTMLInputElement>(this.shadowRoot!, 'input').value;
    }
}


class OutputCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback(): void {
        const targetId = getAttributeOrThrow(this, "target-id");
        const targetElement = getElementOrThrow<FormGroup>(document, `#${targetId}`);
        const targetInput = getElementOrThrow<HTMLInputElement>(targetElement.shadowRoot!, 'input');
        const defaultValue = targetInput.value

        targetInput.addEventListener('input', () => {
            const output = getElementOrThrow<HTMLOutputElement>(this.shadowRoot!, 'output')
            output.value = targetElement.getInputValue();
        })
        this.render(defaultValue);

    }

    render(defaultValue: string): void {

        this.shadowRoot!.innerHTML = /*html*/`
        <style>
            output {
                margin: 0;                
                padding: 0.5vw;
                border: 1px solid rgba(255, 255, 255, 0.5);
                background: rgba(255, 255, 255, 0.1);
                border-radius: 1vw;
            }
        </style>
    
            <output>${defaultValue}</output>
        `
    }
}

class FormGroup extends HTMLElement {
    static formAssociated = true;
    internals: ElementInternals;
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();

        this.internals = this.attachInternals();
        const input = getElementOrThrow<HTMLInputElement>(this.shadowRoot!, 'input');
        input.addEventListener('change', () => {
            this.internals.setFormValue(input.value);
        })


    }

    render() {
        this.shadowRoot!.innerHTML = /*html*/`
        <style>
            @import url('static/aisapp/css/forms.css');
        </style>
        <div class="form-group">
            <label></label>
            <input>
        </div>
        `
    }
    static get observedAttributes() {
        return ["name", "type", "id", "min", "max", "value", "required"];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        const input = getElementOrThrow<HTMLInputElement>(this.shadowRoot!, 'input');
        const label = getElementOrThrow<HTMLLabelElement>(this.shadowRoot!, 'label');

        switch (name) {

            case 'name':
                label.htmlFor = newValue;
                input.name = newValue;
                break;

            case 'id':
                input.id = newValue;
                break;

            case "type":
                input.type = "type";
                break;

            case 'label':
                label.textContent = newValue;
                break;

            default:
                input.setAttribute(name, newValue);
                break;

        }
    }

    getInputValue(): string {
        return getElementOrThrow<HTMLInputElement>(this.shadowRoot!, 'input').value
    }
}


class SubmitFormGroup extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }

    attachEventListeners() {
        const button = getElementOrThrow<HTMLButtonElement>(this.shadowRoot!, 'button[type="submit"]');
        button.addEventListener('click', this.handleSubmit.bind(this));

    }

    render() {
        const label = this.getAttribute('label') || ''
        const id = this.getAttribute('id') || ''

        this.shadowRoot!.innerHTML = /*html*/`
        <style>
            @import url('static/aisapp/css/forms.css');
        </style>
        <div class="form-group">
            <button type="submit" id = "${id}">${label}</button>
        </div>
        `
    }

    handleSubmit(e: Event): void {
        e.preventDefault();

        const baseForm = this.getBaseForm();
        const form = getElementOrThrow<HTMLFormElement>(baseForm.shadowRoot!, 'form');

        this.clearPreviousFeedback(baseForm);

        if (baseForm.checkValidity()) {
            form.dispatchEvent(new Event('submit'));
        } else {
            this.highlightInvalidFields(baseForm);
        }
    }

    getBaseForm(): BaseForm {
        const baseForm = this.closest<BaseForm>('base-form');
        if (!baseForm) {
            throw new Error("No base-form element available.");
        }
        return baseForm
    }

    clearPreviousFeedback(baseForm: BaseForm): void {
        const allInputs = this.getAllInputComponents(baseForm);
        allInputs.forEach(inputComponent => {
            this.removeErrorStyles(inputComponent);
        });
    }

    getAllInputComponents(baseForm: BaseForm): Element[] {
        return Array.from(baseForm.querySelectorAll('form-group, password-form-group'));
    }

    removeErrorStyles(inputComponent: Element): void {
        const innerInput = getElementOrThrow(inputComponent.shadowRoot!, 'input');
        innerInput.classList.remove('invalid-input');
        this.removeFeedbackMessage(inputComponent);

    }

    removeFeedbackMessage(inputComponent: Element): void {
        const feedback = inputComponent.shadowRoot!.querySelector('.invalid-feedback');
        if (feedback) {
            feedback.remove();
        }
    }

    highlightInvalidFields(baseForm: BaseForm): void {
        const allInputs = this.getAllInputComponents(baseForm);
        allInputs.forEach(inputComponent => {
            const innerInput = getElementOrThrow<HTMLInputElement>(inputComponent.shadowRoot!, 'input');
            if (!innerInput.checkValidity()) {
                innerInput.classList.add('invalid-input');
                this.addFeedbackMessage(inputComponent, innerInput.validationMessage);
            }
        });
    }

    addFeedbackMessage(inputComponent: Element, message: string): void {
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('invalid-feedback');
        errorMessage.textContent = message;
        inputComponent.shadowRoot!.appendChild(errorMessage);
    }
}

class BaseForm extends HTMLElement {
    actionType: string;
    errorMessageElem!: HTMLElement;
    formHandler!: FormHandler;
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.actionType = getAttributeOrThrow(this, "action-type");
    }

    connectedCallback(): void {
        this.render();
        this.errorMessageElem = getElementOrThrow<HTMLElement>(this.shadowRoot!, '#error-message');
        this.formHandler = getFormHandler(this);
        this.attachEventListeners();

    }

    render(): void {
        this.shadowRoot!.innerHTML = /*html*/`
            <style>
                @import url('static/aisapp/css/forms.css');
            </style>
                <form id="${this.actionType}-form">
                    <slot></slot>
                    <slot name=submit-group></slot>
                    <div id="error-message"></div>
                </form>
        `;
    }

    displayError(message: string, duration: number | null = null): void {
        this.errorMessageElem.textContent = message;
        if (duration) {
            setTimeout(() => {
                this.errorMessageElem.textContent = '';
            }, duration);

        }
    }

    attachEventListeners(): void {
        const form = getElementOrThrow<HTMLFormElement>(this.shadowRoot!, `#${this.actionType}-form`);
        form.addEventListener('submit', async (e: Event) => {
            e.preventDefault();

            if (this.formHandler.ExtraValidation()) {
                console.log(this.formHandler.ExtraValidation())
                this.formHandler.post()
            }
            else {
                this.displayError("The passwords did not match.");

            }
        })
    }

    checkValidity(): boolean {
        const allInputs = Array.from(this.querySelectorAll('form-group, password-form-group'));
        const allValid = allInputs.every(input => {
            const innerInput = getElementOrThrow<HTMLInputElement>(input.shadowRoot!, 'input');
            return innerInput && innerInput.checkValidity();
        });
        return allValid
    }

}



customElements.define('base-form', BaseForm);
customElements.define('password-form-group', PasswordFormGroup);
customElements.define('form-group', FormGroup);
customElements.define('submit-group', SubmitFormGroup)
customElements.define('output-card', OutputCard)