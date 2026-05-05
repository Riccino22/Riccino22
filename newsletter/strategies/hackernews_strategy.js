const BaseNewsStrategy = require('./base_strategy')

class HackerNewsStrategy extends BaseNewsStrategy {
  constructor(fetchStories) {
    super()
    this.fetchStories = fetchStories
  }

  async fetchNews(count = 5) {
    return this.fetchStories(count)
  }

  getSourceName() {
    return 'Hacker News'
  }
}

module.exports = HackerNewsStrategy
