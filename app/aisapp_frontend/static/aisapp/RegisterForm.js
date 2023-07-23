import { getCookie } from './utils.js';

class RegisterForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleToggleMouseDown = this.handleToggleMouseDown.bind(this);
        this.handleToggleMouseUp = this.handleToggleMouseUp.bind(this);
        this.handleToggleMouseLeave = this.handleToggleMouseLeave.bind(this);
        this.handleToggleTouchStart = this.handleToggleTouchStart.bind(this);
        this.handleToggleTouchEnd = this.handleToggleTouchEnd.bind(this);
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
    displayError(message, duration = null) {
        this.errorMessageElem.textContent = message;
        if (duration) {
            setTimeout(() => {
                this.errorMessageElem.textContent = '';
            }, duration);
        }
    }

    addEventListeners() {
        const toggleElems = this.shadowRoot.querySelectorAll('.toggle-password');
        const form = this.shadowRoot.querySelector('#register-form');



        this.addTogglePassword(toggleElems);

        form.addEventListener('submit', async (e) => {
            e.preventDefault();


            if (this.validatePassword() !== true) {
                this.errorMessageElem.textContent = "The passwords did not match."
                return;
            }

            try {
                const response = await this.createUser();
                if (response.ok) {
                    this.errorMessageElem.textContent = '';
                    const successEvent = new CustomEvent("loginSuccessful", { bubbles: true, composed: true })
                    this.dispatchEvent(successEvent);
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

    validatePassword() {
        const passwordElem = this.shadowRoot.querySelector('#password');
        const password2Elem = this.shadowRoot.querySelector('#password2');
        return passwordElem.value === password2Elem.value;

    }

    async createUser() {
        const username = this.shadowRoot.querySelector('#username').value;
        const firstName = this.shadowRoot.querySelector('#first-name').value;
        const lastName = this.shadowRoot.querySelector('#last-name').value;
        const email = this.shadowRoot.querySelector('#email').value;
        const password = this.shadowRoot.querySelector('#password').value;

        return await fetch("/api/users/?format=json", {
            method: "POST",
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie('csrftoken'),
            },
            credentials: 'same-origin',
            body: JSON.stringify({
                "username": username,
                "first_name": firstName,
                "last_name": lastName,
                "email": email,
                "password": password,
            })
        });


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

customElements.define('register-form', RegisterForm);