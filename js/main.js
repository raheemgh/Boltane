/* =========================================================
   Boltane — main.js
   Theme toggle, language/RTL toggle, side panel, chat demo
   ========================================================= */

(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------------- Theme ---------------- */
  function initTheme() {
    var stored = localStorage.getItem('boltane-theme');
    var preferred = stored || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
    root.setAttribute('data-theme', preferred);
  }

  function toggleTheme() {
    var current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    var next = current === 'light' ? 'dark' : 'light';
    root.setAttribute('data-theme', next);
    localStorage.setItem('boltane-theme', next);
  }

  /* ---------------- Language / RTL ---------------- */
  var STRINGS = {
    en: {
      dir: 'ltr',
      htmlLang: 'en',
      langToggleLabel: 'العربية',
      skipLink: 'Skip to content',
      navHome: 'Home',
      navDemo: 'Demo video',
      panelSections: 'Sections',
      panelLinks: 'More from Boltane',
      panelContact: 'Contact',
      panelFollow: 'Follow us',
      linkBlog: 'Blog',
      linkCareers: 'Careers',
      linkInstagram: 'Instagram',
      linkLinkedin: 'LinkedIn',
      linkAva: 'Meet Ava',
      linkTerms: 'Terms & Conditions',
      contactEmail: 'Email us',
      contactWhatsapp: 'Chat on WhatsApp',
      themeToggle: 'Toggle theme',
      menuToggle: 'Open menu',
      menuClose: 'Close menu',
      eyebrow: 'AI automation, built to talk',
      heroHeading: 'Your business, answered instantly.',
      heroLede: 'Boltane builds AI systems that talk to your customers, answer their questions, and get things done \u2014 around the clock, without extra headcount. From WhatsApp to your website, our AI handles first-line support, sales inquiries, and everyday operations, so your team can focus on the work that needs a human touch.',
      chatName: 'Ava',
      chatRole: 'Boltane AI assistant',
      pageTitleIndex: 'Boltane \u2014 AI automation that talks',
      avaHeading: 'Ava',
      avaComingSoon: 'Coming soon.',
      pageTitleAva: 'Ava \u2014 Boltane',
      intakeEyebrow: 'Before we start',
      intakeHeading: 'Tell us about your business',
      intakeSub: 'A few quick details \u2014 no AI needed for this part, just plain facts.',
      intakeProjectName: 'Project / business name',
      intakeProjectNamePh: 'e.g. Damascus Grill',
      intakeContactNumber: 'Business WhatsApp number',
      intakeContactNumberHint: 'The number you want your bot running on \u2014 just for context, not the technical setup (we\u2019ll ask for that separately later).',
      intakeContactNumberPh: '9xx xxx xxx',
      intakeCountry: 'Country you live in',
      intakeCountryPlaceholder: 'Select country',
      intakeDialAriaLabel: 'Country calling code',
      countrySearchPh: 'Search country or code\u2026',
      countryNoResults: 'No matches found.',
      intakeDomain: 'Business domain',
      intakeDomainPh: 'e.g. Restaurant, retail, clinic\u2026',
      intakeNature: 'Tell us a bit about your business',
      intakeNaturePh: 'What do you sell or offer? Anything Ava should know upfront?',
      intakeSubmit: 'Continue',
      intakeRequired: 'Please fill in all fields to continue.',
      transitionMeetAva: 'Meet Ava, your guide to finish your bot.',
      transitionImagine: 'Imagine your business having a bot just like Ava.',
      resumeFound: 'We found a previous session for this number.',
      resumeContinue: 'Continue it',
      resumeStartOver: 'Start over instead',
      chatInputPh: 'Type your message\u2026',
      chatSend: 'Send',
      chatTyping: 'Ava is typing\u2026',
      chatDone: 'All set \u2014 follow the instructions above to activate your bot.',
      chatResetBtn: 'Reset conversation',
      chatResetLeft: 'resets left',
      chatResetNone: 'No resets left for this attempt.',
      chatAttachBtn: 'Attach PDF',
      chatAttachHint: 'Optional \u2014 up to 4 pages. Reviewed manually, never sent to the AI.',
      chatAttachSending: 'Uploading\u2026',
      chatAttachOk: 'Received \u2014 our team will review it.',
      chatAttachErr: 'Couldn\u2019t upload that file. You can still continue the conversation.',
      chatReferralLabel: 'Referral code (optional)',
      chatReferralPh: 'Have a code from a partner?',
      chatErrorFallback: 'We\u2019re having trouble connecting right now. You can reach us directly instead:',
      chatErrorWhatsapp: 'Chat on WhatsApp',
      chatRestartConfirm: 'Reset this conversation? Your business details stay saved.',
      metaSetupEyebrow: 'Almost there',
      metaSetupHeading: 'Connect your WhatsApp account',
      metaSetupSub: 'Follow these steps in Meta for Developers, then send us your credentials below so we can finish connecting your bot.',
      metaSetupLegalName: 'Official/legal name of the account holder (in English)',
      metaSetupLegalNamePh: 'e.g. Ahmad Ali Hassan',
      metaSetupLegalNameHint: 'For future verification (KYC) \u2014 please use your official/legal details, not a nickname or business name.',
      metaSetupPhoneId: 'Phone Number ID',
      metaSetupAccessToken: 'Access Token',
      metaSetupSubmit: 'Submit',
      metaSetupSubmitting: 'Submitting\u2026',
      metaSetupWarning: 'Please fill in all fields before submitting.',
      metaSetupError: 'Something went wrong submitting your details. Please try again, or contact us directly.',
      termsHeading: 'Boltane — Terms & Conditions',
      pageTitleTerms: 'Terms & Conditions \u2014 Boltane',
      pageTitleDemo: 'Demo \u2014 Boltane',
      demoHeading: 'Boltane in 30 seconds',
      demoSub: 'Watch a real conversation, handled entirely by Ava.',
      demoWatchAria: 'Watch the demo video on YouTube',
      demoNote: 'Opens on YouTube in a new tab.',
      pageTitleComingSoon: 'Coming Soon \u2014 Boltane',
      comingSoonBadge: 'In the works',
      comingSoonHeading: 'Coming soon',
      comingSoonSub: 'We\u2019re still building this page. In the meantime, feel free to reach out to us directly.',
      comingSoonCta: 'Back to home',
      navPricing: 'Pricing',
      avaCalloutEyebrow: 'No cost to try',
      avaCalloutHeading: 'Make your free WhatsApp bot with Ava',
      avaCalloutSub: 'Ava walks you through it in minutes, no card and no commitment required.',
      avaCalloutCta: 'Start with Ava',
      pricingHeading: 'Simple pricing, real hosting.',
      pricingSub: 'Two plans. No hidden tiers, no surprise invoices.',
      billingMonthly: 'Monthly',
      billingAnnual: 'Annual',
      billingDiscountBadge: 'Save 8%',
      badgeFirstMonthFree: 'First month free',
      planBasicName: 'Basic',
      planProName: 'Pro',
      perMonth: '/mo',
      perYear: '/yr',
      basicNoteMonthly: 'Billed monthly.',
      basicNoteAnnual: 'Billed annually.',
      proNoteMonthly: 'Billed monthly.',
      proNoteAnnual: 'Billed annually.',
      proDiffTitle: 'Independent, dedicated hosting',
      proDiffDesc: 'Your bot runs on its own resources, never shared infrastructure.',
      basicFeature1: 'One connected WhatsApp number',
      basicFeature2: 'AI answers for common customer questions',
      basicFeature3: 'Secure shared infrastructure',
      basicFeature4: 'Email support',
      proFeature1: 'Everything in Basic',
      proFeature2: 'Faster responses, dedicated resources',
      proFeature3: 'Custom AI tuned to your business',
      proFeature4: 'Priority support queue',
      ctaGetStarted: 'Get started',
      modalTriggerBtn: 'View full service checklist',
      modalTitle: 'Service checklist',
      includedTitle: 'Included with every plan',
      inc1: 'Instant multilingual auto-replies (Arabic & English)',
      inc2: 'Full conversation memory',
      inc3: 'Automatic AI fallback for reliability',
      inc4: 'Reservation & booking handling',
      inc5: 'Customer data capture',
      inc6: 'Real-time manager alerts',
      inc7: 'Deep menu & catalog training',
      inc8: 'Live data sync',
      inc9: 'General customer support automation',
      addonsTitle: 'Optional add-ons',
      addonDocTraining: 'Document-based training (PDF upload)',
      addonDocTrainingPrice: '$79 \u00b7 one-time',
      addonModel: 'Dedicated AI model selection',
      addonModelPrice: '$15/month',
      addonReminders: 'Booking reminders',
      addonRemindersPrice: '$12/month',
      addonBroadcast: 'Promotional & broadcast messages',
      addonBroadcastPrice: '$25/month',
      addonExport: 'Customer data export',
      addonExportPrice: '$15/month',
      addonBranchShared: 'Additional branch, shared menu',
      addonBranchSharedPrice: 'Custom quote \u2014 contact us',
      addonBranchIndependent: 'Additional branch, independent menu',
      addonBranchIndependentPrice: 'Custom quote \u2014 contact us',
      modalPlanLabel: 'Plan',
      modalTotalLabel: 'Estimated total',
      modalTotalQuoteNote: '+ custom quote for the additional branch(es) selected \u2014 priced individually',
      modalTotalCaveat: 'Excludes one-time fees.',
      requestsTitle: 'Anything else?',
      requestsPlaceholder: 'Tell us about any other requests\u2026',
      approxPricingNotice: 'Prices shown are approximate \u2014 Boltane\u2019s team will confirm final pricing after reviewing your request.',
      confirmBtn: 'Confirm on WhatsApp',
      waMsgHeader: 'Service checklist request from the Boltane website:',
      waMsgAddonsHeader: 'Selected add-ons:',
      waMsgNoAddons: 'No add-ons selected.',
      waMsgExtra: 'Additional requests:',
      waMsgEstimateRequest: 'Note to Boltane team: please include an approximate monthly subscription estimate in your reply if this request affects pricing.',
      ctaMsgBasic: 'Hi, I\u2019d like to start with the Basic plan ($40/mo, first month free).',
      ctaMsgPro: 'Hi, I\u2019d like to start with the Pro plan ($60/mo, independent dedicated hosting).',
      footerSiteIndex: 'On this page',
      footerTryAva: 'Try Ava',
      footerCopyright: 'All rights reserved.',
    },
    ar: {
      dir: 'rtl',
      htmlLang: 'ar',
      langToggleLabel: 'English',
      skipLink: 'الانتقال إلى المحتوى',
      navHome: 'الرئيسية',
      navDemo: 'عرض توضيحي',
      panelSections: 'أقسام الصفحة',
      panelLinks: 'المزيد من بولتان',
      panelContact: 'تواصل معنا',
      panelFollow: 'تابعنا',
      linkBlog: 'المدونة',
      linkCareers: 'الوظائف',
      linkInstagram: 'إنستغرام',
      linkLinkedin: 'لينكدإن',
      linkAva: 'تعرّف على آفا',
      linkTerms: 'الشروط والأحكام',
      contactEmail: 'راسلنا عبر البريد',
      contactWhatsapp: 'تواصل عبر واتساب',
      themeToggle: 'تبديل المظهر',
      menuToggle: 'فتح القائمة',
      menuClose: 'إغلاق القائمة',
      eyebrow: 'أتمتة بالذكاء الاصطناعي، مصمّمة للحديث',
      heroHeading: 'عملك يُجاب عليه فورًا.',
      heroLede: 'تصمّم بولتان أنظمة ذكاء اصطناعي تتحدث مع عملائك، وتجيب على استفساراتهم، وتُنجز المهام على مدار الساعة دون الحاجة لتوظيف إضافي. من واتساب إلى موقعك الإلكتروني، يتولى الذكاء الاصطناعي لدينا الدعم الأول والاستفسارات التجارية والعمليات اليومية، ليتفرغ فريقك للأعمال التي تحتاج لمسة إنسانية.',
      chatName: 'آفا',
      chatRole: 'مساعدة بولتان الذكية',
      pageTitleIndex: 'بولتان \u2014 أتمتة ذكاء اصطناعي تتحدث بلغتك',
      avaHeading: 'آفا',
      avaComingSoon: 'قريبًا.',
      pageTitleAva: 'آفا \u2014 بولتان',
      intakeEyebrow: 'قبل أن نبدأ',
      intakeHeading: 'حدثنا عن مشروعك',
      intakeSub: 'بضع تفاصيل سريعة \u2014 هذا الجزء لا يحتاج إلى ذكاء اصطناعي، بل معلومات مباشرة فقط.',
      intakeProjectName: 'اسم المشروع أو النشاط التجاري',
      intakeProjectNamePh: 'مثلاً: مطعم دمشق',
      intakeContactNumber: 'رقم واتساب النشاط التجاري',
      intakeContactNumberHint: 'الرقم الذي تريد تشغيل البوت عليه \u2014 لغرض السياق فقط في الوقت الحالي، وليس الإعداد التقني (سنطلب ذلك بشكل منفصل لاحقًا).',
      intakeContactNumberPh: '9xx xxx xxx',
      intakeCountry: 'الدولة التي تعيش بها',
      intakeCountryPlaceholder: 'اختر دولتك',
      intakeDialAriaLabel: 'مفتاح الاتصال الدولي',
      countrySearchPh: 'ابحث عن دولة أو مفتاح الاتصال\u2026',
      countryNoResults: 'لا توجد نتائج مطابقة.',
      intakeDomain: 'مجال العمل',
      intakeDomainPh: 'مثلاً: مطعم، متجر، عيادة\u2026',
      intakeNature: 'أخبرنا قليلًا عن طبيعة عملك',
      intakeNaturePh: 'ما الذي تقدّمه أو تبيعه؟ هل هناك ما تودّ أن تعرفه آفا مسبقًا؟',
      intakeSubmit: 'متابعة',
      intakeRequired: 'يرجى تعبئة جميع الحقول للمتابعة.',
      transitionMeetAva: 'تعرّف على آفا، مرشدتك لإكمال بوتك.',
      transitionImagine: 'تخيّل أن مشروعك لديه بوت مثل آفا تمامًا.',
      resumeFound: 'وجدنا جلسة سابقة لهذا الرقم.',
      resumeContinue: 'إكمال الجلسة',
      resumeStartOver: 'البدء من جديد بدلاً منها',
      chatInputPh: 'اكتب رسالتك\u2026',
      chatSend: 'إرسال',
      chatTyping: 'آفا تكتب الآن\u2026',
      chatDone: 'انتهينا \u2014 يرجى اتباع التعليمات أعلاه لتفعيل بوتك.',
      chatResetBtn: 'إعادة ضبط المحادثة',
      chatResetLeft: 'محاولات متبقية',
      chatResetNone: 'لا توجد محاولات إعادة ضبط متبقية لهذا التسجيل.',
      chatAttachBtn: 'إرفاق PDF',
      chatAttachHint: 'اختياري \u2014 حتى 4 صفحات. تُراجَع يدويًا، ولا تصل إلى الذكاء الاصطناعي إطلاقًا.',
      chatAttachSending: 'جاري الرفع\u2026',
      chatAttachOk: 'تم الاستلام \u2014 سيقوم فريقنا بمراجعته.',
      chatAttachErr: 'تعذّر رفع الملف. يمكنك متابعة المحادثة بشكل طبيعي.',
      chatReferralLabel: 'كود إحالة (اختياري)',
      chatReferralPh: 'عندك كود من صانع محتوى؟',
      chatErrorFallback: 'نواجه حاليًا مشكلة في الاتصال. يمكنك التواصل معنا مباشرة بدلاً من ذلك:',
      chatErrorWhatsapp: 'تواصل عبر واتساب',
      chatRestartConfirm: 'هل تريد إعادة ضبط هذه المحادثة؟ ستبقى بيانات مشروعك محفوظة.',
      metaSetupEyebrow: 'أوشكنا على الانتهاء',
      metaSetupHeading: 'اربط حساب واتساب الخاص بك',
      metaSetupSub: 'اتّبع هذه الخطوات في Meta for Developers، ثم أرسل لنا بياناتك أدناه لنُكمل ربط بوتك.',
      metaSetupLegalName: 'اسم صاحب الحساب الرسمي (بالإنكليزية)',
      metaSetupLegalNamePh: 'مثال: Ahmad Ali Hassan',
      metaSetupLegalNameHint: 'للتحقق المستقبلي (KYC) \u2014 الرجاء إدخال بياناتك الرسمية، وليس اسمًا مستعارًا أو اسمًا تجاريًا.',
      metaSetupPhoneId: 'معرّف رقم الهاتف (Phone Number ID)',
      metaSetupAccessToken: 'رمز الوصول (Access Token)',
      metaSetupSubmit: 'إرسال',
      metaSetupSubmitting: 'جارٍ الإرسال\u2026',
      metaSetupWarning: 'يرجى تعبئة جميع الحقول قبل الإرسال.',
      metaSetupError: 'حدث خطأ أثناء إرسال بياناتك. يرجى المحاولة مجددًا، أو التواصل معنا مباشرة.',
      termsHeading: 'بولتان — الشروط والأحكام',
      pageTitleTerms: 'الشروط والأحكام \u2014 بولتان',
      pageTitleDemo: 'العرض التوضيحي \u2014 بولتان',
      demoHeading: 'بولتان في ثلاثين ثانية',
      demoSub: 'شاهد محادثة حقيقية، تُدار بالكامل بواسطة آفا.',
      demoWatchAria: 'مشاهدة العرض التوضيحي على يوتيوب',
      demoNote: 'يُفتح على يوتيوب في علامة تبويب جديدة.',
      pageTitleComingSoon: 'قريبًا \u2014 بولتان',
      comingSoonBadge: 'قيد الإعداد',
      comingSoonHeading: 'قريبًا',
      comingSoonSub: 'ما زلنا نعمل على هذه الصفحة. بإمكانك التواصل معنا مباشرة في هذه الأثناء.',
      comingSoonCta: 'العودة إلى الرئيسية',
      navPricing: 'الأسعار',
      avaCalloutEyebrow: 'بدون أي تكلفة للتجربة',
      avaCalloutHeading: 'أنشئ بوت واتساب مجاني مع آفا',
      avaCalloutSub: 'آفا ترشدك خلال دقائق، بدون بطاقة وبدون أي التزام.',
      avaCalloutCta: 'ابدأ مع آفا',
      pricingHeading: 'أسعار بسيطة، واستضافة حقيقية.',
      pricingSub: 'خطتان فقط، بدون فئات مخفية وبدون فواتير مفاجئة.',
      billingMonthly: 'شهري',
      billingAnnual: 'سنوي',
      billingDiscountBadge: 'وفّر 8%',
      badgeFirstMonthFree: 'الشهر الأول مجانًا',
      planBasicName: 'الأساسية',
      planProName: 'برو',
      perMonth: '/شهريًا',
      perYear: '/سنويًا',
      basicNoteMonthly: 'تُفوتر شهريًا.',
      basicNoteAnnual: 'تُفوتر سنويًا.',
      proNoteMonthly: 'تُفوتر شهريًا.',
      proNoteAnnual: 'تُفوتر سنويًا.',
      proDiffTitle: 'استضافة مستقلة ومخصصة',
      proDiffDesc: 'يعمل بوتك على موارده الخاصة، وليس على بنية تحتية مشتركة أبدًا.',
      basicFeature1: 'رقم واتساب واحد متصل',
      basicFeature2: 'إجابات ذكاء اصطناعي للأسئلة الشائعة',
      basicFeature3: 'بنية تحتية مشتركة وآمنة',
      basicFeature4: 'دعم عبر البريد الإلكتروني',
      proFeature1: 'كل ما في الخطة الأساسية',
      proFeature2: 'استجابة أسرع بموارد مخصصة',
      proFeature3: 'ذكاء اصطناعي مخصص لعملك',
      proFeature4: 'طابور دعم بأولوية',
      ctaGetStarted: 'ابدأ الآن',
      modalTriggerBtn: 'عرض قائمة الخدمات الكاملة',
      modalTitle: 'قائمة الخدمات',
      includedTitle: 'متضمّن في كل خطة',
      inc1: 'ردود تلقائية فورية متعددة اللغات (عربي وإنجليزي)',
      inc2: 'ذاكرة محادثة كاملة',
      inc3: 'تحويل تلقائي احتياطي للذكاء الاصطناعي لضمان الموثوقية',
      inc4: 'إدارة الحجوزات',
      inc5: 'جمع بيانات العملاء',
      inc6: 'تنبيهات فورية للمدير',
      inc7: 'تدريب متعمّق على القائمة أو الكتالوج',
      inc8: 'مزامنة بيانات فورية',
      inc9: 'أتمتة دعم العملاء العام',
      addonsTitle: 'إضافات اختيارية',
      addonDocTraining: 'تدريب عبر مستند (رفع PDF)',
      addonDocTrainingPrice: '79$ \u00b7 دفعة واحدة',
      addonModel: 'اختيار نموذج ذكاء اصطناعي مخصص',
      addonModelPrice: '15$/شهريًا',
      addonReminders: 'تذكيرات الحجوزات',
      addonRemindersPrice: '12$/شهريًا',
      addonBroadcast: 'رسائل ترويجية وجماعية',
      addonBroadcastPrice: '25$/شهريًا',
      addonExport: 'تصدير بيانات العملاء',
      addonExportPrice: '15$/شهريًا',
      addonBranchShared: 'فرع إضافي، قائمة مشتركة',
      addonBranchSharedPrice: 'عرض سعر مخصص \u2014 تواصل معنا',
      addonBranchIndependent: 'فرع إضافي، قائمة مستقلة',
      addonBranchIndependentPrice: 'عرض سعر مخصص \u2014 تواصل معنا',
      modalPlanLabel: 'الخطة',
      modalTotalLabel: 'الإجمالي التقديري',
      modalTotalQuoteNote: '+ عرض سعر مخصص للفرع (الفروع) الإضافية المختارة \u2014 يُسعَّر بشكل فردي',
      modalTotalCaveat: 'لا يشمل الرسوم لمرة واحدة.',
      requestsTitle: 'هل هناك طلبات أخرى؟',
      requestsPlaceholder: 'أخبرنا بأي طلبات إضافية\u2026',
      approxPricingNotice: 'الأسعار الموضحة تقريبية \u2014 سيؤكد فريق بولتان السعر النهائي بعد مراجعة طلبك.',
      confirmBtn: 'تأكيد عبر واتساب',
      waMsgHeader: 'طلب قائمة خدمات من موقع بولتان:',
      waMsgAddonsHeader: 'الإضافات المختارة:',
      waMsgNoAddons: 'لم يتم اختيار أي إضافات.',
      waMsgExtra: 'طلبات إضافية:',
      waMsgEstimateRequest: 'ملاحظة لفريق بولتان: يرجى تضمين تقدير تقريبي للاشتراك الشهري في ردكم إذا كان هذا الطلب يؤثر على السعر.',
      ctaMsgBasic: 'مرحبًا، أرغب بالبدء بالخطة الأساسية (40$/شهريًا، الشهر الأول مجانًا).',
      ctaMsgPro: 'مرحبًا، أرغب بالبدء بخطة برو (60$/شهريًا، استضافة مستقلة ومخصصة).',
      footerSiteIndex: 'في هذه الصفحة',
      footerTryAva: 'جرّب آفا',
      footerCopyright: 'جميع الحقوق محفوظة.',
    }
  };

  // Exposed so ava.js (loaded separately, only on ava.html) can read
  // the same bilingual strings without duplicating them.
  window.__BOLTANE_STRINGS__ = STRINGS;

  var CHAT_PAIRS = {
    en: [
      { q: 'What can Boltane automate for my business?', a: 'From customer support to bookings and order tracking \u2014 we connect AI to the tools you already use.' },
      { q: 'Does it work on WhatsApp?', a: 'Yes \u2014 WhatsApp, web chat, and more, all powered by the same AI brain.' },
      { q: 'How long does setup take?', a: 'Most businesses go live in under two weeks, with zero code required.' },
      { q: 'Can it speak Arabic and English?', a: 'Fluently in both \u2014 and it switches mid-conversation if your customer does.' }
    ],
    ar: [
      { q: 'ماذا يمكن لبولتان أن يؤتمت في عملي؟', a: 'من دعم العملاء إلى الحجوزات وتتبع الطلبات \u2014 نربط الذكاء الاصطناعي بالأدوات التي تستخدمها بالفعل.' },
      { q: 'هل يعمل على واتساب؟', a: 'نعم \u2014 واتساب، والدردشة على موقعك، وأكثر، كلها مدعومة بنفس محرك الذكاء الاصطناعي.' },
      { q: 'كم يستغرق الإعداد؟', a: 'معظم الشركات تنطلق خلال أقل من أسبوعين، بدون أي برمجة.' },
      { q: 'هل يتحدث العربية والإنجليزية؟', a: 'بطلاقة في كليهما \u2014 ويبدّل اللغة أثناء المحادثة إذا بدّل عميلك.' }
    ]
  };

  function currentLang() {
    var stored = localStorage.getItem('boltane-lang');
    return stored === 'ar' ? 'ar' : (stored === 'en' ? 'en' : 'en');
  }

  function applyLanguage(lang) {
    var dict = STRINGS[lang];
    root.setAttribute('lang', dict.htmlLang);
    root.setAttribute('dir', dict.dir);

    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) el.textContent = dict[key];
    });
    document.querySelectorAll('[data-i18n-html]').forEach(function (el) {
      var key = el.getAttribute('data-i18n-html');
      if (dict[key] !== undefined) el.innerHTML = dict[key];
    });
    document.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      var spec = el.getAttribute('data-i18n-attr').split(':');
      var attr = spec[0], key = spec[1];
      if (dict[key] !== undefined) el.setAttribute(attr, dict[key]);
    });

    // Full-block bilingual content (e.g. terms.html's legal text) —
    // simpler than threading a whole document through STRINGS keys.
    document.querySelectorAll('[data-lang-block]').forEach(function (el) {
      el.hidden = el.getAttribute('data-lang-block') !== lang;
    });

    if (document.title && document.body.hasAttribute('data-page-title-key')) {
      document.title = dict[document.body.getAttribute('data-page-title-key')] || document.title;
    }

    localStorage.setItem('boltane-lang', lang);
    restartChatDemo(lang);
    updateModalTotal();
    document.dispatchEvent(new CustomEvent('boltane:langchange', { detail: { lang: lang } }));
  }

  function toggleLanguage() {
    var next = currentLang() === 'ar' ? 'en' : 'ar';
    applyLanguage(next);
  }

  /* ---------------- Side panel ---------------- */
  function initPanel() {
    var openBtn = document.querySelector('[data-panel-open]');
    var closeBtn = document.querySelector('[data-panel-close]');
    var panel = document.querySelector('[data-panel]');
    var overlay = document.querySelector('[data-overlay]');
    if (!panel || !overlay) return;

    function open() {
      panel.classList.add('is-open');
      overlay.classList.add('is-open');
      panel.removeAttribute('aria-hidden');
      document.body.style.overflow = 'hidden';
    }
    function close() {
      panel.classList.remove('is-open');
      overlay.classList.remove('is-open');
      panel.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
    if (openBtn) openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });
  }

  /* ---------------- Pricing billing toggle ---------------- */
  function initPricingToggle() {
    var section = document.querySelector('[data-pricing]');
    if (!section) return;
    var buttons = section.querySelectorAll('.billing-option');
    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        var isAnnual = btn.getAttribute('data-billing') === 'annual';
        section.classList.toggle('is-annual', isAnnual);
        buttons.forEach(function (b) {
          var active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', String(active));
        });
        updateModalTotal();
      });
    });
  }

  /* ---------------- Checklist modal ---------------- */
  var BOLTANE_NUMBER = '963982195846';

  function initModal() {
    var modal = document.querySelector('[data-modal]');
    var modalOverlay = document.querySelector('[data-overlay-modal]');
    var openBtn = document.querySelector('[data-modal-open]');
    var closeBtn = document.querySelector('[data-modal-close]');
    var confirmBtn = document.querySelector('[data-modal-confirm]');
    if (!modal || !modalOverlay) return;

    function open() {
      modal.classList.add('is-open');
      modalOverlay.classList.add('is-open');
      modal.removeAttribute('aria-hidden');
      document.body.style.overflow = 'hidden';
      updateModalTotal();
    }
    function close() {
      modal.classList.remove('is-open');
      modalOverlay.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    if (openBtn) openBtn.addEventListener('click', open);
    if (closeBtn) closeBtn.addEventListener('click', close);
    modalOverlay.addEventListener('click', close);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') close();
    });

    if (confirmBtn) {
      confirmBtn.addEventListener('click', function () {
        var en = STRINGS.en;
        var ar = STRINGS.ar;
        var lines = [];

        lines.push(en.waMsgHeader);
        lines.push(ar.waMsgHeader);
        lines.push('');

        var checked = Array.prototype.slice.call(
          document.querySelectorAll('[data-addon-list] input[data-addon]:checked')
        );

        if (checked.length) {
          lines.push(en.waMsgAddonsHeader);
          lines.push(ar.waMsgAddonsHeader);
          checked.forEach(function (input, i) {
            var li = input.closest('li');
            var labelKey = li.querySelector('.addon-label').getAttribute('data-i18n');
            var priceKey = li.querySelector('.addon-price').getAttribute('data-i18n');
            lines.push('');
            lines.push((i + 1) + '. ' + en[labelKey] + ' \u2014 ' + en[priceKey]);
            lines.push((i + 1) + '. ' + ar[labelKey] + ' \u2014 ' + ar[priceKey]);
          });
        } else {
          lines.push(en.waMsgNoAddons);
          lines.push(ar.waMsgNoAddons);
        }

        var extra = document.querySelector('[data-extra-request]');
        var extraVal = extra ? extra.value.trim() : '';
        if (extraVal) {
          lines.push('');
          lines.push(en.waMsgExtra);
          lines.push(ar.waMsgExtra);
          lines.push(extraVal);
          lines.push('');
          lines.push(en.waMsgEstimateRequest);
          lines.push(ar.waMsgEstimateRequest);
        }

        var message = lines.join('\n');
        var url = 'https://wa.me/' + BOLTANE_NUMBER + '?text=' + encodeURIComponent(message);
        window.open(url, '_blank', 'noopener');
      });
    }

    var planButtons = modal.querySelectorAll('[data-plan-toggle] .plan-option');
    planButtons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        planButtons.forEach(function (b) {
          var active = b === btn;
          b.classList.toggle('is-active', active);
          b.setAttribute('aria-pressed', String(active));
        });
        updateModalTotal();
      });
    });

    var addonInputs = modal.querySelectorAll('[data-addon-list] input[data-addon]');
    addonInputs.forEach(function (input) {
      input.addEventListener('change', updateModalTotal);
    });
  }

  /* ---------------- Modal running total ---------------- */
  function parseAmount(text) {
    var match = String(text).replace(/[^\d.]/g, '');
    return parseFloat(match) || 0;
  }

  function updateModalTotal() {
    var modal = document.querySelector('[data-modal]');
    var amountEl = document.querySelector('[data-total-amount]');
    if (!modal || !amountEl) return;

    var lang = currentLang();
    var dict = STRINGS[lang];

    var activePlanBtn = modal.querySelector('[data-plan-toggle] .plan-option.is-active');
    var plan = activePlanBtn ? activePlanBtn.getAttribute('data-plan') : 'basic';

    var pricingSection = document.querySelector('[data-pricing]');
    var isAnnual = pricingSection ? pricingSection.classList.contains('is-annual') : false;

    var planCard = document.querySelector(
      plan === 'pro' ? '.price-card.is-pro' : '.price-card:not(.is-pro)'
    );

    var base = 0;
    if (planCard) {
      var priceEl = isAnnual
        ? planCard.querySelector('.price-annual .amount')
        : planCard.querySelector('.price-monthly .amount');
      if (priceEl) base = parseAmount(priceEl.textContent);
    }

    var monthlySum = 0;
    var hasQuote = false;
    modal.querySelectorAll('[data-addon-list] input[data-addon]:checked').forEach(function (input) {
      var type = input.getAttribute('data-addon-type');
      if (type === 'monthly') {
        monthlySum += parseFloat(input.getAttribute('data-addon-value')) || 0;
      } else if (type === 'quote') {
        hasQuote = true;
      }
    });

    var total = isAnnual ? (base + monthlySum * 12) : (base + monthlySum);
    total = Math.round(total * 100) / 100;
    var totalDisplay = (total % 1 === 0) ? String(total) : total.toFixed(2);
    var suffix = isAnnual ? dict.perYear : dict.perMonth;

    amountEl.textContent = (lang === 'ar')
      ? (totalDisplay + '$' + suffix)
      : ('$' + totalDisplay + suffix);

    var quoteNote = document.querySelector('[data-total-quote-note]');
    if (quoteNote) quoteNote.hidden = !hasQuote;
  }

  /* ---------------- Get Started links (bilingual, plan-specific) ---------------- */
  function initGetStartedLinks() {
    var links = document.querySelectorAll('[data-plan-cta]');
    if (!links.length) return;
    links.forEach(function (link) {
      var plan = link.getAttribute('data-plan-cta');
      var key = plan === 'pro' ? 'ctaMsgPro' : 'ctaMsgBasic';
      var message = STRINGS.en[key] + '\n' + STRINGS.ar[key];
      link.href = 'https://wa.me/' + BOLTANE_NUMBER + '?text=' + encodeURIComponent(message);
    });
  }

  /* ---------------- Footer year ---------------- */
  function initFooterYear() {
    var el = document.querySelector('[data-year]');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ---------------- Chat demo loop ---------------- */
  var chatTimer = null;
  var chatRunId = 0;

  function restartChatDemo(lang) {
    var win = document.querySelector('[data-chat-window]');
    if (!win) return;
    chatRunId += 1;
    var myRun = chatRunId;
    clearTimeout(chatTimer);
    win.innerHTML = '';
    runChatCycle(win, lang, 0, myRun);
  }

  function runChatCycle(win, lang, index, myRun) {
    if (myRun !== chatRunId) return;
    var pairs = CHAT_PAIRS[lang];
    var pair = pairs[index % pairs.length];

    win.innerHTML = '';

    var userBubble = document.createElement('div');
    userBubble.className = 'bubble bubble-user';
    userBubble.textContent = pair.q;
    win.appendChild(userBubble);

    chatTimer = setTimeout(function () {
      if (myRun !== chatRunId) return;
      var replyBubble = document.createElement('div');
      replyBubble.className = 'bubble bubble-reply';
      var span = document.createElement('span');
      span.className = 'reveal-text';
      span.textContent = pair.a;
      replyBubble.appendChild(span);
      win.appendChild(replyBubble);

      // trigger reveal animation on next frame
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          replyBubble.classList.add('is-revealing');
        });
      });

      chatTimer = setTimeout(function () {
        runChatCycle(win, lang, index + 1, myRun);
      }, 3200);
    }, 650);
  }

  /* ---------------- Scroll reveal ---------------- */
  function initScrollReveal() {
    var revealEls = document.querySelectorAll('.reveal');
    if (!revealEls.length) return;

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1 });
      revealEls.forEach(function (el) { io.observe(el); });
    } else {
      revealEls.forEach(function (el) { el.classList.add('is-visible'); });
    }
  }

  /* ---------------- Init ---------------- */
  document.addEventListener('DOMContentLoaded', function () {
    initTheme();
    initPanel();
    initPricingToggle();
    initModal();
    initFooterYear();
    initGetStartedLinks();
    updateModalTotal();
    initScrollReveal();

    var themeBtn = document.querySelector('[data-theme-toggle]');
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);

    var langBtn = document.querySelector('[data-lang-toggle]');
    if (langBtn) langBtn.addEventListener('click', toggleLanguage);

    applyLanguage(currentLang());
  });
})();
