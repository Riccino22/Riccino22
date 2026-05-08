const BaseNewsStrategy = require('./base_strategy')

class HackerNewsStrategy extends BaseNewsStrategy {
  constructor(fetchStories) {
    super()
    this.fetchStories = fetchStories
  }

  async fetchNews(count = 5) {
    return this.fetchStories(count)
  }

  getSourceName() { return 'Hacker News' }
  getSourceSlug() { return 'hn' }
  getSourceIcon()  { return '📰' }
  getSourceDescription() {
    return 'Automatically updated every day with the most upvoted stories. Click any card to read the article.'
  }
}

module.exports = HackerNewsStrategy
