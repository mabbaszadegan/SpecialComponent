// Enhanced Auto-Layout Sidebar Component
// Automatically adjusts adjacent sections based on sidebar width and position
// No additional CSS or JS required from users

class EnhancedAutoLayoutSidebar extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: "closed" });
    this._state = {
      collapsed: false,
      mobileOpen: false,
      searchQuery: "",
      expandedItems: [],
      autoLayoutEnabled: true
    };
    
    this._layoutManager = new SidebarLayoutManager(this);
    this._init();
  }

  static get observedAttributes() {
    return [
      "theme", "position", "width", "collapsible", "show-header", 
      "show-footer", "searchable", "animations", "responsive", 
      "remember-state", "auto-layout"
    ];
  }

  // Public API Methods
  toggleCollapse() {
    this._toggleCollapse();
  }

  openMobile() {
    this._openMobile();
  }

  closeMobile() {
    this._closeMobile();
  }

  updateItems(items) {
    this._updateItems(items);
  }

  // Auto-layout methods
  enableAutoLayout() {
    this._state.autoLayoutEnabled = true;
    this._layoutManager.enable();
  }

  disableAutoLayout() {
    this._state.autoLayoutEnabled = false;
    this._layoutManager.disable();
  }

  updateLayout() {
    if (this._state.autoLayoutEnabled) {
      this._layoutManager.updateLayout();
    }
  }

  getLayoutInfo() {
    return this._layoutManager.getLayoutInfo();
  }

  // Private methods
  _init() {
    this._loadState();
    this._render();
    this._setupEventListeners();
    
    // Enable auto-layout by default
    if (this._state.autoLayoutEnabled) {
      this._layoutManager.enable();
    }
  }

  _getStyles() {
    return `
      <style>
        :host {
          --sc-light-bg: #ffffff;
          --sc-light-text: #333333;
          --sc-light-border: #e0e0e0;
          --sc-light-hover: #f5f5f5;
          --sc-light-active: #e3f2fd;
          --sc-light-shadow: rgba(0, 0, 0, 0.1);
          
          --sc-dark-bg: #2c3e50;
          --sc-dark-text: #ecf0f1;
          --sc-dark-border: #34495e;
          --sc-dark-hover: #34495e;
          --sc-dark-active: #3498db;
          --sc-dark-shadow: rgba(0, 0, 0, 0.3);
          
          --sc-transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          --sc-border-radius: 8px;
          --sc-font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          
          --sc-sidebar-width: 280px;
          --sc-sidebar-collapsed-width: 60px;
          
          display: block;
          min-height: 100vh;
          width: 100%;
          position: relative;
          top: 0;
          z-index: 1000;
        }

        .sc-sidebar {
          display: flex;
          flex-direction: column;
          height: 100vh;
          background: var(--sc-light-bg);
          color: var(--sc-light-text);
          border: 1px solid var(--sc-light-border);
          box-shadow: 0 2px 10px var(--sc-light-shadow);
          font-family: var(--sc-font-family);
          overflow: hidden;
          top: 0;
          z-index: 1000;
          
          flex: 0 0 var(--sc-sidebar-width);
          width: var(--sc-sidebar-width);
          min-width: var(--sc-sidebar-width);
          max-width: var(--sc-sidebar-width);
          
          transition: 
            flex-basis var(--sc-transition),
            width var(--sc-transition),
            min-width var(--sc-transition),
            max-width var(--sc-transition),
            transform var(--sc-transition),
            box-shadow var(--sc-transition);
          
          will-change: flex-basis, width;
          position: fixed;
          left: 0;
          right: auto;
        }
        
        .sc-sidebar[position="left"] {
          border-right: 1px solid var(--sc-light-border);
          left: 0;
          right: auto;
        }

        .sc-sidebar[position="right"] {
          border-left: 1px solid var(--sc-light-border);
          right: 0;
          left: auto;
        }

        .sc-sidebar[theme="dark"] {
          background: var(--sc-dark-bg);
          color: var(--sc-dark-text);
          border-color: var(--sc-dark-border);
          box-shadow: 0 2px 10px var(--sc-dark-shadow);
        }

        .sc-sidebar.collapsed {
          flex-basis: var(--sc-sidebar-collapsed-width);
          width: var(--sc-sidebar-collapsed-width) !important;
          min-width: var(--sc-sidebar-collapsed-width);
          max-width: var(--sc-sidebar-collapsed-width);
        }

        .sc-sidebar-header {
          padding: 20px;
          border-bottom: 1px solid var(--sc-light-border);
          background: var(--sc-light-bg);
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 60px;
          transition: 
            opacity var(--sc-transition),
            transform var(--sc-transition),
            visibility var(--sc-transition);
        }

        .sc-sidebar-header h3 {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          transition: 
            opacity var(--sc-transition),
            transform var(--sc-transition),
            visibility var(--sc-transition);
          opacity: 1;
          transform: translateX(0);
          visibility: visible;
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
          transform: scale(1.1);
        }

        .sc-sidebar-search {
          padding: 15px 20px;
          border-bottom: 1px solid var(--sc-light-border);
          transition: 
            opacity var(--sc-transition),
            transform var(--sc-transition),
            visibility var(--sc-transition);
          opacity: 1;
          transform: translateX(0);
          visibility: visible;
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

        .sc-sidebar-search input:focus {
          outline: none;
          border-color: #3498db;
          box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.2);
        }

        .sc-sidebar-content {
          flex: 1;
          overflow-y: auto;
          padding: 10px 0;
          transition: var(--sc-transition);
        }

        .sc-sidebar-footer {
          padding: 20px;
          border-top: 1px solid var(--sc-light-border);
          background: var(--sc-light-bg);
          text-align: center;
          font-size: 12px;
          color: #666;
          transition: 
            opacity var(--sc-transition),
            transform var(--sc-transition),
            visibility var(--sc-transition);
          opacity: 1;
          transform: translateX(0);
          visibility: visible;
        }

        .sc-sidebar.collapsed .sc-sidebar-header h3,
        .sc-sidebar.collapsed .sc-sidebar-search,
        .sc-sidebar.collapsed .sc-sidebar-footer {
          opacity: 0;
          transform: translateX(-20px);
          visibility: hidden;
          pointer-events: none;
        }

        .sc-sidebar.collapsed .sc-nested-items {
          display: none !important;
        }

        .sc-sidebar.collapsed .sc-sidebar-search input {
          opacity: 0;
          visibility: hidden;
          pointer-events: none;
        }

        .sc-sidebar.collapsed .sc-toggle-btn {
          justify-content: center;
          width: 100%;
        }

        @media (max-width: 768px) {
          .sc-sidebar {
            position: fixed;
            top: 0;
            z-index: 1000;
            transition: transform var(--sc-transition);
          }
          
          .sc-sidebar[position="left"] {
            left: 0;
            right: auto;
            transform: translateX(-100%);
          }
          
          .sc-sidebar[position="right"] {
            right: 0;
            left: auto;
            transform: translateX(100%);
          }
          
          .sc-sidebar.mobile-open {
            transform: translateX(0);
          }
          
          :host {
            display: block;
          }
        }

        .sc-hidden {
          display: none !important;
        }

        .sc-visible {
          display: block !important;
        }

        .sc-sidebar * {
          transition: var(--sc-transition);
        }

        .sc-sidebar {
          will-change: flex-basis, width;
        }

        .sc-sidebar.transitioning {
          pointer-events: none;
        }

        .sc-sidebar.transitioning * {
          pointer-events: none;
        }

        .sc-sidebar-overlay {
          position: fixed;
          top: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          opacity: 0;
          visibility: hidden;
          transition: var(--sc-transition);
          pointer-events: none;
        }

        .sc-sidebar-overlay.visible {
          opacity: 1;
          visibility: visible;
          pointer-events: auto;
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
          transform: translateX(5px);
        }

        .sc-sidebar-item.active {
          background: var(--sc-light-active);
          color: #1976d2;
        }

        .sc-sidebar-item .sc-item-icon {
          width: 20px;
          margin-right: 12px;
          text-align: center;
          font-size: 16px;
          flex-shrink: 0;
          transition: var(--sc-transition);
        }

        .sc-sidebar-item .sc-item-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          transition: 
            opacity var(--sc-transition),
            transform var(--sc-transition),
            visibility var(--sc-transition);
          opacity: 1;
          transform: translateX(0);
          visibility: visible;
        }

        .sc-sidebar-item .sc-item-text {
          font-weight: 500;
          margin-bottom: 2px;
          transition: var(--sc-transition);
        }

        .sc-sidebar-item .sc-item-description {
          font-size: 12px;
          color: #666;
          opacity: 0.8;
          transition: var(--sc-transition);
        }

        .sc-sidebar-item .sc-item-arrow {
          margin-left: auto;
          transition: var(--sc-transition);
          font-size: 12px;
        }

        .sc-sidebar-item.expanded .sc-item-arrow {
          transform: rotate(90deg);
        }

        .sc-nested-items {
          max-height: 0;
          overflow: hidden;
          transition: 
            max-height var(--sc-transition),
            opacity var(--sc-transition),
            transform var(--sc-transition),
            padding var(--sc-transition);
          background: rgba(0, 0, 0, 0.02);
          opacity: 0;
          transform: translateY(-10px);
          padding: 0;
          margin: 0;
          border: none;
        }

        .sc-nested-items.expanded {
          max-height: 500px;
          opacity: 1;
          transform: translateY(0);
          padding: 5px 0;
        }

        .sc-nested-items .sc-sidebar-item {
          padding-left: 40px;
          font-size: 13px;
          margin: 0;
          border: none;
        }

        .sc-sidebar.collapsed .sc-sidebar-item {
          padding: 15px 0;
          justify-content: center;
          text-align: center;
          min-height: 50px;
          display: flex;
          align-items: center;
        }

        .sc-sidebar.collapsed .sc-sidebar-item .sc-item-icon {
          margin: 0;
          font-size: 18px;
          transition: var(--sc-transition);
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sc-sidebar.collapsed .sc-sidebar-item {
          position: relative;
        }

        .sc-sidebar.collapsed .sc-sidebar-item::after {
          content: attr(data-tooltip);
          position: absolute;
          left: 100%;
          top: 50%;
          transform: translateY(-50%);
          background: var(--sc-light-bg);
          color: var(--sc-light-text);
          padding: 8px 12px;
          border-radius: var(--sc-border-radius);
          box-shadow: 0 2px 10px var(--sc-light-shadow);
          font-size: 12px;
          white-space: nowrap;
          opacity: 0;
          visibility: hidden;
          transition: var(--sc-transition);
          z-index: 1001;
          margin-left: 10px;
          pointer-events: none;
        }

        .sc-sidebar.collapsed .sc-sidebar-item:hover::after {
          opacity: 1;
          visibility: visible;
        }

        .sc-sidebar-item:hover .sc-item-icon {
          transform: scale(1.1);
        }

        .sc-sidebar-item:hover .sc-item-text {
          transform: translateX(3px);
        }

        .sc-sidebar-item:focus {
          outline: 2px solid #3498db;
          outline-offset: 2px;
        }

        .sc-sidebar-item:focus .sc-item-icon {
          transform: scale(1.1);
        }

        .sc-nested-items {
          will-change: max-height, opacity, transform;
        }
      </style>
    `;
  }

  _render() {
    const theme = this.getAttribute("theme") || "light";
    const position = this.getAttribute("position") || "left";
    const width = this.getAttribute("width") || "250px";
    const showHeader = this.hasAttribute("show-header");
    const showFooter = this.hasAttribute("show-footer");
    const searchable = this.hasAttribute("searchable");
    const collapsible = this.hasAttribute("collapsible");

    this._shadow.innerHTML = `
      ${this._getStyles()}
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/7.0.0/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer" />
      
      <div class="sc-sidebar ${
        this._state.collapsed ? "collapsed" : ""
      } ${this._state.mobileOpen ? "mobile-open" : ""}" 
           theme="${theme}" 
           position="${position}" 
           style="width: ${width};">
          
          ${
            showHeader
              ? `
              <div class="sc-sidebar-header">
                  <h3>${this.getAttribute("title") || "Sidebar"}</h3>
                  ${
                    collapsible
                      ? `
                      <button class="sc-toggle-btn" id="toggleBtn">
                          <i class="fas fa-${
                            this._state.collapsed ? "bars" : "times"
                          }"></i>
                      </button>
                  `
                      : ""
                  }
              </div>
          `
              : ""
          }
          
          ${
            searchable
              ? `
              <div class="sc-sidebar-search">
                  <input type="text" 
                         id="searchInput" 
                         placeholder="Search..." 
                         value="${this._state.searchQuery}">
              </div>
          `
              : ""
          }
          
          <div class="sc-sidebar-content" id="sidebarContent">
              <slot></slot>
          </div>
          
          ${
            showFooter
              ? `
              <div class="sc-sidebar-footer">
                  <span>© 2024 Enhanced Sidebar Component</span>
              </div>
          `
              : ""
          }
      </div>
      
      ${
        this.hasAttribute("responsive")
          ? `
          <div class="sc-sidebar-overlay" id="overlay"></div>
      `
          : ""
      }
    `;
  }

  _setupEventListeners() {
    // Toggle button
    const toggleBtn = this._shadow.getElementById("toggleBtn");
    if (toggleBtn) {
      if (this._toggleHandler) {
        toggleBtn.removeEventListener("click", this._toggleHandler);
      }
      this._toggleHandler = () => this._toggleCollapse();
      toggleBtn.addEventListener("click", this._toggleHandler);
    }

    // Search functionality
    const searchInput = this._shadow.getElementById("searchInput");
    if (searchInput) {
      if (this._searchHandler) {
        searchInput.removeEventListener("input", this._searchHandler);
      }
      this._searchHandler = (e) => this._handleSearch(e.target.value);
      searchInput.addEventListener("input", this._searchHandler);
    }

    // Mobile overlay
    const overlay = this._shadow.getElementById("overlay");
    if (overlay) {
      if (this._overlayHandler) {
        overlay.removeEventListener("click", this._overlayHandler);
      }
      this._overlayHandler = () => this._closeMobile();
      overlay.addEventListener("click", this._overlayHandler);
    }

    // Handle slot changes
    const slot = this._shadow.querySelector("slot");
    if (slot) {
      if (this._slotHandler) {
        slot.removeEventListener("slotchange", this._slotHandler);
      }
      this._slotHandler = () => this._handleSlotChange();
      slot.addEventListener("slotchange", this._slotHandler);
    }

    // Keyboard navigation
    if (this._keyboardHandler) {
      this.removeEventListener("keydown", this._keyboardHandler);
    }
    this._keyboardHandler = (e) => this._handleKeyboard(e);
    this.addEventListener("keydown", this._keyboardHandler);
  }

  _handleSlotChange() {
    const items = this.querySelectorAll("sc-sidebar-item");
    this._refreshItemCapabilities();
    
    items.forEach((item) => {
      if (item.key && this._state.expandedItems.includes(item.key)) {
        item.expand();
      }
    });
  }

  _handleSearch(query) {
    this._state.searchQuery = query;
    const items = this.querySelectorAll("sc-sidebar-item");

    items.forEach((item) => {
      const text = item.getAttribute("text") || "";
      const description = item.getAttribute("description") || "";
      const matches =
        query === "" ||
        text.toLowerCase().includes(query.toLowerCase()) ||
        description.toLowerCase().includes(query.toLowerCase());

      if (matches) {
        item.classList.remove("sc-hidden");
      } else {
        item.classList.add("sc-hidden");
      }
    });

    this._saveState();
  }

  _refreshItemCapabilities() {
    this.querySelectorAll("sc-sidebar-item").forEach((item) => {
      if (
        item._analyzeItemCapabilities &&
        typeof item._analyzeItemCapabilities === "function"
      ) {
        item._analyzeItemCapabilities();
        item._updateCapabilities();
      }
    });
  }

  _toggleCollapse() {
    this._state.collapsed = !this._state.collapsed;
    this.classList.add("transitioning");

    if (this._state.collapsed) {
      this.classList.add("collapsed");
    } else {
      this.classList.remove("collapsed");
    }

    const sidebarElement = this._shadow.querySelector(".sc-sidebar");
    if (sidebarElement) {
      sidebarElement.classList.toggle("collapsed", this._state.collapsed);
    }

    const sidebarItemElements = this.querySelectorAll("sc-sidebar-item");
    sidebarItemElements.forEach((element) => {
      element._shadow
        .querySelector(".sc-item-content")
        .classList.toggle("sc-hidden", this._state.collapsed);
    });

    const toggleBtn = this._shadow.querySelector("#toggleBtn");
    if (toggleBtn) {
      const icon = toggleBtn.querySelector("i");
      if (icon) {
        icon.className = `fas fa-${this._state.collapsed ? "bars" : "times"}`;
      }
    }

    // Update layout automatically
    this.updateLayout();

    this._saveState();

    setTimeout(() => {
      this.classList.remove("transitioning");
    }, 400);
  }

  _closeMobile() {
    this._state.mobileOpen = false;
    const sidebarElement = this._shadow.querySelector(".sc-sidebar");
    if (sidebarElement) {
      sidebarElement.classList.remove("mobile-open");
    }

    const overlay = this._shadow.getElementById("overlay");
    if (overlay) {
      overlay.classList.remove("visible");
    }

    this._updateMobileLayout();
  }

  _openMobile() {
    this._state.mobileOpen = true;
    const sidebarElement = this._shadow.querySelector(".sc-sidebar");
    if (sidebarElement) {
      sidebarElement.classList.add("mobile-open");
    }

    const overlay = this._shadow.getElementById("overlay");
    if (overlay) {
      overlay.classList.add("visible");
    }

    this._updateMobileLayout();
  }

  _updateMobileLayout() {
    if (this._state.autoLayoutEnabled) {
      this._layoutManager.updateMobileLayout();
    }
  }

  _handleKeyboard(e) {
    switch (e.key) {
      case "Escape":
        if (this._state.mobileOpen) this._closeMobile();
        break;
      case "Enter":
        if (e.target.classList.contains("sc-sidebar-item")) {
          e.target.click();
        }
        break;
    }
  }

  _loadState() {
    if (this.hasAttribute("remember-state")) {
      const savedState = localStorage.getItem(
        `sc-sidebar-${this.id || "default"}`
      );
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          this._state = { ...this._state, ...parsed };
        } catch (e) {
          console.warn("Failed to load sidebar state:", e);
        }
      }
    }
  }

  _saveState() {
    if (this.hasAttribute("remember-state")) {
      const stateToSave = {
        collapsed: this._state.collapsed,
        searchQuery: this._state.searchQuery,
        expandedItems: this._state.expandedItems,
      };
      localStorage.setItem(
        `sc-sidebar-${this.id || "default"}`,
        JSON.stringify(stateToSave)
      );
    }
  }

  _updateItems(items) {
    console.log("Updating sidebar items:", items);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      if (name === "auto-layout") {
        if (newValue === "false") {
          this.disableAutoLayout();
        } else {
          this.enableAutoLayout();
        }
      } else {
        this._render();
        this._setupEventListeners();
      }
    }
  }

  connectedCallback() {
    this._loadState();
    
    // Check if auto-layout should be enabled
    if (this.hasAttribute("auto-layout") && this.getAttribute("auto-layout") === "false") {
      this.disableAutoLayout();
    } else {
      this.enableAutoLayout();
    }
  }

  disconnectedCallback() {
    this._saveState();
    
    if (this._toggleHandler) {
      const toggleBtn = this._shadow.getElementById("toggleBtn");
      if (toggleBtn) toggleBtn.removeEventListener("click", this._toggleHandler);
    }
    if (this._searchHandler) {
      const searchInput = this._shadow.getElementById("searchInput");
      if (searchInput) searchInput.removeEventListener("input", this._searchHandler);
    }
    if (this._overlayHandler) {
      const overlay = this._shadow.getElementById("overlay");
      if (overlay) overlay.removeEventListener("click", this._overlayHandler);
    }
    if (this._slotHandler) {
      const slot = this._shadow.querySelector("slot");
      if (slot) slot.removeEventListener("slotchange", this._slotHandler);
    }
    if (this._keyboardHandler) {
      this.removeEventListener("keydown", this._keyboardHandler);
    }
    
    this._layoutManager.cleanup();
  }
}

