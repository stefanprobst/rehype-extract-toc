import { Plugin } from 'unified'

declare namespace withExtractedTableOfContents {
  interface TocEntry {
    value: string
    depth: number
    id?: string
    children?: Array<TocEntry>
  }

  type Toc = Array<TocEntry>
}

declare const withExtractedTableOfContents: Plugin<[]>

export = withExtractedTableOfContents
