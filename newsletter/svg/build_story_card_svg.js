// Linear design system tokens
const C = {
  canvas:          '#010102',
  surface1:        '#0f1011',
  surface2:        '#141516',
  hairline:        '#23252a',
  hairlineStrong:  '#34343a',
  hairlineTert:    '#3e3e44',
  primary:         '#5e6ad2',
  ink:             '#f7f8f8',
  inkMuted:        '#d0d6e0',
  inkSubtle:       '#8a8f98',
  inkTertiary:     '#62666d',
}

function escapeXml(text) {
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
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

// Wraps text into at most 2 lines breaking on word boundaries.
// charsPerLine is estimated from font size and content width.
function wrapTitle(text, charsPerLine) {
  if (text.length <= charsPerLine) return [text]

  const breakAt = text.lastIndexOf(' ', charsPerLine)
  const line1 = breakAt > 0 ? text.slice(0, breakAt) : text.slice(0, charsPerLine)
  const rest  = breakAt > 0 ? text.slice(breakAt + 1) : text.slice(charsPerLine)

  if (rest.length <= charsPerLine) return [line1, rest]

  // Second line: truncate at last word boundary, add ellipsis
  const breakAt2 = rest.lastIndexOf(' ', charsPerLine - 1)
  const line2 = breakAt2 > 0
    ? rest.slice(0, breakAt2) + '…'
    : rest.slice(0, charsPerLine - 1) + '…'

  return [line1, line2]
}

function buildStoryCardSvg(story, rank) {
  const W = 800
  const H = 400
  const L = 40

  const EYEBROW_Y = 80
  const META_Y    = 340

  // At 56px font, content width 720px → ~24 chars per line
  const titleLines = wrapTitle(story.title, 24)
  const LINE_H     = 70  // 56px * 1.25 line-height

  // Center title block vertically between eyebrow and meta
  const titleBlockH = titleLines.length * LINE_H
  const titleStartY = Math.round((EYEBROW_Y + 40 + META_Y - 28) / 2 - titleBlockH / 2 + LINE_H * 0.8)

  // Meta row x positions (28px font, avg char ~16px)
  const SCORE_X    = L
  const SEP1_X     = L + 148
  const AUTHOR_X   = L + 172
  const SEP2_X     = L + 428
  const COMMENTS_X = L + 452

  const domain   = escapeXml(story.domain)
  const score    = formatNumber(story.score)
  const comments = formatNumber(story.comments)
  const author   = escapeXml(story.by.length > 12 ? story.by.slice(0, 12) + '…' : story.by)
  const category = inferCategory(story.domain)

  const pillLabel = category ? category.toUpperCase() : null
  const pillW     = pillLabel ? pillLabel.length * 13 + 32 : 0
  const PILL_X    = W - 40 - pillW
  const PILL_Y    = 54
  const PILL_H    = 36

  const FONT_DISPLAY = `'SF Pro Display',system-ui,-apple-system,'Segoe UI',Roboto,sans-serif`
  const FONT_SANS    = `system-ui,-apple-system,'Segoe UI',Roboto,sans-serif`
  const FONT_MONO    = `ui-monospace,'SF Mono','Cascadia Code','Courier New',monospace`

  const titleSvg = titleLines
    .map((line, i) => `  <text x="${L}" y="${titleStartY + i * LINE_H}"
    font-family="${FONT_DISPLAY}" font-size="56" font-weight="600" letter-spacing="-2"
    fill="${C.ink}">${escapeXml(line)}</text>`)
    .join('\n')

  return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Story ${rank}: ${escapeXml(story.title)}">

  <rect width="${W}" height="${H}" rx="12" fill="${C.surface1}"/>
  <rect width="${W}" height="${H}" rx="12" fill="none" stroke="${C.hairline}" stroke-width="1"/>

  <!-- Eyebrow: rank · domain -->
  <text x="${L}" y="${EYEBROW_Y}"
    font-family="${FONT_MONO}" font-size="32" font-weight="500" letter-spacing="1.6"
    fill="${C.inkTertiary}">#${rank}<tspan fill="${C.hairlineTert}">  ·  </tspan><tspan fill="${C.inkSubtle}" letter-spacing="0">${domain}</tspan></text>

  ${pillLabel ? `<!-- Category pill -->
  <rect x="${PILL_X}" y="${PILL_Y}" width="${pillW}" height="${PILL_H}" rx="9999" fill="${C.surface2}" stroke="${C.hairlineStrong}" stroke-width="1"/>
  <text x="${PILL_X + pillW / 2}" y="${PILL_Y + 24}" font-family="${FONT_MONO}" font-size="20" font-weight="500" letter-spacing="2" fill="${C.inkSubtle}" text-anchor="middle">${escapeXml(pillLabel)}</text>` : ''}

  <!-- Title (1 or 2 lines, word-wrapped) -->
${titleSvg}

  <!-- Meta row -->
  <text x="${SCORE_X}" y="${META_Y}" font-family="${FONT_SANS}" font-size="28" font-weight="500" fill="${C.primary}">▲ ${score}</text>
  <text x="${SEP1_X}" y="${META_Y}" font-family="${FONT_SANS}" font-size="28" fill="${C.hairlineTert}">·</text>
  <text x="${AUTHOR_X}" y="${META_Y}" font-family="${FONT_SANS}" font-size="28" fill="${C.inkMuted}">by <tspan font-weight="500" fill="${C.ink}">${author}</tspan></text>
  <text x="${SEP2_X}" y="${META_Y}" font-family="${FONT_SANS}" font-size="28" fill="${C.hairlineTert}">·</text>
  <text x="${COMMENTS_X}" y="${META_Y}" font-family="${FONT_SANS}" font-size="28" fill="${C.inkSubtle}">◯ ${comments} comments</text>

</svg>`
}

module.exports = buildStoryCardSvg
