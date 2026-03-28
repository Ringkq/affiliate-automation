require('dotenv').config();
const cron = require('node-cron');
const AffiliateAutomation = require('./src/index.js');

/**
 * 定时任务配置
 */
class ScheduledTasks {
  constructor() {
    this.automation = new AffiliateAutomation();
    this.topics = [
      '如何使用 Hostinger 建立个人博客',
      'Udemy 在线课程学习指南',
      '2026 年最佳虚拟主机对比',
      '如何开始自由职业生涯',
      '内容营销完全指南',
      '网站 SEO 优化技巧',
      '如何选择合适的域名',
      '建站新手完全指南',
      '如何提高网站转化率',
      '电子商务平台对比'
    ];
  }

  /**
   * 获取随机主题
   */
  getRandomTopic() {
    return this.topics[Math.floor(Math.random() * this.topics.length)];
  }

  /**
   * 启动定时任务
   */
  start() {
    console.log('⏰ 启动定时任务...\n');

    // 每天早上 8 点
    cron.schedule('0 8 * * *', async () => {
      console.log('\n🌅 早上 8 点 - 开始生成文章\n');
      const topic = this.getRandomTopic();
      await this.automation.generateAndPublishArticle(topic, {
        keywords: this.extractKeywords(topic),
        tone: 'professional',
        length: 1500,
        author: 'AI Writer'
      });
    });

    // 每天下午 2 点
    cron.schedule('0 14 * * *', async () => {
      console.log('\n☀️ 下午 2 点 - 开始生成文章\n');
      const topic = this.getRandomTopic();
      await this.automation.generateAndPublishArticle(topic, {
        keywords: this.extractKeywords(topic),
        tone: 'professional',
        length: 1500,
        author: 'AI Writer'
      });
    });

    console.log('✅ 定时任务已启动！');
    console.log('📅 每天早上 8 点生成 1 篇文章');
    console.log('📅 每天下午 2 点生成 1 篇文章');
    console.log('📊 每月预计生成 60 篇文章\n');

    // 保持进程运行
    console.log('💡 提示：按 Ctrl+C 停止任务\n');
  }

  /**
   * 提取关键词
   */
  extractKeywords(topic) {
    const keywordMap = {
      'Hostinger': ['hostinger', '博客', '建站', '虚拟主机'],
      'Udemy': ['udemy', '在线课程', '学习', '教育'],
      '虚拟主机': ['虚拟主机', '主机', '建站', '服务器'],
      '自由职业': ['自由职业', '远程工作', '兼职', '创业'],
      '内容营销': ['内容营销', '营销', '推广', '品牌'],
      'SEO': ['seo', '搜索引擎', '优化', '排名'],
      '域名': ['域名', '网址', '建站', '注册'],
      '建站': ['建站', '网站', '博客', '平台'],
      '转化率': ['转化率', '销售', '优化', '用户'],
      '电子商务': ['电商', '在线商城', '购物', '销售']
    };

    for (const [key, keywords] of Object.entries(keywordMap)) {
      if (topic.includes(key)) {
        return keywords;
      }
    }

    return ['文章', '内容', '教程', '指南'];
  }
}

// 启动定时任务
if (require.main === module) {
  const scheduler = new ScheduledTasks();
  scheduler.start();
}

module.exports = ScheduledTasks;
