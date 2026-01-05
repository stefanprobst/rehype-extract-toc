import { name as isIdentifierName } from "estree-util-is-identifier-name";

export default function mdsvex({ name = "tableOfContents" } = {}) {
	if (!isIdentifierName(name)) {
		throw new Error(`The name should be a valid identifier name, got: ${JSON.stringify(name)}`);
	}

	return function transformer(_tree, vfile) {
		if (vfile.data.toc) {
			vfile.data.fm = {
				...vfile.data.fm,
				[name]: vfile.data.toc,
			};
		}
	};
}
