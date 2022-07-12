import { render } from '@asyncapi/generator-react-sdk';

import { TableRow } from '../../components/common';

describe('Table Row', () => {
  it('should escape pipe operators in row values', () => {
    const rowRenderer = () => [
      '(root)',
      'string',
      '-',
      'allowed (`"foo|bar"`)',
      'pattern (`/foo|bar/`)',
      '-',
    ];

    const expected = '| (root) | string | - | allowed (`"foo\\|bar"`) | pattern (`/foo\\|bar/`) | - |';

    const result = render(<TableRow rowRenderer={rowRenderer} entry={null} />);
    expect(result.trim()).toEqual(expected.trim());
  });
});
