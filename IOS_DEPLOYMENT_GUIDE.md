# 📱 دليل نشر ViScan على App Store

## المتطلبات الأساسية

- ✅ جهاز Mac مع macOS
- ✅ Xcode مثبت
- ✅ حساب Apple Developer ($99/سنة)
- ✅ Apple ID: msmbm2003@gmail.com

---

## الخطوة 1: إعداد حساب Apple Developer

### 1.1 التسجيل في Apple Developer Program

```
1. اذهب إلى: https://developer.apple.com/programs/
2. سجل دخول بـ: msmbm2003@gmail.com
3. اختر "Enroll" للتسجيل
4. ادفع $99 (سنوياً)
5. انتظر الموافقة (24-48 ساعة)
```

### 1.2 إنشاء App ID

```
1. اذهب إلى: https://developer.apple.com/account/resources/identifiers/list
2. اضغط "+" لإنشاء App ID جديد
3. اختر "App IDs"
4. املأ المعلومات:
   - Description: ViScan Medical Analysis
   - Bundle ID: com.viscan.medical (أو اسم فريد)
   - Capabilities: اختر ما تحتاجه
5. اضغط "Register"
```

---

## الخطوة 2: تجهيز المشروع

### 2.1 تحميل المشروع على جهاز Mac

```bash
# استنسخ المشروع من GitHub أو حمله كـ ZIP
git clone https://github.com/YOUR_USERNAME/viscan-app.git
cd viscan-app

# أو إذا حملته كـ ZIP:
# فك الضغط ثم:
cd viscan-app
```

### 2.2 تثبيت التبعيات

```bash
# تثبيت pnpm إذا لم يكن مثبتاً
npm install -g pnpm

# تثبيت تبعيات المشروع
pnpm install
```

### 2.3 بناء التطبيق للإنتاج

```bash
# بناء النسخة النهائية
pnpm build
```

---

## الخطوة 3: إعداد Capacitor

### 3.1 تهيئة Capacitor

```bash
# تهيئة Capacitor
npx cap init

# عند السؤال، أدخل:
# App name: ViScan
# App Package ID: com.viscan.medical (نفس Bundle ID)
```

### 3.2 إضافة منصة iOS

```bash
# إضافة iOS
npx cap add ios

# نسخ ملفات الويب إلى iOS
npx cap copy ios

# مزامنة التغييرات
npx cap sync ios
```

---

## الخطوة 4: فتح المشروع في Xcode

### 4.1 فتح Xcode

```bash
# فتح مشروع iOS في Xcode
npx cap open ios

# أو يدوياً:
# open ios/App/App.xcworkspace
```

### 4.2 إعداد Signing & Capabilities في Xcode

```
1. في Xcode، اختر المشروع "App" من القائمة اليسرى
2. اختر Target "App"
3. اذهب إلى تبويب "Signing & Capabilities"
4. قم بالتالي:
   - ✅ ضع علامة على "Automatically manage signing"
   - اختر Team: حسابك (msmbm2003@gmail.com)
   - Bundle Identifier: com.viscan.medical
   - سيتم إنشاء Provisioning Profile تلقائياً
```

### 4.3 تحديث معلومات التطبيق

```
1. اختر "Info.plist" من القائمة اليسرى
2. عدّل:
   - CFBundleDisplayName: ViScan
   - CFBundleName: ViScan
   - CFBundleVersion: 1.0.0
   - NSCameraUsageDescription: "ViScan needs camera access to analyze medical images"
   - NSPhotoLibraryUsageDescription: "ViScan needs photo library access to select images for analysis"
```

---

## الخطوة 5: إنشاء التطبيق على App Store Connect

### 5.1 تسجيل الدخول إلى App Store Connect

```
1. اذهب إلى: https://appstoreconnect.apple.com
2. سجل دخول بـ: msmbm2003@gmail.com
3. اضغط "My Apps"
4. اضغط "+" ثم "New App"
```

### 5.2 ملء معلومات التطبيق

```
Platform: iOS
Name: ViScan - Medical Image Analysis
Primary Language: Arabic (أو English)
Bundle ID: com.viscan.medical (اختر من القائمة)
SKU: viscan-001 (رقم فريد)
User Access: Full Access
```

### 5.3 ملء معلومات الإصدار (Version Information)

#### App Information

```
Name: ViScan
Subtitle: AI-Powered Medical Analysis
Privacy Policy URL: https://viscan.app/privacy (أنشئها لاحقاً)
Category: Medical
```

#### Pricing and Availability

```
Price: Free (أو حدد سعر)
Availability: All countries
```

#### App Privacy

```
سيُطلب منك الإجابة على أسئلة حول:
- جمع البيانات
- استخدام البيانات
- مشاركة البيانات

للتطبيق الطبي:
- ✅ نجمع: الصور الطبية، معلومات الصحة
- ✅ نستخدم: للتحليل والتشخيص
- ❌ لا نشارك: البيانات مع أطراف ثالثة
```

