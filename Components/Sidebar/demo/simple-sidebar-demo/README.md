# Simple Sidebar Demo

این دمو نشان‌دهنده استفاده ساده و پایه از کامپوننت Sidebar است.

## ویژگی‌ها

### ✨ سادگی
- ساختار ساده و قابل فهم
- پیکربندی پایه sidebar
- آیتم‌های ثابت و از پیش تعریف شده

### 🎛️ کنترل‌های ساده
- **تغییر وضعیت**: باز/بسته کردن sidebar
- **باز کردن**: باز کردن sidebar
- **بستن**: بستن sidebar

### ⌨️ میانبرهای صفحه کلید
- `Ctrl/Cmd + T`: تغییر وضعیت sidebar
- `Ctrl/Cmd + E`: باز کردن sidebar
- `Ctrl/Cmd + C`: بستن sidebar

### 📊 لاگ رویدادها
- نمایش رویدادهای sidebar در زمان واقعی
- دسته‌بندی رویدادها بر اساس نوع
- امکان پاک کردن لاگ

## ساختار فایل‌ها

```
simple-sidebar-demo/
├── index.html          # فایل HTML اصلی
├── styles.css          # استایل‌های CSS
├── script.js           # کدهای JavaScript
└── README.md           # این فایل
```

## نحوه استفاده

### تعریف آیتم‌های منو
```html
<sc-sidebar-item 
    key="dashboard" 
    text="داشبورد" 
    icon="fas fa-tachometer-alt"
    description="نمایش کلی سیستم"
    behavior="clickable">
</sc-sidebar-item>
```

### ویژگی‌های آیتم
- `key`: شناسه یکتا برای آیتم
- `text`: متن نمایشی آیتم
- `icon`: آیکون FontAwesome
- `description`: توضیحات اضافی
- `behavior`: رفتار آیتم

## API های JavaScript

### کنترل sidebar
```javascript
sidebar.scSidebarToggle();      // تغییر وضعیت
sidebar.scSidebarExpand();      // باز کردن
sidebar.scSidebarCollapse();    // بستن
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

## نکات مهم

1. **ترتیب بارگذاری**: ابتدا فایل `sidebar.js` و سپس `script.js` بارگذاری شود
2. **FontAwesome**: برای نمایش آیکون‌ها، CDN FontAwesome باید بارگذاری شود
3. **RTL**: این دمو برای زبان فارسی و جهت RTL بهینه شده است
4. **حفظ وضعیت**: sidebar به صورت خودکار وضعیت را در localStorage ذخیره می‌کند

## مثال‌های بیشتر

برای مشاهده مثال‌های پیشرفته‌تر، به دموهای دیگر مراجعه کنید:
- `manual-sidebar-demo/`: دموی منوی دستی
- `enhanced-sidebar-demo/`: دموی پیشرفته
- `fixed-sidebar-demo/`: دموی ثابت

