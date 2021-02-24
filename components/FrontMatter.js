import { Text } from "@asyncapi/generator-react-sdk";

import * as fs from "fs";
import * as yaml from "yaml";

export function FrontMatter({ asyncapi, params }) {
  if (!(params.slate || params.frontMatter)) return '';

  let frontMatter;
  if (params.frontMatter) {
    frontMatter = yaml.parse(fs.readFileSync(params.frontMatter,'utf8'));
  } else {
    frontMatter = {
      title: asyncapi.info().title(),
      language_tabs: [],
      toc_footers: [],
      includes: [],
      search: true,
      code_clipboard: true
    };
  }
  const frontMatterStr = yaml.stringify(frontMatter);
  return <Text newLines={2}>{`---\n${frontMatterStr}\n---`}</Text>
}
