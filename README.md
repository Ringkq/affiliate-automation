# 联盟营销自动化系统

一个完全自动化的联盟营销系统，可以：
- 🤖 AI 自动生成高质量文章
- 📝 SEO 优化
- 🔗 自动插入联盟链接
- 📢 自动发布到多个平台
- 💰 追踪收入

## 功能

- ✅ AI 文章生成（ChatGPT）
- ✅ Google AdSense 集成
- ✅ 联盟链接管理
- ✅ 自动发布（Medium、Dev.to、Hashnode）
- ✅ 收入追踪
- ✅ 定时任务

## 快速开始

```bash
# 安装依赖
npm install

# 配置环境变量
cp .env.example .env

# 运行
npm start
```

## 环境变量

```
OPENAI_API_KEY=your-key
GOOGLE_ADSENSE_ID=your-id
UDEMY_AFFILIATE_ID=your-id
HOSTINGER_AFFILIATE_ID=your-id
MEDIUM_API_KEY=your-key
DEVTO_API_KEY=your-key
HASHNODE_API_KEY=your-key
```

## 项目结构

```
affiliate-automation/
├── src/
│   ├── index.js
│   ├── ai-generator.js
│   ├── seo-optimizer.js
│   ├── publisher.js
│   ├── tracker.js
│   └── config.js
├── data/
│   ├── topics.json
│   ├── articles/
│   └── stats.json
├── .env.example
└── package.json
```

## 许可证

MIT
