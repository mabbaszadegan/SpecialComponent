// Manual Sidebar Demo Script
class ManualSidebarDemo {
    constructor() {
        this.sidebar = null;
        this.itemCounter = 0;
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
            this.sidebar = document.getElementById('manual-sidebar');
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
        document.getElementById('add-item-btn')?.addEventListener('click', () => this.addItem());
        document.getElementById('remove-item-btn')?.addEventListener('click', () => this.removeItem());
        document.getElementById('expand-all-btn')?.addEventListener('click', () => this.expandAllItems());
        document.getElementById('collapse-all-btn')?.addEventListener('click', () => this.collapseAllItems());
        document.getElementById('toggle-sidebar-btn')?.addEventListener('click', () => this.toggleSidebar());
        document.getElementById('clear-log-btn')?.addEventListener('click', () => this.clearEventLog());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    }

    setupSidebarEvents() {
        if (!this.sidebar) return;

        // Listen for sidebar events
        this.sidebar.addEventListener('item-click', (e) => {
            this.logEvent(`کلیک روی آیتم: ${e.detail.item.text}`, 'click');
        });

        this.sidebar.addEventListener('sidebar-toggle', (e) => {
            const action = e.detail.isCollapsed ? 'بسته شد' : 'باز شد';
            this.logEvent(`Sidebar ${action}`, 'info');
        });

        // Listen for sidebar resize events
        this.sidebar.addEventListener('sc-sidebar-resize', (e) => {
            this.handleSidebarResize(e.detail);
        });
    }

    addItem() {
        if (!this.sidebar) return;

        this.itemCounter++;
        const newItem = {
            id: `custom-item-${this.itemCounter}`,
            text: `آیتم جدید ${this.itemCounter}`,
            icon: 'fas fa-plus',
            description: 'آیتم اضافه شده توسط کاربر',
            behavior: 'clickable'
        };

        this.sidebar.addItem(newItem);
        this.logEvent(`آیتم جدید اضافه شد: ${newItem.text}`, 'success');
    }

    removeItem() {
        if (!this.sidebar) return;

        const items = this.sidebar.items;
        if (items.length > 0) {
            const lastItem = items[items.length - 1];
            this.sidebar.removeItem(lastItem.id);
            this.logEvent(`آیتم حذف شد: ${lastItem.text}`, 'warning');
        } else {
            this.logEvent('هیچ آیتمی برای حذف وجود ندارد', 'info');
        }
    }

    expandAllItems() {
        if (!this.sidebar) return;

        this.sidebar.scSidebarExpandAll();
        this.logEvent('تمام آیتم‌ها باز شدند', 'expand');
    }

    collapseAllItems() {
        if (!this.sidebar) return;

        this.sidebar.scSidebarCollapseAll();
        this.logEvent('تمام آیتم‌ها بسته شدند', 'collapse');
    }

    toggleSidebar() {
        if (!this.sidebar) return;

        this.sidebar.toggleSidebar();
        const isCollapsed = this.sidebar.currentState.isCollapsed;
        const action = isCollapsed ? 'بسته شد' : 'باز شد';
        this.logEvent(`Sidebar ${action}`, 'info');
    }

    handleSidebarResize(detail) {
        const sidebarContainer = document.querySelector('.sidebar');
        if (sidebarContainer) {
            if (detail.collapsed) {
                sidebarContainer.classList.add('collapsed');
                this.logEvent(`Sidebar کوچک شد به عرض ${detail.width}`, 'info');
            } else {
                sidebarContainer.classList.remove('collapsed');
                this.logEvent(`Sidebar بزرگ شد به عرض ${detail.width}`, 'info');
            }
        }
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + A: Add item
        if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
            e.preventDefault();
            this.addItem();
        }
        
        // Ctrl/Cmd + R: Remove item
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            this.removeItem();
        }
        
        // Ctrl/Cmd + T: Toggle sidebar
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            this.toggleSidebar();
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
            isCollapsed: this.sidebar.currentState.isCollapsed,
            activeItem: this.sidebar.currentState.activeItem,
            totalItems: this.sidebar.items.length
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
    new ManualSidebarDemo();
});
