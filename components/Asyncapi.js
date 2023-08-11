
import { Info } from './Info';
import { Servers } from './Servers';
import { Operations } from './Operations';
import { FrontMatter } from './FrontMatter';
import { TableOfContents } from './TableOfContents';

// eslint-disable-next-line no-unused-vars
import { AsyncAPIDocumentInterface } from '@asyncapi/parser';

/**
 * @param {{asyncapi: AsyncAPIDocumentInterface, params: any}} param0 
 */
export function Asyncapi({ asyncapi, params }) {
  return (
    <>
      {params.frontMatter && <FrontMatter asyncapi={asyncapi} params={params} />}
      <Info asyncapi={asyncapi} params={params} />
      {params.toc !== 'false' && <TableOfContents asyncapi={asyncapi} />}

      <Servers asyncapi={asyncapi} />
      <Operations asyncapi={asyncapi} />
    </>
  );
}
  