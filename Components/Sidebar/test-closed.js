// Test file for closed Shadow DOM approach
class TestSidebar extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: "closed" });
    this._state = { collapsed: false };
    this._init();
  }

  _init() {
    this._render();
  }

  _render() {
    this._shadow.innerHTML = `
      <style>
        :host { display: block; }
        .sidebar { background: #f0f0f0; padding: 20px; }
      </style>
      <div class="sidebar">Closed Shadow DOM Test</div>
    `;
  }

  // Public API only
  toggle() {
    this._state.collapsed = !this._state.collapsed;
    console.log('State:', this._state);
  }
}

customElements.define('test-sidebar', TestSidebar);
