const path = require('path')
const fetchTopStories = require('./hackernews/fetch_top_stories')
const buildStoryCardSvg = require('./svg/build_story_card_svg')
const updateReadmeFile = require('./readme/update_readme_file')
const updateNewsletter = require('./app/update_newsletter')
const HackerNewsStrategy = require('./strategies/hackernews_strategy')

const ROOT = path.resolve(__dirname, '..')
const README_PATH = path.join(ROOT, 'README.md')
const SVG_DIR = path.join(ROOT, 'assets')

async function main() {
  const strategy = new HackerNewsStrategy(fetchTopStories)

  const writeReadme = updateReadmeFile(README_PATH, SVG_DIR)

  const updateNewsletterFn = updateNewsletter(
    (count) => strategy.fetchNews(count),
    (story, rank) => buildStoryCardSvg(story, rank),
    writeReadme
  )

  const result = await updateNewsletterFn(5)
  console.log(`Newsletter actualizado: ${result.count} noticias`)
}

main().catch((err) => {
  console.error('Error:', err.message)
  process.exit(1)
})
