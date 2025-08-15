// Advanced Sidebar Web Components
// <sc-sidebar> and <sc-sidebar-item> with improved performance and smooth animations

class ScSidebar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.state = {
      collapsed: false,
      mobileOpen: false,
      searchQuery: "",
      expandedItems: [],
    };
  
    this.init();
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

  init() {
    this.loadState();
    this.render();
    this.setupEventListeners();
  }

  render() {
    const theme = this.getAttribute("theme") || "light";
    const position = this.getAttribute("position") || "left";
    const width = this.getAttribute("width") || "250px";
    const showHeader = this.hasAttribute("show-header");
    const showFooter = this.hasAttribute("show-footer");
    const searchable = this.hasAttribute("searchable");
    const collapsible = this.hasAttribute("collapsible");

    this.shadowRoot.innerHTML = `
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
            </style>
            
            <link rel="stylesheet" href="/assets/libs/font-awesome/fontawsome.min.css">
            <link rel="stylesheet" href="/Components/Sidebar/sidebar.css">
            
            <div class="sc-sidebar ${this.state.collapsed ? "collapsed" : ""} ${
      this.state.mobileOpen ? "mobile-open" : ""
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
                                  this.state.collapsed ? "bars" : "times"
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
                               value="${this.state.searchQuery}">
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

  setupEventListeners() {
    // Toggle button
    const toggleBtn = this.shadowRoot.getElementById("toggleBtn");
    if (toggleBtn) {
      // Remove existing listener if any
      if (this._toggleHandler) {
        toggleBtn.removeEventListener("click", this._toggleHandler);
      }
      this._toggleHandler = () => this.toggleCollapse();
      toggleBtn.addEventListener("click", this._toggleHandler);
    }

    // Search functionality
    const searchInput = this.shadowRoot.getElementById("searchInput");
    if (searchInput) {
      // Remove existing listener if any
      if (this._searchHandler) {
        searchInput.removeEventListener("input", this._searchHandler);
      }
      this._searchHandler = (e) => this.handleSearch(e.target.value);
      searchInput.addEventListener("input", this._searchHandler);
    }

    // Mobile overlay
    const overlay = this.shadowRoot.getElementById("overlay");
    if (overlay) {
      // Remove existing listener if any
      if (this._overlayHandler) {
        overlay.removeEventListener("click", this._overlayHandler);
      }
      this._overlayHandler = () => this.closeMobile();
      overlay.addEventListener("click", this._overlayHandler);
    }

    // Handle slot changes
    const slot = this.shadowRoot.querySelector("slot");
    if (slot) {
      // Remove existing listener if any
      if (this._slotHandler) {
        slot.removeEventListener("slotchange", this._slotHandler);
      }
      this._slotHandler = () => this.handleSlotChange();
      slot.addEventListener("slotchange", this._slotHandler);
    }

    // Keyboard navigation
    if (this._keyboardHandler) {
      this.removeEventListener("keydown", this._keyboardHandler);
    }
    this._keyboardHandler = (e) => this.handleKeyboard(e);
    this.addEventListener("keydown", this._keyboardHandler);
  }

  handleSlotChange() {
    const items = this.querySelectorAll("sc-sidebar-item");

    // Analyze capabilities of new items
    this.refreshItemCapabilities();

    // Restore expanded state for previously expanded items
    items.forEach((item) => {
      if (item.key && this.state.expandedItems.includes(item.key)) {
        item.expand();
      }
    });
  }

  handleSearch(query) {
    this.state.searchQuery = query;
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

    this.saveState();
  }

  refreshItemCapabilities() {
    this.querySelectorAll("sc-sidebar-item").forEach((item) => {
      if (
        item.analyzeItemCapabilities &&
        typeof item.analyzeItemCapabilities === "function"
      ) {
        item.analyzeItemCapabilities();
        // Don't re-render, just update attributes
        item.updateCapabilities();
      }
    });
  }

  toggleCollapse() {
    // Toggle collapsed state
    this.state.collapsed = !this.state.collapsed;

    // Add transitioning class for smooth animations
    this.classList.add("transitioning");

    // Update the collapsed class on the sidebar element
    const sidebarElement = this.shadowRoot.querySelector(".sc-sidebar");
    if (sidebarElement) {
      sidebarElement.classList.toggle("collapsed", this.state.collapsed);
    }

    const sidebarItemElements = document.querySelectorAll(
      ".sc-sidebar-item .sc-item-content"
    );

    sidebarItemElements.forEach((element) => {
      element.classList.toggle("sc-hidden", this.state.collapsed);
    });

    // Update toggle button icon
    const toggleBtn = this.shadowRoot.querySelector("#toggleBtn");
    if (toggleBtn) {
      const icon = toggleBtn.querySelector("i");
      if (icon) {
        icon.className = `fas fa-${this.state.collapsed ? "bars" : "times"}`;
      }
    }

    // Update main content layout
    this.updateMainContentLayout();

    // Save state
    this.saveState();

    // Remove transitioning class after animation completes
    setTimeout(() => {
      this.classList.remove("transitioning");
    }, 400); // Match CSS transition duration
  }

  updateMainContentLayout() {
    // Find the main content area and update its margin
    const mainContent = document.querySelector("#container");
    if (mainContent) {
      if (this.state.collapsed) {
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
      if (this.state.collapsed) {
        appContainer.style.gridTemplateColumns = "60px 1fr";
      } else {
        appContainer.style.gridTemplateColumns = "280px 1fr";
      }
      appContainer.style.transition =
        "grid-template-columns 0.4s cubic-bezier(0.4, 0, 0.2, 1)";
    }
  }

  closeMobile() {
    this.state.mobileOpen = false;

    // Update the mobile-open class
    const sidebarElement = this.shadowRoot.querySelector(".sc-sidebar");
    if (sidebarElement) {
      sidebarElement.classList.remove("mobile-open");
    }

    // Hide the overlay
    const overlay = this.shadowRoot.getElementById("overlay");
    if (overlay) {
      overlay.classList.remove("visible");
    }

    // Update main layout for mobile
    this.updateMobileLayout();
  }

  openMobile() {
    this.state.mobileOpen = true;

    // Update the mobile-open class
    const sidebarElement = this.shadowRoot.querySelector(".sc-sidebar");
    if (sidebarElement) {
      sidebarElement.classList.add("mobile-open");
    }

    // Show the overlay
    const overlay = this.shadowRoot.getElementById("overlay");
    if (overlay) {
      overlay.classList.add("visible");
    }

    // Update main layout for mobile
    this.updateMobileLayout();
  }

  updateMobileLayout() {
    // Update main content margin for mobile
    const mainContent = document.querySelector("#container");
    if (mainContent) {
      if (this.state.mobileOpen) {
        mainContent.style.marginLeft = "0";
      } else {
        // Restore original margin based on sidebar state
        if (this.state.collapsed) {
          mainContent.style.marginLeft = "60px";
        } else {
          mainContent.style.marginLeft = "280px";
        }
      }
    }
  }

  handleKeyboard(e) {
    switch (e.key) {
      case "Escape":
        if (this.state.mobileOpen) this.closeMobile();
        break;
      case "Enter":
        if (e.target.classList.contains("sc-sidebar-item")) {
          e.target.click();
        }
        break;
    }
  }

  loadState() {
    if (this.hasAttribute("remember-state")) {
      const savedState = localStorage.getItem(
        `sc-sidebar-${this.id || "default"}`
      );
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          this.state = { ...this.state, ...parsed };
        } catch (e) {
          console.warn("Failed to load sidebar state:", e);
        }
      }
    }
  }

  saveState() {
    if (this.hasAttribute("remember-state")) {
      const stateToSave = {
        collapsed: this.state.collapsed,
        searchQuery: this.state.searchQuery,
        expandedItems: this.state.expandedItems,
      };
      localStorage.setItem(
        `sc-sidebar-${this.id || "default"}`,
        JSON.stringify(stateToSave)
      );
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
    // Clean up event listeners
    if (this._toggleHandler) {
      const toggleBtn = this.shadowRoot.getElementById("toggleBtn");
      if (toggleBtn)
        toggleBtn.removeEventListener("click", this._toggleHandler);
    }
    if (this._searchHandler) {
      const searchInput = this.shadowRoot.getElementById("searchInput");
      if (searchInput)
        searchInput.removeEventListener("input", this._searchHandler);
    }
    if (this._overlayHandler) {
      const overlay = this.shadowRoot.getElementById("overlay");
      if (overlay) overlay.removeEventListener("click", this._overlayHandler);
    }
    if (this._slotHandler) {
      const slot = this.shadowRoot.querySelector("slot");
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

  updateCapabilities() {
    // Update capabilities without re-rendering
    this.analyzeItemCapabilities();

    // Update data attributes on existing elements
    const button = this.shadowRoot.querySelector(".sc-sidebar-item");
    if (button) {
      button.dataset.expandable = this.hasAttribute("data-expandable");
      button.dataset.clickable = this.hasAttribute("data-clickable");
      button.dataset.tooltip = this.getAttribute("text") || "";
    }
  }

  render() {
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

    this.shadowRoot.innerHTML = `
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
            </style>
            
            <link rel="stylesheet" href="/assets/libs/font-awesome/fontawsome.min.css">
            <link rel="stylesheet" href="/Components/Sidebar/sidebar.css">
            
            <button class="sc-sidebar-item ${this.expanded ? "expanded" : ""}" 
                    data-key="${key}"
                    data-behavior="${behavior}"
                    data-expandable="${isExpandable}"
                    data-clickable="${isClickable}"
                    data-tooltip="${text}">
                
                <i class="sc-item-icon ${icon}"></i>
                
                <div class="sc-item-content ${
                  sidebar.state.collapsed ? "sc-hidden" : ""
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
                <div class="sc-nested-items ${this.expanded ? "expanded" : ""}">
                    <slot></slot>
                </div>
            `
                : ""
            }
        `;
  }

  setupEventListeners() {
    // Event delegation: single listener on shadowRoot
    if (this._clickHandler) {
      this.shadowRoot.removeEventListener("click", this._clickHandler);
    }

    this._clickHandler = (e) => {
      // Prevent event bubbling
      e.stopPropagation();

      // Find closest button with class sc-sidebar-item
      const button = e.target.closest(".sc-sidebar-item");
      if (!button) return;

      // Call handler with button and event
      this.handleClick(button, e);
    };

    this.shadowRoot.addEventListener("click", this._clickHandler);
  }

  handleClick(button, e) {
    e.preventDefault();
    e.stopPropagation();

    const isExpandable = button.dataset.expandable === "true";
    const isClickable = button.dataset.clickable === "true";

    // Intelligently decide what action to take
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

    // Add transitioning class for smooth animations
    const sidebar = this.closest("sc-sidebar");
    if (sidebar) {
      sidebar.classList.add("transitioning");
    }

    // Update classes for CSS transitions
    const button = this.shadowRoot.querySelector(".sc-sidebar-item");
    const nestedItems = this.shadowRoot.querySelector(".sc-nested-items");

    if (button) {
      button.classList.toggle("expanded", this.expanded);
    }

    if (nestedItems) {
      nestedItems.classList.toggle("expanded", this.expanded);
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

    // Add transitioning class for smooth animations
    const sidebar = this.closest("sc-sidebar");
    if (sidebar) {
      sidebar.classList.add("transitioning");
    }

    // Update classes for CSS transitions
    const button = this.shadowRoot.querySelector(".sc-sidebar-item");
    const nestedItems = this.shadowRoot.querySelector(".sc-nested-items");

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

  collapse() {
    this.expanded = false;

    // Add transitioning class for smooth animations
    const sidebar = this.closest("sc-sidebar");
    if (sidebar) {
      sidebar.classList.add("transitioning");
    }

    // Update classes for CSS transitions
    const button = this.shadowRoot.querySelector(".sc-sidebar-item");
    const nestedItems = this.shadowRoot.querySelector(".sc-nested-items");

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
      // Only update capabilities, don't re-render
      this.updateCapabilities();
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
      this.analyzeItemCapabilities();
    }, 0);
  }

  disconnectedCallback() {
    // Clean up event listeners
    if (this._clickHandler) {
      this.shadowRoot.removeEventListener("click", this._clickHandler);
    }
  }
}

// Register the custom elements
customElements.define("sc-sidebar", ScSidebar);
customElements.define("sc-sidebar-item", ScSidebarItem);
