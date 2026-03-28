const axios = require('axios');

/**
 * AI 文章生成器 - 使用 DeepSeek 生成高质量文章
 */
class AIGenerator {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseUrl = 'https://api.deepseek.com/chat/completions';
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
          }
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
      throw new Error('AI 文章生成失败: ' + error.message);
    }
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
