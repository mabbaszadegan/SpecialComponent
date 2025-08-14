# Special Sidebar Component

A beautiful, modern, and feature-rich sidebar component built with Web Components. Clean, simple, and highly customizable.

## ✨ Features

- 🎨 **Modern Design**: Clean, beautiful UI with smooth animations
- 🔍 **Smart Search**: Real-time search functionality with intelligent filtering
- 📱 **Responsive**: Works perfectly on all devices and screen sizes
- ⚡ **Fast & Light**: Optimized performance with minimal bundle size
- 🎭 **Themes**: Light and dark themes with easy customization
- 🔧 **Flexible**: Highly configurable with extensive API options
- 🚀 **Web Components**: Built with modern web standards
- 💾 **State Persistence**: Remembers user preferences
- 🔄 **Dynamic Content**: Support for nested menus and dynamic data

## 🚀 Quick Start

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
    <script src="sidebar.js"></script>
</head>
<body>
    <sc-sidebar theme="light" position="left" width="280px">
    </sc-sidebar>
</body>
</html>
```

### With Custom Items

```html
<sc-sidebar 
    theme="dark" 
    position="right" 
    width="320px"
    searchable="true"
    collapsible="true">
</sc-sidebar>

<script>
    const sidebar = document.querySelector('sc-sidebar');
    
    sidebar.items = [
        {
            id: 'dashboard',
            text: 'Dashboard',
            icon: 'fas fa-tachometer-alt',
            description: 'Main dashboard view'
        },
        {
            id: 'users',
            text: 'Users',
            icon: 'fas fa-users',
            description: 'User management',
            children: [
                {
                    id: 'user-list',
                    text: 'User List',
                    icon: 'fas fa-list'
                }
            ]
        }
    ];
</script>
```

## 📋 Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `theme` | string | `'light'` | Theme: `'light'` or `'dark'` |
| `position` | string | `'left'` | Position: `'left'` or `'right'` |
| `width` | string | `'280px'` | Sidebar width |
| `collapsible` | boolean | `true` | Enable collapse functionality |
| `show-header` | boolean | `true` | Show sidebar header |
| `show-footer` | boolean | `true` | Show sidebar footer |
| `searchable` | boolean | `false` | Enable search functionality |

## 🎮 API Methods

### Properties

- `items`: Get/set sidebar items
- `currentState`: Get current sidebar state

### Methods

- `addItem(item)`: Add a new item
- `removeItem(itemId)`: Remove an item by ID
- `setActiveItem(itemId)`: Set active item
- `toggleSidebar()`: Toggle collapse state

## 📊 Item Structure

```javascript
{
    id: 'unique-id',           // Required: Unique identifier
    text: 'Display Text',      // Required: Display text
    icon: 'fas fa-icon',       // Optional: FontAwesome icon
    description: 'Description', // Optional: Item description
    badge: 'New',              // Optional: Badge text
    children: []                // Optional: Nested items
}
```

## 🎨 Customization

### CSS Custom Properties

```css
:root {
    --sidebar-width: 280px;
    --sidebar-collapsed-width: 60px;
    --sidebar-bg: #ffffff;
    --sidebar-border: #e2e8f0;
    --sidebar-text: #1e293b;
    --sidebar-text-secondary: #64748b;
    --sidebar-hover: #f8fafc;
    --sidebar-active: #06b6d4;
    --sidebar-active-hover: #0891b2;
    --sidebar-divider: #e2e8f0;
}
```

### Themes

#### Light Theme (Default)
- Clean white background
- Subtle borders and shadows
- Dark text for good contrast

#### Dark Theme
- Dark background (#1e293b)
- Light text for readability
- Accent colors for highlights

## 🔍 Search Functionality

When enabled, the search bar provides real-time filtering:

- Searches through item text and descriptions
- Supports nested items
- Updates results as you type
- Maintains hierarchy in results

## 📱 Responsive Design

- Automatically adapts to mobile devices
- Touch-friendly interactions
- Optimized for small screens
- Smooth transitions and animations

## 🎯 Events

The component dispatches custom events for integration:

```javascript
sidebar.addEventListener('item-click', (e) => {
    console.log('Item clicked:', e.detail.itemId);
    console.log('Item data:', e.detail.item);
});

sidebar.addEventListener('sidebar-toggle', (e) => {
    console.log('Sidebar collapsed:', e.detail.isCollapsed);
});

sidebar.addEventListener('search', (e) => {
    console.log('Search query:', e.detail.query);
});
```

## 🚀 Advanced Features

### Dynamic Data Loading

```javascript
// Load from API
sidebar.setAttribute('data-source', 'api');
sidebar.setAttribute('api-endpoint', '/api/sidebar-items');

// Auto-refresh
sidebar.setAttribute('refresh-interval', '30000'); // 30 seconds
```

### State Persistence

The component automatically saves and restores:
- Collapse state
- Expanded items
- User preferences

### Nested Menus

Support for unlimited nesting levels:

```javascript
{
    id: 'parent',
    text: 'Parent Item',
    children: [
        {
            id: 'child1',
            text: 'Child 1',
            children: [
                {
                    id: 'grandchild',
                    text: 'Grandchild'
                }
            ]
        }
    ]
}
```

## 🛠️ Browser Support

- Chrome 67+
- Firefox 63+
- Safari 10.1+
- Edge 79+

## 📦 Installation

### CDN

```html
<script src="https://cdn.jsdelivr.net/gh/your-repo/special-components@latest/sidebar.js"></script>
```

### NPM

```bash
npm install special-sidebar-component
```

### Local

1. Download `sidebar.js` and `sidebar.css`
2. Include in your HTML
3. Use the `<sc-sidebar>` element

## 🎨 Examples

### Basic Sidebar

```html
<sc-sidebar theme="light" position="left"></sc-sidebar>
```

### Advanced Sidebar

```html
<sc-sidebar 
    theme="dark" 
    position="right" 
    width="320px"
    searchable="true"
    collapsible="true"
    show-header="true"
    show-footer="true">
</sc-sidebar>
```

### Custom Styling

```css
sc-sidebar {
    --sidebar-width: 350px;
    --sidebar-bg: #f8fafc;
    --sidebar-active: #3b82f6;
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

- 📖 [Documentation](https://docs.example.com)
- 🐛 [Issues](https://github.com/your-repo/issues)
- 💬 [Discussions](https://github.com/your-repo/discussions)
- 📧 [Email](mailto:support@example.com)

---

Made with ❤️ by the Special Components team
