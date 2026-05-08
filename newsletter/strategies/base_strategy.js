class BaseNewsStrategy {
  async fetchNews(count) {
    throw new Error(`${this.constructor.name} must implement fetchNews`)
  }

  getSourceName() {
    throw new Error(`${this.constructor.name} must implement getSourceName`)
  }

  getSourceSlug() {
    return this.getSourceName().toLowerCase().replace(/\s+/g, '_')
  }

  getSourceIcon() {
    return '📰'
  }

  getSourceDescription() {
    return 'Automatically updated every day with the most upvoted stories. Click any card to read the article.'
  }
}

module.exports = BaseNewsStrategy
