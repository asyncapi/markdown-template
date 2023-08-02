import { render } from '@asyncapi/generator-react-sdk';
import { BindingsV2, BindingV2 } from '@asyncapi/parser';

import { Bindings } from '../../components/Bindings';

function createBindingsMock(bindings) {
  return {
    bindings() {
      const bindingsModels = Object.entries(bindings || {}).map(([protocol, binding]) => new BindingV2(binding, { protocol }));
      return new BindingsV2(bindingsModels);
    }
  };
}

describe('Bindings component', () => {
  it('should render single binding', () => {
    const bidnings = {
      http: {
        type: 'request',
        method: 'GET',
        query: {
          type: 'object',
          required: [
            'companyId'
          ],
          properties: {
            companyId: {
              type: 'number',
              minimum: 1,
              description: 'The Id of the company.'
            }
          },
          additionalProperties: false
        },
        bindingVersion: '0.1.0'
      }
    };
    const expected = `
#### \`http\` Binding specific information

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| type | - | - | \`"request"\` | - | - |
| method | - | - | \`"GET"\` | - | - |
| query | object | - | - | - | **additional properties are NOT allowed** |
| query.companyId | number | The Id of the company. | - | >= 1 | **required** |
| bindingVersion | - | - | \`"0.1.0"\` | - | - |
`;
    
    const result = render(<Bindings item={createBindingsMock(bidnings)} />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render multiple bindings', () => {
    const bidnings = {
      http: {
        type: 'request',
        method: 'GET',
        query: {
          type: 'object',
          required: [
            'companyId'
          ],
          properties: {
            companyId: {
              type: 'number',
              minimum: 1,
              description: 'The Id of the company.'
            }
          },
          additionalProperties: false
        },
        bindingVersion: '0.1.0'
      },
      kafka: {
        groupId: {
          type: 'string',
          enum: [
            'myGroupId'
          ]
        },
        clientId: {
          type: 'string',
          enum: [
            'myClientId'
          ]
        },
        bindingVersion: '0.1.0'
      }
    };
    const expected = `
#### \`http\` Binding specific information

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| type | - | - | \`"request"\` | - | - |
| method | - | - | \`"GET"\` | - | - |
| query | object | - | - | - | **additional properties are NOT allowed** |
| query.companyId | number | The Id of the company. | - | >= 1 | **required** |
| bindingVersion | - | - | \`"0.1.0"\` | - | - |

#### \`kafka\` Binding specific information

| Name | Type | Description | Value | Constraints | Notes |
|---|---|---|---|---|---|
| groupId | string | - | allowed (\`"myGroupId"\`) | - | - |
| clientId | string | - | allowed (\`"myClientId"\`) | - | - |
| bindingVersion | - | - | \`"0.1.0"\` | - | - |
`;
    
    const result = render(<Bindings item={createBindingsMock(bidnings)} />);
    expect(result.trim()).toEqual(expected.trim());
  });

  it('should render nothing if bindings are not defined', () => {
    const result = render(<Bindings item={createBindingsMock()} />);
    expect(result).toEqual('');
  });

  it('should render nothing if bindings are empty', () => {
    const result = render(<Bindings item={createBindingsMock({})} />);
    expect(result).toEqual('');
  });
});
