// Advanced Sidebar Web Components with Closed Shadow DOM Design
// <sc-sidebar> and <sc-sidebar-item> with improved performance and smooth animations

class ScSidebar extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: "closed" });
    this._state = {
      collapsed: false,
      mobileOpen: false,
      searchQuery: "",
      expandedItems: [],
    };
  
    this._init();
  }

  static get observedAttributes() {
    return [
      "theme",
      "position",
      "width",
      "collapsible",
      "show-header",
      "show-footer",
      "searchable",
      "animations",
      "responsive",
      "remember-state",
    ];
  }

  // Public API Methods - Only expose what's necessary
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

  // Private methods - All internal logic is private
  _init() {
    this._loadState();
    this._render();
    this._setupEventListeners();
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
            <style>
                /* CSS Variables for theming - defined locally for Shadow DOM compatibility */
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
                    --sc-transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    --sc-border-radius: 8px;
                    --sc-font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    
                    /* Layout dimensions */
                    --sc-sidebar-width: 280px;
                    --sc-sidebar-collapsed-width: 60px;
                }

                /* Sidebar Container - improved flexbox layout */
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
                  left: 0;
                  z-index: 1000;
                  
                  /* Use flex-basis for smooth width transitions */
                  flex: 0 0 var(--sc-sidebar-width);
                  width: var(--sc-sidebar-width);
                  min-width: var(--sc-sidebar-width);
                  max-width: var(--sc-sidebar-width);
                  
                  /* Smooth transitions for all properties */
                  transition: 
                    flex-basis var(--sc-transition),
                    width var(--sc-transition),
                    min-width var(--sc-transition),
                    max-width var(--sc-transition),
                    transform var(--sc-transition),
                    box-shadow var(--sc-transition);
                  
                  /* Prevent layout shifts */
                  will-change: flex-basis, width;
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
                  left: auto;
                  right: 0;
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
                  
                  /* Smooth transitions for content */
                  transition: 
                    opacity var(--sc-transition),
                    transform var(--sc-transition),
                    visibility var(--sc-transition);
                }

                .sc-sidebar[theme="dark"] .sc-sidebar-header {
                  border-bottom-color: var(--sc-dark-border);
                  background: var(--sc-dark-bg);
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

                .sc-sidebar[theme="dark"] .sc-sidebar-header .sc-toggle-btn:hover {
                  background: var(--sc-dark-hover);
                }

                /* Search */
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
                  transition: var(--sc-transition);
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
                  transition: 
                    opacity var(--sc-transition),
                    transform var(--sc-transition),
                    visibility var(--sc-transition);
                  opacity: 1;
                  transform: translateX(0);
                  visibility: visible;
                }

                .sc-sidebar[theme="dark"] .sc-sidebar-footer {
                  border-top-color: var(--sc-dark-border);
                  background: var(--sc-dark-bg);
                  color: #bdc3c7;
                }

                /* Collapsed state */
                .sc-sidebar.collapsed {
                  flex-basis: var(--sc-sidebar-collapsed-width);
                  width: var(--sc-sidebar-collapsed-width) !important;
                  min-width: var(--sc-sidebar-collapsed-width);
                  max-width: var(--sc-sidebar-collapsed-width);
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

                /* Responsive */
                @media (max-width: 768px) {
                  .sc-sidebar {
                    position: fixed;
                    top: 0;
                    left: 0;
                    z-index: 1000;
                    transform: translateX(-100%);
                    transition: transform var(--sc-transition);
                  }
                  
                  .sc-sidebar[position="right"] {
                    left: auto;
                    right: 0;
                    transform: translateX(100%);
                  }
                  
                  .sc-sidebar.mobile-open {
                    transform: translateX(0);
                  }
                }

                /* Utility classes */
                .sc-hidden {
                  display: none !important;
                }

                .sc-visible {
                  display: block !important;
                }

                /* Smooth transitions for all interactive elements */
                .sc-sidebar * {
                  transition: var(--sc-transition);
                }

                /* Prevent layout shifts during transitions */
                .sc-sidebar {
                  will-change: flex-basis, width;
                }

                /* Loading states for smooth transitions */
                .sc-sidebar.transitioning {
                  pointer-events: none;
                }

                .sc-sidebar.transitioning * {
                  pointer-events: none;
                }

                /* Mobile overlay */
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
                  pointer-events: none;
                }

                .sc-sidebar-overlay.visible {
                  opacity: 1;
                  visibility: visible;
                  pointer-events: auto;
                }
            </style>
            
            <div class="sc-sidebar ${this._state.collapsed ? "collapsed" : ""} ${
      this._state.mobileOpen ? "mobile-open" : ""
    }" 
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
                        <span>© 2024 Sidebar Component</span>
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
      // Remove existing listener if any
      if (this._toggleHandler) {
        toggleBtn.removeEventListener("click", this._toggleHandler);
      }
      this._toggleHandler = () => this._toggleCollapse();
      toggleBtn.addEventListener("click", this._toggleHandler);
    }

    // Search functionality
    const searchInput = this._shadow.getElementById("searchInput");
    if (searchInput) {
      // Remove existing listener if any
      if (this._searchHandler) {
        searchInput.removeEventListener("input", this._searchHandler);
      }
      this._searchHandler = (e) => this._handleSearch(e.target.value);
      searchInput.addEventListener("input", this._searchHandler);
    }

    // Mobile overlay
    const overlay = this._shadow.getElementById("overlay");
    if (overlay) {
      // Remove existing listener if any
      if (this._overlayHandler) {
        overlay.removeEventListener("click", this._overlayHandler);
      }
      this._overlayHandler = () => this._closeMobile();
      overlay.addEventListener("click", this._overlayHandler);
    }

    // Handle slot changes
    const slot = this._shadow.querySelector("slot");
    if (slot) {
      // Remove existing listener if any
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

    // Analyze capabilities of new items
    this._refreshItemCapabilities();

    // Restore expanded state for previously expanded items
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

      // Use CSS classes instead of changing display property
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
        // Don't re-render, just update attributes
        item._updateCapabilities();
      }
    });
  }

  _toggleCollapse() {
    // Toggle collapsed state
    this._state.collapsed = !this._state.collapsed;

    // Add transitioning class for smooth animations
    this.classList.add("transitioning");

    // Update the collapsed class on the sidebar element
    const sidebarElement = this._shadow.querySelector(".sc-sidebar");
    if (sidebarElement) {
      sidebarElement.classList.toggle("collapsed", this._state.collapsed);
    }

    const sidebarItemElements = document.querySelectorAll(
      ".sc-sidebar-item .sc-item-content"
    );

    sidebarItemElements.forEach((element) => {
      element.classList.toggle("sc-hidden", this._state.collapsed);
    });

    // Update toggle button icon
    const toggleBtn = this._shadow.querySelector("#toggleBtn");
    if (toggleBtn) {
      const icon = toggleBtn.querySelector("i");
      if (icon) {
        icon.className = `fas fa-${this._state.collapsed ? "bars" : "times"}`;
      }
    }

    // Update main content layout
    this._updateMainContentLayout();

    // Save state
    this._saveState();

    // Remove transitioning class after animation completes
    setTimeout(() => {
      this.classList.remove("transitioning");
    }, 400); // Match CSS transition duration
  }

  _updateMainContentLayout() {
    // Find the main content area and update its margin
    const mainContent = document.querySelector("#container");
    if (mainContent) {
      if (this._state.collapsed) {
        mainContent.style.marginLeft = "60px"; // Collapsed width
        mainContent.style.transition =
          "margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
      } else {
        mainContent.style.marginLeft = "280px"; // Expanded width
        mainContent.style.transition =
          "margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
      }
    }

    // Also update the app container grid if it exists
    const appContainer = document.querySelector(".app-container");
    if (appContainer) {
      if (this._state.collapsed) {
        appContainer.style.gridTemplateColumns = "60px 1fr";
      } else {
        appContainer.style.gridTemplateColumns = "280px 1fr";
      }
      appContainer.style.transition =
        "grid-template-columns 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
    }
  }

  _closeMobile() {
    this._state.mobileOpen = false;

    // Update the mobile-open class
    const sidebarElement = this._shadow.querySelector(".sc-sidebar");
    if (sidebarElement) {
      sidebarElement.classList.remove("mobile-open");
    }

    // Hide the overlay
    const overlay = this._shadow.getElementById("overlay");
    if (overlay) {
      overlay.classList.remove("visible");
    }

    // Update main layout for mobile
    this._updateMobileLayout();
  }

  _openMobile() {
    this._state.mobileOpen = true;

    // Update the mobile-open class
    const sidebarElement = this._shadow.querySelector(".sc-sidebar");
    if (sidebarElement) {
      sidebarElement.classList.add("mobile-open");
    }

    // Show the overlay
    const overlay = this._shadow.getElementById("overlay");
    if (overlay) {
      overlay.classList.add("visible");
    }

    // Update main layout for mobile
    this._updateMobileLayout();
  }

  _updateMobileLayout() {
    // Update main content margin for mobile
    const mainContent = document.querySelector("#container");
    if (mainContent) {
      if (this._state.mobileOpen) {
        mainContent.style.marginLeft = "0";
      } else {
        // Restore original margin based on sidebar state
        if (this._state.collapsed) {
          mainContent.style.marginLeft = "60px";
        } else {
          mainContent.style.marginLeft = "280px";
        }
      }
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
    // Implementation for updating sidebar items
    // This method can be extended based on specific requirements
    console.log("Updating sidebar items:", items);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this._render();
      this._setupEventListeners();
    }
  }

  connectedCallback() {
    this._loadState();
  }

  disconnectedCallback() {
    this._saveState();
    // Clean up event listeners
    if (this._toggleHandler) {
      const toggleBtn = this._shadow.getElementById("toggleBtn");
      if (toggleBtn)
        toggleBtn.removeEventListener("click", this._toggleHandler);
    }
    if (this._searchHandler) {
      const searchInput = this._shadow.getElementById("searchInput");
      if (searchInput)
        searchInput.removeEventListener("input", this._searchHandler);
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
  }
}

