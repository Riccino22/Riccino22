const fs = require('fs').promises
const path = require('path')

const START_MARKER = '<!-- NEWSLETTER_START -->'
const END_MARKER = '<!-- NEWSLETTER_END -->'

module.exports = function updateReadmeFile(readmePath, svgDir) {
  return async function (cards) {
    await fs.mkdir(svgDir, { recursive: true })

    const rels = await Promise.all(
      cards.map(async ({ svg, url }, i) => {
        const rank = i + 1
        const filename = `story_${rank}.svg`
        await fs.writeFile(path.join(svgDir, filename), svg, 'utf8')
        const rel = path.relative(path.dirname(readmePath), path.join(svgDir, filename)).replace(/\\/g, '/')
        return { rank, rel, url }
      })
    )

    const cell = ({ rank, rel, url }) =>
      `<a href="${url}" target="_blank"><img src="${rel}" alt="Story ${rank}" width="100%"/></a>`

    const rows = []
    for (let i = 0; i < rels.length; i += 2) {
      const left = rels[i]
      const right = rels[i + 1]
      if (right) {
        rows.push(`<tr>\n<td width="50%">${cell(left)}</td>\n<td width="50%">${cell(right)}</td>\n</tr>`)
      } else {
        rows.push(`<tr>\n<td width="50%">${cell(left)}</td>\n<td width="50%"></td>\n</tr>`)
      }
    }

    const date = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })
    const header = `### 📰 Top ${rels.length} on Hacker News · ${date}\n> Automatically updated every day with the most upvoted stories. Click any card to read the article.`

    const readme = await fs.readFile(readmePath, 'utf8')
    const newSection = `${START_MARKER}\n\n${header}\n\n<table width="100%">\n${rows.join('\n')}\n</table>\n\n${END_MARKER}`

    const markerRegex = new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}`)
    const updated = markerRegex.test(readme)
      ? readme.replace(markerRegex, newSection)
      : readme.trimEnd() + '\n\n' + newSection + '\n'

    await fs.writeFile(readmePath, updated, 'utf8')
  }
}
