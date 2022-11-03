import { Text } from '@asyncapi/generator-react-sdk';

import * as fs from 'fs';
import * as yaml from 'yaml';

export function FrontMatter({ asyncapi, params }) {
  const info = asyncapi.info();
  const frontMatter = yaml.parse(fs.readFileSync(params.frontMatter, 'utf8'));
  let frontMatterStr = yaml.stringify(frontMatter);
  frontMatterStr = frontMatterStr.split('{{title}}').join(info.title());
  frontMatterStr = frontMatterStr.split('{{version}}').join(params.version || info.version());
  return <Text newLines={2}>{`---\n${frontMatterStr}---`}</Text>;
}
