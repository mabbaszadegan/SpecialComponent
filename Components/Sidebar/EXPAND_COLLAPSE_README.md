# Sidebar Expand/Collapse Functionality

This document explains the new expand/collapse functionality implemented in the sidebar component.

## Overview

The sidebar now supports expandable menu items that can show/hide their child items with smooth animations and proper state management.

## Features

### ✅ Automatic Detection
- Items with children are automatically detected as expandable
- Items without children are treated as clickable by default
- Behavior can be explicitly set using the `behavior` attribute

### ✅ Smooth Animations
- CSS transitions for expand/collapse animations
- Opacity and transform effects for smooth visual feedback
- Configurable animation duration and easing

### ✅ State Persistence
- Expanded/collapsed state is saved to localStorage
- State is restored when the page is reloaded
- Works with the `remember-state` attribute

### ✅ Visual Indicators
- Arrow icons (chevron-right) for expandable items
- Arrow rotates 90 degrees when expanded
- Different styling for expandable vs clickable items

## Usage

### Basic Structure

```html
<sc-sidebar>
    <!-- Clickable item -->
    <sc-sidebar-item 
        key="dashboard" 
        text="Dashboard" 
        icon="fas fa-tachometer-alt"
        behavior="clickable">
    </sc-sidebar-item>
    
    <!-- Expandable item with children -->
    <sc-sidebar-item 
        key="users" 
        text="User Management" 
        icon="fas fa-users"
        behavior="expandable">
        
        <!-- Child items -->
        <sc-sidebar-item 
            key="user-list" 
            text="User List" 
            behavior="clickable">
        </sc-sidebar-item>
        
        <sc-sidebar-item 
            key="add-user" 
            text="Add User" 
            behavior="clickable">
        </sc-sidebar-item>
    </sc-sidebar-item>
</sc-sidebar>
```

### Behavior Types

1. **`expandable`** - Item can expand to show children
2. **`clickable`** - Item can be clicked for action
3. **`auto`** - Automatically determined based on content (default)

### Automatic Detection

If no `behavior` attribute is specified, the component automatically determines the behavior:

```html
<!-- This will automatically be expandable because it has children -->
<sc-sidebar-item key="content" text="Content">
    <sc-sidebar-item key="pages" text="Pages"></sc-sidebar-item>
    <sc-sidebar-item key="posts" text="Posts"></sc-sidebar-item>
</sc-sidebar-item>

<!-- This will automatically be clickable because it has no children -->
<sc-sidebar-item key="settings" text="Settings"></sc-sidebar-item>
```

## API Methods

### ScSidebarItem Methods

```javascript
// Expand the item
item.expand();

// Collapse the item
item.collapse();

// Toggle expand/collapse state
item.toggleExpand();

// Check if item is expanded
if (item.expanded) {
    console.log('Item is expanded');
}
```

### Event Handling

```javascript
// Listen for item clicks
document.addEventListener('sidebar-item-click', (e) => {
    console.log('Item clicked:', e.detail);
    // e.detail contains: key, text, behavior
});

// Listen for expand/collapse events
item.addEventListener('expand', () => console.log('Item expanded'));
item.addEventListener('collapse', () => console.log('Item collapsed'));
```

## CSS Customization

### Custom Styling

```css
/* Style expandable items */
.sc-sidebar-item[data-expandable="true"] {
    cursor: pointer;
}

/* Style expanded state */
.sc-sidebar-item.expanded .sc-item-arrow {
    transform: rotate(90deg);
}

/* Style nested items */
.sc-nested-items {
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
}

.sc-sidebar-item.expanded .sc-nested-items {
    max-height: 1000px;
}
```

### Animation Customization

```css
/* Customize transition duration */
.sc-nested-items {
    transition: max-height 0.5s ease, opacity 0.3s ease;
}

/* Customize transform effects */
.sc-nested-items {
    transform: translateY(-10px);
    transition: transform 0.3s ease;
}

.sc-sidebar-item.expanded .sc-nested-items {
    transform: translateY(0);
}
```

## Configuration Options

### Sidebar Attributes

```html
<sc-sidebar 
    animations="true"           <!-- Enable/disable animations -->
    remember-state="true"       <!-- Save/restore expanded state -->
    searchable="true"           <!-- Enable search functionality -->
    collapsible="true">         <!-- Enable sidebar collapse -->
```

