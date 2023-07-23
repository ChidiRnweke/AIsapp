class RegisterForm extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.render();
        this.addEventListeners();

    }

    render() {

        this.shadowRoot.innerHTML = `
            <style>
                @import url('static/aisapp/login.css');
            </style>
            
            <main id="main-login">
                <form id="login-form">
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
                </main
        </form>
        `;
    }

    addEventListeners() {
        const toggleElems = this.shadowRoot.querySelectorAll('.toggle-password');
        const form = this.shadowRoot.querySelector('#login-form');
        const passwordElem = this.shadowRoot.querySelector('#password');
        const password2Elem = this.shadowRoot.querySelector('#password2');


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
        });

        form.addEventListener('submit', (e) => {
            e.preventDefault();

            if (passwordElem.value.length < 8) {
                alert('Password must be at least 8 characters long.');
                return;
            }

            if (passwordElem.value !== password2Elem.value) {
                alert('Passwords do not match.');
                return;
            }
            // TO-DO: send post request to backend
            // TO-DO: colour the input bars red
            console.log('Form submitted!');
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