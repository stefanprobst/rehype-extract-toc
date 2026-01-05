import { expect, it } from "@jest/globals";
import { compile } from "@mdx-js/mdx";
import * as fs from "fs";
import * as path from "path";
import fromHtml from "rehype-parse";
import withSlugs from "rehype-slug";
import toHtml from "rehype-stringify";
import { unified } from "unified";

import withToc from "../src/index";
import withMdsvexToc from "../src/mdsvex";
import withTocExport from "../src/mdx";

const fixtures = {
	html: fs.readFileSync(path.join(path.resolve("./test/fixtures/test.html")), {
		encoding: "utf-8",
	}),
	empty: fs.readFileSync(path.join(path.resolve("./test/fixtures/empty.html")), {
		encoding: "utf-8",
	}),
	mdx: fs.readFileSync(path.join(path.resolve("./test/fixtures/test.mdx")), {
		encoding: "utf-8",
	}),
};

function createProcessor(includeSlugs = true) {
	const processor = unified()
		.use(fromHtml, { fragment: true })
		.use(includeSlugs ? withSlugs : undefined)
		.use(withToc)
		.use(toHtml);
	return processor;
}

it("should attach table of contents to vfile data", async () => {
	const { data } = await createProcessor().process(fixtures.html);

	expect(data.toc).toMatchInlineSnapshot(`
[
  {
    "children": [
      {
        "children": [
          {
            "children": [
              {
                "depth": 4,
                "id": "heading-111",
                "value": "Heading 1.1.1",
              },
            ],
            "depth": 3,
            "id": "heading-11",
            "value": "Heading 1.1",
          },
          {
            "depth": 3,
            "id": "heading-12",
            "value": "Heading 1.2",
          },
          {
            "children": [
              {
                "depth": 4,
                "id": "heading-131",
                "value": "Heading 1.3.1",
              },
              {
                "depth": 4,
                "id": "heading-132",
                "value": "Heading 1.3.2",
              },
            ],
            "depth": 3,
            "id": "heading-13",
            "value": "Heading 1.3",
          },
        ],
        "depth": 2,
        "id": "heading-1",
        "value": "Heading 1",
      },
      {
        "children": [
          {
            "depth": 3,
            "id": "heading-21",
            "value": "Heading 2.1",
          },
          {
            "children": [
              {
                "depth": 4,
                "id": "heading-221",
                "value": "Heading 2.2.1",
              },
            ],
            "depth": 3,
            "id": "heading-22",
            "value": "Heading 2.2",
          },
        ],
        "depth": 2,
        "id": "heading-2",
        "value": "Heading 2",
      },
      {
        "depth": 2,
        "id": "heading-3",
        "value": "Heading 3",
      },
    ],
    "depth": 1,
    "id": "title",
    "value": "Title",
  },
]
`);
});

it("should not include id property for missing ids", async () => {
	const { data } = await createProcessor(false).process(fixtures.html);

	expect(data.toc).toMatchInlineSnapshot(`
[
  {
    "children": [
      {
        "children": [
          {
            "children": [
              {
                "depth": 4,
                "value": "Heading 1.1.1",
              },
            ],
            "depth": 3,
            "value": "Heading 1.1",
          },
          {
            "depth": 3,
            "value": "Heading 1.2",
          },
          {
            "children": [
              {
                "depth": 4,
                "value": "Heading 1.3.1",
              },
              {
                "depth": 4,
                "value": "Heading 1.3.2",
              },
            ],
            "depth": 3,
            "value": "Heading 1.3",
          },
        ],
        "depth": 2,
        "value": "Heading 1",
      },
      {
        "children": [
          {
            "depth": 3,
            "value": "Heading 2.1",
          },
          {
            "children": [
              {
                "depth": 4,
                "value": "Heading 2.2.1",
              },
            ],
            "depth": 3,
            "value": "Heading 2.2",
          },
        ],
        "depth": 2,
        "value": "Heading 2",
      },
      {
        "depth": 2,
        "value": "Heading 3",
      },
    ],
    "depth": 1,
    "value": "Title",
  },
]
`);
});

it("should return empty array when no headings found", async () => {
	const { data } = await createProcessor().process(fixtures.empty);
	expect(data.toc).toMatchInlineSnapshot(`[]`);
});

it("should add named export to mdx document", async () => {
	const file = await compile(fixtures.mdx, {
		rehypePlugins: [withSlugs, withToc, withTocExport],
	});
	const data = file.data;

	expect(data.toc).toHaveLength(1);
	expect(String(file)).toMatch(/export const tableOfContents/);
});

it("should allow custom named export in mdx document", async () => {
	const file = await compile(fixtures.mdx, {
		rehypePlugins: [withSlugs, withToc, [withTocExport, { name: "toc" }]],
	});
	const data = file.data;

	expect(data.toc).toHaveLength(1);
	expect(String(file)).toMatch(/export const toc/);
});

it("should throw when invalid identifier name provided as named export", async () => {
	await expect(async () =>
		compile(fixtures.mdx, {
			rehypePlugins: [withSlugs, withToc, [withTocExport, { name: "##toc##" }]],
		}),
	).rejects.toThrow(/The name should be a valid identifier name, got: "##toc##"/);
});

it("should attach table of contents to vfile data frontmatter for mdsvex", async () => {
	const processor = unified()
		.use(fromHtml, { fragment: true })
		.use(withSlugs)
		.use(withToc)
		.use(withMdsvexToc)
		.use(toHtml);

	const { data } = await processor.process(fixtures.html);

	expect(data.fm).toBeDefined();
	expect(data.fm.tableOfContents).toBeDefined();
	expect(data.fm.tableOfContents).toEqual(data.toc);
	expect(data.fm.tableOfContents).toMatchSnapshot();
});

it("should allow custom property name in mdsvex frontmatter", async () => {
	const processor = unified()
		.use(fromHtml, { fragment: true })
		.use(withSlugs)
		.use(withToc)
		.use(withMdsvexToc, { name: "toc" })
		.use(toHtml);

	const { data } = await processor.process(fixtures.html);

	expect(data.fm).toBeDefined();
	expect(data.fm.toc).toBeDefined();
	expect(data.fm.toc).toEqual(data.toc);
});

it("should throw when invalid identifier name provided as property name for mdsvex", async () => {
	const processor = unified()
		.use(fromHtml, { fragment: true })
		.use(withSlugs)
		.use(withToc)
		.use(withMdsvexToc, { name: "##toc##" })
		.use(toHtml);

	await expect(async () => processor.process(fixtures.html)).rejects.toThrow(
		/The name should be a valid identifier name, got: "##toc##"/,
	);
});



