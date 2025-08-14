# Manual Sidebar Demo

این دمو نشان‌دهنده نحوه استفاده از کامپوننت Sidebar در حالت دستی است، جایی که کاربر می‌تواند تگ‌های منو را خودش تعریف کند.

## ویژگی‌ها

### ✨ تعریف دستی منو
- تمام آیتم‌های منو با استفاده از تگ‌های HTML تعریف شده‌اند
- پشتیبانی از ساختار سلسله‌مراتبی چند سطحی
- امکان تعریف آیکون، توضیحات، نشان‌ها (badge) و رفتارهای مختلف

### 🎛️ کنترل‌های تعاملی
- **افزودن آیتم**: اضافه کردن آیتم جدید به صورت پویا
- **حذف آیتم**: حذف آخرین آیتم اضافه شده
- **باز کردن همه**: باز کردن تمام آیتم‌های قابل گسترش
- **بستن همه**: بستن تمام آیتم‌های باز شده
- **تغییر وضعیت**: باز/بسته کردن sidebar

### ⌨️ میانبرهای صفحه کلید
- `Ctrl/Cmd + E`: باز کردن تمام آیتم‌ها
- `Ctrl/Cmd + C`: بستن تمام آیتم‌ها
- `Ctrl/Cmd + T`: تغییر وضعیت sidebar
- `Ctrl/Cmd + A`: افزودن آیتم جدید
- `Ctrl/Cmd + R`: حذف آخرین آیتم

### 📊 لاگ رویدادها
- نمایش تمام رویدادهای sidebar در زمان واقعی
- دسته‌بندی رویدادها بر اساس نوع (کلیک، باز/بسته شدن، خطا)
- امکان پاک کردن لاگ

### 🔔 اعلان‌های تعاملی
- نمایش پیام‌های موفقیت، خطا و هشدار
- انیمیشن‌های جذاب برای ورود و خروج
- بسته شدن خودکار پس از 5 ثانیه

## ساختار فایل‌ها

```
manual-sidebar-demo/
├── index.html          # فایل HTML اصلی
├── styles.css          # استایل‌های CSS
├── script.js           # کدهای JavaScript
└── README.md           # این فایل
```

## نحوه استفاده

### 1. تعریف آیتم‌های منو
```html
<sc-sidebar-item 
    key="dashboard" 
    text="داشبورد" 
    icon="fas fa-tachometer-alt"
    description="نمایش کلی سیستم"
    behavior="clickable">
</sc-sidebar-item>
```

### 2. آیتم‌های سلسله‌مراتبی
```html
<sc-sidebar-item key="users" text="کاربران" icon="fas fa-users">
    <sc-sidebar-item key="user-list" text="لیست کاربران"></sc-sidebar-item>
    <sc-sidebar-item key="user-add" text="افزودن کاربر"></sc-sidebar-item>
</sc-sidebar-item>
```

### 3. ویژگی‌های پیشرفته
- `key`: شناسه یکتا برای آیتم
- `text`: متن نمایشی آیتم
- `icon`: آیکون FontAwesome
- `description`: توضیحات اضافی
- `badge`: نشان عددی یا متنی
- `behavior`: رفتار آیتم (clickable, auto-expand, always-open)
- `disabled`: غیرفعال کردن آیتم

## API های JavaScript

### افزودن آیتم
```javascript
sidebar.scSidebarAddItem({
    key: 'new-item',
    text: 'آیتم جدید',
    icon: 'fas fa-star',
    description: 'توضیحات'
});
```

### حذف آیتم
```javascript
sidebar.scSidebarRemoveItem('item-key');
```

### باز/بسته کردن آیتم‌ها
```javascript
sidebar.scSidebarExpandAll();      // باز کردن همه
sidebar.scSidebarCollapseAll();    // بستن همه
sidebar.scSidebarToggle();         // تغییر وضعیت sidebar
```

## رویدادها

### sc-sidebar-item-click
```javascript
sidebar.addEventListener('sc-sidebar-item-click', (e) => {
    console.log('کلیک روی آیتم:', e.detail.item);
});
```

### sc-sidebar-collapse
```javascript
sidebar.addEventListener('sc-sidebar-collapse', (e) => {
    console.log('وضعیت sidebar:', e.detail.collapsed);
});
```

## استایل‌دهی

تمام استایل‌ها در فایل `styles.css` تعریف شده‌اند و شامل:
- طراحی ریسپانسیو
- انیمیشن‌های CSS
- تم‌های رنگی مختلف
- حالت‌های hover و focus
- پشتیبانی از چاپ

## پشتیبانی از مرورگرها

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## نکات مهم

1. **ترتیب بارگذاری**: ابتدا فایل `sidebar.js` و سپس `script.js` بارگذاری شود
2. **FontAwesome**: برای نمایش آیکون‌ها، CDN FontAwesome باید بارگذاری شود
3. **RTL**: این دمو برای زبان فارسی و جهت RTL بهینه شده است
4. **حفظ وضعیت**: sidebar به صورت خودکار وضعیت آیتم‌ها را در localStorage ذخیره می‌کند

## مثال‌های بیشتر

برای مشاهده مثال‌های بیشتر و روش‌های مختلف استفاده، به فولدر `demo` مراجعه کنید:
- `simple-sidebar-demo/`: دموی ساده
- `enhanced-sidebar-demo/`: دموی پیشرفته
- `fixed-sidebar-demo/`: دموی ثابت
- `sidebar-demo/`: دموی کامل

