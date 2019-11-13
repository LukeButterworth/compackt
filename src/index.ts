import './sass/styles.scss';
import { runInThisContext } from 'vm';


class compacktElement extends HTMLElement {

    get observedAttributes(): string[] {
        return [];
    }

    get boundAttributes(): string[] {
        return [];
    }

    DefaultTheme: string;

    HTML: string;

    constructor() {
        super();

        //Create observedAttribute Properties
        if (this.observedAttributes.length > 0) {
            for (let attribute in this.observedAttributes) {
                Object.defineProperty(this, attribute, {
                    configurable: true,
                    get() {
                        return this.getAttribute(attribute);
                    },
                    set(val) {
                        if (val) {
                            this.setAttribute(attribute, val);
                        } else {
                            this.removeAttribute(attribute);
                        }
                    }
                });
            }
        }

        //Create boundAttribute Properties
        if (this.boundAttributes.length > 0) {
            for (let attribute in this.boundAttributes) {
                Object.defineProperty(this, attribute, {
                    configurable: true,
                    get() {
                        return this.hasAttribute(attribute);
                    },
                    set(val) {
                        if (val) {
                            this.setAttribute(attribute);
                        } else {
                            this.removeAttribute(attribute);
                        }
                    },
                });
            }
        }
    }
}

let panelTemplate: HTMLElement = document.createElement('template');
panelTemplate.innerHTML = `<style>

:host(compackt-panel) {
    border-radius: 8px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    box-sizing: border-box;
    display: inline-block;
    font-family: 'Source Sans Pro', sans-serif;
    margin-top: 1em;
    margin-bottom: 1em;
    padding: 1em;
    position: relative;
}

</style>
<div>
    <slot></slot>
</div>
`;

window.ShadyCSS &&
window.ShadyCSS.prepareTemplate(panelTemplate, 'compackt-panel');

// TODO: finish the panel and add to initialise
class Panel extends compacktElement {

    get observedAttributes(): string[] {
        return ['colour', 'type'];
    }

    get boundAttributes(): string[] {
        return [];
    }

    constructor() {
        super();
    }

    connectedCallback() {
        window.ShadyCSS && window.ShadyCSS.styleElement(this);
        if (!this.shadowRoot) {
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(buttonTemplate.content.cloneNode(true));

            let dynamicStyles;
            if (this.hasAttribute('colour')) {
                dynamicStyles = `:host {
                    --background-colour: ${this.getAttribute('colour')};
                }`;
            }
            this.shadowRoot.querySelector('style').innerHTML += dynamicStyles;
        }

        ShadyCSS &&
        ShadyCSS.styleElement({
            '--background-colour' : this.hasAttribute('colour') ? this.getAttribute('colour') : 'white'
        });
    }
}

let buttonTemplate: HTMLElement = document.createElement('template');
buttonTemplate.innerHTML = `<style>

:host {
    background-color: var(--background-colour, red);
    border-radius: 8px;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
    font-family: 'Muli', sans-serif;
    font-weight: bolder;
    padding: 1em;
    

    transition: box-shadow 0.8s;
}

:host(compackt-button:hover) {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
    cursor: pointer;

    transition: box-shadow 0.8s;
}
</style>
<slot></slot>`;

window.ShadyCSS &&
window.ShadyCSS.prepareTemplate(buttonTemplate, 'compackt-button');

class Button extends compacktElement {

    get observedAttributes(): string[] {
        return ['colour', 'link', 'action'];
    }

    get boundAttributes(): string[] {
        return [];
    }

    constructor() {
        super();
    }

