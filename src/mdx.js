import { valueToEstree } from "estree-util-value-to-estree";
import { define } from "unist-util-mdx-define";

export default function mdx({ name = "tableOfContents" } = {}) {
	return function transformer(tree, vfile) {
		define(tree, vfile, { [name]: valueToEstree(vfile.data.toc || []) });
	};
}