// Sidebar Layout Manager - Handles automatic layout adjustments
class SidebarLayoutManager {
  constructor(sidebar) {
    this.sidebar = sidebar;
    this.enabled = false;
    this.resizeObserver = null;
    this.mutationObserver = null;
    this.resizeTimeout = null;
    this.layoutElements = new Set();
  }

  enable() {
    if (this.enabled) return;
    
    this.enabled = true;
    this._setupResizeObserver();
    this._setupMutationObserver();
    this._setupGlobalStyles();
    this.updateLayout();
    
    console.log('Sidebar auto-layout enabled');
  }

  disable() {
    if (!this.enabled) return;
    
    this.enabled = false;
    this._cleanupResizeObserver();
    this._cleanupMutationObserver();
    this._removeGlobalStyles();
    this._resetLayouts();
    
    console.log('Sidebar auto-layout disabled');
  }

  updateLayout() {
    if (!this.enabled) return;
    
    const layoutInfo = this.getLayoutInfo();
    this._applyLayoutToElements(layoutInfo);
    this._updateCSSVariables(layoutInfo);
    this._dispatchLayoutEvent(layoutInfo);
  }

  updateMobileLayout() {
    if (!this.enabled) return;
    
    const isMobile = window.innerWidth <= 768;
    const layoutInfo = this.getLayoutInfo();
    
    if (isMobile) {
      // Reset margins on mobile
      this._resetMobileLayouts();
    } else {
      // Restore desktop layout
      this.updateLayout();
    }
  }

