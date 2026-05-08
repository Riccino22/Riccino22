const BaseNewsStrategy = require('./base_strategy')

class LobstersStrategy extends BaseNewsStrategy {
  constructor(fetchPosts) {
    super()
    this.fetchPosts = fetchPosts
  }

  async fetchNews(count = 5) {
    return this.fetchPosts(count)
  }

  getSourceName()        { return 'Lobste.rs' }
  getSourceSlug()        { return 'lobsters' }
  getSourceIcon()        { return '🦞' }
  getSourceDescription() { return 'Curated tech stories voted on by the Lobste.rs community. Click any card to read the article.' }
}

module.exports = LobstersStrategy
