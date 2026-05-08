module.exports = function updateNewsletter(strategies, buildStoryCard, writeReadme) {
  return async function (count = 5) {
    if (count < 1 || count > 30) throw new Error('count debe estar entre 1 y 30')

    const results = await Promise.all(
      strategies.map(async (strategy) => {
        const stories = await strategy.fetchNews(count)
        if (!stories || stories.length === 0) return null
        const cards = stories.map((story, i) => ({ svg: buildStoryCard(story, i + 1), url: story.url }))
        return {
          sourceName:        strategy.getSourceName(),
          slug:              strategy.getSourceSlug(),
          icon:              strategy.getSourceIcon(),
          description:       strategy.getSourceDescription(),
          cards,
        }
      })
    )

    const sections = results.filter(Boolean)
    if (sections.length === 0) throw new Error('No se obtuvieron noticias')

    await writeReadme(sections)
    return { code: 200, sections: sections.length }
  }
}
