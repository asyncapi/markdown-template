import { render } from '@asyncapi/generator-react-sdk';

import { Table, TableRow } from '../../components/common';

describe('Table', () => {
  it('should escape pipe operators in cell values', () => {
    const headers = ['Name', 'Type', 'Description', 'Value', 'Constraints', 'Notes'];

    const data = [[
      '(root)',
      'string',
      '-',
      'allowed (`"foo|bar|baz"`)',
      'pattern (`/foo\\|bar/`)',
      '-',
    ]];
    const rowRenderer = (it) => it;

    const expected = `
| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| (root) | string | - | allowed (\`"foo\\|bar\\|baz"\`) | pattern (\`/foo\\\\|bar/\`) | - |
    `;

    const result = render(<Table headers={headers} rowRenderer={rowRenderer} data={data} />);
    expect(result.trim()).toEqual(expected.trim());
  });
});


describe('Table Row', () => {
  it('should escape pipe operators in row values', () => {
    const rowRenderer = () => [
      '(root)',
      'string',
      '-',
      'allowed (`"foo|bar|baz"`)',
      'pattern (`/foo\\|bar/`)',
      '-',
    ];

    const expected = '| (root) | string | - | allowed (`"foo\\|bar\\|baz"`) | pattern (`/foo\\\\|bar/`) | - |';

    const result = render(<TableRow rowRenderer={rowRenderer} />);
    expect(result.trim()).toEqual(expected.trim());
  });
});