---

## الخطوة 6: إنشاء Screenshots

### 6.1 المقاسات المطلوبة

```
iPhone:
- 6.7" Display (1290 x 2796 pixels) - iPhone 15 Pro Max
- 6.5" Display (1284 x 2778 pixels) - iPhone 14 Plus
- 5.5" Display (1242 x 2208 pixels) - iPhone 8 Plus

iPad:
- 12.9" Display (2048 x 2732 pixels) - iPad Pro
- 11" Display (1668 x 2388 pixels) - iPad Pro 11"
```

### 6.2 كيفية أخذ Screenshots

```
1. شغّل التطبيق في Simulator
2. افتح الصفحات المهمة (Home, Dashboard, Analysis)
3. اضغط Cmd + S لأخذ Screenshot
4. كرر لكل مقاس شاشة
5. احفظ الصور في مجلد منظم
```

### 6.3 تحسين Screenshots (اختياري)

```
استخدم أدوات مثل:
- Figma
- Sketch
- Canva

أضف:
- عنوان للميزة
- وصف قصير
- تصميم جذاب
```

---

## الخطوة 7: رفع Build إلى App Store Connect

### 7.1 إعداد Archive في Xcode

```
1. في Xcode، اختر:
   Product > Destination > Any iOS Device (arm64)
2. ثم اختر:
   Product > Archive
3. انتظر حتى يكتمل الـ Archive (5-10 دقائق)
```

### 7.2 رفع Archive

```
1. بعد اكتمال Archive، ستفتح نافذة "Organizer"
2. اختر الـ Archive الذي أنشأته
3. اضغط "Distribute App"
4. اختر "App Store Connect"
5. اختر "Upload"
6. اتبع الخطوات:
   - ✅ Include bitcode: No
   - ✅ Upload symbols: Yes
   - ✅ Manage Version and Build Number: Automatically
7. اضغط "Upload"
8. انتظر حتى يكتمل الرفع (10-30 دقيقة)
```

### 7.3 التحقق من الرفع

```
1. اذهب إلى App Store Connect
2. My Apps > ViScan
3. اذهب إلى "TestFlight" أو "App Store"
4. ستجد Build جديد في "Builds" بعد معالجته
5. انتظر حتى يظهر ✅ بجانب Build
```

---

## الخطوة 8: إعداد الإصدار للمراجعة

### 8.1 ربط Build بالإصدار

```
1. في App Store Connect > ViScan
2. اذهب إلى "App Store" tab
3. في قسم "Build"، اضغ "Select a build before you submit your app"
4. اختر الـ Build الذي رفعته
5. اضغط "Done"
```

### 8.2 رفع Screenshots

```
1. في نفس الصفحة، اذهب إلى "App Preview and Screenshots"
2. لكل مقاس شاشة:
   - اسحب وأفلت الصور
   - رتبها حسب الأهمية
   - تأكد من رفع 3-10 صور لكل مقاس
```

### 8.3 كتابة الوصف

#### Description (الوصف)

```
ViScan - منصة التحليل الطبي بالذكاء الاصطناعي

اكتشف قوة الذكاء الاصطناعي في التشخيص الطبي مع ViScan!

الميزات الرئيسية:
• تحليل قزحية العين المتقدم (7 مناطق iridology)
• تحليل الأشعة السينية والرنين المغناطيسي
• التشخيص من الوجه وقراءة الكف
• مكتبة طبية شاملة (أمراض، أدوية، أعشاب)
• توصيات صحية مخصصة
• تقارير PDF احترافية
• واجهة سهلة الاستخدام

ViScan يستخدم أحدث تقنيات الذكاء الاصطناعي لتوفير تحليل طبي دقيق وسريع.

ملاحظة: ViScan هو أداة مساعدة ولا يغني عن استشارة الطبيب المختص.
```

#### Keywords (الكلمات المفتاحية)

```
medical,health,ai,analysis,diagnosis,iris,xray,mri,doctor,patient
```

#### Support URL

```
https://viscan.app/support
```

#### Marketing URL (اختياري)

```
https://viscan.app
```

### 8.4 معلومات التواصل

```
First Name: [اسمك]
Last Name: [اسم عائلتك]
Phone: [رقم هاتفك]
Email: msmbm2003@gmail.com
```

### 8.5 App Review Information

```
Sign-in required: No (أو Yes إذا كان مطلوب)

Notes for Reviewer:
"ViScan is a medical image analysis platform powered by AI.
Test account (if needed):
Email: test@viscan.app
Password: Test123456

The app analyzes medical images including iris scans, X-rays, MRI,
and provides health recommendations based on AI analysis."
```

---

