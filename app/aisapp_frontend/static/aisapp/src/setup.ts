class PresetSetup extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }
    connectedCallback() {
        this.render()
    }


    render() {
        this.innerHTML = `
        <style>
            @import url('static/aisapp/css/register.css');
        </style>

        
        `
    }
}

customElements.define("preset-setup", PresetSetup)