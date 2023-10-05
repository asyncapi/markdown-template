import { Info } from './Info';
import { Servers } from './Servers';
import { Operations } from './Operations';
import { FrontMatter } from './FrontMatter';
import { TableOfContents } from './TableOfContents';

// eslint-disable-next-line no-unused-vars
import { AsyncAPIDocumentInterface } from '@asyncapi/parser';
import { Operationsv3 } from './Operationsv3';

/**
 * @param {{asyncapi: AsyncAPIDocumentInterface, params: any}} param0 
 */
export function Asyncapi({ asyncapi, params }) {
  const isV3 = asyncapi.version().split('.')[0] === '3';
  return (
    <>
      {params.frontMatter && <FrontMatter asyncapi={asyncapi} params={params} />}
      <Info asyncapi={asyncapi} params={params} />
      {params.toc !== 'false' && <TableOfContents asyncapi={asyncapi} />}

      <Servers asyncapi={asyncapi} />
      {
        isV3 ? 
          <Operationsv3 asyncapi={asyncapi} /> : 
          <Operations asyncapi={asyncapi} />
      }
    </>
  );
}
  