class ScSidebarItem extends HTMLElement {
  constructor() {
    super();
    this._shadow = this.attachShadow({ mode: "closed" });
    this._expanded = false;
    this._init();
  }

  static get observedAttributes() {
    return ["key", "text", "icon", "description", "behavior"];
  }

  // Public API Methods - Only expose what's necessary
  expand() {
    this._expand();
  }

  collapse() {
    this._collapse();
  }

  // Private methods - All internal logic is private
  _init() {
    this._analyzeItemCapabilities();
    this._render();
    this._setupEventListeners();
  }

  _analyzeItemCapabilities() {
    // Analyze item capabilities based on content and behavior
    const hasChildren = this.querySelectorAll("sc-sidebar-item").length > 0;
    const behavior = this.getAttribute("behavior");

    // If item has children, it's expandable
    if (hasChildren) {
      this.setAttribute("data-has-children", "true");
      this.setAttribute("data-expandable", "true");
    }

    // If behavior is not specified, intelligently determine it
    if (!behavior) {
      if (hasChildren) {
        this.setAttribute("behavior", "expandable");
      } else {
        this.setAttribute("behavior", "clickable");
      }
    }
  }

  _updateCapabilities() {
    // Update capabilities without re-rendering
    this._analyzeItemCapabilities();

    // Update data attributes on existing elements
    const button = this._shadow.querySelector(".sc-sidebar-item");
    if (button) {
      button.dataset.expandable = this.hasAttribute("data-expandable");
      button.dataset.clickable = this.hasAttribute("data-clickable");
      button.dataset.tooltip = this.getAttribute("text") || "";
    }
  }