    connectedCallback() {
        //const { shadowRoot } = this;
        //shadowRoot.innerHTML = this.DefaultTheme + this.HTML;
        window.ShadyCSS && window.ShadyCSS.styleElement(this);
        if (!this.shadowRoot) {
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(buttonTemplate.content.cloneNode(true));

            let dynamicStyles;
            if (this.hasAttribute('colour')) {
                dynamicStyles = `:host {
                    --background-colour: ${this.getAttribute('colour')};
                }`;
            }
            this.shadowRoot.querySelector('style').innerHTML += dynamicStyles;
        }

        //Insert content from attributes
        if (this.hasAttribute('link')) {
            let link = this.getAttribute('link');
            this.addEventListener('click', () => {
                window.location.href = link;
            })
        } else if (this.hasAttribute('action')) {
            let action = this.getAttribute('action');
            this.addEventListener('click', () => {
                eval(action);
            })
            // TODO: Find a more secure option
        }

        ShadyCSS &&
        ShadyCSS.styleElement({
            '--background-colour' : this.hasAttribute('colour') ? this.getAttribute('colour') : 'red'
        });
    }

    

    attributesChangedCallback(name: string, oldVal: string, newVal: string) {
    
        if (name == 'colour') {
            this.adjustColour();
        }

        name === "colour" &&
            ShadyCSS &&
            ShadyCSS.styleElement({
               '--background-colour' : newVal ? 'grey' : 'white'
        });
    }

    adjustColour() {
        let dynamicStyles;
        if (this.hasAttribute('colour')) {
            dynamicStyles = `:host {
                --background-colour: ${this.getAttribute('colour')};
            }`;
        }
        this.shadowRoot.querySelector('style').innerHTML += dynamicStyles;
    }
}

let menuItemTemplate: HTMLElement = document.createElement('template');
menuItemTemplate.innerHTML = `<style>
:host {
    margin: 1em;
    min-width: 10vw;
}
</style>
<slot></slot>`;

window.ShadyCSS &&
window.ShadyCSS.prepareTemplate(menuItemTemplate, 'compackt-menu-item');

class MenuItem extends compacktElement {

    get observedAttributes() {
        return ['link'];
    }

    constructor() {
        super();
    }

    connectedCallback() {
        window.ShadyCSS && window.ShadyCSS.styleElement(this);
        if (!this.shadowRoot) {
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(menuItemTemplate.content.cloneNode(true));
        }

        this.addEventListener('click', () => {
            window.location.href = this.getAttribute('link');
        });
    }
}

let dropdownTemplate: HTMLElement = document.createElement('template');
dropdownTemplate.innerHTML = `<style>

:host(compackt-dropdown) {
    position: absolute;
    padding: 1em;
    font-family: "Muli", sens-serif;
    font-weight: bold;
    border-radius: 8px;
    cursor: pointer;
    margin: 0;
    background-color: var(--background-colour, red);
    
    height: 3em;
    transition: height 0.8s, box-shadow 0.8s;
    transition-delay: 0.3s;
}
  
:host(compackt-dropdown.hover-open:hover) {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
    transition: height 0.8s, box-shadow 0.8s;
}

:host(compackt-dropdown.open) {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
    transition: height 0.8s, box-shadow 0.8s;
}
  
:host(compackt-dropdown) > h2 {
    font-size: 1.3em;
    margin: 0;
}
  
:host(compackt-dropdown) *::slotted(compackt-menu-item) {
    position: static;
    height: 0;
    margin: 0;
    padding: 0;
    display: block;
    opacity: 0;
    transition: opacity 0.8s, height 0.8s, margin 0.8s;
    transition-delay: 0s, 0.8s;
    pointer-events: none;
}
  
:host(compackt-dropdown.hover-open:hover) *::slotted(compackt-menu-item) {
    position: static;
    height: 1.4em;
    opacity: 1;
    margin-top: 1em;
    margin-bottom: 1em;
    transition: opacity 0.8s, height 0.8s, margin 0.8s;
    transition-delay: 0.5s;
    pointer-events: auto;
}

:host(compackt-dropdown.open) *::slotted(compackt-menu-item) {
    position: static;
    height: 1.4em;
    opacity: 1;
    margin-top: 1em;
    margin-bottom: 1em;
    transition: opacity 0.8s, height 0.8s, margin 0.8s;
    transition-delay: 0.5s;
    pointer-events: auto;
}
  
:host(compackt-dropdown.hover-open:hover) *::slotted(compackt-menu-item:hover) {
    color: white;
    cursor: pointer;
    transition: color 0.5s;
}

:host(compackt-dropdown.open) *::slotted(compackt-menu-item:hover) {
    color: white;
    cursor: pointer;
    transition: color 0.5s;
}
  
</style>
<h2 id='name'></h2>
<slot></slot>`

