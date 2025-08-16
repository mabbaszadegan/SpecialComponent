// Simple Sidebar Demo Script
class SimpleSidebarDemo {
    constructor() {
        this.sidebar = null;
        this.init();
    }

    init() {
        this.waitForSidebar();
        this.setupEventListeners();
        this.logEvent('دمو آماده به کار شد', 'info');
    }

    waitForSidebar() {
        // Wait for the sidebar component to be ready
        const checkSidebar = () => {
            this.sidebar = document.getElementById('simple-sidebar');
            if (this.sidebar && this.sidebar.shadowRoot) {
                this.setupSidebarEvents();
                this.logEvent('Sidebar component آماده شد', 'success');
            } else {
                setTimeout(checkSidebar, 100);
            }
        };
        checkSidebar();
    }

    setupEventListeners() {
        // Demo control buttons
        document.getElementById('toggle-sidebar-btn')?.addEventListener('click', () => this.toggleSidebar());
        document.getElementById('expand-all-btn')?.addEventListener('click', () => this.expandAllItems());
        document.getElementById('collapse-all-btn')?.addEventListener('click', () => this.collapseAllItems());
        document.getElementById('change-theme-btn')?.addEventListener('click', () => this.changeTheme());
        document.getElementById('test-sidebar-btn')?.addEventListener('click', () => this.testSidebarFunctionality());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    setupSidebarEvents() {
        if (!this.sidebar) return;

        // Listen for sidebar item clicks
        this.sidebar.addEventListener('sidebar-item-click', (e) => {
            this.logEvent(`کلیک روی آیتم: ${e.detail.text} (${e.detail.behavior})`, 'click');
        });

        // Listen for sidebar toggle events
        this.sidebar.addEventListener('sidebar-toggle', (e) => {
            const action = e.detail.isCollapsed ? 'بسته شد' : 'باز شد';
            this.logEvent(`Sidebar ${action}`, 'info');
        });
    }

    toggleSidebar() {
        if (!this.sidebar) return;

        // Access the toggle button in shadow DOM
        const toggleBtn = this.sidebar.shadowRoot.querySelector('#toggleBtn');
        if (toggleBtn) {
            toggleBtn.click();
            this.logEvent('Sidebar تغییر وضعیت داد', 'info');
        } else {
            this.logEvent('دکمه تغییر وضعیت پیدا نشد', 'error');
        }
    }

    expandSidebar() {
        if (!this.sidebar) return;

        // If sidebar is collapsed, expand it
        if (this.sidebar.state && this.sidebar.state.collapsed) {
            const toggleBtn = this.sidebar.shadowRoot.querySelector('#toggleBtn');
            if (toggleBtn) {
                toggleBtn.click();
            }
        }
        this.logEvent('Sidebar باز شد', 'expand');
    }

    collapseSidebar() {
        if (!this.sidebar) return;

        // If sidebar is expanded, collapse it
        if (this.sidebar.state && !this.sidebar.state.collapsed) {
            const toggleBtn = this.sidebar.shadowRoot.querySelector('#toggleBtn');
            if (toggleBtn) {
                toggleBtn.click();
            }
        }
        this.logEvent('Sidebar بسته شد', 'collapse');
    }

    expandAllItems() {
        if (!this.sidebar) return;

        try {
            // Get all sidebar items
            const items = this.sidebar.querySelectorAll('sc-sidebar-item');
            let expandedCount = 0;

            items.forEach(item => {
                // Check if item has children and is expandable
                const hasChildren = item.querySelectorAll('sc-sidebar-item').length > 0;
                const behavior = item.getAttribute('behavior');
                
                if (hasChildren || behavior === 'expandable') {
                    // Expand the item if it's not already expanded
                    if (!item.expanded) {
                        item.expand();
                        expandedCount++;
                    }
                }
            });

            this.logEvent(`${expandedCount} منو باز شد`, 'expand');
        } catch (error) {
            this.logEvent(`خطا در باز کردن منوها: ${error.message}`, 'error');
        }
    }

    collapseAllItems() {
        if (!this.sidebar) return;

        try {
            // Get all sidebar items
            const items = this.sidebar.querySelectorAll('sc-sidebar-item');
            let collapsedCount = 0;

            items.forEach(item => {
                // Check if item has children and is expandable
                const hasChildren = item.querySelectorAll('sc-sidebar-item').length > 0;
                const behavior = item.getAttribute('behavior');
                
                if (hasChildren || behavior === 'expandable') {
                    // Collapse the item if it's expanded
                    if (item.expanded) {
                        item.collapse();
                        collapsedCount++;
                    }
                }
            });

            this.logEvent(`${collapsedCount} منو بسته شد`, 'collapse');
        } catch (error) {
            this.logEvent(`خطا در بستن منوها: ${error.message}`, 'error');
        }
    }

    changeTheme() {
        if (!this.sidebar) return;

        const currentTheme = this.sidebar.getAttribute('theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        this.sidebar.setAttribute('theme', newTheme);
        this.logEvent(`تم تغییر کرد به: ${newTheme}`, 'theme');
    }

    testSidebarFunctionality() {
        if (!this.sidebar) return;

        this.logEvent('شروع تست عملکرد Sidebar', 'test');
        
        // Test basic functionality
        const tests = [
            { name: 'تست آیکن‌ها', result: this.testIconDisplay() },
            { name: 'تست زیرمنوها', result: this.testSubmenuFunctionality() },
            { name: 'تست انیمیشن‌ها', result: this.testAnimations() },
            { name: 'تست جستجو', result: this.testSearchFunctionality() }
        ];

        tests.forEach(test => {
            const status = test.result ? '✅ موفق' : '❌ ناموفق';
            this.logEvent(`${test.name}: ${status}`, test.result ? 'success' : 'error');
        });

        this.logEvent('تست عملکرد Sidebar تمام شد', 'test');
    }

    testIconDisplay() {
        if (!this.sidebar) return false;
        
        try {
            // Test if FontAwesome icons are visible
            const testIcons = this.sidebar.shadowRoot.querySelectorAll('.fas, .fa');
            if (testIcons.length === 0) return false;
            
            let visibleIcons = 0;
            
            testIcons.forEach(icon => {
                if (getComputedStyle(icon).display !== 'none' && icon.offsetWidth > 0) {
                    visibleIcons++;
                }
            });
            
            return visibleIcons === testIcons.length;
        } catch (error) {
            return false;
        }
    }

    testSubmenuFunctionality() {
        if (!this.sidebar) return false;
        
        try {
            // Test if expandable items exist
            const expandableItems = this.sidebar.querySelectorAll('sc-sidebar-item[behavior="expandable"]');
            return expandableItems.length > 0;
        } catch (error) {
            return false;
        }
    }

    testAnimations() {
        if (!this.sidebar) return false;
        
        try {
            // Test if animations attribute is set
            return this.sidebar.hasAttribute('animations');
        } catch (error) {
            return false;
        }
    }

    testSearchFunctionality() {
        if (!this.sidebar) return false;
        
        try {
            // Test if search input exists
            const searchInput = this.sidebar.shadowRoot.querySelector('#searchInput');
            return searchInput !== null;
        } catch (error) {
            return false;
        }
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + T: Toggle sidebar
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            this.toggleSidebar();
        }
        
        // Ctrl/Cmd + E: Expand all items
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            this.expandAllItems();
        }
        
        // Ctrl/Cmd + C: Collapse all items
        if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
            e.preventDefault();
            this.collapseAllItems();
        }
    }

    logEvent(message, type = 'info') {
        console.log(`[${type.toUpperCase()}] ${message}`);
        
        // Try to find event log element
        const eventLog = document.getElementById('event-log-content');
        if (!eventLog) return;

        const timestamp = new Date().toLocaleTimeString('fa-IR');
        const logEntry = document.createElement('div');
        logEntry.className = `log-entry ${type}`;
        logEntry.innerHTML = `<span class="log-time">[${timestamp}]</span> ${message}`;
        
        eventLog.appendChild(logEntry);
        eventLog.scrollTop = eventLog.scrollHeight;
        
        // Add animation
        logEntry.classList.add('fade-in');
        
        // Remove old entries if too many
        const entries = eventLog.querySelectorAll('.log-entry');
        if (entries.length > 30) {
            entries[0].remove();
        }
    }

    clearEventLog() {
        const eventLog = document.getElementById('event-log-content');
        if (eventLog) {
            eventLog.innerHTML = '<div class="log-entry">لاگ پاک شد</div>';
            this.logEvent('لاگ رویدادها پاک شد', 'info');
        }
    }

    // Utility methods for demo
    getSidebarState() {
        if (!this.sidebar) return null;
        
        return {
            isCollapsed: this.sidebar.state?.collapsed || false,
            expandedItems: this.sidebar.state?.expandedItems || [],
            searchQuery: this.sidebar.state?.searchQuery || ''
        };
    }

    logSidebarState() {
        const state = this.getSidebarState();
        if (state) {
            this.logEvent(`وضعیت Sidebar: ${JSON.stringify(state, null, 2)}`, 'info');
        }
    }
}

// Initialize demo when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new SimpleSidebarDemo();
});
