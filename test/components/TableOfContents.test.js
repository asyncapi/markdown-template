import { render } from '@asyncapi/generator-react-sdk';

import { TableOfContents } from "../../components/TableOfContents";
import AsyncAPIDocument from '@asyncapi/parser/lib/models/asyncapi';

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
          publish: {},
          subscribe: {},
        },
        'smartylighting/streetlights/1/0': {
          subscribe: {},
        },
        'smartylighting/streetlights': {
          publish: {},
        },
      },
    });
    const expected = `
## Table of Contents

* [Servers](#servers)
  * [production](#production-server)
  * [testing](#testing-server)
  * [canary](#canary-server)
* [Operations](#operations)
  * [PUB testChannel](#pub-testchannel-operation)
  * [SUB testChannel](#sub-testchannel-operation)
  * [SUB smartylighting/streetlights/1/0](#sub-smartylightingstreetlights10-operation)
  * [PUB smartylighting/streetlights](#pub-smartylightingstreetlights-operation)
`;

    const result = render(<TableOfContents asyncapi={asyncapi} />);
    expect(result.trim()).toEqual(expected.trim());
  });
});
