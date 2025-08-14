// JSON Sidebar Demo Script
class JSONSidebarDemo {
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
            this.sidebar = document.getElementById('json-sidebar');
            if (this.sidebar && this.sidebar.shadowRoot) {
                this.setupSidebarEvents();
                this.updateDataInfo();
                this.logEvent('Sidebar component آماده شد', 'success');
            } else {
                setTimeout(checkSidebar, 100);
            }
        };
        checkSidebar();
    }

    setupEventListeners() {
        // Demo control buttons
        document.getElementById('refresh-data-btn')?.addEventListener('click', () => this.refreshData());
        document.getElementById('expand-all-btn')?.addEventListener('click', () => this.expandAllItems());
        document.getElementById('collapse-all-btn')?.addEventListener('click', () => this.collapseAllItems());
        document.getElementById('toggle-sidebar-btn')?.addEventListener('click', () => this.toggleSidebar());
        document.getElementById('change-theme-btn')?.addEventListener('click', () => this.changeTheme());
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

        // Listen for data loading events
        this.sidebar.addEventListener('load', () => {
            this.updateDataInfo();
            this.logEvent('داده‌های sidebar بارگذاری شد', 'success');
        });
    }

    refreshData() {
        if (!this.sidebar) return;

        this.logEvent('شروع بروزرسانی داده‌ها...', 'info');
        
        // Trigger data refresh by updating the data source attribute
        const currentSource = this.sidebar.getAttribute('data-source');
        this.sidebar.setAttribute('data-source', currentSource + '?t=' + Date.now());
        
        // Reset to original source after a short delay
        setTimeout(() => {
            this.sidebar.setAttribute('data-source', currentSource);
        }, 100);
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

    changeTheme() {
        if (!this.sidebar) return;

        const currentTheme = this.sidebar.getAttribute('theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.sidebar.setAttribute('theme', newTheme);
        
        const themeName = newTheme === 'light' ? 'روشن' : 'تاریک';
        this.logEvent(`تم تغییر کرد به: ${themeName}`, 'info');
    }

    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + R: Refresh data
        if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
            e.preventDefault();
            this.refreshData();
        }
        
        // Ctrl/Cmd + E: Expand all
        if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
            e.preventDefault();
            this.expandAllItems();
        }
        
        // Ctrl/Cmd + C: Collapse all
        if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
            e.preventDefault();
            this.collapseAllItems();
        }
        
        // Ctrl/Cmd + T: Toggle sidebar
        if ((e.ctrlKey || e.metaKey) && e.key === 't') {
            e.preventDefault();
            this.toggleSidebar();
        }
    }

    updateDataInfo() {
        if (!this.sidebar) return;

        const items = this.sidebar.items;
        const mainItemsCount = items.length;
        let totalItemsCount = mainItemsCount;

        // Count all nested items
        const countNestedItems = (itemList) => {
            itemList.forEach(item => {
                if (item.children && item.children.length > 0) {
                    totalItemsCount += item.children.length;
                    countNestedItems(item.children);
                }
            });
        };
        countNestedItems(items);

        // Update display
        const mainItemsElement = document.getElementById('main-items-count');
        const totalItemsElement = document.getElementById('total-items-count');
        const lastUpdateElement = document.getElementById('last-update');

        if (mainItemsElement) mainItemsElement.textContent = mainItemsCount;
        if (totalItemsElement) totalItemsElement.textContent = totalItemsCount;
        if (lastUpdateElement) {
            const now = new Date();
            lastUpdateElement.textContent = now.toLocaleString('fa-IR');
        }

        this.logEvent(`اطلاعات بروزرسانی شد: ${mainItemsCount} آیتم اصلی، ${totalItemsCount} کل آیتم‌ها`, 'info');
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
}

// Initialize demo when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new JSONSidebarDemo();
});
