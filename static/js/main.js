// ===================================================================
// EyeSariwa — main.js
// ===================================================================

// ===================================================================
// TRANSLATIONS  (centralized — all user-facing strings live here)
// ===================================================================
var TRANSLATIONS = {

  // ── FILIPINO (default) ────────────────────────────────────────────
  fil: {
    loading_text: 'Inihahanda ang scanner…',

    // Home
    home_welcome:     'welcome to',
    home_headline:    'Tingnan kung sariwa ang karne sa ilang segundo.',
    home_tagline:     'Kunan ng larawan ang baka, baboy, o manok. Titingnan ng EyeSariwa ang kulay na nakikita sa kuha.',
    home_kicker:      'Safe & Contactless Meat Assessment',
    benefit_contactless_title: 'Contactless',
    benefit_contactless_copy:  'Hindi kailangang hawakan ang karne.',
    benefit_fast_title:        'Mabilis',
    benefit_fast_copy:         'Resulta sa ilang segundo.',
    benefit_easy_title:        'Madaling Gamitin',
    benefit_easy_copy:         'Kumuha o mag-upload ng kuha.',
    disclaimer_short: 'Kulay lang ng karne sa kuha ang tinitingnan. Hindi ito kapalit ng opisyal na inspeksyon.',
    btn_start_scan:   'Magsimula',
    btn_view_history: 'Tingnan ang Mga Na-scan',

    // Step 1
    step1_title:        'Pumili ng Uri ng Karne',
    step1_helper:       'Anong karne ang gusto mong tingnan?',
    species_beef:       'Baka',
    species_beef_sub:   'Bulalo Cut · Tapa Cut',
    species_pork:       'Baboy',
    species_pork_sub:   'Liempo · Pork Chop',
    species_chicken:    'Manok',
    species_chicken_sub:'Hita · Dibdib',
    btn_continue:       'Ituloy',

    // Step 2
    step2_title:           'Pumili ng Hiwa',
    step2_helper:          'Piliin ang hiwa na pinakakatulad ng karne mo.',
    cut_beef_shank:        'Bulalo Cut',
    cut_beef_sirloin:      'Tapa Cut',
    cut_pork_belly:        'Liempo',
    cut_pork_chop:         'Pork Chop',
    cut_chicken_drumstick: 'Hita ng Manok',
    cut_chicken_breast:    'Dibdib ng Manok',

    // Step 3 — Before You Scan
    step3_title:       'Bago Mag-scan',
    step3_sub:         'Sundin ang mga ito para mas malinaw ang kuha.',
    tip_lighting:      'Gamitin ang flash o maliwanag na puting ilaw sa karne. Iwasan ang dilaw o pulang ilaw ng tindahan.',
    tip_focus:         'Igitna ang karne sa loob ng frame.',
    tip_blur:          'Iwasang malabo ang kuha — huwag igalaw ang telepono.',
    tip_confirm:       'Siguraduhing tama ang napiling hiwa bago mag-scan.',
    btn_continue_scan: 'Ituloy sa Pag-scan',

    // Step 4 — Scan
    step4_title:        'I-scan ang Karne',
    scan_empty_hint:    'Pindutin ang “Kuhanan ang Karne” para magsimula. Gumamit ng flash o puting ilaw at igitna ang karne sa frame.',
    scan_captured_hint: 'Punuin ng karne ang kahon, tapos pindutin ang Tingnan ang Karne.',
    crop_hint:          'I-pinch at i-drag — punuin ng karne ang puting kahon.',
    crop_bg_warning:    'Mukhang background ang nasa loob ng kahon. I-adjust para mapuno ng karne, o pindutin ulit ang Tingnan ang Karne para ituloy.',
    btn_take_photo:     'Kuhanan ang Karne',
    btn_upload_gallery: 'Pumili sa Gallery',
    btn_check_meat:     'Tingnan ang Karne',
    btn_retake:         'Ulitin ang Scan',
    btn_torch_on:       'Buksan ang Flash',
    btn_torch_off:      'Patayin ang Flash',
    torch_ready:        'Flash available sa live camera.',
    torch_active:       'Flash naka-on para mas maliwanag ang kuha.',
    torch_unavailable:  'Hindi available ang flash sa browser na ito. Gumamit ng maliwanag na lugar o manual flash.',
    torch_error:        'Hindi mabuksan ang flash sa device na ito.',

    // Analyzing
    analyzing_title: 'Tinitingnan…',
    analyzing_sub:   'Sandali lang habang tinitingnan ng EyeSariwa ang kulay sa kuha.',
    analyzing_note:  'Maaaring tumagal ng ilang segundo.',

    // Result
    result_title:                  'Resulta ng Scan',
    result_fresh_label:            'Sariwa',
    result_suspicious_label:       'Kaduda-duda',
    result_stale_label:            'Hindi Sariwa',
    result_fresh_explanation:      'Ang kulay sa kuha ay mukhang malapit sa sariwang karne.',
    result_suspicious_explanation: 'Mukhang kakaiba ang kulay. Tingnan nang mabuti bago bumili.',
    result_stale_explanation:      'Ang kulay sa kuha ay hindi mukhang sariwa.',
    result_fresh_rec:              'Tingnan pa rin ang karne bago bumili.',
    result_suspicious_rec:         'Tingnan ang amoy, lambot o tigas, at paghawak sa karne.',
    result_stale_rec:              'Iwasang bilhin ang karne.',
    rec_label:                     'Rekomendasyon',
    details_label:                 'Ipakita ang teknikal na detalye',
    scope_note:                    'Batay sa kulay lang ng karne sa kuha. Hindi ito kapalit ng opisyal na inspeksyon.',
    btn_scan_again: 'Ulitin ang Scan',
    btn_back_home:  'Bumalik sa Home',

    // History
    history_title:        'Mga Na-scan',
    btn_clear:            'Burahin',
    recent_scans:         'Mga Na-scan',
    history_empty_title:  'Wala pang na-scan.',
    history_empty_sub:    'Dito lalabas ang mga karne na na-scan mo.',
    history_empty_helper: 'Subukan ang unang scan para makita ang resulta dito.',
    btn_first_scan:       'Mag-scan na',
    clear_confirm_title:  'Burahin ang mga na-scan?',
    clear_confirm_msg:    'Mawawala ang lahat ng na-save na scan.',
    btn_cancel:           'Kanselahin',
    btn_clear_all:        'Burahin',
    stat_fresh:           'Sariwa',
    stat_suspicious:      'Kaduda-duda',
    stat_stale:           'Hindi Sariwa',
    stat_total:           'Lahat ng Scan',

    // PWA / Errors
    offline_title:         'Wala kang koneksyon.',
    offline_msg:           'Kailangan ng internet ng EyeSariwa para tingnan ang kulay ng karne sa kuha.',
    pwa_error_title:       'Hindi na-load ang page.',
    pwa_error_msg:         'May problema. I-reload ang page at subukang muli.',
    pwa_slow_title:        'Matagal na.',
    pwa_slow_msg:          'Maaaring mabagal ang koneksyon. Subukan muli o bumalik sa susunod.',
    pwa_unavailable_title: 'Abala ang server.',
    pwa_unavailable_msg:   'Hindi namin ma-reach ang analyzer ng EyeSariwa. Subukan muli mamaya.',
    btn_try_again:         'Ulitin ang Scan',
    btn_back_home_pwa:     'Bumalik sa Home'
  },

  // ── ENGLISH ───────────────────────────────────────────────────────
  en: {
    loading_text: 'Preparing scanner…',

    // Home
    home_welcome:     'welcome to',
    home_headline:    'Check meat freshness in seconds.',
    home_tagline:     'Take a photo of beef, pork, or chicken. EyeSariwa checks the visible color in the image.',
    home_kicker:      'Safe & Contactless Meat Assessment',
    benefit_contactless_title: 'Contactless',
    benefit_contactless_copy:  'No need to handle raw meat.',
    benefit_fast_title:        'Fast',
    benefit_fast_copy:         'Get a result in seconds.',
    benefit_easy_title:        'Easy to Use',
    benefit_easy_copy:         'Take or upload a photo.',
    disclaimer_short: 'EyeSariwa only checks visible meat color in the photo. It is not a replacement for official inspection.',
    btn_start_scan:   'Start',
    btn_view_history: 'View Scans',

    // Step 1
    step1_title:        'Choose Meat Type',
    step1_helper:       'What meat do you want to check?',
    species_beef:       'Beef',
    species_beef_sub:   'Beef Shank · Beef Sirloin',
    species_pork:       'Pork',
    species_pork_sub:   'Belly · Chop',
    species_chicken:    'Chicken',
    species_chicken_sub:'Drumstick · Breast',
    btn_continue:       'Continue',

    // Step 2
    step2_title:           'Choose Cut',
    step2_helper:          'Choose the cut that looks closest to your meat.',
    cut_beef_shank:        'Beef Shank',
    cut_beef_sirloin:      'Beef Sirloin',
    cut_pork_belly:        'Pork Belly',
    cut_pork_chop:         'Pork Chop',
    cut_chicken_drumstick: 'Chicken Drumstick',
    cut_chicken_breast:    'Chicken Breast',

    // Step 3
    step3_title:       'Before You Scan',
    step3_sub:         'Follow these tips for a clearer photo.',
    tip_lighting:      'Light the meat with your phone flash or a bright white light. Avoid the warm or red stall lights.',
    tip_focus:         'Place the meat in the center of the frame.',
    tip_blur:          'Avoid blurry photos — keep your phone steady.',
    tip_confirm:       'Make sure the selected cut is correct before scanning.',
    btn_continue_scan: 'Continue to Scan',

    // Step 4
    step4_title:        'Scan Meat Surface',
    scan_empty_hint:    'Tap “Take Photo” to start. Use your flash or a bright white light and center the meat in the frame.',
    scan_captured_hint: 'Fill the box with meat, then tap Check Meat.',
    crop_hint:          'Pinch & drag so the meat fills the white box.',
    crop_bg_warning:    'The box looks like background. Adjust so meat fills it, or tap Check Meat again to continue.',
    btn_take_photo:     'Take Photo',
    btn_upload_gallery: 'Upload from Gallery',
    btn_check_meat:     'Check Meat',
    btn_retake:         'Retake',
    btn_torch_on:       'Turn Flash On',
    btn_torch_off:      'Turn Flash Off',
    torch_ready:        'Flash is available for the live camera.',
    torch_active:       'Flash is on for a brighter photo.',
    torch_unavailable:  'Flash is not available in this browser. Use a bright area or manual flash.',
    torch_error:        'Flash could not be turned on for this device.',

    // Analyzing
    analyzing_title: 'Analyzing image…',
    analyzing_sub:   'Please wait while EyeSariwa checks the visible surface color.',
    analyzing_note:  'This may take a few seconds.',

    // Result
    result_title:                  'Scan Result',
    result_fresh_label:            'Fresh',
    result_suspicious_label:       'Suspicious',
    result_stale_label:            'Stale',
    result_fresh_explanation:      'The visible color looks close to fresh meat.',
    result_suspicious_explanation: 'The visible color looks unusual. Check carefully before buying.',
    result_stale_explanation:      'The visible color does not look fresh.',
    result_fresh_rec:              'Still check the meat before buying.',
    result_suspicious_rec:         'Check the smell, texture, and how the meat is handled.',
    result_stale_rec:              'Avoid buying this meat.',
    rec_label:                     'Recommendation',
    details_label:                 'Show technical details',
    scope_note:                    'Based on visible surface color only. Does not replace official meat inspection.',
    btn_scan_again: 'Scan Again',
    btn_back_home:  'Back to Home',

    // History
    history_title:        'Scanned Items',
    btn_clear:            'Clear',
    recent_scans:         'Scanned Items',
    history_empty_title:  'No scans yet.',
    history_empty_sub:    'Your scanned meat items will appear here.',
    history_empty_helper: 'Try your first scan to see results here.',
    btn_first_scan:       'Start Scanning',
    clear_confirm_title:  'Clear scanned items?',
    clear_confirm_msg:    'All saved scans will be removed.',
    btn_cancel:           'Cancel',
    btn_clear_all:        'Clear',
    stat_fresh:           'Fresh',
    stat_suspicious:      'Suspicious',
    stat_stale:           'Stale',
    stat_total:           'Total Scans',

    // PWA / Errors
    offline_title:         'You’re offline.',
    offline_msg:           'EyeSariwa needs an internet connection to check visible meat color.',
    pwa_error_title:       'Page didn’t load.',
    pwa_error_msg:         'Something went wrong. Reload and try again.',
    pwa_slow_title:        'Taking longer than usual.',
    pwa_slow_msg:          'Your connection may be slow. Try again or come back in a minute.',
    pwa_unavailable_title: 'Server is busy.',
    pwa_unavailable_msg:   'We couldn’t reach EyeSariwa’s analyzer. Please try again in a moment.',
    btn_try_again:         'Try Again',
    btn_back_home_pwa:     'Back to Home'
  }
};

