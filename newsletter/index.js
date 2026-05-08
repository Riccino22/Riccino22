const path = require('path')
const fetchTopStories  = require('./hackernews/fetch_top_stories')
const fetchTopPosts    = require('./reddit/fetch_top_posts')
const buildStoryCardSvg = require('./svg/build_story_card_svg')
const updateReadmeFile = require('./readme/update_readme_file')
const updateNewsletter = require('./app/update_newsletter')
const HackerNewsStrategy = require('./strategies/hackernews_strategy')
const RedditStrategy     = require('./strategies/reddit_strategy')

const ROOT       = path.resolve(__dirname, '..')
const README_PATH = path.join(ROOT, 'README.md')
const SVG_DIR    = path.join(ROOT, 'assets')

const REDDIT_SUBS = ['LocalLLaMA', 'artificial', 'ChatGPT', 'technology', 'programming']

async function main() {
  const strategies = [
    new HackerNewsStrategy(fetchTopStories),
    new RedditStrategy(fetchTopPosts, REDDIT_SUBS),
  ]

  const writeReadme = updateReadmeFile(README_PATH, SVG_DIR)

  const updateNewsletterFn = updateNewsletter(
    strategies,
    (story, rank) => buildStoryCardSvg(story, rank),
    writeReadme
  )

  const result = await updateNewsletterFn(5)
  console.log(`Newsletter actualizado: ${result.sections} secciones`)
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
