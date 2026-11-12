/* ============================================================
 * scripts/content-json.js — 生成与原站点同结构的 content.json
 * 原站点该文件由 hexo-generator-json-content 输出，供外部检索使用。
 * 这里用本地 generator 实现，避免额外依赖，并让新增的 categories/tags
 * 同步反映在 JSON 里。
 * ============================================================ */
'use strict';

function stripHtml(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&[a-zA-Z#0-9]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function iso(value) {
  if (!value) return null;
  try {
    if (typeof value.toISOString === 'function') return value.toISOString();
    return new Date(value).toISOString();
  } catch (err) {
    return null;
  }
}

function taxNames(obj) {
  if (!obj) return [];
  const arr = typeof obj.toArray === 'function' ? obj.toArray() : Array.from(obj);
  return arr.map(function (item) { return item && item.name; }).filter(Boolean);
}

hexo.extend.generator.register('content_json', function (locals) {
  const config = hexo.config;
  const root = String(config.url || '').replace(/\/$/, '') + '/';

  function map(item) {
    return {
      title: item.title || '',
      slug: item.slug || '',
      date: iso(item.date),
      updated: iso(item.updated || item.date),
      comments: item.comments !== false,
      path: item.path,
      permalink: root + item.path,
      excerpt: stripHtml(item.excerpt),
      text: stripHtml(item.content),
      categories: taxNames(item.categories),
      tags: taxNames(item.tags),
      keywords: []
    };
  }

  const meta = {
    title: config.title,
    subtitle: config.subtitle || '',
    description: config.description || null,
    author: config.author || '',
    url: config.url
  };

  const posts = locals.posts.sort('date', -1).toArray().map(map);
  const pages = locals.pages.toArray().map(map);

  return {
    path: 'content.json',
    data: JSON.stringify({ meta: meta, pages: pages, posts: posts })
  };
});