// ===================================================================
// CONSTANTS
// ===================================================================
var HISTORY_KEY      = 'eyesariwa_scans';
var HISTORY_MAX      = 50;
var LANG_KEY         = 'eyesariwa_language';
var CLASSIFY_TIMEOUT = 120000;

var SPECIES_CUTS = {
  beef:    ['beef_shank', 'beef_sirloin'],
  pork:    ['pork_belly', 'pork_chop'],
  chicken: ['chicken_drumstick', 'chicken_breast']
};

var CUT_ICONS = {
  beef_shank:        'icon_beef_shank',
  beef_sirloin:      'icon_beef_sirloin',
  pork_belly:        'icon_pork_belly',
  pork_chop:         'icon_pork_chop',
  chicken_drumstick: 'icon_chicken_drumstick',
  chicken_breast:    'icon_chicken_breast'
};

var CUT_EMOJI = {
  beef_shank:        '🦴', // 🦴
  beef_sirloin:      '🥩', // 🥩
  pork_belly:        '🥓', // 🥓
  pork_chop:         '🍖', // 🍖
  chicken_drumstick: '🍗', // 🍗
  chicken_breast:    '🐔'  // 🐔
};

// Screens that get a language switcher injected into their header
var LANG_SWITCHER_SELECTORS = ['.main-header', '.screen-header'];

