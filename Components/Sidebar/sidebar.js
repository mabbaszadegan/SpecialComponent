// Special Sidebar Component - Flexible Design with Data Source Support
class ScSidebar extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    
    // Default configuration
    this.scSidebarConfig = {
      theme: 'light',
      position: 'right',
      width: '280px',
      collapsible: true,
      showHeader: true,
      showFooter: true,
      items: [],
      searchable: false,
      filterable: false,
      animations: true,
      responsive: true,
      autoExpandOnLoad: false,
      rememberState: true,
      dataSource: null,
      dataSourceType: null, // 'json', 'api', 'manual'
      apiEndpoint: null,
      apiHeaders: {},
      refreshInterval: null
    };
    
    // Internal state
    this.scSidebarState = {
      isCollapsed: false,
      isMobile: false,
      activeItem: null,
      searchQuery: '',
      expandedItems: new Set(),
      sidebarOpen: false,
      isLoading: false,
      lastRefresh: null
    };
    
    // Bind methods
    this.scSidebarHandleItemClick = this.scSidebarHandleItemClick.bind(this);
    this.scSidebarToggleSidebar = this.scSidebarToggleSidebar.bind(this);
    this.scSidebarHandleSearch = this.scSidebarHandleSearch.bind(this);
    this.scSidebarHandleItemExpand = this.scSidebarHandleItemExpand.bind(this);
    this.scSidebarRefreshData = this.scSidebarRefreshData.bind(this);
  }

  static get observedAttributes() {
    return [
      'theme', 'position', 'width', 'collapsible', 'show-header', 'show-footer',
      'searchable', 'filterable', 'animations', 'responsive', 'auto-expand-on-load', 'remember-state',
      'data-source', 'api-endpoint', 'refresh-interval'
    ];
  }

  connectedCallback() {
    this.scSidebarInitializeComponent();
    this.scSidebarLoadSavedState();
    this.scSidebarRender();
    this.scSidebarSetupEventListeners();
    
    // Initialize data source if specified
    if (this.scSidebarConfig.dataSource) {
      this.scSidebarInitializeDataSource();
    }
  }

  disconnectedCallback() {
    this.scSidebarSaveState();
    
    // Clear refresh interval if exists
    if (this.scSidebarConfig.refreshInterval) {
      clearInterval(this.scSidebarConfig.refreshInterval);
    }
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.scSidebarUpdateConfig(name, newValue);
      
      // Handle data source changes
      if (name === 'data-source' || name === 'api-endpoint' || name === 'refresh-interval') {
        this.scSidebarInitializeDataSource();
      }
      
      this.scSidebarRender();
    }
  }

  // Public API Methods
  scSidebarSetItems(items) {
    this.scSidebarConfig.items = Array.isArray(items) ? items : [];
    this.scSidebarConfig.dataSourceType = 'manual';
    this.scSidebarSetupDefaultState();
    this.scSidebarRender();
  }

  scSidebarAddItem(item, parentKey = null) {
    if (item && item.key) {
      if (parentKey) {
        const parent = this.scSidebarFindItemByKey(parentKey);
        if (parent) {
          if (!parent.children) parent.children = [];
          parent.children.push(item);
        }
      } else {
        this.scSidebarConfig.items.push(item);
      }
      this.scSidebarRender();
    }
  }

  scSidebarRemoveItem(key) {
    this.scSidebarRemoveItemRecursive(this.scSidebarConfig.items, key);
    this.scSidebarRender();
  }

  scSidebarRemoveItemRecursive(items, key) {
    for (let i = items.length - 1; i >= 0; i--) {
      if (items[i].key === key) {
        items.splice(i, 1);
        return true;
      }
      if (items[i].children) {
        if (this.scSidebarRemoveItemRecursive(items[i].children, key)) {
          return true;
        }
      }
    }
    return false;
  }

  scSidebarUpdateItem(key, updates) {
    const item = this.scSidebarFindItemByKey(key);
    if (item) {
      Object.assign(item, updates);
      this.scSidebarRender();
    }
  }

  scSidebarFindItemByKey(key, items = null) {
    items = items || this.scSidebarConfig.items;
    
    for (const item of items) {
      if (item.key === key) return item;
      if (item.children) {
        const found = this.scSidebarFindItemByKey(key, item.children);
        if (found) return found;
      }
    }
    return null;
  }

  scSidebarSetActiveItem(key) {
    this.scSidebarState.activeItem = key;
    this.scSidebarUpdateActiveStates();
  }

  scSidebarExpandItem(key) {
    this.scSidebarState.expandedItems.add(key);
    this.scSidebarUpdateExpandedStates();
  }

  scSidebarCollapseItem(key) {
    this.scSidebarState.expandedItems.delete(key);
    this.scSidebarUpdateExpandedStates();
  }

  scSidebarToggleItem(key) {
    if (this.scSidebarState.expandedItems.has(key)) {
      this.scSidebarCollapseItem(key);
    } else {
      this.scSidebarExpandItem(key);
    }
  }

  scSidebarExpandAll() {
    this.scSidebarExpandAllRecursive(this.scSidebarConfig.items);
    this.scSidebarUpdateExpandedStates();
  }

  scSidebarExpandAllRecursive(items) {
    items.forEach(item => {
      if (item.children && item.children.length > 0) {
        this.scSidebarState.expandedItems.add(item.key);
        this.scSidebarExpandAllRecursive(item.children);
      }
    });
  }

  scSidebarCollapseAll() {
    this.scSidebarState.expandedItems.clear();
    this.scSidebarUpdateExpandedStates();
  }

  scSidebarCollapse() {
    if (this.scSidebarConfig.collapsible) {
      this.scSidebarState.isCollapsed = true;
      this.scSidebarUpdateCollapsedState();
    }
  }

  scSidebarExpand() {
    if (this.scSidebarConfig.collapsible) {
      this.scSidebarState.isCollapsed = false;
      this.scSidebarUpdateCollapsedState();
    }
  }

  scSidebarToggle() {
    if (this.scSidebarConfig.collapsible) {
      this.scSidebarState.isCollapsed = !this.scSidebarState.isCollapsed;
      this.scSidebarUpdateCollapsedState();
    }
  }

  // Data Source Methods
  scSidebarSetDataSource(source, type = 'json') {
    this.scSidebarConfig.dataSource = source;
    this.scSidebarConfig.dataSourceType = type;
    this.scSidebarInitializeDataSource();
  }

  scSidebarSetAPIEndpoint(endpoint, headers = {}) {
    this.scSidebarConfig.apiEndpoint = endpoint;
    this.scSidebarConfig.apiHeaders = headers;
    this.scSidebarConfig.dataSourceType = 'api';
    this.scSidebarInitializeDataSource();
  }

  scSidebarSetRefreshInterval(intervalMs) {
    // Clear existing interval
    if (this.scSidebarConfig.refreshInterval) {
      clearInterval(this.scSidebarConfig.refreshInterval);
    }
    
    if (intervalMs && intervalMs > 0) {
      this.scSidebarConfig.refreshInterval = setInterval(this.scSidebarRefreshData, intervalMs);
    }
  }

  async scSidebarRefreshData() {
    if (this.scSidebarConfig.dataSourceType === 'api' && this.scSidebarConfig.apiEndpoint) {
      try {
        this.scSidebarState.isLoading = true;
        this.scSidebarRender(); // Show loading state
        
        const response = await fetch(this.scSidebarConfig.apiEndpoint, {
          headers: this.scSidebarConfig.apiHeaders
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        this.scSidebarConfig.items = this.scSidebarProcessDataSource(data);
        this.scSidebarState.lastRefresh = new Date();
        
        this.scSidebarSetupDefaultState();
        this.scSidebarRender();
        
        // Dispatch refresh event
        this.dispatchEvent(new CustomEvent('sc-sidebar-data-refreshed', {
          detail: { data, timestamp: this.scSidebarState.lastRefresh },
          bubbles: true,
          composed: true
        }));
        
      } catch (error) {
        console.error('ScSidebar: Failed to refresh data from API:', error);
        this.dispatchEvent(new CustomEvent('sc-sidebar-data-error', {
          detail: { error: error.message },
          bubbles: true,
          composed: true
        }));
      } finally {
        this.scSidebarState.isLoading = false;
        this.scSidebarRender();
      }
    }
  }

  // Private Methods
  scSidebarInitializeComponent() {
    this.scSidebarParseAttributes();
    this.scSidebarParseItems();
    this.scSidebarSetupDefaultState();
  }

  scSidebarParseAttributes() {
    this.scSidebarConfig.collapsible = this.hasAttribute('collapsible');
    this.scSidebarConfig.showHeader = this.hasAttribute('show-header');
    this.scSidebarConfig.showFooter = this.hasAttribute('show-footer');
    this.scSidebarConfig.searchable = this.hasAttribute('searchable');
    this.scSidebarConfig.filterable = this.hasAttribute('filterable');
    this.scSidebarConfig.animations = this.hasAttribute('animations');
    this.scSidebarConfig.responsive = this.hasAttribute('responsive');
    this.scSidebarConfig.autoExpandOnLoad = this.hasAttribute('auto-expand-on-load');
    this.scSidebarConfig.rememberState = this.hasAttribute('remember-state');

    this.scSidebarConfig.theme = this.getAttribute('theme') || 'light';
    this.scSidebarConfig.position = this.getAttribute('position') || 'right';
    this.scSidebarConfig.width = this.getAttribute('width') || '280px';
    
    // Data source attributes
    this.scSidebarConfig.dataSource = this.getAttribute('data-source');
    this.scSidebarConfig.apiEndpoint = this.getAttribute('api-endpoint');
    this.scSidebarConfig.refreshInterval = parseInt(this.getAttribute('refresh-interval')) || null;
  }

  scSidebarParseItems() {
    // Check for manual HTML items first
    const manualItems = this.querySelectorAll('sc-sidebar-item');
    if (manualItems.length > 0) {
      this.scSidebarConfig.dataSourceType = 'manual';
      this.scSidebarConfig.items = this.scSidebarParseManualItems(manualItems);
      return;
    }
    
    // Check for items attribute
    const itemsData = this.getAttribute('items');
    if (itemsData) {
      try {
        this.scSidebarConfig.items = JSON.parse(itemsData);
        this.scSidebarConfig.dataSourceType = 'manual';
      } catch (e) {
        console.warn('ScSidebar: Invalid items JSON');
      }
    }
  }

  scSidebarParseManualItems(manualItems) {
    const items = [];
    
    manualItems.forEach(item => {
      const itemData = {
        key: item.getAttribute('key') || `item-${Date.now()}-${Math.random()}`,
        text: item.getAttribute('text') || item.textContent?.trim() || 'Untitled',
        icon: item.getAttribute('icon') || null,
        description: item.getAttribute('description') || null,
        badge: item.getAttribute('badge') || null,
        disabled: item.hasAttribute('disabled'),
        behavior: item.getAttribute('behavior') || 'clickable',
        category: item.getAttribute('category') || 'general'
      };
      
      // Check for nested items
      const nestedItems = item.querySelectorAll('sc-sidebar-item');
      if (nestedItems.length > 0) {
        itemData.children = this.scSidebarParseManualItems(nestedItems);
      }
      
      items.push(itemData);
    });
    
    return items;
  }

  scSidebarInitializeDataSource() {
    if (!this.scSidebarConfig.dataSource && !this.scSidebarConfig.apiEndpoint) {
      return;
    }
    
    if (this.scSidebarConfig.dataSource) {
      // Handle JSON file or direct data
      if (this.scSidebarConfig.dataSource.startsWith('http') || this.scSidebarConfig.dataSource.startsWith('/')) {
        // It's a URL/file path
        this.scSidebarLoadJSONFile(this.scSidebarConfig.dataSource);
      } else {
        // It's direct JSON data
        try {
          const data = JSON.parse(this.scSidebarConfig.dataSource);
          this.scSidebarConfig.items = this.scSidebarProcessDataSource(data);
          this.scSidebarConfig.dataSourceType = 'json';
          this.scSidebarSetupDefaultState();
          this.scSidebarRender();
        } catch (e) {
          console.warn('ScSidebar: Invalid data source JSON');
        }
      }
    } else if (this.scSidebarConfig.apiEndpoint) {
      // Handle API endpoint
      this.scSidebarConfig.dataSourceType = 'api';
      this.scSidebarRefreshData();
      
      // Set up refresh interval if specified
      if (this.scSidebarConfig.refreshInterval) {
        this.scSidebarSetRefreshInterval(this.scSidebarConfig.refreshInterval);
      }
    }
  }

  async scSidebarLoadJSONFile(filePath) {
    try {
      this.scSidebarState.isLoading = true;
      this.scSidebarRender(); // Show loading state
      
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      this.scSidebarConfig.items = this.scSidebarProcessDataSource(data);
      this.scSidebarConfig.dataSourceType = 'json';
      
      this.scSidebarSetupDefaultState();
      this.scSidebarRender();
      
    } catch (error) {
      console.error('ScSidebar: Failed to load JSON file:', error);
      this.dispatchEvent(new CustomEvent('sc-sidebar-data-error', {
        detail: { error: error.message },
        bubbles: true,
        composed: true
      }));
    } finally {
      this.scSidebarState.isLoading = false;
      this.scSidebarRender();
    }
  }

  scSidebarProcessDataSource(data) {
    // Handle different data structures
    if (Array.isArray(data)) {
      return data;
    } else if (data && typeof data === 'object') {
      // Check for common data structures
      if (data.items && Array.isArray(data.items)) {
        return data.items;
      } else if (data.menu && Array.isArray(data.menu)) {
        return data.menu;
      } else if (data.navigation && Array.isArray(data.navigation)) {
        return data.navigation;
      } else if (data.sidebar && Array.isArray(data.sidebar)) {
        return data.sidebar;
      }
    }
    
    // Return empty array if data structure is not recognized
    console.warn('ScSidebar: Unrecognized data structure, returning empty array');
    return [];
  }

  scSidebarSetupDefaultState() {
    if (this.scSidebarConfig.items.length > 0) {
      this.scSidebarState.activeItem = this.scSidebarConfig.items[0].key;
    }

    if (this.scSidebarConfig.autoExpandOnLoad) {
      this.scSidebarSetupAutoExpandItems();
    }

    this.scSidebarState.isMobile = window.innerWidth <= 768;
  }

  scSidebarSetupAutoExpandItems() {
    this.scSidebarSetupAutoExpandRecursive(this.scSidebarConfig.items);
  }

  scSidebarSetupAutoExpandRecursive(items) {
    items.forEach(item => {
      if (item.behavior === 'always-open' || item.behavior === 'auto-expand') {
        this.scSidebarState.expandedItems.add(item.key);
      }
      if (item.children && item.children.length > 0) {
        this.scSidebarSetupAutoExpandRecursive(item.children);
      }
    });
  }

  scSidebarLoadSavedState() {
    if (this.scSidebarConfig.rememberState) {
      const savedState = localStorage.getItem(`sc-sidebar-${this.id || 'default'}`);
      if (savedState) {
        try {
          const parsed = JSON.parse(savedState);
          if (parsed.expandedItems) {
            this.scSidebarState.expandedItems = new Set(parsed.expandedItems);
          }
          if (parsed.activeItem) {
            this.scSidebarState.activeItem = parsed.activeItem;
          }
        } catch (e) {
          console.warn('ScSidebar: Failed to parse saved state');
        }
      }
    }
  }

  scSidebarSaveState() {
    if (this.scSidebarConfig.rememberState) {
      const stateToSave = {
        expandedItems: Array.from(this.scSidebarState.expandedItems),
        activeItem: this.scSidebarState.activeItem
      };
      localStorage.setItem(`sc-sidebar-${this.id || 'default'}`, JSON.stringify(stateToSave));
    }
  }

  scSidebarRender() {
    const styles = this.scSidebarGetStyles();
    const template = this.scSidebarGetTemplate();
    
    this.shadowRoot.innerHTML = `${styles}${template}`;
    
    // Set CSS custom properties for dynamic values
    this.scSidebarSetCSSVariables();
    
    this.scSidebarSetupInternalEventListeners();
  }

  scSidebarGetStyles() {
    // Load CSS from external file
    return `<link rel="stylesheet" href="sidebar.css">`;
  }

  scSidebarGetTemplate() {
    return `
      <div class="sc-sidebar" data-sc-theme="${this.scSidebarConfig.theme}" data-sc-position="${this.scSidebarConfig.position}">
        ${this.scSidebarConfig.collapsible ? '<button class="sc-sidebar-toggle" title="Toggle Sidebar">☰</button>' : ''}
        
        ${this.scSidebarConfig.showHeader ? `
          <div class="sc-sidebar-header">
            <div class="sc-sidebar-title">کامپوننت‌ها</div>
            <div class="sc-sidebar-subtitle">کتابخانه ویژه</div>
            ${this.scSidebarConfig.dataSourceType === 'api' ? `
              <div class="sc-sidebar-refresh-info">
                <small>آخرین بروزرسانی: ${this.scSidebarState.lastRefresh ? this.scSidebarState.lastRefresh.toLocaleTimeString('fa-IR') : 'هیچ'}</small>
              </div>
            ` : ''}
          </div>
        ` : ''}
        
        <div class="sc-sidebar-content">
          ${this.scSidebarConfig.searchable ? `
            <div class="sc-sidebar-search">
              <input 
                type="text" 
                class="sc-sidebar-search-input" 
                placeholder="جستجو در کامپوننت‌ها..."
                aria-label="Search components"
              >
            </div>
          ` : ''}
          
          <div class="sc-sidebar-items">
            ${this.scSidebarState.isLoading ? this.scSidebarRenderLoadingState() : this.scSidebarRenderItems()}
          </div>
        </div>
        
        ${this.scSidebarConfig.showFooter ? `
          <div class="sc-sidebar-footer">
            <div class="sc-sidebar-footer-text">نسخه 1.0.0</div>
            ${this.scSidebarConfig.dataSourceType === 'api' ? `
              <button class="sc-sidebar-refresh-btn" title="بروزرسانی داده‌ها">🔄</button>
            ` : ''}
          </div>
        ` : ''}
      </div>
    `;
  }

  scSidebarRenderLoadingState() {
    return `
      <div class="sc-sidebar-loading">
        <div class="sc-sidebar-loading-spinner"></div>
        <div class="sc-sidebar-loading-text">در حال بارگذاری...</div>
      </div>
    `;
  }

  scSidebarRenderItems(items = null, level = 0) {
    items = items || this.scSidebarConfig.items;
    
    if (items.length === 0) {
      return '<div class="sc-sidebar-item sc-sidebar-item-disabled">هیچ کامپوننتی یافت نشد</div>';
    }

    return items.map(item => {
      const isActive = item.key === this.scSidebarState.activeItem;
      const isExpanded = this.scSidebarState.expandedItems.has(item.key);
      const hasChildren = item.children && item.children.length > 0;
      const isExpandable = hasChildren && (item.behavior === 'clickable' || item.behavior === 'auto-expand');
      
      return `
        <div class="sc-sidebar-item ${isActive ? 'sc-sidebar-item-active' : ''} ${item.disabled ? 'sc-sidebar-item-disabled' : ''} ${isExpandable ? 'sc-sidebar-item-expandable' : ''} ${isExpanded ? 'sc-sidebar-item-expanded' : ''}" 
             data-sc-sidebar-key="${item.key}" 
             data-sc-sidebar-level="${level}">
          
          <div class="sc-sidebar-item-content">
            ${item.icon ? `<i class="${item.icon}"></i>` : ''}
            <div class="sc-sidebar-item-text">
              <div class="sc-sidebar-item-title">${item.text}</div>
              ${item.description ? `<div class="sc-sidebar-item-description">${item.description}</div>` : ''}
            </div>
            ${item.badge ? `<div class="sc-sidebar-item-badge">${item.badge}</div>` : ''}
            ${isExpandable ? `<i class="sc-sidebar-item-expand-icon">▶</i>` : ''}
          </div>
          
          ${hasChildren ? `
            <div class="sc-sidebar-item-children ${isExpanded ? 'sc-sidebar-item-children-expanded' : 'sc-sidebar-item-children-collapsed'}">
              ${this.scSidebarRenderItems(item.children, level + 1)}
            </div>
          ` : ''}
        </div>
      `;
    }).join('');
  }

  scSidebarSetupEventListeners() {
    this.addEventListener('sc-sidebar-item-click', this.scSidebarHandleItemClick);
    window.addEventListener('resize', () => {
      this.scSidebarState.isMobile = window.innerWidth <= 768;
    });
  }

  scSidebarSetupInternalEventListeners() {
    const shadow = this.shadowRoot;
    
    shadow.querySelectorAll('.sc-sidebar-item').forEach(item => {
      item.addEventListener('click', (e) => {
        if (!item.classList.contains('sc-sidebar-item-disabled')) {
          const key = item.dataset.scSidebarKey;
          const isExpandable = item.classList.contains('sc-sidebar-item-expandable');
          
          if (isExpandable) {
            e.stopPropagation();
            this.scSidebarHandleItemExpand(key);
          } else {
            this.scSidebarHandleItemClick(e, key);
          }
        }
      });
    });

    const searchInput = shadow.querySelector('.sc-sidebar-search-input');
    if (searchInput) {
      searchInput.addEventListener('input', this.scSidebarHandleSearch);
    }

    const toggleBtn = shadow.querySelector('.sc-sidebar-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', this.scSidebarToggleSidebar);
    }

    const refreshBtn = shadow.querySelector('.sc-sidebar-refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', this.scSidebarRefreshData);
    }
  }

  // Event Handlers
  scSidebarHandleItemClick(event, key) {
    const item = this.scSidebarFindItemByKey(key);
    if (item) {
      this.scSidebarState.activeItem = key;
      this.scSidebarUpdateActiveStates();
      
      this.dispatchEvent(new CustomEvent('sc-sidebar-item-click', {
        detail: { item, key },
        bubbles: true,
        composed: true
      }));
    }
  }

  scSidebarHandleItemExpand(key) {
    this.scSidebarToggleItem(key);
  }

  scSidebarHandleSearch(event) {
    this.scSidebarState.searchQuery = event.target.value;
    this.scSidebarRender();
  }

  scSidebarToggleSidebar() {
    this.scSidebarToggle();
  }

  // State Update Methods
  scSidebarUpdateActiveStates() {
    const shadow = this.shadowRoot;
    shadow.querySelectorAll('.sc-sidebar-item').forEach(item => {
      item.classList.toggle('sc-sidebar-item-active', item.dataset.scSidebarKey === this.scSidebarState.activeItem);
    });
  }

  scSidebarUpdateExpandedStates() {
    const shadow = this.shadowRoot;
    shadow.querySelectorAll('.sc-sidebar-item').forEach(item => {
      const key = item.dataset.scSidebarKey;
      const isExpanded = this.scSidebarState.expandedItems.has(key);
      
      item.classList.toggle('sc-sidebar-item-expanded', isExpanded);
      
      const childrenContainer = item.querySelector('.sc-sidebar-item-children');
      if (childrenContainer) {
        childrenContainer.classList.toggle('sc-sidebar-item-children-expanded', isExpanded);
        childrenContainer.classList.toggle('sc-sidebar-item-children-collapsed', !isExpanded);
      }
    });
    
    this.scSidebarSaveState();
  }

  scSidebarUpdateCollapsedState() {
    const sidebar = this.shadowRoot.querySelector('.sc-sidebar');
    sidebar.classList.toggle('sc-sidebar-collapsed', this.scSidebarState.isCollapsed);
    
    this.dispatchEvent(new CustomEvent('sc-sidebar-collapse', {
      detail: { collapsed: this.scSidebarState.isCollapsed },
      bubbles: true,
      composed: true
    }));
  }

  scSidebarUpdateConfig(key, value) {
    switch (key) {
      case 'theme':
        this.scSidebarConfig.theme = value;
        break;
      case 'position':
        this.scSidebarConfig.position = value;
        break;
      case 'width':
        this.scSidebarConfig.width = value;
        break;
      case 'collapsible':
        this.scSidebarConfig.collapsible = this.hasAttribute('collapsible');
        break;
      case 'show-header':
        this.scSidebarConfig.showHeader = this.hasAttribute('show-header');
        break;
      case 'show-footer':
        this.scSidebarConfig.showFooter = this.hasAttribute('show-footer');
        break;
      case 'searchable':
        this.scSidebarConfig.searchable = this.hasAttribute('searchable');
        break;
      case 'filterable':
        this.scSidebarConfig.filterable = this.hasAttribute('filterable');
        break;
      case 'animations':
        this.scSidebarConfig.animations = this.hasAttribute('animations');
        break;
      case 'responsive':
        this.scSidebarConfig.responsive = this.hasAttribute('responsive');
        break;
      case 'auto-expand-on-load':
        this.scSidebarConfig.autoExpandOnLoad = this.hasAttribute('auto-expand-on-load');
        break;
      case 'remember-state':
        this.scSidebarConfig.rememberState = this.hasAttribute('remember-state');
        break;
      case 'data-source':
        this.scSidebarConfig.dataSource = value;
        break;
      case 'api-endpoint':
        this.scSidebarConfig.apiEndpoint = value;
        break;
      case 'refresh-interval':
        this.scSidebarConfig.refreshInterval = parseInt(value) || null;
        break;
    }
    
    // Update CSS variables when config changes
    this.scSidebarSetCSSVariables();
  }

  scSidebarSetCSSVariables() {
    if (this.shadowRoot) {
      const sidebar = this.shadowRoot.querySelector('.sc-sidebar');
      if (sidebar) {
        sidebar.style.setProperty('--sc-sidebar-dynamic-width', this.scSidebarConfig.width);
        sidebar.style.setProperty('--sc-sidebar-transition', this.scSidebarConfig.animations ? 'all 0.3s ease' : 'none');
      }
    }
  }
}

