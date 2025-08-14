# Advanced Sidebar Web Components

This directory contains two advanced web components built using the Web Components API with Shadow DOM:

- `<sc-sidebar>` - Advanced container component with extensive configuration options
- `<sc-sidebar-item>` - Individual sidebar item with support for nested structures

## Files

- `sidebar.js` - Main component definitions with all advanced features and embedded styles
- `web-components-demo.html` - Advanced demo page showcasing all features
- `sidebar.css` - Original CSS (now integrated into components)

## Features Overview

### 🎨 **Theming & Appearance**
- **Light/Dark Themes**: Switch between light and dark color schemes
- **Customizable Width**: Set any width value (px, %, em, rem)
- **Positioning**: Left or right sidebar positioning
- **Responsive Design**: Mobile-friendly with overlay support

### ⚙️ **Functionality**
- **Collapsible**: Expandable/collapsible sidebar with toggle button
- **Searchable**: Built-in search functionality for menu items
- **Header/Footer**: Optional header and footer sections
- **Animations**: Smooth transitions and animations
- **State Persistence**: Remember collapsed state and search queries

### 🏗️ **Structure**
- **Nested Items**: Support for hierarchical menu structures
- **Default Items**: Automatic creation of sample items when none provided
- **Custom Events**: Event dispatching for item interactions
- **Keyboard Navigation**: Full keyboard accessibility support

## Usage

### Basic Structure

```html
<sc-sidebar 
    id="my-sidebar"
    theme="light"
    position="left"
    width="280px"
    collapsible
    show-header
    show-footer
    searchable
    animations
    responsive
    remember-state
    title="My Sidebar">
    
    <sc-sidebar-item 
        key="dashboard" 
        text="Dashboard" 
        icon="fas fa-tachometer-alt"
        description="System overview"
        behavior="clickable">
    </sc-sidebar-item>
    
    <sc-sidebar-item 
        key="users" 
        text="Users" 
        icon="fas fa-users"
        description="User management"
        behavior="expandable">
        
        <sc-sidebar-item 
            key="user-list" 
            text="User List" 
            icon="fas fa-list"
            description="View all users"
            behavior="clickable">
        </sc-sidebar-item>
        
    </sc-sidebar-item>
</sc-sidebar>
```

### Including the Components

```html
<script src="sidebar.js"></script>
```

## Component Attributes

### sc-sidebar Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `theme` | string | `"light"` | Theme: "light" or "dark" |
| `position` | string | `"left"` | Position: "left" or "right" |
| `width` | string | `"250px"` | Sidebar width (any CSS value) |
| `collapsible` | boolean | `false` | Enable collapse/expand functionality |
| `show-header` | boolean | `false` | Show header section |
| `show-footer` | boolean | `false` | Show footer section |
| `searchable` | boolean | `false` | Enable search functionality |
| `animations` | boolean | `false` | Enable animations and transitions |
| `responsive` | boolean | `false` | Enable responsive mobile behavior |
| `remember-state` | boolean | `false` | Remember state in localStorage |
| `title` | string | `"Sidebar"` | Header title text |

### sc-sidebar-item Attributes

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `key` | string | `""` | Unique identifier for the item |
| `text` | string | `""` | Display text for the item |
| `icon` | string | `"fas fa-circle"` | Font Awesome icon class |
| `description` | string | `""` | Optional description text |
| `behavior` | string | `"clickable"` | Item behavior: "clickable" or "expandable" |

## Advanced Features

### Theme System
The components use CSS custom properties for theming:

```css
:root {
  /* Light theme */
  --sc-light-bg: #ffffff;
  --sc-light-text: #333333;
  --sc-light-border: #e0e0e0;
  
  /* Dark theme */
  --sc-dark-bg: #2c3e50;
  --sc-dark-text: #ecf0f1;
  --sc-dark-border: #34495e;
}
```

### Nested Items
Support for unlimited nesting levels with proper indentation and expand/collapse functionality:

```html
<sc-sidebar-item behavior="expandable">
    <sc-sidebar-item behavior="clickable">
        <!-- Nested item -->
    </sc-sidebar-item>
</sc-sidebar-item>
```

### State Management
When `remember-state` is enabled, the sidebar remembers:
- Collapsed/expanded state
- Search queries
- Expanded menu items
- User preferences

### Responsive Behavior
On mobile devices (≤768px):
- Sidebar becomes fixed overlay
- Slides in from left/right
- Includes backdrop overlay
- Touch-friendly interactions

### Search Functionality
Real-time search through:
- Item text
- Item descriptions
- Nested items
- Instant filtering

## Event System

### Custom Events
The components dispatch custom events for integration:

```javascript
document.addEventListener('sidebar-item-click', (e) => {
    console.log('Item clicked:', e.detail);
    // e.detail contains: key, text, behavior
});
```

### Available Events
- `sidebar-item-click`: Fired when a clickable item is clicked
- `sidebar-toggle`: Fired when sidebar is collapsed/expanded
- `sidebar-search`: Fired when search query changes

## Default Items

If no items are provided, the sidebar automatically creates sample items:

```javascript
defaultItems = [
    {
        key: 'dashboard',
        text: 'Dashboard',
        icon: 'fas fa-tachometer-alt',
        description: 'System overview',
        behavior: 'clickable'
    },
    // ... more items
];
```

## Browser Support

- **Modern Browsers**: Chrome 67+, Firefox 63+, Safari 10.1+, Edge 79+
- **Web Components**: Full support for Custom Elements and Shadow DOM
- **CSS Features**: CSS Grid, Flexbox, CSS Variables, Animations
- **Polyfills**: Available for older browsers

## Performance Features

- **Shadow DOM**: Encapsulated styling and structure
- **Efficient Rendering**: Minimal DOM manipulation
- **Event Delegation**: Optimized event handling
- **Lazy Loading**: CSS and icons loaded only when needed

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **ARIA Support**: Proper semantic markup
- **Focus Management**: Logical tab order
- **Screen Reader**: Compatible with assistive technologies

## Customization

### CSS Customization
Modify the CSS within the `sidebar.js` file to customize:
- Colors and themes
- Spacing and typography
- Animations and transitions
- Responsive breakpoints

### JavaScript Customization
Extend the component classes to add:
- Custom behaviors
- Additional attributes
- Enhanced event handling
- Integration with frameworks

## Demo

Open `web-components-demo.html` in a browser to see:
- Light and dark theme examples
- Left and right positioning
- Collapsible functionality
- Search capabilities
- Nested item structures
- Responsive behavior
- Interactive controls

## Dependencies

- **Font Awesome**: Icon library (loaded via CDN)
- **Modern CSS**: CSS Grid, Flexbox, Variables
- **Web Components**: Native browser support
- **No Frameworks**: Pure vanilla JavaScript

## Getting Started

1. Include the `sidebar.js` file in your HTML
2. Use the `<sc-sidebar>` and `<sc-sidebar-item>` tags
3. Configure attributes as needed
4. Add event listeners for interactions

## Examples

### Minimal Sidebar
```html
<sc-sidebar>
    <!-- Uses default items -->
</sc-sidebar>
```

### Full-Featured Sidebar
```html
<sc-sidebar 
    theme="dark"
    position="right"
    width="350px"
    collapsible
    show-header
    searchable
    animations
    responsive
    remember-state
    title="Admin Panel">
    
    <!-- Custom items here -->
</sc-sidebar>
```

### Nested Menu Structure
```html
<sc-sidebar-item behavior="expandable">
    <sc-sidebar-item behavior="clickable">
        <!-- Sub-item -->
    </sc-sidebar-item>
</sc-sidebar-item>
```
