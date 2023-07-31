import { createUser, loginUser } from './api.js';

class BasePasswordForm extends HTMLElement {
    displayError(message, duration = null) {
        this.errorMessageElem.textContent = message;
        if (duration) {
            setTimeout(() => {
                this.errorMessageElem.textContent = '';
            }, duration);
        }
    }

    showPassword(e) {
        const inputId = e.currentTarget.getAttribute('data-input');
        const inputElem = this.shadowRoot.querySelector(`#${inputId}`);

        inputElem.type = "text";
    }

    hidePassword(e) {
        const inputId = e.currentTarget.getAttribute('data-input');
        const inputElem = this.shadowRoot.querySelector(`#${inputId}`);

        inputElem.type = "password";
    }

}

const PasswordToggleMixin = (Base) => class extends Base {
    addTogglePassword(toggleElems) {
        toggleElems.forEach(toggle => {
            toggle.addEventListener('mousedown', (e) => {
                this.showPassword(e);
            });

            toggle.addEventListener('mouseup', (e) => {
                this.hidePassword(e);
            });

            toggle.addEventListener('mouseleave', (e) => {
                this.hidePassword(e);
            });

            toggle.addEventListener('touchstart', (e) => {
                this.showPassword(e);
            });

            toggle.addEventListener('touchend', (e) => {
                this.hidePassword(e);
            });
        });
    }
}

class RegisterForm extends PasswordToggleMixin(BasePasswordForm) {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
        this.errorMessageElem = this.shadowRoot.querySelector('#error-message');
    }

    render() {

        this.shadowRoot.innerHTML = `
            <style>
                @import url('static/aisapp/register.css');
            </style>

            <main id="main-register">
                <form id="register-form">
                    <div class="form-group">
                        <label for="username">What will be your user name?</label>
                        <input type="text" name="username" id="username" required>
                    </div>
                    <div class="form-group">
                        <label for="first-name">What is your first name?</label>
                        <input type="text" name="first-name" id="first-name" required>
                    </div>
                    <div class="form-group">
                        <label for="last-name">What is your last name?</label>
                        <input type="text" name="last-name" id="last-name" required>
                    </div>
                    <div class="form-group">
                        <label for="email">What is your email address?</label>
                        <input type="email" name="email" id="email" required>
                    </div>
                    <div class="form-group">
                        <label for="password">What will be your password?</label>
                        <input type="password" name="password" id="password" required minlength="8">
                        <span class="toggle-password" data-input="password">👁</span>
                    </div>
                    <div class="form-group">
                        <label for="password2">Repeat your password.</label>
                        <input type="password" name="password2" id="password2" required minlength="8">
                        <span class="toggle-password" data-input="password2">👁</span>

                    </div>
                    <div class="form-group">
                        <button type="submit">Register</button>
                    </div>
                    <div id="error-message"></div>
                </form>
            </main>
        `;
    }


    addEventListeners() {
        const toggleElems = this.shadowRoot.querySelectorAll('.toggle-password');
        this.addTogglePassword(toggleElems);

        const form = this.shadowRoot.querySelector('#register-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (this.validatePassword() !== true) {
                this.errorMessageElem.textContent = "The passwords did not match."
                return;
            }

            const username = this.shadowRoot.querySelector('#username').value;
            const firstName = this.shadowRoot.querySelector('#first-name').value;
            const lastName = this.shadowRoot.querySelector('#last-name').value;
            const email = this.shadowRoot.querySelector('#email').value;
            const password = this.shadowRoot.querySelector('#password').value;

            try {

                const response = await createUser({
                    "username": username,
                    "first_name": firstName,
                    "last_name": lastName,
                    "email": email,
                    "password": password,
                });

                if (response.ok) {
                    this.errorMessageElem.textContent = '';
                    const registrationSuccess = new CustomEvent("registrationSuccessful", { bubbles: true, composed: true })
                    this.dispatchEvent(registrationSuccess);
                }

                else {
                    const errors = await response.json();
                    let allErrors = "";
                    Object.keys(errors).forEach((key) => {
                        allErrors += errors[key] + "\n";
                    });
                    this.displayError(allErrors.trim());
                }

            }

            catch (error) {
                console.error("Error while registering:", error);
                this.displayError("There was a problem registering. Please try again later.");
            }


        });
    }

    validatePassword() {
        const passwordElem = this.shadowRoot.querySelector('#password');
        const password2Elem = this.shadowRoot.querySelector('#password2');
        return passwordElem.value === password2Elem.value;

    }


}

class LoginForm extends PasswordToggleMixin(BasePasswordForm) {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();
        this.errorMessageElem = this.shadowRoot.querySelector('#error-message');
    }


    render() {

        this.shadowRoot.innerHTML = `
        <style>
            @import url('static/aisapp/register.css');
        </style>
        <main id="main-login">
            <form id="login-form">
                <div class="form-group">
                    <label for="username">user name</label>
                    <input type="text" name="username" id="username" required>
                </div>
                <div class="form-group">
                    <label for="password">password</label>
                    <input type="password" name="password" id="password" required minlength="8">
                    <span class="toggle-password" data-input="password">👁</span>
                </div>
                <div class="form-group">
                    <button type="submit">Login</button>
                </div>
                <div id="error-message"></div>
            </form>
    </main>
        `
    }

    addEventListeners() {
        const toggleElems = this.shadowRoot.querySelectorAll('.toggle-password');
        this.addTogglePassword(toggleElems);

        const form = this.shadowRoot.querySelector('#login-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const username = this.shadowRoot.querySelector('#username').value;
            const password = this.shadowRoot.querySelector('#password').value;

            try {

                const response = await loginUser({ 'username': username, 'password': password });

                if (response.ok) {
                    this.errorMessageElem.textContent = '';
                    const loginEvent = new CustomEvent("loginSuccessful", { bubbles: true, composed: true })
                    this.dispatchEvent(loginEvent);
                }

                else {
                    const errors = await response.json();
                    let allErrors = "";
                    Object.keys(errors).forEach((key) => {
                        allErrors += errors[key] + "\n";
                    });
                    this.displayError(allErrors.trim());
                }
            }

            catch (error) {
                console.error("Error while registering:", error);
                this.displayError("There was a problem registering. Please try again later.");
            }


        });
    }


}

customElements.define('login-form', LoginForm);
customElements.define('register-form', RegisterForm);