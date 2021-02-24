import { Text } from "@asyncapi/generator-react-sdk";

import * as fs from "fs";
import * as yaml from "yaml";

export function FrontMatter({ asyncapi, params }) {

  if (!(params.slate || params.frontMatter)) return '';

  const defaultFM = {
    title: asyncapi.info().title(),
    language_tabs: [],
    toc_footers: [],
    includes: [],
    search: true,
    code_clipboard: true
  };

  let frontMatter;
  if (params.frontMatter) {
    frontMatter = yaml.parse(fs.readFileSync(params.frontMatter,'utf8'));
  }

  const frontMatterStr = yaml.stringify(frontMatter || defaultFM);
  return <Text newLines={2}>{`---\n${frontMatterStr}\n---`}</Text>
}

