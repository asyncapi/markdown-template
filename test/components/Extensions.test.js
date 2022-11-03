import { render } from '@asyncapi/generator-react-sdk';
import { ExtensionsV2, ExtensionV2 } from '@asyncapi/parser';

import { Extensions } from '../../components/Extensions';

function createExtensionsMock(extensions) {
  return {
    extensions() {
      const extensionModels = Object.entries(extensions || {}).map(([id, ext]) => new ExtensionV2(ext, { id }));
      return new ExtensionsV2(extensionModels);
    }
  };
}

describe('Extensions component', () => {
  it('should render extensions', () => {
    const extensions = {
      'x-schema-extensions-as-object': {
        type: 'object',
        properties: {
          prop1: {
            type: 'string'
          },
          prop2: {
            type: 'integer',
            minimum: 0
          }
        }
      },
      'x-schema-extensions-as-primitive': 'dummy',
      'x-schema-extensions-as-array': [
        'item1',
        'item2'
      ]
    };
    const expected = `
#### Extensions

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| x-schema-extensions-as-object | object | - | - | - | **additional properties are allowed** |
| x-schema-extensions-as-object.prop1 | string | - | - | - | - |
| x-schema-extensions-as-object.prop2 | integer | - | - | >= 0 | - |
| x-schema-extensions-as-primitive | - | - | \`"dummy"\` | - | - |
| x-schema-extensions-as-array | - | - | - | - | - |
| x-schema-extensions-as-array.0 (index) | - | - | \`"item1"\` | - | - |
| x-schema-extensions-as-array.1 (index) | - | - | \`"item2"\` | - | - |
`;
    
    const result = render(<Extensions item={createExtensionsMock(extensions)} />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render nothing if extensions are not defined', () => {
    const result = render(<Extensions item={createExtensionsMock()} />);
    expect(result).toEqual('');
  });

  it('should render nothing if extensions are empty', () => {
    const result = render(<Extensions item={createExtensionsMock({})} />);
    expect(result).toEqual('');
  });
});
