const axios = require('axios');

/**
 * AI 文章生成器 - 使用 DeepSeek 代理生成高质量文章
 */
class AIGenerator {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.deepseek.com/chat/completions';
    // 检查是否使用模拟模式
    this.useMockMode = !apiKey || apiKey.includes('proxy') || apiKey.includes('mock');
  }

  /**
   * 生成文章
   */
  async generateArticle(options) {
    const {
      topic,
      keywords = [],
      length = 2000,
      tone = 'professional',
      includeAffiliateLinks = true
    } = options;

    // 如果是模拟模式，直接返回模拟数据
    if (this.useMockMode) {
      console.log('📝 使用模拟数据生成文章...');
      return this.generateMockArticle(topic, keywords, length);
    }

    const prompt = this.buildPrompt(topic, keywords, length, tone, includeAffiliateLinks);

    try {
      const response = await axios.post(
        this.baseUrl,
        {
          model: 'deepseek-chat',
          messages: [
            {
              role: 'system',
              content: '你是一个专业的内容写手，擅长写高质量的评测和教程文章。'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 4000
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 60000
        }
      );

      const content = response.data.choices[0].message.content;

      return {
        title: this.extractTitle(content),
        content: content,
        keywords: keywords,
        topic: topic,
        wordCount: content.split(' ').length,
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('AI 生成失败:', error.message);
      console.log('⚠️ 切换到模拟模式...');
      return this.generateMockArticle(topic, keywords, length);
    }
  }

  /**
   * 生成模拟文章（用于测试）
   */
  generateMockArticle(topic, keywords, length) {
    // 清理主题，去除特殊字符
    const cleanTopic = topic.replace(/[^\w\s\-\:]/g, '').trim();
    
    const mockContent = `# ${cleanTopic}

## Introduction

${cleanTopic} is an important topic in today's digital landscape. In this comprehensive guide, we will explore everything you need to know about ${cleanTopic}.

## Section 1: Key Concepts

Understanding ${cleanTopic} requires familiarity with several fundamental concepts:

- Definition and core principles
- Historical background and evolution
- Current market trends
- Best practices for implementation

## Section 2: Practical Applications

When it comes to practical applications, ${cleanTopic} offers several key benefits:

- Real-world use cases
- Industry-specific solutions
- Performance optimization strategies
- Common challenges and how to overcome them

## Section 3: In-Depth Analysis

Let's dive deeper into the analysis of ${cleanTopic}:

- Advantages and disadvantages
- Cost-benefit considerations
- Implementation strategies
- Future outlook and predictions

## Section 4: Recommended Solutions

When choosing the right solution for ${cleanTopic}, here are our top recommendations:

### 1. Hostinger Web Hosting
Professional hosting with excellent performance and affordable pricing. Perfect for beginners and professionals alike.

[AFFILIATE_LINK]

### 2. Online Learning Platforms
Enhance your skills with comprehensive courses on web development, marketing, and business.

[AFFILIATE_LINK]

### 3. Professional Tools
Streamline your workflow with premium tools designed for efficiency and productivity.

[AFFILIATE_LINK]

## Conclusion

In summary, ${cleanTopic} represents a significant opportunity for growth and success. Whether you're just starting out or looking to improve your existing strategy, this guide provides the foundation you need.

Remember to implement the best practices discussed here and continuously monitor your progress for optimal results.

---

**Author**: Tech Writer  
**Published**: ${new Date().toLocaleDateString()}

> **Disclosure**: This article contains affiliate links. If you purchase through these links, I may earn a commission at no additional cost to you.`;

    return {
      title: topic,
      content: mockContent,
      keywords: keywords,
      topic: topic,
      wordCount: mockContent.split(' ').length,
      generatedAt: new Date().toISOString(),
      isMock: true
    };
  }

  /**
   * 构建提示词
   */
  buildPrompt(topic, keywords, length, tone, includeAffiliateLinks) {
    let prompt = `请写一篇关于"${topic}"的文章。

要求：
- 字数：约 ${length} 字
- 语气：${tone}
- 关键词：${keywords.join(', ')}
- 结构：标题 + 引言 + 3-5 个主要部分 + 结论
- 格式：Markdown
- 质量：高质量、原创、有价值`;

    if (includeAffiliateLinks) {
      prompt += `
- 在适当位置插入 [AFFILIATE_LINK] 标记，用于后续插入联盟链接
- 推荐 2-3 个相关产品`;
    }

    return prompt;
  }

  /**
   * 提取标题
   */
  extractTitle(content) {
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.startsWith('#')) {
        return line.replace(/^#+\s*/, '').trim();
      }
    }
    return '未命名文章';
  }

  /**
   * 批量生成文章
   */
  async generateMultipleArticles(topics, options = {}) {
    const articles = [];
    
    for (const topic of topics) {
      console.log(`生成文章: ${topic}`);
      try {
        const article = await this.generateArticle({
          topic,
          ...options
        });
        articles.push(article);
        
        // 避免 API 限流
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`生成失败: ${topic}`, error.message);
      }
    }

    return articles;
  }
}

module.exports = AIGenerator;
