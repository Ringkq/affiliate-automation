require('dotenv').config();
const cron = require('node-cron');
const AIGenerator = require('./ai-generator');
const SEOOptimizer = require('./seo-optimizer');
const AffiliateInjector = require('./affiliate-injector');
const Publisher = require('./publisher');
const Tracker = require('./tracker');

/**
 * 联盟营销自动化系统
 */
class AffiliateAutomation {
  constructor() {
    this.aiGenerator = new AIGenerator(process.env.OPENAI_API_KEY);
    this.seoOptimizer = new SEOOptimizer();
    this.affiliateInjector = new AffiliateInjector(process.env);
    this.publisher = new Publisher(process.env);
    this.tracker = new Tracker();
  }

  /**
   * 完整的文章生成和发布流程
   */
  async generateAndPublishArticle(topic, options = {}) {
    console.log(`\n🚀 开始处理主题: ${topic}\n`);

    try {
      // 1. AI 生成文章
      console.log('1️⃣ AI 生成文章...');
      const article = await this.aiGenerator.generateArticle({
        topic,
        keywords: options.keywords || [],
        length: options.length || 2000,
        tone: options.tone || 'professional'
      });
      console.log(`✅ 文章生成完成 (${article.wordCount} 字)\n`);

      // 2. SEO 优化
      console.log('2️⃣ SEO 优化...');
      const optimizedArticle = this.seoOptimizer.optimize(article, {
        keywords: options.keywords || [],
        targetAudience: options.targetAudience || 'general'
      });
      console.log(`✅ SEO 优化完成 (分数: ${optimizedArticle.seoScore}/100)\n`);

      // 3. 注入联盟链接
      console.log('3️⃣ 注入联盟链接...');
      const affiliateLinks = {
        udemy: {
          text: '在 Udemy 上学习',
          url: options.udemyLink || 'https://udemy.com'
        },
        hostinger: {
          text: '使用 Hostinger 建站',
          url: options.hostingerLink || 'https://hostinger.com'
        }
      };

      let finalArticle = this.affiliateInjector.injectAffiliateLinks(
        optimizedArticle,
        affiliateLinks
      );
      console.log('✅ 联盟链接注入完成\n');

      // 4. 注入 AdSense
      if (process.env.GOOGLE_ADSENSE_ID) {
        console.log('4️⃣ 注入 Google AdSense...');
        finalArticle = this.affiliateInjector.injectAdSense(
          finalArticle,
          process.env.GOOGLE_ADSENSE_ID
        );
        console.log('✅ AdSense 注入完成\n');
      }

      // 5. 生成可发布版本
      console.log('5️⃣ 生成可发布版本...');
      finalArticle = this.affiliateInjector.generatePublishableArticle(
        finalArticle,
        {
          affiliateLinks,
          adsenseId: process.env.GOOGLE_ADSENSE_ID,
          author: options.author || 'AI Writer'
        }
      );
      console.log('✅ 可发布版本生成完成\n');

      // 6. 发布到各个平台
      console.log('6️⃣ 发布到各个平台...');
      const publishResults = await this.publisher.publishToAll(finalArticle);
      console.log('✅ 发布完成\n');

      // 7. 记录统计
      console.log('7️⃣ 记录统计...');
      finalArticle.publishedPlatforms = publishResults.map(r => r.platform);
      this.tracker.recordArticle(finalArticle);
      console.log('✅ 统计记录完成\n');

      return {
        success: true,
        article: finalArticle,
        publishResults: publishResults
      };
    } catch (error) {
      console.error('❌ 处理失败:', error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * 批量处理多个主题
   */
  async generateMultipleArticles(topics, options = {}) {
    console.log(`\n📚 开始批量处理 ${topics.length} 个主题\n`);

    const results = [];

    for (const topic of topics) {
      const result = await this.generateAndPublishArticle(topic, options);
      results.push(result);

      // 避免 API 限流
      await new Promise(resolve => setTimeout(resolve, 3000));
    }

    return results;
  }

  /**
   * 设置定时任务
   */
  scheduleDaily(topics, options = {}) {
    console.log('⏰ 设置每日定时任务...');

    // 每天早上 8 点执行
    cron.schedule('0 8 * * *', async () => {
      console.log('⏰ 定时任务触发');
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      await this.generateAndPublishArticle(randomTopic, options);
    });

    console.log('✅ 定时任务已设置\n');
  }

  /**
   * 显示报告
   */
  showReport() {
    this.tracker.printReport();
  }
}

// 主程序
async function main() {
  const automation = new AffiliateAutomation();

  // 示例主题
  const topics = [
    '如何使用 Hostinger 建立个人博客',
    'Udemy 在线课程学习指南',
    '2026 年最佳虚拟主机对比',
    '如何开始自由职业生涯',
    '内容营销完全指南'
  ];

  // 示例：生成单篇文章
  // await automation.generateAndPublishArticle(topics[0], {
  //   keywords: ['hostinger', '博客', '建站'],
  //   tone: 'professional'
  // });

  // 示例：显示报告
  automation.showReport();

  // 示例：设置定时任务
  // automation.scheduleDaily(topics);
}

// 如果直接运行此文件
if (require.main === module) {
  main().catch(console.error);
}

module.exports = AffiliateAutomation;
