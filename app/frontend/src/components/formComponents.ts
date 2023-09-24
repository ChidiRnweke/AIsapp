
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
    }

    connectedCallback() {
        const input = getElementOrThrow<HTMLInputElement>(this.shadowRoot!, 'input');

        this.internals.setValidity(input.validity, input.validationMessage, input);
        input.addEventListener('change', () => {
            this.internals.setFormValue(input.value);
            this.internals.setValidity(input.validity, input.validationMessage, input);
        });

        const toggleElem = getElementOrThrow<HTMLElement>(this.shadowRoot!, '.toggle-password');
        ['mousedown', 'touchstart'].map(event => toggleElem.addEventListener(event, this.showPassword.bind(this)));
        ['touchend', 'mouseup', 'mouseleave'].map(event => toggleElem.addEventListener(event, this.hidePassword.bind(this)));

    }

    private render() {
        this.shadowRoot!.innerHTML = /*html*/`
        <style>
            @import url('static/css/forms.css');
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

    private showPassword(e: Event): void {
        const inputId = (e.currentTarget as HTMLElement).getAttribute('data-input');
        const inputElem = getElementOrThrow<HTMLInputElement>(this.shadowRoot!, `#${inputId}`);
        inputElem.type = 'text';
    }

    private hidePassword(e: Event): void {
        const inputId = (e.currentTarget as HTMLElement).getAttribute('data-input');
        const inputElem = getElementOrThrow<HTMLInputElement>(this.shadowRoot!, `#${inputId}`);
        inputElem.type = 'password';
    }

    checkValidity(): boolean {
        return this.internals.checkValidity();
    }

    reportValidity(): boolean {
        return this.internals.reportValidity();
    }

    get validity(): ValidityState {
        return this.internals.validity;
    }

    get validationMessage(): string {
        return this.internals.validationMessage;
    }

    getInputValue(): string {
        return getElementOrThrow<HTMLInputElement>(this.shadowRoot!, 'input').value;
    }

    setInputValue(newVal: string): void {
        getElementOrThrow<HTMLInputElement>(this.shadowRoot!, 'input').value = newVal;
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

        targetElement.addEventListener('input', () => {
            const output = getElementOrThrow<HTMLOutputElement>(this.shadowRoot!, 'output')
            output.value = targetElement.getInputValue();
        })
        this.render(defaultValue);

    }

    private render(defaultValue: string): void {

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
    private internals: ElementInternals;
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();

        this.internals = this.attachInternals();
    }

    connectedCallback() {
        const input = getElementOrThrow<HTMLInputElement>(this.shadowRoot!, 'input');
        this.internals.setValidity(input.validity, input.validationMessage, input);

        input.addEventListener('change', () => {
            this.internals.setFormValue(input.value);
            this.internals.setValidity(input.validity, input.validationMessage, input);
        });
    }

    private render() {
        this.shadowRoot!.innerHTML = /*html*/`
        <style>
            @import url('static/css/forms.css');
        </style>
        <div class="form-group">
            <label></label>
            <input>
        </div>
        `
    }
    static get observedAttributes() {
        return ["name", "label", "type", "id", "min", "max", "value", "required"];
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
                input.type = newValue;
                break;

            case 'label':
                label.textContent = newValue;
                break;

            case 'required':
                input.toggleAttribute("required");
                break;

            default:
                input.setAttribute(name, newValue);
                break;
        }
    }

    checkValidity(): boolean {
        return this.internals.checkValidity();
    }

    reportValidity(): boolean {
        return this.internals.reportValidity();
    }

    get validity(): ValidityState {
        return this.internals.validity;
    }

    get validationMessage(): string {
        return this.internals.validationMessage;
    }

    getInputValue(): string {
        return getElementOrThrow<HTMLInputElement>(this.shadowRoot!, 'input').value
    }

    setInputValue(newVal: string): void {
        getElementOrThrow<HTMLInputElement>(this.shadowRoot!, 'input').value = newVal;
    }
}


class SubmitFormGroup extends HTMLElement {
    static formAssociated = true;
    private internals: ElementInternals;
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.internals = this.attachInternals();
        this.render();

    }

    connectedCallback() {
        const form = this.internals.form;

        if (!form) {
            throw new Error("No form is associated with this element.")
        }

        this.attachEventListeners(form);
    }

    private attachEventListeners(form: HTMLFormElement) {
        const button = getElementOrThrow<HTMLButtonElement>(this.shadowRoot!, "button");
        button.addEventListener("click", (e) => {
            e.preventDefault();
            form.requestSubmit();
        });
    }

    private render() {
        this.shadowRoot!.innerHTML = /*html*/`
        <style>
            @import url('static/css/forms.css');
        </style>
        <div class="form-group">
            <button type="submit"></button>
        </div>
        `
    }

    static get observedAttributes() {
        return ["label", "id"];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        const button = getElementOrThrow<HTMLButtonElement>(this.shadowRoot!, 'button');

        switch (name) {

            case 'id':
                button.id = newValue;
                break;

            case 'label':
                button.textContent = newValue;
                break;
        }
    }

}

class BaseForm extends HTMLElement {
    actionType!: string;
    errorMessageElem!: HTMLElement;
    formHandler!: FormHandler;
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
        this.errorMessageElem = getElementOrThrow<HTMLElement>(this.shadowRoot!, '#error-message');

    }

    connectedCallback(): void {
        this.formHandler = getFormHandler(this);
        this.attachEventListeners();

    }

    private render(): void {
        this.shadowRoot!.innerHTML = /*html*/`
            <style>
                @import url('static/css/forms.css');
            </style>
                <slot name="form">
                    <slot></slot>
                    <slot name=submit-group></slot>
                    <div id="error-message"></div>
                </slot>
        `;
    }

    static get observedAttributes() {
        return ["action-type"];
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        const form = getElementOrThrow<HTMLFormElement>(this.shadowRoot!, 'slot[name=form]');

        switch (name) {

            case 'action-type':
                this.actionType = newValue;
                form.id = `${newValue}-form`;
                break;
        }
    }

    displayError(message: string, duration: number | null = null): void {
        this.errorMessageElem.textContent = message;
        if (duration) {
            setTimeout(() => {
                this.errorMessageElem.textContent = '';
            }, duration);

        }
    }

    private attachEventListeners(): void {
        const form = getElementOrThrow<HTMLFormElement>(this.shadowRoot!, `#${this.actionType}-form`);
        form.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            console.log("submit");
            if (this.formHandler.ExtraValidation()) {
                this.formHandler.post()
            }
            else {
                this.displayError(this.formHandler.errorMessage);
            }

        })
    }

}



customElements.define('base-form', BaseForm);
customElements.define('password-form-group', PasswordFormGroup);
customElements.define('form-group', FormGroup);
customElements.define('submit-group', SubmitFormGroup)
customElements.define('output-card', OutputCard)