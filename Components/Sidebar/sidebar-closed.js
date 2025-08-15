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
            <link rel="stylesheet" href="sidebar-closed.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
            
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

  
    const sidebarItemElements = this.querySelectorAll("sc-sidebar-item");

    sidebarItemElements.forEach((element) => {
      element._shadow.querySelector(".sc-item-content").classList.toggle("sc-hidden", this._state.collapsed);
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

    // Generate tooltip menu HTML for collapsed state
    const tooltipMenu = this._generateTooltipMenu(text, icon, description, hasChildren);

    this._shadow.innerHTML = `
            <link rel="stylesheet" href="sidebar-closed.css">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">

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
            
            ${tooltipMenu}
            
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

  _generateTooltipMenu(text, icon, description, hasChildren) {
    if (!hasChildren) {
      // Simple item - just show text and description
      return `
        <div class="sc-tooltip-menu">
          <div class="sc-tooltip-menu-header">
            <i class="sc-tooltip-icon ${icon}"></i>
            <span>${text}</span>
          </div>
          ${description ? `
            <div class="sc-tooltip-menu-content">
              <div class="sc-tooltip-menu-item">
                <div class="sc-tooltip-item-content">
                  <div class="sc-tooltip-item-text">${text}</div>
                  <div class="sc-tooltip-item-description">${description}</div>
                </div>
              </div>
            </div>
          ` : ''}
        </div>
      `;
    }

    // Item with children - generate nested menu structure
    const children = this.querySelectorAll("sc-sidebar-item");
    let childrenHTML = '';

    children.forEach((child, index) => {
      const childText = child.getAttribute("text") || "";
      const childIcon = child.getAttribute("icon") || "fas fa-circle";
      const childDescription = child.getAttribute("description") || "";
      const childHasChildren = child.querySelectorAll("sc-sidebar-item").length > 0;

      if (childHasChildren) {
        // Generate sub-menu for nested children
        const subChildren = child.querySelectorAll("sc-sidebar-item");
        let subChildrenHTML = '';

        subChildren.forEach((subChild) => {
          const subText = subChild.getAttribute("text") || "";
          const subIcon = subChild.getAttribute("icon") || "fas fa-circle";
          const subDescription = subChild.getAttribute("description") || "";

          subChildrenHTML += `
            <div class="sc-tooltip-menu-item">
              <i class="sc-tooltip-item-icon ${subIcon}"></i>
              <div class="sc-tooltip-item-content">
                <div class="sc-tooltip-item-text">${subText}</div>
                ${subDescription ? `<div class="sc-tooltip-item-description">${subDescription}</div>` : ''}
              </div>
            </div>
          `;
        });

        childrenHTML += `
          <div class="sc-tooltip-menu-item" style="position: relative;">
            <i class="sc-tooltip-item-icon ${childIcon}"></i>
            <div class="sc-tooltip-item-content">
              <div class="sc-tooltip-item-text">${childText}</div>
              ${childDescription ? `<div class="sc-tooltip-item-description">${childDescription}</div>` : ''}
            </div>
            <i class="sc-tooltip-sub-indicator fas fa-chevron-right"></i>
            <div class="sc-tooltip-sub-menu">
              <div class="sc-tooltip-menu-header">
                <i class="sc-tooltip-icon ${childIcon}"></i>
                <span>${childText}</span>
              </div>
              <div class="sc-tooltip-menu-content">
                ${subChildrenHTML}
              </div>
            </div>
          </div>
        `;
      } else {
        // Simple child item
        childrenHTML += `
          <div class="sc-tooltip-menu-item">
            <i class="sc-tooltip-item-icon ${childIcon}"></i>
            <div class="sc-tooltip-item-content">
              <div class="sc-tooltip-item-text">${childText}</div>
              ${childDescription ? `<div class="sc-tooltip-item-description">${childDescription}</div>` : ''}
            </div>
          </div>
        `;
      }

      // Add divider between items (except for the last one)
      if (index < children.length - 1) {
        childrenHTML += '<div class="sc-tooltip-menu-divider"></div>';
      }
    });

    return `
      <div class="sc-tooltip-menu">
        <div class="sc-tooltip-menu-header">
          <i class="sc-tooltip-icon ${icon}"></i>
          <span>${text}</span>
        </div>
        <div class="sc-tooltip-menu-content">
          ${childrenHTML}
        </div>
      </div>
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

    // Add event listeners for tooltip menu items
    this._setupTooltipMenuEventListeners();
  }

  _setupTooltipMenuEventListeners() {
    // Wait for DOM to be ready
    setTimeout(() => {
      const tooltipMenuItems = this._shadow.querySelectorAll('.sc-tooltip-menu-item');
      
      tooltipMenuItems.forEach((item) => {
        item.addEventListener('click', (e) => {
          e.stopPropagation();
          this._handleTooltipMenuItemClick(item);
        });
      });
    }, 100);
  }

  _handleTooltipMenuItemClick(tooltipItem) {
    // Find the corresponding sidebar item
    const itemText = tooltipItem.querySelector('.sc-tooltip-item-text')?.textContent;
    if (!itemText) return;

    // Find the sidebar item with matching text
    const sidebarItems = this.querySelectorAll('sc-sidebar-item');
    const matchingItem = Array.from(sidebarItems).find(item => 
      item.getAttribute('text') === itemText
    );

    if (matchingItem) {
      // Trigger click on the matching sidebar item
      matchingItem.click();
    }

    // Dispatch custom event for external handling
    this.dispatchEvent(
      new CustomEvent("tooltip-menu-item-click", {
        detail: {
          text: itemText,
          element: tooltipItem
        },
        bubbles: true,
      })
    );
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
