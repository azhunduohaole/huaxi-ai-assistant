# 华熙AI知识助手前端

基于 PRD、Axhub 原型与 MasterGo UI 风格实现的 React 前端原型，覆盖华熙 AI 知识助手的核心使用路径：

- 小秘书：企业内部知识检索、工具配置、引用溯源、来源抽屉。
- 坏孩子：DeepResearch 创新探索、场景/风格配置、任务路径可视化、报告预览下载入口。
- 会话管理：新建会话、历史会话搜索、置顶状态、模式切换。
- 定时任务：情报监测任务创建、状态监控、测试/终止操作入口。
- 知识库管理：知识库卡片、文件列表、上传/下载/状态展示。
- 管理员应用：调用额度监控、风格模板配置入口。

## 本地运行

```bash
npm install
npm run dev
```

## 构建

```bash
npm run build
```

当前仓库尚未配置 git remote。若需要发布到 GitHub Pages 或其他 Git 托管页面，需要先添加远端：

```bash
git remote add origin <your-repo-url>
```
