# Swiss.pro 源代码恢复计划

## 项目结构
这是一个 **双功能网站**：
1. **EV 充电地图** (`/`) - Malim EV Charging Subsidy Explorer
2. **瑞士生活指南** (`/switzerland`) - Swiss.Pro 门户网站

## 需要恢复的文件

### 1. Switzerland 主页
- `app/switzerland/page.tsx`
- 功能：分类筛选、城市筛选、链接展示

### 2. 城市详情页
- `app/switzerland/cities/[slug]/page.tsx`
- 城市：Zürich, Basel, Bern, Geneva, Lausanne, Zug

### 3. 分类详情页
- `app/switzerland/categories/[slug]/page.tsx`
- 分类：
  - work (Arbeit)
  - startup-investment (Startup / Investment)
  - government (Behörden)
  - daily-life (Alltag)
  - education (Bildung)
  - healthcare (Gesundheit)
  - news (News)
  - community (Kammer / Community)

### 4. 数据文件
- `app/switzerland/data.ts` - 所有城市、分类、链接数据

## 恢复步骤
1. ✅ 分析 HTML 结构
2. ⏳ 提取数据（城市、分类、链接）
3. ⏳ 重建 page.tsx 文件
4. ⏳ 重建动态路由
5. ⏳ 测试构建

## 数据提取来源
- `/out/switzerland.html` - 主页结构
- `/out/switzerland/cities/*.html` - 城市数据
- `/out/switzerland/categories/*.html` - 分类数据
