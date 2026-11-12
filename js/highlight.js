/* ============================================================
   highlight.js — 可直接覆盖 themes/<theme>/source/js/highlight.js
   或部署仓库 js/highlight.js（原文件仅 hljs.highlightAll()）
   仅在 head.ejs 检测到 <pre><code> 时才被引入，因此这里做一次兜底判断。
   ============================================================ */
(function () {
  if (!window.hljs) return;
  var blocks = document.querySelectorAll('pre code');
  Array.prototype.forEach.call(blocks, function (block) {
    if (window.hljs.highlightElement) window.hljs.highlightElement(block);
  });
})();