// ===================================================================
// SESSION STATE
// ===================================================================
var currentLang       = 'fil';   // default: Filipino
var selectedSpecies   = null;
var selectedCut       = null;
var selectedImageBlob = null;
var selectedImageName = null;
var previewURL        = null;
var cameraStream      = null;
var torchTrack        = null;
var torchSupported    = false;
var torchOn           = false;
var lastClassifyBlob  = null;
var lastClassifyName  = null;
var lastResultData    = null;

// ===================================================================
// i18n HELPERS
// ===================================================================
function t(key) {
  var dict = TRANSLATIONS[currentLang] || TRANSLATIONS.fil;
  return Object.prototype.hasOwnProperty.call(dict, key) ? dict[key] : key;
}

/** Walk every [data-i18n] element and set its textContent. */
function applyLanguage() {
  document.querySelectorAll('[data-i18n]').forEach(function (el) {
    el.textContent = t(el.getAttribute('data-i18n'));
  });
  document.documentElement.lang = currentLang === 'fil' ? 'fil' : 'en';
  updateLangToggleUI();
  updateContextStrip();
  updateTorchUI();
  refreshDynamicLanguageContent();
}

/** Set the active/inactive states on every injected lang-opt button. */
function updateLangToggleUI() {
  document.querySelectorAll('.lang-opt').forEach(function (btn) {
    var isActive = btn.getAttribute('data-lang') === currentLang;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', String(isActive));
  });
}

/** Switch language, persist choice, refresh all text immediately. */
function setLanguage(lang) {
  if (lang !== 'fil' && lang !== 'en') return;
  currentLang = lang;
  try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* ignore */ }
  applyLanguage();
}

function refreshDynamicLanguageContent() {
  var active = document.querySelector('.screen.active');
  if (!active) return;

  if (active.id === 'screen-result' && lastResultData) {
    renderResult(
      lastResultData.classification,
      lastResultData.species,
      lastResultData.cut,
      lastResultData.score,
      lastResultData.hsv_means,
      lastResultData.z_scores
    );
  }

  if (active.id === 'screen-history') {
    renderHistory();
  }
}

/** Restore persisted language preference, or fall back to Filipino. */
function initLanguage() {
  try {
    var saved = localStorage.getItem(LANG_KEY);
    if (saved === 'en' || saved === 'fil') currentLang = saved;
  } catch (e) { /* ignore */ }
  applyLanguage();
}

// ===================================================================
// LANGUAGE SWITCHER — injected into every relevant header
// ===================================================================

/**
 * Build one [ FIL | EN ] pill and append it to `header`.
 * Wires click handlers for each option.
 */
function buildLangSwitcher() {
  var wrap = document.createElement('div');
  wrap.className = 'lang-switcher';
  wrap.setAttribute('role', 'group');
  wrap.setAttribute('aria-label', 'Language');

  ['fil', 'en'].forEach(function (lang) {
    var btn = document.createElement('button');
    btn.className = 'lang-opt';
    btn.setAttribute('data-lang', lang);
    btn.setAttribute('type', 'button');
    btn.setAttribute('aria-pressed', 'false');
    btn.setAttribute('aria-label', lang === 'fil' ? 'Filipino' : 'English');
    btn.textContent = lang === 'fil' ? 'FIL' : 'EN';
    btn.addEventListener('click', function () { setLanguage(lang); });
    wrap.appendChild(btn);
  });

  return wrap;
}

/** Inject lang switchers into all matching header containers. */
function injectLangSwitchers() {
  LANG_SWITCHER_SELECTORS.forEach(function (sel) {
    document.querySelectorAll(sel).forEach(function (header) {
      if (header.querySelector('.lang-switcher')) return; // already injected
      header.appendChild(buildLangSwitcher());
    });
  });
  updateLangToggleUI();
}

// ===================================================================
// SCREEN NAVIGATION
// ===================================================================
function showScreen(id) {
  var current = document.querySelector('.screen.active');
  if (current && current.id === 'screen-scan') stopCamera();

  document.querySelectorAll('.screen').forEach(function (s) {
    s.classList.remove('active');
  });

  var target = document.getElementById(id);
  if (target) {
    target.classList.add('active');
    window.scrollTo(0, 0);
  }

  if (id === 'screen-scan') {
    hideScanError();
    if (selectedImageBlob) {
      updateScanState('captured');
      if (crop.ready) layoutCrop();
      else if (previewURL) initCropImage(previewURL);
    } else {
      updateScanState('empty');
      startCamera();
    }
    updateContextStrip();
  }

  if (id === 'screen-result') {
    document.title = 'EyeSariwa — ' + t('result_title');
  }
}
window.showScreen = showScreen;

// ===================================================================
// CONTEXT STRIP (scan screen)
// ===================================================================
function updateContextStrip() {
  var el = document.getElementById('camera-context-strip');
  if (!el) return;
  var sLabel = selectedSpecies ? t('species_' + selectedSpecies) : '';
  var cLabel = selectedCut     ? t('cut_'     + selectedCut)     : '';
  el.textContent = (sLabel && cLabel) ? sLabel + ' · ' + cLabel : '—';
}