  getLayoutInfo() {
    const position = this.sidebar.getAttribute("position") || "left";
    const isCollapsed = this.sidebar._state.collapsed;
    const sidebarWidth = isCollapsed ? 60 : 280;
    
    return {
      position: position,
      collapsed: isCollapsed,
      width: sidebarWidth,
      marginLeft: position === "left" ? sidebarWidth : 0,
      marginRight: position === "right" ? sidebarWidth : 0,
      isMobile: window.innerWidth <= 768
    };
  }

  _setupResizeObserver() {
    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver((entries) => {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
          this.updateLayout();
        }, 100);
      });
      
      this.resizeObserver.observe(this.sidebar);
    } else {
      // Fallback for older browsers
      window.addEventListener('resize', () => {
        clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
          this.updateLayout();
        }, 100);
      });
    }
  }

  _setupMutationObserver() {
    this.mutationObserver = new MutationObserver((mutations) => {
      let shouldUpdateLayout = false;
      
      mutations.forEach((mutation) => {
        if (mutation.type === 'attributes') {
          const attributeName = mutation.attributeName;
          if (['position', 'width', 'theme'].includes(attributeName)) {
            shouldUpdateLayout = true;
          }
        }
      });
      
      if (shouldUpdateLayout) {
        this.updateLayout();
      }
    });
    
    this.mutationObserver.observe(this.sidebar, {
      attributes: true,
      attributeFilter: ['position', 'width', 'theme']
    });
  }

  _setupGlobalStyles() {
    // Add global CSS for auto-layout
    if (!document.getElementById('sidebar-auto-layout-styles')) {
      const style = document.createElement('style');
      style.id = 'sidebar-auto-layout-styles';
      style.textContent = `
        /* Auto-layout styles for sidebar */
        .sidebar-auto-layout {
          transition: margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1), 
                     margin-right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .sidebar-auto-layout-left {
          margin-left: var(--sidebar-margin-left, 280px);
          margin-right: 0;
        }
        
        .sidebar-auto-layout-right {
          margin-right: var(--sidebar-margin-right, 280px);
          margin-left: 0;
        }
        
        .sidebar-auto-layout-collapsed-left {
          margin-left: var(--sidebar-margin-left-collapsed, 60px);
          margin-right: 0;
        }
        
        .sidebar-auto-layout-collapsed-right {
          margin-right: var(--sidebar-margin-right-collapsed, 60px);
          margin-left: 0;
        }
        
        /* Grid layout support */
        .sidebar-grid-layout {
          display: grid;
          transition: grid-template-columns 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .sidebar-grid-layout-left {
          grid-template-columns: var(--sidebar-width, 280px) 1fr;
        }
        
        .sidebar-grid-layout-right {
          grid-template-columns: 1fr var(--sidebar-width, 280px);
        }
        
        .sidebar-grid-layout-left.collapsed {
          grid-template-columns: var(--sidebar-width-collapsed, 60px) 1fr;
        }
        
        .sidebar-grid-layout-right.collapsed {
          grid-template-columns: 1fr var(--sidebar-width-collapsed, 60px);
        }
        
        /* Flexbox layout support */
        .sidebar-flex-layout {
          display: flex;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .sidebar-flex-layout .sidebar-content {
          flex: 1;
          transition: margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1), 
                     margin-right 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        /* Mobile responsive */
        @media (max-width: 768px) {
          .sidebar-auto-layout-left,
          .sidebar-auto-layout-right,
          .sidebar-auto-layout-collapsed-left,
          .sidebar-auto-layout-collapsed-right {
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
          
          .sidebar-grid-layout,
          .sidebar-grid-layout-left,
          .sidebar-grid-layout-right {
            grid-template-columns: 1fr !important;
          }
          
          .sidebar-flex-layout {
            flex-direction: column;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }

  _applyLayoutToElements(layoutInfo) {
    // Find all adjacent elements that need layout adjustment
    const adjacentElements = this._findAdjacentElements();
    
    adjacentElements.forEach(element => {
      this._applyLayoutToElement(element, layoutInfo);
    });
  }

  _findAdjacentElements() {
    const adjacentElements = [];
    const position = this.sidebar.getAttribute("position") || "left";
    
    // Find the next sibling element
    let nextSibling = this.sidebar.nextElementSibling;
    if (nextSibling) {
      adjacentElements.push(nextSibling);
    }
    
    // Find elements with specific classes that commonly need layout adjustment
    const commonLayoutClasses = [
      '.main-content', '.content', '.page-content', '.app-content',
      '.container', '.wrapper', '.main', '.page', '.app-main',
      '.sidebar-content', '.sidebar-main', '.app-container'
    ];
    
    commonLayoutClasses.forEach(className => {
      const elements = document.querySelectorAll(className);
      elements.forEach(element => {
        if (!adjacentElements.includes(element)) {
          adjacentElements.push(element);
        }
      });
    });
    
    // Find elements that are direct children of body or main containers
    const bodyChildren = Array.from(document.body.children);
    bodyChildren.forEach(child => {
      if (child !== this.sidebar && 
          !child.classList.contains('sc-sidebar') &&
          !child.classList.contains('sc-sidebar-item') &&
          child.tagName !== 'SCRIPT' &&
          child.tagName !== 'STYLE') {
        adjacentElements.push(child);
      }
    });
    
    return adjacentElements;
  }

  _applyLayoutToElement(element, layoutInfo) {
    // Add auto-layout class if not present
    if (!element.classList.contains('sidebar-auto-layout')) {
      element.classList.add('sidebar-auto-layout');
    }
    
    // Remove previous layout classes
    element.classList.remove(
      'sidebar-auto-layout-left',
      'sidebar-auto-layout-right',
      'sidebar-auto-layout-collapsed-left',
      'sidebar-auto-layout-collapsed-right'
    );
    
    // Apply appropriate layout class
    if (layoutInfo.position === "left") {
      if (layoutInfo.collapsed) {
        element.classList.add('sidebar-auto-layout-collapsed-left');
      } else {
        element.classList.add('sidebar-auto-layout-left');
      }
    } else if (layoutInfo.position === "right") {
      if (layoutInfo.collapsed) {
        element.classList.add('sidebar-auto-layout-collapsed-right');
      } else {
        element.classList.add('sidebar-auto-layout-right');
      }
    }
    
    // Store reference to this element
    this.layoutElements.add(element);
  }

  _updateCSSVariables(layoutInfo) {
    const root = document.documentElement;
    
    if (layoutInfo.position === "left") {
      root.style.setProperty('--sidebar-width', `${layoutInfo.width}px`);
      root.style.setProperty('--sidebar-margin-left', `${layoutInfo.width}px`);
      root.style.setProperty('--sidebar-margin-left-collapsed', '60px');
      root.style.setProperty('--sidebar-margin-right', '0px');
      root.style.setProperty('--sidebar-margin-right-collapsed', '0px');
    } else if (layoutInfo.position === "right") {
      root.style.setProperty('--sidebar-width', `${layoutInfo.width}px`);
      root.style.setProperty('--sidebar-margin-left', '0px');
      root.style.setProperty('--sidebar-margin-left-collapsed', '0px');
      root.style.setProperty('--sidebar-margin-right', `${layoutInfo.width}px`);
      root.style.setProperty('--sidebar-margin-right-collapsed', '60px');
    }
    
    root.style.setProperty('--sidebar-width-collapsed', '60px');
  }

  _resetLayouts() {
    this.layoutElements.forEach(element => {
      element.classList.remove(
        'sidebar-auto-layout',
        'sidebar-auto-layout-left',
        'sidebar-auto-layout-right',
        'sidebar-auto-layout-collapsed-left',
        'sidebar-auto-layout-collapsed-right'
      );
      element.style.marginLeft = '';
      element.style.marginRight = '';
    });
    this.layoutElements.clear();
  }

  _resetMobileLayouts() {
    this.layoutElements.forEach(element => {
      element.style.marginLeft = '0px';
      element.style.marginRight = '0px';
    });
  }

  _removeGlobalStyles() {
    const styleElement = document.getElementById('sidebar-auto-layout-styles');
    if (styleElement) {
      styleElement.remove();
    }
  }

  _dispatchLayoutEvent(layoutInfo) {
    this.sidebar.dispatchEvent(new CustomEvent('sidebar-layout-changed', {
      detail: layoutInfo,
      bubbles: true
    }));
  }

  _cleanupResizeObserver() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
      this.resizeObserver = null;
    }
  }

  _cleanupMutationObserver() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect();
      this.mutationObserver = null;
    }
  }

  cleanup() {
    this.disable();
    if (this.resizeTimeout) {
      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = null;
    }
  }
}

// Register the enhanced sidebar component
customElements.define("enhanced-auto-layout-sidebar", EnhancedAutoLayoutSidebar);

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { EnhancedAutoLayoutSidebar, SidebarLayoutManager };
}
