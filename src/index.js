const rank = require('hast-util-heading-rank')
const toString = require('hast-util-to-string')
const visit = require('unist-util-visit')

function attacher() {
  return transformer

  function transformer(tree, vfile) {
    const headings = []

    visit(tree, 'element', onHeading)

    vfile.data.toc = createTree(headings)

    function onHeading(node) {
      const level = rank(node)

      if (level != null) {
        const heading = {
          depth: level,
          value: toString(node),
        }
        if (node.properties !== undefined && node.properties.id != null) {
          heading.id = node.properties.id
        }
        headings.push(heading)
      }
    }

    function createTree(headings) {
      const root = {
        depth: -Infinity,
        children: [],
        parent: undefined,
      }

      function buildTree(parent, entries) {
        if (entries.length === 0) return

        const entry = entries.shift()
        entry.children = []

        while (parent && entry.depth <= parent.depth) {
          parent = parent.parent
        }

        parent.children.push(entry)

        buildTree(
          { depth: entry.depth, children: entry.children, parent },
          entries,
        )
      }

      buildTree(root, headings)

      return root.children
    }
  }
}

module.exports = attacher
