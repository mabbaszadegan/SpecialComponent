// Advanced Sidebar Web Components
// <sc-sidebar> and <sc-sidebar-item> with full feature set

class ScSidebar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.state = {
            collapsed: false,
            mobileOpen: false,
            searchQuery: '',
            expandedItems: []
        };
        this.defaultItems = [
            {
                key: 'dashboard',
                text: 'Dashboard',
                icon: 'fas fa-tachometer-alt',
                description: 'System overview',
                behavior: 'clickable'
            },
            {
                key: 'users',
                text: 'Users',
                icon: 'fas fa-users',
                description: 'User management',
                behavior: 'expandable',
                children: [
                    {
                        key: 'user-list',
                        text: 'User List',
                        icon: 'fas fa-list',
                        description: 'View all users',
                        behavior: 'clickable'
                    },
                    {
                        key: 'add-user',
                        text: 'Add User',
                        icon: 'fas fa-user-plus',
                        description: 'Create new user',
                        behavior: 'clickable'
                    }
                ]
            },
            {
                key: 'settings',
                text: 'Settings',
                icon: 'fas fa-cog',
                description: 'System configuration',
                behavior: 'clickable'
            }
        ];
        this.init();
    }

    static get observedAttributes() {
        return ['theme', 'position', 'width', 'collapsible', 'show-header', 'show-footer', 'searchable', 'animations', 'responsive', 'remember-state'];
    }

    init() {
        this.loadState();
        this.render();
        this.setupEventListeners();
        this.createDefaultItemsIfNeeded();
    }

    render() {
        const theme = this.getAttribute('theme') || 'light';
        const position = this.getAttribute('position') || 'left';
        const width = this.getAttribute('width') || '250px';
        const showHeader = this.hasAttribute('show-header');
        const showFooter = this.hasAttribute('show-footer');
        const searchable = this.hasAttribute('searchable');
        const collapsible = this.hasAttribute('collapsible');

        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/../../assets/libs/font-awesome/fontawsome.min.css">
            <style>
                /* Sidebar Web Components Styles */
                
                /* CSS Variables for theming */
                :host {
                    /* Light theme */
                    --sc-light-bg: #ffffff;
                    --sc-light-text: #333333;
                    --sc-light-border: #e0e0e0;
                    --sc-light-hover: #f5f5f5;
                    --sc-light-active: #e3f2fd;
                    --sc-light-shadow: rgba(0, 0, 0, 0.1);
                    
                    /* Dark theme */
                    --sc-dark-bg: #2c3e50;
                    --sc-dark-text: #ecf0f1;
                    --sc-dark-border: #34495e;
                    --sc-dark-hover: #34495e;
                    --sc-dark-active: #3498db;
                    --sc-dark-shadow: rgba(0, 0, 0, 0.3);
                    
                    /* Common */
                    --sc-transition: all 0.3s ease;
                    --sc-border-radius: 8px;
                    --sc-font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                }
                
                /* Sidebar Container */
                .sc-sidebar {
                    display: flex;
                    flex-direction: column;
                    height: 100vh;
                    background: var(--sc-light-bg);
                    color: var(--sc-light-text);
                    border: 1px solid var(--sc-light-border);
                    box-shadow: 0 2px 10px var(--sc-light-shadow);
                    transition: var(--sc-transition);
                    font-family: var(--sc-font-family);
                    overflow: hidden;
                }
                
                .sc-sidebar[theme="dark"] {
                    background: var(--sc-dark-bg);
                    color: var(--sc-dark-text);
                    border-color: var(--sc-dark-border);
                    box-shadow: 0 2px 10px var(--sc-dark-shadow);
                }
                
                /* Position variants */
                .sc-sidebar[position="left"] {
                    border-right: 1px solid var(--sc-light-border);
                }
                
                .sc-sidebar[position="right"] {
                    border-left: 1px solid var(--sc-light-border);
                }
                
                .sc-sidebar[position="right"][theme="dark"] {
                    border-left-color: var(--sc-dark-border);
                }
                
                /* Header */
                .sc-sidebar-header {
                    padding: 20px;
                    border-bottom: 1px solid var(--sc-light-border);
                    background: var(--sc-light-bg);
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    min-height: 60px;
                }
                
                .sc-sidebar[theme="dark"] .sc-sidebar-header {
                    border-bottom-color: var(--sc-dark-border);
                    background: var(--sc-dark-bg);
                }
                
                .sc-sidebar-header h3 {
                    margin: 0;
                    font-size: 18px;
                    font-weight: 600;
                }
                
                .sc-sidebar-header .sc-toggle-btn {
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    color: inherit;
                    padding: 5px;
                    border-radius: 4px;
                    transition: var(--sc-transition);
                }
                
                .sc-sidebar-header .sc-toggle-btn:hover {
                    background: var(--sc-light-hover);
                }
                
                .sc-sidebar[theme="dark"] .sc-sidebar-header .sc-toggle-btn:hover {
                    background: var(--sc-dark-hover);
                }
                
                /* Search */
                .sc-sidebar-search {
                    padding: 15px 20px;
                    border-bottom: 1px solid var(--sc-light-border);
                }
                
                .sc-sidebar[theme="dark"] .sc-sidebar-search {
                    border-bottom-color: var(--sc-dark-border);
                }
                
                .sc-sidebar-search input {
                    width: 100%;
                    padding: 10px 15px;
                    border: 1px solid var(--sc-light-border);
                    border-radius: var(--sc-border-radius);
                    background: var(--sc-light-bg);
                    color: var(--sc-light-text);
                    font-size: 14px;
                    transition: var(--sc-transition);
                }
                
                .sc-sidebar[theme="dark"] .sc-sidebar-search input {
                    border-color: var(--sc-dark-border);
                    background: var(--sc-dark-bg);
                    color: var(--sc-dark-text);
                }
                
                .sc-sidebar-search input:focus {
                    outline: none;
                    border-color: #3498db;
                    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
                }
                
                /* Content */
                .sc-sidebar-content {
                    flex: 1;
                    overflow-y: auto;
                    padding: 10px 0;
                }
                
                .sc-sidebar-content::-webkit-scrollbar {
                    width: 6px;
                }
                
                .sc-sidebar-content::-webkit-scrollbar-track {
                    background: transparent;
                }
                
                .sc-sidebar-content::-webkit-scrollbar-thumb {
                    background: var(--sc-light-border);
                    border-radius: 3px;
                }
                
                .sc-sidebar[theme="dark"] .sc-sidebar-content::-webkit-scrollbar-thumb {
                    background: var(--sc-dark-border);
                }
                
                /* Footer */
                .sc-sidebar-footer {
                    padding: 20px;
                    border-top: 1px solid var(--sc-light-border);
                    background: var(--sc-light-bg);
                    text-align: center;
                    font-size: 12px;
                    color: #666;
                }
                
                .sc-sidebar[theme="dark"] .sc-sidebar-footer {
                    border-top-color: var(--sc-dark-border);
                    background: var(--sc-dark-bg);
                    color: #bdc3c7;
                }
                
                /* Sidebar Items */
                .sc-sidebar-item {
                    display: flex;
                    align-items: center;
                    padding: 12px 20px;
                    cursor: pointer;
                    transition: var(--sc-transition);
                    border: none;
                    background: none;
                    width: 100%;
                    text-align: left;
                    color: inherit;
                    font-family: inherit;
                    font-size: 14px;
                    position: relative;
                }
                
                .sc-sidebar-item:hover {
                    background: var(--sc-light-hover);
                }
                
                .sc-sidebar[theme="dark"] .sc-sidebar-item:hover {
                    background: var(--sc-dark-hover);
                }
                
                .sc-sidebar-item.active {
                    background: var(--sc-light-active);
                    color: #1976d2;
                }
                
                .sc-sidebar[theme="dark"] .sc-sidebar-item.active {
                    background: var(--sc-dark-active);
                    color: #64b5f6;
                }
                
                /* آیتم‌های قابل باز شدن */
                .sc-sidebar-item[data-expandable="true"] {
                    cursor: pointer;
                }
                
                /* آیتم‌های قابل کلیک */
                .sc-sidebar-item[data-clickable="true"] {
                    cursor: pointer;
                }
                
                /* آیتم‌های غیرفعال */
                .sc-sidebar-item[data-clickable="false"][data-expandable="false"] {
                    cursor: default;
                    opacity: 0.6;
                }
                
                .sc-sidebar-item .sc-item-icon {
                    width: 20px;
                    margin-right: 12px;
                    text-align: center;
                    font-size: 16px;
                    flex-shrink: 0;
                }
                
                .sc-sidebar-item .sc-item-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }
                
                .sc-sidebar-item .sc-item-text {
                    font-weight: 500;
                    margin-bottom: 2px;
                }
                
                .sc-sidebar-item .sc-item-description {
                    font-size: 12px;
                    color: #666;
                    opacity: 0.8;
                }
                
                .sc-sidebar[theme="dark"] .sc-sidebar-item .sc-item-description {
                    color: #bdc3c7;
                }
                
                .sc-sidebar-item .sc-item-arrow {
                    margin-left: auto;
                    transition: var(--sc-transition);
                    font-size: 12px;
                }
                
                .sc-sidebar-item.expanded .sc-item-arrow {
                    transform: rotate(90deg);
                }
                
                /* Nested items */
                .sc-sidebar-item .sc-nested-items {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease, opacity 0.3s ease, transform 0.3s ease, padding 0.3s ease;
                    background: rgba(0, 0, 0, 0.02);
                    opacity: 0;
                    transform: translateY(-10px);
                    padding: 0;
                }
                
                .sc-sidebar[theme="dark"] .sc-sidebar-item .sc-nested-items {
                    background: rgba(255, 255, 255, 0.02);
                }
                
                .sc-sidebar-item.expanded .sc-nested-items {
                    max-height: 1000px;
                    opacity: 1;
                    transform: translateY(0);
                    padding: 5px 0;
                }
                
                .sc-sidebar-item .sc-nested-items .sc-sidebar-item {
                    padding-left: 40px;
                    font-size: 13px;
                }
                
                .sc-sidebar-item .sc-nested-items .sc-sidebar-item .sc-item-icon {
                    font-size: 14px;
                }
                
                /* Collapsed state */
                .sc-sidebar.collapsed {
                    width: 60px !important;
                }
                
                .sc-sidebar.collapsed .sc-sidebar-header h3,
                .sc-sidebar.collapsed .sc-sidebar-search,
                .sc-sidebar.collapsed .sc-sidebar-footer,
                .sc-sidebar.collapsed .sc-item-text,
                .sc-sidebar.collapsed .sc-item-description,
                .sc-sidebar.collapsed .sc-item-arrow {
                    display: none;
                }
                
                .sc-sidebar.collapsed .sc-sidebar-item {
                    padding: 15px 0;
                    justify-content: center;
                }
                
                .sc-sidebar.collapsed .sc-sidebar-item .sc-item-icon {
                    margin: 0;
                    font-size: 18px;
                }
                
                .sc-sidebar.collapsed .sc-nested-items {
                    display: none !important;
                }
                
                /* Responsive */
                @media (max-width: 768px) {
                    .sc-sidebar {
                        position: fixed;
                        top: 0;
                        left: 0;
                        z-index: 1000;
                        transform: translateX(-100%);
                        transition: transform 0.3s ease;
                    }
                    
                    .sc-sidebar[position="right"] {
                        left: auto;
                        right: 0;
                        transform: translateX(100%);
                    }
                    
                    .sc-sidebar.mobile-open {
                        transform: translateX(0);
                    }
                    
                    .sc-sidebar-overlay {
                        position: fixed;
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        background: rgba(0, 0, 0, 0.5);
                        z-index: 999;
                        opacity: 0;
                        visibility: hidden;
                        transition: var(--sc-transition);
                    }
                    
                    .sc-sidebar-overlay.visible {
                        opacity: 1;
                        visibility: visible;
                    }
                }
                
                /* Animations */
                .sc-sidebar[animations="true"] .sc-sidebar-item {
                    animation: slideIn 0.3s ease;
                }
                
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                .sc-sidebar[animations="true"] .sc-nested-items {
                    animation: expandIn 0.3s ease;
                }
                
                @keyframes expandIn {
                    from {
                        opacity: 0;
                        max-height: 0;
                    }
                    to {
                        opacity: 1;
                        max-height: 1000px;
                    }
                }
                
                /* Utility classes */
                .sc-hidden {
                    display: none !important;
                }
                
                .sc-visible {
                    display: block !important;
                }
            </style>
            
            <div class="sc-sidebar ${this.state.collapsed ? 'collapsed' : ''} ${this.state.mobileOpen ? 'mobile-open' : ''}" 
                 theme="${theme}" 
                 position="${position}" 
                 style="width: ${width};">
                
                ${showHeader ? `
                    <div class="sc-sidebar-header">
                        <h3>${this.getAttribute('title') || 'Sidebar'}</h3>
                        ${collapsible ? `
                            <button class="sc-toggle-btn" id="toggleBtn">
                                <i class="fas fa-${this.state.collapsed ? 'bars' : 'times'}"></i>
                            </button>
                        ` : ''}
                    </div>
                ` : ''}
                
                ${searchable ? `
                    <div class="sc-sidebar-search">
                        <input type="text" 
                               id="searchInput" 
                               placeholder="Search..." 
                               value="${this.state.searchQuery}">
                    </div>
                ` : ''}
                
                <div class="sc-sidebar-content" id="sidebarContent">
                    <slot></slot>
                </div>
                
                ${showFooter ? `
                    <div class="sc-sidebar-footer">
                        <span>© 2024 Sidebar Component</span>
                    </div>
                ` : ''}
            </div>
            
            ${this.hasAttribute('responsive') ? `
                <div class="sc-sidebar-overlay" id="overlay"></div>
            ` : ''}
        `;
    }

    setupEventListeners() {
        // Toggle button
        const toggleBtn = this.shadowRoot.getElementById('toggleBtn');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleCollapse());
        }

        // Search functionality
        const searchInput = this.shadowRoot.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
        }

        // Mobile overlay
        const overlay = this.shadowRoot.getElementById('overlay');
        if (overlay) {
            overlay.addEventListener('click', () => this.closeMobile());
        }

        // Handle slot changes
        const slot = this.shadowRoot.querySelector('slot');
        if (slot) {
            slot.addEventListener('slotchange', () => this.handleSlotChange());
        }

        // Keyboard navigation
        this.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleSlotChange() {
        const items = this.querySelectorAll('sc-sidebar-item');
        
        // اگر آیتم‌های جدید اضافه شدن، قابلیت‌ها رو تحلیل کن
        this.refreshItemCapabilities();
        
        // اگر آیتم قبلاً باز شده بود، دوباره بازش کن
        items.forEach(item => {
            if (item.key && this.state.expandedItems.includes(item.key)) {
                item.expand();
            }
        });
    }

    handleSearch(query) {
        this.state.searchQuery = query;
        const items = this.querySelectorAll('sc-sidebar-item');
        
        items.forEach(item => {
            const text = item.getAttribute('text') || '';
            const description = item.getAttribute('description') || '';
            const matches = query === '' || 
                           text.toLowerCase().includes(query.toLowerCase()) ||
                           description.toLowerCase().includes(query.toLowerCase());
            
            item.style.display = matches ? 'block' : 'none';
        });

        this.saveState();
    }
    
    // متد جدید برای مدیریت آیتم‌های جدید
    refreshItemCapabilities() {
        this.querySelectorAll('sc-sidebar-item').forEach(item => {
            if (item.analyzeItemCapabilities && typeof item.analyzeItemCapabilities === 'function') {
                item.analyzeItemCapabilities();
                item.render();
            }
        });
    }

    toggleCollapse() {
        this.state.collapsed = !this.state.collapsed;
        this.render();
        this.setupEventListeners();
        this.saveState();
    }

    closeMobile() {
        this.state.mobileOpen = false;
        this.render();
        this.setupEventListeners();
    }

    openMobile() {
        this.state.mobileOpen = true;
        this.render();
        this.setupEventListeners();
    }

    handleKeyboard(e) {
        switch(e.key) {
            case 'Escape':
                if (this.state.mobileOpen) this.closeMobile();
                break;
            case 'Enter':
                if (e.target.classList.contains('sc-sidebar-item')) {
                    e.target.click();
                }
                break;
        }
    }

    createDefaultItemsIfNeeded() {
        if (this.children.length === 0) {
            this.defaultItems.forEach(itemData => {
                const item = document.createElement('sc-sidebar-item');
                Object.keys(itemData).forEach(key => {
                    if (key !== 'children') {
                        item.setAttribute(key, itemData[key]);
                    }
                });
                
                if (itemData.children) {
                    itemData.children.forEach(childData => {
                        const child = document.createElement('sc-sidebar-item');
                        Object.keys(childData).forEach(key => {
                            child.setAttribute(key, childData[key]);
                        });
                        item.appendChild(child);
                    });
                }
                
                this.appendChild(item);
            });
            
            // بعد از اضافه کردن آیتم‌ها، قابلیت‌ها رو تحلیل کن
            setTimeout(() => {
                this.refreshItemCapabilities();
            }, 0);
        }
    }

    loadState() {
        if (this.hasAttribute('remember-state')) {
            const savedState = localStorage.getItem(`sc-sidebar-${this.id || 'default'}`);
            if (savedState) {
                try {
                    const parsed = JSON.parse(savedState);
                    this.state = { ...this.state, ...parsed };
                } catch (e) {
                    console.warn('Failed to load sidebar state:', e);
                }
            }
        }
    }

    saveState() {
        if (this.hasAttribute('remember-state')) {
            const stateToSave = {
                collapsed: this.state.collapsed,
                searchQuery: this.state.searchQuery,
                expandedItems: this.state.expandedItems
            };
            localStorage.setItem(`sc-sidebar-${this.id || 'default'}`, JSON.stringify(stateToSave));
        }
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.render();
            this.setupEventListeners();
        }
    }

    connectedCallback() {
        this.loadState();
    }

    disconnectedCallback() {
        this.saveState();
    }
}

class ScSidebarItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.expanded = false;
    this.init();
  }

  static get observedAttributes() {
    return ["key", "text", "icon", "description", "behavior"];
  }

  init() {
    this.analyzeItemCapabilities();
    this.render();
    this.setupEventListeners();
  }

  analyzeItemCapabilities() {
    // تحلیل قابلیت‌های آیتم بر اساس محتوا و رفتار
    const hasChildren = this.querySelectorAll("sc-sidebar-item").length > 0;
    const behavior = this.getAttribute("behavior");

    // اگر آیتم زیرمجموعه داره، قابل باز شدن هست
    if (hasChildren) {
      this.setAttribute("data-has-children", "true");
      this.setAttribute("data-expandable", "true");
    }

    // اگر behavior مشخص نشده، هوشمندانه تشخیص بده
    if (!behavior) {
      if (hasChildren) {
        this.setAttribute("behavior", "expandable");
      } else {
        this.setAttribute("behavior", "clickable");
      }
    }
  }

  render() {
    const key = this.getAttribute("key") || "";
    const text = this.getAttribute("text") || "";
    const icon = this.getAttribute("icon") || "fas fa-circle";
    const description = this.getAttribute("description") || "";
    const behavior = this.getAttribute("behavior") || "clickable";

    // هوشمندانه تشخیص بده که آیا این آیتم قابل باز شدن هست یا نه
    const hasChildren = this.querySelectorAll("sc-sidebar-item").length > 0;
    const isExpandable = hasChildren || behavior === "expandable";
    const isClickable =
      behavior === "clickable" || (!hasChildren && behavior !== "expandable");

    this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="/../../assets/libs/font-awesome/fontawsome.min.css">
            <style>
                /* Sidebar Item Styles */
                .sc-sidebar-item {
                    display: flex;
                    align-items: center;
                    padding: 12px 20px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    border: none;
                    background: none;
                    width: 100%;
                    text-align: left;
                    color: inherit;
                    font-family: inherit;
                    font-size: 14px;
                    position: relative;
                }
                
                .sc-sidebar-item:hover {
                    background: #f5f5f5;
                }
                
                .sc-sidebar-item.active {
                    background: #e3f2fd;
                    color: #1976d2;
                }
                
                /* آیتم‌های قابل باز شدن */
                .sc-sidebar-item[data-expandable="true"] {
                    cursor: pointer;
                }
                
                /* آیتم‌های قابل کلیک */
                .sc-sidebar-item[data-clickable="true"] {
                    cursor: pointer;
                }
                
                /* آیتم‌های غیرفعال */
                .sc-sidebar-item[data-clickable="false"][data-expandable="false"] {
                    cursor: default;
                    opacity: 0.6;
                }
                
                .sc-sidebar-item .sc-item-icon {
                    width: 20px;
                    margin-right: 12px;
                    text-align: center;
                    font-size: 16px;
                    flex-shrink: 0;
                }
                
                .sc-sidebar-item .sc-item-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                }
                
                .sc-sidebar-item .sc-item-text {
                    font-weight: 500;
                    margin-bottom: 2px;
                }
                
                .sc-sidebar-item .sc-item-description {
                    font-size: 12px;
                    color: #666;
                    opacity: 0.8;
                }
                
                .sc-sidebar-item .sc-item-arrow {
                    margin-left: auto;
                    transition: all 0.3s ease;
                    font-size: 12px;
                }
                
                .sc-sidebar-item.expanded .sc-item-arrow {
                    transform: rotate(90deg);
                }
                
                /* Nested items */
                .sc-nested-items {
                    max-height: 0;
                    overflow: hidden;
                    transition: max-height 0.3s ease, opacity 0.3s ease, transform 0.3s ease, padding 0.3s ease;
                    background: rgba(0, 0, 0, 0.02);
                    opacity: 0;
                    transform: translateY(-10px);
                    padding: 0;
                }
                
                .sc-sidebar-item.expanded .sc-nested-items {
                    max-height: 1000px;
                    opacity: 1;
                    transform: translateY(0);
                    padding: 5px 0;
                }
                
                .sc-nested-items .sc-sidebar-item {
                    padding-left: 40px;
                    font-size: 13px;
                }
                
                .sc-nested-items .sc-sidebar-item .sc-item-icon {
                    font-size: 14px;
                }
            </style>
            
            <button class="sc-sidebar-item ${this.expanded ? "expanded" : ""}" 
                    data-key="${key}"
                    data-behavior="${behavior}"
                    data-expandable="${isExpandable}"
                    data-clickable="${isClickable}">
                
                <i class="sc-item-icon ${icon}"></i>
                
                <div class="sc-item-content">
                    <div class="sc-item-text">${text}</div>
                    ${
                      description
                        ? `<div class="sc-item-description">${description}</div>`
                        : ""
                    }
                </div>
                
                ${
                  isExpandable
                    ? `
                    <i class="sc-item-arrow fas fa-chevron-right"></i>
                `
                    : ""
                }
            </button>
            
            ${
              isExpandable
                ? `
                <div class="sc-nested-items">
                    <slot></slot>
                </div>
            `
                : ""
            }
        `;
  }

  setupEventListeners() {
     // اگر قبلاً listener اضافه شده، دوباره اضافه نشود
    if (this._listenersSetup) return;
    this._listenersSetup = true;

    // Event Delegation: یک listener روی کل shadowRoot
    this.shadowRoot.addEventListener('click', (e) => {
        // نزدیک‌ترین button با کلاس sc-sidebar-item پیدا شود
        const button = e.target.closest('.sc-sidebar-item');
        if (!button) return;

        // صدا زدن هندلر شما با خود button و ایونت
        this.handleClick(button, e);
    });
  }

  handleClick(button, e) {
    e.preventDefault();
    const isExpandable = button.dataset.expandable === "true";
    const isClickable = button.dataset.clickable === "true";

    // هوشمندانه تصمیم بگیر که چه کاری انجام بده
    if (isExpandable && this.querySelectorAll("sc-sidebar-item").length > 0) {
      this.toggleExpand();
    } else if (isClickable) {
      this.handleClickable();
    }

    // Dispatch custom event
    this.dispatchEvent(
      new CustomEvent("sidebar-item-click", {
        detail: {
          key: this.getAttribute("key"),
          text: this.getAttribute("text"),
          behavior: this.getAttribute("behavior"),
        },
        bubbles: true,
      })
    );
  }

  toggleExpand() {
    this.expanded = !this.expanded;
    this.render();
    this.setupEventListeners();

    // Update parent sidebar state
    const sidebar = this.closest("sc-sidebar");
    if (sidebar && sidebar.hasAttribute("remember-state")) {
      const key = this.getAttribute("key");
      if (this.expanded) {
        if (!sidebar.state.expandedItems.includes(key)) {
          sidebar.state.expandedItems.push(key);
        }
      } else {
        sidebar.state.expandedItems = sidebar.state.expandedItems.filter(
          (item) => item !== key
        );
      }
      sidebar.saveState();
    }
  }

  expand() {
    this.expanded = true;
    this.render();
    this.setupEventListeners();
  }

  collapse() {
    this.expanded = false;
    this.render();
    this.setupEventListeners();
  }

  handleClickable() {
    // Add active state
    const items =
      this.closest("sc-sidebar").querySelectorAll("sc-sidebar-item");
    items.forEach((item) => item.removeActive());
    this.addActive();
  }

  addActive() {
    const button = this.shadowRoot.querySelector(".sc-sidebar-item");
    if (button) {
      button.classList.add("active");
    }
  }

  removeActive() {
    const button = this.shadowRoot.querySelector(".sc-sidebar-item");
    if (button) {
      button.classList.remove("active");
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.render();
      this.setupEventListeners();
    }
  }

  connectedCallback() {
    // Validate parent
    const parentSidebar = this.closest("sc-sidebar");
    if (!parentSidebar) {
      console.error("sc-sidebar-item must be used inside sc-sidebar");
      this.style.display = "none";
      return;
    }

    this.style.display = "block";

    // اگر آیتم‌های جدید اضافه شدن، قابلیت‌ها رو دوباره تحلیل کن
    setTimeout(() => {
      this.analyzeItemCapabilities();
      this.render();
    }, 0);
  }
}

// Register the custom elements
customElements.define('sc-sidebar', ScSidebar);
customElements.define('sc-sidebar-item', ScSidebarItem);