window.ShadyCSS &&
window.ShadyCSS.prepareTemplate(dropdownTemplate, 'compackt-dropdown');

class Dropdown extends compacktElement {
    // TODO: Complete transitions

    //ATTRIBUTES
    get observedAttributes(): string[] {
        return ['colour', 'mode', 'name'];
    }

    get boundAttributes(): string[] {
        return [];
    }

    constructor() {
        super();
    }

    //CALLBACK FUNCTIONS
    connectedCallback() {
        window.ShadyCSS && window.ShadyCSS.styleElement(this);
        if (!this.shadowRoot) {
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(dropdownTemplate.content.cloneNode(true));

            //Add dynamic styling
            let dynamicStyles;
            if (this.hasAttribute('colour')) {
                dynamicStyles = `:host {
                    --background-colour: ${this.getAttribute('colour')};
                }`;
            }
            this.shadowRoot.querySelector('style').innerHTML += dynamicStyles;
        }

        

        if (this.getAttribute('mode') === 'hover') {
            this.classList.add('hover-open');
        } else {
            this.addEventListener('click', () => {
                if (this.getAttribute('open') === 'true') {
                    this.setAttribute('open', 'false');
                    this.classList.remove('open');
                } else {
                    this.setAttribute('open', 'true');
                    this.classList.add('open');
                }
            });
        }

        //Set the name of the dropdown;
        this.shadowRoot.querySelector('#name').textContent = this.getAttribute('name');

        //Calculate the appropriate dropdown height
        this.shadowRoot.querySelector('slot').addEventListener('slotchange', () => {
            let children = this.shadowRoot.querySelector('slot').assignedNodes();
            let styles = this.shadowRoot.querySelectorAll('style');
            let style = styles[styles.length - 1];
            style.innerHTML += `:host(compackt-dropdown.hover-open:hover) {
                height: ${3 + 1.3 * (children.length - 1)}em;
            }

            :host(compackt-dropdown.open) {
                height: ${3 + 1.3 * children.length - 1}em;
            }
            `;
        });

        ShadyCSS &&
        ShadyCSS.styleElement({
            '--open-height' : true ? 'grey' : 'white'
        }); 

        ShadyCSS &&
        ShadyCSS.styleElement({
            '--background-colour' : this.hasAttribute('colour') ? this.getAttribute('colour') : 'white'
        });
    }
}

