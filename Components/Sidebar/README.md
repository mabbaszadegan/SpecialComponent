# Enhanced Sidebar Component

A flexible and powerful sidebar component that supports both data source loading and manual HTML definition.

## Features

- **Dual Usage Modes**: Data source (JSON/API) and manual HTML
- **Dynamic Data Loading**: Load menu data from JSON files or API endpoints
- **Auto-refresh**: Configurable automatic data refresh intervals
- **Loading States**: Visual feedback during data loading
- **Nested Menus**: Support for unlimited nested menu items
- **Responsive Design**: Mobile-friendly with collapsible functionality
- **Theme Support**: Light and dark themes
- **State Persistence**: Remember expanded/collapsed states
- **Search & Filter**: Built-in search and filtering capabilities
- **Customizable**: Extensive configuration options

## Usage

### Method 1: Data Source (JSON File)

```html
<sc-sidebar 
    data-source="/api/menu.json"
    theme="light"
    position="right"
    width="320px"
    collapsible
    show-header
    show-footer
    searchable
    filterable
    animations
    responsive
    auto-expand-on-load
    remember-state>
</sc-sidebar>
```

### Method 2: API Endpoint

```html
<sc-sidebar 
    api-endpoint="/api/menu"
    refresh-interval="30000"
    theme="dark"
    position="left">
</sc-sidebar>
```

### Method 3: Manual HTML

```html
<sc-sidebar id="manualSidebar">
    <sc-sidebar-item 
        key="dashboard" 
        text="Dashboard" 
        icon="fa-solid fa-tachometer-alt"
        description="System Overview"
        behavior="always-open">
        
        <sc-sidebar-item 
            key="overview" 
            text="Overview" 
            icon="fa-solid fa-chart-line"
            behavior="clickable">
        </sc-sidebar-item>
        
        <sc-sidebar-item 
            key="analytics" 
            text="Analytics" 
            icon="fa-solid fa-chart-bar"
            badge="New"
            behavior="clickable">
        </sc-sidebar-item>
    </sc-sidebar-item>
    
    <sc-sidebar-item 
        key="settings" 
        text="Settings" 
        icon="fa-solid fa-cog"
        behavior="clickable">
    </sc-sidebar-item>
</sc-sidebar>
```

## Attributes

### Core Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `theme` | string | `"light"` | Theme: "light" or "dark" |
| `position` | string | `"right"` | Position: "left" or "right" |
| `width` | string | `"280px"` | Sidebar width |
| `collapsible` | boolean | `false` | Enable collapse functionality |
| `show-header` | boolean | `false` | Show header section |
| `show-footer` | boolean | `false` | Show footer section |
| `searchable` | boolean | `false` | Enable search functionality |
| `filterable` | boolean | `false` | Enable filter functionality |
| `animations` | boolean | `true` | Enable animations |
| `responsive` | boolean | `true` | Enable responsive behavior |
| `auto-expand-on-load` | boolean | `false` | Auto-expand items on load |
| `remember-state` | boolean | `true` | Remember expanded states |

### Data Source Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `data-source` | string | `null` | JSON file path or direct JSON data |
| `api-endpoint` | string | `null` | API endpoint URL |
| `refresh-interval` | number | `null` | Auto-refresh interval in milliseconds |

## Data Structure

### JSON Format

```json
{
  "items": [
    {
      "key": "dashboard",
      "text": "Dashboard",
      "icon": "fa-solid fa-tachometer-alt",
      "description": "System Overview",
      "category": "main",
      "behavior": "always-open",
      "disabled": false,
      "badge": "New",
      "children": [
        {
          "key": "overview",
          "text": "Overview",
          "icon": "fa-solid fa-chart-line",
          "behavior": "clickable"
        }
      ]
    }
  ]
}
```

### Item Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `key` | string | ✅ | Unique identifier for the item |
| `text` | string | ✅ | Display text |
| `icon` | string | ❌ | FontAwesome icon class |
| `description` | string | ❌ | Item description |
| `category` | string | ❌ | Item category for grouping |
| `behavior` | string | ❌ | Item behavior: "clickable", "always-open", "auto-expand" |
| `disabled` | boolean | ❌ | Disable the item |
| `badge` | string | ❌ | Badge text to display |
| `children` | array | ❌ | Nested child items |

### Behavior Types

- **`clickable`**: Item can be clicked to expand/collapse (default)
- **`always-open`**: Item is always expanded and cannot be collapsed
- **`auto-expand`**: Item automatically expands on page load

## API Methods

### Data Management

