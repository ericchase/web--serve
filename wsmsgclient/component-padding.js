export class Padding extends HTMLElement {
  static observedAttributes = ['fill-h', 'fill-w'];

  constructor() {
    super();
    const element = document.getElementById('template-padding');
    if (element && element instanceof HTMLTemplateElement) {
      const template = element;
      const templateContent = template.content;
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.appendChild(templateContent.cloneNode(true));
      this.col = this.shadowRoot?.querySelector('.col');
      this.row = this.shadowRoot?.querySelector('.row');
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'fill-h': {
        newValue !== null ? add(this.row, name) : remove(this.row, name);
        break;
      }
      case 'fill-w': {
        newValue !== null ? add(this.col, name) : remove(this.col, name);
        break;
      }
    }
  }
}

/**
 * @param {Element|null|undefined} element
 * @param {string} className
 */
function add(element, className) {
  element?.classList.add(className);
}
/**
 * @param {Element|null|undefined} element
 * @param {string} className
 */
function remove(element, className) {
  element?.classList.remove(className);
}
