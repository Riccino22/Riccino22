class BaseNewsStrategy {
  async fetchNews(count) {
    throw new Error(`${this.constructor.name} must implement fetchNews`)
  }

  getSourceName() {
    throw new Error(`${this.constructor.name} must implement getSourceName`)
  }
}

module.exports = BaseNewsStrategy