// ===================================================================
// SCAN STATE (empty / live / captured)
// ===================================================================
function updateScanState(state) {
  currentScanState = state;
  var video      = document.getElementById('camera-video');
  var preview    = document.getElementById('capture-preview');
  var ph         = document.getElementById('cam-placeholder');
  var cropFrame  = document.getElementById('crop-frame');
  var cropHint   = document.getElementById('crop-hint');
  var scanFrame  = document.querySelector('#screen-scan .scan-frame');
  var defActions = document.getElementById('scan-actions-default');
  var capActions = document.getElementById('scan-actions-captured');

  function show(el, on) { if (el) el.classList.toggle('hidden', !on); }

  if (state === 'live') {
    show(video, true);  show(preview, false); show(ph, false);
    show(cropFrame, false); show(cropHint, false); show(scanFrame, true);
    show(defActions, true); show(capActions, false);
  } else if (state === 'captured') {
    show(video, false); show(preview, true); show(ph, false);
    show(cropFrame, true);  show(cropHint, true);  show(scanFrame, false);
    show(defActions, false); show(capActions, true);
  } else { // empty
    show(video, false); show(preview, false); show(ph, true);
    show(cropFrame, false); show(cropHint, false); show(scanFrame, true);
    show(defActions, true); show(capActions, false);
  }
}

// ===================================================================
// CAPTURE HELPERS
// ===================================================================
function setCapture(blob, filename) {
  if (previewURL) { URL.revokeObjectURL(previewURL); previewURL = null; }
  selectedImageBlob = blob;
  selectedImageName = filename;
  lastClassifyBlob  = blob;
  lastClassifyName  = filename;
  previewURL = URL.createObjectURL(blob);

  stopCamera();
  updateScanState('captured');
  initCropImage(previewURL);   // load image into the aim-at-box cropper
  hideScanError();
}

function clearCapture() {
  if (previewURL) { URL.revokeObjectURL(previewURL); previewURL = null; }
  selectedImageBlob = null;
  selectedImageName = null;
  crop.ready = false;
  crop.bgConfirmed = false;
  var preview = document.getElementById('capture-preview');
  if (preview) { preview.src = ''; preview.classList.add('hidden'); preview.style.transform = ''; }
}

// ===================================================================
// CROP / AIM-AT-BOX  (the analyzed region = the white square)
// ===================================================================
var currentScanState = 'empty';
var crop = {
  natW: 0, natH: 0, scale: 1, minScale: 1, tx: 0, ty: 0,
  cropL: 0, cropT: 0, size: 0, ready: false, bgConfirmed: false,
  dragging: false, lastX: 0, lastY: 0,
  pinchDist: 0, pinchScale: 1, pinchMidX: 0, pinchMidY: 0
};

function previewEl()   { return document.querySelector('#screen-scan .camera-preview'); }
function previewRect() { var p = previewEl(); return p ? p.getBoundingClientRect() : null; }

function layoutCrop() {
  var p = previewEl();
  var img = document.getElementById('capture-preview');
  if (!p || !img || !crop.natW) return;

  var W = p.clientWidth, H = p.clientHeight;
  var size = Math.round(Math.min(W, H) * 0.74);
  crop.size  = size;
  crop.cropL = Math.round((W - size) / 2);
  crop.cropT = Math.round((H - size) / 2);

  var cover = Math.max(size / crop.natW, size / crop.natH); // image always covers the square
  crop.minScale = cover;
  crop.scale = cover;
  crop.tx = crop.cropL + size / 2 - (crop.natW / 2) * cover;
  crop.ty = crop.cropT + size / 2 - (crop.natH / 2) * cover;

  var f = document.getElementById('crop-frame');
  if (f) {
    f.style.width = size + 'px'; f.style.height = size + 'px';
    f.style.left = crop.cropL + 'px'; f.style.top = crop.cropT + 'px';
  }
  applyCropTransform();
}

function clampCrop() {
  var iw = crop.natW * crop.scale, ih = crop.natH * crop.scale;
  if (crop.tx > crop.cropL) crop.tx = crop.cropL;
  if (crop.tx + iw < crop.cropL + crop.size) crop.tx = crop.cropL + crop.size - iw;
  if (crop.ty > crop.cropT) crop.ty = crop.cropT;
  if (crop.ty + ih < crop.cropT + crop.size) crop.ty = crop.cropT + crop.size - ih;
}

function applyCropTransform() {
  clampCrop();
  var img = document.getElementById('capture-preview');
  if (img) img.style.transform = 'translate(' + crop.tx + 'px,' + crop.ty + 'px) scale(' + crop.scale + ')';
}

function initCropImage(url) {
  crop.ready = false;
  crop.bgConfirmed = false;
  var img = document.getElementById('capture-preview');
  if (!img) return;
  img.onload = function () {
    crop.natW = img.naturalWidth  || 1;
    crop.natH = img.naturalHeight || 1;
    layoutCrop();
    crop.ready = true;
  };
  img.src = url;
}

function cropActive() { return currentScanState === 'captured' && crop.ready; }

function setScaleAround(ns, mx, my) {
  ns = Math.max(crop.minScale, Math.min(ns, crop.minScale * 6));
  var ipx = (mx - crop.tx) / crop.scale, ipy = (my - crop.ty) / crop.scale;
  crop.scale = ns;
  crop.tx = mx - ipx * ns;
  crop.ty = my - ipy * ns;
  applyCropTransform();
}

function touchDist(a, b) {
  var dx = a.clientX - b.clientX, dy = a.clientY - b.clientY;
  return Math.sqrt(dx * dx + dy * dy);
}

function onCropTouchStart(e) {
  if (!cropActive()) return;
  if (e.touches.length === 1) {
    crop.dragging = true; crop.lastX = e.touches[0].clientX; crop.lastY = e.touches[0].clientY;
  } else if (e.touches.length === 2) {
    crop.dragging = false;
    crop.pinchDist = touchDist(e.touches[0], e.touches[1]);
    crop.pinchScale = crop.scale;
    var r = previewRect();
    crop.pinchMidX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - r.left;
    crop.pinchMidY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - r.top;
  }
  e.preventDefault();
}
function onCropTouchMove(e) {
  if (!cropActive()) return;
  if (e.touches.length === 1 && crop.dragging) {
    var x = e.touches[0].clientX, y = e.touches[0].clientY;
    crop.tx += x - crop.lastX; crop.ty += y - crop.lastY;
    crop.lastX = x; crop.lastY = y;
    applyCropTransform();
  } else if (e.touches.length === 2 && crop.pinchDist) {
    var d = touchDist(e.touches[0], e.touches[1]);
    setScaleAround(crop.pinchScale * (d / crop.pinchDist), crop.pinchMidX, crop.pinchMidY);
  }
  e.preventDefault();
}
function onCropTouchEnd() { crop.dragging = false; }