## الخطوة 9: إرسال للمراجعة

### 9.1 المراجعة النهائية

```
تأكد من:
- ✅ Build محدد
- ✅ Screenshots مرفوعة (جميع المقاسات)
- ✅ Description مكتوب
- ✅ Keywords محددة
- ✅ Privacy Policy جاهزة
- ✅ Support URL يعمل
- ✅ App Review Information مملوءة
```

### 9.2 إرسال للمراجعة

```
1. اضغط "Save" لحفظ التغييرات
2. اضغط "Add for Review" في الأعلى
3. راجع جميع المعلومات
4. اضغط "Submit for Review"
5. ستظهر رسالة تأكيد
```

### 9.3 حالة المراجعة

```
ستمر بالحالات التالية:
1. Waiting for Review (انتظار المراجعة)
2. In Review (قيد المراجعة)
3. Pending Developer Release (في انتظار النشر)
4. Ready for Sale (جاهز للبيع) ✅

المدة المتوقعة: 1-7 أيام
```

---

## الخطوة 10: بعد الموافقة

### 10.1 النشر

```
عند الموافقة، لديك خياران:
1. Automatic Release: ينشر تلقائياً
2. Manual Release: تنشر يدوياً عندما تريد
```

### 10.2 مراقبة الأداء

```
في App Store Connect، راقب:
- عدد التحميلات
- التقييمات والمراجعات
- الأخطاء (Crashes)
- استخدام الميزات
```

### 10.3 التحديثات المستقبلية

```
لإصدار تحديث:
1. عدّل الكود
2. زد رقم الإصدار في Xcode
3. بناء Archive جديد
4. ارفعه إلى App Store Connect
5. أنشئ إصدار جديد
6. أرسل للمراجعة
```

---

## 🚨 مشاكل شائعة وحلولها

### مشكلة: "No Provisioning Profile found"

```
الحل:
1. في Xcode > Preferences > Accounts
2. أضف Apple ID إذا لم يكن موجود
3. اختر Team
4. اضغط "Download Manual Profiles"
```

### مشكلة: "Bundle Identifier already exists"

```
الحل:
1. غيّر Bundle ID في:
   - capacitor.config.ts
   - Xcode > General > Bundle Identifier
2. أعد المزامنة: npx cap sync ios
```

### مشكلة: "Build failed"

```
الحل:
1. نظف المشروع: Product > Clean Build Folder
2. أعد البناء
3. تحقق من Logs للأخطاء
```

### مشكلة: "App Rejected"

```
الأسباب الشائعة:
- معلومات ناقصة
- Screenshots غير واضحة
- Privacy Policy مفقودة
- الميزات لا تعمل

الحل:
1. اقرأ سبب الرفض في Resolution Center
2. عالج المشكلة
3. أعد الإرسال
```

---

## 📋 Checklist النهائي

قبل الإرسال، تأكد من:

### التقني

- [ ] التطبيق يعمل بدون أخطاء
- [ ] جميع الميزات تعمل
- [ ] لا توجد Crashes
- [ ] الأداء جيد
- [ ] يدعم أحجام الشاشات المختلفة

### المحتوى

- [ ] App Name محدد
- [ ] Description مكتوب (عربي/إنجليزي)
- [ ] Keywords محددة
- [ ] Screenshots جاهزة (جميع المقاسات)
- [ ] App Icon جاهز (1024x1024)

### القانوني

- [ ] Privacy Policy جاهزة
- [ ] Terms of Service جاهزة
- [ ] حقوق الملكية واضحة
- [ ] لا انتهاك لحقوق الملكية

### الحساب

- [ ] Apple Developer Account نشط
- [ ] الدفع ($99) تم
- [ ] App ID مُنشأ
- [ ] Certificates جاهزة

---

## 🎉 تهانينا!

بعد اتباع هذه الخطوات، سيكون تطبيق ViScan على App Store!

### روابط مفيدة

- App Store Connect: https://appstoreconnect.apple.com
- Developer Portal: https://developer.apple.com/account
- App Store Guidelines: https://developer.apple.com/app-store/review/guidelines/
- Human Interface Guidelines: https://developer.apple.com/design/human-interface-guidelines/

### الدعم

إذا واجهت أي مشاكل:

1. راجع هذا الدليل
2. ابحث في Apple Developer Forums
3. تواصل مع Apple Developer Support

---

**ملاحظة مهمة**: هذا التطبيق طبي، تأكد من:

- الامتثال لقوانين الصحة المحلية
- إضافة تحذير بأن التطبيق لا يغني عن الطبيب
- الحصول على موافقات طبية إذا لزم الأمر
- حماية خصوصية بيانات المرضى (HIPAA/GDPR)

**تاريخ الإنشاء**: 30 أكتوبر 2025
**الإصدار**: 1.0.0
