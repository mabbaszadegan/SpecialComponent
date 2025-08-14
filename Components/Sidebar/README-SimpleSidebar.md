# Simple Sidebar Component

یک کامپوننت سایدبار ساده و استاندارد که با فایل JSON کار می‌کند.

## ویژگی‌ها

- ✅ طراحی ساده و تمیز
- ✅ پشتیبانی از فایل JSON به عنوان دیتا سورس
- ✅ ریسپانسیو
- ✅ انیمیشن‌های نرم
- ✅ پشتیبانی از آیکون‌ها
- ✅ قابل شخصی‌سازی
- ✅ بدون وابستگی خارجی

## فایل‌های کامپوننت

- `SimpleSidebar.js` - فایل اصلی کامپوننت
- `SimpleSidebar.css` - استایل‌های کامپوننت
- `menu-data.json` - نمونه فایل دیتا
- `simple-sidebar-demo.html` - صفحه دمو برای تست

## نحوه استفاده

### 1. اضافه کردن فایل‌ها

```html
<link rel="stylesheet" href="SimpleSidebar.css">
<script src="SimpleSidebar.js"></script>
```

### 2. ایجاد کانتینر

```html
<div id="my-sidebar"></div>
```

### 3. راه‌اندازی کامپوننت

```javascript
// با فایل JSON
const sidebar = new SimpleSidebar('my-sidebar', 'menu-data.json');

// یا با آبجکت مستقیم
const sidebar = new SimpleSidebar('my-sidebar', {
    title: "Menu",
    items: [...]
});
```

## ساختار فایل JSON

```json
{
    "title": "عنوان منو",
    "items": [
        {
            "label": "نام آیتم",
            "url": "#link",
            "action": "action-name",
            "icon": "fas fa-icon"
        }
    ]
}
```

### فیلدهای آیتم

- `label`: متن نمایشی آیتم
- `url`: لینک آیتم (اختیاری)
- `action`: نام اکشن برای هندل کردن (اختیاری)
- `icon`: کلاس آیکون FontAwesome (اختیاری)

## متدهای موجود

### `toggle()`
تغییر وضعیت باز/بسته بودن سایدبار

### `open()`
باز کردن سایدبار

### `close()`
بستن سایدبار

### `updateData(newData)`
به‌روزرسانی منو با دیتای جدید

## رویدادها

کامپوننت رویداد `sidebarAction` را ارسال می‌کند:

```javascript
document.getElementById('my-sidebar').addEventListener('sidebarAction', (e) => {
    console.log('Action:', e.detail.action);
    console.log('Element:', e.detail.element);
});
```

## شخصی‌سازی

برای تغییر ظاهر، فایل `SimpleSidebar.css` را ویرایش کنید. کلاس‌های اصلی:

- `.simple-sidebar` - کانتینر اصلی
- `.sidebar-header` - هدر سایدبار
- `.sidebar-menu` - لیست منو
- `.sidebar-link` - لینک‌های منو

## نمونه کامل

```html
<!DOCTYPE html>
<html>
<head>
    <link rel="stylesheet" href="SimpleSidebar.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
</head>
<body>
    <div id="sidebar"></div>
    
    <script src="SimpleSidebar.js"></script>
    <script>
        const sidebar = new SimpleSidebar('sidebar', 'menu-data.json');
        
        // گوش دادن به اکشن‌ها
        document.getElementById('sidebar').addEventListener('sidebarAction', (e) => {
            console.log('Menu item clicked:', e.detail.action);
        });
    </script>
</body>
</html>
```

## پشتیبانی از مرورگرها

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## لایسنس

این کامپوننت آزادانه قابل استفاده و ویرایش است.
