import type { Plugin } from "unified";

export interface RehypeExportTocMdsvexOptions {
	/**
	 * The variable to export the table of contents as.
	 *
	 * @default 'tableOfContents'
	 */
	name?: string;
}

declare const mdsvex: Plugin<[RehypeExportTocMdsvexOptions?]>;

export default mdsvex;

