const BaseNewsStrategy = require('./base_strategy')

class RedditStrategy extends BaseNewsStrategy {
  constructor(fetchPosts, subreddits) {
    super()
    this.fetchPosts = fetchPosts
    this.subreddits = subreddits
  }

  async fetchNews(count = 5) {
    return this.fetchPosts(this.subreddits, count)
  }

  getSourceName() { return 'Reddit' }
  getSourceSlug() { return 'reddit' }
  getSourceIcon()  { return '🤖' }
  getSourceDescription() {
    const subs = this.subreddits.map((s) => `r/${s}`).join(', ')
    return `Top AI, agents and dev posts from ${subs}. Click any card to read the post.`
  }
}

module.exports = RedditStrategy
