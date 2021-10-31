import type { Plugin } from 'unified'

export interface RehypeExtractTocMdxOptions {
  /**
   * The variable to export the table of contents as.
   *
   * @default tableOfContents
   */
  name?: string
}

declare const withExtractedTableOfContents: Plugin<
  [RehypeExtractTocMdxOptions?]
>

export default withExtractedTableOfContents