let headerTemplate: HTMLElement = document.createElement('template');
headerTemplate.innerHTML = `<style>

:host(compackt-header) {
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.6);
    position: absolute;
    left: 0;
    right: 0;
    background-color: var(--background-colour, red);
    height: 12vh;
    text-align: center;
}
  
:host(compackt-header) #container {
    height: 100%;
    position: relative;
}
  
:host(compackt-header) h1 {
    display: inline-block;
    font-family: "Muli", sans-serif;
    font-weight: 800;
    margin: 0;
    margin-top: 3vh;
    margin-bottom: 2vh;
    cursor: pointer;
    vertical-align: middle;
}
  
:host(compackt-header.sticky) {
    position: fixed;
}
  
:host(compackt-header) *::slotted(compackt-dropdown) {
    display: none;
    right: 0;
}
  
:host(compackt-header) #menu-icon {
    position: absolute;
    text-align: center;
    height: 10vh;
    width: 10vh;
    top: 0;
    right: 0;
}
  
:host(compackt-header) #menu-icon div {
    display: block;
    background-color: black;
    height: 0.3em;
    width: 2em;
    margin: 0 auto;
    margin-top: 0;
    margin-bottom: 0.4em;
    transition: opacity 0.8s;
}
  
:host(compackt-header) #menu-icon div:first-child {
    margin-top: 4.2vh;
    transition: transform 0.8s;
}
  
:host(compackt-header) #menu-icon div:last-child {
    padding-bottom: 0;
    transition: transform 0.8s;
}
  
:host(compackt-header.open) #menu-icon div {
    position: relative;
    opacity: 0;
    transition: opacity 0.8s;
}
  
:host(compackt-header.open) #menu-icon div:first-child {
    opacity: 1;
    transform: rotate(45deg) translate(0.5em, 0.5em);
    transition: transform 0.8s;
}
  
:host(compackt-header.open) #menu-icon div:last-child {
    opacity: 1;
    transform: rotate(-45deg) translate(0.5em, -0.5em);
    transition: transform 0.8s;
}
  
:host(compackt-header) #shade {
    height: 88vh;
    width: 100vw;
    background-color: #333333;
    position: fixed;
    left: 0;
    opacity: 0;
    right: 0;
    bottom: 0;
    z-index: -10;

    transition: opacity 0.8s;
}

:host(compackt-header.open) #shade {
    opacity: 0.6;
    z-index: 5;

    transition: opacity 0.8s;
}

:host(compackt-header.open) #menu {
    position: absolute;
    z-index: 30;
    padding-left: 2em;
    padding-right: 2em;
    left: 0;
    right: 0;
    top: 10vh;
    bottom: -90vh;
}

:host(compackt-header.open) *::slotted(compackt-dropdown) {
    position: relative;
    display: block;
    margin-top: 2em;
    position: static;
    z-index: 10;
}
  
@media all and (min-height: 1000px) {
    :host(compackt-header) {
      height: 10vh;
    }
}
@media all and (min-width: 800px) {
    :host(compackt-header) *::slotted(compackt-dropdown) {
      display: block;
      margin-top: 1em;
      margin-left: 2em;
      position: relative;
      float: right;
    }
  
    :host(compackt-header) > #container {
      box-sizing: border-box;
      margin-left: 5em;
      margin-right: 3em;
    }
  
    :host(compackt-header) h1 {
      margin-top: 2vh;
      float: left;
    }
  
    :host(compackt-header) #menu-icon {
      display: none;
    }
}
  
</style>

<div id='container'>
    <div id='shade'></div>
    <h1 id='name'></h1>
    <div id='menu'>
        <slot></slot>
    </div>
    
</div>
<div id='menu-icon'>
    <div></div>
    <div></div>
    <div></div>
</div>`;

window.ShadyCSS &&
window.ShadyCSS.prepareTemplate(headerTemplate, 'compackt-header');

class StickyHeader extends compacktElement {

    get observedAttributes(): string[] {
        return ['colour', 'name', 'image', 'link'];
    }

    get boundAttributes(): string[] {
        return ['sticky'];
    }

    constructor() {
        super();
    }

    connectedCallback() {
        window.ShadyCSS && window.ShadyCSS.styleElement(this);
        if (!this.shadowRoot) {
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(headerTemplate.content.cloneNode(true))

            //Add dynamic styling
            let dynamicStyles;
            if (this.hasAttribute('colour')) {
                dynamicStyles = `:host {
                    --background-colour: ${this.getAttribute('colour')};
                }`;
            }
            this.shadowRoot.querySelector('style').innerHTML += dynamicStyles;
        }

        this.shadowRoot.querySelector('#menu-icon').addEventListener('click', () => {
            if (this.classList.contains('open')) {
                this.classList.remove('open');
            } else {
                this.classList.add('open');
            }
        })

        if (this.hasAttribute('sticky')) {
            this.classList.add('sticky');
        }

        //Insert content from attributes
        if (this.hasAttribute('name')) {
            this.shadowRoot.querySelector('#name').textContent = this.getAttribute('name');
        }
        if (this.hasAttribute('image')) {
            let container = this.shadowRoot.querySelector('#container');
            let imageNode = document.createElement('img');
            imageNode.setAttribute('src',`${this.getAttribute('image')}`)
            container.insertBefore(imageNode, container.childNodes[0]);
        }
        if (this.hasAttribute('link')) {
            this.shadowRoot.querySelector('h1').addEventListener('click', () => {
                window.location.href = this.getAttribute('link');
            });
        }

        ShadyCSS &&
        ShadyCSS.styleElement({
            '--background-colour: ' : this.hasAttribute('colour') ? this.getAttribute('colour') : 'red'
        });
    }
}

