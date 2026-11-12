/* ============================================================
   theme.js — 可直接覆盖 themes/<theme>/source/js/theme.js
   或部署仓库 js/theme.js
   保留原 highlight.js 语法主题切换，新增：
     - html[data-theme] 手动深浅色切换 + localStorage 记忆
     - 无手动偏好时跟随系统变化
     - 更新导航里的 .theme-toggle 按钮状态
   注意：head.ejs 里有一段内联脚本会在 CSS 之前设置 data-theme，避免深色闪白。
   ============================================================ */
(function () {
  var KEY = 'imazy-theme';
  var root = document.documentElement;
  var btn = document.querySelector('.theme-toggle');
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  var themeMode = {
    light: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-light.css',
    dark: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.css'
  };

  function readStored() {
    try { return localStorage.getItem(KEY); } catch (err) { return null; }
  }
  function writeStored(value) {
    try { localStorage.setItem(KEY, value); } catch (err) { /* 隐私模式下忽略 */ }
  }
  function apply(mode, persist) {
    root.setAttribute('data-theme', mode);
    if (persist) writeStored(mode);

    var link = document.querySelector('link#theme');
    if (link) link.href = themeMode[mode] || themeMode.light;

    if (btn) {
      btn.setAttribute('aria-pressed', String(mode === 'dark'));
      btn.textContent = mode === 'dark' ? '浅色' : '深色';
    }
  }

  var stored = readStored();
  var initial = stored || (mq && mq.matches ? 'dark' : 'light');
  apply(initial, false);

  if (btn) {
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      apply(next, true);
    });
  }

  function onSystemChange(event) {
    if (!readStored()) apply(event.matches ? 'dark' : 'light', false);
  }
  if (mq) {
    if (mq.addEventListener) mq.addEventListener('change', onSystemChange);
    else if (mq.addListener) mq.addListener(onSystemChange);
  }
})();
