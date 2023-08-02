import { createUser, loginUser } from './api.js';
import { getElementOrThrow } from "./utils.js";

interface CustomFormInterface extends HTMLElement {
    errorMessageElem: HTMLElement;
    displayError(error: string): void;

}

interface FormGroupInterface extends HTMLElement {
    getValue(): string;

}

export interface FormHandler {
    ExtraValidation(): boolean;
    post(): void;
}


export class LoginHandler implements FormHandler {
    form: CustomFormInterface;
    constructor(form: CustomFormInterface) {
        this.form = form;
    }

    ExtraValidation(): boolean {
        return true;
    }

    async post(): Promise<void> {
        const username = getElementOrThrow<FormGroupInterface>(document, '#username').getValue();
        const password = getElementOrThrow<FormGroupInterface>(document, '#password').getValue();

        try {

            const response = await loginUser({ 'username': username, 'password': password });

            if (response.ok) {
                this.form.errorMessageElem.textContent = '';
                const loginEvent = new CustomEvent("loginSuccessful", { bubbles: true, composed: true })
                this.form.dispatchEvent(loginEvent);
            }

            else {
                const errors = await response.json();
                let allErrors = "";
                Object.keys(errors).forEach((key) => {
                    allErrors += errors[key] + "\n";
                });
                this.form.displayError(allErrors.trim());
            }
        }

        catch (error) {
            console.error("Error while registering:", error);
            this.form.displayError("There was a problem registering. Please try again later.");
        }
    };
}


export class RegistrationHandler implements FormHandler {
    form: CustomFormInterface;
    constructor(form: CustomFormInterface) {
        this.form = form;
    }

    ExtraValidation(): boolean {
        const passwordElem = getElementOrThrow<FormGroupInterface>(document, '#password');
        const password2Elem = getElementOrThrow<FormGroupInterface>(document, '#password2');
        return passwordElem.getValue() === password2Elem.getValue();
    }

    async post(): Promise<void> {
        const username = getElementOrThrow<FormGroupInterface>(document, '#username').getValue();
        const firstName = getElementOrThrow<FormGroupInterface>(document, '#first-name').getValue();
        const lastName = getElementOrThrow<FormGroupInterface>(document, '#last-name').getValue();
        const email = getElementOrThrow<FormGroupInterface>(document, '#email').getValue();
        const password = getElementOrThrow<FormGroupInterface>(document, '#password').getValue();

        try {

            const response = await createUser({
                "username": username,
                "first_name": firstName,
                "last_name": lastName,
                "email": email,
                "password": password,
            });

            if (response.ok) {
                this.form.errorMessageElem.textContent = '';
                const registrationSuccess = new CustomEvent("registrationSuccessful", { bubbles: true, composed: true })
                this.form.dispatchEvent(registrationSuccess);
            }

            else {
                const errors = await response.json();
                let allErrors = "";
                Object.keys(errors).forEach((key) => {
                    allErrors += errors[key] + "\n";
                });
                this.form.displayError(allErrors.trim());
            }

        }

        catch (error) {
            console.error("Error while registering:", error);
            this.form.displayError("There was a problem registering. Please try again later.");
        }
        ;
    }
}



