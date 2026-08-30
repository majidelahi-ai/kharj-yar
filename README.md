<div dir="rtl">

# خرج یار — مدیریت مالی شخصی

اپلیکیشن حرفه‌ای و مدرن مدیریت هزینه‌ها و امور مالی شخصی با رابط کاربری فارسی RTL

---

## ✨ ویژگی‌ها

| ویژگی | توضیح |
|:---|:---|
| 💰 ثبت درآمد و هزینه | با دسته‌بندی و توضیحات |
| 📊 نمودار و گزارش | تحلیل بصری مالی با Recharts |
| 📅 تقویم شمسی | کامل با jalaali-js |
| 💱 تومان / ریال | تبدیل آسان بین واحدهای پولی |
| 📱 اندروید | بیلد APK از طریق Capacitor |
| 🎨 طراحی مدرن | مینیمال، RTL، فارسی |
| 💾 ذخیره‌سازی محلی | localStorage با Zustand |
| 📱 Responsive | سازگار با تمام اندازه‌های صفحه |

---

## 📦 تکنولوژی‌ها

| لایه | تکنولوژی |
|:---|:---|
| فرانت‌اند | React 18 + TypeScript |
| استایل | Tailwind CSS |
| State | Zustand |
| نمودار | Recharts |
| تقویم | Jalaali-js |
| آیکون | Lucide React |
| بیلد وب | Vite 6 |
| اندروید | Capacitor |

---

## 🚀 اجرا در مرورگر

```bash
# نصب وابستگی‌ها
npm install

# اجرای توسعه
npm run dev

# بیلد پروداکشن
npm run build
```

سرور توسعه روی `http://localhost:5173` اجرا می‌شود.

---

## 📱 بیلد اندروید (APK)

### روش ۱: خودکار (GitHub Actions) ⭐ پیشنهادی

فقط کافیه کد رو به GitHub پوش بدید:

```bash
git init
git add .
git commit -m "خرج یار v1.0.0"
git remote add origin https://github.com/majidelahi-ai/-.git
git push -u origin main
```

**GitHub Actions به صورت خودکار:**
1. وب‌اپ رو بیلد می‌کنه
2. پروژه اندروید رو سینک می‌کنه
3. APK رو بیلد می‌کنه
4. در **Releases** آپلود می‌کنه

**دانلود APK:**
1. برید به تب **Releases** ریپازیتوری
2. آخرین نسخه رو دانلود کنید
3. `kharjyar-debug-apk` رو مستقیم نصب کنید

### روش ۲: محلی (بدون Android Studio)

```bash
# نصب JDK 17 (اگر ندارید)
# Windows: winget install EclipseAdoptium.Temurin.17.JDK
# macOS: brew install openjdk@17
# Linux: sudo apt install openjdk-17-jdk

# بیلد اندروید
npm run android

# APK در این مسیر قرار می‌گیره:
# android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 📂 ساختار پروژه

```
kharjyar/
├── src/
│   ├── components/
│   │   ├── Views.tsx          # صفحات اصلی
│   │   ├── MoreViews.tsx      # صفحات بیشتر
│   │   └── TxModal.tsx        # مودال تراکنش
│   ├── lib/
│   │   ├── format.ts          # فرمت اعداد و پول
│   │   └── jalali.ts          # توابع تقویم شمسی
│   ├── store/
│   │   └── useStore.ts        # مدیریت وضعیت با Zustand
│   ├── App.tsx                # کامپوننت اصلی
│   └── main.tsx               # نقطه ورود
├── android/                   # پروژه اندروید (Capacitor)
├── .github/workflows/
│   └── build.yml              # CI/CD خودکار
├── capacitor.config.ts        # تنظیمات Capacitor
├── vite.config.ts             # تنظیمات Vite
├── tailwind.config.js         # تنظیمات Tailwind
└── package.json
```

---

## 📋 مجوزها

MIT License — استفاده آزاد در پروژه‌های شخصی و تجاری

---

## 🤝 مشارکت

خوشحال می‌شیم در بهبود پروژه مشارکت کنید:

1. Fork کنید
2. Branch جدید بسازید
3. تغییرات رو commit کنید
4. Pull Request بفرستید

---

## 📞 ارتباط

سوال یا پیشنهادی دارید؟ Issues ریپازیتوری رو باز کنید.

---

<div align="center">

**ساخته شده با ❤️ برای جامعه فارسی‌زبان**

</div>

</div>