// Mouse fallback for desktop browsers
function onCropMouseDown(e) {
  if (!cropActive()) return;
  crop.dragging = true; crop.lastX = e.clientX; crop.lastY = e.clientY; e.preventDefault();
}
function onCropMouseMove(e) {
  if (!cropActive() || !crop.dragging) return;
  crop.tx += e.clientX - crop.lastX; crop.ty += e.clientY - crop.lastY;
  crop.lastX = e.clientX; crop.lastY = e.clientY;
  applyCropTransform();
}
function onCropMouseUp() { crop.dragging = false; }
function onCropWheel(e) {
  if (!cropActive()) return;
  var r = previewRect();
  var factor = e.deltaY < 0 ? 1.08 : 1 / 1.08;
  setScaleAround(crop.scale * factor, e.clientX - r.left, e.clientY - r.top);
  e.preventDefault();
}

function initCropGestures() {
  var p = previewEl();
  if (!p) return;
  p.addEventListener('touchstart', onCropTouchStart, { passive: false });
  p.addEventListener('touchmove',  onCropTouchMove,  { passive: false });
  p.addEventListener('touchend',   onCropTouchEnd);
  p.addEventListener('mousedown',  onCropMouseDown);
  window.addEventListener('mousemove', onCropMouseMove);
  window.addEventListener('mouseup',   onCropMouseUp);
  p.addEventListener('wheel', onCropWheel, { passive: false });
  window.addEventListener('resize', function () {
    if (currentScanState === 'captured' && crop.ready) layoutCrop();
  });
}

// Render only the white-box region to a JPEG blob; flag if it looks like background.
function extractCropBlob(callback) {
  var img = document.getElementById('capture-preview');
  var canvas = document.getElementById('camera-canvas');
  if (!img || !canvas || !crop.ready) { callback(null, false); return; }

  var s = crop.scale;
  var srcSize = crop.size / s;
  var srcX = (crop.cropL - crop.tx) / s;
  var srcY = (crop.cropT - crop.ty) / s;
  srcX = Math.max(0, Math.min(srcX, crop.natW - srcSize));
  srcY = Math.max(0, Math.min(srcY, crop.natH - srcSize));

  var OUT = 512;
  canvas.width = OUT; canvas.height = OUT;
  var ctx = canvas.getContext('2d');
  ctx.drawImage(img, srcX, srcY, srcSize, srcSize, 0, 0, OUT, OUT);

  var looksBg = cropLooksLikeBackground(ctx, OUT);
  canvas.toBlob(function (blob) { callback(blob, looksBg); }, 'image/jpeg', 0.92);
}

// Heuristic: a near-white, very low-saturation crop is probably background (paper/table), not meat.
function cropLooksLikeBackground(ctx, size) {
  try {
    var data = ctx.getImageData(0, 0, size, size).data;
    var n = 0, sumS = 0, sumV = 0;
    for (var i = 0; i < data.length; i += 4 * 53) {
      var r = data[i], g = data[i + 1], b = data[i + 2];
      var mx = Math.max(r, g, b), mn = Math.min(r, g, b);
      sumV += mx;
      sumS += (mx === 0 ? 0 : (mx - mn) / mx);
      n++;
    }
    if (!n) return false;
    return (sumV / n) > 205 && (sumS / n) < 0.16;
  } catch (e) { return false; }
}

// ===================================================================
// CAMERA
// ===================================================================
function startCamera() {
  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    updateScanState('empty');
    resetTorchState();
    return;
  }

  resetTorchState();
  navigator.mediaDevices.getUserMedia({
    video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } },
    audio: false
  })
  .then(function (stream) {
    cameraStream = stream;
    var video = document.getElementById('camera-video');
    if (video) video.srcObject = stream;
    updateScanState('live');
    configureTorch(stream);
  })
  .catch(function (err) {
    console.warn('Camera unavailable:', err.name);
    updateScanState('empty');
    resetTorchState();
    if (err.name === 'NotAllowedError') {
      showScanError(
        currentLang === 'fil'
        ? 'Hindi pinayagan ang camera. Maaari ka pa ring mag-upload mula sa gallery.'
          : 'Camera access denied. You can still upload a photo from your gallery.'
      );
    }
  });
}

function stopCamera() {
  if (torchTrack && torchSupported && torchOn && torchTrack.readyState === 'live') {
    try { torchTrack.applyConstraints({ advanced: [{ torch: false }] }); } catch (e) { /* ignore */ }
  }
  if (cameraStream) {
    cameraStream.getTracks().forEach(function (t) { t.stop(); });
    cameraStream = null;
  }
  resetTorchState();
  var video = document.getElementById('camera-video');
  if (video) { video.srcObject = null; video.classList.add('hidden'); }
}

function configureTorch(stream) {
  torchTrack = stream && stream.getVideoTracks ? stream.getVideoTracks()[0] : null;
  torchSupported = false;
  torchOn = false;

  if (torchTrack && typeof torchTrack.getCapabilities === 'function') {
    try {
      var caps = torchTrack.getCapabilities();
      torchSupported = !!(caps && caps.torch);
    } catch (e) {
      torchSupported = false;
    }
  }

  updateTorchUI();
}

function resetTorchState() {
  torchTrack = null;
  torchSupported = false;
  torchOn = false;
  updateTorchUI();
}

function updateTorchUI() {
  var wrap = document.getElementById('torch-controls');
  var btn = document.getElementById('btn-toggle-torch');
  var status = document.getElementById('torch-status');
  if (!wrap || !btn || !status) return;

  if (!cameraStream) {
    wrap.classList.add('hidden');
    btn.classList.add('hidden');
    status.classList.add('hidden');
    return;
  }

  wrap.classList.remove('hidden');
  status.classList.remove('hidden');
  status.classList.toggle('is-warning', !torchSupported);

  if (torchSupported) {
    btn.classList.remove('hidden');
    btn.classList.toggle('is-on', torchOn);
    btn.textContent = torchOn ? t('btn_torch_off') : t('btn_torch_on');
    btn.setAttribute('aria-pressed', String(torchOn));
    status.textContent = torchOn ? t('torch_active') : t('torch_ready');
  } else {
    btn.classList.add('hidden');
    btn.classList.remove('is-on');
    btn.setAttribute('aria-pressed', 'false');
    status.textContent = t('torch_unavailable');
  }
}

