const fs = require('fs').promises
const path = require('path')

const START_MARKER = '<!-- NEWSLETTER_START -->'
const END_MARKER   = '<!-- NEWSLETTER_END -->'

module.exports = function updateReadmeFile(readmePath, svgDir) {
  return async function (sections) {
    await fs.mkdir(svgDir, { recursive: true })

    const date = new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })

    const sectionBlocks = await Promise.all(
      sections.map(async ({ sourceName, slug, icon, description, cards }) => {
        const rels = await Promise.all(
          cards.map(async ({ svg, url }, i) => {
            const rank = i + 1
            const filename = `${slug}_story_${rank}.svg`
            await fs.writeFile(path.join(svgDir, filename), svg, 'utf8')
            const rel = path.relative(path.dirname(readmePath), path.join(svgDir, filename)).replace(/\\/g, '/')
            return { rank, rel, url, sourceName }
          })
        )

        const cell = ({ rank, rel, url, sourceName }) =>
          `<a href="${url}" target="_blank"><img src="${rel}" alt="${sourceName} Story ${rank}" width="100%"/></a>`

        const rows = []
        for (let i = 0; i < rels.length; i += 2) {
          const left  = rels[i]
          const right = rels[i + 1]
          if (right) {
            rows.push(`<tr>\n<td width="50%">${cell(left)}</td>\n<td width="50%">${cell(right)}</td>\n</tr>`)
          } else {
            rows.push(`<tr>\n<td width="50%">${cell(left)}</td>\n<td width="50%"></td>\n</tr>`)
          }
        }

        const header = `### ${icon} Top ${rels.length} on ${sourceName} · ${date}\n> ${description}`
        return `${header}\n\n<table width="100%">\n${rows.join('\n')}\n</table>`
      })
    )

    const readme  = await fs.readFile(readmePath, 'utf8')
    const newSection = `${START_MARKER}\n\n${sectionBlocks.join('\n\n---\n\n')}\n\n${END_MARKER}`

    const markerRegex = new RegExp(`${START_MARKER}[\\s\\S]*?${END_MARKER}`)
    const updated = markerRegex.test(readme)
      ? readme.replace(markerRegex, newSection)
      : readme.trimEnd() + '\n\n' + newSection + '\n'

    await fs.writeFile(readmePath, updated, 'utf8')
  }
}
