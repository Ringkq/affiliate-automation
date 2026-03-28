/**
 * 联盟链接注入器 - 自动插入联盟链接和 AdSense
 */
class AffiliateInjector {
  constructor(config) {
    this.config = config;
  }

  /**
   * 注入联盟链接
   */
  injectAffiliateLinks(article, affiliateLinks = {}) {
    let content = article.content;

    // 替换 [AFFILIATE_LINK] 标记
    const placeholders = content.match(/\[AFFILIATE_LINK\]/g) || [];
    
    placeholders.forEach((_, index) => {
      const linkKey = Object.keys(affiliateLinks)[index % Object.keys(affiliateLinks).length];
      if (linkKey && affiliateLinks[linkKey]) {
        const link = affiliateLinks[linkKey];
        const replacement = `[${link.text}](${link.url})`;
        content = content.replace('[AFFILIATE_LINK]', replacement, 1);
      }
    });

    return {
      ...article,
      content: content,
      affiliateLinks: affiliateLinks
    };
  }

  /**
   * 注入 Google AdSense
   */
  injectAdSense(article, adsenseId) {
    let content = article.content;

    // 在文章顶部插入广告
    const topAd = `\n<!-- Google AdSense - Top -->\n<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}"></script>\n<ins class="adsbygoogle" style="display:block" data-ad-client="${adsenseId}" data-ad-slot="1234567890" data-ad-format="auto" data-full-width-responsive="true"></ins>\n<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>\n`;

    content = topAd + content;

    // 在文章中间插入广告
    const paragraphs = content.split('\n\n');
    if (paragraphs.length > 4) {
      const midPoint = Math.floor(paragraphs.length / 2);
      const midAd = `\n<!-- Google AdSense - Middle -->\n<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsenseId}"></script>\n<ins class="adsbygoogle" style="display:block; text-align:center;" data-ad-layout="in-article" data-ad-format="fluid" data-ad-client="${adsenseId}" data-ad-slot="9876543210"></ins>\n<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>\n`;
      
      paragraphs.splice(midPoint, 0, midAd);
      content = paragraphs.join('\n\n');
    }

    return {
      ...article,
      content: content,
      adsenseId: adsenseId
    };
  }

  /**
   * 生成完整的可发布文章
   */
  generatePublishableArticle(article, options = {}) {
    const {
      affiliateLinks = {},
      adsenseId = null,
      includeAuthor = true,
      includeDate = true
    } = options;

    let content = article.content;

    // 添加作者信息
    if (includeAuthor) {
      content += `\n\n---\n\n**作者**: ${options.author || 'AI Writer'}\n`;
    }

    // 添加发布日期
    if (includeDate) {
      content += `**发布日期**: ${new Date().toLocaleDateString('zh-CN')}\n`;
    }

    // 添加免责声明
    content += `\n\n> **免责声明**: 本文包含联盟链接。如果你通过这些链接购买，我可能会获得佣金，但这不会增加你的成本。\n`;

    // 注入联盟链接
    if (Object.keys(affiliateLinks).length > 0) {
      content = this.injectAffiliateLinks({ content }, affiliateLinks).content;
    }

    // 注入 AdSense
    if (adsenseId) {
      content = this.injectAdSense({ content }, adsenseId).content;
    }

    return {
      ...article,
      content: content,
      ready: true
    };
  }

  /**
   * 生成推荐产品部分
   */
  generateRecommendations(products = []) {
    let recommendations = '\n\n## 推荐产品\n\n';

    products.forEach((product, index) => {
      recommendations += `### ${index + 1}. ${product.name}\n\n`;
      recommendations += `${product.description}\n\n`;
      recommendations += `**优点**:\n`;
      product.pros.forEach(pro => {
        recommendations += `- ${pro}\n`;
      });
      recommendations += `\n**缺点**:\n`;
      product.cons.forEach(con => {
        recommendations += `- ${con}\n`;
      });
      recommendations += `\n[了解更多](${product.affiliateLink})\n\n`;
    });

    return recommendations;
  }
}

module.exports = AffiliateInjector;
