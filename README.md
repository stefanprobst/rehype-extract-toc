# rehype-extract-toc

This is a [`rehype`](https://github.com/rehypejs/rehype) plugin which attaches a
document's table of contents to the VFile.

## How to install

```sh
yarn add @stefanprobst/rehype-extract-toc
```

## How to use

```js
import { rehype } from require("rehype")
import withSlugs from require("rehype-slug")
import withToc from require("@stefanprobst/rehype-extract-toc")

const processor = rehype().use(withSlugs).use(withToc)

const file = processor.processSync(doc)

console.dir(file.data.toc, { depth: null })
```

The table of contents will be attached to the resulting VFile's `data.toc`
property. It has the following shape:

```ts
interface TocEntry {
  value: string
  depth: number
  id?: string
  children?: Array<TocEntry>
}

type Toc = Array<TocEntry>
```

Note that this plugin does _not_ generate any ids, you will probably want to
combine it with `rehype-slug`.

How you render the table of contents is up to you.

## How to use with MDX

When transforming MDX documents, you can expose the table of contents as a named
export, which defaults to `tableOfContents`.

```js
import { compile } from '@mdx-js/mdx'
import withSlugs from require("rehype-slug")
import withToc from require("@stefanprobst/rehype-extract-toc")
import withTocExport from require("@stefanprobst/rehype-extract-toc/mdx")

async function run() {
  const file = await compile(doc, {
    rehypePlugins: [
      withSlugs,
      withToc,
      withTocExport,
      /** Optionally, provide a custom name for the export. */
      // [withTocExport, { name: 'toc' }],
    ],
  })

  console.log(String(file))
}

run()
```