function setTorch(enabled) {
  if (!torchSupported || !torchTrack || typeof torchTrack.applyConstraints !== 'function') {
    updateTorchUI();
    return Promise.reject(new Error('Torch is not supported.'));
  }

  return torchTrack.applyConstraints({ advanced: [{ torch: enabled }] })
    .then(function () {
      torchOn = enabled;
      updateTorchUI();
    })
    .catch(function (err) {
      console.warn('Torch unavailable:', err);
      torchOn = false;
      updateTorchUI();
      showScanError(t('torch_error'));
    });
}

function captureFrameFromVideo(callback) {
  var video  = document.getElementById('camera-video');
  var canvas = document.getElementById('camera-canvas');
  canvas.width  = video.videoWidth  || 640;
  canvas.height = video.videoHeight || 480;
  canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);
  canvas.toBlob(function (blob) { callback(blob, 'capture.jpg'); }, 'image/jpeg', 0.92);
}

// ===================================================================
// SCAN SCREEN WIRING
// ===================================================================
function initScanScreen() {
  var takePhotoBtn = document.getElementById('btn-take-photo');
  var galleryBtn   = document.getElementById('btn-upload-gallery');
  var analyzeBtn   = document.getElementById('btn-analyze');
  var retakeBtn    = document.getElementById('btn-retake');
  var torchBtn     = document.getElementById('btn-toggle-torch');
  var cameraInput  = document.getElementById('camera-input');
  var galleryInput = document.getElementById('gallery-input');

  takePhotoBtn.addEventListener('click', function () {
    var video = document.getElementById('camera-video');
    if (cameraStream && video && video.readyState >= 2) {
      captureFrameFromVideo(setCapture);
    } else {
      cameraInput.click();
    }
  });

  galleryBtn.addEventListener('click', function () { galleryInput.click(); });

  if (torchBtn) {
    torchBtn.addEventListener('click', function () {
      setTorch(!torchOn);
    });
  }

  cameraInput.addEventListener('change', function () {
    var file = cameraInput.files[0];
    if (!file) return;
    setCapture(file, file.name);
    cameraInput.value = '';
  });

  galleryInput.addEventListener('change', function () {
    var file = galleryInput.files[0];
    if (!file) return;
    setCapture(file, file.name);
    galleryInput.value = '';
  });

  analyzeBtn.addEventListener('click', function () {
    if (!crop.ready) {
      if (selectedImageBlob) submitImage(selectedImageBlob, selectedImageName || 'image.jpg');
      return;
    }
    extractCropBlob(function (blob, looksBg) {
      if (!blob) {
        if (selectedImageBlob) submitImage(selectedImageBlob, selectedImageName || 'image.jpg');
        return;
      }
      if (looksBg && !crop.bgConfirmed) {
        crop.bgConfirmed = true;          // a second tap overrides the warning
        showScanError(t('crop_bg_warning'));
        return;
      }
      submitImage(blob, 'crop.jpg');
    });
  });

  retakeBtn.addEventListener('click', function () {
    clearCapture();
    startCamera();
  });

  initCropGestures();
}

// ===================================================================
// CLASSIFY — POST to /classify
// ===================================================================
function submitImage(imageBlob, filename) {
  if (!selectedSpecies || !selectedCut) return;
  hideScanError();

  var formData = new FormData();
  formData.append('image',   imageBlob, filename);
  formData.append('species', selectedSpecies);
  formData.append('cut',     selectedCut);

  var controller = new AbortController();
  var timer = setTimeout(function () { controller.abort(); }, CLASSIFY_TIMEOUT);

  showScreen('screen-analyzing');

  fetch('/classify', { method: 'POST', body: formData, signal: controller.signal })

  .then(function (response) {
    clearTimeout(timer);
    if (response.status >= 500) { showScreen('screen-pwa-unavailable'); return null; }
    return response.json().then(function (data) {
      return { status: response.status, data: data };
    });
  })

  .then(function (result) {
    if (!result) return;

    if (result.status === 400) {
      showScanError(
        (result.data && result.data.error)
          ? result.data.error
          : (currentLang === 'fil'
              ? 'Hindi ma-check ang kuha. Subukan muli.'
              : 'The image could not be processed. Please try again.')
      );
      showScreen('screen-scan');
      return;
    }

    var d   = result.data;
    var cls = d.classification;
    if (cls !== 'FRESH' && cls !== 'SUSPICIOUS' && cls !== 'STALE') {
      showScanError(
        currentLang === 'fil'
          ? 'Hindi inaasahang tugon. Subukan muli.'
          : 'Unexpected response. Please try again.'
      );
      showScreen('screen-scan');
      return;
    }

    saveToHistory(selectedSpecies, selectedCut, cls, d.score, d.hsv_means, d.z_scores);
    renderResult(cls, selectedSpecies, selectedCut, d.score, d.hsv_means, d.z_scores);
    showScreen('screen-result');
    clearCapture();
  })

  .catch(function (err) {
    clearTimeout(timer);
    if (err.name === 'AbortError') {
      showScreen('screen-pwa-slow');
    } else if (!navigator.onLine) {
      showScreen('screen-pwa-offline');
    } else {
      showScreen('screen-pwa-error');
    }
  });
}

function retryClassify() {
  if (lastClassifyBlob && selectedSpecies && selectedCut) {
    submitImage(lastClassifyBlob, lastClassifyName || 'image.jpg');
  } else {
    window.location.reload();
  }
}
window.retryClassify = retryClassify;

