import { render } from '@asyncapi/generator-react-sdk';
import { AsyncAPIDocumentV3 as AsyncAPIDocument } from '@asyncapi/parser';

import { TableOfContents } from '../../components/TableOfContents';

describe('TableOfContents component', () => {
  it('should render toc', () => {
    const asyncapi = new AsyncAPIDocument({
      servers: {
        production: {},
        testing: {},
        canary: {},
      },
      channels: {
        testChannel: {
        }
      },
      operations: {
        testOperation: {
          action: 'send',
          channel: '$ref:#testChannel'
        }
      }
    });
    const expected = `
## Table of Contents

* [Servers](#servers)
  * [production](#production-server)
  * [testing](#testing-server)
  * [canary](#canary-server)
* [Operations](#operations)
  * [PUB testOperation](#pub-testOperation)
`;

    const result = render(<TableOfContents asyncapi={asyncapi} />);
    expect(result.trim()).toEqual(expected.trim());
  });
});