// Sidebar Item Component for manual HTML usage
class ScSidebarItem extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  static get observedAttributes() {
    return ['key', 'text', 'icon', 'description', 'badge', 'disabled', 'behavior', 'category'];
  }

  connectedCallback() {
    this.scSidebarItemRender();
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) {
      this.scSidebarItemRender();
    }
  }

  scSidebarItemRender() {
    const key = this.getAttribute('key') || `item-${Date.now()}-${Math.random()}`;
    const text = this.getAttribute('text') || this.textContent?.trim() || 'Untitled';
    const icon = this.getAttribute('icon');
    const description = this.getAttribute('description');
    const badge = this.getAttribute('badge');
    const disabled = this.hasAttribute('disabled');
    const behavior = this.getAttribute('behavior') || 'clickable';
    const category = this.getAttribute('category') || 'general';

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          margin: 0.25rem 0;
        }
        
        .sc-sidebar-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.75rem 1rem;
          cursor: pointer;
          border-radius: 0.5rem;
          color: var(--sc-sidebar-text-secondary, #64748b);
          font-weight: 500;
          font-size: 0.875rem;
          transition: all 0.2s ease;
          border: 1px solid transparent;
        }
        
        .sc-sidebar-item:hover {
          background: var(--sc-sidebar-hover-bg, #f1f5f9);
          color: var(--sc-sidebar-text-primary, #1e293b);
        }
        
        .sc-sidebar-item[disabled] {
          opacity: 0.5;
          cursor: not-allowed;
          pointer-events: none;
        }
        
        .sc-sidebar-item-icon {
          font-size: 1.125rem;
          width: 20px;
          text-align: center;
          flex-shrink: 0;
        }
        
        .sc-sidebar-item-content {
          display: flex;
          align-items: center;
          gap: 1rem;
          flex: 1;
          min-width: 0;
        }
        
        .sc-sidebar-item-text {
          flex: 1;
          min-width: 0;
        }
        
        .sc-sidebar-item-title {
          font-weight: 600;
          line-height: 1.4;
        }
        
        .sc-sidebar-item-description {
          font-size: 0.75rem;
          opacity: 0.8;
          margin-top: 0.25rem;
          line-height: 1.3;
        }
        
        .sc-sidebar-item-badge {
          background: var(--sc-sidebar-accent, #06b6d4);
          color: white;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 0.25rem 0.5rem;
          border-radius: 0.375rem;
          min-width: 20px;
          text-align: center;
          flex-shrink: 0;
        }
      </style>
      
      <div class="sc-sidebar-item" 
           data-key="${key}"
           data-text="${text}"
           data-icon="${icon || ''}"
           data-description="${description || ''}"
           data-badge="${badge || ''}"
           data-behavior="${behavior}"
           data-category="${category}"
           ${disabled ? 'disabled' : ''}>
        
        <div class="sc-sidebar-item-content">
          ${icon ? `<i class="sc-sidebar-item-icon ${icon}"></i>` : ''}
          <div class="sc-sidebar-item-text">
            <div class="sc-sidebar-item-title">${text}</div>
            ${description ? `<div class="sc-sidebar-item-description">${description}</div>` : ''}
          </div>
          ${badge ? `<div class="sc-sidebar-item-badge">${badge}</div>` : ''}
        </div>
        
        <slot></slot>
      </div>
    `;
  }
}

// Register the custom elements
customElements.define('sc-sidebar', ScSidebar);
customElements.define('sc-sidebar-item', ScSidebarItem);

// Export for module usage
export { ScSidebar, ScSidebarItem };
