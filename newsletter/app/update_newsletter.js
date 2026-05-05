module.exports = function updateNewsletter(fetchNews, buildStoryCard, writeReadme) {
  return async function (count = 5) {
    if (count < 1 || count > 30) throw new Error('count debe estar entre 1 y 30')

    const stories = await fetchNews(count)
    if (!stories || stories.length === 0) throw new Error('No se obtuvieron noticias')

    const cards = stories.map((story, i) => ({ svg: buildStoryCard(story, i + 1), url: story.url }))
    await writeReadme(cards)

    return { code: 200, count: stories.length }
  }
}
