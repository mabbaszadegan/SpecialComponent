// Special Components - Main Application
// مدیریت اصلی پروژه و تعامل با کامپوننت‌ها

class SpecialComponentsApp {
    constructor() {
        this.currentComponent = null;
        this.currentDemo = null;
        this.sidebar = null;
        this.init();
    }

    init() {
        this.setupSidebar();
        this.setupEventListeners();
        this.setupComponentCards();
        this.setupDemoItems();
        this.loadDefaultContent();
    }

    setupSidebar() {
        // انتظار برای بارگذاری کامپوننت سایدبار
        this.waitForSidebar().then(() => {
            this.sidebar = document.querySelector('sc-sidebar');
            this.setupSidebarEventListeners();
            this.setupSidebarToggle();
        });
    }

    async waitForSidebar() {
        return new Promise((resolve) => {
            const checkSidebar = () => {
                if (document.querySelector('sc-sidebar')) {
                    resolve();
                } else {
                    setTimeout(checkSidebar, 100);
                }
            };
            checkSidebar();
        });
    }

    setupSidebarEventListeners() {
        if (!this.sidebar) return;

        // گوش دادن به کلیک‌های آیتم‌های سایدبار
        this.sidebar.addEventListener('sidebar-item-click', (event) => {
            this.handleSidebarItemClick(event.detail);
        });

        // گوش دادن به تغییر وضعیت سایدبار
        this.sidebar.addEventListener('sidebar-toggle', (event) => {
            this.handleSidebarToggle(event.detail);
        });
        
        // گوش دادن به کلیک دکمه toggle در سایدبار
        this.sidebar.addEventListener('click', (event) => {
            if (event.target.closest('#toggleBtn')) {
                // تاخیر کوتاه برای اطمینان از تغییر وضعیت
                setTimeout(() => {
                    const isCollapsed = this.sidebar._state.collapsed;
                    const contentArea = document.querySelector('.content-area');
                    
                    if (isCollapsed) {
                        contentArea.classList.add('sidebar-collapsed');
                    } else {
                        contentArea.classList.remove('sidebar-collapsed');
                    }
                }, 100);
            }
        });
    }

