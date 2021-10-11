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
        testChannel: {},
        'smartylighting/streetlights/1/0': {},
      },
    });
    const expected = `
## Table of Contents

* [Servers](#servers)
  * [production](#production-server)
  * [testing](#testing-server)
  * [canary](#canary-server)
* [Channels](#channels)
  * [testChannel](#testchannel-channel)
  * [smartylighting/streetlights/1/0](#smartylightingstreetlights10-channel)
`;

    const result = render(<TableOfContents asyncapi={asyncapi} />);
    expect(result.trim()).toEqual(expected.trim());
  });
});
