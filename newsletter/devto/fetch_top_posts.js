async function fetchTopPosts(count = 5) {
  const url = `https://dev.to/api/articles?top=7&per_page=${count * 3}`

  const res = await fetch(url, {
    headers: { 'User-Agent': 'newsletter-bot/1.0' },
  })
  if (!res.ok) throw new Error(`Dev.to API error: ${res.status}`)

  const articles = await res.json()

  return articles
    .filter((a) => a.title && a.url)
    .slice(0, count)
    .map((a) => ({
      title:    a.title,
      url:      a.url,
      score:    a.positive_reactions_count,
      comments: a.comments_count,
      by:       a.user.name || a.user.username,
      domain:   'dev.to',
    }))
}

module.exports = fetchTopPosts