  _render() {
    const key = this.getAttribute("key") || "";
    const text = this.getAttribute("text") || "";
    const icon = this.getAttribute("icon") || "fas fa-circle";
    const description = this.getAttribute("description") || "";
    const behavior = this.getAttribute("behavior") || "clickable";

    const sidebar = this.closest("sc-sidebar");

    // Intelligently determine if this item is expandable
    const hasChildren = this.querySelectorAll("sc-sidebar-item").length > 0;
    const isExpandable = hasChildren || behavior === "expandable";
    const isClickable =
      behavior === "clickable" || (!hasChildren && behavior !== "expandable");

    this._shadow.innerHTML = `
            <style>
                /* CSS Variables for theming - defined locally for Shadow DOM compatibility */
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
                    --sc-transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                    --sc-border-radius: 8px;
                    --sc-font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                    
                    /* Layout dimensions */
                    --sc-sidebar-width: 280px;
                    --sc-sidebar-collapsed-width: 60px;
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

                /* Expandable items */
                .sc-sidebar-item[data-expandable="true"] {
                  cursor: pointer;
                }

                /* Clickable items */
                .sc-sidebar-item[data-clickable="true"] {
                  cursor: pointer;
                }

                /* Inactive items */
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

                /* Nested items - Pure CSS transitions without JavaScript manipulation */
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

                /* Ensure nested items are visible when expanded */
                .sc-nested-items:not(.sc-hidden) {
                  display: block !important;
                }

                .sc-nested-items .sc-sidebar-item {
                  padding-left: 40px;
                  font-size: 13px;
                  margin: 0;
                  border: none;
                }

                .sc-nested-items .sc-sidebar-item .sc-item-icon {
                  font-size: 14px;
                }

                /* Collapsed state styling */
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

                /* Tooltip for collapsed items */
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

                /* Enhanced hover effects */
                .sc-sidebar-item:hover .sc-item-icon {
                  transform: scale(1.1);
                }

                .sc-sidebar-item:hover .sc-item-text {
                  transform: translateX(3px);
                }

                /* Focus states for accessibility */
                .sc-sidebar-item:focus {
                  outline: 2px solid #3498db;
                  outline-offset: 2px;
                }

                .sc-sidebar-item:focus .sc-item-icon {
                  transform: scale(1.1);
                }

                /* Utility classes */
                .sc-hidden {
                  display: none !important;
                }

                .sc-visible {
                  display: block !important;
                }

                /* Smooth transitions for all interactive elements */
                .sc-sidebar-item * {
                  transition: var(--sc-transition);
                }

                /* Prevent layout shifts during transitions */
                .sc-nested-items {
                  will-change: max-height, opacity, transform;
                }
            </style>
            
            <button class="sc-sidebar-item ${this._expanded ? "expanded" : ""}" 
                    data-key="${key}"
                    data-behavior="${behavior}"
                    data-expandable="${isExpandable}"
                    data-clickable="${isClickable}"
                    data-tooltip="${text}">
                
                <i class="sc-item-icon ${icon}"></i>
                
                <div class="sc-item-content ${
                  sidebar && sidebar._state && sidebar._state.collapsed ? "sc-hidden" : ""
                }">
                    <div class="sc-item-text">${text}</div>
                    ${
                      description
                        ? `<div class="sc-item-description">${description}</div>`
                        : ""
                    }
                </div>
                
                ${
                  isExpandable
                    ? `<i class="sc-item-arrow fas fa-chevron-right"></i>`
                    : ""
                }
            </button>
            
            ${
              isExpandable
                ? `
                <div class="sc-nested-items ${this._expanded ? "expanded" : ""}">
                    <slot></slot>
                </div>
            `
                : ""
            }
        `;
  }

