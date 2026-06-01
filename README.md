# 个人博客

一个简洁优雅的个人博客网站，参考 Cubox 进化录的极简设计风格。

## 特性

- 移动端优先的窄栏布局
- 橄榄绿主题头部 + 白色内容区
- 文章列表支持正序/倒序切换
- 文章详情页，支持 Markdown 风格内容
- Vue 3 + TypeScript + Tailwind CSS

## 快速开始

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 自定义

编辑 `src/data/posts.ts` 文件：

- `blogConfig` — 博客标题、作者、描述等
- `posts` — 文章列表与内容

## 技术栈

- [Vue 3](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vue Router](https://router.vuejs.org/)
