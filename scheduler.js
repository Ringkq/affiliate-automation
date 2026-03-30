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
      'Best Web Hosting Providers in 2026 - Complete Comparison',
      'How to Start a Blog with Hostinger in 2026',
      'Udemy vs Coursera vs Skillshare - Best Online Learning Platform',
      'How to Make Money Online as a Freelancer in 2026',
      'Complete Guide to Content Marketing Strategies',
      'SEO Tips for Beginners - Ultimate Guide 2026',
      'How to Choose the Perfect Domain Name in 2026',
      'Step by Step Guide to Building Your First Website',
      'How to Increase Your Website Conversion Rate',
      'E-commerce Platforms Comparison 2026 - Which One is Best'
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
      'Hostinger': ['hostinger', 'web hosting', 'blog', 'website'],
      'Udemy': ['udemy', 'online course', 'learning', 'education'],
      'Coursera': ['coursera', 'online course', 'certification', 'learning'],
      'Freelancer': ['freelancer', 'remote work', 'online business', 'income'],
      'Content Marketing': ['content marketing', 'digital marketing', 'seo', 'traffic'],
      'SEO': ['seo', 'search engine', 'ranking', 'optimization'],
      'Domain': ['domain name', 'domain', 'website', 'branding'],
      'Website': ['website', 'blog', 'hosting', 'web design'],
      'Conversion Rate': ['conversion rate', 'sales', 'optimization', 'marketing'],
      'E-commerce': ['e-commerce', 'online store', 'shopify', 'sales']
    };

    for (const [key, keywords] of Object.entries(keywordMap)) {
      if (topic.includes(key)) {
        return keywords;
      }
    }

    return ['guide', 'tutorial', 'tips', '2026'];
  }
}

// 启动定时任务
if (require.main === module) {
  const scheduler = new ScheduledTasks();
  scheduler.start();
}

module.exports = ScheduledTasks;