### Item Attributes

```html
<sc-sidebar-item 
    key="unique-key"           <!-- Unique identifier -->
    text="Display Text"        <!-- Visible text -->
    icon="fas fa-icon"         <!-- FontAwesome icon -->
    description="Description"   <!-- Optional description -->
    behavior="expandable">      <!-- Explicit behavior -->
```

## Examples

### Multi-level Navigation

```html
<sc-sidebar-item key="admin" text="Administration" behavior="expandable">
    <sc-sidebar-item key="users" text="Users" behavior="expandable">
        <sc-sidebar-item key="user-list" text="User List" behavior="clickable">
        </sc-sidebar-item>
        <sc-sidebar-item key="user-groups" text="User Groups" behavior="expandable">
            <sc-sidebar-item key="admins" text="Administrators" behavior="clickable">
            </sc-sidebar-item>
            <sc-sidebar-item key="moderators" text="Moderators" behavior="clickable">
            </sc-sidebar-item>
        </sc-sidebar-item>
    </sc-sidebar-item>
    
    <sc-sidebar-item key="system" text="System" behavior="expandable">
        <sc-sidebar-item key="logs" text="System Logs" behavior="clickable">
        </sc-sidebar-item>
        <sc-sidebar-item key="backup" text="Backup" behavior="clickable">
        </sc-sidebar-item>
    </sc-sidebar-item>
</sc-sidebar-item>
```

### Dynamic Content

```javascript
// Dynamically add expandable items
function addMenuItem(parent, itemData) {
    const item = document.createElement('sc-sidebar-item');
    item.setAttribute('key', itemData.key);
    item.setAttribute('text', itemData.text);
    item.setAttribute('icon', itemData.icon);
    
    if (itemData.children) {
        item.setAttribute('behavior', 'expandable');
        itemData.children.forEach(child => {
            addMenuItem(item, child);
        });
    } else {
        item.setAttribute('behavior', 'clickable');
    }
    
    parent.appendChild(item);
}

// Usage
const sidebar = document.querySelector('sc-sidebar');
addMenuItem(sidebar, {
    key: 'dynamic',
    text: 'Dynamic Menu',
    icon: 'fas fa-plus',
    children: [
        { key: 'sub1', text: 'Sub Item 1' },
        { key: 'sub2', text: 'Sub Item 2' }
    ]
});
```

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- CSS transitions and transforms
- ES6+ JavaScript features
- Shadow DOM support

## Performance Considerations

- Use `max-height` instead of `height` for smooth animations
- Limit nesting depth to avoid performance issues
- Consider lazy loading for very large menu structures
- Use `will-change: transform` for better animation performance

## Troubleshooting

### Common Issues

1. **Items not expanding**: Check if the item has children or `behavior="expandable"`
2. **Animations not working**: Ensure `animations="true"` is set on the sidebar
3. **State not persisting**: Check if `remember-state="true"` is set
4. **Styling issues**: Verify CSS selectors target the correct elements

### Debug Mode

```javascript
// Enable debug logging
const sidebar = document.querySelector('sc-sidebar');
sidebar.debug = true;

// Check item capabilities
const items = sidebar.querySelectorAll('sc-sidebar-item');
items.forEach(item => {
    console.log('Item:', item.getAttribute('text'));
    console.log('Has children:', item.querySelectorAll('sc-sidebar-item').length > 0);
    console.log('Behavior:', item.getAttribute('behavior'));
    console.log('Expanded:', item.expanded);
});
```

## Migration Guide

### From Old Version

1. **Update HTML structure**: Add `behavior` attributes where needed
2. **Check event listeners**: Update from old event names to new ones
3. **Update CSS**: Ensure selectors match new structure
4. **Test functionality**: Verify expand/collapse works as expected

### Breaking Changes

- Event names changed from `item-click` to `sidebar-item-click`
- Some CSS class names may have changed
- API methods have been updated for better consistency

## Contributing

When contributing to the expand/collapse functionality:

1. Maintain backward compatibility where possible
2. Add tests for new features
3. Update documentation for any API changes
4. Follow the existing code style and patterns
5. Test with different nesting levels and configurations
