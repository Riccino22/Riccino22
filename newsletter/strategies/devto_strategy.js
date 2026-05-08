const BaseNewsStrategy = require('./base_strategy')

class DevToStrategy extends BaseNewsStrategy {
  constructor(fetchPosts) {
    super()
    this.fetchPosts = fetchPosts
  }

  async fetchNews(count = 5) {
    return this.fetchPosts(count)
  }

  getSourceName()        { return 'Dev.to' }
  getSourceSlug()        { return 'devto' }
  getSourceIcon()        { return '👩‍💻' }
  getSourceDescription() { return 'Top articles from the dev.to community this week. Click any card to read the post.' }
}

module.exports = DevToStrategy
