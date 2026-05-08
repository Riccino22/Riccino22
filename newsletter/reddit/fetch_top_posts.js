async function fetchTopPosts(subreddits, count = 5) {
  const sub = subreddits.join('+')
  const url = `https://www.reddit.com/r/${sub}/top.json?limit=${count * 3}&t=day`

  const res = await fetch(url, {
    headers: { 'User-Agent': 'newsletter-bot/1.0 (github-profile-readme)' },
  })
  if (!res.ok) throw new Error(`Reddit API error: ${res.status}`)

  const data = await res.json()

  return data.data.children
    .map(({ data: post }) => post)
    .filter((post) => !post.stickied && !post.over_18 && post.title)
    .slice(0, count)
    .map((post) => {
      const isSelf = post.domain.startsWith('self.')
      return {
        title: post.title,
        url: isSelf ? `https://reddit.com${post.permalink}` : post.url,
        score: post.score,
        comments: post.num_comments,
        by: post.author,
        domain: isSelf ? 'reddit.com' : post.domain,
      }
    })
}

module.exports = fetchTopPosts
