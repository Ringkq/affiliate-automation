const axios = require('axios');
const fs = require('fs');
const path = require('path');

/**
 * 发布器 - 自动发布到多个平台
 */
class Publisher {
  constructor(config) {
    this.config = config;
  }

  /**
   * 发布到 Medium
   */
  async publishToMedium(article) {
    if (!this.config.MEDIUM_API_KEY) {
      console.log('⚠️ Medium API Key 未配置');
      return null;
    }

    try {
      const response = await axios.post(
        'https://api.medium.com/v1/me/posts',
        {
          title: article.title,
          contentFormat: 'markdown',
          content: article.content,
          publishStatus: 'draft',
          tags: article.keywords || []
        },
        {
          headers: {
            'Authorization': `Bearer ${this.config.MEDIUM_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ 发布到 Medium 成功:', response.data.url);
      return {
        platform: 'medium',
        url: response.data.url,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Medium 发布失败:', error.message);
      return {
        platform: 'medium',
        status: 'failed',
        error: error.message
      };
    }
  }

  /**
   * 发布到 Dev.to
   */
  async publishToDevTo(article) {
    if (!this.config.DEVTO_API_KEY) {
      console.log('⚠️ Dev.to API Key 未配置');
      return null;
    }

    try {
      const response = await axios.post(
        'https://dev.to/api/articles',
        {
          article: {
            title: article.title,
            body_markdown: article.content,
            tags: article.keywords || [],
            published: false
          }
        },
        {
          headers: {
            'api-key': this.config.DEVTO_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ 发布到 Dev.to 成功:', response.data.url);
      return {
        platform: 'devto',
        url: response.data.url,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Dev.to 发布失败:', error.message);
      return {
        platform: 'devto',
        status: 'failed',
        error: error.message
      };
    }
  }

  /**
   * 发布到 Hashnode
   */
  async publishToHashnode(article) {
    if (!this.config.HASHNODE_API_KEY) {
      console.log('⚠️ Hashnode API Key 未配置');
      return null;
    }

    try {
      const response = await axios.post(
        'https://api.hashnode.com/gql',
        {
          query: `
            mutation {
              createStory(input: {
                title: "${article.title}"
                contentMarkdown: "${article.content.replace(/"/g, '\\"')}"
                tags: [${article.keywords.map(k => `{name: "${k}"}`).join(',')}]
                isPartOfPublication: false
              }) {
                story {
                  slug
                  url
                }
              }
            }
          `
        },
        {
          headers: {
            'Authorization': this.config.HASHNODE_API_KEY,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ 发布到 Hashnode 成功');
      return {
        platform: 'hashnode',
        status: 'success'
      };
    } catch (error) {
      console.error('❌ Hashnode 发布失败:', error.message);
      return {
        platform: 'hashnode',
        status: 'failed',
        error: error.message
      };
    }
  }

  /**
   * 保存到本地文件
   */
  async saveToFile(article) {
    try {
      const articlesDir = path.join(__dirname, '../data/articles');
      
      // 创建目录
      if (!fs.existsSync(articlesDir)) {
        fs.mkdirSync(articlesDir, { recursive: true });
      }

      const filename = `${Date.now()}-${article.title.replace(/\s+/g, '-').toLowerCase()}.md`;
      const filepath = path.join(articlesDir, filename);

      fs.writeFileSync(filepath, article.content, 'utf8');

      console.log('✅ 保存到本地:', filepath);
      return {
        platform: 'local',
        path: filepath,
        status: 'success'
      };
    } catch (error) {
      console.error('❌ 本地保存失败:', error.message);
      return {
        platform: 'local',
        status: 'failed',
        error: error.message
      };
    }
  }

  /**
   * 发布到所有平台
   */
  async publishToAll(article) {
    console.log(`\n📢 开始发布文章: ${article.title}\n`);

    const results = [];

    // 保存到本地
    results.push(await this.saveToFile(article));

    // 发布到各个平台
    results.push(await this.publishToDevTo(article));
    results.push(await this.publishToHashnode(article));

    console.log('\n✅ 发布完成！\n');

    return results;
  }
}

module.exports = Publisher;
