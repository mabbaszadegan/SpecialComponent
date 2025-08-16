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
- 🎯 **Self-Contained**: All CSS styles embedded within the component (no external files needed)

## 🚀 Quick Start

### Basic Usage

```html
<!DOCTYPE html>
<html>
<head>
    <script src="sidebar.js"></script>
</head>
<body>
    <!-- سایدبار به صورت خودکار layout را مدیریت می‌کند -->
    <sc-sidebar theme="light" position="left" width="280px">
        <!-- محتوای سایدبار -->
    </sc-sidebar>
    
    <!-- محتوا به صورت خودکار کنار سایدبار قرار می‌گیرد -->
    <div class="main-content">
        <h1>محتوای اصلی صفحه</h1>
        <p>این محتوا به صورت خودکار کنار سایدبار قرار می‌گیرد.</p>
    </div>
</body>
</html>
```

### Auto Layout Example

```html
<!-- سایدبار سمت چپ -->
<sc-sidebar position="left" width="280px">
    <!-- منوی سایدبار -->
</sc-sidebar>

<!-- محتوا به صورت خودکار کنار سایدبار قرار می‌گیرد -->
<div class="content">
    <h1>عنوان صفحه</h1>
    <p>محتوا...</p>
</div>

<!-- سایدبار سمت راست -->
<sc-sidebar position="right" width="250px">
    <!-- ابزارهای جانبی -->
</sc-sidebar>
```

> **Note**: The component now includes all CSS styles embedded within the JavaScript file. No external CSS file is required!

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

## 🎯 Auto Layout System

The sidebar component automatically manages page layout using CSS Grid, eliminating the need for manual layout management.

### How It Works

1. **CSS Grid Container**: The component uses `:host` with `display: grid`
2. **Automatic Positioning**: Content automatically flows next to the sidebar
3. **Responsive Behavior**: Grid layout adapts to sidebar state changes
4. **Mobile Optimization**: Grid is disabled on mobile for overlay behavior

### Layout Rules

```css
/* Default (left sidebar) */
:host {
    grid-template-columns: 280px 1fr;
}

/* Right sidebar */
:host([position="right"]) {
    grid-template-columns: 1fr 280px;
}

/* Collapsed state */
:host(.collapsed) {
    grid-template-columns: 60px 1fr;
}
```

### Benefits

- **No Manual Layout**: Content automatically positions itself
- **Responsive**: Adapts to different screen sizes
- **Flexible**: Works with any content structure
- **Performance**: Uses native CSS Grid for optimal performance

## 🎯 Embedded CSS Architecture & Auto Layout

The sidebar component now includes all CSS styles embedded within the JavaScript file, making it completely self-contained and easier to deploy. Additionally, it features automatic layout management using CSS Grid.

### Benefits of Embedded CSS

- **No External Dependencies**: Eliminates the need for separate CSS files
- **Shadow DOM Encapsulation**: Styles are scoped to the component using Shadow DOM
- **Single File Distribution**: Only one JavaScript file needed for the complete component
- **Better Performance**: No additional HTTP requests for CSS files
- **Easier Deployment**: No need to manage multiple asset files

### How It Works

The component uses the `_getStyles()` method to inject CSS directly into the Shadow DOM:

```javascript
_getStyles() {
  return `
    <style>
      /* All CSS styles are defined here */
      :host { /* CSS variables and base styles */ }
      .sc-sidebar { /* Main sidebar styles */ }
      /* ... more styles ... */
    </style>
  `;
}
```

### CSS Organization

- **CSS Variables**: Defined at `:host` level for easy theming
- **Component Styles**: All sidebar-related styles are included
- **Responsive Design**: Media queries for mobile and tablet support
- **Theme Support**: Light and dark theme styles
- **Animation Styles**: Smooth transitions and hover effects

### Auto Layout Management

The component automatically manages layout using CSS Grid:

- **Left Sidebar**: `grid-template-columns: 280px 1fr` (sidebar + content)
- **Right Sidebar**: `grid-template-columns: 1fr 280px` (content + sidebar)
- **Collapsed State**: `grid-template-columns: 60px 1fr` (collapsed sidebar + content)
- **Content Flow**: Subsequent elements automatically flow next to the sidebar
- **Responsive**: On mobile, grid layout is disabled and sidebar becomes overlay

## 🚀 Advanced Auto-Layout System

The sidebar component now features an intelligent auto-layout system that automatically adjusts page layout and adjacent elements based on sidebar position and size changes.

### ✨ Auto-Layout Features

- **Automatic Layout Detection**: Automatically finds and adjusts adjacent elements
- **Position-Aware**: Supports both left and right sidebar positions
- **Responsive**: Automatically adjusts layout for mobile devices
- **Smooth Animations**: All layout changes include smooth transitions
- **CSS Custom Properties**: Provides CSS variables for custom layouts
- **Event System**: Dispatches events when layout changes occur

### 🔧 How Auto-Layout Works

1. **Element Detection**: Automatically finds elements that need layout adjustment
2. **Position Calculation**: Calculates appropriate margins based on sidebar position
3. **Layout Update**: Applies margins and transitions to adjacent elements
4. **CSS Variables**: Updates CSS custom properties for CSS-based layouts
5. **Event Dispatch**: Notifies other components of layout changes

### 📱 Supported Layout Methods

#### Simple Auto-Layout
```html
<!-- Just add the sidebar - layout is automatic -->
<sc-sidebar theme="light" position="left" collapsible>
    <sc-sidebar-item text="Dashboard" icon="fas fa-home"></sc-sidebar-item>
</sc-sidebar>

<!-- Next element automatically adjusts -->
<div class="content">
    Your content here
</div>
```

#### CSS Grid Layout
```html
<div class="sc-grid-layout">
    <sc-sidebar theme="dark" collapsible></sc-sidebar>
    <div class="content">Your content</div>
</div>
```

#### Flexbox Layout
```html
<div class="sc-flex-layout">
    <sc-sidebar theme="light" position="right"></sc-sidebar>
    <div class="sc-content">Your content</div>
</div>
```

### 🎮 Auto-Layout API

#### Methods
- `enableAutoLayout()` - Enable auto-layout functionality
- `disableAutoLayout()` - Disable auto-layout functionality
- `updateLayout()` - Manually update layout
- `getLayoutInfo()` - Get current layout information

#### Events
- `sidebar-layout-changed` - Fired when layout changes occur

#### CSS Custom Properties
- `--sidebar-width` - Current sidebar width
- `--sidebar-margin-left` - Left margin for left-positioned sidebar
- `--sidebar-margin-right` - Right margin for right-positioned sidebar
- `--sidebar-transition` - Transition timing for layout changes

### 🔍 Auto-Layout Detection

The component automatically detects:
- Next sibling elements
- Common layout classes (`.main-content`, `.content`, `.container`, etc.)
- Direct body children
- Elements with specific layout patterns

### 📱 Responsive Behavior

- **Desktop**: Full auto-layout with margins and transitions
- **Mobile**: Automatic mobile overlay with responsive adjustments
- **Tablet**: Adaptive layout based on screen size

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
