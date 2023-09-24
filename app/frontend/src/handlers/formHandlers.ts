import { createUser, loginUser } from '../utils/api.js';
import { getElementOrThrow } from "../utils/utils.js";

interface CustomFormInterface extends HTMLElement {
    actionType: string;
    displayError(error: string): void;

}

export interface FormGroupInterface extends HTMLElement {
    getInputValue(): string;
    setInputValue(newValue: string): void;

}

export interface FormHandler {
    ExtraValidation(): boolean;
    post(): void;
    errorMessage: string;
}


export class LoginHandler implements FormHandler {
    private form: CustomFormInterface;
    errorMessage: string;

    constructor(form: CustomFormInterface) {
        this.form = form;
        this.errorMessage = "";
    }

    ExtraValidation(): boolean {
        return true;
    }

    async post(): Promise<void> {
        const username = getElementOrThrow<FormGroupInterface>(document, '#username').getInputValue();
        const password = getElementOrThrow<FormGroupInterface>(document, '#password').getInputValue();

        try {
            const response = await loginUser({ 'username': username, 'password': password });

            if (response.ok) {
                this.form.displayError('');
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
    errorMessage: string;
    private form: CustomFormInterface;

    constructor(form: CustomFormInterface) {
        this.form = form;
        this.errorMessage = "The passwords did not match";
    }

    ExtraValidation(): boolean {
        const passwordElem = getElementOrThrow<FormGroupInterface>(document, '#password');
        const password2Elem = getElementOrThrow<FormGroupInterface>(document, '#password2');
        return passwordElem.getInputValue() === password2Elem.getInputValue();
    }

    async post(): Promise<void> {
        const username = getElementOrThrow<FormGroupInterface>(document, '#username').getInputValue();
        const firstName = getElementOrThrow<FormGroupInterface>(document, '#first-name').getInputValue();
        const lastName = getElementOrThrow<FormGroupInterface>(document, '#last-name').getInputValue();
        const email = getElementOrThrow<FormGroupInterface>(document, '#email').getInputValue();
        const password = getElementOrThrow<FormGroupInterface>(document, '#password').getInputValue();

        try {
            const response = await createUser({
                "username": username,
                "first_name": firstName,
                "last_name": lastName,
                "email": email,
                "password": password,
            });

            if (response.ok) {
                this.form.displayError('');
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

export const getFormHandler = (baseForm: CustomFormInterface): FormHandler => {
    switch (baseForm.actionType) {
        case 'login':
            return new LoginHandler(baseForm);
        case 'register':
            return new RegistrationHandler(baseForm);
        case undefined:
            throw new Error('No actionType was added to the form group.');
        default:
            throw new Error(`There is no handler available for actionType = ${baseForm.actionType}`)
    }
}