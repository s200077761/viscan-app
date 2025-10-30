# 🚀 دليل النشر على Vercel من Mac

## 📋 المتطلبات الأساسية

قبل البدء، تأكد من تثبيت:
- ✅ Node.js (v18 أو أحدث)
- ✅ Git
- ✅ Vercel CLI

---

## 🔧 الخطوة 1: تثبيت الأدوات المطلوبة

### تثبيت Node.js (إذا لم يكن مثبتاً)
```bash
# تحقق من التثبيت
node --version

# إذا لم يكن مثبتاً، حمّله من:
# https://nodejs.org/
```

### تثبيت pnpm
```bash
npm install -g pnpm

# تحقق من التثبيت
pnpm --version
```

### تثبيت Vercel CLI
```bash
npm install -g vercel

# تحقق من التثبيت
vercel --version
```

---

## 📥 الخطوة 2: استنساخ المشروع

```bash
# افتح Terminal
cd ~/Desktop

# استنسخ المشروع من GitHub
git clone https://github.com/s200077761/viscan-app.git

# ادخل للمجلد
cd viscan-app

# تحقق من الملفات
ls -la
```

يجب أن ترى:
- ✅ `package.json`
- ✅ `vercel.json`
- ✅ `client/` folder
- ✅ `server/` folder
- ✅ `drizzle/` folder

---

## 📦 الخطوة 3: تثبيت التبعيات

```bash
# تأكد أنك في مجلد viscan-app
pwd
# يجب أن يظهر: /Users/YourUsername/Desktop/viscan-app

# ثبّت التبعيات
pnpm install
```

⏱️ **انتظر 2-5 دقائق** حتى تكتمل التثبيت

---

## 🔐 الخطوة 4: تسجيل الدخول لـ Vercel

```bash
vercel login
```

سيفتح متصفح للتسجيل:
1. اختر **Continue with Email**
2. أدخل: `msmbm2003@gmail.com`
3. افتح البريد وانقر على رابط التأكيد
4. ارجع للـ Terminal

---

## 🚀 الخطوة 5: النشر على Vercel

```bash
# تأكد أنك في مجلد المشروع
cd ~/Desktop/viscan-app

# ابدأ النشر
vercel --prod
```

### الأسئلة المتوقعة:

```
? Set up and deploy "~/Desktop/viscan-app"? 
→ اضغط Y ثم Enter

? Which scope do you want to deploy to?
→ اختر: Mohammed ALOHAYDIB's projects (أو حسابك الشخصي)

? Link to existing project?
→ اضغط N ثم Enter

? What's your project's name?
→ اكتب: viscan-app ثم Enter

? In which directory is your code located?
→ اضغط Enter مباشرة (.)

? Want to override the settings? [y/N]
→ اضغط N ثم Enter
```

---

## ⏱️ الخطوة 6: انتظر اكتمال النشر

سترى:
```
🔨 Building...
📦 Uploading...
✅ Deploying...
```

بعد **3-5 دقائق** سيظهر:

```
✅ Production: https://viscan-app-xxx.vercel.app
```

---

## 🎉 الخطوة 7: اختبار الموقع

1. **افتح الرابط** الذي ظهر
2. **تحقق من**:
   - ✅ الصفحة الرئيسية تعمل
   - ✅ الصور تظهر
   - ✅ الأزرار تعمل

---

## ⚙️ الخطوة 8: إضافة Environment Variables

### على موقع Vercel:

1. اذهب إلى: https://vercel.com/dashboard
2. اختر مشروع **viscan-app**
3. اضغط **Settings** → **Environment Variables**
4. أضف المتغيرات التالية:

```
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
FIREBASE_API_KEY=your_firebase_api_key
FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
FIREBASE_PROJECT_ID=your_firebase_project_id
```

5. اضغط **Save**
6. اضغط **Redeploy** لإعادة النشر

---

## 🔄 تحديث المشروع مستقبلاً

```bash
# ادخل للمجلد
cd ~/Desktop/viscan-app

# اسحب آخر التحديثات
git pull

# ثبّت التبعيات الجديدة (إن وجدت)
pnpm install

# انشر التحديثات
vercel --prod
```

---

## 🆘 حل المشاكل الشائعة

### مشكلة: `command not found: pnpm`
```bash
npm install -g pnpm
```

### مشكلة: `command not found: vercel`
```bash
npm install -g vercel
```

### مشكلة: `Build failed`
```bash
# تحقق من الأخطاء في Terminal
# تأكد من تثبيت جميع التبعيات
pnpm install

# جرّب البناء محلياً
pnpm build
```

### مشكلة: `Permission denied`
```bash
# أضف sudo قبل الأمر
sudo npm install -g pnpm
sudo npm install -g vercel
```

---

## 📱 الخطوة التالية: نشر على App Store

بعد نجاح النشر على Vercel، يمكنك:
1. تحويل المشروع لتطبيق iOS باستخدام Capacitor
2. رفعه على App Store

راجع ملف: `IOS_DEPLOYMENT_GUIDE.md`

---

## 📞 الدعم

إذا واجهت أي مشكلة:
- تحقق من Terminal للأخطاء
- تأكد من اتصال الإنترنت
- تأكد من تسجيل الدخول لـ Vercel
- راجع: https://vercel.com/docs

---

**بالتوفيق! 🚀**
