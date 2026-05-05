async function fetchTopStories(count = 5) {
  const res = await fetch('https://hacker-news.firebaseio.com/v0/topstories.json')
  if (!res.ok) throw new Error(`HackerNews API error: ${res.status}`)

  const ids = await res.json()
  const topIds = ids.slice(0, count)

  const stories = await Promise.all(
    topIds.map(async (id) => {
      const storyRes = await fetch(`https://hacker-news.firebaseio.com/v0/item/${id}.json`)
      if (!storyRes.ok) throw new Error(`Error fetching story ${id}: ${storyRes.status}`)
      return storyRes.json()
    })
  )

  return stories
    .filter((story) => story && story.title)
    .map((story) => {
      let domain = 'news.ycombinator.com'
      try {
        if (story.url) domain = new URL(story.url).hostname.replace('www.', '')
      } catch {}
      return {
        title: story.title,
        url: story.url || `https://news.ycombinator.com/item?id=${story.id}`,
        score: story.score || 0,
        comments: story.descendants || 0,
        by: story.by || 'unknown',
        id: story.id,
        domain,
      }
    })
}

module.exports = fetchTopStories