    setupSidebarToggle() {
        const toggleBtn = document.getElementById('sidebarToggle');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => {
                if (this.sidebar) {
                    this.sidebar.toggleCollapse();
                }
            });
        }
    }

    setupEventListeners() {
        // گوش دادن به کلیک‌های کارت‌های کامپوننت
        document.addEventListener('click', (event) => {
            const componentCard = event.target.closest('.component-card');
            if (componentCard) {
                this.handleComponentCardClick(componentCard);
            }

            const demoItem = event.target.closest('.demo-item');
            if (demoItem) {
                this.handleDemoItemClick(demoItem);
            }

            const actionBtn = event.target.closest('[data-action]');
            if (actionBtn) {
                this.handleActionButtonClick(actionBtn);
            }
        });

        // گوش دادن به تغییر اندازه صفحه
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    setupComponentCards() {
        const componentCards = document.querySelectorAll('.component-card');
        componentCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.handleComponentCardHover(card);
            });
        });
    }

    setupDemoItems() {
        const demoItems = document.querySelectorAll('.demo-item');
        demoItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                this.handleDemoItemHover(item);
            });
        });
    }

    handleSidebarItemClick(detail) {
        const { key, text, behavior } = detail;
        console.log('Sidebar item clicked:', { key, text, behavior });

        // مدیریت کلیک بر اساس نوع آیتم
        if (behavior === 'clickable') {
            this.handleClickableItem(key, text);
        } else if (behavior === 'expandable') {
            this.handleExpandableItem(key, text);
        }
    }

    handleClickableItem(key, text) {
        switch (key) {
            case 'dashboard':
                this.showDashboard();
                break;
            case 'simple-demo':
                this.loadDemo('sidebar-simple');
                break;
            case 'json-demo':
                this.loadDemo('sidebar-json');
                break;
            case 'manual-demo':
                this.loadDemo('sidebar-manual');
                break;
            case 'responsive-demo':
                this.loadDemo('sidebar-responsive');
                break;
            case 'smooth-demo':
                this.loadDemo('sidebar-smooth');
                break;
            case 'resizable-basic':
                this.loadDemo('resizable-basic');
                break;
            case 'resizable-advanced':
                this.loadDemo('resizable-advanced');
                break;
            case 'textbox-basic':
                this.loadDemo('textbox-basic');
                break;
            case 'textbox-advanced':
                this.loadDemo('textbox-advanced');
                break;
            case 'credit-basic':
                this.loadDemo('credit-basic');
                break;
            case 'credit-advanced':
                this.loadDemo('credit-advanced');
                break;
            case 'usage-guide':
                this.showDocumentation('usage');
                break;
            case 'api-reference':
                this.showDocumentation('api');
                break;
            case 'examples':
                this.showDocumentation('examples');
                break;
            case 'customization':
                this.showDocumentation('customization');
                break;
            case 'settings':
                this.showSettings();
                break;
            case 'help':
                this.showHelp();
                break;
            case 'about':
                this.showAbout();
                break;
            default:
                console.log('Unknown sidebar item:', key);
        }
    }

    handleExpandableItem(key, text) {
        console.log('Expandable item clicked:', { key, text });
        // آیتم‌های قابل گسترش معمولاً خودشان مدیریت می‌شوند
    }

    handleSidebarToggle(detail) {
        const { collapsed } = detail;
        const contentArea = document.querySelector('.content-area');
        
        if (collapsed) {
            contentArea.classList.add('sidebar-collapsed');
        } else {
            contentArea.classList.remove('sidebar-collapsed');
        }
    }

    handleComponentCardClick(card) {
        const component = card.dataset.component;
        this.currentComponent = component;
        this.showComponentDetails(component);
    }

    handleDemoItemClick(demoItem) {
        const demo = demoItem.dataset.demo;
        this.currentDemo = demo;
        this.loadDemo(demo);
    }

    handleActionButtonClick(button) {
        const action = button.dataset.action;
        const component = button.closest('.component-card')?.dataset.component;

        if (action === 'demo') {
            this.loadDemo(`${component}-basic`);
        } else if (action === 'docs') {
            this.showDocumentation(component);
        }
    }

    handleComponentCardHover(card) {
        // اضافه کردن انیمیشن hover
        card.style.transform = 'translateY(-5px)';
    }

    handleDemoItemHover(demoItem) {
        // اضافه کردن انیمیشن hover
        demoItem.style.background = '#e9ecef';
    }

    handleResize() {
        // مدیریت ریسپانسیو بودن
        if (window.innerWidth <= 768) {
            // در موبایل، سایدبار را مخفی کن
            if (this.sidebar && !this.sidebar._state.collapsed) {
                this.sidebar.toggleCollapse();
            }
        }
    }

    showDashboard() {
        this.updateContentHeader('🚀 داشبورد اصلی', 'خوش آمدید به پروژه Special Components');
        this.showComponentOverview();
    }

    showComponentDetails(component) {
        const componentNames = {
            'sidebar': 'کامپوننت سایدبار',
            'resizable': 'کامپوننت Resizable',
            'textbox': 'کامپوننت Textbox',
            'credit-card': 'کامپوننت Credit Card'
        };

        const componentDescriptions = {
            'sidebar': 'کامپوننت سایدبار پیشرفته با قابلیت‌های متنوع، انیمیشن‌های نرم و پشتیبانی کامل از RTL',
            'resizable': 'کامپوننت قابل تغییر اندازه با قابلیت‌های پیشرفته و انیمیشن‌های نرم',
            'textbox': 'کامپوننت ورودی متن پیشرفته با قابلیت‌های اعتبارسنجی و استایل‌های متنوع',
            'credit-card': 'کامپوننت کارت اعتباری با طراحی زیبا و قابلیت‌های پیشرفته'
        };

        this.updateContentHeader(
            `🔧 ${componentNames[component]}`,
            componentDescriptions[component]
        );

        this.showComponentDemos(component);
        this.showComponentDocumentation(component);
    }

    showComponentOverview() {
        const contentArea = document.querySelector('.content-area');
        const existingOverview = contentArea.querySelector('.component-overview');
        
        if (!existingOverview) {
            const overview = document.createElement('div');
            overview.className = 'component-overview';
            overview.innerHTML = `
                <div class="demo-section">
                    <h2>🎯 کامپوننت‌های موجود</h2>
                    <p>در این پروژه، مجموعه‌ای از کامپوننت‌های پیشرفته و قابل استفاده مجدد ارائه شده است:</p>
                    <ul>
                        <li><strong>سایدبار:</strong> کامپوننت ناوبری پیشرفته با پشتیبانی از RTL</li>
                        <li><strong>Resizable:</strong> کامپوننت قابل تغییر اندازه</li>
                        <li><strong>Textbox:</strong> کامپوننت ورودی متن پیشرفته</li>
                        <li><strong>Credit Card:</strong> کامپوننت کارت اعتباری</li>
                    </ul>
                </div>
            `;
            
            // اضافه کردن به ابتدای content area
            const firstChild = contentArea.firstChild;
            contentArea.insertBefore(overview, firstChild.nextSibling);
        }
    }

    showComponentDemos(component) {
        const contentArea = document.querySelector('.content-area');
        const existingDemos = contentArea.querySelector('.component-demos');
        
        if (existingDemos) {
            existingDemos.remove();
        }

        const demos = document.createElement('div');
        demos.className = 'component-demos demo-section';
        
        const demoData = this.getComponentDemos(component);
        demos.innerHTML = `
            <h2>🎬 دموهای ${demoData.name}</h2>
            <div class="demo-grid">
                ${demoData.demos.map(demo => `
                    <div class="demo-item" data-demo="${demo.key}">
                        <h4>${demo.title}</h4>
                        <p>${demo.description}</p>
                    </div>
                `).join('')}
            </div>
        `;

        contentArea.appendChild(demos);
        this.setupDemoItems();
    }

    showComponentDocumentation(component) {
        const contentArea = document.querySelector('.content-area');
        const existingDocs = contentArea.querySelector('.component-docs');
        
        if (existingDocs) {
            existingDocs.remove();
        }

        const docs = document.createElement('div');
        docs.className = 'component-docs documentation-section';
        
        const docData = this.getComponentDocumentation(component);
        docs.innerHTML = `
            <h2>📚 مستندات ${docData.name}</h2>
            <div class="doc-item">
                <h4>🚀 شروع سریع</h4>
                <p>${docData.quickStart}</p>
            </div>
            <div class="doc-item">
                <h4>🔧 API Reference</h4>
                <p>${docData.apiReference}</p>
            </div>
            <div class="doc-item">
                <h4>🎨 شخصی‌سازی</h4>
                <p>${docData.customization}</p>
            </div>
            <div class="doc-item">
                <h4>📱 ریسپانسیو</h4>
                <p>${docData.responsive}</p>
            </div>
        `;

        contentArea.appendChild(docs);
    }

    getComponentDemos(component) {
        const demoData = {
            'sidebar': {
                name: 'سایدبار',
                demos: [
                    { key: 'sidebar-simple', title: 'دمو ساده', description: 'نمایش پایه کامپوننت سایدبار' },
                    { key: 'sidebar-json', title: 'دمو JSON', description: 'سایدبار با داده‌های JSON' },
                    { key: 'sidebar-manual', title: 'دمو دستی', description: 'سایدبار با آیتم‌های دستی' },
                    { key: 'sidebar-responsive', title: 'دمو ریسپانسیو', description: 'سایدبار ریسپانسیو' },
                    { key: 'sidebar-smooth', title: 'دمو انیمیشن', description: 'سایدبار با انیمیشن‌های نرم' }
                ]
            },
            'resizable': {
                name: 'Resizable',
                demos: [
                    { key: 'resizable-basic', title: 'دمو پایه', description: 'نمایش پایه کامپوننت' },
                    { key: 'resizable-advanced', title: 'دمو پیشرفته', description: 'نمایش قابلیت‌های پیشرفته' }
                ]
            },
            'textbox': {
                name: 'Textbox',
                demos: [
                    { key: 'textbox-basic', title: 'دمو پایه', description: 'نمایش پایه کامپوننت' },
                    { key: 'textbox-advanced', title: 'دمو پیشرفته', description: 'نمایش قابلیت‌های پیشرفته' }
                ]
            },
            'credit-card': {
                name: 'Credit Card',
                demos: [
                    { key: 'credit-basic', title: 'دمو پایه', description: 'نمایش پایه کامپوننت' },
                    { key: 'credit-advanced', title: 'دمو پیشرفته', description: 'نمایش قابلیت‌های پیشرفته' }
                ]
            }
        };

        return demoData[component] || { name: 'کامپوننت', demos: [] };
    }

    getComponentDocumentation(component) {
        const docData = {
            'sidebar': {
                name: 'سایدبار',
                quickStart: 'برای استفاده از کامپوننت سایدبار، کافی است آن را در HTML خود قرار دهید و ویژگی‌های مورد نظر را تنظیم کنید.',
                apiReference: 'این کامپوننت دارای API کامل شامل متدها، ویژگی‌ها و رویدادهای مختلف است.',
                customization: 'می‌توانید ظاهر و رفتار کامپوننت را از طریق CSS و JavaScript شخصی‌سازی کنید.',
                responsive: 'کامپوننت به صورت کامل ریسپانسیو است و در تمام دستگاه‌ها به خوبی کار می‌کند.'
            },
            'resizable': {
                name: 'Resizable',
                quickStart: 'کامپوننت Resizable به شما امکان تغییر اندازه عناصر را می‌دهد.',
                apiReference: 'API این کامپوننت شامل متدهای resize، constrain و رویدادهای مختلف است.',
                customization: 'می‌توانید محدودیت‌های اندازه و رفتار resize را تنظیم کنید.',
                responsive: 'کامپوننت با سیستم ریسپانسیو سازگار است.'
            },
            'textbox': {
                name: 'Textbox',
                quickStart: 'کامپوننت Textbox ورودی متن پیشرفته با قابلیت‌های اعتبارسنجی ارائه می‌دهد.',
                apiReference: 'API شامل متدهای validate، clear و رویدادهای مختلف است.',
                customization: 'می‌توانید استایل‌ها و رفتار اعتبارسنجی را شخصی‌سازی کنید.',
                responsive: 'کامپوننت در تمام اندازه‌های صفحه به خوبی نمایش داده می‌شود.'
            },
            'credit-card': {
                name: 'Credit Card',
                quickStart: 'کامپوننت Credit Card برای نمایش و ورود اطلاعات کارت اعتباری طراحی شده است.',
                apiReference: 'API شامل متدهای format، validate و رویدادهای مختلف است.',
                customization: 'می‌توانید ظاهر کارت و رفتار اعتبارسنجی را شخصی‌سازی کنید.',
                responsive: 'کامپوننت در تمام دستگاه‌ها به خوبی نمایش داده می‌شود.'
            }
        };

        return docData[component] || {
            name: 'کامپوننت',
            quickStart: 'برای اطلاعات بیشتر، مستندات کامپوننت را مطالعه کنید.',
            apiReference: 'API کامپوننت شامل متدها و ویژگی‌های مختلف است.',
            customization: 'کامپوننت قابل شخصی‌سازی است.',
            responsive: 'کامپوننت ریسپانسیو است.'
        };
    }

    loadDemo(demoKey) {
        console.log('Loading demo:', demoKey);
        
        // در اینجا می‌توانید دموهای مختلف را بارگذاری کنید
        // برای مثال، redirect به صفحات دمو یا بارگذاری محتوای داینامیک
        
        this.updateContentHeader('🎬 نمایش دمو', `در حال بارگذاری دمو: ${demoKey}`);
        
        // نمایش پیام موقت
        this.showTemporaryMessage(`دمو ${demoKey} در حال بارگذاری است...`);
    }

    showDocumentation(type) {
        console.log('Showing documentation:', type);
        
        this.updateContentHeader('📚 مستندات', `مستندات ${type}`);
        
        // نمایش مستندات مربوطه
        this.showDocumentationContent(type);
    }

    showDocumentationContent(type) {
        const contentArea = document.querySelector('.content-area');
        const existingContent = contentArea.querySelector('.documentation-content');
        
        if (existingContent) {
            existingContent.remove();
        }

        const content = document.createElement('div');
        content.className = 'documentation-content documentation-section';
        
        const docContent = this.getDocumentationContent(type);
        content.innerHTML = `
            <h2>📚 ${docContent.title}</h2>
            <div class="doc-item">
                <h4>${docContent.subtitle}</h4>
                <p>${docContent.description}</p>
            </div>
        `;

        contentArea.appendChild(content);
    }

    getDocumentationContent(type) {
        const docContent = {
            'usage': {
                title: 'راهنمای استفاده',
                subtitle: '🚀 شروع سریع',
                description: 'برای استفاده از کامپوننت‌ها، کافی است فایل JavaScript مربوطه را در HTML خود قرار دهید و از تگ‌های HTML مربوطه استفاده کنید.'
            },
            'api': {
                title: 'مرجع API',
                subtitle: '🔧 API Reference',
                description: 'تمام کامپوننت‌ها دارای API کامل شامل متدها، ویژگی‌ها و رویدادهای مختلف هستند.'
            },
            'examples': {
                title: 'مثال‌ها',
                subtitle: '💡 نمونه‌های کاربردی',
                description: 'نمونه‌های مختلفی از استفاده از کامپوننت‌ها در پروژه‌های واقعی ارائه شده است.'
            },
            'customization': {
                title: 'شخصی‌سازی',
                subtitle: '🎨 نحوه شخصی‌سازی',
                description: 'می‌توانید ظاهر و رفتار تمام کامپوننت‌ها را از طریق CSS و JavaScript شخصی‌سازی کنید.'
            }
        };

        return docContent[type] || {
            title: 'مستندات',
            subtitle: '📖 اطلاعات',
            description: 'مستندات مورد نظر یافت نشد.'
        };
    }

    showSettings() {
        this.updateContentHeader('⚙️ تنظیمات', 'تنظیمات پروژه و کامپوننت‌ها');
        this.showTemporaryMessage('بخش تنظیمات در حال توسعه است...');
    }

    showHelp() {
        this.updateContentHeader('❓ راهنما', 'راهنمای استفاده از پروژه');
        this.showTemporaryMessage('بخش راهنما در حال توسعه است...');
    }

    showAbout() {
        this.updateContentHeader('ℹ️ درباره', 'اطلاعات پروژه Special Components');
        this.showTemporaryMessage('بخش درباره در حال توسعه است...');
    }

    updateContentHeader(title, description) {
        const header = document.querySelector('.content-header');
        if (header) {
            const titleElement = header.querySelector('h1');
            const descElement = header.querySelector('p');
            
            if (titleElement) titleElement.textContent = title;
            if (descElement) descElement.textContent = description;
        }
    }

    showTemporaryMessage(message) {
        const contentArea = document.querySelector('.content-area');
        const existingMessage = contentArea.querySelector('.temporary-message');
        
        if (existingMessage) {
            existingMessage.remove();
        }

        const messageElement = document.createElement('div');
        messageElement.className = 'temporary-message demo-section';
        messageElement.innerHTML = `
            <h2>📢 پیام</h2>
            <p>${message}</p>
        `;

        contentArea.appendChild(messageElement);

        // حذف پیام بعد از 5 ثانیه
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.remove();
            }
        }, 5000);
    }

    loadDefaultContent() {
        // بارگذاری محتوای پیش‌فرض
        this.showDashboard();
    }
}

// راه‌اندازی اپلیکیشن بعد از بارگذاری صفحه
document.addEventListener('DOMContentLoaded', () => {
    window.specialComponentsApp = new SpecialComponentsApp();
});

// Export برای استفاده در ماژول‌های دیگر
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SpecialComponentsApp;
}
