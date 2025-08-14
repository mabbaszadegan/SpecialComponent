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
            <link rel="stylesheet" href="../../sidebar.css">
            
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
            <link rel="stylesheet" href="../../sidebar.css">
            
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
