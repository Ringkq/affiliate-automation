/**
 * SEO 优化器 - 优化文章的 SEO
 */
class SEOOptimizer {
  /**
   * 优化文章
   */
  optimize(article, options = {}) {
    const {
      keywords = [],
      targetAudience = 'general'
    } = options;

    let content = article.content;

    // 1. 优化标题
    const optimizedTitle = this.optimizeTitle(article.title, keywords);

    // 2. 添加 Meta 描述
    const metaDescription = this.generateMetaDescription(content, keywords);

    // 3. 添加关键词密度
    content = this.optimizeKeywordDensity(content, keywords);

    // 4. 添加内部链接建议
    const internalLinks = this.suggestInternalLinks(content);

    // 5. 添加 H1, H2 标签
    content = this.optimizeHeadings(content);

    return {
      ...article,
      title: optimizedTitle,
      metaDescription: metaDescription,
      content: content,
      internalLinks: internalLinks,
      seoScore: this.calculateSEOScore(article, keywords)
    };
  }

  /**
   * 优化标题
   */
  optimizeTitle(title, keywords) {
    // 确保标题包含主关键词
    if (keywords.length > 0 && !title.includes(keywords[0])) {
      return `${title} - ${keywords[0]}`;
    }
    return title;
  }

  /**
   * 生成 Meta 描述
   */
  generateMetaDescription(content, keywords) {
    // 提取前 160 个字符
    const lines = content.split('\n').filter(line => line.trim());
    let description = '';
    
    for (const line of lines) {
      if (line.length > 0 && !line.startsWith('#')) {
        description = line.substring(0, 160);
        break;
      }
    }

    // 确保包含关键词
    if (keywords.length > 0 && !description.includes(keywords[0])) {
      description = `${keywords[0]} - ${description.substring(0, 140)}`;
    }

    return description;
  }

  /**
   * 优化关键词密度
   */
  optimizeKeywordDensity(content, keywords) {
    // 在文章开头和结尾加入关键词
    if (keywords.length > 0) {
      const mainKeyword = keywords[0];
      const intro = `本文主要讨论${mainKeyword}的相关内容。\n\n`;
      const outro = `\n\n总结：${mainKeyword}是一个重要的话题，希望本文能帮助你更好地理解${mainKeyword}。`;
      
      return intro + content + outro;
    }
    return content;
  }

  /**
   * 建议内部链接
   */
  suggestInternalLinks(content) {
    // 这里可以根据内容建议相关的内部链接
    return [
      { text: '相关教程', url: '/tutorials' },
      { text: '更多资源', url: '/resources' }
    ];
  }

  /**
   * 优化标题标签
   */
  optimizeHeadings(content) {
    // 确保有 H1 标签
    if (!content.includes('# ')) {
      content = '# 主标题\n\n' + content;
    }

    // 确保有 H2 标签
    const h2Count = (content.match(/## /g) || []).length;
    if (h2Count < 3) {
      content = content.replace(/\n\n/g, '\n\n## 小标题\n\n');
    }

    return content;
  }

  /**
   * 计算 SEO 分数
   */
  calculateSEOScore(article, keywords) {
    let score = 0;

    // 标题长度 (30-60 字符最佳)
    if (article.title.length >= 30 && article.title.length <= 60) {
      score += 20;
    }

    // 字数 (1500+ 字最佳)
    if (article.wordCount >= 1500) {
      score += 20;
    }

    // 关键词
    if (keywords.length > 0) {
      const keywordCount = keywords.filter(kw => 
        article.content.toLowerCase().includes(kw.toLowerCase())
      ).length;
      score += Math.min(keywordCount * 10, 20);
    }

    // 标题标签
    if (article.content.includes('# ') && article.content.includes('## ')) {
      score += 20;
    }

    // 段落长度
    const paragraphs = article.content.split('\n\n');
    const avgLength = paragraphs.reduce((sum, p) => sum + p.length, 0) / paragraphs.length;
    if (avgLength > 100 && avgLength < 500) {
      score += 20;
    }

    return Math.min(score, 100);
  }
}

module.exports = SEOOptimizer;
