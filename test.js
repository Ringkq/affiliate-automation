require('dotenv').config();
const AffiliateAutomation = require('./src/index.js');

async function test() {
  const automation = new AffiliateAutomation();
  
  console.log('🚀 开始测试联盟营销自动化系统\n');
  
  // 生成一篇文章
  const result = await automation.generateAndPublishArticle(
    '如何使用 Hostinger 建立个人博客',
    {
      keywords: ['hostinger', '博客', '建站', '虚拟主机'],
      tone: 'professional',
      length: 1500,
      author: 'AI Writer'
    }
  );
  
  if (result.success) {
    console.log('\n✅ 文章生成成功！');
    console.log('标题:', result.article.title);
    console.log('字数:', result.article.wordCount);
    console.log('SEO 分数:', result.article.seoScore);
  } else {
    console.log('\n❌ 生成失败:', result.error);
  }
}

test().catch(console.error);
