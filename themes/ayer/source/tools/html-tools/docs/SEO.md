# SEO 优化文档

本文档说明 JustHTMLs 网站的 SEO 优化措施和自动更新流程。

## 已实施的 SEO 优化

根据 [Google SEO 指南](https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=zh_CN)，我们已经实施了以下优化：

### 1. 站点地图 (Sitemap)

- ✅ `sitemap.xml` - 包含所有页面的 XML 站点地图
- ✅ 已提交到 Google Search Console
- ✅ 支持自动更新（见下方说明）

### 2. robots.txt

- ✅ `robots.txt` - 允许所有搜索引擎抓取
- ✅ 包含 sitemap 引用

### 3. 规范化 (Canonical)

- ✅ 所有页面都添加了 `<link rel="canonical">` 标签
- ✅ 统一指向主域名 `https://www.htmls.dev`

### 4. Meta 标签

- ✅ 所有页面都有 `<title>` 和 `<meta name="description">`
- ✅ 主页面包含 Open Graph 和 Twitter Card 标签

### 5. 结构化数据 (Structured Data)

- ✅ 主页面添加了 JSON-LD 结构化数据：
  - WebSite schema（包含搜索功能）
  - Organization schema

### 6. URL 结构

- ✅ 清晰的 URL 层次结构：`/tools/{tool-slug}/`
- ✅ 使用连字符分隔的友好 URL

### 7. 移动端优化

- ✅ 所有页面都包含 `<meta name="viewport">` 标签
- ✅ 响应式设计

## 自动更新 Sitemap

### 方法一：手动运行脚本

当添加新工具或更新现有工具后，运行：

```bash
python3 scripts/update_sitemap.py
```

脚本会：
1. 读取 `index.json` 获取所有工具信息
2. 检查文件的实际修改时间
3. 生成新的 `sitemap.xml`

### 方法二：GitHub Actions 自动更新

我们配置了 GitHub Actions 工作流，在以下情况会自动更新 sitemap：

- 推送代码到 `main` 分支时
- 修改了以下文件：
  - `index.json`
  - `tools/**/*.html`
  - `CONTRIBUTING.md`
  - `reference.html`
- 手动触发工作流

工作流文件：`.github/workflows/update-sitemap.yml`

### 方法三：本地 git hook（可选）

如果你想在每次提交前自动更新，可以添加 pre-commit hook：

```bash
# 创建 hook 文件
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/sh
python3 scripts/update_sitemap.py
git add sitemap.xml
EOF

# 添加执行权限
chmod +x .git/hooks/pre-commit
```

## 验证 SEO 设置

### 1. 验证结构化数据

使用 [Google 富媒体搜索结果测试工具](https://search.google.com/test/rich-results) 验证结构化数据是否正确。

### 2. 验证 Sitemap

访问 `https://www.htmls.dev/sitemap.xml` 确认：
- XML 格式正确
- 所有 URL 可访问
- lastmod 日期是最新的

### 3. Google Search Console

在 [Google Search Console](https://search.google.com/search-console) 中监控：
- 索引覆盖率
- 站点地图状态
- 搜索性能

## SEO 最佳实践

### 添加新工具时

1. 在 `index.json` 中添加工具信息（包含 `createdAt` 和 `updatedAt`）
2. 创建工具页面的 `index.html` 和 `app.html`
3. 确保两个文件都包含：
   - `<title>` 标签（格式：`工具名称 - JustHTMLs`）
   - `<meta name="description">` 标签
   - `<link rel="canonical">` 标签
4. 运行 `python3 scripts/update_sitemap.py` 更新 sitemap

### 更新现有工具时

1. 更新 `index.json` 中的 `updatedAt` 字段
2. 运行 `python3 scripts/update_sitemap.py` 更新 sitemap

## 参考资源

- [Google SEO 指南](https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=zh_CN)
- [Google Search Console 帮助](https://support.google.com/webmasters)
- [Schema.org 文档](https://schema.org/)

## 待优化项（可选）

以下是一些可选的进一步优化：

- [ ] 为工具页面添加结构化数据（WebApplication schema）
- [ ] 添加图片 alt 属性优化
- [ ] 实施面包屑导航结构化数据
- [ ] 添加常见问题（FAQ）结构化数据

