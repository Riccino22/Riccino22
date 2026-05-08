async function fetchTopPosts(count = 5) {
  const res = await fetch('https://lobste.rs/hottest.json')
  if (!res.ok) throw new Error(`Lobste.rs API error: ${res.status}`)

  const posts = await res.json()

  return posts
    .filter((p) => p.title && p.url)
    .slice(0, count)
    .map((p) => ({
      title:    p.title,
      url:      p.url,
      score:    p.score,
      comments: p.comment_count,
      by:       p.submitter_user,
      domain:   new URL(p.url).hostname.replace(/^www\./, ''),
    }))
}

module.exports = fetchTopPosts