let collapsibleTemplate = document.createElement('template');
collapsibleTemplate.innerHTML = `<style>

</style>`;

window.ShadyCSS &&
window.ShadyCSS.prepareTemplate(collapsibleTemplate, 'compackt-collapsible-panel');

class CollapsiblePanel extends compacktElement {


    get observedAttributes(): string[] {
        return ['colour', 'name'];
    }

    get boundAttributes(): string[] {
        return [];
    }

    constructor() {
        super();
    }

    connectedCallback() {
        window.ShadyCSS && window.ShadyCSS.styleElement(this);
        if (!this.shadowRoot) {
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(headerTemplate.content.cloneNode(true))
        }

        this.addEventListener('click', () => {
            if (this.hasAttribute('open')) {
                this.setAttribute('open', 'false');
                this.classList.remove('open');
            } else {
                this.setAttribute('open', 'true');
                this.classList.add('open');
            }
        });
    }
}

let accordianTemplate = document.createElement('template');
accordianTemplate.innerHTML = `<style>

</style>`;

window.ShadyCSS &&
window.ShadyCSS.prepareTemplate(accordianTemplate, 'compackt-accordian');

class Accordian extends compacktElement {
    get observedAttributes() {
        return ['colour', 'panel'];
    }

    get boundAttributes() {
        return ['bound'];
    }

    constructor() {
        super();
    }

    //CALLBACK FUNCTIONS
    connectedCallback() {
        window.ShadyCSS && window.ShadyCSS.styleElement(this);
        if (!this.shadowRoot) {
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(headerTemplate.content.cloneNode(true))
        }

        if (this.hasAttribute('bound')) {
            let panels = this.getElementsByTagName('compackt-collapsible-panel')

            for (let i = 0; i < panels.length; i++) {
                let panel = panels[i]
                if (i.toString() == this.getAttribute('panel')) {
                    panel.setAttribute('open', 'true');
                    panel.classList.add('open');
                } else {
                    panel.setAttribute('open', 'false')
                    panel.classList.remove('open');
                }
                //Make panels interconnect
            };
        }
    }
}

function Initialise(...args: string[]) {

    //Embed the required fonts
    let fontLink = document.createElement('link');
    fontLink.setAttribute('href', 'https://fonts.googleapis.com/css?family=Source+Sans+Pro|Muli:400,700,800|Roboto+Mono&display=swap');
    fontLink.setAttribute('rel', 'stylesheet');
    let head = document.getElementsByTagName('head')[0];
    head.appendChild(fontLink);

    //Define the selected custom elements
    for (let arg of args) {
        arg = arg.toString().toUpperCase();
        switch (arg) {
            case 'PANEL':
                customElements.define('compackt-panel', Panel);
            case 'BUTTON':
                customElements.define('compackt-button', Button);
                break;
            case 'DROPDOWN':
                customElements.define('compackt-menu-item', MenuItem);
                customElements.define('compackt-dropdown', Dropdown);
                break;
            case 'STICKYHEADER':
                customElements.define('compackt-header', StickyHeader);
                break;
            case 'ACCORDIAN':
                customElements.define('compackt-collapsible-panel', CollapsiblePanel);
                customElements.define('compackt-accordian', Accordian);
                break;
            case 'COLLAPSIBLEPANEL':
                customElements.define('compackt-collapsible-panel', CollapsiblePanel);
                break;
        }
    }
}

Initialise('Dropdown', 'StickyHeader', 'Accordian', 'Button', 'Panel');