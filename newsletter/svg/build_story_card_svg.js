function escapeXml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function truncate(text, max) {
  return text.length > max ? text.slice(0, max) + '…' : text
}

function formatNumber(n) {
  return n.toLocaleString('en-US')
}

function inferCategory(domain) {
  if (!domain) return null
  if (/github|gitlab|npm|crates\.io|pypi/.test(domain)) return 'Code'
  if (/arxiv|research|paper|acm\.org|ieee|scholar/.test(domain)) return 'Research'
  if (/news\.ycombinator/.test(domain)) return 'Discussion'
  if (/youtube|youtu\.be|vimeo/.test(domain)) return 'Video'
  if (/medium|substack|dev\.to|hashnode/.test(domain)) return 'Blog'
  return null
}

function buildStoryCardSvg(story, rank) {
  const W = 800
  const H = 200

  const CONTENT_X = 96
  const TITLE_Y   = 68
  const DOMAIN_Y  = 102
  const META_Y    = 158

  // Meta row fixed x positions (font 17px Inter, avg char ~10px)
  const SCORE_X    = CONTENT_X
  const SEP1_X     = CONTENT_X + 92
  const AUTHOR_X   = CONTENT_X + 108
  const SEP2_X     = CONTENT_X + 248
  const COMMENTS_X = CONTENT_X + 264

  const title    = escapeXml(truncate(story.title, 52))
  const domain   = escapeXml(story.domain)
  const score    = formatNumber(story.score)
  const comments = formatNumber(story.comments)
  const author   = escapeXml(story.by)
  const category = inferCategory(story.domain)

  const pillW = category ? category.length * 10 + 26 : 0
  const PILL_X = W - 24 - pillW
  const PILL_Y = META_Y - 22
  const PILL_H = 28

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Story ${rank}: ${escapeXml(story.title)}">
  <!-- Card -->
  <rect width="${W}" height="${H}" rx="12" fill="#ffffff"/>
  <rect width="${W}" height="${H}" rx="12" fill="none" stroke="rgba(0,0,0,0.08)" stroke-width="1"/>

  <!-- Rank badge -->
  <rect x="24" y="64" width="54" height="48" rx="8" fill="#f1edec"/>
  <text x="51" y="95" font-family="ui-monospace,'Cascadia Code','Courier New',monospace" font-size="18" font-weight="500" fill="#4d4d4d" text-anchor="middle">#${rank}</text>

  <!-- Title -->
  <text x="${CONTENT_X}" y="${TITLE_Y}" font-family="Inter,system-ui,-apple-system,'Segoe UI',sans-serif" font-size="34" font-weight="600" letter-spacing="-1" fill="#171717">${title}</text>

  <!-- Domain -->
  <text x="${CONTENT_X}" y="${DOMAIN_Y}" font-family="ui-monospace,'Cascadia Code','Courier New',monospace" font-size="18" fill="#a0a0a0">${domain}</text>

  <!-- Meta: score -->
  <text x="${SCORE_X}" y="${META_Y}" font-family="Inter,system-ui,sans-serif" font-size="17" font-weight="500" fill="#0068d6">▲ ${score}</text>

  <!-- Meta: separator -->
  <text x="${SEP1_X}" y="${META_Y}" font-family="Inter,system-ui,sans-serif" font-size="17" fill="#d0d0d0">·</text>

  <!-- Meta: author -->
  <text x="${AUTHOR_X}" y="${META_Y}" font-family="Inter,system-ui,sans-serif" font-size="17" fill="#4d4d4d">by <tspan font-weight="600" fill="#171717">${author}</tspan></text>

  <!-- Meta: separator -->
  <text x="${SEP2_X}" y="${META_Y}" font-family="Inter,system-ui,sans-serif" font-size="17" fill="#d0d0d0">·</text>

  <!-- Meta: comments -->
  <text x="${COMMENTS_X}" y="${META_Y}" font-family="Inter,system-ui,sans-serif" font-size="17" fill="#4d4d4d">◯ ${comments} comments</text>

  ${category ? `<!-- Category pill -->
  <rect x="${PILL_X}" y="${PILL_Y}" width="${pillW}" height="${PILL_H}" rx="14" fill="#ebf5ff"/>
  <text x="${PILL_X + pillW / 2}" y="${PILL_Y + 19}" font-family="Inter,system-ui,sans-serif" font-size="12" font-weight="700" letter-spacing="0.8" fill="#0068d6" text-anchor="middle">${escapeXml(category)}</text>` : ''}
</svg>`
}

module.exports = buildStoryCardSvg