```javascript
// Set items programmatically
sidebar.scSidebarSetItems(items);

// Add new item
sidebar.scSidebarAddItem(item, parentKey);

// Remove item
sidebar.scSidebarRemoveItem(key);

// Update item
sidebar.scSidebarUpdateItem(key, updates);

// Find item by key
const item = sidebar.scSidebarFindItemByKey(key);
```

### Data Source Management

```javascript
// Set data source
sidebar.scSidebarSetDataSource('/api/menu.json', 'json');

// Set API endpoint
sidebar.scSidebarSetAPIEndpoint('/api/menu', {
    'Authorization': 'Bearer token',
    'Content-Type': 'application/json'
});

// Set refresh interval
sidebar.scSidebarSetRefreshInterval(30000); // 30 seconds

// Manual refresh
sidebar.scSidebarRefreshData();
```

### State Management

```javascript
// Expand/collapse items
sidebar.scSidebarExpandItem(key);
sidebar.scSidebarCollapseItem(key);
sidebar.scSidebarToggleItem(key);

// Expand/collapse all
sidebar.scSidebarExpandAll();
sidebar.scSidebarCollapseAll();

// Set active item
sidebar.scSidebarSetActiveItem(key);

// Collapse/expand sidebar
sidebar.scSidebarCollapse();
sidebar.scSidebarExpand();
sidebar.scSidebarToggle();
```

## Events

### Available Events

| Event | Description | Detail |
|-------|-------------|---------|
| `sc-sidebar-item-click` | Item clicked | `{ item, key }` |
| `sc-sidebar-collapse` | Sidebar collapsed/expanded | `{ collapsed }` |
| `sc-sidebar-data-refreshed` | Data refreshed from API | `{ data, timestamp }` |
| `sc-sidebar-data-error` | Data loading error | `{ error }` |

### Event Listeners

```javascript
sidebar.addEventListener('sc-sidebar-item-click', (event) => {
    console.log('Clicked item:', event.detail.item);
    console.log('Item key:', event.detail.key);
});

sidebar.addEventListener('sc-sidebar-data-refreshed', (event) => {
    console.log('Data refreshed:', event.detail.data);
    console.log('Timestamp:', event.detail.timestamp);
});

sidebar.addEventListener('sc-sidebar-data-error', (event) => {
    console.error('Data error:', event.detail.error);
});
```

## CSS Custom Properties

### Available Variables

```css
:root {
    --sc-sidebar-width: 280px;
    --sc-sidebar-bg: #ffffff;
    --sc-sidebar-border: #e2e8f0;
    --sc-sidebar-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    --sc-sidebar-transition: all 0.3s ease;
    
    --sc-sidebar-header-bg: #f8fafc;
    --sc-sidebar-footer-bg: #f8fafc;
    
    --sc-sidebar-text-primary: #1e293b;
    --sc-sidebar-text-secondary: #64748b;
    --sc-sidebar-text-muted: #94a3b8;
    
    --sc-sidebar-primary: #6366f1;
    --sc-sidebar-primary-hover: #4f46e5;
    --sc-sidebar-accent: #06b6d4;
    --sc-sidebar-accent-hover: #0891b2;
    
    --sc-sidebar-hover-bg: #f1f5f9;
    --sc-sidebar-input-bg: #ffffff;
}
```

## Examples

### Admin Panel Sidebar

```html
<sc-sidebar 
    theme="dark"
    position="left"
    width="300px"
    collapsible
    show-header
    searchable
    api-endpoint="/api/admin/menu"
    refresh-interval="60000">
</sc-sidebar>
```

### E-commerce Category Menu

```html
<sc-sidebar 
    theme="light"
    position="right"
    width="280px"
    data-source="/api/categories.json"
    show-header
    searchable
    filterable>
</sc-sidebar>
```

### Mobile App Navigation

```html
<sc-sidebar 
    theme="dark"
    position="left"
    width="100%"
    responsive
    show-header>
    <sc-sidebar-item key="home" text="Home" icon="fa-solid fa-home"></sc-sidebar-item>
    <sc-sidebar-item key="profile" text="Profile" icon="fa-solid fa-user"></sc-sidebar-item>
    <sc-sidebar-item key="settings" text="Settings" icon="fa-solid fa-cog"></sc-sidebar-item>
</sc-sidebar>
```

## Browser Support

- Chrome 67+
- Firefox 63+
- Safari 11.1+
- Edge 79+

## Dependencies

- FontAwesome (for icons)
- Modern browser with ES6+ support

## License

MIT License - see LICENSE file for details.
