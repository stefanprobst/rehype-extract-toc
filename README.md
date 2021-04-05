# rehype-extract-toc

This is a [`rehype`](https://github.com/rehypejs/rehype) plugin which attaches a
document's table of contents to the VFile.

## How to install

```sh
yarn add @stefanprobst/rehype-extract-toc
```

## How to use

```js
const rehype = require("rehype")
const withSlugs = require("rehype-slug")
const withToc = require("@stefanprobst/rehype-extract-toc")

const processor = rehype().use(withSlugs).use(withToc)

const { data, contents } = processor.processSync(doc)

console.dir(data.toc, { depth: null })
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
