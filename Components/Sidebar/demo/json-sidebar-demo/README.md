# JSON Sidebar Demo

این دمو نشان‌دهنده استفاده از کامپوننت Sidebar با داده‌های JSON خارجی است.

## ویژگی‌ها

### ✨ بارگذاری از JSON
- منو از فایل JSON خارجی بارگذاری می‌شود
- امکان تغییر ساختار منو بدون تغییر کد
- پشتیبانی از منوهای چند سطحی و پیچیده

### 🎛️ کنترل‌های پیشرفته
- **بروزرسانی داده‌ها**: بارگذاری مجدد منو از فایل JSON
- **باز کردن همه**: باز کردن تمام آیتم‌های قابل گسترش
- **بستن همه**: بستن تمام آیتم‌های باز شده
- **تغییر وضعیت**: باز/بسته کردن sidebar
- **تغییر تم**: تغییر بین تم روشن و تاریک

### ⌨️ میانبرهای صفحه کلید
- `Ctrl/Cmd + R`: بروزرسانی داده‌ها
- `Ctrl/Cmd + E`: باز کردن تمام آیتم‌ها
- `Ctrl/Cmd + C`: بستن تمام آیتم‌ها
- `Ctrl/Cmd + T`: تغییر وضعیت sidebar
- `Ctrl/Cmd + Shift + T`: تغییر تم

### 📊 نمایش اطلاعات
- نمایش تعداد آیتم‌های اصلی
- نمایش تعداد کل آیتم‌ها
- نمایش زمان آخرین بروزرسانی
- لاگ رویدادهای sidebar

### 🔔 اعلان‌های تعاملی
- نمایش پیام‌های موفقیت، خطا و هشدار
- انیمیشن‌های جذاب برای ورود و خروج
- بسته شدن خودکار پس از 5 ثانیه

## ساختار فایل‌ها

```
json-sidebar-demo/
├── index.html          # فایل HTML اصلی
├── styles.css          # استایل‌های CSS
├── script.js           # کدهای JavaScript
├── menu-data.json      # فایل داده‌های منو
└── README.md           # این فایل
```

## ساختار فایل JSON

### فرمت کلی
```json
{
  "menu": [
    {
      "key": "unique-key",
      "text": "متن نمایشی",
      "icon": "fas fa-icon-class",
      "description": "توضیحات آیتم",
      "behavior": "clickable",
      "badge": "5",
      "children": []
    }
  ]
}
```

### ویژگی‌های آیتم
- `key`: شناسه یکتا برای آیتم
- `text`: متن نمایشی آیتم
- `icon`: آیکون FontAwesome
- `description`: توضیحات اضافی
- `behavior`: رفتار آیتم (clickable, auto-expand, always-open)
- `badge`: نشان عددی یا متنی
- `children`: آرایه‌ای از آیتم‌های فرزند

### مثال آیتم چند سطحی
```json
{
  "key": "user-management",
  "text": "مدیریت کاربران",
  "icon": "fas fa-users-cog",
  "description": "مدیریت کامل کاربران سیستم",
  "behavior": "clickable",
  "badge": "12",
  "children": [
    {
      "key": "user-list",
      "text": "لیست کاربران",
      "icon": "fas fa-list",
      "description": "مشاهده و مدیریت تمام کاربران",
      "behavior": "clickable",
      "children": []
    }
  ]
}
```

## نحوه استفاده

### 1. تنظیم data-source
```html
<sc-sidebar 
    data-source="menu-data.json"
    searchable
    filterable
    auto-expand-on-load>
</sc-sidebar>
```

### 2. ویژگی‌های پیشنهادی
- `searchable`: فعال کردن جستجو
- `filterable`: فعال کردن فیلتر
- `auto-expand-on-load`: باز شدن خودکار آیتم‌های مهم
- `remember-state`: حفظ وضعیت آیتم‌ها

## API های JavaScript

### بروزرسانی داده‌ها
```javascript
sidebar.scSidebarRefreshData();
```

### کنترل آیتم‌ها
```javascript
sidebar.scSidebarExpandAll();      // باز کردن همه
sidebar.scSidebarCollapseAll();    // بستن همه
sidebar.scSidebarToggle();         // تغییر وضعیت sidebar
```

### تغییر تم
```javascript
sidebar.setAttribute('theme', 'dark');  // تغییر به تم تاریک
sidebar.setAttribute('theme', 'light'); // تغییر به تم روشن
```

## رویدادها

### sc-sidebar-data-refreshed
```javascript
sidebar.addEventListener('sc-sidebar-data-refreshed', (e) => {
    console.log('داده‌ها بروزرسانی شد:', e.detail);
});
```

### sc-sidebar-data-error
```javascript
sidebar.addEventListener('sc-sidebar-data-error', (e) => {
    console.error('خطا در بارگذاری:', e.detail.error);
});
```

### sc-sidebar-item-click
```javascript
sidebar.addEventListener('sc-sidebar-item-click', (e) => {
    console.log('کلیک روی آیتم:', e.detail.item);
});
```

## استایل‌دهی

تمام استایل‌ها در فایل `styles.css` تعریف شده‌اند و شامل:
- طراحی ریسپانسیو
- انیمیشن‌های CSS پیشرفته
- تم‌های رنگی مختلف
- حالت‌های loading
- نمایش اطلاعات داده‌ها

## نکات مهم

1. **مسیر فایل JSON**: فایل `menu-data.json` باید در همان پوشه دمو قرار گیرد
2. **ساختار داده**: فایل JSON باید دارای کلید `menu` باشد
3. **آیکون‌ها**: از FontAwesome برای نمایش آیکون‌ها استفاده می‌شود
4. **RTL**: این دمو برای زبان فارسی و جهت RTL بهینه شده است
5. **حفظ وضعیت**: sidebar به صورت خودکار وضعیت آیتم‌ها را ذخیره می‌کند

## مزایای استفاده از JSON

- **انعطاف‌پذیری**: امکان تغییر منو بدون تغییر کد
- **مدیریت آسان**: ویرایش منو در فایل متنی ساده
- **توسعه سریع**: اضافه کردن آیتم‌های جدید بدون کدنویسی
- **نگهداری آسان**: جداسازی منطق از داده‌ها
- **قابلیت استفاده مجدد**: استفاده از همان فایل JSON در پروژه‌های مختلف

## مثال‌های بیشتر

برای مشاهده مثال‌های دیگر، به دموهای دیگر مراجعه کنید:
- `manual-sidebar-demo/`: دموی منوی دستی
- `simple-sidebar-demo/`: دموی ساده
- `enhanced-sidebar-demo/`: دموی پیشرفته
- `fixed-sidebar-demo/`: دموی ثابت

