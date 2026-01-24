# 目录结构说明

```
just-htmls/
├── assets/                    # 静态资源文件
│   └── clicks.js             # 点击统计脚本
├── docs/                      # 文档目录
│   └── SEO.md                # SEO 优化文档
├── scripts/                   # 脚本目录
│   └── update_sitemap.py     # 自动更新 sitemap 的脚本
├── tools/                     # 工具目录
│   └── {tool-name}/          # 每个工具的目录
│       ├── index.html        # 工具详情页
│       └── app.html          # 工具应用页
├── workers/                   # Worker 脚本
│   └── clicks.js             # 点击统计 Worker
├── .github/                   # GitHub 配置
│   ├── ISSUE_TEMPLATE/       # Issue 模板
│   └── workflows/            # GitHub Actions 工作流
│       └── update-sitemap.yml
├── CONTRIBUTING.md             # 贡献指南
├── index.html                 # 主页面
├── index.json                 # 工具索引文件
├── reference.html             # 参考文档
├── robots.txt                 # 搜索引擎爬虫规则
├── sitemap.xml                # 站点地图（自动生成）
├── favicon.svg                # 网站图标
├── google*.html               # Google Search Console 验证文件
├── LICENSE                    # 许可证文件
└── readme.md                  # 项目说明
```

## 重要文件说明

### 根目录文件

- `index.html` - 网站主页
- `index.json` - 工具数据索引，包含所有工具的信息
- `sitemap.xml` - XML 站点地图，由 `scripts/update_sitemap.py` 自动生成
- `robots.txt` - 搜索引擎爬虫规则
- `favicon.svg` - 网站图标

### 目录说明

- `tools/` - 存放所有工具，每个工具一个子目录
- `scripts/` - 开发和维护脚本
- `docs/` - 项目文档
- `assets/` - 静态资源文件
- `workers/` - Cloudflare Workers 脚本（如果使用）

### 自动生成的文件

- `sitemap.xml` - 由 `scripts/update_sitemap.py` 脚本自动生成
- 每次添加或更新工具后，运行脚本更新站点地图

### 添加新工具

1. 在 `tools/` 下创建新工具目录
2. 添加 `index.html` 和 `app.html`
3. 更新 `index.json` 添加工具信息
4. 运行 `python3 scripts/update_sitemap.py` 更新站点地图

