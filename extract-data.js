#!/usr/bin/env node

/**
 * Swiss.pro 数据恢复脚本
 * 从 out/ HTML 文件中提取所有数据
 */

const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'out');

// 提取 HTML 中的链接
function extractLinks(html) {
  const links = [];
  const linkRegex = /<a[^>]*href="([^"]*)"[^>]*>([^<]*)<\/a>/g;
  let match;
  
  while ((match = linkRegex.exec(html)) !== null) {
    const url = match[1];
    const text = match[2].trim();
    
    // 只提取外部链接（http/https）
    if (url.startsWith('http')) {
      links.push({ url, text });
    }
  }
  
  return links;
}

// 读取 switzerland.html
const switzerlandHtml = fs.readFileSync(path.join(outDir, 'switzerland.html'), 'utf-8');
const links = extractLinks(switzerlandHtml);

console.log('=== Switzerland 页面链接 ===');
console.log(JSON.stringify(links, null, 2));

// 读取城市页面
const cities = ['zurich', 'basel', 'bern', 'geneva', 'lausanne', 'zug'];
const cityData = {};

cities.forEach(city => {
  const cityHtml = fs.readFileSync(path.join(outDir, 'switzerland', 'cities', `${city}.html`), 'utf-8');
  cityData[city] = extractLinks(cityHtml);
});

console.log('\n=== 城市数据 ===');
console.log(JSON.stringify(cityData, null, 2));

// 读取分类页面
const categories = ['work', 'startup-investment', 'government', 'daily-life', 'education', 'healthcare'];
const categoryData = {};

categories.forEach(cat => {
  const catHtml = fs.readFileSync(path.join(outDir, 'switzerland', 'categories', `${cat}.html`), 'utf-8');
  categoryData[cat] = extractLinks(catHtml);
});

console.log('\n=== 分类数据 ===');
console.log(JSON.stringify(categoryData, null, 2));
