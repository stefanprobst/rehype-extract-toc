import type { Plugin } from 'unified'

export interface RehypeExportTocMdxOptions {
  /**
   * The variable to export the table of contents as.
   *
   * @default 'tableOfContents'
   */
  name?: string
}

declare const withExportedTableOfContents: Plugin<[RehypeExportTocMdxOptions?]>

export default withExportedTableOfContents