// ===================================================================
// RESULT SCREEN — populate dynamically
// ===================================================================
function renderResult(cls, species, cut, score, hsvMeans, zScores) {
  lastResultData = {
    classification: cls,
    species: species,
    cut: cut,
    score: score,
    hsv_means: hsvMeans,
    z_scores: zScores
  };

  var hero  = document.getElementById('result-hero');
  var rec   = document.getElementById('result-rec');
  var badge = document.getElementById('result-badge');
  var img   = document.getElementById('result-icon-img');
  var expEl = document.getElementById('result-explanation');
  var recTx = document.getElementById('result-rec-text');
  var sumEl = document.getElementById('result-summary');

  ['r-fresh', 'r-suspicious', 'r-stale'].forEach(function (c) {
    hero.classList.remove(c); rec.classList.remove(c);
  });

  var clsKey = cls.toLowerCase();
  hero.classList.add('r-' + clsKey);
  rec.classList.add('r-' + clsKey);

  badge.className   = 'status-badge status-' + clsKey;
  badge.textContent = t('result_' + clsKey + '_label');

  img.src = '/static/assets/icon_' + clsKey + '.png';
  img.alt = t('result_' + clsKey + '_label');
  img.onerror = function () { img.style.display = 'none'; };

  expEl.textContent = t('result_' + clsKey + '_explanation');
  recTx.textContent = t('result_' + clsKey + '_rec');

  var speciesLabel = t('species_' + species);
  var cutLabel     = t('cut_' + cut);
  var timeStr      = new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  var scoreStr     = (typeof score === 'number') ? ' · ' + score.toFixed(2) : '';
  sumEl.textContent = speciesLabel + ' · ' + cutLabel + ' · ' + timeStr + scoreStr;

  if (hsvMeans && zScores) {
    document.getElementById('detail-score').textContent = typeof score    === 'number' ? score.toFixed(4)     : '—';
    document.getElementById('detail-h').textContent     = typeof hsvMeans.H === 'number' ? hsvMeans.H.toFixed(2) : '—';
    document.getElementById('detail-s').textContent     = typeof hsvMeans.S === 'number' ? hsvMeans.S.toFixed(2) : '—';
    document.getElementById('detail-v').textContent     = typeof hsvMeans.V === 'number' ? hsvMeans.V.toFixed(2) : '—';
    document.getElementById('detail-zh').textContent    = typeof zScores.H  === 'number' ? zScores.H.toFixed(4)  : '—';
    document.getElementById('detail-zs').textContent    = typeof zScores.S  === 'number' ? zScores.S.toFixed(4)  : '—';
    document.getElementById('detail-zv').textContent    = typeof zScores.V  === 'number' ? zScores.V.toFixed(4)  : '—';
  }

  var details = document.getElementById('result-details');
  if (details) details.removeAttribute('open');
}

// ===================================================================
// NAVIGATION HELPERS
// ===================================================================
function _resetSelections() {
  selectedSpecies = null;
  selectedCut     = null;
  lastResultData  = null;
  clearCapture();
  document.querySelectorAll('.select-card').forEach(function (c) {
    c.classList.remove('selected');
    c.setAttribute('aria-pressed', 'false');
    var chk = c.querySelector('.select-check');
    if (chk) chk.textContent = '';
  });
  var ct = document.getElementById('btn-continue-type');
  var cc = document.getElementById('btn-continue-cut');
  if (ct) { ct.disabled = true; ct.setAttribute('aria-disabled', 'true'); }
  if (cc) { cc.disabled = true; cc.setAttribute('aria-disabled', 'true'); }
}

function resetAndGoHome() { _resetSelections(); showScreen('screen-main'); }
window.resetAndGoHome = resetAndGoHome;

function startNewScan() {
  selectedImageBlob = null;
  selectedImageName = null;
  _resetSelections();
  showScreen('screen-select-type');
}
window.startNewScan = startNewScan;

// ===================================================================
// SCAN ERROR
// ===================================================================
function showScanError(message) {
  var el = document.getElementById('scan-error');
  if (!el) return;
  el.textContent = message;
  el.classList.remove('hidden');
}
function hideScanError() {
  var el = document.getElementById('scan-error');
  if (el) el.classList.add('hidden');
}

// ===================================================================
// STEP 1 — SELECT MEAT TYPE
// ===================================================================
function initSelectType() {
  var grid        = document.querySelector('#screen-select-type .select-grid');
  var continueBtn = document.getElementById('btn-continue-type');

  grid.querySelectorAll('.select-card').forEach(function (card) {
    card.addEventListener('click', function () {
      var tapped = card.dataset.species;
      if (tapped !== selectedSpecies) { selectedSpecies = tapped; selectedCut = null; }
      grid.querySelectorAll('.select-card').forEach(function (c) {
        c.classList.remove('selected');
        c.setAttribute('aria-pressed', 'false');
        var chk = c.querySelector('.select-check');
        if (chk) chk.textContent = '';
      });
      card.classList.add('selected');
      card.setAttribute('aria-pressed', 'true');
      var check = card.querySelector('.select-check');
      if (check) check.textContent = '✓';
      continueBtn.disabled = false;
      continueBtn.setAttribute('aria-disabled', 'false');
    });
  });

  continueBtn.addEventListener('click', function () {
    if (!selectedSpecies) return;
    filterCutsForSpecies();
    resetCutSelection();
    showScreen('screen-select-cut');
  });
}

// ===================================================================
// STEP 2 — SELECT CUT
// ===================================================================
function filterCutsForSpecies() {
  var allowed = selectedSpecies ? SPECIES_CUTS[selectedSpecies] : [];
  document.querySelectorAll('#screen-select-cut .select-card').forEach(function (card) {
    var matches = allowed.indexOf(card.dataset.cut) !== -1;
    card.style.display = matches ? '' : 'none';
    if (!matches) {
      card.classList.remove('selected');
      card.setAttribute('aria-pressed', 'false');
      var chk = card.querySelector('.select-check');
      if (chk) chk.textContent = '';
    }
  });
}

function resetCutSelection() {
  selectedCut = null;
  document.querySelectorAll('#screen-select-cut .select-card').forEach(function (c) {
    c.classList.remove('selected');
    c.setAttribute('aria-pressed', 'false');
    var chk = c.querySelector('.select-check');
    if (chk) chk.textContent = '';
  });
  var btn = document.getElementById('btn-continue-cut');
  if (btn) { btn.disabled = true; btn.setAttribute('aria-disabled', 'true'); }
}

function initSelectCut() {
  var grid        = document.querySelector('#screen-select-cut .select-grid');
  var continueBtn = document.getElementById('btn-continue-cut');

  grid.querySelectorAll('.select-card').forEach(function (card) {
    card.addEventListener('click', function () {
      if (card.style.display === 'none') return;
      selectedCut = card.dataset.cut;
      grid.querySelectorAll('.select-card').forEach(function (c) {
        c.classList.remove('selected');
        c.setAttribute('aria-pressed', 'false');
        var chk = c.querySelector('.select-check');
        if (chk) chk.textContent = '';
      });
      card.classList.add('selected');
      card.setAttribute('aria-pressed', 'true');
      var check = card.querySelector('.select-check');
      if (check) check.textContent = '✓';
      continueBtn.disabled = false;
      continueBtn.setAttribute('aria-disabled', 'false');
      updateContextStrip();
    });
  });

  continueBtn.addEventListener('click', function () {
    if (selectedCut) showScreen('screen-before-scan');
  });
}

