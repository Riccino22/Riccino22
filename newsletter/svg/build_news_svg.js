const formatDate = require('../utils/format_date')

function escapeXml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

function truncate(text, max) {
  return text.length > max ? text.slice(0, max) + '…' : text
}

function buildNewsSvg(stories, sourceName = 'Hacker News') {
  const W = 800
  const PADDING = 16
  const CARD_H = 82
  const CARD_GAP = 8
  const HEADER_H = 74
  const FOOTER_H = 38

  const TOTAL_H = HEADER_H + CARD_GAP + stories.length * (CARD_H + CARD_GAP) + FOOTER_H

  const dateStr = formatDate(new Date())

  const storyCards = stories
    .map((story, i) => {
      const y = HEADER_H + CARD_GAP + i * (CARD_H + CARD_GAP)
      const title = truncate(story.title, 68)
      const meta = `▲ ${story.score}  ·  ${story.by}  ·  ${story.domain}`

      return `
  <g transform="translate(${PADDING}, ${y})">
    <rect width="${W - PADDING * 2}" height="${CARD_H}" rx="8" fill="#161b22" stroke="#21262d" stroke-width="1"/>
    <rect width="40" height="${CARD_H}" rx="8" fill="#21262d"/>
    <rect x="32" width="8" height="${CARD_H}" fill="#21262d"/>
    <text x="20" y="47" font-family="ui-monospace,monospace" font-size="17" font-weight="700" fill="#ff6600" text-anchor="middle">${i + 1}</text>
    <text x="56" y="31" font-family="system-ui,-apple-system,'Segoe UI',sans-serif" font-size="13" font-weight="600" fill="#e6edf3">${escapeXml(title)}</text>
    <text x="56" y="56" font-family="system-ui,-apple-system,'Segoe UI',sans-serif" font-size="12" fill="#8b949e">${escapeXml(meta)}</text>
  </g>`
    })
    .join('\n')

  return `<svg width="${W}" height="${TOTAL_H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${escapeXml(sourceName)} Newsletter">
  <defs>
    <linearGradient id="hnGrad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ff6600"/>
      <stop offset="100%" stop-color="#ff8b3d"/>
    </linearGradient>
    <linearGradient id="bgGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#0d1117"/>
      <stop offset="100%" stop-color="#0d1117"/>
    </linearGradient>
    <clipPath id="outerClip">
      <rect width="${W}" height="${TOTAL_H}" rx="12"/>
    </clipPath>
  </defs>

  <rect width="${W}" height="${TOTAL_H}" rx="12" fill="#0d1117"/>

  <g clip-path="url(#outerClip)">

    <!-- Header -->
    <rect width="${W}" height="${HEADER_H}" fill="url(#hnGrad)"/>

    <!-- HN logo badge -->
    <rect x="${PADDING}" y="16" width="42" height="42" rx="7" fill="rgba(0,0,0,0.3)"/>
    <text x="${PADDING + 21}" y="43" font-family="ui-monospace,monospace" font-size="13" font-weight="800" fill="white" text-anchor="middle">HN</text>

    <!-- Header text -->
    <text x="${PADDING + 54}" y="37" font-family="system-ui,-apple-system,'Segoe UI',sans-serif" font-size="18" font-weight="700" fill="white">${escapeXml(sourceName)} Daily</text>
    <text x="${PADDING + 54}" y="58" font-family="system-ui,-apple-system,'Segoe UI',sans-serif" font-size="12" fill="rgba(255,255,255,0.82)">${escapeXml(dateStr)}</text>

    <!-- Decorative dot right -->
    <circle cx="${W - 24}" cy="${HEADER_H / 2}" r="18" fill="rgba(0,0,0,0.12)"/>
    <circle cx="${W - 24}" cy="${HEADER_H / 2}" r="10" fill="rgba(0,0,0,0.12)"/>

    <!-- Story cards -->
${storyCards}

    <!-- Footer -->
    <text x="${W / 2}" y="${TOTAL_H - 13}" font-family="system-ui,-apple-system,'Segoe UI',sans-serif" font-size="11" fill="#30363d" text-anchor="middle">Actualizado automaticamente · GitHub Actions</text>

  </g>
</svg>`
}

module.exports = buildNewsSvg
