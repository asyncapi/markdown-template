import { File } from '@asyncapi/generator-react-sdk';

import { Info } from '../components/Info';
import { Servers } from '../components/Servers';
import { Operations } from '../components/Operations';
import { FrontMatter } from '../components/FrontMatter';
import { TableOfContents } from '../components/TableOfContents';

export default function Template({ asyncapi, params = {} }) {
  return (
    <File name={params.outFilename || 'asyncapi.md'}>
      {params.frontMatter && <FrontMatter asyncapi={asyncapi} params={params} />}
      <Info asyncapi={asyncapi} params={params} />
      {params.toc !== 'false' && <TableOfContents asyncapi={asyncapi} />}

      <Servers asyncapi={asyncapi} />
      <Operations asyncapi={asyncapi} />
    </File>
  );
}
