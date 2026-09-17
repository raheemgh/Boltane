/* =========================================================
   Boltane — ava.js
   Intake form -> transition -> interactive Ava chat.
   Loaded only on ava.html, after main.js (reuses STRINGS,
   currentLang(), applyLanguage() hooks from main.js).
   ========================================================= */

(function () {
  'use strict';

  // ---------------------------------------------------------------
  // Config — single place to fill in once the backend is deployed.
  // ---------------------------------------------------------------
  var AVA_BACKEND_URL = 'YOUR_AVA_BACKEND_URL_HERE'; // e.g. https://ava-backend-xyz.vercel.app
  var BOLTANE_WHATSAPP = '963982195846';
  var MAX_RESETS = 3;

  var STORAGE_KEYS = {
    history: 'boltane-ava-history',
    context: 'boltane-ava-context',
    resets: 'boltane-ava-resets',
    contextSent: 'boltane-ava-context-sent',
    done: 'boltane-ava-done',
    metaSetupDone: 'boltane-ava-meta-setup-done'
  };

  // ---------------------------------------------------------------
  // Flags: rendered via the flag-icons library (flag-icons.css,
  // loaded in <head>), which draws real, accurate SVG flags per
  // ISO 3166-1 code. We only ever render a flag for a code present
  // in our own COUNTRIES list below — Israel is deliberately never
  // added to that list, so its flag can never be shown here even
  // though the underlying library file contains it.
  // ---------------------------------------------------------------
  function flagMarkup(code) {
    if (!code || code === 'OTHER') {
      return '<span class="flag-generic" aria-hidden="true">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c2.5 2.6 4 5.8 4 9s-1.5 6.4-4 9c-2.5-2.6-4-5.8-4-9s1.5-6.4 4-9Z"/></svg>' +
        '</span>';
    }
    return '<span class="fi fi-' + code.toLowerCase() + '" aria-hidden="true"></span>';
  }

  var COUNTRIES = [
    { code: 'SY', dial: '+963', en: 'Syria', ar: 'سوريا' },
    { code: 'SA', dial: '+966', en: 'Saudi Arabia', ar: 'السعودية' },
    { code: 'AE', dial: '+971', en: 'United Arab Emirates', ar: 'الإمارات العربية المتحدة' },
    { code: 'QA', dial: '+974', en: 'Qatar', ar: 'قطر' },
    { code: 'KW', dial: '+965', en: 'Kuwait', ar: 'الكويت' },
    { code: 'BH', dial: '+973', en: 'Bahrain', ar: 'البحرين' },
    { code: 'OM', dial: '+968', en: 'Oman', ar: 'عُمان' },
    { code: 'JO', dial: '+962', en: 'Jordan', ar: 'الأردن' },
    { code: 'EG', dial: '+20', en: 'Egypt', ar: 'مصر' },
    { code: 'IQ', dial: '+964', en: 'Iraq', ar: 'العراق' },
    { code: 'LB', dial: '+961', en: 'Lebanon', ar: 'لبنان' },
    { code: 'YE', dial: '+967', en: 'Yemen', ar: 'اليمن' },
    { code: 'PS', dial: '+970', en: 'Palestine', ar: 'فلسطين' },
    { code: 'SD', dial: '+249', en: 'Sudan', ar: 'السودان' },
    { code: 'LY', dial: '+218', en: 'Libya', ar: 'ليبيا' },
    { code: 'TN', dial: '+216', en: 'Tunisia', ar: 'تونس' },
    { code: 'DZ', dial: '+213', en: 'Algeria', ar: 'الجزائر' },
    { code: 'MA', dial: '+212', en: 'Morocco', ar: 'المغرب' },
    { code: 'MR', dial: '+222', en: 'Mauritania', ar: 'موريتانيا' },
    { code: 'SO', dial: '+252', en: 'Somalia', ar: 'الصومال' },
    { code: 'DJ', dial: '+253', en: 'Djibouti', ar: 'جيبوتي' },
    { code: 'KM', dial: '+269', en: 'Comoros', ar: 'جزر القمر' },
    { code: 'TR', dial: '+90', en: 'Turkey', ar: 'تركيا' },
    { code: 'IR', dial: '+98', en: 'Iran', ar: 'إيران' },
    { code: 'GB', dial: '+44', en: 'United Kingdom', ar: 'المملكة المتحدة' },
    { code: 'FR', dial: '+33', en: 'France', ar: 'فرنسا' },
    { code: 'DE', dial: '+49', en: 'Germany', ar: 'ألمانيا' },
    { code: 'IT', dial: '+39', en: 'Italy', ar: 'إيطاليا' },
    { code: 'ES', dial: '+34', en: 'Spain', ar: 'إسبانيا' },
    { code: 'PT', dial: '+351', en: 'Portugal', ar: 'البرتغال' },
    { code: 'NL', dial: '+31', en: 'Netherlands', ar: 'هولندا' },
    { code: 'BE', dial: '+32', en: 'Belgium', ar: 'بلجيكا' },
    { code: 'CH', dial: '+41', en: 'Switzerland', ar: 'سويسرا' },
    { code: 'AT', dial: '+43', en: 'Austria', ar: 'النمسا' },
    { code: 'SE', dial: '+46', en: 'Sweden', ar: 'السويد' },
    { code: 'NO', dial: '+47', en: 'Norway', ar: 'النرويج' },
    { code: 'DK', dial: '+45', en: 'Denmark', ar: 'الدنمارك' },
    { code: 'FI', dial: '+358', en: 'Finland', ar: 'فنلندا' },
    { code: 'IE', dial: '+353', en: 'Ireland', ar: 'أيرلندا' },
    { code: 'PL', dial: '+48', en: 'Poland', ar: 'بولندا' },
    { code: 'CZ', dial: '+420', en: 'Czechia', ar: 'التشيك' },
    { code: 'SK', dial: '+421', en: 'Slovakia', ar: 'سلوفاكيا' },
    { code: 'HU', dial: '+36', en: 'Hungary', ar: 'المجر' },
    { code: 'RO', dial: '+40', en: 'Romania', ar: 'رومانيا' },
    { code: 'BG', dial: '+359', en: 'Bulgaria', ar: 'بلغاريا' },
    { code: 'GR', dial: '+30', en: 'Greece', ar: 'اليونان' },
    { code: 'RS', dial: '+381', en: 'Serbia', ar: 'صربيا' },
    { code: 'HR', dial: '+385', en: 'Croatia', ar: 'كرواتيا' },
    { code: 'SI', dial: '+386', en: 'Slovenia', ar: 'سلوفينيا' },
    { code: 'UA', dial: '+380', en: 'Ukraine', ar: 'أوكرانيا' },
    { code: 'RU', dial: '+7', en: 'Russia', ar: 'روسيا' },
    { code: 'BY', dial: '+375', en: 'Belarus', ar: 'بيلاروسيا' },
    { code: 'LT', dial: '+370', en: 'Lithuania', ar: 'ليتوانيا' },
    { code: 'LV', dial: '+371', en: 'Latvia', ar: 'لاتفيا' },
    { code: 'EE', dial: '+372', en: 'Estonia', ar: 'إستونيا' },
    { code: 'IS', dial: '+354', en: 'Iceland', ar: 'آيسلندا' },
    { code: 'LU', dial: '+352', en: 'Luxembourg', ar: 'لوكسمبورغ' },
    { code: 'MT', dial: '+356', en: 'Malta', ar: 'مالطا' },
    { code: 'CY', dial: '+357', en: 'Cyprus', ar: 'قبرص' },
    { code: 'AL', dial: '+355', en: 'Albania', ar: 'ألبانيا' },
    { code: 'MK', dial: '+389', en: 'North Macedonia', ar: 'مقدونيا الشمالية' },
    { code: 'BA', dial: '+387', en: 'Bosnia and Herzegovina', ar: 'البوسنة والهرسك' },
    { code: 'ME', dial: '+382', en: 'Montenegro', ar: 'الجبل الأسود' },
    { code: 'MD', dial: '+373', en: 'Moldova', ar: 'مولدوفا' },
    { code: 'GE', dial: '+995', en: 'Georgia', ar: 'جورجيا' },
    { code: 'AM', dial: '+374', en: 'Armenia', ar: 'أرمينيا' },
    { code: 'AZ', dial: '+994', en: 'Azerbaijan', ar: 'أذربيجان' },
    { code: 'CN', dial: '+86', en: 'China', ar: 'الصين' },
    { code: 'JP', dial: '+81', en: 'Japan', ar: 'اليابان' },
    { code: 'KR', dial: '+82', en: 'South Korea', ar: 'كوريا الجنوبية' },
    { code: 'IN', dial: '+91', en: 'India', ar: 'الهند' },
    { code: 'PK', dial: '+92', en: 'Pakistan', ar: 'باكستان' },
    { code: 'BD', dial: '+880', en: 'Bangladesh', ar: 'بنغلاديش' },
    { code: 'LK', dial: '+94', en: 'Sri Lanka', ar: 'سريلانكا' },
    { code: 'NP', dial: '+977', en: 'Nepal', ar: 'نيبال' },
    { code: 'AF', dial: '+93', en: 'Afghanistan', ar: 'أفغانستان' },
    { code: 'ID', dial: '+62', en: 'Indonesia', ar: 'إندونيسيا' },
    { code: 'MY', dial: '+60', en: 'Malaysia', ar: 'ماليزيا' },
    { code: 'SG', dial: '+65', en: 'Singapore', ar: 'سنغافورة' },
    { code: 'TH', dial: '+66', en: 'Thailand', ar: 'تايلاند' },
    { code: 'VN', dial: '+84', en: 'Vietnam', ar: 'فيتنام' },
    { code: 'PH', dial: '+63', en: 'Philippines', ar: 'الفلبين' },
    { code: 'MM', dial: '+95', en: 'Myanmar', ar: 'ميانمار' },
    { code: 'KH', dial: '+855', en: 'Cambodia', ar: 'كمبوديا' },
    { code: 'LA', dial: '+856', en: 'Laos', ar: 'لاوس' },
    { code: 'MN', dial: '+976', en: 'Mongolia', ar: 'منغوليا' },
    { code: 'KZ', dial: '+7', en: 'Kazakhstan', ar: 'كازاخستان' },
    { code: 'UZ', dial: '+998', en: 'Uzbekistan', ar: 'أوزبكستان' },
    { code: 'TM', dial: '+993', en: 'Turkmenistan', ar: 'تركمانستان' },
    { code: 'TJ', dial: '+992', en: 'Tajikistan', ar: 'طاجيكستان' },
    { code: 'KG', dial: '+996', en: 'Kyrgyzstan', ar: 'قيرغيزستان' },
    { code: 'HK', dial: '+852', en: 'Hong Kong', ar: 'هونغ كونغ' },
    { code: 'TW', dial: '+886', en: 'Taiwan', ar: 'تايوان' },
    { code: 'BN', dial: '+673', en: 'Brunei', ar: 'بروناي' },
    { code: 'MV', dial: '+960', en: 'Maldives', ar: 'المالديف' },
    { code: 'BT', dial: '+975', en: 'Bhutan', ar: 'بوتان' },
    { code: 'NG', dial: '+234', en: 'Nigeria', ar: 'نيجيريا' },
    { code: 'ZA', dial: '+27', en: 'South Africa', ar: 'جنوب أفريقيا' },
    { code: 'KE', dial: '+254', en: 'Kenya', ar: 'كينيا' },
    { code: 'ET', dial: '+251', en: 'Ethiopia', ar: 'إثيوبيا' },
    { code: 'GH', dial: '+233', en: 'Ghana', ar: 'غانا' },
    { code: 'TZ', dial: '+255', en: 'Tanzania', ar: 'تنزانيا' },
    { code: 'UG', dial: '+256', en: 'Uganda', ar: 'أوغندا' },
    { code: 'CM', dial: '+237', en: 'Cameroon', ar: 'الكاميرون' },
    { code: 'CI', dial: '+225', en: 'Ivory Coast', ar: 'ساحل العاج' },
    { code: 'SN', dial: '+221', en: 'Senegal', ar: 'السنغال' },
    { code: 'ML', dial: '+223', en: 'Mali', ar: 'مالي' },
    { code: 'NE', dial: '+227', en: 'Niger', ar: 'النيجر' },
    { code: 'TD', dial: '+235', en: 'Chad', ar: 'تشاد' },
    { code: 'ZM', dial: '+260', en: 'Zambia', ar: 'زامبيا' },
    { code: 'ZW', dial: '+263', en: 'Zimbabwe', ar: 'زيمبابوي' },
    { code: 'RW', dial: '+250', en: 'Rwanda', ar: 'رواندا' },
    { code: 'BF', dial: '+226', en: 'Burkina Faso', ar: 'بوركينا فاسو' },
    { code: 'BJ', dial: '+229', en: 'Benin', ar: 'بنين' },
    { code: 'TG', dial: '+228', en: 'Togo', ar: 'توغو' },
    { code: 'GN', dial: '+224', en: 'Guinea', ar: 'غينيا' },
    { code: 'GA', dial: '+241', en: 'Gabon', ar: 'الغابون' },
    { code: 'CD', dial: '+243', en: 'DR Congo', ar: 'جمهورية الكونغو الديمقراطية' },
    { code: 'CG', dial: '+242', en: 'Congo', ar: 'الكونغو' },
    { code: 'AO', dial: '+244', en: 'Angola', ar: 'أنغولا' },
    { code: 'MZ', dial: '+258', en: 'Mozambique', ar: 'موزمبيق' },
    { code: 'MW', dial: '+265', en: 'Malawi', ar: 'مالاوي' },
    { code: 'NA', dial: '+264', en: 'Namibia', ar: 'ناميبيا' },
    { code: 'BW', dial: '+267', en: 'Botswana', ar: 'بوتسوانا' },
    { code: 'SS', dial: '+211', en: 'South Sudan', ar: 'جنوب السودان' },
    { code: 'ER', dial: '+291', en: 'Eritrea', ar: 'إريتريا' },
    { code: 'MG', dial: '+261', en: 'Madagascar', ar: 'مدغشقر' },
    { code: 'MU', dial: '+230', en: 'Mauritius', ar: 'موريشيوس' },
    { code: 'SC', dial: '+248', en: 'Seychelles', ar: 'سيشل' },
    { code: 'LS', dial: '+266', en: 'Lesotho', ar: 'ليسوتو' },
    { code: 'SZ', dial: '+268', en: 'Eswatini', ar: 'إسواتيني' },
    { code: 'GM', dial: '+220', en: 'Gambia', ar: 'غامبيا' },
    { code: 'SL', dial: '+232', en: 'Sierra Leone', ar: 'سيراليون' },
    { code: 'LR', dial: '+231', en: 'Liberia', ar: 'ليبيريا' },
    { code: 'CV', dial: '+238', en: 'Cape Verde', ar: 'الرأس الأخضر' },
    { code: 'GW', dial: '+245', en: 'Guinea-Bissau', ar: 'غينيا بيساو' },
    { code: 'ST', dial: '+239', en: 'Sao Tome and Principe', ar: 'ساو تومي وبرينسيب' },
    { code: 'GQ', dial: '+240', en: 'Equatorial Guinea', ar: 'غينيا الاستوائية' },
    { code: 'BI', dial: '+257', en: 'Burundi', ar: 'بوروندي' },
    { code: 'US', dial: '+1', en: 'United States', ar: 'الولايات المتحدة' },
    { code: 'CA', dial: '+1', en: 'Canada', ar: 'كندا' },
    { code: 'MX', dial: '+52', en: 'Mexico', ar: 'المكسيك' },
    { code: 'BR', dial: '+55', en: 'Brazil', ar: 'البرازيل' },
    { code: 'AR', dial: '+54', en: 'Argentina', ar: 'الأرجنتين' },
    { code: 'CL', dial: '+56', en: 'Chile', ar: 'تشيلي' },
    { code: 'CO', dial: '+57', en: 'Colombia', ar: 'كولومبيا' },
    { code: 'PE', dial: '+51', en: 'Peru', ar: 'بيرو' },
    { code: 'VE', dial: '+58', en: 'Venezuela', ar: 'فنزويلا' },
    { code: 'EC', dial: '+593', en: 'Ecuador', ar: 'الإكوادور' },
    { code: 'BO', dial: '+591', en: 'Bolivia', ar: 'بوليفيا' },
    { code: 'PY', dial: '+595', en: 'Paraguay', ar: 'باراغواي' },
    { code: 'UY', dial: '+598', en: 'Uruguay', ar: 'أوروغواي' },
    { code: 'CR', dial: '+506', en: 'Costa Rica', ar: 'كوستاريكا' },
    { code: 'PA', dial: '+507', en: 'Panama', ar: 'بنما' },
    { code: 'GT', dial: '+502', en: 'Guatemala', ar: 'غواتيمالا' },
    { code: 'HN', dial: '+504', en: 'Honduras', ar: 'هندوراس' },
    { code: 'SV', dial: '+503', en: 'El Salvador', ar: 'السلفادور' },
    { code: 'NI', dial: '+505', en: 'Nicaragua', ar: 'نيكاراغوا' },
    { code: 'CU', dial: '+53', en: 'Cuba', ar: 'كوبا' },
    { code: 'DO', dial: '+1', en: 'Dominican Republic', ar: 'جمهورية الدومينيكان' },
    { code: 'JM', dial: '+1', en: 'Jamaica', ar: 'جامايكا' },
    { code: 'TT', dial: '+1', en: 'Trinidad and Tobago', ar: 'ترينيداد وتوباغو' },
    { code: 'HT', dial: '+509', en: 'Haiti', ar: 'هايتي' },
    { code: 'GY', dial: '+592', en: 'Guyana', ar: 'غيانا' },
    { code: 'SR', dial: '+597', en: 'Suriname', ar: 'سورينام' },
    { code: 'BZ', dial: '+501', en: 'Belize', ar: 'بليز' },
    { code: 'AU', dial: '+61', en: 'Australia', ar: 'أستراليا' },
    { code: 'NZ', dial: '+64', en: 'New Zealand', ar: 'نيوزيلندا' },
    { code: 'FJ', dial: '+679', en: 'Fiji', ar: 'فيجي' },
    { code: 'PG', dial: '+675', en: 'Papua New Guinea', ar: 'بابوا غينيا الجديدة' },
    { code: 'OTHER', dial: '', en: 'Other', ar: 'دولة أخرى' }
  ];


  function lang() {
    var stored = localStorage.getItem('boltane-lang');
    return stored === 'ar' ? 'ar' : 'en';
  }
  function t(key) {
    var dict = (window.__BOLTANE_STRINGS__ || {})[lang()];
    return (dict && dict[key]) || key;
  }

  // ---------------------------------------------------------------
  // Local state
  // ---------------------------------------------------------------
  var state = {
    history: [],
    businessContext: null,
    contextSent: false,
    resetsUsed: 0,
    isDone: false,
    metaSetupDone: false,
    selectedCountry: null,
    selectedDial: null
  };

  // Best-effort default for the phone calling-code picker only (never
  // for the "country you live in" field, which always starts blank
  // and must be chosen explicitly). Falls back to Syria if the
  // browser's locale doesn't match anything in our list.
  function guessCountryFromLocale() {
    var langs = (navigator.languages && navigator.languages.length) ? navigator.languages : [navigator.language || ''];
    for (var i = 0; i < langs.length; i++) {
      var parts = String(langs[i]).split('-');
      var region = parts.length > 1 ? parts[parts.length - 1].toUpperCase() : '';
      if (region) {
        var match = COUNTRIES.filter(function (c) { return c.code === region; })[0];
        if (match) return match;
      }
    }
    return COUNTRIES.filter(function (c) { return c.code === 'SY'; })[0] || null;
  }


  function loadState() {
    try {
      var h = localStorage.getItem(STORAGE_KEYS.history);
      var c = localStorage.getItem(STORAGE_KEYS.context);
      var r = localStorage.getItem(STORAGE_KEYS.resets);
      var s = localStorage.getItem(STORAGE_KEYS.contextSent);
      var d = localStorage.getItem(STORAGE_KEYS.done);
      var m = localStorage.getItem(STORAGE_KEYS.metaSetupDone);
      state.history = h ? JSON.parse(h) : [];
      state.businessContext = c ? JSON.parse(c) : null;
      state.resetsUsed = r ? parseInt(r, 10) || 0 : 0;
      state.contextSent = s === '1';
      state.isDone = d === '1';
      state.metaSetupDone = m === '1';
    } catch (e) {
      state.history = [];
    }
  }
  function persist() {
    try {
      localStorage.setItem(STORAGE_KEYS.history, JSON.stringify(state.history));
      if (state.businessContext) localStorage.setItem(STORAGE_KEYS.context, JSON.stringify(state.businessContext));
      localStorage.setItem(STORAGE_KEYS.resets, String(state.resetsUsed));
      localStorage.setItem(STORAGE_KEYS.contextSent, state.contextSent ? '1' : '0');
      localStorage.setItem(STORAGE_KEYS.done, state.isDone ? '1' : '0');
      localStorage.setItem(STORAGE_KEYS.metaSetupDone, state.metaSetupDone ? '1' : '0');
    } catch (e) { /* storage full/unavailable — degrade silently, session just won't persist */ }
  }

  // ---------------------------------------------------------------
  // Stage switching
  // ---------------------------------------------------------------
  function showStage(name) {
    document.querySelectorAll('.ava-stage').forEach(function (el) {
      el.classList.toggle('is-active', el.getAttribute('data-stage') === name);
    });
  }

  // ---------------------------------------------------------------
  // Generic country picker (used for both the "country you live in"
  // field and the phone calling-code field). mode 'name' shows the
  // full country name once selected; mode 'dial' shows just the
  // calling code (e.g. "+963"), with the country name still shown
  // alongside the code inside the dropdown list for context.
  // ---------------------------------------------------------------
  function setupPicker(config) {
    var picker = document.querySelector(config.pickerSel);
    if (!picker) return null;

    var btn = picker.querySelector(config.btnSel);
    var dropdown = picker.querySelector(config.dropdownSel);
    var search = picker.querySelector(config.searchSel);
    var list = picker.querySelector(config.listSel);
    var swatch = picker.querySelector(config.swatchSel);
    var label = picker.querySelector(config.labelSel);
    var hiddenInput = document.querySelector(config.hiddenSel);
    var selected = null;

    function optionLabel(c) {
      var name = lang() === 'ar' ? c.ar : c.en;
      return config.mode === 'dial' ? (name + (c.dial ? ' (' + c.dial + ')' : '')) : name;
    }

    function buttonLabel(c) {
      return config.mode === 'dial' ? (c.dial || '+') : (lang() === 'ar' ? c.ar : c.en);
    }

    function select(c, opts) {
      selected = c;
      swatch.innerHTML = flagMarkup(c.code);
      label.textContent = buttonLabel(c);
      label.classList.remove('placeholder-text');
      hiddenInput.value = config.mode === 'dial' ? c.code : c.code;
      if (!(opts && opts.silent)) picker.classList.remove('is-open');
      if (config.onSelect) config.onSelect(c);
    }

    function renderList(query) {
      var q = (query || '').trim().toLowerCase();
      var items = !q ? COUNTRIES : COUNTRIES.filter(function (c) {
        return c.en.toLowerCase().indexOf(q) !== -1 ||
          c.ar.indexOf(q) !== -1 ||
          c.code.toLowerCase().indexOf(q) !== -1 ||
          c.dial.indexOf(q) !== -1;
      });
      list.innerHTML = '';
      if (!items.length) {
        var empty = document.createElement('p');
        empty.className = 'country-list-empty';
        empty.textContent = t('countryNoResults');
        list.appendChild(empty);
        return;
      }
      items.forEach(function (c) {
        var opt = document.createElement('button');
        opt.type = 'button';
        opt.className = 'country-option';
        opt.setAttribute('role', 'option');
        opt.innerHTML = flagMarkup(c.code) + '<span>' + optionLabel(c) + '</span>';
        opt.addEventListener('click', function () { select(c); });
        list.appendChild(opt);
      });
    }

    function refresh() {
      renderList(search ? search.value : '');
      if (selected) {
        label.textContent = buttonLabel(selected);
        label.classList.remove('placeholder-text');
      }
    }

    if (!picker.dataset.wired) {
      picker.dataset.wired = '1';
      btn.addEventListener('click', function () {
        var willOpen = !picker.classList.contains('is-open');
        picker.classList.toggle('is-open', willOpen);
        if (willOpen && search) {
          search.value = '';
          renderList('');
          setTimeout(function () { search.focus(); }, 0);
        }
      });
      if (search) {
        search.addEventListener('input', function () { renderList(search.value); });
        search.addEventListener('click', function (e) { e.stopPropagation(); });
      }
      document.addEventListener('click', function (e) {
        if (!picker.contains(e.target)) picker.classList.remove('is-open');
      });
    }

    renderList('');
    return { select: select, refresh: refresh, getSelected: function () { return selected; } };
  }

  var countryPickerCtl = null;
  var dialPickerCtl = null;

  function initPickers() {
    countryPickerCtl = setupPicker({
      pickerSel: '[data-country-picker]',
      btnSel: '[data-country-btn]',
      dropdownSel: '[data-country-dropdown]',
      searchSel: '[data-country-search]',
      listSel: '[data-country-list]',
      swatchSel: '[data-country-swatch]',
      labelSel: '[data-country-label]',
      hiddenSel: '[data-country-value]',
      mode: 'name',
      onSelect: function (c) { state.selectedCountry = c; }
    });

    dialPickerCtl = setupPicker({
      pickerSel: '[data-dial-picker]',
      btnSel: '[data-dial-btn]',
      dropdownSel: '[data-dial-dropdown]',
      searchSel: '[data-dial-search]',
      listSel: '[data-dial-list]',
      swatchSel: '[data-dial-swatch]',
      labelSel: '[data-dial-label]',
      hiddenSel: '[data-dial-value]',
      mode: 'dial',
      onSelect: function (c) { state.selectedDial = c; }
    });

    if (dialPickerCtl) {
      var guess = guessCountryFromLocale();
      if (guess) dialPickerCtl.select(guess, { silent: true });
    }
  }


  // ---------------------------------------------------------------
  // Intake form -> business_context -> transition -> chat
  // ---------------------------------------------------------------
  function initIntake() {
    var form = document.querySelector('[data-intake-form]');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var projectName = form.querySelector('[name="projectName"]').value.trim();
      var rawNumber = form.querySelector('[name="contactNumber"]').value.trim();
      var domain = form.querySelector('[name="domain"]').value.trim();
      var nature = form.querySelector('[name="nature"]').value.trim();
      var country = state.selectedCountry;
      var dial = state.selectedDial;

      if (!projectName || !rawNumber || !domain || !nature || !country || !dial) {
        var warn = form.querySelector('[data-intake-warning]');
        if (warn) warn.hidden = false;
        return;
      }

      var localNumber = rawNumber.replace(/^0+/, '');
      var contactNumber = dial.dial + ' ' + localNumber;

      state.businessContext = {
        project_name: projectName,
        contact_number: contactNumber,
        country: country.code,
        domain: domain,
        nature: nature
      };
      state.contextSent = false;
      persist();

      checkForExistingSession(contactNumber, function (found) {
        if (found) {
          showResumeBanner(found);
        } else {
          runTransition();
        }
      });
    });
  }

  function showResumeBanner(sessionData) {
    var banner = document.querySelector('[data-resume-banner]');
    showStage('transition');
    runTransition(function () {
      if (!banner) return;
      banner.hidden = false;
      banner.querySelector('[data-resume-continue]').onclick = function () {
        state.history = sessionData.conversation_history || [];
        state.contextSent = true;
        persist();
        banner.hidden = true;
        enterChat();
      };
      banner.querySelector('[data-resume-restart]').onclick = function () {
        banner.hidden = true;
        state.history = [];
        state.contextSent = false;
        persist();
        enterChat();
      };
    });
  }

  // Best-effort only — if the backend isn't deployed yet or the
  // lookup fails for any reason, we simply proceed as a fresh
  // session rather than blocking the visitor.
  function checkForExistingSession(contactNumber, cb) {
    if (!AVA_BACKEND_URL || AVA_BACKEND_URL.indexOf('YOUR_AVA_BACKEND_URL_HERE') === 0) {
      cb(null);
      return;
    }
    fetch(AVA_BACKEND_URL + '/lookup-signup?contact_number=' + encodeURIComponent(contactNumber))
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (data) { cb(data && data.found ? data : null); })
      .catch(function () { cb(null); });
  }

  function runTransition(after) {
    showStage('transition');
    setTimeout(function () {
      if (typeof after === 'function') { after(); }
      else { enterChat(); }
    }, 2200);
  }

  function enterChat() {
    renderHistory();
    updateResetUI();
    if (state.isDone) {
      lockChatInput();
      showStage(state.metaSetupDone ? 'chat' : 'meta-setup');
    } else {
      showStage('chat');
    }
  }

  // ---------------------------------------------------------------
  // Chat rendering (reuses index.html's bubble/reveal-wipe markup)
  // ---------------------------------------------------------------
  function renderHistory() {
    var win = document.querySelector('[data-ava-window]');
    if (!win) return;
    win.innerHTML = '';
    state.history.forEach(function (turn, i) {
      appendBubble(turn.role, turn.content, i === state.history.length - 1 && state.isDone);
    });
    win.scrollTop = win.scrollHeight;
  }

  function appendBubble(role, text, isFinal) {
    var win = document.querySelector('[data-ava-window]');
    if (!win) return;
    if (role === 'user') {
      var u = document.createElement('div');
      u.className = 'bubble bubble-user';
      u.textContent = text;
      win.appendChild(u);
    } else {
      var r = document.createElement('div');
      r.className = 'bubble bubble-reply' + (isFinal ? ' bubble-final' : '');
      var span = document.createElement('span');
      span.className = 'reveal-text';
      span.textContent = text;
      r.appendChild(span);
      win.appendChild(r);
      requestAnimationFrame(function () {
        requestAnimationFrame(function () { r.classList.add('is-revealing'); });
      });
    }
    win.scrollTop = win.scrollHeight;
  }

  function setTyping(on) {
    var el = document.querySelector('[data-typing]');
    if (el) el.hidden = !on;
  }

  function lockChatInput() {
    var row = document.querySelector('[data-chat-input-row]');
    if (row) {
      row.querySelector('input').disabled = true;
      row.querySelector('button').disabled = true;
    }
    var note = document.querySelector('[data-done-note]');
    if (note) note.hidden = false;
  }

  function showErrorFallback() {
    var box = document.querySelector('[data-chat-error]');
    if (box) box.hidden = false;
  }

  // ---------------------------------------------------------------
  // Sending messages
  // ---------------------------------------------------------------
  function initChatForm() {
    var row = document.querySelector('[data-chat-input-row]');
    if (!row) return;

    row.addEventListener('submit', function (e) {
      e.preventDefault();
      if (state.isDone) return;
      var input = row.querySelector('input');
      var text = input.value.trim();
      if (!text) return;
      input.value = '';
      sendMessage(text);
    });
  }

  function sendMessage(text) {
    var referralInput = document.querySelector('[data-referral-input]');
    var referralCode = referralInput ? referralInput.value.trim() : '';

    state.history.push({ role: 'user', content: text });
    appendBubble('user', text, false);
    persist();
    setTyping(true);

    var payload = {
      conversation_history: state.history,
      user_message: text
    };
    if (!state.contextSent && state.businessContext) {
      payload.business_context = state.businessContext;
    }
    if (referralCode) {
      payload.referral_code = referralCode;
    }

    if (!AVA_BACKEND_URL || AVA_BACKEND_URL.indexOf('YOUR_AVA_BACKEND_URL_HERE') === 0) {
      // Backend not deployed yet — degrade gracefully rather than
      // hang on a typing indicator forever.
      setTimeout(function () {
        setTyping(false);
        showErrorFallback();
      }, 600);
      return;
    }

    fetch(AVA_BACKEND_URL + '/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (res) {
        if (!res.ok) throw new Error('bad status');
        return res.json();
      })
      .then(function (data) {
        setTyping(false);
        state.contextSent = true;
        state.history.push({ role: 'assistant', content: data.reply });
        state.isDone = !!data.done;
        persist();
        appendBubble('assistant', data.reply, state.isDone);
        if (state.isDone) {
          lockChatInput();
          if (!state.metaSetupDone) showStage('meta-setup');
        }
      })
      .catch(function () {
        setTyping(false);
        showErrorFallback();
      });
  }

  // ---------------------------------------------------------------
  // Reset (max 3 uses per attempt)
  // ---------------------------------------------------------------
  function updateResetUI() {
    var btn = document.querySelector('[data-reset-btn]');
    var counter = document.querySelector('[data-reset-count]');
    if (!btn) return;
    var left = MAX_RESETS - state.resetsUsed;
    btn.disabled = left <= 0 || state.isDone;
    if (counter) counter.textContent = left > 0 ? (left + ' ' + t('chatResetLeft')) : t('chatResetNone');
  }

  function initReset() {
    var btn = document.querySelector('[data-reset-btn]');
    if (!btn) return;
    btn.addEventListener('click', function () {
      if (state.resetsUsed >= MAX_RESETS || state.isDone) return;
      if (!window.confirm(t('chatRestartConfirm'))) return;
      state.resetsUsed += 1;
      state.history = [];
      state.contextSent = false; // resend business_context on the next message after a reset
      persist();
      renderHistory();
      updateResetUI();
    });
  }

  // ---------------------------------------------------------------
  // PDF attach
  // ---------------------------------------------------------------
  function initAttach() {
    var input = document.querySelector('[data-pdf-input]');
    var status = document.querySelector('[data-pdf-status]');
    if (!input) return;

    input.addEventListener('change', function () {
      var file = input.files && input.files[0];
      if (!file) return;
      if (status) { status.hidden = false; status.textContent = t('chatAttachSending'); }

      if (!AVA_BACKEND_URL || AVA_BACKEND_URL.indexOf('YOUR_AVA_BACKEND_URL_HERE') === 0) {
        if (status) status.textContent = t('chatAttachErr');
        return;
      }

      var fd = new FormData();
      fd.append('file', file);
      if (state.businessContext) fd.append('contact_number', state.businessContext.contact_number);

      fetch(AVA_BACKEND_URL + '/upload-pdf', { method: 'POST', body: fd })
        .then(function (res) { if (!res.ok) throw new Error('bad status'); return res.json(); })
        .then(function () { if (status) status.textContent = t('chatAttachOk'); })
        .catch(function () { if (status) status.textContent = t('chatAttachErr'); });
    });
  }

  // ---------------------------------------------------------------
  // Meta / WhatsApp API setup (runs after the chat marks done:true,
  // before the OTP-instructions reply already sitting in the chat
  // history becomes visible).
  // ---------------------------------------------------------------
  function initMetaSetup() {
    var form = document.querySelector('[data-meta-setup-form]');
    if (!form) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var legalName = form.querySelector('[name="legalName"]').value.trim();
      var phoneNumberId = form.querySelector('[name="phoneNumberId"]').value.trim();
      var accessToken = form.querySelector('[name="accessToken"]').value.trim();
      var warn = form.querySelector('[data-meta-setup-warning]');
      var submitBtn = form.querySelector('[data-meta-setup-submit]');

      if (!legalName || !phoneNumberId || !accessToken) {
        if (warn) { warn.textContent = t('metaSetupWarning'); warn.hidden = false; }
        return;
      }
      if (warn) warn.hidden = true;

      var contactNumber = state.businessContext ? state.businessContext.contact_number : '';

      if (!AVA_BACKEND_URL || AVA_BACKEND_URL.indexOf('YOUR_AVA_BACKEND_URL_HERE') === 0) {
        if (warn) { warn.textContent = t('chatErrorFallback'); warn.hidden = false; }
        return;
      }

      submitBtn.disabled = true;
      var originalLabel = submitBtn.textContent;
      submitBtn.textContent = t('metaSetupSubmitting');

      fetch(AVA_BACKEND_URL + '/complete-setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_number: contactNumber,
          legal_name: legalName,
          phone_number_id: phoneNumberId,
          access_token: accessToken
        })
      })
        .then(function (res) {
          if (!res.ok) throw new Error('bad status');
          return res.json().catch(function () { return {}; });
        })
        .then(function () {
          state.metaSetupDone = true;
          persist();
          // Reveal the chat stage — it already holds Ava's final,
          // locked reply (the OTP/activation instructions) from
          // when done:true fired, so this is the OTP-instructions
          // hand-off the flow was building toward.
          showStage('chat');
        })
        .catch(function () {
          if (warn) { warn.textContent = t('metaSetupError'); warn.hidden = false; }
          submitBtn.disabled = false;
          submitBtn.textContent = originalLabel;
        });
    });
  }

  // ---------------------------------------------------------------
  // Init
  // ---------------------------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    loadState();
    initPickers();
    initIntake();
    initChatForm();
    initReset();
    initAttach();
    initMetaSetup();

    if (state.businessContext && (state.history.length || state.contextSent)) {
      // A session already exists on this device — skip straight to chat.
      renderHistory();
      updateResetUI();
      if (state.isDone) {
        lockChatInput();
        showStage(state.metaSetupDone ? 'chat' : 'meta-setup');
      } else {
        showStage('chat');
      }
    } else {
      showStage('intake');
    }

    // Re-render picker labels and chat strings if the language
    // toggle (from main.js) changes after this page inits.
    document.addEventListener('boltane:langchange', function () {
      if (countryPickerCtl) countryPickerCtl.refresh();
      if (dialPickerCtl) dialPickerCtl.refresh();
      updateResetUI();
    });
  });
})();