// ===================================================================
// HISTORY — localStorage read / write / render
// ===================================================================
function saveToHistory(species, cut, classification, score, hsvMeans, zScores) {
  var scans = loadHistory();
  scans.unshift({
    id:             Date.now() + '-' + Math.random().toString(36).slice(2),
    timestamp:      new Date().toISOString(),
    species:        species,
    cut:            cut,
    classification: classification,
    score:          score   || null,
    hsv_means:      hsvMeans || null,
    z_scores:       zScores  || null
  });
  if (scans.length > HISTORY_MAX) scans = scans.slice(0, HISTORY_MAX);
  try { localStorage.setItem(HISTORY_KEY, JSON.stringify(scans)); } catch (e) {
    console.warn('Could not save to localStorage:', e);
  }
}

function loadHistory() {
  try {
    var raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    var parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) { return []; }
}

function formatTimestamp(ts) {
  var date    = new Date(ts);
  var now     = new Date();
  var timeStr = date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  var dot     = ' · ';
  if (date.toDateString() === now.toDateString()) {
    return (currentLang === 'fil' ? 'Ngayon' : 'Today') + dot + timeStr;
  }
  var yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return (currentLang === 'fil' ? 'Kahapon' : 'Yesterday') + dot + timeStr;
  }
  return date.toLocaleDateString([], { month: 'short', day: 'numeric' }) + dot + timeStr;
}

function renderHistory() {
  var scans    = loadHistory();
  var hasData  = scans.length > 0;
  var dataEl   = document.getElementById('history-content-data');
  var emptyEl  = document.getElementById('history-content-empty');
  var clearBtn = document.getElementById('btn-clear-history');

  dataEl.classList.toggle('hidden',  !hasData);
  emptyEl.classList.toggle('hidden',  hasData);
  if (clearBtn) clearBtn.classList.toggle('hidden', !hasData);

  var counts = { FRESH: 0, SUSPICIOUS: 0, STALE: 0 };
  scans.forEach(function (s) {
    if (Object.prototype.hasOwnProperty.call(counts, s.classification)) counts[s.classification]++;
  });
  document.getElementById('stat-fresh').textContent      = counts.FRESH;
  document.getElementById('stat-suspicious').textContent = counts.SUSPICIOUS;
  document.getElementById('stat-stale').textContent      = counts.STALE;
  document.getElementById('stat-total').textContent      = scans.length;

  var BADGE_CFG = {
    FRESH:      { cls: 'status-fresh',      key: 'result_fresh_label' },
    SUSPICIOUS: { cls: 'status-suspicious', key: 'result_suspicious_label' },
    STALE:      { cls: 'status-stale',      key: 'result_stale_label' }
  };

  var list = document.getElementById('history-list');
  list.innerHTML = '';

  scans.forEach(function (scan) {
    var cfg    = BADGE_CFG[scan.classification] || BADGE_CFG.FRESH;
    var cutKey = scan.cut || '';

    var item = document.createElement('div');
    item.className = 'history-item';

    // Cut icon
    var iconEl = document.createElement('img');
    iconEl.className = 'history-cut-icon';
    iconEl.width  = 32;
    iconEl.height = 32;
    iconEl.alt    = '';
    iconEl.setAttribute('aria-hidden', 'true');
    iconEl.src    = CUT_ICONS[cutKey] ? '/static/assets/' + CUT_ICONS[cutKey] + '.png' : '';
    iconEl.onerror = function () {
      var fb = document.createElement('span');
      fb.textContent = CUT_EMOJI[cutKey] || '🥩';
      fb.setAttribute('aria-hidden', 'true');
      fb.style.cssText = 'font-size:1.4rem;line-height:1;';
      if (iconEl.parentNode) iconEl.parentNode.replaceChild(fb, iconEl);
    };

    // Info
    var infoEl = document.createElement('div');
    infoEl.className = 'history-info';

    var cutEl = document.createElement('div');
    cutEl.className   = 'history-cut';
    cutEl.textContent = t('cut_' + cutKey) || cutKey;

    var metaEl = document.createElement('div');
    metaEl.className   = 'history-meta';
    metaEl.textContent = formatTimestamp(scan.timestamp || Date.now());

    infoEl.appendChild(cutEl);
    infoEl.appendChild(metaEl);

    // Badge
    var badgeEl = document.createElement('span');
    badgeEl.className   = 'status-badge ' + cfg.cls;
    badgeEl.textContent = t(cfg.key);

    item.appendChild(iconEl);
    item.appendChild(infoEl);
    item.appendChild(badgeEl);
    list.appendChild(item);
  });
}

function openHistory() {
  renderHistory();
  showScreen('screen-history');
}
window.openHistory = openHistory;

// ===================================================================
// CLEAR HISTORY — dialog
// ===================================================================
function initClearHistory() {
  var clearBtn   = document.getElementById('btn-clear-history');
  var dialog     = document.getElementById('dialog-clear-history');
  var cancelBtn  = document.getElementById('btn-cancel-clear');
  var confirmBtn = document.getElementById('btn-confirm-clear');
  if (!clearBtn || !dialog) return;

  clearBtn.addEventListener('click', function () { dialog.showModal(); });

  cancelBtn.addEventListener('click', function () { dialog.close(); });

  confirmBtn.addEventListener('click', function () {
    dialog.close();
    try { localStorage.removeItem(HISTORY_KEY); } catch (e) {
      console.warn('Could not clear localStorage:', e);
    }
    renderHistory();
  });

  dialog.addEventListener('click', function (e) {
    if (e.target === dialog) dialog.close();
  });
}

// ===================================================================
// INIT
// ===================================================================
window.addEventListener('DOMContentLoaded', function () {
  initLanguage();        // restore / apply persisted language (default: fil)
  injectLangSwitchers(); // add [FIL|EN] pill to all relevant headers
  initSelectType();
  initSelectCut();
  initScanScreen();
  initClearHistory();

  // Brief loading splash
  setTimeout(function () { showScreen('screen-main'); }, 700);
});