  _setupEventListeners() {
    // Event delegation: single listener on shadowRoot
    if (this._clickHandler) {
      this._shadow.removeEventListener("click", this._clickHandler);
    }

    this._clickHandler = (e) => {
      // Prevent event bubbling
      e.stopPropagation();

      // Find closest button with class sc-sidebar-item
      const button = e.target.closest(".sc-sidebar-item");
      if (!button) return;

      // Call handler with button and event
      this._handleClick(button, e);
    };

    this._shadow.addEventListener("click", this._clickHandler);
  }

  _handleClick(button, e) {
    e.preventDefault();
    e.stopPropagation();

    const isExpandable = button.dataset.expandable === "true";
    const isClickable = button.dataset.clickable === "true";

    // Intelligently decide what action to take
    if (isExpandable && this.querySelectorAll("sc-sidebar-item").length > 0) {
      this._toggleExpand();
    } else if (isClickable) {
      this._handleClickable();
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

  _toggleExpand() {
    this._expanded = !this._expanded;

    // Add transitioning class for smooth animations
    const sidebar = this.closest("sc-sidebar");
    if (sidebar) {
      sidebar.classList.add("transitioning");
    }

    // Update classes for CSS transitions
    const button = this._shadow.querySelector(".sc-sidebar-item");
    const nestedItems = this._shadow.querySelector(".sc-nested-items");

    if (button) {
      button.classList.toggle("expanded", this._expanded);
    }

    if (nestedItems) {
      nestedItems.classList.toggle("expanded", this._expanded);
    }

    // Remove transitioning class after animation completes
    setTimeout(() => {
      if (sidebar) {
        sidebar.classList.remove("transitioning");
      }
    }, 400); // Match CSS transition duration

    // Update parent sidebar state
    if (sidebar && sidebar.hasAttribute("remember-state")) {
      const key = this.getAttribute("key");
      if (this._expanded) {
        if (!sidebar._state.expandedItems.includes(key)) {
          sidebar._state.expandedItems.push(key);
        }
      } else {
        sidebar._state.expandedItems = sidebar._state.expandedItems.filter(
          (item) => item !== key
        );
      }
      sidebar._saveState();
    }
  }

  _expand() {
    this._expanded = true;

    // Add transitioning class for smooth animations
    const sidebar = this.closest("sc-sidebar");
    if (sidebar) {
      sidebar.classList.add("transitioning");
    }

    // Update classes for CSS transitions
    const button = this._shadow.querySelector(".sc-sidebar-item");
    const nestedItems = this._shadow.querySelector(".sc-nested-items");

    if (button) {
      button.classList.add("expanded");
    }

    if (nestedItems) {
      nestedItems.classList.add("expanded");
    }

    // Remove transitioning class after animation completes
    setTimeout(() => {
      if (sidebar) {
        sidebar.classList.remove("transitioning");
      }
    }, 400); // Match CSS transition duration
  }

  _collapse() {
    this._expanded = false;

    // Add transitioning class for smooth animations
    const sidebar = this.closest("sc-sidebar");
    if (sidebar) {
      sidebar.classList.add("transitioning");
    }

    // Update classes for CSS transitions
    const button = this._shadow.querySelector(".sc-sidebar-item");
    const nestedItems = this._shadow.querySelector(".sc-nested-items");

    if (button) {
      button.classList.remove("expanded");
    }

    if (nestedItems) {
      nestedItems.classList.remove("expanded");
    }

    // Remove transitioning class after animation completes
    setTimeout(() => {
      if (sidebar) {
        sidebar.classList.remove("transitioning");
      }
    }, 400); // Match CSS transition duration
  }

  _handleClickable() {
    // Add active state
    const items =
      this.closest("sc-sidebar").querySelectorAll("sc-sidebar-item");
    items.forEach((item) => item._removeActive());
    this._addActive();
  }

  _addActive() {
    const button = this._shadow.querySelector(".sc-sidebar-item");
    if (button) {
      button.classList.add("active");
    }
  }

  _removeActive() {
    const button = this._shadow.querySelector(".sc-sidebar-item");
    if (button) {
      button.classList.remove("active");
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      // Only update capabilities, don't re-render
      this._updateCapabilities();
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

    // Analyze capabilities after adding items
    setTimeout(() => {
      this._analyzeItemCapabilities();
    }, 0);
  }

  disconnectedCallback() {
    // Clean up event listeners
    if (this._clickHandler) {
      this._shadow.removeEventListener("click", this._clickHandler);
    }
  }
}

// Register the custom elements
customElements.define("sc-sidebar", ScSidebar);
customElements.define("sc-sidebar-item", ScSidebarItem);
