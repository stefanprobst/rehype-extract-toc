import type { Plugin } from 'unified'

export interface TocEntry {
  value: string
  depth: number
  id?: string
  children?: Array<TocEntry>
}

export type Toc = Array<TocEntry>

declare const withExtractedTableOfContents: Plugin<[]>

export default withExtractedTableOfContents

declare module 'vfile' {
  interface DataMap {
    toc: Toc
  }
}
