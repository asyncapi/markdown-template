import { File } from "@asyncapi/generator-react-sdk";

import { Info } from "../components/Info";
import { Servers } from "../components/Servers";
import { Channels } from "../components/Channels";
import { FrontMatter } from "../components/FrontMatter";
import { TableOfContents } from "../components/TableOfContents";

export default function({ asyncapi, params = {} }) {
  return (
    <File name={params.outFilename || 'asyncapi.md'}>
      {params.frontMatter && <FrontMatter asyncapi={asyncapi} params={params} />}
      <Info asyncapi={asyncapi} params={params} />
      {params.toc !== 'false' && <TableOfContents asyncapi={asyncapi} />}

      <Servers asyncapi={asyncapi} />
      <Channels asyncapi={asyncapi} />
    </File>
  );
}
