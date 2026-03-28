const fs = require('fs');
const path = require('path');

/**
 * 收入追踪器 - 追踪所有收入来源
 */
class Tracker {
  constructor() {
    this.statsFile = path.join(__dirname, '../data/stats.json');
    this.initStatsFile();
  }

  /**
   * 初始化统计文件
   */
  initStatsFile() {
    if (!fs.existsSync(this.statsFile)) {
      const dir = path.dirname(this.statsFile);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const initialStats = {
        articles: [],
        earnings: {
          adsense: 0,
          udemy: 0,
          hostinger: 0,
          bluehost: 0,
          total: 0
        },
        clicks: {
          adsense: 0,
          udemy: 0,
          hostinger: 0,
          bluehost: 0,
          total: 0
        },
        conversions: {
          udemy: 0,
          hostinger: 0,
          bluehost: 0,
          total: 0
        }
      };

      fs.writeFileSync(this.statsFile, JSON.stringify(initialStats, null, 2));
    }
  }

  /**
   * 读取统计数据
   */
  getStats() {
    const data = fs.readFileSync(this.statsFile, 'utf8');
    return JSON.parse(data);
  }

  /**
   * 保存统计数据
   */
  saveStats(stats) {
    fs.writeFileSync(this.statsFile, JSON.stringify(stats, null, 2));
  }

  /**
   * 记录文章
   */
  recordArticle(article) {
    const stats = this.getStats();

    stats.articles.push({
      title: article.title,
      publishedAt: new Date().toISOString(),
      keywords: article.keywords,
      wordCount: article.wordCount,
      platforms: article.publishedPlatforms || []
    });

    this.saveStats(stats);
    console.log('✅ 文章已记录');
  }

  /**
   * 记录 AdSense 收入
   */
  recordAdSenseEarnings(amount) {
    const stats = this.getStats();
    stats.earnings.adsense += amount;
    stats.earnings.total += amount;
    this.saveStats(stats);
    console.log(`💰 AdSense 收入: $${amount}`);
  }

  /**
   * 记录联盟收入
   */
  recordAffiliateEarnings(platform, amount) {
    const stats = this.getStats();
    
    if (stats.earnings[platform] !== undefined) {
      stats.earnings[platform] += amount;
      stats.earnings.total += amount;
      this.saveStats(stats);
      console.log(`💰 ${platform} 收入: $${amount}`);
    }
  }

  /**
   * 记录点击
   */
  recordClick(platform) {
    const stats = this.getStats();
    
    if (stats.clicks[platform] !== undefined) {
      stats.clicks[platform] += 1;
      stats.clicks.total += 1;
      this.saveStats(stats);
    }
  }

  /**
   * 记录转化
   */
  recordConversion(platform) {
    const stats = this.getStats();
    
    if (stats.conversions[platform] !== undefined) {
      stats.conversions[platform] += 1;
      stats.conversions.total += 1;
      this.saveStats(stats);
      console.log(`✅ ${platform} 转化: 1`);
    }
  }

  /**
   * 获取月度报告
   */
  getMonthlyReport() {
    const stats = this.getStats();

    const report = {
      month: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long' }),
      articles: stats.articles.length,
      earnings: stats.earnings,
      clicks: stats.clicks,
      conversions: stats.conversions,
      averageEarningsPerArticle: stats.earnings.total / (stats.articles.length || 1),
      conversionRate: (stats.conversions.total / stats.clicks.total * 100).toFixed(2) + '%'
    };

    return report;
  }

  /**
   * 打印报告
   */
  printReport() {
    const report = this.getMonthlyReport();

    console.log('\n📊 月度报告\n');
    console.log(`月份: ${report.month}`);
    console.log(`文章数: ${report.articles}`);
    console.log(`\n💰 收入:`);
    console.log(`  AdSense: $${report.earnings.adsense.toFixed(2)}`);
    console.log(`  Udemy: $${report.earnings.udemy.toFixed(2)}`);
    console.log(`  Hostinger: $${report.earnings.hostinger.toFixed(2)}`);
    console.log(`  Bluehost: $${report.earnings.bluehost.toFixed(2)}`);
    console.log(`  总计: $${report.earnings.total.toFixed(2)}`);
    console.log(`\n📈 点击:`);
    console.log(`  总点击: ${report.clicks.total}`);
    console.log(`\n✅ 转化:`);
    console.log(`  总转化: ${report.conversions.total}`);
    console.log(`  转化率: ${report.conversionRate}`);
    console.log(`\n📊 平均每篇文章收入: $${report.averageEarningsPerArticle.toFixed(2)}\n`);
  }
}

module.exports = Tracker;
